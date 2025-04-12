import { ILocalAPI } from './interface';
import ElectronIPCAPI from './ElectronIPCAPI';

const LocalAPIInstance:ElectronIPCAPI = ElectronIPCAPI.getInstance();

export default LocalAPIInstance;