import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getAllData } from '../config/dynamoDB';
import dotenv from 'dotenv';
dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAllBlogs = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const params = {
      TableName: process.env.DYNAMO_DB_TABLE || '',
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
