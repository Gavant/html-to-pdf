import {
    BrowserConnectOptions,
    BrowserLaunchArgumentOptions,
    LaunchOptions,
    PDFOptions,
    Product,
    Protocol
} from 'puppeteer-core';

type PDFRequestBrowserOptions = LaunchOptions &
    BrowserLaunchArgumentOptions &
    BrowserConnectOptions & {
        product?: Product;
        extraPrefsFirefox?: Record<string, unknown>;
    };
type PDFRequestOptions = {
    pdfOptions: Partial<PDFOptions>;
    browserOptions: Partial<PDFRequestBrowserOptions>;
};
export default class PdfGenerationRequest {
    url: string;
    path: string;
    fileName: string;
    cookies?: Protocol.Network.CookieParam[];
    pdfOptions?: Partial<PDFOptions>;
    browserOptions?: Partial<PDFRequestBrowserOptions>;
    constructor(
        url: string,
        path: string,
        fileName: string,
        cookies: Protocol.Network.CookieParam[],
        options: PDFRequestOptions = { pdfOptions: {}, browserOptions: {} }
    ) {
        this.path = path ?? '/tmp';
        this.url = url;
        this.fileName = fileName;
        this.cookies = cookies;
        this.pdfOptions = options?.pdfOptions ?? {};
        this.browserOptions = options?.browserOptions ?? {};
    }
}
