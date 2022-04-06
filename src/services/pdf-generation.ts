import chromium from 'chrome-aws-lambda';
import { PDFOptions } from 'puppeteer-core';
import report from 'puppeteer-report';

import PdfGenerationRequest from '../requests/request';
import PdfStorageRequest from '../requests/storage-request';

const DEFAULT_PRINT_OPTIONS: PDFOptions = {
    printBackground: true,
    format: 'a4'
};
export default class PdfGenerationService {
    async generate(
        pdfGenerationRequest: PdfGenerationRequest,
        htmlToPdfPrintOptions: PDFOptions = DEFAULT_PRINT_OPTIONS
    ) {
        console.log('Starting to generate PDF');
        const browser = await this.launchBrowser(pdfGenerationRequest);
        console.log('Browser launched');
        const page = await browser.newPage();

        if (pdfGenerationRequest.cookies) {
            await page.setCookie(...pdfGenerationRequest.cookies);
            console.log('Cookies set');
        }
        console.log(pdfGenerationRequest);
        await page.goto(pdfGenerationRequest.url, {
            waitUntil: 'networkidle0'
        });
        console.log(`Puppeteer visited page located at ${pdfGenerationRequest.url}`);
        const pdfFilePath = `/tmp/${pdfGenerationRequest.fileName}`;
        const options = { ...htmlToPdfPrintOptions, ...pdfGenerationRequest.pdfOptions };
        await report.pdfPage(page, {
            path: pdfFilePath,
            ...options
        });
        console.log(`PDF generated`);
        await browser.close();
        console.log(`Browser closed`);
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
