import * as utils from '@utils';
import runtime from '@/runtime';

function general():IPCInvokerGeneral {
    return {
        async echo(message:string) {
            return [null, message];
        },
        async openBrowser(url:string) {
            utils.openBrowser(url);
            
            return [null];
        },
        async getCurrentVersion() {
            return [null, runtime.env.version];
        },
        async getAvailableVersion(prerelease:boolean) {
            let ver:VersionInfo|null;
            if (prerelease) {
                ver = await runtime.appVersionManager.getLatestBeta();
            } else {
                ver = await runtime.appVersionManager.getLatestStable();
            }
            
            if (ver && runtime.appVersionManager.isNewerVersion(ver.semver)) {
                return [null, ver];
            }
            else {
                return [new Error('Failed to fetch version information')];
            }
        },
        async existsLegacyData() {
            return [null, runtime.migrationService.existsLegacyData()];
        },
        async migrateLegacyData() {
            const legacyData = await runtime.migrationService.extract();
            if (!legacyData) {
                return [new Error('No legacy data found')];
            }

            // Perform migration logic here

            return [null];
        }
    }
}

export default general;