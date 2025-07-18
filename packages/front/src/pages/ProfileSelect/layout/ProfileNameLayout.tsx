import { TextInput } from '@/components/Input';
import { Align, Flex, Row } from '@/components/layout';
import classNames from 'classnames';

import { useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/Modal';
import Button from '@/components/Button';
import { ModalHeader } from '@/components/Modal';
import { CommonProps } from '@/types';

import styles from './styles.module.scss';

interface ProfileNameLayoutProps extends CommonProps {
    value: string;
    onChange?: (name: string) => void;
    focusWhenMounted?: boolean;
}

function ProfileNameLayout({
    className = '',
    style = {},

    value,
    onChange = () => {},
    focusWhenMounted = true,
}: ProfileNameLayoutProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!focusWhenMounted) return;
        
        inputRef.current?.focus();
    }, [focusWhenMounted]);

    return (
        <Row
            rowAlign={Align.Center}
            className={className}
            style={{
                width: '100%',
                boxSizing: 'border-box',
                marginBottom: '8px',
                ...style
            }}
        >
            <div
                className='noflex'
                style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'lightgray',
                    borderRadius: '8px'
                }}
            ></div>
            <Flex
                className='center'
                style={{
                    height: '64px',
                    paddingLeft: '16px'
                }}
            >
                <TextInput
                    ref={inputRef}
                    className={classNames('wfill', styles['profile-input'])}
                    placeholder='프로필 이름'
                    style={{
                        boxSizing: 'content-box',
                        padding: '2px 0.5em',
                        height: '1.5em',
                    }}
                    value={value}
                    onChange={(value) => onChange(value)}
                    instantChange={true}
                />
            </Flex>
        </Row>
    )
}

export default ProfileNameLayout;