import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { consumer } from '../../additional/consumer'; // Update the import path based on your project structure

jest.mock('aws-sdk', () => ({
  SQS: jest.fn().mockImplementation(() => ({
    receiveMessage: jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Messages: [{ message: 'Test message' }] }),
    }),
  })),
}));

describe('consumer', () => {
  const mockEvent: APIGatewayProxyEvent = {} as APIGatewayProxyEvent;
  const mockContext: Context = {} as Context;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a success response with messages', async () => {
    const expectedResult: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({ message: [{ message: 'Test message' }] }),
    };
    const result = await consumer(mockEvent, mockContext);
    expect(result).toEqual(expectedResult);
  });

  //   it('should return an error response when an exception occurs', async () => {
  //     const mockError = new Error('SOme error');

  //     (SQS.prototype.receiveMessage as jest.Mock)?.mockRejectedValue(mockError);

  //     const expectedResult: APIGatewayProxyResult = {
  //       statusCode: 500,
  //       body: JSON.stringify({ error: 'Internal Server Error', data: mockError }),
  //     };

  //     const result = await consumer(mockEvent, mockContext);

  //     expect(result).toEqual(expectedResult);
  //   });
});
