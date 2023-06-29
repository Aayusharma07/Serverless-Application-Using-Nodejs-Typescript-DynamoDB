import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import dotenv from 'dotenv';
import AWS from '../config/awsConfig';

dotenv.config();

const sqs = new AWS.SQS();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const consumer = async (event: APIGatewayProxyEvent, Context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const params: AWS.SQS.ReceiveMessageRequest = {
      QueueUrl: process.env.QUEUE_URL || '',
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 10,
      WaitTimeSeconds: 20,
    };

    const { Messages } = await sqs.receiveMessage(params).promise();
    const response: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({ message: Messages }),
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
