import { useState } from 'react';

import AvatarPopover from './AvatarPopover';

import styles from './styles.module.scss';
import useMemoryStore from '@/stores/useMemoryStore';

function AvatarButton() {
    const [showPopover, setShowPopover] = useState(false);
    
    const { availableVersion } = useMemoryStore();

    return (
        <div className={styles['avatar-container']}>
            <label
                className={styles['avatar-label']}
                onClick={() => {
                    setShowPopover(prev => !prev);
                }}
            >
                <div
                    className={styles['avatar']}
                />
            </label>
            {
                showPopover &&
                <AvatarPopover
                    onClose={() => setShowPopover(false)}
                />
            }
            {
                availableVersion != null &&
                <span
                    className={styles['red-circle']}
                    style={{
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                    }}
                />
            }
        </div>
    )
}

export default AvatarButton;