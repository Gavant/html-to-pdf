import { PutObjectCommand } from '@aws-sdk/client-s3';

import { PDF_STORAGE_BUCKET_NAME } from '../../config';
import PdfStorageRequest from '../../requests/storage-request';
import FileService from '../../services/file-service';

export default class S3PdfStorageRequestAdapter {
    toPutObjectCommand(pdfStorageRequest: PdfStorageRequest) {
        return new PutObjectCommand({
            Bucket: PDF_STORAGE_BUCKET_NAME,
            Key: `tmp/${pdfStorageRequest.fileName}`,
            Body: FileService.getReadStream(pdfStorageRequest.filePath),
            ContentType: 'application/pdf',
            ContentDisposition: 'attachment',
            CacheControl: 'no-cache',
            Metadata: pdfStorageRequest.metadata,
            Tagging: 'public=yes'
        });
    }
}
