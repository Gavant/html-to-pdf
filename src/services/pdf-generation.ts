import puppeteer, { CookieParam, PDFOptions } from 'puppeteer-core';
import report from 'puppeteer-report';

import chromium from '@sparticuz/chromium';

import PdfGenerationRequest from '../requests/request';

const DEFAULT_PRINT_OPTIONS: PDFOptions = {
    printBackground: true,
    format: 'a4'
};
export default class PdfGenerationService {
    private getTargetOrigin(targetUrl: string) {
        return new URL(targetUrl).origin;
    }

    private normalizeCookies(
        cookies: CookieParam[] | undefined,
        targetUrl: string
    ) {
        if (!cookies || cookies.length === 0) return undefined;

        const origin = this.getTargetOrigin(targetUrl);
        return cookies.map((cookie) => {
            // Puppeteer requires either `url` or `domain` (plus path) to scope a cookie.
            // The calling API often omits these, so we default to the target origin.
            const hasDomain = typeof cookie.domain === 'string' && cookie.domain.length > 0;
            const hasUrl = typeof (cookie as any).url === 'string' && (cookie as any).url.length > 0;

            if (hasDomain || hasUrl) return cookie;

            return {
                ...cookie,
                url: origin,
                path: cookie.path ?? '/'
            } as CookieParam;
        });
    }

    async generate(
        pdfGenerationRequest: PdfGenerationRequest,
        htmlToPdfPrintOptions: PDFOptions = DEFAULT_PRINT_OPTIONS
    ) {
        console.log('Starting to generate PDF');
        const browser = await this.launchBrowser(pdfGenerationRequest);
        console.log('Browser launched');
        const page = await browser.newPage();

        const normalizedCookies = this.normalizeCookies(
            pdfGenerationRequest.cookies,
            pdfGenerationRequest.url
        );

        if (normalizedCookies) {
            await page.setCookie(...normalizedCookies);
            console.log('Cookies set');
        }

        console.log({
            url: pdfGenerationRequest.url,
            secure: pdfGenerationRequest.secure,
            cookieCount: normalizedCookies?.length ?? 0
        });

        await page.goto(pdfGenerationRequest.url, { waitUntil: 'networkidle0' });
        console.log(`Puppeteer visited page located at ${pdfGenerationRequest.url}`);
        const options = { ...htmlToPdfPrintOptions, ...pdfGenerationRequest.pdfOptions };
        await report.pdfPage(page as any, {
            path: pdfGenerationRequest.localFilePath,
            ...options
        });
        console.log(`PDF generated`);
        await browser.close();
        console.log(`Browser closed`);
        return pdfGenerationRequest.localFilePath;
    }

    async launchBrowser(pdfGenerationRequest: PdfGenerationRequest) {
        const chromiumPath = process.env.LOCAL_CHROME_PATH
            ? process.env.LOCAL_CHROME_PATH
            : await chromium.executablePath();
        const options = {
            args: process.env.LOCAL_CHROME_PATH
                ? process.env.BROWSER_ARGS?.split(',') ?? ['--no-sandbox']
                : chromium.args,
            executablePath: chromiumPath,
            headless: true,
            ...pdfGenerationRequest.browserOptions
        };
        return await puppeteer.launch(options);
    }
}
