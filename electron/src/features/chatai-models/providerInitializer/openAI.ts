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
    provider.addModels('GPT-4o',
        [
            model('GPT 4o', 'gpt-4o', { latest, featured }),
            model('GPT 4o (2024-08-06)', 'gpt-4o-2024-08-06', { snapshot }),
            model('GPT 4o (2024-11-20)', 'gpt-4o-2024-11-20', { snapshot }),
            model('GPT 4o (2024-05-13)', 'gpt-4o-2024-05-13', { snapshot }),
            model('ChatGPT 4o', 'chatgpt-4o-latest', { latest, featured }),
        ]
    );
    provider.addModels('GPT-4o mini',
        [
            model('GPT 4o mini', 'gpt-4o-mini', { latest, featured }),
            model('GPT 4o mini (2024-07-18)', 'gpt-4o-mini-2024-07-18', { snapshot }),
        ]
    );
    provider.addModels('o1 / o1-mini',
        [
            model('o1', 'o1', { latest, featured }),
            model('o1 (2024-12-17)', 'o1-2024-12-17', { snapshot }),
            model('o1 mini', 'o1-mini', { latest, featured }),
            model('o1 mini (2024-09-12)', 'o1-mini-2024-09-12', { snapshot }),
            model('o1 preview', 'o1-preview', { latest }),
            model('o1 preview (2024-09-12)', 'o1-preview-2024-09-12', { snapshot }),
        ]
    );
    provider.addModels('GPT-4 Turbo / GPT-4',
        [
            model('GPT 4 Turbo', 'gpt-4-turbo', { latest, featured }),
            model('GPT 4 Turbo (2024-04-09)', 'gpt-4-turbo-2024-04-09', { snapshot }),
            model('GPT 4', 'gpt-4', { latest, featured }),
            model('GPT 4 (0125-preview)', 'gpt-4-0125-preview', { snapshot }),
            model('GPT 4 (1106-preview)', 'gpt-4-1106-preview', { snapshot }),
            model('GPT 4 (0613)', 'gpt-4-0613', { snapshot }),
            model('GPT 4 (0314)', 'gpt-4-0314', { snapshot }),
        ]
    );
    provider.addModels('GPT-3.5 Turbo',
        [
            model('GPT 3.5 Turbo', 'gpt-3.5-turbo', { legacy, latest }),
            model('GPT 3.5 Turbo (0125)', 'gpt-3.5-turbo-0125', { legacy, snapshot }),
            model('GPT 3.5 Turbo (1106)', 'gpt-3.5-turbo-1106', { legacy, snapshot }),
            model('GPT 3.5 Turbo Instruct', 'gpt-3.5-turbo-instruct', { legacy, latest }),
        ]
    );
}
export default initProvider;