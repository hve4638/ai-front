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
    provider.addModels('Gemini 2.0 Flash',
        [
            model('Gemini 2.0 Flash Exp', 'gemini-2.0-flash-exp', { latest, featured, experimental }),
            model('Gemini 2.0 Flash Thinking Exp', 'gemini-2.0-flash-thinking-exp', { latest, featured, experimental }),
            model('Gemini 2.0 Flash Thinking Exp (1219)', 'gemini-2.0-flash-thinking-exp-1219', { snapshot, experimental }),
            
        ]
    );
    provider.addModels('Gemini Experimental', 
        [
            model('Gemini Exp (1206)', 'gemini-exp-1206', { experimental, snapshot }),
            model('Gemini Exp (1121)', 'gemini-exp-1121', { experimental, snapshot, deprecated }),
            model('Gemini Exp (1114)', 'gemini-exp-1114', { experimental, snapshot, deprecated }),
        ]
    );
    provider.addModels('Gemini 1.5 Pro',
        [
            model('Gemini 1.5 Pro', 'gemini-1.5-pro-latest', { featured, latest }),
            model('Gemini 1.5 Pro (stable)', 'gemini-1.5-pro', { featured }),
            model('Gemini 1.5 Pro 002', 'gemini-1.5-pro-002', { snapshot }),
            model('Gemini 1.5 Pro 001', 'gemini-1.5-pro-001', { snapshot }),
        ]
    );
    provider.addModels('Gemini 1.5 Flash',
        [
            model('Gemini 1.5 Flash', 'gemini-1.5-flash-latest', { featured, latest }),
            model('Gemini 1.5 Flash (stable)', 'gemini-1.5-flash', { featured }),
            model('Gemini 1.5 Flash 002', 'gemini-1.5-flash-002', { snapshot }),
            model('Gemini 1.5 Flash 001', 'gemini-1.5-flash-001', { snapshot }),
        ]
    );
    provider.addModels('Gemini 1.5 Flash-8B',
        [
            model('Gemini 1.5 Flash 8B', 'gemini-1.5-flash-8b-latest', { featured, latest }),
            model('Gemini 1.5 Flash 8B (stable)', 'gemini-1.5-flash-8b', { featured }),
            model('Gemini 1.5 Flash 8B 001', 'gemini-1.5-flash-8b-001', { snapshot }),
        ]
    );
}

export default initProvider;