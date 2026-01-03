import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest"
import request from "supertest"
import mongoose from "mongoose"
import { MongoMemoryServer } from "mongodb-memory-server"
import { app } from "../app"

process.env.JWT_SECRET = "test-secret"
process.env.PORT = "3000"

describe("Auth Integration", () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
      instance: {
        launchTimeout: 300000
      }
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
  })

  describe("POST /auth/register", () => {
    it("registers user successfully", async () => {
      const response = await request(app).post("/auth/register").send({
        email: "test@example.com",
        password: "Password123!"
      })

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty("token")
      expect(response.body.user.email).toBe("test@example.com")
    })

    it("fails with weak password", async () => {
      const response = await request(app).post("/auth/register").send({
        email: "test@example.com",
        password: "123"
      })

      expect(response.status).toBe(400)
    })

    it("fails with duplicated email", async () => {
      await request(app).post("/auth/register").send({
        email: "test@example.com",
        password: "Password123!"
      })

      const response = await request(app).post("/auth/register").send({
        email: "test@example.com",
        password: "Password123!"
      })

      expect(response.status).toBe(409)
    })
  })

  describe("POST /auth/login", () => {
    it("logs in successfully", async () => {
      await request(app).post("/auth/register").send({
        email: "test@example.com",
        password: "Password123!"
      })

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "Password123!"
      })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("token")
    })

    it("fails with wrong password", async () => {
      await request(app).post("/auth/register").send({
        email: "test@example.com",
        password: "Password123!"
      })

      const response = await request(app).post("/auth/login").send({
        email: "test@example.com",
        password: "WrongPassword!"
      })

      expect(response.status).toBe(401)
    })

    it("fails with non existing user", async () => {
      const response = await request(app).post("/auth/login").send({
        email: "notfound@example.com",
        password: "Password123!"
      })

      expect(response.status).toBe(401)
    })
  })
})