import { BrowserWindow } from 'electron';
import { IPCListenerPing } from '@/data';
import ThrottleAction from '@/features/throttle-action';
import runtime from '@/runtime';


// 이건 정상 작동
// type EResult<T> = Promise<readonly [EError] | readonly [null, T]>

// 이건 에러남
// type EResult<T = void> =
//     T extends void
//         ? ENoResult
//         : Promise<readonly [EError] | readonly [null, T]>;

function handler():IPCInvokerProfiles {
    const throttle = ThrottleAction.getInstance();
    
    return {
        /* 프로필 */
        async create() {
            const identifier = await runtime.profiles.createProfile();

            throttle.saveProfiles();
            return [null, identifier] as const;
        },
        async delete(profileName: string) {
            await runtime.profiles.deleteProfile(profileName);
            return [null] as const;
        },

        /* 프로필 목록 */
        async getIds() {
            const ids = runtime.profiles.getProfileIDs();
            const window = BrowserWindow.getFocusedWindow();
            window?.webContents.send(IPCListenerPing.Request, 512, "HELLO?");

            return [null, ids] as const;
        },
        async getLast() {
            const id = runtime.profiles.getLastProfileId();
            
            return [null, id];
        },
        async setLast(id: string | null) {
            runtime.profiles.setLastProfileId(id);

            return [null] as const;
        },
    }
}

export default handler;