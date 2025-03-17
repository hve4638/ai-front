import './chatai-model';
import './prompt-form';
import './rt';
import { IPCInvokerName } from './ipc'

declare global {
    type ElectronResultSync<T> = readonly [Error|null, T];
    type ElectronResult<T> = Promise<readonly [Error]|readonly [null, T]>;
    type ElectronNoResult = Promise<readonly [Error|null]>;

    type KeyValueInput = [string, any][] | Record<string, any>;

    type HistoryCondition = {
        offset? : number;
        limit? : number;
        desc? : boolean;
        flag? : number;
        date_begin? : number;
        date_end? : number;
    }

    /**
     * front로 노출되는 window.electron 인터페이스
     */
    type IPCInterface = {
        [IPCInvokerName.Echo]: (message:string) => ElectronResult<string>;
        [IPCInvokerName.OpenBrowser]: (url:string) => ElectronNoResult;
        [IPCInvokerName.GetChatAIModels]: () => ElectronResult<ChatAIModels>;
    
        /* 마스터 키 */
        [IPCInvokerName.InitMasterKey]: () => ElectronNoResult;
        [IPCInvokerName.CheckMasterKeyExistence]: () => ElectronResult<boolean>;
        [IPCInvokerName.ValidateMasterKey]: () => ElectronResult<boolean>;
        [IPCInvokerName.GenerateMasterKey]: (recoveryKey:string) => ElectronNoResult;
        [IPCInvokerName.ResetMasterKey]: () => ElectronNoResult;
        [IPCInvokerName.RecoverMasterKey]: (recoveryKey:string) => ElectronResult<boolean>;
    
        /* 전역 스토리지 */
        [IPCInvokerName.GetGlobalData]: (storageName:string, keys:string[]) => ElectronResult<any>;
        [IPCInvokerName.SetGlobalData]: (storageName:string, data:KeyValueInput) => ElectronNoResult;
    
        /* 프로필 */
        [IPCInvokerName.CreateProfile]: () => ElectronResult<string>;
        [IPCInvokerName.DeleteProfile]: (profileName:string) => ElectronNoResult;
    
        /* 프로필 목록 */
        [IPCInvokerName.GetProfileList]: () => ElectronResult<string[]>;
        [IPCInvokerName.GetLastProfile]: () => ElectronResult<string|null>;
        [IPCInvokerName.SetLastProfile]: (id:string|null) => ElectronNoResult;
    
        /* 프로필 저장소 */
        [IPCInvokerName.GetProfileData]: (profileId:string, accessor:string, keys:string[]) => ElectronResult<any>;
        [IPCInvokerName.SetProfileData]: (profileId:string, accessor:string, key:KeyValueInput) => ElectronNoResult;
        [IPCInvokerName.GetProfileDataAsText]: (profileId:string, accessor:string) => ElectronResult<string>;
        [IPCInvokerName.SetProfileDataAsText]: (profileId:string, accessor:string, value:string) => ElectronNoResult;
        [IPCInvokerName.GetProfileDataAsBinary]: (profileId:string, accessor:string) => ElectronResult<Buffer>;
        [IPCInvokerName.SetProfileDataAsBinary]: (profileId:string, accessor:string, content:Buffer) => ElectronNoResult;
    
        /* 프로필 RT */
        [IPCInvokerName.GetProfileRTTree]: (profileId:string) => ElectronResult<RTMetadataTree>;
        [IPCInvokerName.UpdateProfileRTTree]: (profileId:string, tree:RTMetadataTree) => ElectronNoResult;
        [IPCInvokerName.AddProfileRT]: (profileId:string, rt:RTMetadata) => ElectronNoResult;
        [IPCInvokerName.RemoveProfileRT]: (profileId:string, rtId:string) => ElectronNoResult;
        [IPCInvokerName.GetProfileRTMode]: (profileId:string, rtId:string) => ElectronResult<RTMode>;
        [IPCInvokerName.SetProfileRTMode]: (profileId:string, rtId:string, mode:RTMode) => ElectronNoResult;
        [IPCInvokerName.GetProfileRTPromptData]: (profileId:string, rtId:string, promptId:string, data:string[]) => ElectronResult<Record<string, any>>;
        [IPCInvokerName.SetProfileRTPromptData]: (profileId:string, rtId:string, promptId:string, data:KeyValueInput) => ElectronNoResult;
        [IPCInvokerName.HasProfileRTId]: (profileId:string, rtId:string) => ElectronResult<boolean>;
        [IPCInvokerName.GenerateProfileRTId]: (profileId:string) => ElectronResult<string>;
        [IPCInvokerName.ChangeProfileRTId]: (profileId:string, oldRTId:string, newRTId:string) => ElectronNoResult;
        [IPCInvokerName.GetProfileRTData]: (profileId:string, rtId:string, accessor:string, keys:string[]) => ElectronResult<Record<string, any>>;
        [IPCInvokerName.SetProfileRTData]: (profileId:string, rtId:string, accessor:string, key:KeyValueInput) => ElectronNoResult;
        [IPCInvokerName.ReflectProfileRTMetadata]: (profileId:string, rtId:string) => ElectronNoResult;

        /* 프로필 RT 요청 */
        [IPCInvokerName.RequestProfileRT]: (profileId:string, rtId:string, input:RTInput) => ElectronResult<string>;
    
        /* 프로필 세션 */
        [IPCInvokerName.AddProfileSession]: (profileId:string) => ElectronResult<string>;
        [IPCInvokerName.RemoveProfileSession]: (profileId:string, sessionId:string) => ElectronNoResult;
        [IPCInvokerName.UndoRemoveProfileSession]: (profileId:string) => ElectronResult<string>;
        [IPCInvokerName.ReorderProfileSessions]: (profileId:string, sessions:string[]) => ElectronNoResult;
        [IPCInvokerName.GetProfileSessionIds]: (profileId:string) => ElectronResult<string[]>;
        
        /* 프로필 세션 저장소 */
        [IPCInvokerName.GetProfileSessionData]: (profileId:string, sessionId:string, accessor:string, keys:string[]) => ElectronResult<any>;
        [IPCInvokerName.SetProfileSessionData]: (profileId:string, sessionId:string, accessor:string, key:KeyValueInput) => ElectronNoResult;
    
        /* 프로필 세션 히스토리 */
        [IPCInvokerName.GetProfileSessionHistory]: (profileId:string, sessionId:string, condition:HistoryCondition) => ElectronResult<any>;
        [IPCInvokerName.AddProfileSessionHistory]: (profileId:string, sessionId:string, history:any) => ElectronNoResult;
        [IPCInvokerName.DeleteProfileSessionHistory]: (profileId:string, sessionId:string, historyKey:number) => ElectronNoResult;
        [IPCInvokerName.DeleteAllProfileSessionHistory]: (profileId:string, sessionId:string) => ElectronNoResult;
    }
}


export {};