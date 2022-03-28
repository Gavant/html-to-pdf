const PdfGenerationRequestHandler = require('../dist/requests/handler').default;
console.log(PdfGenerationRequestHandler);

const test = new PdfGenerationRequestHandler({
    body: { url: 'https://www.google.com' }
}).handleRequest();
