import { ScanInput, ScanOutput } from 'aws-sdk/clients/dynamodb';
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export class BlogService {
  async getAllData(params: ScanInput): Promise<ScanOutput> {
    return new Promise<ScanOutput>((resolve, reject) => {
      dynamoDb.scan(params, (err, result) => {
        if (err) {
          reject(err);
        }
        if (result) {
          resolve(result);
        }
      });
    });
  }
}
