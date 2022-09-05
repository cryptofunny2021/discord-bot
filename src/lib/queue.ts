import PQueue from "p-queue";

export const queue = new PQueue({
  concurrency: 1,
  interval: 15_000,
  intervalCap: 1,
});
