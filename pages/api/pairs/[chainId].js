import getPairList from "../../../services/getPairList";

export default async function handler(req, res) {
  const { query } = req;
  let result = { status: true, data: [] };

  result.data = await getPairList(query.chainId);

  res.status(200).json(result);
}
