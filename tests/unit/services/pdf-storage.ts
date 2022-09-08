import fs from 'fs';
import { module, test } from 'qunit';

import PdfGenerationRequest from '../../../src/requests/request';
import PdfStorageRequest from '../../../src/requests/storage-request';
import PdfGenerationService from '../../../src/services/pdf-generation';
import PdfGenerationStorage from '../../../src/services/pdf-storage';

module('Unit | Services | PdfStorage', function () {
    test('PDF Storage works', async function (assert) {
        const url = 'https://www.google.com';
        const fileName = 'test.pdf';
        const secure = false;
        const cookies: any[] = [];
        const generationOptions = {
            pdfOptions: {},
            browserOptions: {
                headless: true
            }
        };
        const generationRequest = new PdfGenerationRequest({
            url,
            fileName,
            secure,
            cookies,
            options: generationOptions
        });
        const pdfUrl = await new PdfGenerationService().generate(generationRequest);
        assert.ok(pdfUrl, `PDF generated at url ${pdfUrl}`);
        assert.ok(fs.existsSync(pdfUrl), `PDF exists at url ${pdfUrl}`);

        const localFilePath = pdfUrl;
        const options = {
            expiresIn: 3600
        };
        const metadata = {};

        const request = new PdfStorageRequest({
            fileName,
            secure,
            options,
            localFilePath,
            metadata
        });
        const storageUrl = await new PdfGenerationStorage().store(request);
        assert.ok(pdfUrl, `PDF generated at url ${storageUrl}`);

        fs.unlinkSync(pdfUrl);
        assert.notOk(fs.existsSync(pdfUrl), `PDF removed at url ${pdfUrl}`);
    });

    test('Secure PDF Storage works', async function (assert) {
        const url = 'https://www.google.com';
        const fileName = 'test.pdf';
        const secure = true;
        const cookies: any[] = [];
        const generationOptions = {
            pdfOptions: {},
            browserOptions: {
                headless: true
            }
        };
        const generationRequest = new PdfGenerationRequest({
            url,
            fileName,
            secure,
            cookies,
            options: generationOptions
        });
        const pdfUrl = await new PdfGenerationService().generate(generationRequest);
        assert.ok(pdfUrl, `PDF generated at url ${pdfUrl}`);
        assert.ok(fs.existsSync(pdfUrl), `PDF exists at url ${pdfUrl}`);

        const localFilePath = pdfUrl;
        const options = {
            expiresIn: 3600
        };
        const metadata = {};

        const request = new PdfStorageRequest({
            fileName,
            secure,
            options,
            localFilePath,
            metadata
        });
        const storageUrl = await new PdfGenerationStorage().store(request);
        assert.ok(pdfUrl, `PDF generated at url ${storageUrl}`);

        fs.unlinkSync(pdfUrl);
        assert.notOk(fs.existsSync(pdfUrl), `PDF removed at url ${pdfUrl}`);
    });
});
