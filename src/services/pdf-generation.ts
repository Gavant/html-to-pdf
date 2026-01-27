import puppeteer, { CookieParam, PDFOptions, Page } from 'puppeteer-core';
import report from 'puppeteer-report';

import chromium from '@sparticuz/chromium';

import PdfGenerationRequest from '../requests/request';

const DEFAULT_PRINT_OPTIONS: PDFOptions = {
    printBackground: true,
    format: 'a4'
};
export default class PdfGenerationService {
    private redactUrl(rawUrl: string) {
        try {
            const url = new URL(rawUrl);
            const sensitiveKey = /(token|sig|signature|secret|password|pass|key|auth|authorization|session|cookie|x-amz-signature|x-amz-credential)/i;
            for (const [key] of url.searchParams) {
                if (sensitiveKey.test(key)) {
                    url.searchParams.set(key, 'REDACTED');
                }
            }
            return url.toString();
        } catch {
            return rawUrl;
        }
    }

    private redactHeaders(headers: Record<string, string>) {
        const redacted: Record<string, string> = {};
        const sensitiveKey = /^(authorization|cookie|set-cookie|x-api-key|proxy-authorization)$/i;
        for (const [key, value] of Object.entries(headers)) {
            redacted[key] = sensitiveKey.test(key) ? 'REDACTED' : value;
        }
        return redacted;
    }

    private attachNetworkDebugging(
        page: Page,
        opts: { logHeaders: boolean }
    ) {
        const startedAt = Date.now();
        const shouldLog = (resourceType: string) => {
            return resourceType === 'document' || resourceType === 'xhr' || resourceType === 'fetch';
        };

        page.on('request', (request) => {
            const resourceType = request.resourceType();
            if (!shouldLog(resourceType) && !request.isNavigationRequest()) return;

            const payload: Record<string, unknown> = {
                t: Date.now() - startedAt,
                type: 'request',
                method: request.method(),
                url: this.redactUrl(request.url()),
                resourceType,
                isNavigationRequest: request.isNavigationRequest(),
                redirectChain: request.redirectChain().length
            };

            if (opts.logHeaders) {
                payload.headers = this.redactHeaders(request.headers() as Record<string, string>);
            }

            console.log('[net]', payload);
        });

        page.on('response', async (response) => {
            const request = response.request();
            const resourceType = request.resourceType();
            if (!shouldLog(resourceType) && !request.isNavigationRequest()) return;

            const headers = response.headers() as Record<string, string>;
            const payload: Record<string, unknown> = {
                t: Date.now() - startedAt,
                type: 'response',
                status: response.status(),
                url: this.redactUrl(response.url()),
                resourceType,
                fromCache: response.fromCache(),
                contentType: headers['content-type']
            };

            if (opts.logHeaders) {
                payload.headers = this.redactHeaders(headers);
            }

            console.log('[net]', payload);
        });

        page.on('requestfailed', (request) => {
            const failure = request.failure();
            const payload: Record<string, unknown> = {
                t: Date.now() - startedAt,
                type: 'requestfailed',
                method: request.method(),
                url: this.redactUrl(request.url()),
                resourceType: request.resourceType(),
                errorText: failure?.errorText
            };
            console.log('[net]', payload);
        });
    }

    private getTargetOrigin(targetUrl: string) {
        return new URL(targetUrl).origin;
    }

    private normalizeCookies(cookies: CookieParam[] | undefined, targetUrl: string) {
        if (!cookies || cookies.length === 0) return undefined;

        const origin = this.getTargetOrigin(targetUrl);
        return cookies.map((cookie) => {
            type CookieWithOptionalUrl = CookieParam & { url?: string };

            // Puppeteer requires either `url` or `domain` (plus path) to scope a cookie.
            // The calling API often omits these, so we default to the target origin.
            const hasDomain = typeof cookie.domain === 'string' && cookie.domain.length > 0;
            const cookieUrl = (cookie as CookieWithOptionalUrl).url;
            const hasUrl = typeof cookieUrl === 'string' && cookieUrl.length > 0;

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

        const enableNetworkDebug = pdfGenerationRequest.debugNetwork === true || pdfGenerationRequest.debug === true;
        if (enableNetworkDebug) {
            this.attachNetworkDebugging(page, { logHeaders: pdfGenerationRequest.debugNetworkHeaders === true });
            console.log('[net] network debugging enabled', {
                logHeaders: pdfGenerationRequest.debugNetworkHeaders === true
            });
        }

        const normalizedCookies = this.normalizeCookies(pdfGenerationRequest.cookies, pdfGenerationRequest.url);

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
        await report.pdfPage(page, {
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
