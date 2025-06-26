import classNames from 'classnames';
import styles from './styles.module.scss';
import { readFileAsDataURI } from '@/utils/file';
import { useSessionStore } from '@/stores';
import { CommonProps } from '@/types';

interface FileDropperProps extends CommonProps {
    onDragEnd?: () => void;
}

function FileDropper({
    className = '',
    style = {},
    onDragEnd = () => {}
}: FileDropperProps) {
    return <div
        className={classNames(styles['drag-over-form'], 'undraggable', className)}
        style={style}
        onDragLeave={() => {
            onDragEnd();
        }}
        onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
        }}
        onDrop={async (e) => {
            onDragEnd();
            e.preventDefault();
            e.stopPropagation();

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                for (const file of files) {
                    const data = await readFileAsDataURI(file);

                    await useSessionStore.getState().actions.addInputFile(file.name, data);
                }
            }
        }}
    />
}

export default FileDropper;