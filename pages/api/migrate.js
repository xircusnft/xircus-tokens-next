import exchanges from "../../public/exchanges.json";
import pairs from "../../public/pairs.json";

import Pair from "../../models/Pair";
import Exchange from "../../models/Exchange";
import dbConnect from "../../util/dbConnect";

export default async function handler(req, res) {
  const { query, method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        if (query.targetFile == "pairs" && pairs) {
          await Pair.deleteMany({});
          await Pair.create(pairs);
          res.status(200).json({ status: true, message: "Pairs successfully updated." });
          return;
        }

        if (query.targetFile == "exchanges" && exchanges) {
          await Exchange.deleteMany({});
          await Exchange.create(exchanges);
          res.status(200).json({ status: true, message: "Exchanges successfully updated." });
          return;
        }
        res.status(400).json({ status: false, message: "Operation failed." });
      } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, message: "Operation failed.", error });
      }
      break;

    default:
      res.status(400).json({ status: false });
      break;
  }
}
