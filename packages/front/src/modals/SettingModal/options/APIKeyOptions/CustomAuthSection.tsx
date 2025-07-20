import { Row } from '@/components/layout';
import { APIKeyMetadata } from '@/types/apikey-metadata';
import APIItem from './APIItem';
import AddAPIKeyButton from './AddAPIKeyButton';
import ProfileEvent from '@/features/profile-event';

interface CustomAuthKeySectionProps {
    title: string;
    addButtonText: string;
    
    apiKeys: APIKeyMetadata[];
}

function CustomAuthSection({ title, apiKeys, addButtonText }: CustomAuthKeySectionProps) {
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
                            await ProfileEvent.auth.remove('custom', index);

                            return true;
                        }}
                        onChangeType={async (typeName) => {
                            await ProfileEvent.auth.changeType('custom', index, typeName);

                            return true;
                        }}
                    />
                ))
            }
            <AddAPIKeyButton
                title={addButtonText}
                onAddAPIKey={async ({ authKey, memo }) => {
                    await ProfileEvent.auth.add('custom', authKey, memo);

                    return true;
                }}
            />
        </>
    );
}

export default CustomAuthSection;