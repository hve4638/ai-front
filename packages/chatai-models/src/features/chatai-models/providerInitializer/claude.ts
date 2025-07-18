import ModelProvider from '../ModelProvider';
import model from '../model';
import { flags } from '@/data';

const {
    latest,
    featured,
    experimental,
    deprecated,
    thinking,
    thinking_optional,
    snapshot,
    anthropic_api,
    high_cost,
} = flags;


function initProvider(provider: ModelProvider) {
    const baseFlags = { anthropic_api };

    provider.addModels('Claude 4',
        [
            model('Claude Opus 4', 'claude-opus-4-0', { featured, latest, thinking_optional, ...baseFlags }),
            model('Claude Opus 4 (2025-05-14)', 'claude-opus-4-20250514', { snapshot, thinking_optional, ...baseFlags }),
            model('Claude Sonnet 4', 'claude-sonnet-4-0', { featured, latest, thinking_optional, ...baseFlags }),
            model('Claude Sonnet 4 (2025-05-14)', 'claude-sonnet-4-20250514', { snapshot, thinking_optional, ...baseFlags }),
        ]
    );
    provider.addModels('Claude 3.7',
        [
            model('Claude Sonnet 3.7', 'claude-3-7-sonnet-latest', { latest, featured, thinking_optional, ...baseFlags }),
            model('Claude Sonnet 3.7 (2025-02-19)', 'claude-3-7-sonnet-20250219', { snapshot, thinking_optional, ...baseFlags }),
        ]
    );
    provider.addModels('Claude 3.5',
        [
            model('Claude Sonnet 3.5', 'claude-3-5-sonnet-latest', { latest, featured, ...baseFlags }),
            model('Claude Sonnet 3.5 (2024-10-22)', 'claude-3-5-sonnet-20241022', { snapshot, ...baseFlags }),
            model('Claude Sonnet 3.5 (2024-06-20)', 'claude-3-5-sonnet-20240620', { snapshot, ...baseFlags }),
            model('Claude Haiku 3.5', 'claude-3-5-haiku-latest', { featured, latest, ...baseFlags }),
            model('Claude Haiku 3.5 (2024-10-22)', 'claude-3-5-haiku-20241022', { snapshot, ...baseFlags }),
        ]
    );
    provider.addModels('Claude 3',
        [
            model('Claude Opus 3', 'claude-3-opus-latest', { latest, ...baseFlags }),
            model('Claude Opus 3 (2024-02-29)', 'claude-3-opus-20240229', { snapshot, ...baseFlags }),
            model('Claude Sonnet 3', 'claude-3-sonnet-20240229', { latest, snapshot, ...baseFlags }),
            model('Claude Haiku 3', 'claude-3-haiku-20240307', { latest, snapshot, ...baseFlags }),
        ]
    );
}

export default initProvider;