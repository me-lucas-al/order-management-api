import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from "vitest"

vi.mock("../schemas/env", () => ({
  env: {
    JWT_SECRET: "test-secret",
    PORT: "3000",
    MONGO_URI: "mongodb://mock" 
  }
}))

import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import { app } from "../app"
import User from "../database/models/user"
import { generateToken } from "../utils/jwt"

process.env.JWT_SECRET = "test-secret"

describe("Order Integration", () => {
  let mongoServer: MongoMemoryServer
  let token: string
  let userId: string

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      instance: { launchTimeout: 300000 }
    })
    await mongoose.connect(mongoServer.getUri())
  }, 300000)

  afterAll(async () => {
    await mongoose.disconnect()
    if (mongoServer) {
      await mongoServer.stop()
    }
  })

  beforeEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase()
    }
    
    const user = await User.create({
      email: "tester@example.com",
      password: "hashedpassword"
    })
    userId = user._id.toString()
    
    token = generateToken(userId)
  })

  describe("POST /orders", () => {
    it("should create an order successfully", async () => {
      const response = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({
          lab: "Lab A",
          patient: "John Doe",
          customer: "Clinic X",
          services: [{ name: "Exam 1", value: 100 }]
        })

      expect(response.status).toBe(201)
      expect(response.body.state).toBe("CREATED")
      expect(response.body.status).toBe("ACTIVE")
    })

    it("should fail validation if total value is zero", async () => {
      const response = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({
          lab: "Lab A",
          patient: "John Doe",
          customer: "Clinic X",
          services: [{ name: "Free Exam", value: 0 }]
        })

      expect(response.status).toBe(400)
    })
  })

  describe("PATCH /orders/:id/advance", () => {
    it("should advance state correctly CREATED -> ANALYSIS", async () => {
      const createRes = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({
          lab: "Lab A",
          patient: "John Doe",
          customer: "Clinic X",
          services: [{ name: "Exam 1", value: 100 }]
        })

      const orderId = createRes.body._id

      const response = await request(app)
        .patch(`/orders/${orderId}/advance`)
        .set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(200)
      expect(response.body.state).toBe("ANALYSIS")
    })

    it("should fail to skip states CREATED -> COMPLETED", async () => {
       const createRes = await request(app)
        .post("/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({
          lab: "Lab A",
          patient: "John Doe",
          customer: "Clinic X",
          services: [{ name: "Exam 1", value: 100 }]
        })
      
      const orderId = createRes.body._id
      
      await request(app).patch(`/orders/${orderId}/advance`).set("Authorization", `Bearer ${token}`)
      await request(app).patch(`/orders/${orderId}/advance`).set("Authorization", `Bearer ${token}`)
      
      const response = await request(app)
        .patch(`/orders/${orderId}/advance`)
        .set("Authorization", `Bearer ${token}`)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe("Não é possível avançar o status deste pedido")
    })
  })
})