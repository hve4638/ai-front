import type { IACStorage } from 'ac-storage';

import FetchContainer from '@/features/fetch-container';
import MasterKeyManager from '@/features/master-key';
import Profiles from '@/features/profiles';

export let fetchContainer:FetchContainer;
export let profiles:Profiles;
export let globalStorage:IACStorage;
export let masterKeyManager:MasterKeyManager;

export function setRegistry(registry:{
    fetchContainer:FetchContainer,
    profiles:Profiles,
    globalStorage:IACStorage,
    masterKeyManager:MasterKeyManager,
}) {
    fetchContainer = registry.fetchContainer;
    profiles = registry.profiles;
    globalStorage = registry.globalStorage;
    masterKeyManager = registry.masterKeyManager;
}