import { APIGatewayProxyEventV2 } from 'aws-lambda';
import crypto from 'crypto';
import {
    BrowserConnectOptions,
    BrowserLaunchArgumentOptions,
    LaunchOptions,
    PDFOptions,
    Product,
    Protocol
} from 'puppeteer-core';

import PdfGenerationRequest from './request';

export type PDFRequestBrowserOptions = LaunchOptions &
    BrowserLaunchArgumentOptions &
    BrowserConnectOptions & {
        product?: Product;
        extraPrefsFirefox?: Record<string, unknown>;
    };
export type PDFRequestOptions = {
    pdfOptions: Partial<PDFOptions>;
    browserOptions: Partial<PDFRequestBrowserOptions>;
    storageOptions?: {
        expiresIn?: number;
    };
};

export interface PdfGenerationRequestBody {
    url: string;
    fileName: string;
    path?: string;
    secure?: boolean;
    cookies?: Protocol.Network.CookieParam[];
    options: PDFRequestOptions;
}
export default class PdfGenerationRequestAdapter {
    fileName: string;
    requestBody: PdfGenerationRequestBody;
    constructor(event: APIGatewayProxyEventV2) {
        this.requestBody = event.body as unknown as PdfGenerationRequestBody;
        this.fileName = this.requestBody?.fileName ?? `${crypto.randomUUID()}.pdf`;
    }

    toPdfGenerationRequest() {
        return new PdfGenerationRequest({
            url: this.requestBody.url,
            fileName: this.fileName,
            path: this.requestBody.path,
            secure: this.requestBody.secure,
            cookies: this.requestBody.cookies,
            options: this.requestBody.options
        });
    }
}
