export const CHEESE = "353057125137645568";
export const ORANJE = "244047280947200001";
export const TRAVELERR = "301756705652342785";
export const TRIPPE = "229069286931431424";
export const TWIXY = "168211845109383179";
export const WYZE = "103496050676858880";

const ADMINS = [CHEESE, TRAVELERR, TRIPPE, TWIXY];

export function isOwner(id?: string | null) {
  return id === WYZE;
}

export function isAdmin(id?: string | null) {
  return isOwner(id) || ADMINS.includes(id ?? "");
}
