import { module, test } from 'qunit';

import StorageRequest from '../../../src/requests/storage-request';

module('Unit | Requests | StorageRequest', function () {
    test('Storage Request class created correctly', function (assert) {
        const fileName = 'test.pdf';
        const path = 'test';
        const metadata = { metadata1: 'metadata1Value' };
        const request = new StorageRequest(fileName, path, true, metadata);
        assert.strictEqual(request.fileName, fileName);
        assert.strictEqual(request.filePath, path);
        assert.strictEqual(request.metadata, metadata);
    });
});
