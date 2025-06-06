import { Profile } from '../profiles';

type SingleAPIKeyMetadata = {
    secret_id: string,
    display_name: string,
    activate: boolean,
    type: 'primary' | 'secondary',
    last_access: number,
}

class ProfileAPIKeyControl {
    constructor(private profile: Profile) {

    }

    async nextAPIKey(provider: 'openai' | 'anthropic' | 'google' | 'vertexai'): Promise<unknown> {
        const secretAC = await this.profile.accessAsSecret('secret.json');
        const dataAC = await this.profile.accessAsJSON('data.json');

        const metadataList: SingleAPIKeyMetadata[] = await dataAC.getOne(`api_keys.${provider}`) ?? [];
        const activated = metadataList.filter(({ activate }) => activate);

        const primaryList = activated.filter(({ type }) => type === 'primary');
        const target = this.findOldestAccessedKey(primaryList);
        if (target) {
            target.last_access = Date.now();
            dataAC.setOne(`api_keys.${provider}`, metadataList);
            return secretAC.getOne(target.secret_id);
        }

        const secondaryList = activated.filter(({ type }) => type === 'secondary');
        const secondaryTarget = this.findOldestAccessedKey(secondaryList);
        if (secondaryTarget) {
            secondaryTarget.last_access = Date.now();
            dataAC.setOne(`api_keys.${provider}`, metadataList);
            return secretAC.getOne(secondaryTarget.secret_id);
        }

        return null;
    }

    private findOldestAccessedKey(metadataList: SingleAPIKeyMetadata[]): SingleAPIKeyMetadata | null {
        if (metadataList.length === 0) return null;

        return metadataList.reduce((oldest, current) => {
            return current.last_access < oldest.last_access ? current : oldest;
        });
    }
}

export default ProfileAPIKeyControl;