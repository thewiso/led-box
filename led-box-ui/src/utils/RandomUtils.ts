export function getRandom(inclusiveMin: number, exclusiveMax: number) {
  return Math.random() * (exclusiveMax - inclusiveMin) + inclusiveMin;
}

export function getRandomInt(inclusiveMin: number, inclusiveMax: number) {
  const min = Math.ceil(inclusiveMin);
  const max = Math.floor(inclusiveMax);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
