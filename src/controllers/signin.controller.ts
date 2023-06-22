import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi, { ValidationResult } from 'joi';
import { getDataFromDB } from '../services/dynamodb.service';

interface SigninBody {
  userName: string;
  password: string;
}

const schema = Joi.object({
  userName: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const signinController = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const { error, value }: ValidationResult<SigninBody> = schema.validate(JSON.parse(event.body || ''));

  if (error) {
    const response: APIGatewayProxyResult = {
      statusCode: 400,
      body: JSON.stringify({ error: 'Bad Request', message: error.details[0].message }),
    };

    return response;
  }

  const { userName, password } = value;
  try {
    // Retrieve the user from DynamoDB
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = {
      TableName: process.env.USERS_TABLE || '',
      Key: {
        userName: userName,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await getDataFromDB(params);

    const passwordMatch = await bcrypt.compare(password, result.Item.password);

    if (!passwordMatch) {
      const response: APIGatewayProxyResult = {
        statusCode: 401,
        body: JSON.stringify({ error: 'Unauthorized', message: 'Invalid credentials' }),
      };

      return response;
    }

    // Create a token with the user's information
    const token = jwt.sign({ userName }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

    const response: APIGatewayProxyResult = {
      statusCode: 200,
      body: JSON.stringify({ token }),
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
