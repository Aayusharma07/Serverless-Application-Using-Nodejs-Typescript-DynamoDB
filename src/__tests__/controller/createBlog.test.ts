/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBlogController } from '../../controllers/createBlog.controller';
import { insertIntoDynamoDB } from '../../services/dynamodb.service';

jest.mock('../../services/dynamodb.service', () => ({
    insertIntoDynamoDB: jest.fn(),
}));

describe('createBlogController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a blog successfully', async () => {
        const mockEvent: any = {
            body: JSON.stringify({
                author: 'John Doe',
                title: 'Test Blog',
                content: 'This is a test blog.',
            }),
        };

        const mockInsertIntoDynamoDB = insertIntoDynamoDB as jest.MockedFunction<typeof insertIntoDynamoDB>;
        mockInsertIntoDynamoDB.mockResolvedValueOnce('inserted');

        const result = await createBlogController(mockEvent, {} as any);

        expect(mockInsertIntoDynamoDB).toHaveBeenCalledWith({
            TableName: expect.any(String),
            Item: {
                id: expect.any(String),
                title: 'Test Blog',
                author: 'John Doe',
                content: 'This is a test blog.',
                timestamp: expect.any(String),
            },
        });

        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(JSON.stringify({ data: 'inserted', message: 'Blog Created Successfully' }));
    });

    it('should handle invalid request body', async () => {
        const mockEvent: any = {
            // body: 'invalid',
        };

        const result = await createBlogController(mockEvent, {} as any);

        expect(result.statusCode).toBe(500);
        expect(result.body).toBe(JSON.stringify({ error: 'Internal Server Error', data: {} }));
    });

    it('should handle internal server error', async () => {
        const mockEvent: any = {
            body: JSON.stringify({
                author: 'John Doe',
                title: 'Test Blog',
                content: 'This is a test blog.',
            }),
        };

        const mockInsertIntoDynamoDB = insertIntoDynamoDB as jest.MockedFunction<typeof insertIntoDynamoDB>;
        mockInsertIntoDynamoDB.mockRejectedValueOnce('error');

        const result = await createBlogController(mockEvent, {} as any);

        expect(result.statusCode).toBe(500);
        expect(result.body).toBe(JSON.stringify({ error: 'Internal Server Error', data: 'error' }));
    });
});