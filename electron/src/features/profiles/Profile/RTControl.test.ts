import { JSONType, MemACStorage, StorageAccess } from 'ac-storage';
import RequestTemplateControl from './RTControl';
import { PROFILE_STORAGE_TREE } from './data';

describe('Profile', () => {
    let storage:MemACStorage;
    let rtControl:RequestTemplateControl;
    const NODES:RTMetadata[] = [];

    beforeAll(()=>{
        for (let i=0; i<10; i++) {
            NODES.push({
                type: 'node',
                name: `node${i}`,
                id: `node${i}`,
            });
        };
    });

    beforeEach(()=>{
        storage = new MemACStorage();
        storage.register(PROFILE_STORAGE_TREE);
        rtControl = new RequestTemplateControl(storage.subStorage('request-template'));
    })

    test('getTree()', () => {
        const expected = [];
        const actual = rtControl.getTree();
        
        expect(actual).toEqual(expected);
    });

    test('addRT()', () => {
        rtControl.addRT(NODES[0]);
        {
            const expected = [ NODES[0] ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }

        rtControl.addRT(NODES[1]);
        {
            const expected = [ NODES[0], NODES[1] ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });

    test('removeRT()', () => {
        rtControl.addRT(NODES[0]);
        rtControl.addRT(NODES[1]);
        rtControl.addRT(NODES[2]);
        {
            const expected = [ NODES[0], NODES[1], NODES[2] ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }

        rtControl.removeRT(NODES[1].id);
        {
            const expected = [ NODES[0], NODES[2] ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });

    test('updateTree()', () => {
        rtControl.addRT(NODES[0]);
        rtControl.addRT(NODES[1]);
        rtControl.addRT(NODES[2]);
        {
            const expected = [ NODES[0], NODES[1], NODES[2] ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }

        rtControl.updateTree([ NODES[2], NODES[0], NODES[1] ]);
        {
            const expected = [ NODES[2], NODES[0], NODES[1] ];
            const actual = rtControl.getTree();

            expect(actual).toEqual(expected);
        }
    });

    test('updateTree() : 디렉토리 추가', () => {
        rtControl.addRT(NODES[0]);
        rtControl.addRT(NODES[1]);
        rtControl.addRT(NODES[2]);
        {
            const expected = [ NODES[0], NODES[1], NODES[2] ];
            const actual = rtControl.getTree();

            expect(actual).toEqual(expected);
        }
        const changed:RTMetadataTree = [
            NODES[2],
            {
                type: 'directory',
                name: 'dir1',
                children: [ NODES[0], NODES[1] ],
            },
        ];
        rtControl.updateTree(changed);
        {
            const expected = [...changed];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });
    
    test('updateTree() : 빈 디렉토리 추가 허용', () => {
        const emptyDir:RTMetadataDirectory = {
            type: 'directory',
            name: 'dir1',
            children: [],
        };
        rtControl.addRT(NODES[0]);
        
        {
            const expected:RTMetadataTree = [
                NODES[0],
                emptyDir,
            ]
            rtControl.updateTree(expected);

            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
        {
            const expected:RTMetadataTree = [
                emptyDir,
                NODES[0],
            ]
            rtControl.updateTree(expected);
            
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });

    test('removeTree() : RT 삭제 후 빈 디렉토리 허용', () => {
        rtControl.addRT(NODES[0]);
        rtControl.addRT(NODES[1]);
        
        const changed:RTMetadataTree = [
            NODES[0], 
            {
                type: 'directory',
                name: 'dir1',
                children: [ NODES[1] ],
            },
        ];
        rtControl.updateTree(changed);
        {
            const expected = [...changed];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
        
        rtControl.removeRT(NODES[1].id);
        {
            const expected = [
                NODES[0], 
                {
                    type: 'directory',
                    name: 'dir1',
                    children: [],
                },
        ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });

    test('hasId()', () => {
        const expectTrue = (...indexes:number[]) => {
            for (const i of indexes) {
                expect(rtControl.hasId(NODES[i].id)).toBe(true);
            }
        }
        const expectFalse = (...indexes:number[]) => {
            for (const i of indexes) {
                expect(rtControl.hasId(NODES[i].id)).toBe(false);
            }
        }

        expectFalse(0, 1, 2);

        rtControl.addRT(NODES[0]);
        rtControl.addRT(NODES[1]);
        expectTrue(0, 1);
        expectFalse(2);

        rtControl.addRT(NODES[2]);
        expectTrue(0, 1, 2);
        
        rtControl.removeRT(NODES[2].id);
        expectTrue(0, 1);
        expectFalse(2);

        rtControl.removeRT(NODES[0].id);
        expectTrue(1);
        expectFalse(0, 2);

        rtControl.removeRT(NODES[1].id);
        expectFalse(0, 1, 2);
    });

    test('generateId()', () => {
        const ids = new Set<string>();

        for (let i=0; i<1000; i++) {
            const id = rtControl.generateId();
            expect(ids.has(id)).toBe(false);
            ids.add(id);
        }
    });

    test('changeId()', () => {
        const expectTrue = (...indexes:number[]) => {
            const expected = indexes.map((i)=>rtControl.hasId(NODES[i].id))

            expect(expected).toEqual(indexes.map(()=>true));
        }
        const expectFalse = (...indexes:number[]) => {
            for (const i of indexes) {
                expect([
                    i, rtControl.hasId(NODES[i].id)
                ]).toEqual([
                    i, false
                ]);
            }
        }

        rtControl.addRT({...NODES[0]});
        rtControl.addRT({...NODES[1]});
        rtControl.addRT({...NODES[2]});
        expectTrue(0, 1, 2);
        expectFalse(3, 4, 5);

        rtControl.changeId(NODES[0].id, NODES[3].id);
        expectTrue(1, 2, 3);
        expectFalse(0, 4, 5);
    });
});