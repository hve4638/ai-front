declare global {
    type VersionInfo = {
        name: string;
        url: string;
        version: string;
        semver: StructuredVersion;
        description: string;

        prerelease: boolean;
        isNewer: boolean;
    }
    type StructuredVersion = {
        isSemver: true;
        major: number;
        minor: number;
        patch: number;
        tag?: string;
    } | {
        isSemver: false;
        identifier: string;
        tag: string;
    };

    type RequestRTData = {
        type: 'result'
        text: string;
        response: unknown;
    } | {
        type: 'no_result' // result is not available, but the process is complete
    } | {
        type: 'stream';
        text: string;
    } | {
        type: 'error';
        message: string;
        detail: string[];
    } | {
        type: 'history_update';
    } | {
        type: 'close';
    }

    type HistoryMetadata = {
        id: number;
        requestType: 'chat' | 'normal';
        createdAt: number;
        bookmark: boolean;

        rtId: string;
        rtUUID: string;
        modelId: string;

        form: Record<string, unknown>;

        isComplete: boolean;
    }

    type HistoryMessage = {
        id: number;
        input?: string;
        output?: string;
    }

    type HistorySearch = {
        text: string;
        searchScope: 'any' | 'input' | 'output';
    }

    type VertexAIAPI = {
        project_id: string;
        private_key: string;
        client_email: string;
    }
}

export { }