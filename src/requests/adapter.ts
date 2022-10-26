import { APIGatewayProxyEventV2 } from 'aws-lambda';
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
    fileName?: string;
    path?: string;
    secure?: boolean;
    cookies?: Protocol.Network.CookieParam[];
    options: PDFRequestOptions;
}
export default class PdfGenerationRequestAdapter {
    requestBody: PdfGenerationRequestBody;
    constructor(event: APIGatewayProxyEventV2) {
        this.requestBody = event.body as unknown as PdfGenerationRequestBody;
    }

    toPdfGenerationRequest() {
        return new PdfGenerationRequest({
            url: this.requestBody.url,
            fileName: this.requestBody.fileName,
            secure: this.requestBody.secure,
            cookies: this.requestBody.cookies,
            options: this.requestBody.options,
            path: this.requestBody.path
        });
    }
}
