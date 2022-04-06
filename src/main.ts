import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Handler } from 'aws-lambda';

import PdfGenerationRequestHandler from './requests/handler';

type ProxyHandler<T> = Handler<APIGatewayProxyEventV2, APIGatewayProxyResultV2<T>>;
export const handler: ProxyHandler<{ url: string }> = async (event) => {
    try {
        console.log(event);
        const requestHandler = await new PdfGenerationRequestHandler(event).handleRequest();
        return requestHandler;
    } catch (err) {
        console.log(err);
        return err as string;
    }
};
