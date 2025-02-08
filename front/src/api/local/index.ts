import { ILocalAPI } from './interface';
import ElectronIPCAPI from './ElectronIPCAPI';

const LocalAPI:ElectronIPCAPI = new ElectronIPCAPI();

export default LocalAPI;