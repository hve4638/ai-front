import * as utils from '@utils';
import { IPCInvokerName } from 'types';

import runtime from '@/runtime';
import Profile from '@/features/profiles/Profile';
import { BrowserWindow } from 'electron';
import { IPCListenerPing } from '@/data';

function handler() {
    const throttles = {};

    const saveProfile = (profile:Profile) => {
        const throttleId = `profile_${profile.path}`;
        throttles[throttleId] ??= utils.throttle(500);
        throttles[throttleId](()=>{
            profile.commit();
        });
    }

    return {
        /* 프로필 */
        [IPCInvokerName.CreateProfile]: async () => {
            const identifier = await runtime.profiles.createProfile();

            throttles['profiles'] ??= utils.throttle(500);
            throttles['profiles'](() => {
                runtime.profiles.saveAll();
            });

            return [null, identifier] as const;
        },
        [IPCInvokerName.DeleteProfile]: async (profileName: string) => {
            await runtime.profiles.deleteProfile(profileName);
            return [null] as const;
        },

        /* 프로필 목록 */
        [IPCInvokerName.GetProfileList]: async () => {
            const ids = runtime.profiles.getProfileIDs();
            const window = BrowserWindow.getFocusedWindow();
            window?.webContents.send(IPCListenerPing.Request, 512, "HELLO?");

            return [null, ids] as const;
        },
        [IPCInvokerName.GetLastProfile]: async () => {
            const ids = runtime.profiles.getLastProfileId();

            return [null, ids] as const;
        },
        [IPCInvokerName.SetLastProfile]: async (id: string | null) => {
            runtime.profiles.setLastProfileId(id);

            return [null] as const;
        },
        
        /* 프로필 저장소 */
        [IPCInvokerName.GetProfileData]: async (profileId: string, id: string, keys: string[]) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsJSON(id);
            const value = accessor.get(...keys);
            if (id === 'data.json') {
                console.log(`data.json id: `, JSON.stringify(value));
            }
            return [null, value] as const;
        },
        [IPCInvokerName.SetProfileData]: async (profileId: string, id: string, data: KeyValueInput) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsJSON(id);
            accessor.set(data);

            saveProfile(profile);
            return [null] as const;
        },
        // [IPCInvokerName.PushProfileDataToArray]: async (profileId: string, id: string, data: KeyValueInput) => {
        //     const profile = profiles.getProfile(profileId);
        //     const accessor = await profile.accessAsJSON(id);
        //     const names = accessor.pushToArray(data);

        //     saveProfile(profile);
        //     return [null, names] as const;
        // },
        [IPCInvokerName.GetProfileDataAsText]: async (profileId: string, id: string) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsText(id);
            return [null, await accessor.read()] as const;
        },
        [IPCInvokerName.SetProfileDataAsText]: async (profileId: string, id: string, value: any) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsText(id);
            accessor.write(value);

            return [null] as const;
        },
        [IPCInvokerName.GetProfileDataAsBinary]: async (profileId: string, id: string) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsBinary(id);
            return [null, await accessor.read()] as const;
        },
        [IPCInvokerName.SetProfileDataAsBinary]: async (profileId: string, id: string, content: Buffer) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsBinary(id);
            accessor.write(content);

            return [null] as const;
        },
        [IPCInvokerName.SetProfileDataAsSecret]: async (profileId: string, id: string, data: KeyValueInput) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsSecret(id);
            accessor.set(data);

            saveProfile(profile);
            return [null] as const;
        },
        [IPCInvokerName.VerifyProfileDataAsSecret]: async (profileId: string, id: string, keys: string[]) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsSecret(id);
            const result = accessor.exists(keys);

            saveProfile(profile);
            return [null, result] as const;
        },
        [IPCInvokerName.RemoveProfileDataAsSecret]: async (profileId: string, id: string, keys: string[]) => {
            const profile = await runtime.profiles.getProfile(profileId);
            const accessor = await profile.accessAsSecret(id);
            accessor.remove(keys);

            saveProfile(profile);
            return [null] as const;
        },
        // [IPCInvokerName.PushProfileDataToArrayAsSecret]: async (profileId: string, id: string, data: KeyValueInput) => {
        //     const profile = profiles.getProfile(profileId);
        //     const accessor = await profile.accessAsSecret(id);
        //     const names = accessor.pushToArray(data);

        //     saveProfile(profile);
        //     return [null, names] as const;
        // }
    }
}

export default handler;