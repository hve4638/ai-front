import { create } from 'zustand'
import { RefetchMethods, UpdateMethods } from './types';
import { profileStoreTool, sessionStoreTool } from './utils';
import ProfilesAPI, { type ProfileAPI } from '@/api/profiles';
import RequestManager from '@/features/request-manager';
import useSignalStore from './useSignalStore';
import useChannelStore from './useChannelStore';
import { HistoryData } from '@/features/session-history';
import useCacheStore from './useCacheStore';

interface SessionCacheFields {
    input: string;
    output: string;
    last_history: HistoryData | null;

    state: 'loading' | 'idle' | 'error' | 'done';
    markdown: boolean;
}

interface SessionConfigFields {
    name: string | null;
    model_id: string;
    rt_id: string;
    color: string;
}

interface SessionManagedFields {
    input_files: InputFilePreview[];
    cached_thumbnails: Record<string, string|null>;
}

const defaultCache: SessionCacheFields = {
    input: '',
    output: '',
    last_history: null,
    state: 'idle',
    markdown: true,
}
const defaultConfig: SessionConfigFields = {
    name: null,
    model_id: '',
    rt_id: '',
    color: 'default',
}
const defaultManaged: SessionManagedFields = {
    input_files: [],
    cached_thumbnails: {},
}

type SessionFields = SessionCacheFields & SessionConfigFields;

interface SessionState extends SessionFields, SessionManagedFields {
    actions: {
        request(): Promise<void>;
        abortRequest(): Promise<void>;

        addInputFile(filename: string, base64Data: string): Promise<void>;
        updateInputFiles(fileHashes: InputFileHash[]): Promise<void>;
        refetchInputFiles(): Promise<void>;
    };
    deps: {
        api: ProfileAPI;
        last_session_id: string | null;
    };
    updateDeps: {
        api(data: ProfileAPI): void;
        last_session_id(id: string | null): void;
    };
    update: UpdateMethods<SessionFields>;
    refetch: RefetchMethods<SessionFields>;
    refetchAll: () => Promise<void>;
}

export const useSessionStore = create<SessionState>((set, get) => {
    const {
        update: updateCache,
        refetch: refetchCache,
        refetchAll: refetchAllCache
    } = sessionStoreTool<SessionCacheFields>(set, get, 'cache.json', defaultCache);
    const {
        update: updateConfig,
        refetch: refetchConfig,
        refetchAll: refetchAllConfig
    } = sessionStoreTool<SessionConfigFields>(set, get, 'config.json', defaultConfig);

    return {
        ...defaultCache,
        ...defaultConfig,
        ...defaultManaged,

        actions: {
            request: async () => {
                const {
                    api,
                } = get().deps;
                const { last_session_id } = useCacheStore.getState();
                if (api.isMock()) {
                    console.warn('API is not initialized. Request is ignored.');
                    return;
                }
                if (!last_session_id) return;

                const { signal } = useSignalStore.getState()
                const { reset: resetChannel } = useChannelStore.getState();

                const readyCh = resetChannel.request_ready();

                signal.request();
                await readyCh.consume();

                RequestManager.request(api.id, last_session_id);
            },
            abortRequest: async () => {

            },

            addInputFile: async (filename: string, base64Data: string) => {
                const { deps, input_files, cached_thumbnails } = get();
                if (!deps.last_session_id) {
                    console.warn('No session ID available for uploading input file.');
                    return;
                }

                const metadata = await deps.api.session(deps.last_session_id).inputFiles.add(filename, base64Data);
                const next:InputFilePreview[] = [...input_files];
                next.push({
                    filename: metadata.filename,
                    size: metadata.size,
                    type: metadata.type,
                    hash_sha256: metadata.hash_sha256,
                    thumbnail: metadata.thumbnail,
                });

                cached_thumbnails[metadata.hash_sha256] = metadata.thumbnail;
                set({ input_files: next });
            },
            updateInputFiles: async (fileHashes: InputFileHash[]) => {
                const { deps, input_files, cached_thumbnails } = get();
                if (!deps.last_session_id) {
                    console.warn('No session ID available for uploading input file.');
                    return;
                }
                
                const { updated, removed } = await deps.api.session(deps.last_session_id).inputFiles.update(fileHashes);
                
                const next:InputFilePreview[] = [];
                for (const metadata of updated) {
                    const file = input_files.find(f => f.hash_sha256 === metadata.hash_sha256);
                    if (file) {
                        next.push({
                            filename: metadata.filename,
                            size: metadata.size,
                            type: metadata.type,
                            hash_sha256: metadata.hash_sha256,
                            thumbnail: file.thumbnail,
                        });
                    }
                }
                for (const file of removed) {
                    if (file.hash_sha256 in cached_thumbnails) {
                        delete cached_thumbnails[file.hash_sha256];
                    }
                }
                
                set({ input_files: next });
            },
            refetchInputFiles: async () => {
                const { deps, cached_thumbnails } = get();
                const { last_session_id } = useCacheStore.getState();
                if (!last_session_id) {
                    console.warn('No session ID available for fetching input files.');
                    return;
                }

                console.log('Refetching input files for session:', last_session_id);

                const hashes = Object.keys(cached_thumbnails);
                const files = await deps.api.session(last_session_id).inputFiles.getPreviews();
                const next: InputFile[] = files.map(f => {
                    const file:Partial<InputFilePreview> = {
                        filename: f.filename,
                        size: f.size,
                        type: f.type,
                        hash_sha256: f.hash_sha256,
                        thumbnail: f.thumbnail,
                    }
                    return file as InputFile;
                });

                set({ input_files: next });
            },
        },
        deps: {
            last_session_id: null,
            api: ProfilesAPI.getMockProfile(),
        },
        updateDeps: {
            last_session_id: (id: string | null) => set({ deps: { ...get().deps, last_session_id: id } }),
            api: (api: ProfileAPI) => set({ deps: { ...get().deps, api } }),
        },
        update: {
            ...updateCache,
            ...updateConfig
        },
        refetch: {
            ...refetchCache,
            ...refetchConfig
        },
        refetchAll: async () => {
            const { actions } = get();
            await Promise.all([
                refetchAllCache(),
                refetchAllConfig(),
                actions.refetchInputFiles(),
            ]);
            
            console.log('GET:', get());
        }
    };
});

export default useSessionStore;