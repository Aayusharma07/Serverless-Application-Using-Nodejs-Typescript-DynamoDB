import { ScanInput, PutItemInput, GetItemInput } from 'aws-sdk/clients/dynamodb';
import dynamoDb from '../../config/dynamoDB';
import { getAllData, insertIntoDynamoDB, getDataFromDB } from '../../services/dynamodb.service';

jest.mock('../../config/dynamoDB');

describe('DynamoDB Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllData', () => {
    it('should resolve with the scan result', async () => {
      const mockScanResult = { Items: [{ id: '1', name: 'John' }] };
      const mockScan = jest.fn().mockImplementation((_params, callback) => {
        callback(null, mockScanResult);
      });
      (dynamoDb.scan as jest.Mock).mockImplementation(mockScan);

      const scanParams: ScanInput = { TableName: 'your-table' };
      const result = await getAllData(scanParams);

      expect(mockScan).toHaveBeenCalledWith(scanParams, expect.any(Function));
      expect(result).toEqual(mockScanResult);
    });

    it('should reject with an error', async () => {
      const mockError = new Error('Scan error');
      const mockScan = jest.fn().mockImplementation((_params, callback) => {
        callback(mockError);
      });
      (dynamoDb.scan as jest.Mock).mockImplementation(mockScan);

      const scanParams: ScanInput = { TableName: 'your-table' };

      await expect(getAllData(scanParams)).rejects.toThrow(mockError);
      expect(mockScan).toHaveBeenCalledWith(scanParams, expect.any(Function));
    });
  });

  describe('insertIntoDynamoDB', () => {
    it('should resolve with the put result', async () => {
      const mockPutResult = { Attributes: { id: '1', name: 'John' } };
      const mockPut = jest.fn().mockImplementation((_params, callback) => {
        callback(null, mockPutResult);
      });
      (dynamoDb.put as jest.Mock).mockImplementation(mockPut);

      const putParams: PutItemInput = {
        TableName: 'your-table',
        Item: { id: expect.any(String), name: expect.any(String) },
      };
      const result = await insertIntoDynamoDB(putParams);

      expect(mockPut).toHaveBeenCalledWith(putParams, expect.any(Function));
      expect(result).toEqual(mockPutResult);
    });

    it('should reject with an error', async () => {
      const mockError = new Error('Put error');
      const mockPut = jest.fn().mockImplementation((_params, callback) => {
        callback(mockError);
      });
      (dynamoDb.put as jest.Mock).mockImplementation(mockPut);

      const putParams: PutItemInput = {
        TableName: 'your-table',
        Item: { id: expect.any(String), name: expect.any(String) },
      };

      await expect(insertIntoDynamoDB(putParams)).rejects.toThrow(mockError);
      expect(mockPut).toHaveBeenCalledWith(putParams, expect.any(Function));
    });
  });

  describe('getDataFromDB', () => {
    it('should resolve with the get result', async () => {
      const mockGetResult = { Item: { id: '1', name: 'John' } };
      const mockGet = jest.fn().mockImplementation((_params, callback) => {
        callback(null, mockGetResult);
      });
      (dynamoDb.get as jest.Mock).mockImplementation(mockGet);

      const getParams: GetItemInput = { TableName: 'your-table', Key: { id: expect.any(String) } };
      const result = await getDataFromDB(getParams);

      expect(mockGet).toHaveBeenCalledWith(getParams, expect.any(Function));
      expect(result).toEqual(mockGetResult);
    });

    it('should reject with an error', async () => {
      const mockError = new Error('Get error');
      const mockGet = jest.fn().mockImplementation((_params, callback) => {
        callback(mockError);
      });
      (dynamoDb.get as jest.Mock).mockImplementation(mockGet);

      const getParams: GetItemInput = { TableName: 'your-table', Key: { id: expect.any(String) } };

      await expect(getDataFromDB(getParams)).rejects.toThrow(mockError);
      expect(mockGet).toHaveBeenCalledWith(getParams, expect.any(Function));
    });
  });
});
