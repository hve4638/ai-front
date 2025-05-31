import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import styles from './styles.module.scss';

import { TreeDirectory, TreeNode } from './TreeNode';
import { relocateTree } from './utils';
import { Tree, TreeDirectoryData, TreeNodeData, TreeOffsets, } from './types';
import { Regions } from './TreeNode/types';
import type { RTNodeTree, RTNode, RTNodeDirectory } from 'types/rt-node'

type PromptTreeModalProps = {
    className?: string;
    style?: React.CSSProperties;
    tree:RTNodeTree;
    onChange?: (item:RTNodeTree) => void;
    onClick?: (rtId:string) => void;
    onDoubleClick?: (rtId:string) => void;
    
    editable?: boolean;
    deletable?: boolean;
    relocatable?: boolean;
    hideBackground ?: boolean;
}

function RTTreeModal({
    className='',
    style={},
    tree,
    onClick=()=>{},
    onDoubleClick=()=>{},   
    onChange=()=>{},
    relocatable=false,
    editable=false,
    deletable=false,
    hideBackground=false,
}:PromptTreeModalProps) {
    // 드래그 인디케이터 위치지정
    const [dragIndicatorPosition, setDragIndicatorPosition] = useState({ x: 0, y: 0 });
    const [draggingNode, setDraggingNode] = useState<{
        node : TreeNodeData;
        offsets : TreeOffsets;
    }|null>(null);
    const [hoveredNode, setHoveredNode] = useState<{
        node : TreeNodeData|TreeDirectoryData;
        offsets : TreeOffsets;
        region : Regions;
    }|null>(null);    

    const makeNode = (node:any, offsets:number[]=[]) => {
        const key = offsets.join('_') + '_' + node.name;
        if (node.type === 'directory') {
            return (
                <TreeDirectory
                    name={node.name}
                    key={key}
                    edited={node.edited ?? false}
                    added={node.added ?? false}
                    mouseRegionCount={
                        !relocatable
                        ? 1
                        :
                        (
                            draggingNode
                            ? 3
                            : 0
                        )
                    }
                    onRegionMouseEnter={(e, region) => {
                        if (!relocatable) return;
                        setHoveredNode({
                            node : node,
                            offsets : offsets as TreeOffsets,
                            region : region,
                        });
                    }}
                    onRegionMouseLeave={(e, region) => {
                        if (!relocatable) return;
                        setHoveredNode(prev=>{
                            if (prev &&
                                prev.node === node &&
                                prev.region === region
                            ) {
                                return null;
                            }
                            else {
                                return prev;
                            }
                        });
                    }}
                >
                {
                    node.children.map(
                        (child:any, index:number) => makeNode(child, [...offsets, index])
                    )
                }
                </TreeDirectory>
            );
        }
        else {
            return (
                <TreeNode
                    name={node.name}
                    key={key}
                    edited={node.edited ?? false}
                    added={node.added ?? false}
                    mouseRegionCount={
                        !relocatable
                        ? 1
                        :
                        (
                            !draggingNode
                            ? 1
                            : (
                                draggingNode.node === node
                                ? 1
                                : 2
                            )
                        )
                    }
                    onRegionMouseEnter={(e, region) => {
                        if (!relocatable) return;
                        setHoveredNode({
                            node : node,
                            offsets : offsets as TreeOffsets,
                            region : region,
                        });
                    }}
                    onRegionMouseLeave={(e, region) => {
                        if (!relocatable) return;
                        setHoveredNode(prev=>{
                            if (prev &&
                                prev.node === node &&
                                prev.region === region
                            ) {
                                return null;
                            }
                            else {
                                return prev;
                            }
                        });
                    }}
                    onDragBegin={() => {
                        if (!relocatable) return;
                        setDraggingNode({
                            node : node,
                            offsets : offsets as TreeOffsets,
                        });
                    }}
                    onClick={() => {
                        onClick(node.id);
                    }}
                    onDoubleClick={() => {
                        onDoubleClick(node.id);
                    }}
                ></TreeNode>
            );
        }
    }

    // 드래그 해제
    useEffect(()=>{
        const handleMouseUp = () => {
            if (draggingNode) {
                if (!hoveredNode) {
                    // nothing to do
                }
                else if (hoveredNode.node.type === 'directory') {
                    if (hoveredNode.region === Regions.Top) {
                        const offsets:TreeOffsets = [...hoveredNode.offsets];
                        offsets[offsets.length - 1] -= 1;

                        onChange(relocateTree(tree, draggingNode.offsets, offsets));
                    }
                    else if (hoveredNode.region === Regions.Bottom) {
                        const offsets:TreeOffsets = [...hoveredNode.offsets];
                        offsets[offsets.length - 1] += 1;

                        onChange(relocateTree(tree, draggingNode.offsets, offsets));
                    }
                    else if (hoveredNode.region === Regions.Center) {
                        const offsets:TreeOffsets = [...hoveredNode.offsets];
                        offsets.push(hoveredNode.node.children.length);

                        onChange(relocateTree(tree, draggingNode.offsets, offsets));
                    }
                }
                else {
                    if (hoveredNode.region === Regions.Top) {
                        onChange(relocateTree(tree, draggingNode.offsets, hoveredNode.offsets));
                    }
                    else if (hoveredNode.region === Regions.Bottom) {
                        const offsets:TreeOffsets = [...hoveredNode.offsets];
                        offsets[offsets.length - 1] += 1;

                        onChange(relocateTree(tree, draggingNode.offsets, offsets));
                    }
                }

                setDraggingNode(null);
            }
        };

        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [tree, draggingNode, hoveredNode]);

    // 드래그 인디케이터 위치 갱신
    useEffect(() => {
        const updateMousePosition = (event) => {
          setDragIndicatorPosition({
            x: event.clientX,
            y: event.clientY,
          });
        };
        
        window.addEventListener('mousemove', updateMousePosition);
        
        return () => {
          window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    return (
    <>
        <div
            className={
                classNames(
                    styles['tree-view'],
                    'undraggable',
                    {
                        [styles['show-background']] : !hideBackground,
                    },
                    className
                )
            }
            style={{
                display: 'block',
                overflow: 'auto',
                height : '100%',
                ...style,
            }}
        >
            {
                tree.map((node, index) => makeNode(node, [index]))
            }
        </div>
        {
            draggingNode != null &&
            createPortal(
                <div
                    className={
                        styles['drag-indicator']
                    }
                    style={{
                        left: dragIndicatorPosition.x + 16,
                        top: dragIndicatorPosition.y,
                    }}
                >
                    {draggingNode.node.name}
                </div>
            ,document.body)
        }
    </>
    );
}

export default RTTreeModal;