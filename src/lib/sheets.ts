import { GoogleSpreadsheet } from "google-spreadsheet";
import { proxy, snapshot } from "valtio/vanilla";

type State = {
  bodies: string[];
  brains: string[];
  timestamp: number;
  toadstoolz: string[];
};

const state = proxy<State>({
  bodies: [],
  brains: [],
  timestamp: 0,
  toadstoolz: [],
});

const fetchers = [
  async function enjoyor() {
    console.log("Fetching Enjoyor whitelist addresses.");

    const sheet = await getSheet(process.env.GSHEET_ENJOYOR);

    if (!sheet) {
      throw new Error("Unable to load Enjoyor Google sheet.");
    }

    for (let index = 0; index < 15_000; index++) {
      // Both wallet address columns are null, we are at the end of the list
      if (!sheet.getCell(index, 0).value && !sheet.getCell(index, 2).value) {
        break;
      }

      const bodies = sheet.getCell(index, 0).value;
      const brains = sheet.getCell(index, 2).value;

      if (typeof bodies === "string") {
        state.bodies.push(bodies.trim().toLowerCase());
      }

      if (typeof brains === "string") {
        state.brains.push(brains.trim().toLowerCase());
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

export function enjoyor(wallet: string) {
  const { bodies, brains } = snapshot(state);

  return [bodies, brains].reduce(
    (acc, wallets) =>
      wallets.some((item) => item.endsWith(wallet)) ? acc + 1 : acc,
    0
  );
}

export function toadstoolz() {
  return snapshot(state).toadstoolz;
}

async function getSheet(id?: string) {
  const doc = new GoogleSpreadsheet(id);

  try {
    await doc.useServiceAccountAuth({
      client_email: `${process.env.GSHEET_EMAIL}`,
      private_key: `${process.env.GSHEET_KEY}`.replace(/\\n/gm, "\n"),
    });

    await doc.loadInfo();

    const [sheet] = doc.sheetsByIndex;

    await sheet.loadCells();

    return sheet;
  } catch (error) {
    console.log("Sheets: Error retrieving sheet.", id);
  }
}

async function fetch() {
  try {
    await Promise.all(fetchers.map((fetcher) => fetcher()));
  } catch (error) {
    console.log("Sheets: Error fetching sheet information.", error);
  }
}

// Refresh every 15 minutes
if (snapshot(state).timestamp === 0) {
  fetch();
  setInterval(fetch, 1000 * 60 * 15);
}
