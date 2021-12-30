const CHEESE = "353057125137645568";
const TRAVELERR = "301756705652342785";
const TRIPPE = "229069286931431424";
const TWIXY = "168211845109383179";
const WYZE = "103496050676858880";

const ADMINS = [CHEESE, TRAVELERR, TRIPPE, TWIXY];

export function isOwner(id?: string | null) {
  return id === WYZE;
}

export function isAdmin(id?: string | null) {
  return isOwner(id) || ADMINS.includes(id ?? "");
}
