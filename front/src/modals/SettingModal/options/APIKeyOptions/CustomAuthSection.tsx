import { Row } from '@/components/layout';
import { useProfileEvent } from '@/stores';
import { APIKeyMetadata } from '@/types/apikey-metadata';
import APIItem from './APIItem';
import AddAPIKeyButton from './AddAPIKeyButton';

interface CustomAuthKeySectionProps {
    title: string;
    addButtonText: string;
    
    apiKeys: APIKeyMetadata[];
}

function CustomAuthSection({ title, apiKeys, addButtonText }: CustomAuthKeySectionProps) {
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
                            await profile.removeAPIKey('custom', index);

                            return true;
                        }}
                        onChangeType={async (type) => {
                            await profile.changeAPIKeyType('custom', index, type);

                            return true;
                        }}
                    />
                ))
            }
            <AddAPIKeyButton
                title={addButtonText}
                onAddAPIKey={async ({ authKey, memo }) => {
                    await profile.addAuthKey('custom', authKey, memo);

                    return true;
                }}
            />
        </>
    );
}

export default CustomAuthSection;