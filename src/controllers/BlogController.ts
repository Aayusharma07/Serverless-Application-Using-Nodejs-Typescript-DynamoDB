import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { BlogService } from '../services/BlogService';

export class BlogController {
  private blogService: BlogService;

  constructor() {
    this.blogService = new BlogService();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getAllBlogs(event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {
    try {
      const params = {
        TableName: process.env.DYNAMO_DB_TABLE || '',
      };
      const result = await this.blogService.getAllData(params);
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
  }
}

// Usage example:
// const blogController = new BlogController();
// export const getAllBlogs = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> =>
//   blogController.getAllBlogs(event, context);
