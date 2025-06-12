import DivButton from '@/components/DivButton';
import { GIcon } from '@/components/GoogleFontIcon';
import { useModal } from '@/hooks/useModal';
import StringInputModal from '@/modals/StringInputModal';

interface AddAPIKeyButtonProps {
    title: string;
    onAddAPIKey: (apiKey: string) => void;
}

function AddAPIKeyButton({
    title,
    onAddAPIKey = (apiKey:string)=>{}
}:AddAPIKeyButtonProps) {
    const modal = useModal();

    return (
        <DivButton
            center={true}
            onClick={()=>{
                modal.open(StringInputModal, {
                    title,
                    onSubmit : onAddAPIKey,
                    placeholder : 'API 키',
                });
            }}
        >
            <GIcon
                value='add_circle'
                style={{
                    marginRight: '0.25em',
                }}
            />
            <span>새로운 키 입력</span>
        </DivButton>
    )
}

export default AddAPIKeyButton;