import React, { createContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useContextForce } from './useContextForce';
import { ProfileStorageContext } from './ProfileStorageContext';
import { PromptData } from 'types';
import { useTranslation } from 'react-i18next';

interface ProfileRTContextType {
    id: string|undefined;

    getMode():Promise<string>;
    setMode(mode:string):Promise<void>;
    getMetadata():Promise<Record<string, any>>;
    setMetadata(data:KeyValueInput):Promise<void>;

    getIndexData(keys:string[]):Promise<Record<string, any>>;
    setIndexData(data:KeyValueInput):Promise<void>;

    getPromptData(promptId:string, keys:string[]):Promise<Record<string, any>>;
    setPromptData(promptId:string, data:KeyValueInput):Promise<void>;
    
    loadPromptData(promptId:string):Promise<PromptData>;
    savePromptData(promptId:string, data:PromptData):Promise<void>;

    reflectMetadata():Promise<void>;
}

export const ProfileRTContext = createContext<ProfileRTContextType|null>(null);

export function ProfileRTContextProvider({
    children,
}: {
    children:React.ReactNode
}) {
    const { t } = useTranslation();
    const { rtId } = useParams();
    const profileStorage = useContextForce(ProfileStorageContext);
    const rtAPI = useMemo(
        ()=>rtId == null ? null : profileStorage.api.getRT(rtId),
        [rtId, profileStorage.api]
    );

    const values:ProfileRTContextType = {
        id: rtId,

        async getMode() {
            return await rtAPI?.getOne('index.json', 'mode') ?? '';
        },
        async setMode(mode:string) {
            await rtAPI?.setOne('index.json', 'mode', mode);
        },
        async getMetadata() {
            return await rtAPI?.get('index.json', ['name', 'metadata']) ?? {};
        },
        async setMetadata(data:KeyValueInput) {
            await rtAPI?.set('index.json', data);
        },

        async getIndexData(keys:string[]) {
            return await rtAPI?.get('index.json', keys) ?? {};
        },
        async setIndexData(data:KeyValueInput) {
            await rtAPI?.set('index.json', data);
        },

        async getPromptData(promptId:string, keys:string[]) {
            return await rtAPI?.getPromptData(promptId, keys) ?? {};
        },
        async setPromptData(promptId:string, data:KeyValueInput) {
            await rtAPI?.setPromptData(promptId, data);
        },

        async loadPromptData(promptId:string) {
            if (rtAPI == null || rtId == null) {
                throw new Error('rtId is not provided');
            }
            const metadata = await rtAPI.get('index.json', ['name', 'mode'])
            const result = await rtAPI.getPromptData(
                promptId,
                ['contents', 'input_type', 'forms']
            );

            return {
                name: metadata['name'] ?? t('prompt_editor.prompt_default_name'),
                id: rtId,
                forms: result['forms'] ?? [],
                inputType: result['input_type'] ?? 'NORMAL',
                contents: result['contents'] ?? '',
            }
        },
        async savePromptData(promptId:string, data:PromptData) {
            if (rtAPI == null || rtId == null) {
                throw new Error('rtId is not provided');
            }
            
            await rtAPI.set('index.json', { name : data.name });
            await rtAPI.setPromptData(
                promptId,
                {
                    id : data.id,
                    forms : data.forms,
                    input_type : data.inputType,
                    contents : data.contents,
                }
            );
            await rtAPI.reflectMetadata();
        },

        async reflectMetadata() {
            await rtAPI?.reflectMetadata();
        }
    }

    return (
        <ProfileRTContext.Provider
            value={values}
        >
            {children}
        </ProfileRTContext.Provider>
    )
}
