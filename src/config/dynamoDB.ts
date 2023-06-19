import AWS from './awsConfig';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export default dynamoDb;