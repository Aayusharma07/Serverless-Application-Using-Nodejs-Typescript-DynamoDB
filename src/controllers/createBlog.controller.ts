import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { insertIntoDynamoDB } from '../services/dynamodb.service';
import { PutItemInput, PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';

interface Data {
  author: string;
  title: string;
  content: string;
}

export const createBlogController = async (
  event: APIGatewayProxyEvent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const bodyData: Data = typeof event.body === 'string' ? JSON.parse(event.body) : null;
    if (!bodyData) {
      throw new Error('Invalid request body');
    }
    const timestamp = new Date().toISOString();
    const id = uuidv4();
    const params: PutItemInput = {
      TableName: process.env.BLOGS_TABLE || '',
      Item: {
        id,
        title: bodyData.title,
        author: bodyData.author,
        content: bodyData.content,
        timestamp,
      } as PutItemInputAttributeMap,
    };
    const result = await insertIntoDynamoDB(params);
    const response: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({ data: result, message: 'Blog Created Successfully' }),
    };
    return response;
  } catch (error) {
    const response: APIGatewayProxyResult = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', data: error }),
    };
    return response;
  }
};
