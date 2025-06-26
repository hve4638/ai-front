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
        type: 'output_clear';
    } | {
        type: 'input_update';
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

    type VertexAIAuth = {
        project_id: string;
        private_key: string;
        client_email: string;
    }

    type UploadableFileType = 'image/webp' | 'image/png' | 'image/jpeg' | 'application/pdf' | 'text/plain';

    type InputFileMetadata = {
        filename: string;
        size: number; // bytes
        type: UploadableFileType;
        hash_sha256: string;
    }
    type InputFile = InputFileMetadata & {
        data: string;
        thumbnail: string | null;
    }
    type InputFilePreview = InputFileMetadata & {
        thumbnail: string | null;
    }

    type InputFilesUpdateInfo = {
        updated: InputFileMetadata[];
        removed: InputFileMetadata[];
    }

    type InputFileHash = {
        hash_sha256: string;
    }

    /** 커스텀 모델 정의 */
    interface CustomModel {
        id: string;
        name: string;
        model: string;
        url: string;
        api_format: 'chat_completions' | 'generative_language' | 'anthropic_claude';
        thinking: boolean;
        secret_key?: string;
    }
    type CustomModelCreate = Omit<CustomModel, 'id'> & { id?: string };
}

export {}