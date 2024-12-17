import {
    ChatSessionTab,
    ChatSessionData,
} from './types';
import LocalAPI from 'api/local';
import {
    PROFILE_CACHE,
    PROFILE_CONFIG,
    PROFILE_DATA,
} from 'api/local/types';

class Sessions {
    #sessionTabs: ChatSessionTab[] = [];

    constructor(profileName:string) {
        LocalAPI.loadProfileValue(profileName, PROFILE_DATA, 'tab/');
    }

    getTab(index: number): ChatSessionTab|undefined {
        return this.#sessionTabs[index];
    }

    getTabs(): ChatSessionTab[] {
        return [...this.#sessionTabs];
    }
}

export default Sessions;