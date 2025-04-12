import type { IACStorage } from 'ac-storage';

import FetchContainer from '@/features/fetch-container';
import MasterKeyManager from '@/features/master-key';
import Profiles from '@/features/profiles';
import RTWorker from '@/features/rt-worker';

export let fetchContainer:FetchContainer;
export let profiles:Profiles;
export let globalStorage:IACStorage;
export let masterKeyManager:MasterKeyManager;
export let rtWorker:RTWorker;

export function setRegistry(registry:{
    fetchContainer:FetchContainer,
    profiles:Profiles,
    globalStorage:IACStorage,
    masterKeyManager:MasterKeyManager,
    rtWorker:RTWorker,
}) {
    fetchContainer = registry.fetchContainer;
    profiles = registry.profiles;
    globalStorage = registry.globalStorage;
    masterKeyManager = registry.masterKeyManager;
    rtWorker = registry.rtWorker;
}