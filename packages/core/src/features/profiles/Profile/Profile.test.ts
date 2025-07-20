import { describe, test } from 'vitest'
import Profile from './Profile';
import { MockMasterKeyManager } from '@/features/masterkey-manager';

describe('Profile', () => {
    const masterKeyGetter = new MockMasterKeyManager();

    test('should create a profile', async () => {
        masterKeyGetter.mockResetKey('123');
        const profile = await Profile.From(null, { masterKeyGetter });

        const modelConfig = await profile.accessAsJSON('model_config.json');

        modelConfig.setOne('google:gemini-2_5-pro', { temperature: 0.7 });
        modelConfig.set({ 'google:gemini-2_5-pro': { temperature: 0.7 } });
    });
});