/* eslint-disable @typescript-eslint/no-explicit-any */
import middy from 'middy';
import { APIGatewayProxyEvent } from 'aws-lambda';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const jwtMiddleware = () => {
  return {
    before: (handler: middy.HandlerLambda, next: middy.NextFunction) => {
      const { headers } = handler.event as APIGatewayProxyEvent;
      const token = headers['Authorization']?.split(' ')[1];

      if (!token) {
        const response: any = {
          statusCode: 400,
          body: JSON.stringify({ message: 'Missing Token' }),
        };
        return next(response);
      }

      try {
        const key: any = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, key);
        handler.event.tokenPayload = decoded;
        next();
      } catch (error) {
        const response: any = {
          statusCode: 400,
          body: JSON.stringify({ message: 'Invalid Token' }),
        };
        return next(response);
      }
    },
  };
};

export default jwtMiddleware;
