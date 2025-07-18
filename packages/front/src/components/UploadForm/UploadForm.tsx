import { useState } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface UploadFormProps {
    name?: string;
    onUpload: (files: FileList) => void;
}

function UploadForm({ name = '', onUpload }: UploadFormProps) {
    const [hovered, setOnHover] = useState(false);

    return (
        <div>
            <label
                className={classNames(
                    styles['upload-container'],
                    { [styles['upload-container']]: hovered },
                    'wfill center clickable'
                )}

                onDragEnter={() => setOnHover(true)}
                onDragLeave={() => setOnHover(false)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {

                    const files = event.dataTransfer.files;
                    if (files.length > 0) {
                        onUpload(files);
                    }
                    event.preventDefault();
                }}
            >
                <span style={{ marginRight: "6px" }}>파일 선택</span>
                <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "22px", pointerEvents: "auto" }}
                >upload_file</span>
                <input
                    type="file"
                    className="hide"
                    onChange={(event) => {
                        const files = event.target.files;
                        if (!files || files.length === 0) {
                            return;
                        }

                        onUpload(files);
                    }}
                />
            </label>
        </div>
    );
}

export default UploadForm;