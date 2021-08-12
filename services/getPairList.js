import { connectToDatabase } from "../util/mongodb";

export default async function getPairList(_chainId) {
  // if got an error still return empty array, log sa server na lang ung error

  if (!_chainId || (_chainId && String(_chainId).length <= 0)) return [];

  let query = { chain: { $in: [_chainId, Number(_chainId)] } };

  // just in case the chainId is pure string
  if (isNaN(_chainId)) query = { chain: _chainId };

  try {
    const { db } = await connectToDatabase();
    const pairs = await db
      .collection("tokens")
      .find(query, { projection: { _id: 0 } })
      .limit(500)
      .toArray();

    return pairs;
  } catch (error) {
    return [];
  }
}
