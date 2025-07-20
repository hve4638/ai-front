import useProfileAPIStore from '@/stores/useProfileAPIStore';
import useCacheStore from '@/stores/useCacheStore';
import useDataStore from '@/stores/useDataStore';
import { ProfileSessionMetadata } from '@/types';

class RTEvent {
    static async getRTTree() {
        const { api } = useProfileAPIStore.getState();

        return await api.rts.getTree();
    }
   static async updateRTTree(tree: RTMetadataTree) {
        const { api } = useProfileAPIStore.getState();

        return await api.rts.updateTree(tree);
    }
    static async existsId(id: string) {
        const { api } = useProfileAPIStore.getState();

        return await api.rts.existsId(id);
    }
    static async generateRTId() {
        const { api } = useProfileAPIStore.getState();

        return await api.rts.generateId();
    }


    static async createRT(metadata: RTMetadata, templateId: string = 'empty') {
        const { api } = useProfileAPIStore.getState();

        return await api.rts.createRTUsingTemplate(metadata, templateId);
    }
    static async addRT(metadata: RTMetadata) {
        const { api } = useProfileAPIStore.getState();

        return await api.rts.add(metadata);
    }
    static async removeRT(rtId: string) {
        const { api } = useProfileAPIStore.getState();

        return await api.rts.remove(rtId);
    }
    static async changeRTId(oldId: string, newId: string) {
        const { api } = useProfileAPIStore.getState();

        return await api.rts.changeId(oldId, newId);
    }
    static async renameRT(rtId: string, name: string) {
        const { api } = useProfileAPIStore.getState();

        await api.rt(rtId).setMetadata({ name: name });
        await api.rt(rtId).reflectMetadata();
    }
}

export default RTEvent;