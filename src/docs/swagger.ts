import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: { title: 'Review Kantin API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000' }],
  definitions: {
    AuditInput: {
      userId: 2,
      action: 'UPDATE',
      targetTable: 'REVIEWS',
      targetId: 7,
      metadata: { field: 'status', value: 'resolved' },
    },
    FlagStatusUpdate: {
      status: 'resolved',
    },
    LikeInput: {
      reviewId: 1,
      userId: 2,
    },
    ReviewInput: {
      stallId: 1,
      userId: 2,
      rating: 5,
      comment: 'Makanannya enak',
    },
    MenuItemInput: {
      type: 'object',
      required: ['stallId', 'name', 'price'],
      properties: {
        stallId: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'Nasi Goreng Spesial' },
        price: { type: 'integer', minimum: 0, example: 18000 },
        isAvailable: { type: 'boolean', example: true },
      },
    },
    MenuItemUpdate: {
      type: 'object',
      properties: {
        stallId: { type: 'integer', example: 1 },
        name: { type: 'string', example: 'Nasi Goreng Spesial' },
        price: { type: 'integer', minimum: 0, example: 18000 },
        isAvailable: { type: 'boolean', example: true },
      },
    },
    UserInput: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: { type: 'string', example: 'Budi Santoso' },
        email: { type: 'string', format: 'email', example: 'budi@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
    StallInput: {
      type: 'object',
      required: ['ownerId', 'name'],
      properties: {
        ownerId: { type: 'integer', example: 2 },
        name: { type: 'string', example: 'Warung Baru' },
        category: { type: 'string', example: 'Nasi' },
        location: { type: 'string', example: 'Kantin FK' },
        description: { type: 'string' },
      },
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
