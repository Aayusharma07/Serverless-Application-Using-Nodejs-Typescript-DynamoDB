import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getAllData } from '../services/dynamodb.service';
import middy from 'middy';
import jwtMiddleware from '../middleware/validate.middleware';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAllBlogsController = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const { limit, exclusiveStartKey } = event.queryStringParameters || {};
  try {
    const params = {
      TableName: process.env.BLOGS_TABLE || '',
      Limit: limit ? parseInt(limit, 10) : 10,
      ExclusiveStartKey: exclusiveStartKey ? JSON.parse(decodeURIComponent(exclusiveStartKey)) : undefined,
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

export const getAllBlogs = middy(getAllBlogsController).use(jwtMiddleware());