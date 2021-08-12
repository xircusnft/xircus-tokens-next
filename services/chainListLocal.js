// source: // https://chainid.network/chains.json
import fs from "fs/promises";
import path from "path";

export default async function chainListLocal() {
  let chains = [];

  try {
    const data = await fs.readFile(path.join(process.cwd(), "public", "chains.json"));

    chains = JSON.parse(data);
  } catch (error) {
    // console.log(error);
  }

  return chains;
}
