import Order from "../database/models/order";
import type { CreateOrderType, OrderQueryType } from "../schemas/order";

export class OrderService {
  async create(data: CreateOrderType, userId: string) {
    const order = await Order.create({
      ...data,
      user: userId,
      state: "CREATED",
      status: "ACTIVE",
    });
    return order;
  }

  async list(query: OrderQueryType) {
    const { page, limit, state } = query;
    const skip = (page - 1) * limit;
    const filter: any = { status: "ACTIVE" };

    if (state) {
      filter.state = state;
    }

    const [orders, total] = await Promise.all([
      Order.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Order.countDocuments(filter),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async advanceState(id: string) {
    const order = await Order.findById(id);

    if (!order) {
      throw new Error("Pedido não encontrado");
    }

    const transitions: Record<string, string> = {
      CREATED: "ANALYSIS",
      ANALYSIS: "COMPLETED",
    };

    const nextState = transitions[order.state];

    if (!nextState) {
      throw new Error("Não é possível avançar o status deste pedido");
    }

    order.state = nextState as "ANALYSIS" | "COMPLETED";
    await order.save();

    return order;
  }
}
