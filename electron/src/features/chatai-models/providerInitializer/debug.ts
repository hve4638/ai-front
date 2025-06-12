import ModelProvider from '../ModelProvider';
import model from '../model';
import flags from '../flags';

const {
    featured,
    custom_endpoint,
} = flags;

function initProvider(provider:ModelProvider) {
    provider.addModels('Mirror',
        [
            model('Mirror', 'mirror', { featured, custom_endpoint }),
        ]
    );
    provider.addModels('ChatML',
        [
            model('ChatML', 'chatml', { featured, custom_endpoint }),
        ]
    );
}

export default initProvider;