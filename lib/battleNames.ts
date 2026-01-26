const ADJECTIVES = [
  "Molting",
  "Brooding",
  "Plucked",
  "Flightless",
  "Migratory",
  "Territorial",
  "Peckish",
  "Hollow",
  "Grounded",
  "Soaring"
];

const NOUNS = [
  "Skirmish",
  "Siege",
  "Sortie",
  "Standoff",
  "Offensive",
  "Ambush",
  "Retreat",
  "Stalemate",
  "Incursion",
  "Blitz"
];

export function generateBattleName(battleId: string): string {
  const numericId = parseInt(battleId.substring(0, 4), 16);
  
  const adj = ADJECTIVES[numericId % 10];
  const noun = NOUNS[Math.floor(numericId / 10) % 10];
  const suffix = Math.floor(numericId / 100);
  
  return `${adj}-${noun}-${suffix}`;
}
