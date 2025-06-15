import ModelProvider from "../ModelProvider";
import model from "../model";
import flags from '../flags';

const {
    latest,
    featured,
    deprecated,
    high_cost,
    snapshot,
    chat_completions_api,
    responses_api,
} = flags;

function initProvider(provider:ModelProvider) {
    const resBaseFlags = { responses_api };
    const ccBaseFlags = { chat_completions_api };

    provider.addModels('ChatGPT-4o',
        [
            model('ChatGPT 4o', 'chatgpt-4o-latest', { latest, featured, ...ccBaseFlags }),
        ]
    );
    provider.addModels('GPT-4o',
        [
            model('GPT 4o', 'gpt-4o', { latest, featured, ...ccBaseFlags }),
            model('GPT 4o (2024-11-20)', 'gpt-4o-2024-11-20', { snapshot, ...ccBaseFlags }),
            model('GPT 4o (2024-08-06)', 'gpt-4o-2024-08-06', { snapshot, ...ccBaseFlags }),
            model('GPT 4o (2024-05-13)', 'gpt-4o-2024-05-13', { snapshot, ...ccBaseFlags }),
            model('GPT 4o mini', 'gpt-4o-mini', { latest, featured, ...ccBaseFlags }),
            model('GPT 4o mini (2024-07-18)', 'gpt-4o-mini-2024-07-18', { snapshot, ...ccBaseFlags }),
        ]
    );
    provider.addModels('GPT-4.1',
        [
            model('GPT 4.1', 'gpt-4.1', { latest, featured, ...ccBaseFlags }),
            model('GPT 4.1 (2025-04-14)', 'gpt-4.1-2025-04-14', { snapshot, ...ccBaseFlags }),
            model('GPT 4.1 mini', 'gpt-4.1-mini', { latest, featured, ...ccBaseFlags }),
            model('GPT 4.1 mini (2025-04-14)', 'gpt-4.1-mini-2025-04-14', { snapshot, ...ccBaseFlags }),
            model('GPT 4.1 nano', 'gpt-4.1-nano', { latest, ...ccBaseFlags }),
            model('GPT 4.1 nano (2025-04-14)', 'gpt-4.1-nano-2025-04-14', { snapshot, ...ccBaseFlags }),
        ]
    );
    provider.addModels('o4',
        [
            model('o4 mini', 'o4-mini', { latest, featured, ...resBaseFlags }),
            model('o4 mini (2025-04-16)', 'o4-mini-2025-04-16', { snapshot, ...resBaseFlags }),
        ]
    );
    provider.addModels('o3',
        [
            model('o3', 'o3', { latest, featured, ...ccBaseFlags }),
            model('o3 (2025-04-16)', 'o3-2025-04-16', { snapshot, ...ccBaseFlags }),

            model('o3 mini', 'o3-mini', { latest, featured, ...resBaseFlags }),
            model('o3 (2025-01-31)', 'o3-mini-2025-01-31', { snapshot, ...resBaseFlags }),
        ]
    );
    provider.addModels('o1',
        [
            model('o1', 'o1', { latest, featured, ...resBaseFlags }),
            model('o1 (2024-12-17)', 'o1-2024-12-17', { snapshot, ...resBaseFlags }),
            model('o1 pro', 'o1-pro', { latest, featured, high_cost, ...resBaseFlags }),
            model('o1 pro (2025-03-19)', 'o1-pro-2025-03-19', { snapshot, high_cost, ...resBaseFlags }),
            model('o1 mini', 'o1-mini', { latest, featured, ...ccBaseFlags }),
            model('o1 mini (2024-09-12)', 'o1-mini-2024-09-12', { snapshot, ...ccBaseFlags }),
            model('o1 preview', 'o1-preview', { latest, ...ccBaseFlags }),
            model('o1 preview (2024-09-12)', 'o1-preview-2024-09-12', { snapshot, ...ccBaseFlags }),
        ]
    );

    const legacyFlags = { deprecated, ...ccBaseFlags };
    provider.addModels('GPT-4',
        [
            model('GPT 4 Turbo', 'gpt-4-turbo', { latest, ...legacyFlags }),
            model('GPT 4 Turbo (2024-04-09)', 'gpt-4-turbo-2024-04-09', { snapshot, ...legacyFlags }),

            model('GPT 4', 'gpt-4', { latest, ...legacyFlags }),
            model('GPT 4 (0125-preview)', 'gpt-4-0125-preview', { snapshot, ...legacyFlags }),
            model('GPT 4 (1106-preview)', 'gpt-4-1106-preview', { snapshot, ...legacyFlags }),
            model('GPT 4 (0613)', 'gpt-4-0613', { snapshot, ...legacyFlags }),
            model('GPT 4 (0314)', 'gpt-4-0314', { snapshot, ...legacyFlags }),
        ]
    );
    provider.addModels('GPT-3.5',
        [
            model('GPT 3.5 Turbo', 'gpt-3.5-turbo', { latest, ...legacyFlags }),
            model('GPT 3.5 Turbo (0125)', 'gpt-3.5-turbo-0125', { snapshot, ...legacyFlags }),
            model('GPT 3.5 Turbo (1106)', 'gpt-3.5-turbo-1106', { snapshot, ...legacyFlags }),
            model('GPT 3.5 Turbo Instruct', 'gpt-3.5-turbo-instruct', { latest, ...legacyFlags }),
        ]
    );
}
export default initProvider;