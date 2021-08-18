import Token from "../../models/Token";
import dbConnect from "../../util/dbConnect";

export default async function handler(req, res) {
  const { query, method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const createdToken = await Token.create(req.body);
        res.status(201).json({ status: true, message: "Token successfully added.", data: createdToken });
      } catch (error) {
        res.status(400).json({ status: false, message: "Failed adding token.", errmsg: error.message });
      }
      break;

    case "GET":
      try {
        const _query = query?.chainId ? { chainId: query.chainId } : {};
        const list = await Token.find(_query);
        res.status(201).json({ status: true, data: list });
      } catch (error) {
        res.status(400).json({ status: false, data: [] });
      }
      break;

    default:
      res.status(400).json({ status: false });
      break;
  }
}
