import classNames from 'classnames';
import { GoogleFontIcon } from 'components/GoogleFontIcon';

import styles from './styles.module.scss';
import { MouseEventHandler } from 'react';

type PromptTreeNodeProps = {
    name:string;
    className?:string;
    fixed?:boolean;
    editted?:boolean;
    added?:boolean;
    onMouseEnter?:MouseEventHandler<HTMLDivElement>;
    onMouseLeave?:MouseEventHandler<HTMLDivElement>;
    onMouseDown?:MouseEventHandler<HTMLDivElement>;
}


export function PromptTreeNode({
    name,
    className = '',
    fixed = false,
    editted = false,
    added = false,
    onMouseEnter = (e) => {},
    onMouseLeave = (e) => {},
    onMouseDown = (e) => {},
}:PromptTreeNodeProps) {
    return (
        <div className={
            classNames(
                styles['node'],
                {
                    [styles['fixed']]: fixed,
                    [styles['edited']] : editted,
                    [styles['added']] : added,
                },
                className,
            )
        }>
            <GoogleFontIcon
                value='draft'
                style={{
                    top: '1px',
                }}
            />
            <span style={{paddingLeft:'0.25em'}}>{name}</span>
        </div>
    );
}
type PromptTreeDirectoryProps = {
    name:string;
    children?:React.ReactNode;
    fixed?:boolean;
    editted?:boolean;
    added?:boolean;
    onMouseEnter?:MouseEventHandler<HTMLDivElement>;
    onMouseLeave?:MouseEventHandler<HTMLDivElement>;
    onMouseDown?:MouseEventHandler<HTMLDivElement>;
}

export function PromptTreeDirectory({
    name,
    children,
    fixed = false,
    editted = false,
    added = false,
    onMouseEnter = (e) => {},
    onMouseLeave = (e) => {},
    onMouseDown = (e) => {},
}:PromptTreeDirectoryProps) {
    return (
        <>
            <div
                className={
                    classNames(
                        styles['node-directory'],
                        {
                            [styles['fixed']]: fixed,
                            [styles['edited']] : editted,
                            [styles['added']] : added,
                        }
                    )
                }
                onMouseDown={onMouseDown}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <GoogleFontIcon value='folder_open'/>
                <span style={{paddingLeft:'0.25em'}}>{name}</span>
            </div>
            <div className={styles['node-children']}>
                {children}
            </div>
        </>
    );
}