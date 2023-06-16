import { ScanInput } from 'aws-sdk/clients/dynamodb';
import AWS from './awsConfig';

const dynamoDb = new AWS.DynamoDB.DocumentClient();


export const getAllData = async (params: ScanInput) => {
    return new Promise((resolve, reject) => {
      dynamoDb.scan(params, (err, result) => {
        if (err) {
          reject(err);
        }
        if (result) {
          resolve(result);
        }
      });
    });
  };