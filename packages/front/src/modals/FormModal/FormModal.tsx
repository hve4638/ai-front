import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

import { useProfileAPIStore, useProfileEvent } from '@/stores';

import { Modal, ModalHeader } from '@/components/Modal';

import useHotkey from '@/hooks/useHotkey';
import useModalDisappear from '@/hooks/useModalDisappear';
import useSignal from '@/hooks/useSignal';
import { CheckBoxForm, DropdownForm, NumberForm, StringForm } from '@/components/Forms';
import { ArrayField, CheckBoxField, NumberField, SelectField, StructField, TextField } from './form-fields';
import { Column } from '@/components/layout';
import { getPromptVarDefaultValue } from './utils';

type FormModalProps = {
    isFocused: boolean;
    onClose: () => void;
}

function FormModal({
    isFocused,
    onClose
}: FormModalProps) {
    const { getCurrentSessionForms, setCurrentSessionForms } = useProfileEvent();

    const [disappear, close] = useModalDisappear(onClose);
    const [forms, setForms] = useState<PromptVar[]>([]);
    const variables = useRef<Record<string, any>>({});

    const [_, refresh] = useSignal();

    useHotkey({
        'Escape': close,
    }, isFocused, []);

    useEffect(() => {
        getCurrentSessionForms()
            .then((forms) => {
                const vars: Record<string, any> = {};
                for (const form of forms) {
                    const formId = form.id!;

                    if (form.last_value != null) {
                        vars[formId] = form.last_value;
                    }
                    else {
                        vars[formId] = getPromptVarDefaultValue(form);
                    }
                }

                variables.current = vars;
                setForms(forms);
                refresh();
            });

        return () => {
            setCurrentSessionForms(variables.current);
        }
    }, []);

    return (
        <Modal
            disappear={disappear}
            style={{
                maxHeight: '80%',
                overflowY: 'auto',
            }}
        >
            <ModalHeader onClose={close}>변수</ModalHeader>
            <Column
                style={{ gap : '0.5em', }}
            >
            {
                forms.map((form, index) => {
                    const formId = form.id!;
                    const value = variables.current[formId];
                    const change = (next) => {
                        variables.current[formId] = next;
                        refresh();
                    }

                    if (form.type === 'text') {
                        return <TextField
                            key={formId}
                            promptVar={form}
                            value={value}
                            onChange={change}
                        />
                    }
                    else if (form.type === 'number') {
                        return <NumberField
                            key={formId}
                            promptVar={form}
                            value={value}
                            onChange={change}
                        />
                    }
                    else if (form.type === 'checkbox') {
                        return <CheckBoxField
                            key={formId}
                            promptVar={form}
                            value={value}
                            onChange={change}
                        />
                    }
                    else if (form.type === 'select') {
                        return <SelectField
                            key={formId}
                            promptVar={form}
                            value={value}
                            onChange={change}
                        />
                    }
                    else if (form.type === 'struct') {
                        return <StructField
                            key={formId}
                            promptVar={form}
                            value={value}
                            onChange={change}
                        />
                    }
                    else if (form.type === 'array') {
                        return <ArrayField
                            key={formId}
                            promptVar={form}
                            value={value}
                            onChange={change}
                        />
                    }
                })
            }
            </Column>
        </Modal>
    );
}

export default FormModal;