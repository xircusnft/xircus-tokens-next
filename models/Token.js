import mongoose from 'mongoose'

const TokenSchema = new mongoose.Schema({
  chainId:    { type: Number, default: 56 },
  name:       { type: String, required: true },
  pair:       { type: String, required: true },
  token:      { type: String },
  stable:     { type: String },
  router:     { type: String },
  approved:   { type: Boolean, default: false }
})

export default mongoose.models.Token || mongoose.model("Token", TokenSchema)
