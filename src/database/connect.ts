import mongoose from "mongoose"

export const connectDatabase = async () => {
  mongoose.connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("Conectado ao MongoDB com sucesso");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao MongoDB:", error);
  });

}
