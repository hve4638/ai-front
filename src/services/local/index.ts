import { RawPromptMetadataTree } from 'features/prompts/types';
import { TARGET_ENV, VERSION } from '../../data/constants'
import { Promptlist } from './interface';
import { IPCInteractive } from './ipcInteractive';
import { WebInteractive } from './webInteractive';

export { LocalInteractive } from './localInteractive';

const errorNotAvailable = () => new Error('This feature is not available on this platform.');
