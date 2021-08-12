import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  chainId: { type: Number, default: 56 },
  pair: { type: String, required: [true, "Please provide Liquidity Pair Token Address"] },
  token: { type: String },
  stable: { type: String },
  router: { type: String },
});

export default mongoose.models.Token || mongoose.model("Token", TokenSchema);
