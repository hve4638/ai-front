import classNames from 'classnames';

import { Column, Flex, Row } from '@/components/layout';

import FormFieldProps from './types';

import { CheckBoxField, NumberField, SelectField, TextField } from './primary-fields';

import styles from './styles.module.scss';
import { GIconButton, GoogleFontIcon } from '@/components/GoogleFontIcon';
import { useCallback } from 'react';
import StructField from './StructField';
import { getPromptVarDefaultValue } from '../utils';


function ArrayField({ promptVar, onChange, value }: FormFieldProps<PromptVarArray, unknown[]>) {
    const elementCompoment = useCallback((item: any, index: number) => {
        const change = (nextElement: unknown) => {
            const newValue = [...value];
            newValue[index] = nextElement;
            onChange(newValue);
        }

        const name = `[${index}]`;
        switch (promptVar.element.type) {
            case 'text':
                return <TextField
                    name={name}
                    promptVar={promptVar.element}
                    value={item}
                    onChange={change}
                />
            case 'number':
                return <NumberField
                    name={name}
                    promptVar={promptVar.element}
                    value={item}
                    onChange={change}
                />
            case 'checkbox':
                return <CheckBoxField
                    name={name}
                    promptVar={promptVar.element}
                    value={item}
                    onChange={change}
                />
            case 'select':
                return <SelectField
                    name={name}
                    promptVar={promptVar.element}
                    value={item}
                    onChange={change}
                />
            case 'struct':
                return (
                    <Row
                        style={{ width: '100%', marginBottom: '2px' }}
                    >
                        <span className='undraggable'>{name}</span>
                        <StructField
                            key={index}
                            promptVar={promptVar.element}
                            value={item}
                            onChange={change}
                        />
                    </Row>
                )
        }
    }, [promptVar, onChange]);
    const addElement = () => {
        const defaultValue = getPromptVarDefaultValue(promptVar.element);
        const newValue = [...value, defaultValue];
        onChange(newValue);
    }

    return (
        <Column
            style={{
                width: '100%',
            }}
        >
            <Row
                className='wfill'
                style={{
                    height: '1.4em',
                    lineHeight: '1.4'
                }}
            >
                <span
                    className='undraggable'
                    style={{

                        padding: '0px',
                        margin: '0px',
                    }}
                >{promptVar.display_name}</span>
                <Flex />
                <GIconButton
                    value='add'
                    style={{
                        fontSize: '1em',
                        lineHeight: '1',
                        width: '1.4em',
                        height: '1.4em',
                    }}
                    hoverEffect='square'
                    onClick={() => {
                        addElement();
                    }}
                />
            </Row>

            <Column
                className={classNames(styles['struct-field'])}
                style={{
                    width: '100%',
                    paddingLeft: '0.75em',
                    gap: '0.3em',
                }}
            >
                {
                    value.map((v, i) =>
                        <Row
                            key={i}
                            style={{
                                width: '100%',
                                gap: '0.25em',
                            }}
                        >
                            <Flex>{elementCompoment(v, i)}</Flex>
                            <GIconButton
                                value='delete'
                                hoverEffect='square'

                                style={{
                                    fontSize: '1em',
                                    lineHeight: '1',
                                    width: '1.4em',
                                    height: '1.4em',
                                }}

                                onClick={() => {
                                    const newValue = [...value];
                                    newValue.splice(i, 1);
                                    onChange(newValue);
                                }}
                            />
                        </Row>
                    )
                }
            </Column>
        </Column>
    )
}

export default ArrayField;