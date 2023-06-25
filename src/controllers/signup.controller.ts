/* eslint-disable @typescript-eslint/no-unused-vars */
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import bcrypt from 'bcryptjs';
import Joi, { ValidationResult } from 'joi';
import { v4 as uuidv4 } from 'uuid';
import { PutItemInput, PutItemInputAttributeMap } from 'aws-sdk/clients/dynamodb';
import { insertIntoDynamoDB } from '../services/dynamodb.service';

interface SignupBody {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
}

const schema = Joi.object({
  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),
  userName: Joi.string().min(3).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
    .required(),
  password: Joi.string().min(6).required(),
});

export const signUpController = async (event: APIGatewayProxyEvent, content: Context): Promise<APIGatewayProxyResult> => {
  const { error, value }: ValidationResult<SignupBody> = schema.validate(JSON.parse(event.body || ''));
  if (error) {
    const response: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({ error: 'Bad Request', message: error.details[0].message }),
    };

    return response;
  }

  const { firstName, lastName, userName, email, password } = value;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const params: PutItemInput = {
      TableName: process.env.USERS_TABLE || '',
      Item: {
        id: id,
        firstName: firstName,
        lastName: lastName,
        userName,
        email: email,
        password: hashedPassword,
      } as PutItemInputAttributeMap,
    };
    const result = await insertIntoDynamoDB(params);
    const response: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({ data: result, message: 'User Signup Successfully' }),
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
