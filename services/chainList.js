// https://chainid.network/chains.json

export default async function chainList() {
  let result = await fetch(`https://chainid.network/chains.json`, {
    method: "GET",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Request Failed.");
      }
      return res.json();
    })
    .then((data) => data)
    .catch((err) => []);

  return result;
}
