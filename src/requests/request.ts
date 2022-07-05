import crypto from 'crypto';
import { Protocol } from 'puppeteer-core';

import { PdfGenerationRequestBody, PDFRequestOptions } from './adapter';

export default class PdfGenerationRequest {
    url: string;
    fileName: string;
    secure: boolean;
    path?: string;
    cookies?: Protocol.Network.CookieParam[];
    pdfOptions?: Partial<PDFRequestOptions['pdfOptions']>;
    browserOptions?: Partial<PDFRequestOptions['browserOptions']>;
    storageOptions?: Partial<PDFRequestOptions['storageOptions']>;

    constructor(args: PdfGenerationRequestBody) {
        this.url = args.url;
        this.fileName = args.fileName;
        this.path = args.path ?? `/tmp/${crypto.randomUUID()}`;
        this.secure = args.secure ?? true;
        this.cookies = args.cookies;
        this.pdfOptions = args.options?.pdfOptions ?? {};
        this.browserOptions = args.options?.browserOptions ?? {};
        this.storageOptions = args.options?.storageOptions ?? {};
    }
}
