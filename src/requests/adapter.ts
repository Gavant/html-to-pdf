import { APIGatewayProxyEventV2 } from 'aws-lambda';

import PdfGenerationRequest from './request';

const randomNumber = () => Math.round(Math.random() * 999999999999999999);
const randomFileName = () => `${Date.now()}_${randomNumber()}`;

export default class PdfGenerationRequestAdapter {
    fileName: string;
    requestBody: any;
    constructor(event: APIGatewayProxyEventV2) {
        this.requestBody = event.body;
        this.fileName = this.requestBody?.fileName ?? `${randomFileName()}.pdf`;
    }

    toPdfGenerationRequest() {
        return new PdfGenerationRequest(
            this.requestBody.url,
            this.requestBody.path,
            this.fileName,
            this.requestBody.cookies,
            this.requestBody.options
        );
    }
}
