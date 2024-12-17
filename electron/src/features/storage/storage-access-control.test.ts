import StorageAccessControl, { StorageAccess } from './StorageAccessControl';
import { StorageAccessError, StorageError } from './errors';

describe('StorageAccessControl Test', () => {
    test('register', () => {
        const accesses:any[] = [];
        const ac = new StorageAccessControl({
            onRegister: (access) => {
                accesses.push(access.identifier);
            },
        });

        ac.register('config', 'config.json', StorageAccess.JSON);
        expect(accesses).toEqual([ 'config', ]);
        
        ac.register('data', 'data.json', StorageAccess.JSON);
        expect(accesses).toEqual([ 'config', 'data' ]);

        expect(()=>ac.register('config', 'config.json', StorageAccess.JSON)).toThrow(StorageAccessError);
    });

    test('registerDir', () => {
        const accesses:any[] = [];
        const ac = new StorageAccessControl({
            onRegisterDir: (access) => {
                accesses.push(access.identifier);
            },
        });

        ac.registerDir('base', 'base', StorageAccess.ANY);
        expect(accesses).toEqual([ 'base', ]);

        ac.registerDir('cache', 'cache', StorageAccess.ANY);
        expect(accesses).toEqual([ 'base', 'cache' ]);
    });

    test('access file', ()=>{
        const ac = new StorageAccessControl({
            onAccess: (access) => {
                return access.actualPath;
            },
        });

        ac.register('config', 'config.json', StorageAccess.JSON);
        ac.register('data', 'data.json', StorageAccess.JSON);

        expect(ac.access('config', StorageAccess.JSON)).toEqual('config.json');
        expect(ac.access('data', StorageAccess.JSON)).toEqual('data.json');

        expect(()=>ac.access('config', StorageAccess.TEXT)).toThrow(StorageAccessError);
        expect(()=>ac.access('data', StorageAccess.TEXT)).toThrow(StorageAccessError);
    });

    test('access dir', ()=>{
        const ac = new StorageAccessControl({
            onAccess: (access) => {
                return access.actualPath;
            },
        });

        // 디렉토리는 하위 파일에 대한 엑세스 타입을 비트마스크로 지정
        ac.registerDir('base', 'base', StorageAccess.JSON|StorageAccess.TEXT);

        // 디렉토리 등록시 하위 파일에 대한 접근 허용
        expect(ac.access('base:config.json', StorageAccess.JSON)).toEqual('base\\config.json');
        expect(ac.access('base:text.txt', StorageAccess.TEXT)).toEqual('base\\text.txt');

        // 디렉토리의 허용 타입이 아닌 경우
        expect(()=>ac.access('base:data.bin', StorageAccess.BINARY)).toThrow(StorageAccessError);
        
        // 이미 접근한 스토리지와 다른 타입으로 접근하는 경우
        expect(()=>ac.access('base:config.json', StorageAccess.TEXT)).toThrow(StorageAccessError);
    });

    // @TODO: onDelete, onDeleteDir 테스트 추가
});