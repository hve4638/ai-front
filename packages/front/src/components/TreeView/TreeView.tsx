import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import styles from './styles.module.scss';

import { Regions, TreeNode } from './TreeNode';
import { relocateTree } from './utils';
import { ITreeDirectoryNode, ITreeLeafNode, TreeOffsets, } from './types';
import { Flex, Row } from '../layout';

type ITreeNode<T> = ITreeDirectoryNode<T> | ITreeLeafNode<T>;
type Tree<T> = ITreeNode<T>[];

type TreeViewProps<T> = {
    className?: string;
    style?: React.CSSProperties;

    tree: Tree<T>;
    renderLeafNode?: (props: { name: string, value: T }) => React.ReactNode;
    renderDirectoryNode?: (props: { name: string, value: T }) => React.ReactNode;
    onChange?: (item: Tree<T>) => void;
    onClick?: (value: T) => void;
    onDoubleClick?: (value: T) => void;

    relocatable?: boolean;
    hideBackground?: boolean;
}

function TreeView<T>({
    className = '',
    style = {},

    renderLeafNode = ({ name }) => <DefaultNode name={name} />,
    renderDirectoryNode = ({ name }) => <DefaultNode name={name} />,
    tree,
    onClick = () => { },
    onDoubleClick = () => { },
    onChange = () => { },

    relocatable = false,
    hideBackground = false,
}: TreeViewProps<T>) {
    // 드래그 인디케이터 위치지정
    const [dragIndicatorPosition, setDragIndicatorPosition] = useState({ x: 0, y: 0 });
    const [draggingNode, setDraggingNode] = useState<{
        node: ITreeNode<T>;
        offsets: TreeOffsets;
    } | null>(null);
    const [hoveredNode, setHoveredNode] = useState<{
        node: ITreeNode<T>;
        offsets: TreeOffsets;
        region: Regions;
    } | null>(null);

    const handleRegionMouseEnter = useCallback(({ region, node, offsets }: { region: Regions, node: ITreeNode<T>, offsets: TreeOffsets }) => {
        if (!relocatable) return;
        setHoveredNode({
            node: node,
            offsets: offsets,
            region: region,
        });
    }, [relocatable]);
    const handleRegionMouseLeave = useCallback(({ region, node }: { region: Regions, node: ITreeNode<T> }) => {
        if (!relocatable) return;
        setHoveredNode(prev => {
            if (prev && prev.node === node && prev.region === region) {
                return null;
            }
            else {
                return prev;
            }
        });
    }, [relocatable])
    const handleDragBegin = useCallback(({ node, offsets }: { node: ITreeNode<T>, offsets: TreeOffsets }) => {
        if (!relocatable) return;
        setDraggingNode({
            node: node,
            offsets: offsets,
        });
    }, [relocatable]);

    const getDirectoryMouseRegionCount = (node: ITreeNode<T>, offsets: TreeOffsets) => {
        if (!relocatable) return 1;
        else if (!draggingNode) return 1;
        else if (draggingNode.node === node) return 1;
        else if (draggingNode.node.type === 'directory') return 2;
        else return 3;
    };
    const getNodeMouseRegionCount = (node: ITreeNode<T>, offsets: TreeOffsets) => {
        if (!relocatable) return 1;
        else if (!draggingNode) return 1;
        else if (draggingNode.node === node) return 1;
        else if (draggingNode.node.type === 'directory' && offsets.length >= 2) return 0;
        else return 2;
    }

    const makeDirectoryNode = (node: ITreeDirectoryNode<T>, offsets: TreeOffsets) => {
        const key = offsets.join('_') + '_' + node.name;

        return (
            <>
                <TreeNode
                    key={key}
                    className={styles['node']}
                    mouseRegionCount={getDirectoryMouseRegionCount(node, offsets)}
                    onRegionMouseEnter={(e, region) => handleRegionMouseEnter({ region, node, offsets })}
                    onRegionMouseLeave={(e, region) => handleRegionMouseLeave({ region, node })}
                    onDragBegin={() => handleDragBegin({ node, offsets })}
                >
                    {renderDirectoryNode({ name: node.name, value: node.value })}
                </TreeNode>
                <div
                    key={key + '_children'}
                    className={styles['node-children']}
                >
                    {
                        node.children.map(
                            (child, index: number) => makeLeafNode(child, [...offsets, index] as TreeOffsets)
                        )
                    }
                </div>
            </>
        );
    }

    const makeLeafNode = (node: ITreeLeafNode<T>, offsets: TreeOffsets) => {
        const key = offsets.join('_') + '_' + node.name;

        return (
            <TreeNode
                key={key}
                className={styles['node']}
                mouseRegionCount={getNodeMouseRegionCount(node, offsets)}
                onRegionMouseEnter={(e, region) => handleRegionMouseEnter({ region, node, offsets })}
                onRegionMouseLeave={(e, region) => handleRegionMouseLeave({ region, node })}
                onDragBegin={() => handleDragBegin({ node, offsets })}

                onClick={() => onClick(node.value)}
                onDoubleClick={() => onDoubleClick(node.value)}
            >
                {renderLeafNode({ name: node.name, value: node.value })}
            </TreeNode>
        );
    }

    const makeNode = (node: ITreeNode<T>, offsets: TreeOffsets) => {
        if (node.type === 'directory') {
            return makeDirectoryNode(node, offsets);
        }
        else {
            return makeLeafNode(node, offsets);
        }
    }

    // 드래그 해제
    useEffect(() => {
        const handleMouseUp = () => {
            if (draggingNode) {
                if (!hoveredNode) {
                    // nothing to do
                }
                else if (hoveredNode.node.type === 'directory') {
                    if (hoveredNode.region === Regions.Top) {
                        const offsets: TreeOffsets = [...hoveredNode.offsets];
                        offsets[offsets.length - 1] -= 1;

                        onChange(relocateTree(tree, draggingNode.offsets, offsets));
                    }
                    else if (hoveredNode.region === Regions.Bottom) {
                        const offsets: TreeOffsets = [...hoveredNode.offsets];
                        offsets[offsets.length - 1] += 1;

                        onChange(relocateTree(tree, draggingNode.offsets, offsets));
                    }
                    else if (hoveredNode.region === Regions.Center) {
                        const offsets: TreeOffsets = [...hoveredNode.offsets];
                        offsets.push(hoveredNode.node.children.length);

                        onChange(relocateTree(tree, draggingNode.offsets, offsets));
                    }
                }
                else {
                    if (hoveredNode.region === Regions.Top) {
                        onChange(relocateTree(tree, draggingNode.offsets, hoveredNode.offsets));
                    }
                    else if (hoveredNode.region === Regions.Bottom) {
                        const offsets: TreeOffsets = [...hoveredNode.offsets];
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
    }, [tree, draggingNode, hoveredNode, onChange]);

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
                            [styles['show-background']]: !hideBackground,
                        },
                        className
                    )
                }
                style={{
                    display: 'block',
                    overflow: 'auto',
                    height: '100%',
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
                    , document.body)
            }
        </>
    );
}

function DefaultNode<T>({ name }: { name: string }) {
    return (
        <Row
            style={{ width: 'auto' }}
        >
            <span>{name}</span>
            <Flex />
        </Row>
    );
}

export default TreeView;