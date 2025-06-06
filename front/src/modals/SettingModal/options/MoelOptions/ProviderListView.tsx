import classNames from 'classnames';

import { Column } from '@/components/layout';

import styles from './styles.module.scss';

interface ProviderListViewProps {
    models: ChatAIModels;
    selected: number;
    onChange: (index: number) => void;
}

function ProviderListView({ models, selected, onChange }: ProviderListViewProps) {
    return (
        <Column
            className={styles['model-list']}
            style={{
                minHeight: '100%',
                overflowX: 'hidden',
                overflowY: 'auto',
            }}
        >
            {
                models.map((provider, index) => (
                    <div
                        key={`${provider.name}_${index}`}
                        className={
                            classNames(
                                styles['provider'],
                                {
                                    [styles['selected']]: selected === index,
                                }
                            )
                        }
                        onClick={() => onChange(index)}
                    >
                        {provider.name}
                    </div>
                ))
            }
        </Column>
    )
}

export default ProviderListView;