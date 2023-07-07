import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
// import { getAllBlogsController } from './controllers/getAllBlogs';
import dotenv from 'dotenv';
// import { createBlogController } from './controllers/createBlog';
import { signUpController } from './controllers/signup.controller';
import { signinController } from './controllers/signin.controller';
dotenv.config();

// // Get All Blogs From DynamoDB
// export const getAllBlogs = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> =>
//   getAllBlogsController(event, context);

// // Create Blog and save to DynamoDB
// export const createBlog = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> =>
//   createBlogController(event, context);

// Sign up User
export const signUp = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> =>
  signUpController(event, context);

// Sign in User
export const signIn = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> =>
  signinController(event, context);