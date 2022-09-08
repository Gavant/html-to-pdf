import { module, test } from 'qunit';

import { PDFRequestOptions } from '../../../src/requests/adapter';
import PdfGenerationRequest from '../../../src/requests/request';

module('Unit | Requests | Adapter', function () {
    test('Request class created correctly', function (assert) {
        const url = 'https://www.google.com';
        const fileName = 'test.pdf';
        const secure = true;
        const cookies: any[] = [];
        const options: PDFRequestOptions = {
            pdfOptions: { timeout: 299 },
            browserOptions: { timeout: 299 },
            storageOptions: { expiresIn: 20 }
        };
        const request = new PdfGenerationRequest({
            url,
            fileName,
            secure,
            cookies,
            options
        });
        assert.strictEqual(request.url, url);
        assert.strictEqual(request.fileName, fileName);
        assert.strictEqual(request.secure, secure);
        assert.strictEqual(request.cookies, cookies);
        assert.strictEqual(request.pdfOptions, options.pdfOptions);
        assert.strictEqual(request.browserOptions, options.browserOptions);
        assert.strictEqual(request.storageOptions, options.storageOptions);
    });
});
