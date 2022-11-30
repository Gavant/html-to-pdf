import { PDF_STORAGE_BUCKET_NAME } from '../config';
import PdfStorageRequest from '../requests/storage-request';

export default class PdfGenerationResponseAdapter {
    static toCreated(pdfUrl: string, storageRequest: PdfStorageRequest) {
        return {
            url: pdfUrl,
            bucket: PDF_STORAGE_BUCKET_NAME,
            key: `${storageRequest.storageFilePath}/${storageRequest.fileName}`
        };
    }
}
