import { APIGatewayProxyEventV2 } from 'aws-lambda';

import PdfGenerationRequest from './request';

const randomNumber = () => Math.round(Math.random() * 999999999999999999);
const randomFileName = () => `${Date.now()}_${randomNumber()}`;

export default class PdfGenerationRequestAdapter {
    fileName: string;
    requestBody: any;
    constructor(event: APIGatewayProxyEventV2) {
        this.fileName = `${randomFileName()}.pdf`;
        this.requestBody = event.body;
    }

    toPdfGenerationRequest() {
        let isPublic = "false";
        if (this.requestBody.hasOwnProperty("isPublic")) isPublic = this.requestBody.isPublic;
        return new PdfGenerationRequest(
            this.requestBody.url,
            this.fileName,
            this.requestBody.cookies,
            this.requestBody.options,
            isPublic
        );
    }
}
