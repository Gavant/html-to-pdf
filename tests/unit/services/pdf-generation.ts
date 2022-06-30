import fs from 'fs';
import { module, test } from 'qunit';

import PdfGenerationRequest from '../../../src/requests/request';
import PdfGenerationService from '../../../src/services/pdf-generation';

module('Unit | Services | PdfGeneration', function () {
    test('PDF Generated', async function (assert) {
        const url = 'https://www.google.com';
        const fileName = 'test.pdf';
        const path = './';
        const cookies: any[] = [];
        const options = {
            pdfOptions: {},
            browserOptions: {
                headless: true
            }
        };
        const request = new PdfGenerationRequest(url, fileName, path, true, cookies, options);
        const pdfUrl = await new PdfGenerationService().generate(request);
        assert.ok(pdfUrl, `PDF generated at url ${pdfUrl}`);
        assert.ok(fs.existsSync(pdfUrl), `PDF exists at url ${pdfUrl}`);
        fs.unlinkSync(pdfUrl);
        assert.notOk(fs.existsSync(pdfUrl), `PDF removed at url ${pdfUrl}`);
    });
});
