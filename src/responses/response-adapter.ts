export default class PdfGenerationResponseAdapter {
    static toCreated(pdfUrl: string) {
        return {
            url: pdfUrl
        };
    }
}
