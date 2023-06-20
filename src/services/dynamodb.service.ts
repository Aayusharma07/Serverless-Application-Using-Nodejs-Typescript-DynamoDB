import { ScanInput } from 'aws-sdk/clients/dynamodb';
import dynamoDb from '../config/dynamoDB';

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