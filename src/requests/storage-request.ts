import { PutObjectRequest } from '@aws-sdk/client-s3';

import { PDFRequestOptions } from './adapter';

export interface PdfStorageRequestArgs {
    fileName: string;
    filePath: string;
    secure: boolean;
    options: PDFRequestOptions['storageOptions'];
    metadata: PutObjectRequest['Metadata'];
}
export default class PdfStorageRequest {
    fileName: string;
    filePath: string;
    secure: boolean;
    options: PDFRequestOptions['storageOptions'];
    metadata: PutObjectRequest['Metadata'];
    constructor(args: PdfStorageRequestArgs) {
        this.fileName = args.fileName;
        this.filePath = args.filePath;
        this.secure = args.secure;
        this.options = args.options;
        this.metadata = args.metadata;
    }
}
