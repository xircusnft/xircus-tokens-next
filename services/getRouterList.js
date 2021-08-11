export default async function getRouterList({ chainId }) {
  let result = await fetch(`${process.env.ROUTER_EXCHANGE}?chainId=${chainId}`, {
    method: "GET",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText ?? "Adding tokens failed.");
      }
      return res.json();
    })
    .then((data) => data.exchanges)
    .catch((err) => []);

  return result;
}
