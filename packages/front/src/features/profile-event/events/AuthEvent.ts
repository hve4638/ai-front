import { v7 } from 'uuid';

import useProfileAPIStore from '@/stores/useProfileAPIStore';
import useCacheStore from '@/stores/useCacheStore';
import useDataStore from '@/stores/useDataStore';
import { ProfileSessionMetadata } from '@/types';
import { ProviderName } from '../types';

class AuthEvent {
    static async addAuth(provider: ProviderName, apiKey: string, memo: string = '') {
        const { api } = useProfileAPIStore.getState();
        const { api_keys, refetch: refetchData } = useDataStore.getState();

        let secretId: string;
        while (true) {
            secretId = v7();
            const exist = await api.verifyAsSecret('secret.json', [secretId]);
            if (!exist[0]) {
                break;
            }
        }

        const displayName = maskSecret(apiKey);
        await api.setAsSecret('secret.json', [[secretId, apiKey]]);
        await api.set('data.json', {
            api_keys: {
                [provider]: [
                    ...(api_keys[provider] ?? []),
                    {
                        secret_id: secretId,
                        display_name: displayName,
                        activate: true,
                        type: 'primary',
                        last_access: -1,
                        memo: memo,
                    }
                ]
            }
        });
        await refetchData.api_keys();
    }
    static async addVertexAIAuth(data: VertexAIAuth, memo: string = '') {
        const { api } = useProfileAPIStore.getState();
        const { api_keys, refetch: refetchData } = useDataStore.getState();
        const provider: ProviderName = 'vertexai';

        let secretId: string;
        while (true) {
            secretId = v7();
            const exist = await api.verifyAsSecret('secret.json', [secretId]);
            if (!exist[0]) {
                break;
            }
        }

        await api.setAsSecret('secret.json', [[secretId, data]]);
        await api.set('data.json', {
            api_keys: {
                [provider]: [
                    ...(api_keys[provider] ?? []),
                    {
                        secret_id: secretId,
                        display_name: data.project_id,
                        activate: true,
                        type: 'primary',
                        last_access: -1,
                        memo: memo,
                    }
                ]
            }
        });
        await refetchData.api_keys();
    }
    static async removeAuth(provider: ProviderName, index: number) {
        const { api } = useProfileAPIStore.getState();
        const dataState = useDataStore.getState();

        const providerAPIKeysMetadata = dataState.api_keys[provider];
        if (providerAPIKeysMetadata == null) return;

        const target = providerAPIKeysMetadata[index];
        if (target == null) return;

        const next = providerAPIKeysMetadata.filter((_, i) => i !== index);
        const targetSecretId = target.secret_id;
        await api.removeAsSecret('secret.json', [targetSecretId]);
        await api.set('data.json', {
            api_keys: {
                [provider]: next
            }
        });
        await dataState.refetch.api_keys();
    }
    static async changeType(provider: ProviderName, index: number, type: 'primary' | 'secondary') {
        const { api } = useProfileAPIStore.getState();
        const dataState = useDataStore.getState();

        const metadata = dataState.api_keys[provider];
        if (metadata == null) return;

        const target = metadata[index];
        if (target == null) return;
        target.type = type;

        await api.set('data.json', {
            api_keys: {
                [provider]: metadata
            }
        });
        await dataState.refetch.api_keys();
    }
    static async verifyAuth(apiKeyId: string) {
        const { api } = useProfileAPIStore.getState();
        return (await api.verifyAsSecret('secret.json', [apiKeyId]))[0];
    }
}

function maskSecret(key: string) {
    if (key.length <= 8) {
        return '*'.repeat(8);
    }
    if (key.length <= 16) {
        return key.length === 0 ? '' : '*'.repeat(key.length);
    }
    else {
        return `${key.slice(0, 3)}...${key.slice(-4)}`;
    }
}

export default AuthEvent;