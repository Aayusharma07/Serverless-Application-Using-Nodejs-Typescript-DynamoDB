import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import Joi from 'joi';
import { getDataFromDB } from '../../services/dynamodb.service';
import { signinController } from '../../controllers/signin.controller'; // Replace 'your-module' with the correct path to your module

// Mock the required external functions or services
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

// jest.mock('joi', () => ({
//   object: jest.fn(() => ({
//     keys: jest.fn(() => ({
//       required: jest.fn(),
//       min: jest.fn(() => ({
//         required: jest.fn(),
//       })),
//     })),
//   })),
// }));

jest.mock('../../services/dynamodb.service', () => ({
  getDataFromDB: jest.fn(),
}));

describe('signinController', () => {
  let event: APIGatewayProxyEvent;
  let context: Context;

  beforeEach(() => {
    event = {} as APIGatewayProxyEvent;
    context = {} as Context;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return 400 if request body validation fails', async () => {
    event.body = JSON.stringify({}); // Invalid body

    const response = await signinController(event, context);

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.body)).toEqual({
      error: 'Bad Request',
      message: expect.any(String),
    });
  });

  it('should return 401 if password does not match', async () => {
    event.body = JSON.stringify({ userName: 'testuser', password: 'password123' });

    // Mock the result from DynamoDB
    const result = {
      Item: {
        password: 'hashedPassword',
      },
    };
    (getDataFromDB as jest.Mock).mockResolvedValue(result);

    // Mock bcrypt.compare to return false (password does not match)
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const response = await signinController(event, context);

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body)).toEqual({
      error: 'Unauthorized',
      message: 'Invalid credentials',
    });
  });

  it('should return 200 with a token if login is successful', async () => {
    event.body = JSON.stringify({ userName: 'testuser', password: 'password123' });

    // Mock the result from DynamoDB
    const result = {
      Item: {
        password: 'hashedPassword',
      },
    };
    (getDataFromDB as jest.Mock).mockResolvedValue(result);

    // Mock bcrypt.compare to return true (password matches)
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    // Mock the JWT token
    (jwt.sign as jest.Mock).mockReturnValue('mockedToken');

    const response = await signinController(event, context);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual({
      message: 'Login Successful',
      token: 'mockedToken',
    });
  });

  it('should return 500 if an error occurs', async () => {
    event.body = JSON.stringify({ userName: 'testuser', password: 'password123' });

    // Mock the error from DynamoDB
    (getDataFromDB as jest.Mock).mockRejectedValue(new Error('Database error'));

    const response = await signinController(event, context);

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toEqual({
      error: 'Internal Server Error',
      data: expect.any(Object),
    });
  });
});
