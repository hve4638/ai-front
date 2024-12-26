import StorageAccessControl, { StorageAccess, StorageAccessError } from '../access-control';
import { AccessDeniedError, DirectoryAccessError, NotRegisterError } from '../access-control/errors';

describe('StorageAccessControl Test', () => {
    test('access', () => {
        const accesses:string[] = [];
        const ac = new StorageAccessControl({
            onAccess: (identifier, accessType) => {
                accesses.push(identifier);
                return {} as any;
            },
            onAccessDir: (identifier) => {
                accesses.push(identifier);
            },
            onRelease: (identifier) => {},
            onReleaseDir: (identifier) => {},
        });

        ac.register({
            'config.json' : StorageAccess.JSON,
            'data.txt' : StorageAccess.TEXT,
        })
        
        ac.access('config.json', StorageAccess.JSON);
        expect(accesses).toEqual([ 'config.json', ]);
        
        accesses.length = 0;
        ac.access('data.txt', StorageAccess.TEXT);
        expect(accesses).toEqual([ 'data.txt' ]);

        
        // 등록되지 않은 파일
        expect(()=>ac.access('cache.json', StorageAccess.TEXT)).toThrow(NotRegisterError);

        // 잘못된 접근 타입
        expect(()=>ac.access('config.json', StorageAccess.TEXT)).toThrow(AccessDeniedError);
    });

    test('access dir', ()=>{
        const accesses:string[] = [];
        const accessesDir:string[] = [];
        const ac = new StorageAccessControl({
            onAccess: (identifier, accessType) => {
                accesses.push(identifier);
                return {} as any;
            },
            onAccessDir: (identifier) => {
                accessesDir.push(identifier);
            },
            onRelease: (identifier) => {},
            onReleaseDir: (identifier) => {},
        });

        ac.register({
            'base' : {
                'config.json' : StorageAccess.JSON,
            },
            'layer1' : {
                'layer2' : {
                    'data.txt' : StorageAccess.TEXT,
                }
            }
        })
        
        ac.access('base:config.json', StorageAccess.JSON);
        expect(accesses).toEqual([ 'base:config.json' ]);
        expect(accessesDir).toEqual([ 'base' ]);
        
        accesses.length = 0;
        accessesDir.length = 0;
        ac.access('layer1:layer2:data.txt', StorageAccess.TEXT);
        expect(accesses).toEqual([ 'layer1:layer2:data.txt' ]);
        expect(accessesDir).toEqual([ 'layer1', 'layer1:layer2' ]);

        expect(()=>ac.access('base', StorageAccess.TEXT)).toThrow(DirectoryAccessError);
        expect(()=>ac.access('layer1', StorageAccess.TEXT)).toThrow(DirectoryAccessError);
        expect(()=>ac.access('layer1:layer2', StorageAccess.TEXT)).toThrow(DirectoryAccessError);
    });
});