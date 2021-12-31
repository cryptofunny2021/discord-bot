import fs from "fs/promises";

export let bodies: string[] = [];
export let brains: string[] = [];

async function set(filepath: string) {
  const buffer = await fs.readFile(new URL(filepath, import.meta.url));

  return buffer
    .toString()
    .split("\n")
    .map((item) => (item.split(",").shift() ?? "").toLowerCase());
}

async function main() {
  if (bodies.length === 0) {
    bodies = await set("./data/bodies.csv");
  }

  if (brains.length === 0) {
    brains = await set("./data/brains.csv");
  }
}

main();
