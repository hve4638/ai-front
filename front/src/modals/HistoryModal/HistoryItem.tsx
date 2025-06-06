import classNames from 'classnames';

import { Align, Center, Column, Flex, Grid, Row } from '@/components/layout';
import type { HistoryData } from '@/features/session-history';

import styles from './styles.module.scss';
import { GIconButton } from '@/components/GoogleFontIcon';
import { useModal } from '@/hooks/useModal';
import { DeleteConfirmDialog } from '../Dialog';

type HistoryItemProps = {
    value: HistoryData;
    onClick: (value: HistoryData) => void;
    onDelete: (value: HistoryData) => Promise<void>;
}

function HistoryItem({
    value,
    onClick,
    onDelete,
}: HistoryItemProps) {
    const modal = useModal();

    return (
        <Grid
            key={value.id}
            className={classNames(styles['history-list-item'])}
            style={{
                gap : '2em',
            }}
            
            rows='1fr'
            columns='1fr 1.5em'
            onClick={() => onClick(value)}
        >
            <Column
                style={{
                    // maxWidth: '95%',
                    overflowX: 'hidden',
                }}
                columnAlign={Align.SpaceBetween}
            >
                {
                    value.input == null
                        ? <span className={classNames(styles['input'], styles['empty'])}>--empty--</span>
                        : <span className={classNames(styles['input'])}>{value.input}</span>
                }
                {
                    value.output == null
                        ? <span className={classNames(styles['output'], styles['empty'])}>--empty--</span>
                        : <span className={classNames(styles['output'])}>{value.output}</span>
                }
            </Column>
            <Center
                style={{
                    height: '100%',
                    fontSize: '1.25em',
                }}
            >
                <GIconButton
                    value='delete'
                    className={classNames(styles['delete-button'])}
                    onClick={(e) => {
                        e.stopPropagation();
                        modal.open(DeleteConfirmDialog, {
                            onDelete: async () => {
                                await onDelete(value);
                                return true;
                            }
                        });
                    }}
                    hoverEffect='square'
                />
            </Center>
        </Grid>
    )
}

export default HistoryItem;