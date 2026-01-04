import { Router } from "express"
import { createOrder, listOrders, advanceOrderState } from "../controllers/order-controller"
import { authMiddleware } from "../middleware/auth-middleware"

const router: Router = Router()

router.use(authMiddleware)

router.post("/", createOrder)
router.get("/", listOrders)
router.patch("/:id/advance", advanceOrderState)

export default router