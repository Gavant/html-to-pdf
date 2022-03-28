import { S3Client } from '@aws-sdk/client-s3';

import { PDF_STORAGE_BUCKET_NAME, PDF_STORAGE_BUCKET_REGION } from '../config';
import PdfStorageRequest from '../requests/storage-request';
import S3PdfStorageRequestAdapter from '../s3/requests/adapter';

const client = new S3Client({
    region: PDF_STORAGE_BUCKET_REGION
});
const s3BucketBaseUrl = `https://${PDF_STORAGE_BUCKET_NAME}.s3.amazonaws.com`;

export default class S3PdfStorageService {
    s3PdfStorageRequestAdapter: S3PdfStorageRequestAdapter;
    constructor() {
        this.s3PdfStorageRequestAdapter = new S3PdfStorageRequestAdapter();
    }

    async store(pdfStorageRequest: PdfStorageRequest) {
        const result = await client.send(this.s3PdfStorageRequestAdapter?.toPutObjectCommand(pdfStorageRequest));
        console.log(result);
        return `${s3BucketBaseUrl}/tmp/${pdfStorageRequest.fileName}`;
    }
}
