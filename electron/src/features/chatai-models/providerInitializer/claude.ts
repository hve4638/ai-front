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
            model('Claude 3.5 Sonnet', 'claude-3-5-sonnet-latest', { latest, featured }),
            model('Claude 3.5 Sonnet (20241022)', 'claude-3-5-sonnet-20241022', { snapshot }),
            model('Claude 3.5 Sonnet (20240620)', 'claude-3-5-sonnet-20240620', { snapshot }),
        ]
    );
    provider.addModels('Claude 3.5 Haiku',
        [
            model('Claude 3.5 Haiku (20241022)', 'claude-3-5-haiku-20241022', { featured, snapshot }),
        ]
    );
    provider.addModels('Claude 3 Opus',
        [
            model('Claude 3 Opus', 'claude-3-opus-latest', { featured, latest }),
            model('Claude 3 Opus (20240229)', 'claude-3-opus-20240229', { snapshot }),
        ]
    );
    provider.addModels('Claude 3 Sonnet',
        [
            model('Claude 3 Sonnet', 'claude-3-sonnet-20240229', { latest, snapshot }),
        ]
    );
    provider.addModels('Claude 3 Haiku',
        [
            model('Claude 3 Haiku', 'claude-3-haiku-20240307', { latest, snapshot }),
        ]
    );
}

export default initProvider;