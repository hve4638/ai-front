import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import { Column, Flex, Row } from '@/components/layout';
import { TextInput } from '@/components/Input';

import styles from './styles.module.scss';

interface StringFormProps {
    name: string;
    value: string;
    warning?: string;
    onChange: (x: string) => void;
    instantChange?: boolean;

    className?: string;
    style?: React.CSSProperties;
    width?: string;

    info?: string;
    warn?: string;
}

function StringForm({
    name,
    value,
    onChange,
    instantChange = false,

    warn,

    className = '',
    style = {},
    width,
}: StringFormProps) {
    const inputRef = useRef(null);

    return (
        <Column
            className={classNames(className)}

            style={{
                ...style,
                width: '100%',
                // marginTop: '0.5em',
                // marginBottom: (warn != null) ? '0em' : '0.5em',
            }}
        >
            <Row
                style={{
                    width: '100%',
                    height: '1.4em',
                }}
            >
                <span className='noflex undraggable'>
                    {name}
                </span>
                <Flex />
                <TextInput
                    ref={inputRef}
                    style={{ width }}

                    warn={!!warn}

                    onChange={onChange}
                    value={value}
                    instantChange={instantChange}
                />
            </Row>
            {
                warn != null &&
                <small
                    className={classNames(
                        styles['warn-messsage'],
                        'undraggable',
                    )}
                    style={{
                        width: '100%',
                        height: '1.4em',
                        fontSize: '0.8em',
                    }}
                >{warn}</small>
            }
        </Column>
    );
}

export default StringForm;