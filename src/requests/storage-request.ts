import { PutObjectRequest } from '@aws-sdk/client-s3';

export default class PdfStorageRequest {
    fileName: string;
    filePath: string;
    secure: boolean;
    metadata: PutObjectRequest['Metadata'];
    constructor(fileName: string, filePath: string, secure: boolean, metadata: PutObjectRequest['Metadata']) {
        this.fileName = fileName;
        this.filePath = filePath;
        this.secure = secure;
        this.metadata = metadata;
    }
}
