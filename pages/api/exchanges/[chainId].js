import Exchange from "../../../models/Exchange";
import dbConnect from "../../../util/dbConnect";

export default async function handler(req, res) {
  const { query, method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const list = await Exchange.find({ chainId: query.chainId }).sort({ name: -1 });
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
