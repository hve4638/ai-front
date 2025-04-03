import { MemACStorage, StorageAccess } from 'ac-storage';
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

    test('getTree()', async () => {
        const expected = [];
        const actual = await rtControl.getTree();
        
        expect(actual).toEqual(expected);
    });

    test('addRT()', async () => {
        await rtControl.addRT(Metadata[0]);
        {
            const expected = [ Nodes[0] ];
            const actual = await rtControl.getTree();
            expect(actual).toEqual(expected);
        }

        await rtControl.addRT(Metadata[1]);
        {
            const expected = [ Nodes[0], Nodes[1] ];
            const actual = await rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });

    test('removeRT()', async () => {
        await rtControl.addRT(Metadata[0]);
        await rtControl.addRT(Metadata[1]);
        await rtControl.addRT(Metadata[2]);
        {
            const expected = [ Nodes[0], Nodes[1], Nodes[2] ];
            const actual = await rtControl.getTree();
            expect(actual).toEqual(expected);
        }

        await rtControl.removeRT(Nodes[1].id);
        {
            const expected = [ Nodes[0], Nodes[2] ];
            const actual = await rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });

    test('updateTree()', async () => {
        await rtControl.addRT(Metadata[0]);
        await rtControl.addRT(Metadata[1]);
        await rtControl.addRT(Metadata[2]);
        {
            const expected = [ Nodes[0], Nodes[1], Nodes[2] ];
            const actual = await rtControl.getTree();
            expect(actual).toEqual(expected);
        }

        await rtControl.updateTree([ Nodes[2], Nodes[0], Nodes[1] ]);
        {
            const expected = [ Nodes[2], Nodes[0], Nodes[1] ];
            const actual = await rtControl.getTree();

            expect(actual).toEqual(expected);
        }
    });

    test('updateTree() : 디렉토리 추가', async () => {
        await rtControl.addRT(Metadata[0]);
        await rtControl.addRT(Metadata[1]);
        await rtControl.addRT(Metadata[2]);
        {
            const expected = [ Nodes[0], Nodes[1], Nodes[2] ];
            const actual = await rtControl.getTree();

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
        await rtControl.updateTree(changed);
        {
            const expected = [...changed];
            const actual = await rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });
    
    test('updateTree() : 빈 디렉토리 추가 허용', async () => {
        const emptyDir:RTMetadataDirectory = {
            type: 'directory',
            name: 'dir1',
            children: [],
        };
        await rtControl.addRT(Metadata[0]);
        
        {
            const expected:RTMetadataTree = [
                Nodes[0],
                emptyDir,
            ]
            await rtControl.updateTree(expected);

            const actual = await rtControl.getTree();
            expect(actual).toEqual(expected);
        }
        {
            const expected:RTMetadataTree = [
                emptyDir,
                Nodes[0],
            ]
            await rtControl.updateTree(expected);
            
            const actual = await rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });

    test('removeTree() : RT 삭제 후 빈 디렉토리 허용', async () => {
        await rtControl.addRT(Metadata[0]);
        await rtControl.addRT(Metadata[1]);
        
        const changed:RTMetadataTree = [
            Nodes[0], 
            {
                type: 'directory',
                name: 'dir1',
                children: [ Nodes[1] ],
            },
        ];
        await rtControl.updateTree(changed);
        {
            const expected = [...changed];
            const actual = await rtControl.getTree();
            expect(actual).toEqual(expected);
        }
        
        await rtControl.removeRT(Nodes[1].id);
        {
            const expected = [
                Nodes[0], 
                {
                    type: 'directory',
                    name: 'dir1',
                    children: [],
                },
        ];
            const actual = await rtControl.getTree();
            expect(actual).toEqual(expected);
        }
    });

    test('hasId()', async () => {
        const expectTrue = async (...indexes:number[]) => {
            for (const i of indexes) {
                expect(await rtControl.hasId(Nodes[i].id)).toBe(true);
            }
        }
        const expectFalse = async (...indexes:number[]) => {
            for (const i of indexes) {
                expect(await rtControl.hasId(Nodes[i].id)).toBe(false);
            }
        }

        await expectFalse(0, 1, 2);

        await rtControl.addRT(Metadata[0]);
        await rtControl.addRT(Metadata[1]);
        await expectTrue(0, 1);
        await expectFalse(2);

        await rtControl.addRT(Metadata[2]);
        await expectTrue(0, 1, 2);
        
        await rtControl.removeRT(Nodes[2].id);
        await expectTrue(0, 1);
        await expectFalse(2);

        await rtControl.removeRT(Nodes[0].id);
        await expectTrue(1);
        await expectFalse(0, 2);

        await rtControl.removeRT(Nodes[1].id);
        await expectFalse(0, 1, 2);
    });

    test('generateId()', async () => {
        const ids = new Set<string>();

        for (let i=0; i<1000; i++) {
            const id = await rtControl.generateId();
            expect(ids.has(id)).toBe(false);
            ids.add(id);
        }
    });

    test('changeId()', async () => {
        const expectTrue = async (...indexes:number[]) => {
            const expected = await Promise.all(indexes.map(async (i)=>await rtControl.hasId(Nodes[i].id)))

            expect(expected).toEqual(indexes.map(()=>true));
        }
        const expectFalse = async (...indexes:number[]) => {
            for (const i of indexes) {
                expect([
                    i, await rtControl.hasId(Nodes[i].id)
                ]).toEqual([
                    i, false
                ]);
            }
        }

        await rtControl.addRT({...Metadata[0]});
        await rtControl.addRT({...Metadata[1]});
        await rtControl.addRT({...Metadata[2]});
        await expectTrue(0, 1, 2);
        await expectFalse(3, 4, 5);

        await rtControl.changeId(Nodes[0].id, Nodes[3].id);
        await expectTrue(1, 2, 3);
        await expectFalse(0, 4, 5);
    });
});