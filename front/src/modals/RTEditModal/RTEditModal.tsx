import { Children, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import Button from '@/components/Button';
import { GIcon, GIconButton } from '@/components/GoogleFontIcon';
import { Align, Flex, Grid, Row } from '@/components/layout';
import { Modal, ModalHeader } from '@/components/Modal';
import { ITreeDirectoryNode, ITreeLeafNode, ITreeNode } from '@/components/TreeView/types';
import { EditableText } from '@/components/EditableText';
import TreeView from '@/components/TreeView';

import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';
import { useModal } from '@/hooks/useModal';

import { useProfileEvent, useSignalStore } from '@/stores';

import { DeleteConfirmDialog } from '@/modals/Dialog';
import NewRTModal from '@/modals/NewRTModal';

import { LeafNode } from './nodes';

type RTEditModalProps = {
    onClickCreateNewRT: () => void;
    isFocused: boolean;
    onClose: () => void;
}

function RTEditModal({
    onClickCreateNewRT,
    isFocused,
    onClose
}: RTEditModalProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { getRTTree, updateRTTree, renameRT, removeRT } = useProfileEvent();
    const signal = useSignalStore(state => state.signal);
    const modal = useModal();
    const [disappear, close] = useModalDisappear(onClose);
    const nextDirIdRef = useRef<number>(0);

    const [tree, setTree] = useState<ITreeNode<string>[]>([]);

    const nextDirId = () => `__dir_${nextDirIdRef.current++}`

    const changeTree = async (nodes: ITreeNode<string>[]) => {
        setTree(nodes);

        const next: RTMetadataTree = nodes.map((node) => {
            if (node.type === 'directory') {
                return {
                    type: 'directory',
                    name: node.name,
                    children: node.children.map(
                        (child) => ({
                            type: 'node',
                            name: child.name,
                            id: child.value,
                        } satisfies RTMetadataNode)
                    ),
                } satisfies RTMetadataDirectory;
            }
            else {
                return {
                    type: 'node',
                    name: node.name,
                    id: node.value,
                } satisfies RTMetadataNode;
            }
        })

        await updateRTTree(next);
        await signal.refresh_rt_tree();
    }

    const renameNode = async (value: string, newName: string) => {
        const nameTrimmed = newName.trim();
        if (nameTrimmed.length === 0) {
            return;
        }

        const findNode:(nodes: ITreeNode<string>[], value:string)=>ITreeNode<string>|null = (nodes, value) => {
            for (const node of nodes) {
                if (node.value === value) {
                    return node;
                }
                if (node.type === 'directory') {
                    const found = findNode(node.children, value);
                    if (found) return found;
                }
            }

            return null;
        }
        
        const node = findNode(tree, value);
        if (node) {
            const next = [...tree];
            node.name = nameTrimmed;
            if (node.type === 'node') {
                await renameRT(value, nameTrimmed);
            }
            
            changeTree(next);
        }
    }

    const deleteNode = async (value: string) => {
        const promises: Promise<void>[] = [];
        const next = tree.flatMap((node) => {
            if (node.value !== value) return [node];
            else {
                if (node.type === 'directory') {
                    return node.children;
                }
                else {
                    promises.push(removeRT(node.value));
                    return [];
                }
            }
        });

        await Promise.all(promises);

        changeTree(next);
    }

    const openDeleteNodeDialog = (name:string, value: string) => {
        modal.open(DeleteConfirmDialog, {
            onDelete: async () => {
                deleteNode(value);
                return true;
            },
            onCancel: async () => {
                return true;
            },
        });
    }

    useEffect(() => {
        getRTTree().then((tree) => {
            const tree2 = tree.map((node) => {
                if (node.type === 'directory') {
                    return {
                        name: node.name,
                        value: nextDirId(),
                        type: 'directory',
                        children: node.children.map((child) => ({
                            type: 'node',
                            name : child.name,
                            value: child.id,
                        })),
                    } as ITreeDirectoryNode<string>;
                }

                return {
                    type: 'node',
                    name : node.name,
                    value: node.id,
                } as ITreeLeafNode<string>;
            });
            setTree(tree2);
        });
    }, []);

    useHotkey({
        'Escape': close,
    }, isFocused, []);

    return (
        <Modal
            disappear={disappear}
            style={{
                maxHeight: '80%',
            }}
        >
            <Grid
                columns='1fr'
                rows='2em 24px 2px 1fr 6px 32px'
                style={{
                    height: '100%',
                }}
            >
                <ModalHeader onClose={close}>{t('rt.rt_edit')}</ModalHeader>
                <Row
                    style={{
                        padding: '0px 4px',
                    }}
                    rowAlign={Align.End}
                >
                    <GIconButton
                        style={{
                            fontSize: '22px',
                            width: '22px',
                            height: '22px',
                        }}
                        value='create_new_folder'
                        hoverEffect='square'
                        onClick={() => {
                            changeTree([
                                ...tree,
                                {
                                    name: t('rt.new_directory'),
                                    type: 'directory',
                                    value: nextDirId(),
                                    children: [],
                                } satisfies ITreeDirectoryNode<string>,
                            ]);
                        }}
                    />
                </Row>
                <div/>
                <TreeView
                    tree={tree}
                    onChange={(next) => changeTree(next)}
                    relocatable={true}
                    renderLeafNode={({ name, value }) => {
                        return (
                            <LeafNode
                                name={name}
                                value={value}
                                onRename={(renamed) => {
                                    renameNode(value, renamed);
                                }}
                                onDelete={() => {
                                    openDeleteNodeDialog(name, value);
                                }}
                                onEdit={() => {
                                    navigate(`/workflow/${value}/prompt/default`);
                                }}
                                onExport={() => {
                                    console.log('export', value);
                                }}
                            />
                        );
                    }}
                    renderDirectoryNode={({ name, value }) => {
                        return (
                            <>
                                <GIcon
                                    value='folder_open'
                                    style={{
                                        fontSize: '22px',
                                        width: '22px',
                                        height: '22px',
                                    }}
                                />
                                <Flex style={{ paddingLeft: '0.25em'}}>
                                    <EditableText
                                        value={name}
                                        onChange={(renamed)=>{
                                            renameNode(value, renamed);
                                        }}
                                    />
                                </Flex>
                                <DeleteButton
                                    onClick={(e) => {
                                        openDeleteNodeDialog(name, value);
                                        e.stopPropagation();
                                        e.preventDefault();
                                    }}
                                />
                            </>
                        );
                    }}
                />
                <div />
                <Row
                    rowAlign={Align.End}
                    style={{
                        height: '100%',
                        gap: '0.5em',
                    }}
                >
                    <Button
                        onClick={()=>{
                            modal.open(NewRTModal, {
                                onAddRT: (rtId:string, mode:RTMode) => {
                                    navigate(`/workflow/${rtId}/prompt/default`);
                                }
                            });
                            close();
                        }}
                        style={{
                            minWidth: '80px',
                            height: '100%'
                        }}
                    >{t('rt.rt_create')}</Button>
                    <Button
                        onClick={()=>{
                            
                            close();
                        }}
                        style={{
                            minWidth: '80px',
                            height: '100%'
                        }}
                    >{t('rt.rt_load')}</Button>
                </Row>
            </Grid>
        </Modal>
    );
}

function EditButton({ onClick }: {
    onClick?: (e: React.MouseEvent<HTMLLabelElement, MouseEvent> | React.KeyboardEvent<HTMLLabelElement>) => void;
}) {
    return (
        <GIconButton
            value='edit'
            style={{
                fontSize: '22px',
                width: '22px',
                height: '22px',
            }}
            hoverEffect='square'
            onClick={onClick}
        />
    );
}

function DeleteButton({ onClick }: {
    onClick?: (e: React.MouseEvent<HTMLLabelElement, MouseEvent> | React.KeyboardEvent<HTMLLabelElement>) => void;
}) {
    return (
        <GIconButton
            value='delete'
            style={{
                fontSize: '22px',
                width: '22px',
                height: '22px',
            }}
            hoverEffect='square'
            onClick={onClick}
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        />
    );
}

export default RTEditModal;