import { connectToDatabase } from "../../util/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { db } = await connectToDatabase();

      const tokens = db.collection("tokens");

      const result = await tokens.insertOne(req.body);

      // console.log(result);

      res.status(201).json({ status: true, message: "Successfully saved.", data: req.body });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, error, data: req.body });
    }
  } else {
    res.status(200).json({ post: "no" });
  }
}
