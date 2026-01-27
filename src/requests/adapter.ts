import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { CookieParam, PDFOptions } from 'puppeteer-core';

import PdfGenerationRequest from './request';

// Puppeteer option types have shifted across major versions; we only need a
// pass-through shape here since we spread these into `puppeteer.launch(...)`.
export type PDFRequestBrowserOptions = Record<string, unknown>;

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
    // Back-compat: some callers send `filename` instead of `fileName`
    filename?: string;
    storageFilePath?: string;
    secure?: boolean;
    cookies?: CookieParam[];
    options?: PDFRequestOptions | null;
}

export default class PdfGenerationRequestAdapter {
    requestBody: PdfGenerationRequestBody;

    constructor(event: APIGatewayProxyEventV2) {
        // This lambda is typically invoked directly (not via API Gateway),
        // so `event.body` is often already an object.
        this.requestBody = event.body as unknown as PdfGenerationRequestBody;
    }

    toPdfGenerationRequest() {
        return new PdfGenerationRequest({
            url: this.requestBody.url,
            fileName: this.requestBody.fileName ?? this.requestBody.filename,
            secure: this.requestBody.secure,
            cookies: this.requestBody.cookies,
            options: (this.requestBody.options ?? {}) as any,
            storageFilePath: this.requestBody.storageFilePath
        });
    }
}
