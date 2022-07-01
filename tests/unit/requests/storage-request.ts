import { module, test } from 'qunit';

import StorageRequest from '../../../src/requests/storage-request';

module('Unit | Requests | StorageRequest', function () {
    test('Storage Request class created correctly', function (assert) {
        const fileName = 'test.pdf';
        const filePath = 'test';
        const secure = true;
        const metadata = { metadata1: 'metadata1Value' };
        const options = {
            expiresIn: 20
        };
        const request = new StorageRequest({
            fileName,
            filePath,
            secure,
            metadata,
            options
        });
        assert.strictEqual(request.fileName, fileName);
        assert.strictEqual(request.filePath, filePath);
        assert.strictEqual(request.secure, secure);
        assert.strictEqual(request.metadata, metadata);
        assert.strictEqual(request.options, options);
    });
});
