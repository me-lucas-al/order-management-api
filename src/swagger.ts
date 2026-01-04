export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Order Management API',
    version: '1.0.0',
    description: 'API para gerenciamento de pedidos e autenticação',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      AuthInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'teste@email.com' },
          password: { type: 'string', format: 'password', example: '123456' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              email: { type: 'string' },
            },
          },
          token: { type: 'string' },
        },
      },
      OrderInput: {
        type: 'object',
        required: ['lab', 'patient', 'customer', 'services'],
        properties: {
          lab: { type: 'string', example: 'Laboratório X' },
          patient: { type: 'string', example: 'João da Silva' },
          customer: { type: 'string', example: 'Clínica Y' },
          services: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Hemograma' },
                value: { type: 'number', example: 50.00 }
              }
            }
          }
        }
      },
      OrderResponse: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          state: { type: 'string', enum: ['CREATED', 'ANALYSIS', 'COMPLETED'] },
          status: { type: 'string', enum: ['ACTIVE', 'DELETED'] },
          lab: { type: 'string' },
          services: { type: 'array' }
        }
      }
    },
  },
  tags: [
    { name: 'Health', description: 'Verificação de saúde' },
    { name: 'Auth', description: 'Autenticação' },
    { name: 'Orders', description: 'Gestão de Pedidos' },
  ],
  paths: {
    '/': {
      get: {
        summary: 'Healthy Check',
        tags: ['Health'],
        responses: { 200: { description: 'API rodando' } },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Registrar usuário',
        tags: ['Auth'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthInput' } } } },
        responses: { 201: { description: 'Criado' }, 409: { description: 'Conflito' } },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login',
        tags: ['Auth'],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthInput' } } } },
        responses: { 200: { description: 'Sucesso' }, 401: { description: 'Não autorizado' } },
      },
    },
    '/orders': {
      post: {
        summary: 'Criar pedido',
        tags: ['Orders'],
        security: [{ bearerAuth: [] }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderInput' } } } },
        responses: { 201: { description: 'Criado' }, 400: { description: 'Dados inválidos' } },
      },
      get: {
        summary: 'Listar pedidos',
        tags: ['Orders'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'state', in: 'query', schema: { type: 'string' } }
        ],
        responses: { 200: { description: 'Lista retornada' } },
      }
    },
    '/orders/{id}/advance': {
      patch: {
        summary: 'Avançar status do pedido',
        tags: ['Orders'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Avançado' }, 400: { description: 'Transição inválida' } },
      }
    }
  },
};