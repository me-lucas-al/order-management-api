import mongoose, { Schema, InferSchemaType } from "mongoose"

const serviceSchema = new Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  status: { type: String, enum: ["PENDING", "DONE"], default: "PENDING" }
}, { _id: false })

const orderSchema = new Schema({
  lab: { type: String, required: true },
  patient: { type: String, required: true },
  customer: { type: String, required: true },
  state: { 
    type: String, 
    enum: ["CREATED", "ANALYSIS", "COMPLETED"], 
    default: "CREATED" 
  },
  status: { 
    type: String, 
    enum: ["ACTIVE", "DELETED"], 
    default: "ACTIVE" 
  },
  services: { 
    type: [serviceSchema], 
    required: true,
    validate: [(val: any[]) => val.length > 0, 'Pelo menos um serviço é obrigatório']
  },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true }
}, {
  timestamps: true
})

export type OrderDataType = InferSchemaType<typeof orderSchema>
const Order = mongoose.model<OrderDataType>("Order", orderSchema)
export default Order