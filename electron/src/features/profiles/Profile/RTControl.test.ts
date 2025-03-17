import { JSONType, MemACStorage, StorageAccess } from 'ac-storage';
import RequestTemplateControl from './RTControl';
import { PROFILE_STORAGE_TREE } from './data';

describe('Profile', () => {
    let storage:MemACStorage;
    let rtControl:RequestTemplateControl;
    const Nodes:RTMetadataNode[] = [];
    const Metadata:RTMetadata[] = [];

    beforeAll(()=>{
        for (let i=0; i<10; i++) {
            Nodes.push({
                name: `node${i}`,
                id: `node${i}`,
                type : `node`,
            });
            Metadata.push({
                name: `node${i}`,
                id: `node${i}`,
                mode : 'prompt_only',
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
        rtControl.addRT(Metadata[0]);
        {
            const expected = [ Nodes[0] ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }

        rtControl.addRT(Metadata[1]);
        {
            const expected = [ Nodes[0], Nodes[1] ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });

    test('removeRT()', () => {
        rtControl.addRT(Metadata[0]);
        rtControl.addRT(Metadata[1]);
        rtControl.addRT(Metadata[2]);
        {
            const expected = [ Nodes[0], Nodes[1], Nodes[2] ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }

        rtControl.removeRT(Nodes[1].id);
        {
            const expected = [ Nodes[0], Nodes[2] ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });

    test('updateTree()', () => {
        rtControl.addRT(Metadata[0]);
        rtControl.addRT(Metadata[1]);
        rtControl.addRT(Metadata[2]);
        {
            const expected = [ Nodes[0], Nodes[1], Nodes[2] ];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }

        rtControl.updateTree([ Nodes[2], Nodes[0], Nodes[1] ]);
        {
            const expected = [ Nodes[2], Nodes[0], Nodes[1] ];
            const actual = rtControl.getTree();

            expect(actual).toEqual(expected);
        }
    });

    test('updateTree() : 디렉토리 추가', () => {
        rtControl.addRT(Metadata[0]);
        rtControl.addRT(Metadata[1]);
        rtControl.addRT(Metadata[2]);
        {
            const expected = [ Nodes[0], Nodes[1], Nodes[2] ];
            const actual = rtControl.getTree();

            expect(actual).toEqual(expected);
        }
        const changed:RTMetadataTree = [
            Nodes[2],
            {
                type: 'directory',
                name: 'dir1',
                children: [ Nodes[0], Nodes[1] ],
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
        rtControl.addRT(Metadata[0]);
        
        {
            const expected:RTMetadataTree = [
                Nodes[0],
                emptyDir,
            ]
            rtControl.updateTree(expected);

            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
        {
            const expected:RTMetadataTree = [
                emptyDir,
                Nodes[0],
            ]
            rtControl.updateTree(expected);
            
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });

    test('removeTree() : RT 삭제 후 빈 디렉토리 허용', () => {
        rtControl.addRT(Metadata[0]);
        rtControl.addRT(Metadata[1]);
        
        const changed:RTMetadataTree = [
            Nodes[0], 
            {
                type: 'directory',
                name: 'dir1',
                children: [ Nodes[1] ],
            },
        ];
        rtControl.updateTree(changed);
        {
            const expected = [...changed];
            const actual = rtControl.getTree();
            expect(actual).toEqual(expected);
        }
        
        rtControl.removeRT(Nodes[1].id);
        {
            const expected = [
                Nodes[0], 
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
                expect(rtControl.hasId(Nodes[i].id)).toBe(true);
            }
        }
        const expectFalse = (...indexes:number[]) => {
            for (const i of indexes) {
                expect(rtControl.hasId(Nodes[i].id)).toBe(false);
            }
        }

        expectFalse(0, 1, 2);

        rtControl.addRT(Metadata[0]);
        rtControl.addRT(Metadata[1]);
        expectTrue(0, 1);
        expectFalse(2);

        rtControl.addRT(Metadata[2]);
        expectTrue(0, 1, 2);
        
        rtControl.removeRT(Nodes[2].id);
        expectTrue(0, 1);
        expectFalse(2);

        rtControl.removeRT(Nodes[0].id);
        expectTrue(1);
        expectFalse(0, 2);

        rtControl.removeRT(Nodes[1].id);
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
            const expected = indexes.map((i)=>rtControl.hasId(Nodes[i].id))

            expect(expected).toEqual(indexes.map(()=>true));
        }
        const expectFalse = (...indexes:number[]) => {
            for (const i of indexes) {
                expect([
                    i, rtControl.hasId(Nodes[i].id)
                ]).toEqual([
                    i, false
                ]);
            }
        }

        rtControl.addRT({...Metadata[0]});
        rtControl.addRT({...Metadata[1]});
        rtControl.addRT({...Metadata[2]});
        expectTrue(0, 1, 2);
        expectFalse(3, 4, 5);

        rtControl.changeId(Nodes[0].id, Nodes[3].id);
        expectTrue(1, 2, 3);
        expectFalse(0, 4, 5);
    });
});