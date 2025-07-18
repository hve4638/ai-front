function model(value: string): Omit<ChatAIModel, 'id'>;
function model(name: string, value: string): Omit<ChatAIModel, 'id'>;
function model(name: string, value: string, flags: ChatAIModelFlags): Omit<ChatAIModel, 'id'>;
function model(value: string, flags: ChatAIModelFlags): Omit<ChatAIModel, 'id'>;

function model(
    displayName: string,
    arg1?: string | ChatAIModelFlags | undefined,
    arg2?: ChatAIModelFlags | undefined
): Omit<ChatAIModel, 'id' | 'providerName' | 'providerDisplayName'> {
    let name: string;
    let flags: ChatAIModelFlags;
    if (typeof (arg1) === 'string') {
        name = arg1;
        if (arg2) {
            flags = arg2;
        }
        else {
            flags = {};
        }
    }
    else if (typeof (arg1) === 'object') {
        name = displayName;
        flags = arg1;
    }
    else {
        name = displayName;
        flags = {};
    }

    return { name, displayName, flags };
}

export default model;