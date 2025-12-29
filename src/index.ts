import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger';

const app = express();
const port = 3000;

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose.connect(process.env.MONGO_URI || '').then(()=> {
  console.log('Conectado ao MongoDB com sucesso');
}).catch((error) => {
  console.error('Erro ao conectar ao MongoDB:', error);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
  console.log(`Swagger UI disponível em http://localhost:${port}/docs`);
});