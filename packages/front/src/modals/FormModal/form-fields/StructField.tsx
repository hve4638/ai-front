import classNames from 'classnames';

import { Column } from '@/components/layout';

import FormFieldProps from './types';

import { CheckBoxField, NumberField, SelectField, TextField } from './primary-fields';

import styles from './styles.module.scss';

function StructField({ promptVar, onChange, value }: FormFieldProps<PromptVarStruct, Record<string, any>>) {
    
    return (
        <Column
            style={{
                width: '100%',
            }}
        >
            <span className='undraggable'>{promptVar.display_name}</span>
            
            <Column
                className={classNames(styles['struct-field'])}
                style={{
                    width: '100%',
                    paddingLeft: '0.75em',
                    gap: '0.3em',
                }}
            >
            {
                promptVar.fields.map((field, index) => {
                    const change = (next:unknown) => {
                        const nextValue = {
                            ...value,
                            [field.name] : next
                        };
                        onChange(nextValue);
                    }

                    if (field.type === 'text') {
                        return <TextField
                            key={index}
                            promptVar={field}
                            value={value[field.name]}
                            onChange={change}
                        />
                    }
                    else if (field.type === 'number') {
                        return <NumberField
                            key={index}
                            promptVar={field}
                            value={value[field.name]}
                            onChange={change}
                        />
                    }
                    else if (field.type === 'checkbox') {
                        return <CheckBoxField
                            key={index}
                            promptVar={field}
                            value={value[field.name]}
                            onChange={change}
                        />
                    }
                    else if (field.type === 'select') {
                        return <SelectField
                            key={index}
                            promptVar={field}
                            value={value[field.name]}
                            onChange={change}
                        />
                    }
                    else {
                        return <></>
                    }
                })
            }
            </Column>
        </Column>
    )
}

export default StructField;