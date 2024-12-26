import ModelProvider from "../ModelProvider";
import model from "./model";

const legacy = true;
const experimental = true;
const deprecated = true;
const stable = true;
const latest = true;
const featured = true;
const snapshot = true;

function initProvider(provider:ModelProvider) {
    provider.addModels('Sonnet 3.5 Sonnet',
        [
            model('claude-3-5-sonnet@20240620', { featured }),
        ]
    );
    provider.addModels('Claude 3.5 Haiku',
        [
            model('claude-3-5-haiku@20241022', { featured }),
        ]
    );
    provider.addModels('Claude 3 Opus',
        [
            model('claude-3-opus@20240229', { featured }),
        ]
    );
    provider.addModels('Claude 3 Sonnet',
        [
            model('claude-3-sonnet@20240229', {}),
        ]
    );
    provider.addModels('Claude 3 Haiku',
        [
            model('claude-3-haiku@20240307', {}),
        ]
    );
}

export default initProvider;