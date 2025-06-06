import React, { useMemo, useState } from 'react';
import classNames from 'classnames';

import { Align, Flex, Row } from '@/components/layout';

import { useConfigStore, useProfileEvent } from '@/stores';
import useSignal from '@/hooks/useSignal';

import styles from './styles.module.scss';

interface ModelListViewProps {
    provider?: ChatAIModelProviders;
    onClick: (model: ChatAIModel) => Promise<void>;
}

function ModelListView({
    provider,
    onClick,
}: ModelListViewProps) {
    const [categoryUnfold, setCategoryUnfold] = useState<boolean[]>([]);

    return (
        <div className={styles['model-list']}>
            {
                provider != null &&
                provider.list.flatMap((category, index) => {
                    if (category.list == null) return <></>;
                    if (category.list.length === 0) return <></>;

                    return (<>
                        <CategoryItem
                            key={category.name + index}
                            category={category}
                            onClick={async () => {
                                setCategoryUnfold((prev) => {
                                    const newUnfold = [...prev];
                                    newUnfold[index] = !newUnfold[index];
                                    return newUnfold;
                                });
                            }}
                        />
                        {
                            categoryUnfold[index] &&
                            category.list.map((model: ChatAIModel, index) => (
                                <ModelItem
                                    key={category.name + model.id + index}
                                    model={model}
                                    onClick={async (model) => await onClick(model)}
                                />
                            ))
                        }
                    </>)
                })
            }
        </div>
    )
}

interface CategoryItemProps {
    category: ChatAIMoedelCategory;
    onClick: (category: ChatAIMoedelCategory) => Promise<void>;
}

function CategoryItem({ category, onClick }: CategoryItemProps) {
    return (
        <Row
            className={
                classNames(styles['model-category'])
                // + (modelUnfold[index] ? ' unfold' : '')
            }
            onClick={async () => await onClick(category)}
            columnAlign={Align.Center}
        >
            <span>{category.name}</span>
            <Flex />
        </Row>
    )
}

interface ModelItemProps {
    model: ChatAIModel;
    onClick: (model: ChatAIModel) => Promise<void>;
}

function ModelItem({ model, onClick }: ModelItemProps) {
    const {
        isModelStarred,
    } = useProfileEvent();
    const [_, refresh] = useSignal();
    const flags = useMemo(()=>model.flags, [model.flags])
    const starred = isModelStarred(model.id);
    const showActualName = useConfigStore(state=>state.show_actual_model_name);

    return (
        <Row
            className={classNames(styles['model'], { [styles['starred']]: starred })}
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
                <span
                    className='noflex'
                >
                    {
                        showActualName
                            ? model.name
                            : model.displayName
                    }
                </span>
                {
                    flags.snapshot &&
                    <Tag>snapshot</Tag>
                }
                {
                    flags.experimental &&
                    <Tag>experimental</Tag>
                }
                {
                    flags.deprecated &&
                    <Tag>deprecated</Tag>
                }
                {
                    flags.legacy &&
                    <Tag>legacy</Tag>
                }
            </Row>
            <Flex />
        </Row>
    )
}

function Tag({ children }: { children: React.ReactNode }) {
    return (
        <div
            className={styles['tag-container']}
            style={{
                display: 'flex',
                flexShrink: 1,
                flexBasis: 'auto',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}
        >
            <span className={styles['tag']}>
                {children}
            </span>
        </div>
    )
}


export default ModelListView;