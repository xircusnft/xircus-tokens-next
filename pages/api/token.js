import Token from "../../models/Token";
import dbConnect from "../../util/dbConnect";

export default async function handler(req, res) {
  await dbConnect();

  switch (req.method) {
    case "POST":
      try {
        const createdToken = await Token.create(req.body);
        res.status(201).json({ status: true, message: "Token successfully added.", data: createdToken });
      } catch (error) {
        res.status(400).json({ status: false, message: "Failed adding token.", errmsg: error.message });
      }
      break;

    default:
      res.status(400).json({ status: false });
      break;
  }
}
