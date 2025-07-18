import axios from 'axios';

type GitHubRelease = {
    tag_name: string;
    html_url: string;
    name?: string;
    body?: string;
    prerelease: boolean;
} | {};

const RELEASE_URL = 'https://api.github.com/repos/hve4638/afron/releases';
const LEGACY_RELEASE_URL = 'https://api.github.com/repos/hve4638/ai-front/releases';

class AppVersionManager {
    private releaseAPIURLs = [
        RELEASE_URL,
        LEGACY_RELEASE_URL,
    ]
    currentVersion: StructuredVersion;

    constructor(version: string) {
        this.currentVersion = this.parseSemanticVersion(version) ?? { isSemver: false, identifier: 'unknown', tag: '' };
    }

    getCurrent(): StructuredVersion {
        return this.currentVersion;
    }

    async getLatestStable(): Promise<VersionInfo | null> {
        let data = await this.fetchReleasesWithFallback();

        if (!data || !Array.isArray(data)) return null;
        const latest = data.find((release) => !release['prerelease']);
        return this.parseRelease(latest);
    }

    async getLatestBeta(): Promise<VersionInfo | null> {
        let data = await this.fetchReleasesWithFallback();

        if (!data || !Array.isArray(data)) return null;
        const latest = data.at(0);
        return this.parseRelease(latest);
    }

    private async fetchReleasesWithFallback(): Promise<GitHubRelease[] | null> {
        for (const url of this.releaseAPIURLs) {
            const data = await this.fetchReleases(url);
            if (data) return data;
        }
        return null;
    }

    private async fetchReleases(url: string): Promise<GitHubRelease[] | null> {
        try {
            const response = await axios.get(url);
            if (response.status !== 200
                || !response.data
                || !Array.isArray(response.data)
            ) {
                return null;
            }
            else {
                return response.data as GitHubRelease[];
            }
        }
        catch (error) {
            return null;
        }
    }

    parseRelease(data?: GitHubRelease): VersionInfo | null {
        if (!data) return null;
        const isValid = (
            'tag_name' in data
            && 'html_url' in data
            // && 'name' in data
            // && 'body' in data
        );

        if (!isValid) {
            console.error('Invalid version data:', data);
            return null;
        }

        const semver = this.parseSemanticVersion(data.tag_name);
        if (!semver) {
            console.error('Invalid semantic version:', data.tag_name);
            return null;
        }

        return {
            name: data.name ?? data.tag_name,
            description: data.body ?? '',
            version: data.tag_name,
            url: data.html_url,
            prerelease: data.prerelease,
            semver: semver,
            isNewer: this.isNewerVersion(semver)
        }
    }

    private parseSemanticVersion(version: string): StructuredVersion | null {
        const semverMatch = version.match(/^v?(\d+)\.(\d+)\.(\d+)(?:-([\w.-]+))?$/);
        if (semverMatch) {
            return {
                isSemver: true,
                major: parseInt(semverMatch[1], 10),
                minor: parseInt(semverMatch[2], 10),
                patch: parseInt(semverMatch[3], 10),
                tag: semverMatch[4]
            };
        }

        // 'dev-latest', 'test-250606' 등
        const diffverMatch = version.match(/^(\w+)-([a-zA-Z0-9_.-]+)$/);
        if (diffverMatch) {
            return {
                isSemver: false,
                identifier: diffverMatch[1],
                tag: diffverMatch[2]
            };
        }

        return null;
    }

    isNewerVersion(ver: StructuredVersion): boolean {
        const a = this.currentVersion;
        const b = ver;

        if (!a.isSemver || !b.isSemver) return false;
        if (b.major > a.major) return true;
        if (b.major < a.major) return false;
        if (b.minor > a.minor) return true;
        if (b.minor < a.minor) return false;
        if (b.patch > a.patch) return true;
        if (b.patch < a.patch) return false;

        // pre-release 간 비교하지 않으며 항상 stable 버전 우선
        if (!a.tag && b.tag) return true;
        if (a.tag && !b.tag) return false;

        return false;
    }

    stringifyVersion(ver: StructuredVersion): string {
        if (ver.isSemver) {
            return `v${ver.major}.${ver.minor}.${ver.patch}${ver.tag ? `-${ver.tag}` : ''}`;
        }
        else {
            return `${ver.identifier}-${ver.tag}`;
        }
    }
}

export default AppVersionManager;