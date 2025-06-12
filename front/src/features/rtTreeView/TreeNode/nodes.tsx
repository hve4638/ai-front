import { TreeNodeItem } from './TreeNodeItem';
import { TreeNodeProps } from './types';
import styles from './styles.module.scss';

export function TreeNode(props:TreeNodeProps) {
    return (
        <>
            <TreeNodeItem
                {...props}
                className={styles['node']}
                icon = 'draft'
            />
        </>
    );
}
export function TreeDirectory(props:TreeNodeProps & {children?:React.ReactNode}) {
    return (
        <>
            <TreeNodeItem
                {...props}
                className={styles['node']}
                icon = 'folder_open'
            />
            <div className={styles['node-children']}>
                {
                    props.children
                }
            </div>
        </>
    );
}