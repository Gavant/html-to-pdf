import crypto from 'crypto';
import { Protocol } from 'puppeteer-core';

import { DEFAULT_TEMP_PATH } from '../constants/pdf';
import { PdfGenerationRequestBody, PDFRequestOptions } from './adapter';

export default class PdfGenerationRequest {
    url: string;
    localFileName: string;
    secure: boolean;
    path: string;
    storageFilePath: string;
    fileName?: string;
    cookies?: Protocol.Network.CookieParam[];
    pdfOptions?: Partial<PDFRequestOptions['pdfOptions']>;
    browserOptions?: Partial<PDFRequestOptions['browserOptions']>;
    storageOptions?: Partial<PDFRequestOptions['storageOptions']>;

    constructor(args: PdfGenerationRequestBody) {
        this.url = args.url;
        this.fileName = args.fileName ?? `${crypto.randomUUID()}.pdf`;
        this.localFileName = `${crypto.randomUUID()}.pdf`;
        this.path = `/${DEFAULT_TEMP_PATH}`;
        this.storageFilePath = args.storageFilePath ?? `${DEFAULT_TEMP_PATH}${crypto.randomUUID()}`;
        this.secure = args.secure ?? true;
        this.cookies = args.cookies;
        this.pdfOptions = args.options?.pdfOptions ?? {};
        this.browserOptions = args.options?.browserOptions ?? {};
        this.storageOptions = args.options?.storageOptions ?? {};
    }

    get localFilePath() {
        return `${this.path}${this.localFileName}`;
    }
}
