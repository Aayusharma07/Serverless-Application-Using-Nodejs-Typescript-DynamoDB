import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import dotenv from 'dotenv';
import { BlogController } from './controllers/BlogController';
dotenv.config();

const blogController = new BlogController();

export const getAllBlogs = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> =>
  blogController.getAllBlogs(event, context);
