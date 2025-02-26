import './chatai-model';
import './prompt-var';
import './rt';
import { IPCCommand } from './ipc-command'

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

    type IPCInterface = {
        [IPCCommand.Echo]: (message:string) => ElectronResult<string>;
        [IPCCommand.OpenBrowser]: (url:string) => ElectronNoResult;
        [IPCCommand.GetChatAIModels]: () => ElectronResult<ChatAIModels>;
    
        /* 마스터 키 */
        [IPCCommand.InitMasterKey]: () => ElectronNoResult;
        [IPCCommand.CheckMasterKeyExistence]: () => ElectronResult<boolean>;
        [IPCCommand.ValidateMasterKey]: () => ElectronResult<boolean>;
        [IPCCommand.GenerateMasterKey]: (recoveryKey:string) => ElectronNoResult;
        [IPCCommand.ResetMasterKey]: () => ElectronNoResult;
        [IPCCommand.RecoverMasterKey]: (recoveryKey:string) => ElectronResult<boolean>;
    
        /* 전역 스토리지 */
        [IPCCommand.GetGlobalData]: (storageName:string, keys:string[]) => ElectronResult<any>;
        [IPCCommand.SetGlobalData]: (storageName:string, data:KeyValueInput) => ElectronNoResult;
    
        /* 프로필 */
        [IPCCommand.CreateProfile]: () => ElectronResult<string>;
        [IPCCommand.DeleteProfile]: (profileName:string) => ElectronNoResult;
    
        /* 프로필 목록 */
        [IPCCommand.GetProfileList]: () => ElectronResult<string[]>;
        [IPCCommand.GetLastProfile]: () => ElectronResult<string|null>;
        [IPCCommand.SetLastProfile]: (id:string|null) => ElectronNoResult;
    
        /* 프로필 저장소 */
        [IPCCommand.GetProfileData]: (profileId:string, accessor:string, keys:string[]) => ElectronResult<any>;
        [IPCCommand.SetProfileData]: (profileId:string, accessor:string, key:KeyValueInput) => ElectronNoResult;
        [IPCCommand.GetProfileDataAsText]: (profileId:string, accessor:string) => ElectronResult<string>;
        [IPCCommand.SetProfileDataAsText]: (profileId:string, accessor:string, value:string) => ElectronNoResult;
        [IPCCommand.GetProfileDataAsBinary]: (profileId:string, accessor:string) => ElectronResult<Buffer>;
        [IPCCommand.SetProfileDataAsBinary]: (profileId:string, accessor:string, content:Buffer) => ElectronNoResult;
    
        /* 프로필 요청 템플릿 */
        [IPCCommand.GetProfileRTTree]: (profileId:string) => ElectronResult<RTMetadataTree>;
        [IPCCommand.UpdateProfileRTTree]: (profileId:string, tree:RTMetadataTree) => ElectronNoResult;
        [IPCCommand.AddProfileRT]: (profileId:string, rt:any) => ElectronNoResult;
        [IPCCommand.RemoveProfileRT]: (profileId:string, rtId:string) => ElectronNoResult;
        [IPCCommand.GetProfileRTMode]: (profileId:string, rtId:string) => ElectronResult<RTMode>;
        [IPCCommand.SetProfileRTMode]: (profileId:string, rtId:string, mode:RTMode) => ElectronNoResult;
        [IPCCommand.GetProfileRTPromptData]: (profileId:string, rtId:string, promptId:string, data:string[]) => ElectronResult<Record<string, any>>;
        [IPCCommand.SetProfileRTPromptData]: (profileId:string, rtId:string, promptId:string, data:KeyValueInput) => ElectronNoResult;
        [IPCCommand.HasProfileRTId]: (profileId:string, rtId:string) => ElectronResult<boolean>;
        [IPCCommand.GenerateProfileRTId]: (profileId:string) => ElectronResult<string>;
        [IPCCommand.ChangeProfileRTId]: (profileId:string, oldRTId:string, newRTId:string) => ElectronNoResult;
        [IPCCommand.GetProfileRTData]: (profileId:string, rtId:string, accessor:string, keys:string[]) => ElectronResult<Record<string, any>>;
        [IPCCommand.SetProfileRTData]: (profileId:string, rtId:string, accessor:string, key:KeyValueInput) => ElectronNoResult;
    
        /* 프로필 세션 */
        [IPCCommand.AddProfileSession]: (profileId:string) => ElectronResult<string>;
        [IPCCommand.RemoveProfileSession]: (profileId:string, sessionId:string) => ElectronNoResult;
        [IPCCommand.UndoRemoveProfileSession]: (profileId:string) => ElectronResult<string>;
        [IPCCommand.ReorderProfileSessions]: (profileId:string, sessions:string[]) => ElectronNoResult;
        [IPCCommand.GetProfileSessionIds]: (profileId:string) => ElectronResult<string[]>;
        
        /* 프로필 세션 저장소 */
        [IPCCommand.GetProfileSessionData]: (profileId:string, sessionId:string, accessor:string, keys:string[]) => ElectronResult<any>;
        [IPCCommand.SetProfileSessionData]: (profileId:string, sessionId:string, accessor:string, key:KeyValueInput) => ElectronNoResult;
    
        /* 프로필 세션 히스토리 */
        [IPCCommand.GetProfileSessionHistory]: (profileId:string, sessionId:string, condition:HistoryCondition) => ElectronResult<any>;
        [IPCCommand.AddProfileSessionHistory]: (profileId:string, sessionId:string, history:any) => ElectronNoResult;
        [IPCCommand.DeleteProfileSessionHistory]: (profileId:string, sessionId:string, historyKey:number) => ElectronNoResult;
        [IPCCommand.DeleteAllProfileSessionHistory]: (profileId:string, sessionId:string) => ElectronNoResult;
    }
}


export {};