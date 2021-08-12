import Token from "../../../models/Token";
import dbConnect from "../../../util/dbConnect";

export default async function handler(req, res) {
  const { query, method } = req;

  await dbConnect();

  if (method === "GET") {
    try {
      const list = await Token.find({ chainId: query.chainId });
      res.status(201).json({ status: true, data: list });
    } catch (error) {
      res.status(400).json({ status: false, data: [] });
    }
  }
}
