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

    async getPath() {
        const generatedPdfFilePath = await new PdfGenerationService().generate(this.request);
        console.log('PDF generated');
        return generatedPdfFilePath;
    }

    async handleRequest() {
        const path = await this.getPath();
        const pdfUrl = await new S3PdfStorageService().store(this.getPdfStorageRequest(path));
        console.log('Pdf stored on S3');
        return PdfGenerationResponseAdapter.toCreated(pdfUrl);
    }

    getPdfStorageRequest(pdfFilePath: string) {
        return new PdfStorageRequest(this.request?.fileName, pdfFilePath, {
            url: this.request?.url
        });
    }
}
