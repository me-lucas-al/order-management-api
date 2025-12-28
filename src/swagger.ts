export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Order Management API',
    version: '1.0.0',
    description: 'API para gerenciamento de pedidos',
  },
  paths: {
    '/': {
      get: {
        summary: 'Healthy Check',
        tags: ['Health'],
        responses: {
          200: {
            description: 'API rodando com sucesso',
          },
        },
      },
    },
  },
};