import React, { useMemo, useState } from 'react';
import classNames from 'classnames';

import { Align, Flex, Row } from '@/components/layout';

import { useDataStore } from '@/stores';
import useSignal from '@/hooks/useSignal';

import styles from './styles.module.scss';
import { GIcon, GIconButton } from '@/components/GoogleFontIcon';
import DivButton from '@/components/DivButton';
import { useModal } from '@/hooks/useModal';
import EditCustomModelModal from './EditCustomModel';
import ProfileEvent from '@/features/profile-event';

interface ModelListViewProps {
    onClick: (model: CustomModel) => Promise<void>;
}

function CustomModelListView({
    onClick,
}: ModelListViewProps) {
    const customModels = useDataStore(state => state.custom_models);

    return (
        <div className={styles['model-list']}>
            {
                customModels.flatMap((model, index) => {
                    return (
                        <CustomModelItem
                            key={index}
                            model={model}
                            onClick={async (model) => await onClick(model)}
                        />
                    )
                })
            }
            <AddButton/>
        </div>
    )
}

interface ModelItemProps {
    model: CustomModel;
    onClick: (model: CustomModel) => Promise<void>;
}

function CustomModelItem({ model, onClick }: ModelItemProps) {
    const modal = useModal();
    const [_, refresh] = useSignal();
    const starred = ProfileEvent.model.isStarred(model.id);

    return (
        <Row
            className={
                classNames(
                    styles['model'],
                    styles['custom-model'],
                    { [styles['starred']]: starred }
                )
            }
            onDoubleClick={async (e) => {
                await onClick(model);
                refresh();
                e.stopPropagation();
            }}
            onRClick={(e) => {
                onClick(model);
                refresh();
                e.stopPropagation();
            }}
            columnAlign={Align.Center}
        >
            <Row
                style={{
                    flexWrap: 'wrap',
                }}
            >
                <span className='noflex'>
                    {model.name}
                </span>
            </Row>
            <Flex />
            <GIconButton
                style={{
                    fontSize: '1.5em',
                    height: '100%',
                    aspectRatio: '1 / 1',
                    marginRight: '2px',
                }}
                onClick={async (e) => {
                    modal.open(EditCustomModelModal, {
                        value: model,
                        onConfirm: async (updatedModel) => {
                            await ProfileEvent.model.setCustom(updatedModel);
                            return true;
                        },
                        onDelete: async (customId) => {
                            await ProfileEvent.model.removeCustom(customId);
                            return true;
                        }
                    });
                    refresh();
                    e.stopPropagation();
                }}
                value='edit'
                hoverEffect='square'
            />
            <GIconButton
                className={classNames(styles['star'], { [styles['starred']]: starred })}
                style={{
                    fontSize: '1.5em',
                    height: '100%',
                    aspectRatio: '1 / 1',
                    marginRight: '4px',
                }}
                onClick={async (e) => {
                    await onClick(model);
                    refresh();
                    e.stopPropagation();
                }}
                value='star'
                hoverEffect='square'
            />
        </Row>
    )
}

function AddButton() {
    const modal = useModal();

    return (
        <DivButton
            className={styles['model-add-button']}
            center={true}
            onClick={() => {
                modal.open(EditCustomModelModal, {
                    onConfirm: async (modelData) => {
                        await ProfileEvent.model.setCustom(modelData);
                        return true; // Close the modal after adding
                    },
                });
            }}
        >
            <GIcon
                value='add_circle'
                style={{
                    marginRight: '0.25em',
                }}
            />
            <span>새 모델 추가</span>
        </DivButton>
    )
}


export default CustomModelListView;