export const DEV = "787066160457580566"
export const SMOLBODIES = "903403660908838962"
export const SMOLBRAINS = "897404773622505482"
export const TREASURE = "882867268021800991"

export function isDev(id?: string | null) {
  return id === DEV;
}

export function isSmolBodies(id?: string | null) {
  return id === SMOLBODIES;
}

export function isSmolBrains(id?: string | null) {
  return id === SMOLBRAINS;
}

export function isTreasure(id?: string | null) {
  return id === TREASURE;
}
