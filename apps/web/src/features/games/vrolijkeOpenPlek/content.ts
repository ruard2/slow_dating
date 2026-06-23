export const christianPrompts = [
  "Waar zie je Gods goedheid in de dingen die jullie samen lucht en plezier geven?",
  "Hoe houden jullie speelsheid en rust vast, ook als het leven druk of zwaar wordt?",
  "Waarvoor wil je samen dankbaar zijn na dit spel?",
] as const;

export const missions = [
  {
    id: "video",
    title: "Deel de lach",
    icon: "▶",
    summary: "Kies zelf een grappig YouTube-filmpje en ontdek wat jullie humor losmaakt.",
    traits: ["samen delen", "humor", "ontspanning"],
  },
  {
    id: "tictactoe",
    title: "Drie-op-een-rij",
    icon: "×○",
    summary: "Een klein tactisch duel waarin winnen vooral materiaal voor een glimlach is.",
    traits: ["tactiek", "competitie", "speelsheid"],
  },
  {
    id: "bluff",
    title: "Blufvuur",
    icon: "?",
    summary: "Vertel iets onverwachts. Kan je partner zien wanneer jij een verhaal kleur geeft?",
    traits: ["verhaal", "nieuwsgierigheid", "verrassing"],
  },
  {
    id: "duel",
    title: "Geluksduel",
    icon: "✦",
    summary: "Kies tegelijk steen, papier of schaar. Kort, onvoorspelbaar en zonder prestige.",
    traits: ["spontaniteit", "risico", "energie"],
  },
  {
    id: "setback",
    title: "Mens erger je zacht",
    icon: "↻",
    summary: "Speel met kleine tegenslag en ontdek wat jou helpt om weer licht te worden.",
    traits: ["veerkracht", "zelfkennis", "steun"],
  },
] as const;

export const bluffPrompts = [
  "Iets onhandigs dat mij ooit op een eerste indruk overkwam",
  "Een vreemde gewoonte die bijna niemand van mij kent",
  "Een moment waarop ik onverwacht heel dapper was",
  "Een kleine regel die ik stiekem graag breek",
] as const;

export const setbackOptions = [
  { id: "laugh", label: "Er samen om lachen", trait: "humor" },
  { id: "retry", label: "Direct nog een keer", trait: "doorzetten" },
  { id: "pause", label: "Even afstand en adem", trait: "herstellen" },
  { id: "comfort", label: "Eerst een beetje steun", trait: "verbinding" },
] as const;

export const reliefOptions = [
  { id: "absurdity", label: "Het onverwachte en absurde" },
  { id: "challenge", label: "De kleine uitdaging" },
  { id: "together", label: "Samen ergens in opgaan" },
  { id: "seen", label: "Mij gezien en begrepen voelen" },
] as const;

export const pressureOptions = [
  { id: "laugh", label: "Ik maak het lichter met humor" },
  { id: "focus", label: "Ik word juist fanatiek en geconcentreerd" },
  { id: "tease", label: "Ik daag de ander speels uit" },
  { id: "withdraw", label: "Ik trek me een beetje terug" },
] as const;

export const supportOptions = [
  { id: "join", label: "Doe enthousiast met me mee" },
  { id: "space", label: "Geef me even ruimte" },
  { id: "cheer", label: "Moedig me luchtig aan" },
  { id: "soften", label: "Maak het kleiner en zachter" },
] as const;

const sharedSupportOptions = supportOptions.map(({ id, label }) => ({ id, label }));

export const reflectionOptionsByMission = {
  video: {
    relief: [
      { id: "absurdity", label: "De onverwachte of absurde humor" },
      { id: "challenge", label: "Samen iets nieuws ontdekken" },
      { id: "together", label: "Samen naar hetzelfde kijken" },
      { id: "seen", label: "Elkaars gevoel voor humor beter kennen" },
    ],
    pressure: [
      { id: "laugh", label: "Ik lach gemakkelijk mee" },
      { id: "focus", label: "Ik let vooral op wat ik echt grappig vind" },
      { id: "tease", label: "Ik plaag de ander met onze verschillen" },
      { id: "withdraw", label: "Ik houd mijn reactie eerder voor mezelf" },
    ],
    support: sharedSupportOptions,
  },
  tictactoe: {
    relief: [
      { id: "absurdity", label: "De kleine missers en verrassingen" },
      { id: "challenge", label: "De korte tactische uitdaging" },
      { id: "together", label: "Samen helemaal in het spel zitten" },
      { id: "seen", label: "Merken hoe mijn partner op mij reageert" },
    ],
    pressure: pressureOptions.map(({ id, label }) => ({ id, label })),
    support: sharedSupportOptions,
  },
  bluff: {
    relief: [
      { id: "absurdity", label: "De onverwachte verhalen" },
      { id: "challenge", label: "Proberen de waarheid te ontdekken" },
      { id: "together", label: "Samen in het verhaal meegaan" },
      { id: "seen", label: "Iets nieuws van elkaar leren kennen" },
    ],
    pressure: [
      { id: "laugh", label: "Ik maak mijn verhaal grappiger" },
      { id: "focus", label: "Ik let scherp op kleine signalen" },
      { id: "tease", label: "Ik probeer de ander speels te misleiden" },
      { id: "withdraw", label: "Ik vind het spannend om iets te vertellen" },
    ],
    support: sharedSupportOptions,
  },
  duel: {
    relief: [
      { id: "absurdity", label: "De willekeur en verrassing" },
      { id: "challenge", label: "Het korte duel" },
      { id: "together", label: "Samen direct in actie komen" },
      { id: "seen", label: "Elkaars spontane reactie zien" },
    ],
    pressure: pressureOptions.map(({ id, label }) => ({ id, label })),
    support: sharedSupportOptions,
  },
  setback: {
    relief: [
      { id: "absurdity", label: "De tegenslag kleiner kunnen maken" },
      { id: "challenge", label: "Weer een nieuwe poging zien" },
      { id: "together", label: "De tegenvaller samen opvangen" },
      { id: "seen", label: "Mijn reactie serieus genomen voelen" },
    ],
    pressure: [
      { id: "laugh", label: "Ik probeer er snel om te lachen" },
      { id: "focus", label: "Ik wil het direct opnieuw proberen" },
      { id: "tease", label: "Ik maak er samen iets speels van" },
      { id: "withdraw", label: "Ik heb eerst even afstand nodig" },
    ],
    support: sharedSupportOptions,
  },
} satisfies Record<
  MissionId,
  {
    relief: ReadonlyArray<{ id: string; label: string }>;
    pressure: ReadonlyArray<{ id: string; label: string }>;
    support: ReadonlyArray<{ id: string; label: string }>;
  }
>;

export const conversationQuestions = [
  "Wanneer helpt humor jou echt, en wanneer gebruik je humor om iets niet te voelen?",
  "Wat zag je vandaag bij mij dat je nog niet zo duidelijk kende?",
  "Hoe merk jij dat spanning uit je lijf begint te zakken?",
  "Welke vorm van spelen zouden we vaker samen mogen toelaten?",
  "Wat kan ik doen wanneer jij lichtheid nodig hebt, zonder je gevoel weg te lachen?",
] as const;

export type MissionId = (typeof missions)[number]["id"];

export function isYouTubeUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      ["youtube.com", "www.youtube.com", "youtu.be"].includes(url.hostname)
    );
  } catch {
    return false;
  }
}
