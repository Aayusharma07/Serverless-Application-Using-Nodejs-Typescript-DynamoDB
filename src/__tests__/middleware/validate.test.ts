import middy from 'middy';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import jwtMiddleware from '../../middleware/validate.middleware';

dotenv.config();

describe('JWT Middleware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set tokenPayload on event object when a valid token is provided', async () => {
    const mockHandler = {
      event: {
        headers: {
          Authorization: 'Bearer valid-token',
        },
      },
    } as middy.HandlerLambda;

    const mockNext = jest.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mockVerify: any = jest.spyOn(jwt, 'verify');
    mockVerify.mockReturnValueOnce({
      userName: 'Aayu8982',
      iat: 1687859471,
      exp: 1687863071,
    });

    await jwtMiddleware().before(mockHandler, mockNext);

    expect(mockVerify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
    expect(mockHandler.event.tokenPayload).toEqual({
      userName: 'Aayu8982',
      iat: 1687859471,
      exp: 1687863071,
    });
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should call next with error response when no token is provided', async () => {
    const mockHandler = {
      event: {
        headers: {},
      },
    } as middy.HandlerLambda;

    const mockNext = jest.fn();

    const mockResponse = {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing Token' }),
    };

    await jwtMiddleware().before(mockHandler, mockNext);

    expect(mockNext).toHaveBeenCalledWith(mockResponse);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should call next with error response when an invalid token is provided', async () => {
    const mockHandler = {
      event: {
        headers: {
          Authorization: 'Bearer invalid-token',
        },
      },
    } as middy.HandlerLambda;

    const mockNext = jest.fn();

    const mockVerify = jest.spyOn(jwt, 'verify');
    mockVerify.mockImplementationOnce(() => {
      throw new Error('Invalid Token');
    });

    const mockResponse = {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid Token' }),
    };

    await jwtMiddleware().before(mockHandler, mockNext);

    expect(mockVerify).toHaveBeenCalledWith('invalid-token', process.env.JWT_SECRET);
    expect(mockNext).toHaveBeenCalledWith(mockResponse);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
