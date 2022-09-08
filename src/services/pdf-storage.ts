import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { ACCESS_KEY, PDF_STORAGE_BUCKET_NAME, PDF_STORAGE_BUCKET_REGION, SECRET_KEY } from '../config';
import PdfStorageRequest from '../requests/storage-request';
import S3PdfStorageRequestAdapter from '../s3/requests/adapter';

const config: S3ClientConfig = { region: PDF_STORAGE_BUCKET_REGION };
const s3BucketBaseUrl = `https://${PDF_STORAGE_BUCKET_NAME}.s3.amazonaws.com`;
if (ACCESS_KEY && SECRET_KEY) {
    config['credentials'] = {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY
    };
}

const client = new S3Client(config);

export default class S3PdfStorageService {
    s3PdfStorageRequestAdapter: S3PdfStorageRequestAdapter;
    constructor() {
        this.s3PdfStorageRequestAdapter = new S3PdfStorageRequestAdapter();
    }

    async store(pdfStorageRequest: PdfStorageRequest) {
        const command = this.s3PdfStorageRequestAdapter?.toPutObjectCommand(pdfStorageRequest);
        const result = await client.send(command);
        if (pdfStorageRequest.secure) {
            const getCommand = this.s3PdfStorageRequestAdapter.toGetObjectCommand(pdfStorageRequest);
            const url = await getSignedUrl(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore gnarly type error on client - ignore for now
                client,
                getCommand,
                {
                    expiresIn: 3600
                }
            );
            console.log(url);
            return url;
        } else {
            const url = `${s3BucketBaseUrl}/${pdfStorageRequest.storageFilePath}/${pdfStorageRequest.fileName}`;
            console.log(result);
            console.log(url);
            return url;
        }
    }
}
