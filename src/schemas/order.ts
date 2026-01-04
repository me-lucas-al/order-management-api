import { z } from "zod";

export const OrderState = z.enum(["CREATED", "ANALYSIS", "COMPLETED"]);
export const OrderStatus = z.enum(["ACTIVE", "DELETED"]);
export const ServiceStatus = z.enum(["PENDING", "DONE"]);

const serviceSchema = z.object({
  name: z.string().min(1, "Nome do serviço é obrigatório"),
  value: z.number().min(0, "Valor não pode ser negativo"),
  status: ServiceStatus.default("PENDING"),
});

export const createOrderSchema = z
  .object({
    lab: z.string().min(1, "Laboratório é obrigatório"),
    patient: z.string().min(1, "Paciente é obrigatório"),
    customer: z.string().min(1, "Cliente é obrigatório"),
    services: z
      .array(serviceSchema)
      .min(1, "Pelo menos um serviço é obrigatório"),
  })
  .refine(
    (data) => {
      const total = data.services.reduce((acc, curr) => acc + curr.value, 0);
      return total > 0;
    },
    {
      message: "O valor total dos serviços deve ser maior que zero",
      path: ["services"],
    }
  );

export const orderQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 10)),
  state: OrderState.optional(),
});

export type CreateOrderType = z.infer<typeof createOrderSchema>;
export type OrderQueryType = z.infer<typeof orderQuerySchema>;
