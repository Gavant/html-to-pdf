import { GetObjectCommand, PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';

import { PDF_STORAGE_BUCKET_NAME } from '../../config';
import PdfStorageRequest from '../../requests/storage-request';
import FileService from '../../services/file-service';

export default class S3PdfStorageRequestAdapter {
    toPutObjectCommand(pdfStorageRequest: PdfStorageRequest) {
        const commandOptions: PutObjectCommandInput = {
            Bucket: PDF_STORAGE_BUCKET_NAME,
            Key: `${pdfStorageRequest.storageFilePath}/${pdfStorageRequest.fileName}`,
            Body: FileService.getReadStream(pdfStorageRequest.localFilePath),
            ContentType: 'application/pdf',
            ContentDisposition: 'attachment',
            CacheControl: 'no-cache',
            Metadata: pdfStorageRequest.metadata
        };
        if (!pdfStorageRequest.secure) {
            commandOptions['ACL'] = 'public-read';
        }
        return new PutObjectCommand(commandOptions);
    }

    toGetObjectCommand(pdfStorageRequest: PdfStorageRequest) {
        return new GetObjectCommand({
            Bucket: PDF_STORAGE_BUCKET_NAME,
            Key: `${pdfStorageRequest.storageFilePath}/${pdfStorageRequest.fileName}`
        });
    }
}
