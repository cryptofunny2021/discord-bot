export const CHEESE = "353057125137645568";
export const ORANJE = "244047280947200001";
export const RAPP = "690989750127165581";
export const TRAVELERR = "301756705652342785";
export const WYZE = "103496050676858880";

const ADMINS = [CHEESE, TRAVELERR, RAPP];

export function isOwner(id?: string | null) {
  return id === WYZE;
}

export function isAdmin(id?: string | null) {
  return isOwner(id) || ADMINS.includes(id ?? "");
}
