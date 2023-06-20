import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getAllData } from '../services/dynamodb.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAllBlogsController = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const params = {
      TableName: process.env.BLOGS_TABLE || '',
    };
    const result = await getAllData(params);
    const response: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({ data: result }),
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
