import type { Request, Response } from "express"
import { ZodError } from "zod"
import { OrderService } from "../services/order-service"
import { createOrderSchema, orderQuerySchema } from "../schemas/order"

const orderService = new OrderService()

export const createOrder = async (req: Request, res: Response) => {
  try {
    const data = createOrderSchema.parse(req.body)
    const userId = req.userId!
    
    const order = await orderService.create(data, userId)
    return res.status(201).json(order)
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: "Dados inválidos", details: error })
    }
    return res.status(500).json({ error: "Erro interno do servidor" })
  }
}

export const listOrders = async (req: Request, res: Response) => {
  try {
    const query = orderQuerySchema.parse(req.query)
    const result = await orderService.list(query)
    return res.status(200).json(result)
  } catch (error: any) {
    return res.status(500).json({ error: "Erro interno do servidor" })
  }
}

export const advanceOrderState = async (req: Request, res: Response) => {
  try {
    const { id } = req.params           
    if (!id) return res.status(400).json({ error: "ID do pedido não fornecido" })
    const order = await orderService.advanceState(id)
    return res.status(200).json(order)
  } catch (error: any) {
    if (error.message === "Pedido não encontrado") {
      return res.status(404).json({ error: error.message })
    }
    if (error.message === "Não é possível avançar o status deste pedido") {
      return res.status(400).json({ error: error.message })
    }
    return res.status(500).json({ error: "Erro interno do servidor" })
  }
}