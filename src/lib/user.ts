const TRIPPE = "229069286931431424";
const TWIXY = "168211845109383179";
const WYZE = "103496050676858880";

export function isOwner(id?: string | null) {
  return id === WYZE;
}

export function isAdmin(id?: string | null) {
  return isOwner(id) || [TRIPPE, TWIXY].includes(id ?? '');
}
