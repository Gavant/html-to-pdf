import crypto from 'crypto';

import { PutObjectRequest } from '@aws-sdk/client-s3';

import { DEFAULT_TEMP_PATH } from '../constants/pdf';
import { PDFRequestOptions } from './adapter';

export interface PdfStorageRequestArgs {
    fileName?: string;
    localFilePath: string;
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
        this.storageFilePath = `${DEFAULT_TEMP_PATH}${crypto.randomUUID()}`;
        this.secure = args.secure;
        this.options = args.options;
        this.metadata = args.metadata;
    }
}
