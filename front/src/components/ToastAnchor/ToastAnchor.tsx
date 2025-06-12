import classNames from 'classnames';
import { createContext, useContext, useRef, useState } from 'react';
import ToastRenderer from './ToastRenderer';

import styles from './styles.module.scss';

type ToastAnchorProps = {
    children?: React.ReactNode;

}

function ToastAnchor({ children=<></> }: ToastAnchorProps) {
    return (
        <div
            className={classNames(styles['toast-anchor'])}
        >
            {children}
            <ToastRenderer/>
        </div>
    )
}

export default ToastAnchor;