import type { IStorage } from '@hve/fs-storage';

import FetchContainer from '@features/fetch-container';
import UniqueKeyManager from '@features/unique-key';
import Profiles from '@features/profiles';

export let fetchContainer:FetchContainer;
export let profiles:Profiles;
export let globalStorage:IStorage;
export let uniqueKeyManager:UniqueKeyManager;

export function setRegistry(registry:{
    fetchContainer:FetchContainer,
    profiles:Profiles,
    globalStorage:IStorage,
    uniqueKeyManager:UniqueKeyManager,
}) {
    fetchContainer = registry.fetchContainer;
    profiles = registry.profiles;
    globalStorage = registry.globalStorage;
    uniqueKeyManager = registry.uniqueKeyManager;
}