import mongoose from "mongoose";

const PairSchema = new mongoose.Schema({
  chainId: { type: Number, required: true },
  name: { type: String },
  address: { type: String },
  token: { type: String },
  router: { type: String },
  usd: { type: String },
});

export default mongoose.models.Pair || mongoose.model("Pair", PairSchema);
