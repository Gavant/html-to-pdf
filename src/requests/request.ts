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
    fileName: string;
    secure: boolean;
    path: string;
    cookies?: Protocol.Network.CookieParam[];
    pdfOptions?: Partial<PDFOptions>;
    browserOptions?: Partial<PDFRequestBrowserOptions>;
    constructor(
        url: string,
        fileName: string,
        path?: string,
        secure?: boolean,
        cookies?: Protocol.Network.CookieParam[],
        options: PDFRequestOptions = { pdfOptions: {}, browserOptions: {} }
    ) {
        this.url = url;
        this.fileName = fileName;
        this.path = path ?? '/tmp';
        this.secure = secure ?? true;
        this.cookies = cookies;
        this.pdfOptions = options?.pdfOptions ?? {};
        this.browserOptions = options?.browserOptions ?? {};
    }
}
