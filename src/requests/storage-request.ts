import crypto from 'crypto';

import { PutObjectRequest } from '@aws-sdk/client-s3';

import { PDFRequestOptions } from './adapter';

export interface PdfStorageRequestArgs {
    fileName?: string;
    localFilePath: string;
    storageFilePath: string;
    secure: boolean;
    options: PDFRequestOptions['storageOptions'];
    metadata: PutObjectRequest['Metadata'];
}
export default class PdfStorageRequest {
    fileName: string;
    localFilePath: string;
    storageFilePath: string;
    secure: boolean;
    options: PDFRequestOptions['storageOptions'];
    metadata: PutObjectRequest['Metadata'];
    constructor(args: PdfStorageRequestArgs) {
        this.fileName = args.fileName ?? `${crypto.randomUUID()}.pdf`;
        this.localFilePath = args.localFilePath;
        this.storageFilePath = args.storageFilePath;
        this.secure = args.secure;
        this.options = args.options;
        this.metadata = args.metadata;
    }
}
