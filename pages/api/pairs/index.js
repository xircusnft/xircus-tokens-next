import Pair from "../../../models/Pair";
import dbConnect from "../../../util/dbConnect";

export default async function handler(req, res) {
  const { query, method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const _query = query?.chainId ? { chainId: query.chainId } : {};

        const list = await Pair.find(_query).sort({ chainId: 1, name: 1 });

        res.status(200).json({ status: true, data: list });
      } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, data: [] });
      }
      break;

    default:
      res.status(400).json({ status: false });
      break;
  }
}
