import ProfileRT from './ProfileRT'

class RTTemplateBuilder {
    constructor(private rt:ProfileRT) {

    }
    
    async basic() {
        const inputNodeId = await this.rt.addNode('input');
        const promptNodeId = await this.rt.addNode('prompt');
        const chatMLNodeId = await this.rt.addNode('stringify-chatml');
        const outputNodeId = await this.rt.addNode('output');``

        this.rt.setEntrypoint(inputNodeId);
        this.rt.updateNodeOption(promptNodeId, {
            promptId: 'default',
            variables : {}
        });
        this.rt.connectNode({ nodeId: inputNodeId, ifName: 'input' }, { nodeId: promptNodeId, ifName: 'input' });
        this.rt.connectNode({ nodeId: promptNodeId, ifName: 'prompt_message' }, { nodeId: chatMLNodeId, ifName: 'prompt_message' });
        this.rt.connectNode({ nodeId: chatMLNodeId, ifName: 'chatml' }, { nodeId: outputNodeId, ifName: 'output' });
    }
}

export default RTTemplateBuilder;