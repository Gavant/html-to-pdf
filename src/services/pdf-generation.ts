import puppeteer, { PDFOptions } from 'puppeteer-core';
import report from 'puppeteer-report';

import chromium from '@sparticuz/chromium';

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
            waitUntil: 'networkidle0',
            ...pdfGenerationRequest.pdfOptions
        });
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
            defaultViewport: chromium.defaultViewport,
            executablePath: chromiumPath,
            headless: chromium.headless as boolean,
            ...pdfGenerationRequest.browserOptions
        };
        return await puppeteer.launch(options);
    }
}
