import os from 'os';
import si from 'systeminformation';

class UniqueIdentifier {
    static async makeAsSystemUUID():Promise<string> {
        const data = await si.uuid();
        return data.hardware;
    }
    
    static async makeAsHardwareNames() {
        const cpuBrand = (await si.cpu()).brand.trim().replaceAll(' ', '');
        const boardModel = (await si.baseboard()).model.trim().replaceAll(' ', '');
        const hostname = os.hostname();
        
        return `${cpuBrand}:${boardModel}:${hostname}`;
    }
}

export default UniqueIdentifier;