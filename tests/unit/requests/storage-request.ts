import { module, test } from 'qunit';

import StorageRequest from '../../../src/requests/storage-request';

module('Unit | Requests | StorageRequest', function () {
    test('Storage Request class created correctly', function (assert) {
        const fileName = 'test.pdf';
        const localFilePath = 'test';
        const secure = true;
        const metadata = { metadata1: 'metadata1Value' };
        const options = {
            expiresIn: 20
        };
        const request = new StorageRequest({
            fileName,
            localFilePath,
            secure,
            metadata,
            options
        });
        assert.strictEqual(request.fileName, fileName);
        assert.strictEqual(request.localFilePath, localFilePath);
        assert.strictEqual(request.secure, secure);
        assert.strictEqual(request.metadata, metadata);
        assert.strictEqual(request.options, options);
        assert.ok(request.storageFilePath);
    });
});
