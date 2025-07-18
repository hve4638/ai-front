import { Row } from '@/components/layout';
import { useProfileEvent } from '@/stores';
import { APIKeyMetadata } from '@/types/apikey-metadata';
import APIItem from './APIItem';
import AddAPIKeyButton from './AddAPIKeyButton';

interface SingleAPIKeySectionProps {
    title: string;
    provider: 'openai'|'anthropic'|'google'|'vertexai';

    addButtonText: string;
    
    apiKeys: APIKeyMetadata[];
}

function SingleAPIKeySection({ title, provider, addButtonText, apiKeys }: SingleAPIKeySectionProps) {
    const profile = useProfileEvent();

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
                            await profile.removeAPIKey(provider, index);

                            return true;
                        }}
                        onChangeType={async (type) => {
                            await profile.changeAPIKeyType(provider, index, type);

                            return true;
                        }}
                    />
                ))
            }
            <AddAPIKeyButton
                title={addButtonText}
                onAddAPIKey={async ({ authKey, memo }) => {
                    await profile.addAuthKey(provider, authKey, memo);

                    return true;
                }}
            />
        </>
    );
}

export default SingleAPIKeySection;