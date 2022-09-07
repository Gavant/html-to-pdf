import { module, test } from 'qunit';

import { DEFAULT_TEMP_PATH } from '../../../src/constants/pdf';
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

    test('Storage Request class created correctly without filepath', function (assert) {
        const fileName = 'test.pdf';
        const secure = true;
        const metadata = { metadata1: 'metadata1Value' };
        const options = {
            expiresIn: 20
        };
        const request = new StorageRequest({
            fileName,
            filePath: DEFAULT_TEMP_PATH,
            secure,
            metadata,
            options
        });
        assert.strictEqual(request.fileName, fileName);
        assert.strictEqual(request.secure, secure);
        assert.strictEqual(request.metadata, metadata);
        assert.strictEqual(request.options, options);
        assert.ok(request.filePath.includes(DEFAULT_TEMP_PATH));
    });
});
