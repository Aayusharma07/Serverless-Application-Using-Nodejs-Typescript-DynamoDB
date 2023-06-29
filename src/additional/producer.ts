import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import axios from 'axios';
import https from 'https';
import AWS from '../config/awsConfig';
import dotenv from 'dotenv';

dotenv.config();

const sqs = new AWS.SQS();

const fetchDataFromThirdPartyAPI = async (apiUrl: string) => {
  try {
    const agent = new https.Agent({
      rejectUnauthorized: false, // Disables SSL verification
    });

    const result = await axios.get(apiUrl, { httpsAgent: agent });
    return result;
  } catch (error) {
    throw new Error('Unable to Fetch data from API')
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendDataToSQS = async (dataItem: any) => {
  const queueUrl = process.env.QUEUE_URL || '';
  const messageAttributes: AWS.SQS.MessageBodyAttributeMap = {
    title: {
      DataType: 'String',
      StringValue: dataItem.title,
    },
    author: {
      DataType: 'String',
      StringValue: dataItem.author,
    },
    genre: {
      DataType: 'String',
      StringValue: dataItem.genre,
    },
    content: {
      DataType: 'String',
      StringValue: dataItem.content,
    },
  };

  const params: AWS.SQS.SendMessageRequest = {
    MessageGroupId: 'group1',
    MessageDeduplicationId: `${Date.now()}`,
    MessageBody: JSON.stringify(dataItem),
    QueueUrl: queueUrl,
    MessageAttributes: messageAttributes,
  };

  try {
    await sqs.sendMessage(params).promise();
  } catch (error) {
    throw new Error('Unable to Process')
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const producer = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    const apiUrl = 'https://fakerapi.it/api/v1/texts?_quantity=10&_characters=500';
    const result = await fetchDataFromThirdPartyAPI(apiUrl);
    const dataItems = result.data.data;
    for (const dataItem of dataItems) {
      await sendDataToSQS(dataItem);
    }
    const response: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({ message: 'data sended to queue' }),
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
