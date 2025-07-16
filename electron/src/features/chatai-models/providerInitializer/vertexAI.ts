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
    vertexai,

    anthropic_api,
    generative_language_api,
} = flags;

function initProvider(provider: ModelProvider) {
    const baseFlags = { vertexai };

    const anthropicFlags = { vertexai, anthropic_api };
    provider.addModels('Claude',
        [
            model('claude-opus-4@20250514', { featured, snapshot, ...anthropicFlags }),
            model('claude-sonnet-4@20250514', { featured, snapshot, ...anthropicFlags }),
            model('claude-3-7-sonnet@20250219', { featured, snapshot, ...anthropicFlags }),
            model('claude-3-5-sonnet-v2@20241022', { featured, snapshot, ...anthropicFlags }),
            model('claude-3-5-sonnet@20240620', { snapshot, ...anthropicFlags }),
            model('claude-3-5-haiku@20241022', { featured, snapshot, ...anthropicFlags }),
            model('claude-3-opus@20240229', { snapshot, ...anthropicFlags }),
            model('claude-3-sonnet@20240229', { snapshot, ...anthropicFlags }),
            model('claude-3-haiku@20240307', { snapshot, ...anthropicFlags }),
        ]
    );
    const generativeLanguageFlags = { vertexai, generative_language_api };
    provider.addModels('Gemini',
        [
            model('gemini-2.5-pro', { latest, featured, ...generativeLanguageFlags }),
            model('gemini-2.5-pro-preview-05-06', { latest, snapshot, deprecated, ...generativeLanguageFlags }),
            model('gemini-2.5-pro-preview-03-25', { latest, snapshot, deprecated, ...generativeLanguageFlags }),
            model('gemini-2.5-flash', { latest, featured, ...generativeLanguageFlags }),
            model('gemini-2.5-flash-preview-05-20', { latest, snapshot, deprecated, ...generativeLanguageFlags }),
            model('gemini-2.5-flash-preview-04-17', { latest, snapshot, deprecated, ...generativeLanguageFlags }),
        ]
    );
}

export default initProvider;