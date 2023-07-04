import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import axios from 'axios';
// import AWS from '../../config/awsConfig';
import { producer } from '../../additional/producer';

jest.mock('axios');
jest.mock('../../config/awsConfig');

describe('producer', () => {
  const mockAxios = axios as jest.Mocked<typeof axios>;
//   const mockSqs = new AWS.SQS() as jest.Mocked<AWS.SQS>;

  const mockEvent: APIGatewayProxyEvent = {} as APIGatewayProxyEvent;
  const mockContext: Context = {} as Context;

  beforeEach(() => {
    jest.clearAllMocks();
  });

//   it('should send data to SQS queue', async () => {
//     const mockApiResponse = {
//       data: {
//         data: [
//           { title: 'Title 1', author: 'Author 1', genre: 'Genre 1', content: 'Content 1' },
//           { title: 'Title 2', author: 'Author 2', genre: 'Genre 2', content: 'Content 2' },
//         ],
//       },
//     };
//     const mockSendMessage = jest.fn().mockReturnValue({ promise: jest.fn() });
//     mockAxios.get.mockResolvedValue(mockApiResponse);
//     mockSqs.sendMessage.mockReturnValue({ promise: mockSendMessage } as any);

//     const result = await producer(mockEvent, mockContext);

//     expect(mockAxios.get).toHaveBeenCalledWith('https://fakerapi.it/api/v1/texts?_quantity=10&_characters=500');
//     expect(mockSendMessage).toHaveBeenCalledTimes(2);
//     expect(mockSqs.sendMessage).toHaveBeenCalledWith({
//       MessageGroupId: 'group1',
//       MessageDeduplicationId: expect.any(String),
//       MessageBody: expect.any(String),
//       QueueUrl: expect.any(String),
//       MessageAttributes: expect.any(Object),
//     });
//     expect(result).toEqual({
//       statusCode: 200,
//       body: JSON.stringify({ message: 'data sended to queue' }),
//     });
//   });

  it('should handle errors', async () => {
    const mockError = new Error('Some error');
    mockAxios.get.mockRejectedValue(mockError);

    const result = await producer(mockEvent, mockContext);

    expect(result).toEqual({
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', data: mockError }),
    });
  });
});
