import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'EMS API',
    description: 'Description'
  },
  host: 'localhost:3000',
   basePath: '/api',
    securityDefinitions: {
        bearerAuth: {
          type: 'apiKey',
          name: 'Authorization',
          scheme: 'bearer',
          in: 'header',
          description: 'Enter your Bearer token in the format "Bearer {token}"',
        }
      },
    security: [{ bearerAuth: [] }], // Apply globally
};

const outputFile = './swagger-output.json';
const routes = ['./routes/employeeRoutes.js'];

swaggerAutogen()(outputFile, routes, doc);