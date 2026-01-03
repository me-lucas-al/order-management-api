import express, { Express } from "express"
import swaggerUi from "swagger-ui-express"
import { swaggerDocument } from "./swagger"
import authRoutes from "./routes/auth-routes"

export const app: Express = express()

app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).json({ status: "API rodando com sucesso" })
})

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use("/auth", authRoutes)
