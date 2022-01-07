import * as carAbi from "../abis/car.js";
import * as gymAbi from "../abis/gym.js";
import * as landAbi from "../abis/land.js";
import * as rocketAbi from "../abis/rocket.js";
import * as schoolAbi from "../abis/school.js";
import * as smolbodyAbi from "../abis/smolbody.js";
import * as smolbrainAbi from "../abis/smolbrain.js";
import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider(
  "https://arb-mainnet.g.alchemy.com/v2/qXwQz6EVkEtSt0DC0HPLC0OX7TmmoKn5"
);

export const cars = new ethers.Contract(
  "0xB16966daD2B5a5282b99846B23dcDF8C47b6132C",
  carAbi.abi,
  provider
);

export const gym = new ethers.Contract(
  "0x66299ecC614b7A1920922bBa7527819c841174BD",
  gymAbi.abi,
  provider
);

export const land = new ethers.Contract(
  "0xd666d1CC3102cd03e07794A61E5F4333B4239F53",
  landAbi.abi,
  provider
);

export const rocket = new ethers.Contract(
  "0x8957A18a77451d762dE204b61EA4F858Bb3bED4d",
  rocketAbi.abi,
  provider
);

export const school = new ethers.Contract(
  "0x602e50ed10a90d324b35930ec0f8e5d3b28cd509",
  schoolAbi.abi,
  provider
);

export const smolbodies = new ethers.Contract(
  "0x17DaCAD7975960833f374622fad08b90Ed67D1B5",
  smolbodyAbi.abi,
  provider
);

export const smolbrains = new ethers.Contract(
  "0x6325439389e0797ab35752b4f43a14c004f22a9c",
  smolbrainAbi.abi,
  provider
);
