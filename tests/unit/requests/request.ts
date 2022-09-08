import { module, test } from 'qunit';

import PdfGenerationRequestAdapter from '../../../src/requests/adapter';

module('Unit | Requests | Request', function () {
    test('Filename can be passed in', function (assert) {
        const request = new PdfGenerationRequestAdapter({
            version: '1',
            routeKey: '$default',
            rawPath: '/',
            rawQueryString: '',
            headers: {},
            requestContext: {
                accountId: '123456789012',
                apiId: '1234567890',
                domainName: 'api.example.com',
                domainPrefix: 'api',
                http: {
                    method: 'GET',
                    path: '/',
                    protocol: 'HTTP/1.1',
                    sourceIp: '',
                    userAgent: 'aws-amplify/0.1.x'
                },
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                routeKey: '$default',
                stage: 'dev',
                time: 'Mon, 06 Dec 2016 12:00:00 GMT',
                timeEpoch: 1480640400000
            },
            isBase64Encoded: false,
            body: {
                url: 'https://www.google.com',
                fileName: 'test.pdf',
                path: 'test',
                cookies: [],
                options: {}
            } as unknown as string
        }).toPdfGenerationRequest();

        assert.strictEqual(request.fileName, 'test.pdf');
    });
});
