import classNames from 'classnames';
import { Column } from '@/components/layout';
import styles from './styles.module.scss';
import { CommonProps } from '@/types';

interface ListViewProps extends CommonProps {
    children?: React.ReactNode;
}

function ListView({ className='', style={}, children }:ListViewProps) {
    return (
        <Column
            className={classNames(className, styles['list-view'], 'undraggable')}
            style={style}
        >
            {children}
        </Column>
    );
}

export default ListView;