import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger';

const app = express();
const port = 3000;

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Swagger UI disponível em http://localhost:${port}/docs`);
});