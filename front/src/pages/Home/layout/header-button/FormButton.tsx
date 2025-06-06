import { GIconButton } from '@/components/GoogleFontIcon';
import { useModal } from '@/hooks/useModal';
import FormModal from '@/modals/FormModal';
import { useProfileAPIStore, useSessionStore } from '@/stores';
import { useEffect, useState } from 'react';

function FormButton() {
    const modal = useModal();
    const { api } = useProfileAPIStore();
    const [showFormButton, setShowFormButton] = useState(false);
    const rt_id = useSessionStore(state => state.rt_id);

    useEffect(() => {
        api.rt(rt_id).getForms()
            .then(forms => {
                setShowFormButton(forms.length > 0);
            })
    }, [rt_id]);

    if (!showFormButton) {
        return <></>;
    }
    else {
        return (
            <GIconButton
                value='edit_note'
                style={{
                    height: '100%',
                    aspectRatio: '1/1',
                    fontSize: '2em',
                }}
                hoverEffect='square'
                onClick={() => {
                    modal.open(FormModal, {})
                }}
            />
        );
    }
}

export default FormButton;