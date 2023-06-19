import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getAllBlogsController } from './controllers/getAllBlogs.controller';

// Get All Blogs From DynamoDB
export const getAllBlogs = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> =>
  getAllBlogsController(event, context);
