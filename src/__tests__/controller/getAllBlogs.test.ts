/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context } from 'aws-lambda';
import { getAllData } from '../../services/dynamodb.service';
import { getAllBlogsController } from '../../controllers/getAllBlogs';

jest.mock('../../services/dynamodb.service', () => ({
  getAllData: jest.fn(),
}));

describe('getAllBlogsController', () => {
  const mockEvent: any = {
    queryStringParameters: {
      limit: '10',
      exclusiveStartKey: 'someKey',
    },
  };

  const mockContext: Context = {} as Context;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return data with status code 200 when getAllData resolves successfully', async () => {
    const mockResult = [
      {
        content:
          "Dubai's pristine beaches are perfect for relaxation and water activities. Jumeirah Beach, with its soft white sand and crystal-clear waters, is a popular spot for sunbathing and swimming. Adventure enthusiasts can try their hand at various water sports, such as jet skiing, paddleboarding, and flyboarding.",
        id: '7811de20-5cbf-4a7d-89db-8316342b62f4',
        title: "Unwinding on Dubai's Serene Beaches",
        author: 'Isabella Davis',
        timestamp: '2023-06-20T16:41:45.272Z',
      },
      {
        content:
          "Dubai's cultural scene is a treasure trove of art and creativity. The Alserkal Avenue, an arts and culture district, houses numerous galleries, studios, and creative spaces. Art enthusiasts can also visit the Dubai Design District, known as d3, which showcases cutting-edge designs from local and international talents.",
        id: '9f5d9e3c-93fd-4e92-b825-1b5cc53e9c7d',
        title: "Immersing in Dubai's Art and Design",
        author: 'Liam Johnson',
        timestamp: '2023-06-20T17:28:53.398Z',
      },
    ];
    (getAllData as jest.Mock).mockResolvedValue(mockResult);

    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify({ data: mockResult }),
    };

    const response = await getAllBlogsController(mockEvent, mockContext);

    expect(getAllData).toHaveBeenCalledWith({
      TableName: expect.any(String),
      Limit: 10,
      ExclusiveStartKey: expect.any(Object),
    });
    expect(response).toEqual(expectedResponse);
  });

  it('should return error response with status code 500 when getAllData rejects', async () => {
    const mockError = new Error('Database error');
    (getAllData as jest.Mock).mockRejectedValue(mockError);

    const expectedResponse = {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', data: mockError }),
    };

    const response = await getAllBlogsController(mockEvent, mockContext);

    expect(getAllData).toHaveBeenCalledWith({
      TableName: expect.any(String),
      Limit: 10,
      ExclusiveStartKey: expect.any(Object),
    });
    expect(response).toEqual(expectedResponse);
  });
});
