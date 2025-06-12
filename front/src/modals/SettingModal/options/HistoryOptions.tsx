import { useConfigStore } from '@/stores';
import { CheckBoxForm, DropdownForm, NumberForm } from '@/components/Forms';
import { Column } from '@/components/layout';

import styles from '../styles.module.scss';

function HistoryOptions() {
    const configs = useConfigStore();

    return (
        <Column className={styles['options-gap']}>
            <CheckBoxForm
                name='기록 활성화'
                checked={configs.history_enabled}
                onChange={configs.update.history_enabled}
            />
            <NumberForm
                name='세션 당 최대 저장 기록 수'
                width='6em'
                value={configs.max_history_limit_per_session}
                onChange={configs.update.max_history_limit_per_session}
            />
            <DropdownForm
                name='최대 저장 일수'
                items={
                    [
                        { name: '무제한', key: '0' },
                        { name: '1일', key: '1' },
                        { name: '1주', key: '7' },
                        { name: '1개월', key: '30' },
                        { name: '3개월', key: '90' },
                        { name: '6개월', key: '180' },
                        { name: '1년', key: '365' },
                    ]
                }
                value={String(configs.max_history_storage_days)}
                onChange={(item)=>configs.update.max_history_storage_days(Number(item.key))}
            />
        </Column>
    )
}

export default HistoryOptions;