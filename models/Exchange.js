import mongoose from "mongoose";

const ExchangeSchema = new mongoose.Schema({
  chainId: { type: Number, required: true },
  name: { type: String, required: true },
  factory: { type: String, required: true },
  router: { type: String, required: true },
});

export default mongoose.models.Exchange || mongoose.model("Exchange", ExchangeSchema);
