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
              createdAt: { type: 'string' },
            },
          },
          token: { type: 'string' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
    },
  },
  tags: [
    { name: 'Health', description: 'Verificação de saúde da API' },
    { name: 'Auth', description: 'Autenticação de usuários' },
  ],
  paths: {
    '/': {
      get: {
        summary: 'Healthy Check',
        tags: ['Health'],
        responses: {
          200: { description: 'API rodando com sucesso' },
        },
      },
    },
    '/auth/register': {
      post: {
        summary: 'Registrar novo usuário',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Usuário criado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          400: {
            description: 'Usuário já existe',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login de usuário',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuthInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Login realizado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
          },
          401: {
            description: 'Credenciais inválidas',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
    },
  },
};