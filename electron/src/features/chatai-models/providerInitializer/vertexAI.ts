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
    vertexai_endpoint,
} = flags;

function initProvider(provider:ModelProvider) {
    const baseFlags = { vertexai_endpoint };

    provider.addModels('Claude',
        [
            model('claude-opus-4@20250514', { featured, snapshot, ...baseFlags }),
            model('claude-sonnet-4@20250514', { featured, snapshot, ...baseFlags }),
            model('claude-3-7-sonnet@20250219', { featured, snapshot, ...baseFlags }),
            model('claude-3-5-sonnet-v2@20241022', { featured, snapshot, ...baseFlags }),
            model('claude-3-5-sonnet@20240620', { featured, snapshot, ...baseFlags }),
            model('claude-3-5-haiku@20241022', { featured, snapshot, ...baseFlags }),
            model('claude-3-opus@20240229', { snapshot, ...baseFlags }),
            model('claude-3-sonnet@20240229', { snapshot, ...baseFlags }),
            model('claude-3-haiku@20240307', { snapshot, ...baseFlags }),
        ]
    );
}

export default initProvider;