import { connectToDatabase } from "../../util/mongodb";
import validateToken from "../../util/validateToken";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { chain, lp, token, stable, route } = req.body;
      if (!chain || String(chain).length <= 0) throw new Error("Invalid EVM Chain Network ID");

      if (!validateToken(lp) || !validateToken(token) || !validateToken(stable) || !validateToken(route)) {
        throw new Error("One of the provided token address is invalid.");
      }

      const { db } = await connectToDatabase();

      const tokens = db.collection("tokens");

      await tokens.insertOne(req.body);

      res.status(201).json({ status: true, message: "Successfully saved.", data: req.body });
    } catch (error) {
      console.error(error);
      res.status(400).json({ status: false, message: error.message, data: req.body });
    }
  } else {
    res.status(200).json({ post: "no" });
  }
}
