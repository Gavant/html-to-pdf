import { PutObjectRequest } from '@aws-sdk/client-s3';

export default class PdfStorageRequest {
    fileName: string;
    filePath: string;
    isPublic: boolean;
    metadata: PutObjectRequest['Metadata'];
    constructor(fileName: string, filePath: string, isPublic: boolean, metadata: PutObjectRequest['Metadata']) {
        this.fileName = fileName;
        this.filePath = filePath;
        this.isPublic = isPublic;
        this.metadata = metadata;
    }
}
