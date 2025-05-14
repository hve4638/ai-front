import * as utils from '@utils';

function general():IPCInvokerGeneral {
    return {
        async echo(message:string) {
            return [null, message];
        },
        async openBrowser(url:string) {
            utils.openBrowser(url);
            
            return [null];
        },
    }
}

export default general;