import { Align, Flex, Row } from '@/components/layout';
import { APIKeyMetadata } from '@/types/apikey-metadata';

import DivButton from '@/components/DivButton';
import { GIcon } from '@/components/GoogleFontIcon';
import { useModal } from '@/hooks/useModal';

import APIItem from './APIItem';
import AddVertexAPIModal from './AddVertexAPIModal';
import ProfileEvent from '@/features/profile-event';

interface SingleAPIKeySectionProps {
    title: string;

    addButtonText: string;
    
    apiKeys: APIKeyMetadata[];
}

function VertexAIAPIKeySection({ title, addButtonText, apiKeys }: SingleAPIKeySectionProps) {
    return (
        <>
            <Row>
                <b className='undraggable'>{title}</b>
            </Row>
            <div style={{ height: '0.25em' }} />
            {
                apiKeys.map((item, index) => (
                    <APIItem
                        key={item.secret_id}
                        item={item}
                        onDelete={async () => {
                            await ProfileEvent.auth.remove('vertexai', index);

                            return true;
                        }}
                        onChangeType={async (type) => {
                            await ProfileEvent.auth.changeType('vertexai', index, type);

                            return true;
                        }}
                    />
                ))
            }
            <AddVertexAIKeyButton
                title={addButtonText}
                onAddAPIKey={async (data) => {
                    await ProfileEvent.auth.addVertexAI(data);

                    return true;
                }}
            />
        </>
    );
}

interface AddVertexAIKeyButtonProps {
    title: string;
    onAddAPIKey: (data: VertexAIAuth) => void;
}

function AddVertexAIKeyButton({
    title,
    onAddAPIKey
}:AddVertexAIKeyButtonProps) {
    const modal = useModal();

    return (
        <DivButton
            center={true}
            onClick={()=>{
                modal.open(AddVertexAPIModal, {
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

export default VertexAIAPIKeySection;