export const DEV = '787066160457580566'
export const ENJOYOR = '905950471913623643'
export const SMOLBODIES = '903403660908838962'
export const SMOLBRAINS = '897404773622505482'
export const TEAM = '925202165256044584'
export const TOADSTOOLZ = '913210230568022046'
export const TREASURE = '882867268021800991'

export function isDev(id?: string | null) {
  return id === DEV
}

export function isEnjoyor(id?: string | null) {
  return id === ENJOYOR
}

export function isSmolBodies(id?: string | null) {
  return id === SMOLBODIES
}

export function isSmolBrains(id?: string | null) {
  return id === SMOLBRAINS
}

export function isTeam(id?: string | null) {
  return id === TEAM
}

export function isToadstoolz(id?: string | null) {
  return id === TOADSTOOLZ
}

export function isTreasure(id?: string | null) {
  return id === TREASURE
}
