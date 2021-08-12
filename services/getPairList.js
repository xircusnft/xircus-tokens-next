// Same functionality with /api/pairs/[chainId].js
// Having issue on passing the list of records.
// vercel discuttion: https://github.com/vercel/next.js/discussions/27555

import dbConnect from "../util/dbConnect";
import Token from "../models/Token";

export default async function getPairList(_chainId) {
  await dbConnect();

  try {
    const list = await Token.find({ chainId: _chainId }).lean();

    // Getting error when passing the list directly (consumed by /pages/chains/[chainId])
    // https://github.com/vercel/next.js/issues/11993
    return JSON.parse(JSON.stringify(list));
  } catch (error) {
    return [];
  }
}
