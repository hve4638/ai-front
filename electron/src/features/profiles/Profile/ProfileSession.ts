import { IACSubStorage } from 'ac-storage';
import { createHash } from 'crypto';
import sharp from 'sharp';

class ProfileSession {
    private sessionStorage: IACSubStorage;

    /**
     * @param storage 
     */
    constructor(private storage: IACSubStorage, private sessionId: string) {
        this.sessionStorage = storage.subStorage(`session:${this.sessionId}`);
    }

    private async accessRTIndex(rtId: string) {
        return this.storage.accessAsJSON(`request-template:${rtId}:index.json`);
    }
    private async accessData() {
        return this.sessionStorage.accessAsJSON(`data.json`);
    }
    private async accessCache() {
        return this.sessionStorage.accessAsJSON(`cache.json`);
    }

    async get(accessorId: string, keys: string[]) {
        const ac = await this.sessionStorage.accessAsJSON(accessorId);
        return ac.get(...keys);
    }

    async getOne(accessorId: string, key: string) {
        const ac = await this.sessionStorage.accessAsJSON(accessorId);
        return ac.getOne(key);
    }

    async set(accessorId: string, data: KeyValueInput) {
        const ac = await this.sessionStorage.accessAsJSON(accessorId);
        return ac.set(data);
    }

    async setOne(accessorId: string, key: string, value: any) {
        const ac = await this.sessionStorage.accessAsJSON(accessorId);
        return ac.setOne(key, value);
    }

    async getInputFiles(): Promise<InputFile[]> {
        const cacheAC = await this.accessCache();
        const files: InputFile[] = cacheAC.getOne('upload_files') ?? [];
        return files.map((file, index: number) => ({
            hash_sha256: file.hash_sha256,
            filename: file.filename,
            size: file.size,
            type: file.type,
            data: file.data,
            thumbnail: file.thumbnail,
        }));
    }
    async getInputFilePreviews(): Promise<InputFilePreview[]> {
        const cacheAC = await this.accessCache();
        const files: InputFile[] = cacheAC.getOne('upload_files') ?? [];
        const metadatas: InputFilePreview[] = files.map((file) => {
            return {
                filename: file.filename,
                size: file.size,
                hash_sha256: file.hash_sha256,
                type: file.type,
                thumbnail: file.thumbnail,
            }
        });

        return metadatas;
    }

    async addInputFile(filename: string, dataURI: string): Promise<InputFilePreview> {
        if (!dataURI.startsWith('data:')) {
            throw new Error(`Invalid data URI format for ${filename}`);
        }
        const cacheAC = await this.accessCache();
        const files: InputFile[] = cacheAC.getOne('upload_files') ?? [];

        const [prefix, data] = dataURI.split(',');
        if (!prefix || !data) {
            throw new Error(`Invalid data URI prefix for ${filename}`);
        }

        const byteSize = Buffer.from(data, 'base64').length;
        // "data:image/png;base64" 형식 파싱
        const mimeType = prefix.substring('data:'.length).split(';')[0];

        const imageTypes: string[] = ['image/webp', 'image/png', 'image/jpeg'];
        const otherTypes: string[] = ['application/pdf', 'text/plain'];

        let isImageType = false;
        let dataType: UploadableFileType;
        if (imageTypes.includes(mimeType)) {
            dataType = mimeType as UploadableFileType;
            isImageType = true;
        }
        else if (otherTypes.includes(mimeType)) {
            dataType = mimeType as UploadableFileType;
        }
        else {
            throw new Error(`Unsupported file type for ${filename}`);
        }

        if (byteSize >= 20 * 1024 * 1024) { // 20MB
            throw new Error(`File size exceeds limit for ${filename}`);
        }

        let thumbnail: string | null = null;
        if (isImageType) {
            const image = Buffer.from(data, 'base64');


            const thumbnailBuffer = await sharp(image)
                .resize({
                    width: 256,
                    height: 256,
                    fit: 'inside',
                    withoutEnlargement: true,
                })
                .png()
                .toBuffer();
            
            const base64 = thumbnailBuffer.toString('base64');
            thumbnail = `data:image/png;base64,${base64}`;
        }

        const preview: InputFilePreview = {
            filename: filename,
            size: byteSize,
            type: dataType,
            hash_sha256: createHash('sha256').update(data).digest('hex'),
            thumbnail: thumbnail,
        };
        files.push({
            ...preview,
            data: data,
        });
        cacheAC.setOne('upload_files', files);

        return preview;
    }

    async updateInputFiles(fileHashes: InputFileHash[]): Promise<InputFilesUpdateInfo> {
        const cacheAC = await this.accessCache();
        const prevFiles: InputFile[] = cacheAC.getOne('upload_files') ?? [];

        const updated: boolean[] = new Array(prevFiles.length).fill(false);

        const updatedFileMetadata: InputFileMetadata[] = [];

        const nextFiles: InputFile[] = [];
        for (const h of fileHashes) {
            const index = prevFiles.findIndex((f, i) => (f.hash_sha256 === h.hash_sha256 && !updated[i]));

            if (index === -1) {
                throw new Error(`File with hash ${h.hash_sha256} not found in session cache.`);
            }
            else {
                const file = prevFiles[index];
                updated[index] = true;

                updatedFileMetadata.push({
                    filename: file.filename,
                    size: file.size,
                    type: file.type,
                    hash_sha256: h.hash_sha256,
                })
                nextFiles.push(file);
            }
        }
        cacheAC.setOne('upload_files', nextFiles);

        const removedFileMetadata: InputFileMetadata[] = prevFiles.filter((f, i) => !updated[i])
            .map((f) => ({
                filename: f.filename,
                size: f.size,
                type: f.type,
                hash_sha256: f.hash_sha256,
            }));

        return {
            updated: updatedFileMetadata,
            removed: removedFileMetadata,
        }
    }

    async getFormValues(rtId: string) {
        const dataAC = await this.accessData();

        const values = (await dataAC.getOne(`forms.${rtId}`)) ?? {};
        return values;
    }
    async setFormValues(rtId: string, values: Record<string, any>) {
        const rtIndexAC = await this.accessRTIndex(rtId);
        const dataAC = await this.accessData();

        const formIds = rtIndexAC.getOne('forms') ?? [];
        for (const formId of formIds) {
            if (!(formId in values)) continue;

            const value = values[formId];
            dataAC.setOne(`forms.${rtId}.${formId}`, value);
        }
    }
}

export default ProfileSession;