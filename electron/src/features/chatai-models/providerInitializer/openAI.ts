import ModelProvider from "../ModelProvider";
import model from "../model";
import flags from '../flags';

const {
    latest,
    featured,
    experimental,
    deprecated,
    high_cost,
    snapshot,
    chat_completions_endpoint,
} = flags;

function initProvider(provider:ModelProvider) {
    const baseFlags = { chat_completions_endpoint };

    provider.addModels('ChatGPT-4o',
        [
            model('ChatGPT 4o', 'chatgpt-4o-latest', { latest, featured, ...baseFlags }),
        ]
    );
    provider.addModels('GPT-4o',
        [
            model('GPT 4o', 'gpt-4o', { latest, featured, ...baseFlags }),
            model('GPT 4o (2024-11-20)', 'gpt-4o-2024-11-20', { snapshot, ...baseFlags }),
            model('GPT 4o (2024-08-06)', 'gpt-4o-2024-08-06', { snapshot, ...baseFlags }),
            model('GPT 4o (2024-05-13)', 'gpt-4o-2024-05-13', { snapshot, ...baseFlags }),
        ]
    );
    provider.addModels('GPT-4o mini',
        [
            model('GPT 4o mini', 'gpt-4o-mini', { latest, featured, ...baseFlags }),
            model('GPT 4o mini (2024-07-18)', 'gpt-4o-mini-2024-07-18', { snapshot, ...baseFlags }),
        ]
    );
    provider.addModels('GPT-4.1 / 4.1 mini / 4.1 nano',
        [
            model('GPT 4.1', 'gpt-4.1', { latest, featured, ...baseFlags }),
            model('GPT 4.1 (2025-04-14)', 'gpt-4.1-2025-04-14', { snapshot, ...baseFlags }),
            model('GPT 4.1 mini', 'gpt-4.1-mini', { latest, featured, ...baseFlags }),
            model('GPT 4.1 mini (2025-04-14)', 'gpt-4.1-mini-2025-04-14', { snapshot, ...baseFlags }),
            model('GPT 4.1 nano', 'gpt-4.1-nano', { latest, ...baseFlags }),
            model('GPT 4.1 nano (2025-04-14)', 'gpt-4.1-nano-2025-04-14', { snapshot, ...baseFlags }),
        ]
    );
    provider.addModels('o4 mini',
        [
            model('o4 mini', 'o4-mini', { latest, featured, ...baseFlags }),
            model('o4 mini (2025-04-16)', 'o4-mini-2025-04-16', { snapshot, ...baseFlags }),
        ]
    );
    provider.addModels('o3 / o3 mini',
        [
            model('o3', 'o3', { latest, featured, ...baseFlags }),
            model('o3 (2025-04-16)', 'o3-2025-04-16', { snapshot, ...baseFlags }),

            model('o3 mini', 'o3-mini', { latest, featured, ...baseFlags }),
            model('o3 (2025-01-31)', 'o3-mini-2025-01-31', { snapshot, ...baseFlags }),
        ]
    );
    provider.addModels('o1 / o1 pro / o1 mini',
        [
            model('o1', 'o1', { latest, featured, ...baseFlags }),
            model('o1 (2024-12-17)', 'o1-2024-12-17', { snapshot, ...baseFlags }),
            model('o1 pro', 'o1-pro', { latest, featured, high_cost, ...baseFlags }),
            model('o1 pro (2025-03-19)', 'o1-pro-2025-03-19', { snapshot, high_cost, ...baseFlags }),
            model('o1 mini', 'o1-mini', { latest, featured, ...baseFlags }),
            model('o1 mini (2024-09-12)', 'o1-mini-2024-09-12', { snapshot, ...baseFlags }),
            model('o1 preview', 'o1-preview', { latest, ...baseFlags }),
            model('o1 preview (2024-09-12)', 'o1-preview-2024-09-12', { snapshot, ...baseFlags }),
        ]
    );

    const legacyFlags = { deprecated, ...baseFlags };
    provider.addModels('GPT-4 Turbo / GPT-4',
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
    provider.addModels('GPT-3.5 Turbo',
        [
            model('GPT 3.5 Turbo', 'gpt-3.5-turbo', { latest, ...legacyFlags }),
            model('GPT 3.5 Turbo (0125)', 'gpt-3.5-turbo-0125', { snapshot, ...legacyFlags }),
            model('GPT 3.5 Turbo (1106)', 'gpt-3.5-turbo-1106', { snapshot, ...legacyFlags }),
            model('GPT 3.5 Turbo Instruct', 'gpt-3.5-turbo-instruct', { latest, ...legacyFlags }),
        ]
    );
}
export default initProvider;