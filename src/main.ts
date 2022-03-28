import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Handler } from 'aws-lambda';

import PdfGenerationRequestHandler from './requests/handler';

type ProxyHandler = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2>;
export const handler: ProxyHandler = async (event) => {
    try {
        const requestHandler = await new PdfGenerationRequestHandler(event).handleRequest();
        return requestHandler.url;
    } catch (err) {
        console.log(err);
        return err as string;
    }
};
