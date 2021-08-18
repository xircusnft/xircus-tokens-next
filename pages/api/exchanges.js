import exchanges from "../../public/exchanges.json";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      res.status(201).json({ status: true, data: exchanges });
    } catch (error) {
      res.status(400).json({ status: false, data: [] });
    }
  }
}
