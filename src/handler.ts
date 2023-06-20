import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { getAllBlogsController } from './controllers/getAllBlogs.controller';
import dotenv from 'dotenv';
import { createBlogController } from './controllers/createBlog.controller';
dotenv.config();

// Get All Blogs From DynamoDB
export const getAllBlogs = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> =>
  getAllBlogsController(event, context);

// Create Blog and save to DynamoDB
export const createBlog = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> =>
  createBlogController(event, context);
