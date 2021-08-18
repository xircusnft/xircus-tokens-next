import Exchange from "../../../models/Exchange";
import dbConnect from "../../../util/dbConnect";

// endpoints: /api/exchanges
// returns Array
// append ?chainId=<chain id> to url to specifically search record base on chainId

export default async function handler(req, res) {
  const { query, method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const _query = query?.chainId ? { chainId: query.chainId } : {};

        const list = await Exchange.find(_query).sort({ chainId: -1 });

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
