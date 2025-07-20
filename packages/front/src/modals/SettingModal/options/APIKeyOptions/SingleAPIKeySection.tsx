import { Row } from '@/components/layout';
import { APIKeyMetadata } from '@/types/apikey-metadata';
import APIItem from './APIItem';
import AddAPIKeyButton from './AddAPIKeyButton';
import ProfileEvent from '@/features/profile-event';

interface SingleAPIKeySectionProps {
    title: string;
    provider: 'openai'|'anthropic'|'google'|'vertexai';

    addButtonText: string;
    
    apiKeys: APIKeyMetadata[];
}

function SingleAPIKeySection({ title, provider, addButtonText, apiKeys }: SingleAPIKeySectionProps) {
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
                            await ProfileEvent.auth.remove(provider, index);

                            return true;
                        }}
                        onChangeType={async (type) => {
                            await ProfileEvent.auth.changeType(provider, index, type);

                            return true;
                        }}
                    />
                ))
            }
            <AddAPIKeyButton
                title={addButtonText}
                onAddAPIKey={async ({ authKey, memo }) => {
                    await ProfileEvent.auth.add(provider, authKey, memo);

                    return true;
                }}
            />
        </>
    );
}

export default SingleAPIKeySection;