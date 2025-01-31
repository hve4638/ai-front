import { MemStorage, StorageAccess } from '@hve/fs-storage';
import RequestTemplateControl from './RequestTemplateControl';

describe('Profile', () => {
    let storage:MemStorage;
    let rtControl:RequestTemplateControl;
    const nodes:RTMetadata[] = [];

    beforeAll(()=>{
        for (let i=0; i<10; i++) {
            nodes.push({
                type: 'node',
                name: `node${i}`,
                id: `node${i}`,
            });
        };
    });

    beforeEach(()=>{
        storage = new MemStorage();
        storage.register({
            'request-template' : {
                'index.json' : StorageAccess.JSON,
                '*' : {
                    'index.json' : StorageAccess.JSON,
                    '*' : StorageAccess.TEXT|StorageAccess.JSON
                }
            },
        })
        rtControl = new RequestTemplateControl(storage);
    })

    test('getTree', () => {
        const expected = [];
        const actual = rtControl.getTree();
        
        expect(actual).toEqual(expected);
    });

    test('addRT', () => {
        rtControl.addRT(nodes[0]);
        
        {
            const expected = [ nodes[0] ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }

        rtControl.addRT(nodes[1]);
        {
            const expected = [ nodes[0], nodes[1] ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });

    test('removeRT', () => {
        rtControl.addRT(nodes[0]);
        rtControl.addRT(nodes[1]);
        rtControl.addRT(nodes[2]);
        {
            const expected = [ nodes[0], nodes[1], nodes[2] ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }

        rtControl.removeRT(nodes[1].id);
        {
            const expected = [ nodes[0], nodes[2] ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });

    test('updateTree', () => {
        rtControl.addRT(nodes[0]);
        rtControl.addRT(nodes[1]);
        rtControl.addRT(nodes[2]);
        {
            const expected = [ nodes[0], nodes[1], nodes[2] ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }

        rtControl.updateTree([ nodes[2], nodes[0], nodes[1] ]);
        {
            const expected = [ nodes[2], nodes[0], nodes[1] ];
            const actual = rtControl.getTree();

            expect(actual).toEqual(expected);
        }
    });

    test('updateTree : directory 1', () => {
        rtControl.addRT(nodes[0]);
        rtControl.addRT(nodes[1]);
        rtControl.addRT(nodes[2]);
        {
            const expected = [ nodes[0], nodes[1], nodes[2] ];
            const actual = rtControl.getTree();

            expect(actual).toEqual(expected);
        }
        const changed:RTMetadataTree = [
            nodes[2],
            {
                type: 'directory',
                name: 'dir1',
                children: [ nodes[0], nodes[1] ],
            },
        ];
        rtControl.updateTree(changed);
        {
            const expected = [...changed];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });
    
    test('updateTree : directory 2', () => {
        const emptyDir:RTDirectory = {
            type: 'directory',
            name: 'dir1',
            children: [],
        };
        rtControl.addRT(nodes[0]);
        
        {
            const expected:RTMetadataTree = [
                nodes[0],
                emptyDir,
            ]
            rtControl.updateTree(expected);

            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
        {
            const expected:RTMetadataTree = [
                emptyDir,
                nodes[0],
            ]
            rtControl.updateTree(expected);
            
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });

    // 디렉토리에서 마지막 프롬프트를 삭제한 경우에도 디렉토리는 보존됨
    test('removeTree : directory', () => {
        rtControl.addRT(nodes[0]);
        rtControl.addRT(nodes[1]);
        
        const changed:RTMetadataTree = [
            nodes[0], 
            {
                type: 'directory',
                name: 'dir1',
                children: [ nodes[1] ],
            },
        ];
        rtControl.updateTree(changed);
        {
            const expected = [...changed];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
        
        rtControl.removeRT(nodes[1].id);
        {
            const expected = [
                nodes[0], 
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

    test('hasId', () => {
        const expectTrue = (...indexes:number[]) => {
            for (const i of indexes) {
                expect(rtControl.hasId(nodes[i].id)).toBe(true);
            }
        }
        const expectFalse = (...indexes:number[]) => {
            for (const i of indexes) {
                expect(rtControl.hasId(nodes[i].id)).toBe(false);
            }
        }

        expectFalse(0, 1, 2);

        rtControl.addRT(nodes[0]);
        rtControl.addRT(nodes[1]);
        expectTrue(0, 1);
        expectFalse(2);

        rtControl.addRT(nodes[2]);
        expectTrue(0, 1, 2);
        
        rtControl.removeRT(nodes[2].id);
        expectTrue(0, 1);
        expectFalse(2);

        rtControl.removeRT(nodes[0].id);
        expectTrue(1);
        expectFalse(0, 2);

        rtControl.removeRT(nodes[1].id);
        expectFalse(0, 1, 2);
    });

    test('generateId', () => {
        const ids = new Set<string>();

        for (let i=0; i<1000; i++) {
            const id = rtControl.generateId();
            expect(ids.has(id)).toBe(false);
            ids.add(id);
        }
    });

    test('moveId', () => {
        const expectTrue = (...indexes:number[]) => {
            for (const i of indexes) {
                expect([
                    i, rtControl.hasId(nodes[i].id)
                ]).toEqual([
                    i, true
                ]);
            }
        }
        const expectFalse = (...indexes:number[]) => {
            for (const i of indexes) {
                expect([
                    i, rtControl.hasId(nodes[i].id)
                ]).toEqual([
                    i, false
                ]);
            }
        }

        rtControl.addRT({...nodes[0]});
        rtControl.addRT({...nodes[1]});
        rtControl.addRT({...nodes[2]});
        expectTrue(0, 1, 2);
        expectFalse(3, 4, 5);

        rtControl.changeId(nodes[0].id, nodes[3].id);
        expectTrue(1, 2, 3);
        expectFalse(0, 4, 5);
    });
});