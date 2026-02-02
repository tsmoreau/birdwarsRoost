const ADJECTIVES = [
  "molting",
  "brooding",
  "plucked",
  "flightless",
  "migratory",
  "territorial",
  "peckish",
  "hollow",
  "grounded",
  "soaring"
];

const NOUNS = [
  "skirmish",
  "siege",
  "sortie",
  "standoff",
  "offensive",
  "ambush",
  "retreat",
  "stalemate",
  "incursion",
  "blitz"
];

export function generateBattleName(battleId: string): string {
  const numericId = parseInt(battleId.substring(0, 4), 16);
  
  const adj = ADJECTIVES[numericId % 10];
  const noun = NOUNS[Math.floor(numericId / 10) % 10];
  const suffix = Math.floor(numericId / 100) % 100;
  
  return `${adj}-${noun}-${suffix}`;
}
