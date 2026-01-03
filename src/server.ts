import "dotenv/config"
import { app } from "./app"
import { connectDatabase } from "./database/connect"

const port = process.env.PORT || 3000

const startServer = async () => {
  await connectDatabase()

  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`)
    console.log(`Swagger UI disponível em http://localhost:${port}/docs`)
  })
}

  startServer()

