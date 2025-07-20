import { create } from 'zustand'
import { v7 } from 'uuid';
import i18next from 'i18next';

import useProfileAPIStore from '@/stores/useProfileAPIStore';
import useCacheStore from '@/stores/useCacheStore';
import useDataStore from '@/stores/useDataStore';
import useSessionStore from '@/stores/useSessionStore';
import useSignalStore from '@/stores/useSignalStore';
import { useHistoryStore } from '@/stores/useHistoryStore';
import useMemoryStore from '@/stores/useMemoryStore';

import SessionHistory from '@/features/session-history';

import { ProfileSessionMetadata } from '@/types';

import { PromptVarWithLastValue, ProviderName } from '../types';

class CurrentSessionFormEvent {
    static async getCurrentSessionForms() {
        const { api } = useProfileAPIStore.getState();
        const { rt_id } = useSessionStore.getState();
        const { last_session_id } = useCacheStore.getState();

        if (last_session_id == null) throw new Error('last_session_id is null');

        const rt = api.rt(rt_id);
        const session = api.session(last_session_id);

        const forms: PromptVarWithLastValue[] = await rt.getForms();
        const formValues = await session.getFormValues(rt_id);

        for (const form of forms) {
            form.last_value = formValues[form.id!];
        }
        return forms;
    }

    static async setCurrentSessionForms(values: Record<string, any>) {
        const { api } = useProfileAPIStore.getState();
        const { rt_id } = useSessionStore.getState();
        const { last_session_id } = useCacheStore.getState();

        if (last_session_id == null) throw new Error('last_session_id is null');

        const session = api.session(last_session_id);

        await session.setFormValues(rt_id, values);
    }
}

export default CurrentSessionFormEvent;