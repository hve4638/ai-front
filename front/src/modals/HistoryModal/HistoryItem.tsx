import { Align, Column } from '@/components/layout';
import styles from './styles.module.scss';
import classNames from 'classnames';
import { HistoryData } from './types';


type HistoryItemProps = {
    value: HistoryData;
    onClick: (value: HistoryData) => void;
}

function HistoryItem({
    value,
    onClick,
}:HistoryItemProps) {
    return (
        <Column
            className={classNames(styles['history-list-item'])}
            key={value.id}
            onClick={()=>onClick(value)}
            style={{
            }}
            columnAlign={Align.SpaceBetween}
        >
            <span className={styles['input']}>{value.input}</span>
            <span className={styles['output']}>{value.output}</span>
        </Column>
    )
}

export default HistoryItem;