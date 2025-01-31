import { RTNode, RTNodeDirectory, RTNodeTree } from 'types/rt-node';

type RTNodeOptions = Omit<RTNode, 'type'|'id'|'name'>;

export function mapRTMetadataToNode(
    metadataTree:RTMetadataTree,
    mapOption:(mt:RTMetadata)=>RTNodeOptions = (mt)=>({}),
) {
    const mapNode = (item:RTNode) => {
        return {
            type : 'node',
            name : item.name,
            id : item.id,
            ...mapOption(item),
        } as RTMetadata;
    }

    const rtTree:RTNodeTree = metadataTree.map((item:RTMetadata|RTDirectory)=>{
        if (item.type === 'directory') {
            return {
                type : 'directory',
                name : item.name,
                children : item.children.map((child)=>mapNode(child)),
            };
        }
        else {
            return mapNode(item);
        }
    });
    return rtTree;
}

export function mapRTNodeToMetadata(
    metadataTree:RTNodeTree
) {
    const mapNode = (item:RTNode) => {
        return {
            type : 'node',
            name : item.name,
            id : item.id,
        } as RTMetadata;
    }

    const tree:RTMetadataTree = metadataTree.map(
        (item:RTNode|RTNodeDirectory)=>{
            if (item.type === 'directory') {
                return {
                    type : 'directory',
                    name : item.name,
                    children : item.children.map((child)=>mapNode(child)),
                };
            }
            else {
                return mapNode(item);
            }
        }
    );
    return tree;
}