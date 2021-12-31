import { resolve } from "path";
import fs from "fs/promises";

export let bodies: string[] = [];
export let brains: string[] = [];

async function set(filename: string) {
  const buffer = await fs.readFile(resolve(filename));

  return buffer
    .toString()
    .split("\n")
    .map((item) => (item.split(",").shift() ?? "").toLowerCase());
}

async function main() {
  if (bodies.length === 0) {
    bodies = await set("./src/lib/data/bodies.csv");
  }

  if (brains.length === 0) {
    brains = await set("./src/lib/data/brains.csv");
  }
}

main();
