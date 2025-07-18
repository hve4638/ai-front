import { RTNode, RTNodeDirectory, RTNodeTree } from 'types/rt-node';

type RTNodeOptions = Omit<RTNode, 'type'|'id'|'name'>;

type mapRTMetadataTreeOptions<TNode, TDirectory> = {
    mapDirectory : (item:RTMetadataDirectory, children:TNode[])=>TDirectory;
    mapNode : (item:RTMetadataNode)=>TNode;
}

export function mapRTMetadataTree<TNode, TDirectory>(
    items:RTMetadataTree,
    options:mapRTMetadataTreeOptions<TNode, TDirectory>
) {
    return items.map((item:RTMetadataNode|RTMetadataDirectory)=>{
        if (item.type === 'directory') {
            return options.mapDirectory(item, mapRTMetadataTree(item.children, options));
        }
        else {
            return options.mapNode(item);
        }
    });
}

export function mapRTMetadataToNode(
    metadataTree:RTMetadataTree,
    mapOption:(mt:RTMetadataNode)=>RTNodeOptions = (mt)=>({}),
) {
    const mapNode = (item:RTNode) => {
        return {
            type : 'node',
            name : item.name,
            id : item.id,
            ...mapOption(item),
        } as RTMetadataNode;
    }

    const rtTree:RTNodeTree = metadataTree.map((item:RTMetadataNode|RTMetadataDirectory)=>{
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
        } as RTMetadataNode;
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