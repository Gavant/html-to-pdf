import { module, test } from 'qunit';

import PdfGenerationRequest from '../../../src/requests/request';

module('Unit | Requests | Adapter', function () {
    test('Request class created correctly', function (assert) {
        const url = 'https://www.google.com';
        const fileName = 'test.pdf';
        const path = 'test';
        const cookies: any[] = [];
        const options = {
            pdfOptions: {},
            browserOptions: {}
        };
        const request = new PdfGenerationRequest(url, fileName, path, true, cookies, options);
        assert.strictEqual(request.url, url);
        assert.strictEqual(request.fileName, fileName);
        assert.strictEqual(request.path, path);
        assert.strictEqual(request.cookies, cookies);
    });
});
