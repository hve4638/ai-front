import { ILocalAPI } from './interface';
import ElectronIPCAPI from './ElectronIPCAPI';

const LocalAPI:ILocalAPI = new ElectronIPCAPI();

export default LocalAPI;