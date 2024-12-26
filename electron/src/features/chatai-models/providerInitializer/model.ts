function model(value:string):Omit<ChatAIModel, 'id'>;
function model(name:string, value:string):Omit<ChatAIModel, 'id'>;
function model(name:string, value:string, flags:ChatAIModelFlags):Omit<ChatAIModel, 'id'>;
function model(value:string, flags:ChatAIModelFlags):Omit<ChatAIModel, 'id'>;

function model(
    name:string,
    arg1?:string|ChatAIModelFlags|undefined,
    arg2?:ChatAIModelFlags|undefined
):Omit<ChatAIModel, 'id'> {
    let value:string;
    let flags:ChatAIModelFlags;
    if (typeof(arg1) === 'string') {
        value = arg1;
        if (arg2) {
            flags = arg2;
        }
        else {
            flags = {};
        }
    }
    else if (typeof(arg1) === 'object') {
        value = name;
        flags = arg1;
    }
    else {
        value = name;
        flags = {};
    }

    return { name, value, flags };
}

export default model;