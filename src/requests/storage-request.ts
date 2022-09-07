import crypto from 'crypto';

import { PutObjectRequest } from '@aws-sdk/client-s3';

import { DEFAULT_TEMP_PATH } from '../constants/pdf';
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
        this.filePath =
            args.filePath === DEFAULT_TEMP_PATH ? `${DEFAULT_TEMP_PATH}${crypto.randomUUID()}` : args.filePath;
        this.secure = args.secure;
        this.options = args.options;
        this.metadata = args.metadata;
    }
}
