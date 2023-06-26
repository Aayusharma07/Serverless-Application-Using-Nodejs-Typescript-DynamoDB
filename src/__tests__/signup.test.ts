/* eslint-disable @typescript-eslint/no-explicit-any */
import { signUpController } from '../controllers/signup.controller';
import { insertIntoDynamoDB } from '../services/dynamodb.service';

jest.mock('../services/dynamodb.service', () => ({
  insertIntoDynamoDB: jest.fn(),
}));

describe('signUpController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a User successfully', async () => {
    const mockEvent: any = {
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe',
        email: 'johndoe@example.com',
        password: 'Password@123',
      }),
    };

    const mockInsertIntoDynamoDB = insertIntoDynamoDB as jest.MockedFunction<typeof insertIntoDynamoDB>;
    mockInsertIntoDynamoDB.mockResolvedValueOnce('inserted');

    const result = await signUpController(mockEvent, {} as any);

    expect(mockInsertIntoDynamoDB).toHaveBeenCalledWith({
      TableName: expect.any(String),
      Item: {
        id: expect.any(String),
        firstName: 'John',
        lastName: 'Doe',
        userName: 'johndoe',
        email: 'johndoe@example.com',
        password: expect.any(String),
      },
    });

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify({ data: 'inserted', message: 'User Signup Successfully' }));
  });
});
