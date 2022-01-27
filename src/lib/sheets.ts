import { GoogleSpreadsheet } from "google-spreadsheet";
import { proxy, snapshot } from "valtio/vanilla";
import { utils } from "ethers";

type State = {
  collector: Record<string, [string, string]>;
  enjoyor: Record<string, number>;
  timestamp: number;
  toadstoolz: string[];
};

const state = proxy<State>({
  collector: {},
  enjoyor: {},
  timestamp: 0,
  toadstoolz: [],
});

const fetchers = [
  async function collector() {
    console.log("Fetching Enjoyor whitelist collection.");

    const sheet = await getSheet(process.env.GSHEET_ENJOYOR, 8);

    if (!sheet) {
      throw new Error("Unable to load Enjoyor Google sheet.");
    }

    for (let index = 2; index < 16_000; index++) {
      // No more addresses
      if (!sheet.getCell(index, 1).value) {
        break;
      }

      const wallet = sheet.getCell(index, 1).value;
      const username = sheet.getCell(index, 2).value;
      const id = sheet.getCell(index, 3).value;

      if (
        typeof id === "string" &&
        typeof username === "string" &&
        typeof wallet === "string"
      ) {
        state.collector[id] = [wallet, username];
      }
    }

    console.log("Done fetching Enjoyor whitelist collections.");
  },
  async function enjoyor() {
    console.log("Fetching Enjoyor whitelist addresses.");

    const sheet = await getSheet(process.env.GSHEET_ENJOYOR);

    if (!sheet) {
      throw new Error("Unable to load Enjoyor Google sheet.");
    }

    // Clear existing data
    state.enjoyor = {};

    for (let index = 2; index < 16_000; index++) {
      // No more addresses
      if (!sheet.getCell(index, 1).value) {
        break;
      }

      const wallet = sheet.getCell(index, 0).value;
      const count = sheet.getCell(index, 1).value;

      if (
        typeof wallet === "string" &&
        typeof count === "number" &&
        utils.isAddress(wallet)
      ) {
        state.enjoyor[wallet.toLowerCase()] ??= 0;
        state.enjoyor[wallet.toLowerCase()] += count;
      }
    }

    console.log("Done fetching Enjoyor whitelist addresses.");
  },
  async function toadstoolz() {
    console.log("Fetching Toadstoolz whitelist addresses.");

    const sheet = await getSheet(process.env.GSHEET_TL);

    if (!sheet) {
      throw new Error("Unable to load Toadstoolz Google sheet.");
    }

    // Clear existing data
    state.toadstoolz = [];

    for (let index = 0; index < 15_000; index++) {
      // Index column is null, then we are at the end of the list
      if (!sheet.getCell(index, 2).value) {
        break;
      }

      const value = sheet.getCell(index, 0).value;

      if (typeof value !== "string") {
        continue;
      }

      state.toadstoolz.push(value.trim().toLowerCase());
    }

    console.log("Done fetching Toadstoolz whitelist addresses.");
  },
] as const;

export function add(wallet: string, username: string, id: string) {
  state.collector[id] = [wallet, username];
}

export function enjoyor(needle: string) {
  const { enjoyor } = snapshot(state);
  const wallet =
    Object.keys(enjoyor).find((wallet) => wallet.endsWith(needle)) ?? "";

  return enjoyor[wallet] ?? 0;
}

export function toadstoolz() {
  return snapshot(state).toadstoolz;
}

async function getSheet(id?: string, sheetIndex = 0) {
  const doc = new GoogleSpreadsheet(id);

  try {
    await doc.useServiceAccountAuth({
      client_email: `${process.env.GSHEET_EMAIL}`,
      private_key: `${process.env.GSHEET_KEY}`.replace(/\\n/gm, "\n"),
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[sheetIndex];

    await sheet.loadCells();

    return sheet;
  } catch (error) {
    console.log("Sheets: Error retrieving sheet.", id, error);
  }
}

async function update() {
  console.log("Updating whitelist entries.");

  const sheet = await getSheet(process.env.GSHEET_ENJOYOR, 8);

  if (!sheet) {
    throw new Error("Unable to load Enjoyor Google sheet.");
  }

  const { collector } = snapshot(state);

  Object.entries(collector).forEach(([id, [wallet, username]], index) => {
    sheet.getCell(index + 2, 1).value = wallet;
    sheet.getCell(index + 2, 2).value = username;
    sheet.getCell(index + 2, 3).value = id;
  });

  await sheet.saveUpdatedCells();

  console.log("Success updating whitelist entries.");
}

async function fetch() {
  try {
    await Promise.all(fetchers.map((fetcher) => fetcher()));
  } catch (error) {
    console.log("Sheets: Error fetching sheet information.", error);
  }
}

// Update every 2 minutes
if (snapshot(state).timestamp === 0) {
  setInterval(update, 1000 * 60 * 2);
}

// Refresh every 15 minutes
if (snapshot(state).timestamp === 0) {
  fetch();
  setInterval(fetch, 1000 * 60 * 15);
}
