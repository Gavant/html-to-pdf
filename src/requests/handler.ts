import { APIGatewayProxyEventV2 } from 'aws-lambda';

import PdfGenerationResponseAdapter from '../responses/response-adapter';
import PdfGenerationService from '../services/pdf-generation';
import S3PdfStorageService from '../services/pdf-storage';
import PdfGenerationRequestAdapter from './adapter';
import PdfGenerationRequest from './request';
import PdfStorageRequest from './storage-request';

export default class PdfGenerationRequestHandler {
    request: PdfGenerationRequest;

    constructor(event: APIGatewayProxyEventV2) {
        console.log('in PdfGenerationRequestHandler');
        this.request = new PdfGenerationRequestAdapter(event).toPdfGenerationRequest();
    }

    /**
     * Generates the pdf and returns the path to the file
     *
     * @return {*}
     * @memberof PdfGenerationRequestHandler
     */
    async getPath() {
        const generatedPdfFilePath = await new PdfGenerationService().generate(this.request);
        console.log('PDF generated');
        return generatedPdfFilePath;
    }

    /**
     * handle request for PDF by generating it and then storing it in S3
     *
     * @return {*}
     * @memberof PdfGenerationRequestHandler
     */
    async handleRequest() {
        const path = await this.getPath();
        const storageRequest = this.getPdfStorageRequest(path);
        const pdfUrl = await new S3PdfStorageService().store(storageRequest);
        console.log('Pdf stored on S3');
        return PdfGenerationResponseAdapter.toCreated(pdfUrl);
    }

    /**
     * Generate a new storage request for the pdf
     *
     * @param {string} pdfFilePath
     * @return {*}
     * @memberof PdfGenerationRequestHandler
     */
    getPdfStorageRequest(pdfFilePath: string) {
        return new PdfStorageRequest(this.request?.fileName, pdfFilePath, {
            url: this.request?.url
        });
    }
}
