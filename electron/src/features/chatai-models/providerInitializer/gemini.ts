import ModelProvider from '../ModelProvider';
import model from '../model';
import flags from '../flags';

const {
    latest,
    featured,
    experimental,
    deprecated,
    snapshot,
    generative_language_api,
    thinking,
    thinking_optional,
} = flags;

function initProvider(provider:ModelProvider) {
    const baseFlags = { generative_language_api };

    provider.addModels('Gemini 2.5',
        [
            model('Gemini 2.5 Pro', 'gemini-2.5-pro', { latest, featured, thinking, ...baseFlags }),
            model('Gemini 2.5 Pro Preview (06-05)', 'gemini-2.5-pro-preview-06-05', { latest, thinking, deprecated, ...baseFlags }),
            model('Gemini 2.5 Flash', 'gemini-2.5-flash', { latest, featured, thinking_optional, ...baseFlags }),
            model('Gemini 2.5 Flash Preview (05-20)', 'gemini-2.5-flash-preview-05-20', { latest, thinking_optional, deprecated, ...baseFlags }),
        ]
    );
    provider.addModels('Gemini 2.0',
        [
            model('Gemini 2.0 Flash', 'gemini-2.0-flash', { latest, featured, ...baseFlags }),
            model('Gemini 2.0 Flash 001', 'gemini-2.0-flash-001', { snapshot, ...baseFlags }),
            model('Gemini 2.0 Flash Exp', 'gemini-2.0-flash-exp', { ...baseFlags }),
            model('Gemini 2.0 Flash-Lite', 'gemini-2.0-flash-lite', { latest, featured, ...baseFlags }),
            model('Gemini 2.0 Flash-Lite 001', 'gemini-2.0-flash-lite-001', { snapshot, ...baseFlags }),
        ]
    );
    provider.addModels('Gemini 1.5',
        [
            model('Gemini 1.5 Pro (latest)', 'gemini-1.5-pro-latest', { latest, ...baseFlags }),
            model('Gemini 1.5 Pro (stable)', 'gemini-1.5-pro', { ...baseFlags }),
            model('Gemini 1.5 Pro 002', 'gemini-1.5-pro-002', { snapshot, ...baseFlags }),
            model('Gemini 1.5 Pro 001', 'gemini-1.5-pro-001', { snapshot, ...baseFlags }),
            model('Gemini 1.5 Flash (latest)', 'gemini-1.5-flash-latest', { latest, ...baseFlags }),
            model('Gemini 1.5 Flash (stable)', 'gemini-1.5-flash', { ...baseFlags }),
            model('Gemini 1.5 Flash 002', 'gemini-1.5-flash-002', { snapshot, ...baseFlags }),
            model('Gemini 1.5 Flash 001', 'gemini-1.5-flash-001', { snapshot, ...baseFlags }),
            model('Gemini 1.5 Flash 8B (latest)', 'gemini-1.5-flash-8b-latest', { latest, ...baseFlags }),
            model('Gemini 1.5 Flash 8B (stable)', 'gemini-1.5-flash-8b', { ...baseFlags }),
            model('Gemini 1.5 Flash 8B 001', 'gemini-1.5-flash-8b-001', { snapshot, ...baseFlags }),
        ]
    );
}

export default initProvider;