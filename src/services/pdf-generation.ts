import chromium from 'chrome-aws-lambda';
import { PDFOptions } from 'puppeteer-core';
import report from 'puppeteer-report';

import PdfGenerationRequest from '../requests/request';

const DEFAULT_PRINT_OPTIONS: PDFOptions = {
    printBackground: true,
    format: 'a4'
};
export default class PdfGenerationService {
    async generate(
        pdfGenerationRequest: PdfGenerationRequest,
        htmlToPdfPrintOptions: PDFOptions = DEFAULT_PRINT_OPTIONS
    ) {
        const browser = await this.launchBrowser(pdfGenerationRequest);
        const page = await browser.newPage();

        if (pdfGenerationRequest.cookies) {
            await page.setCookie(...pdfGenerationRequest.cookies);
        }

        await page.goto(pdfGenerationRequest.url, {
            waitUntil: 'networkidle0'
        });
        const pdfFilePath = `/tmp/${pdfGenerationRequest.fileName}`;
        const options = { ...htmlToPdfPrintOptions, ...pdfGenerationRequest.pdfOptions };
        await report.pdfPage(page, {
            path: pdfFilePath,
            ...options
        });
        await browser.close();
        return pdfFilePath;
    }

    async launchBrowser(pdfGenerationRequest: PdfGenerationRequest) {
        return await chromium.puppeteer.launch({
            args: chromium.args,
            defaultViewport: null,
            executablePath: await chromium.executablePath,
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
            ...pdfGenerationRequest.browserOptions
        });
    }
}
