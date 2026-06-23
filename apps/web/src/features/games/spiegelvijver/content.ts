export const opennessOptions = [
  {
    id: "observe-first",
    label: "Ik kijk eerst goed rond voordat ik iets van mezelf laat zien.",
  },
  { id: "open-not-deep", label: "Ik ben open, maar niet meteen diep." },
  {
    id: "easy-but-guarded",
    label: "Ik maak makkelijk contact, maar laat niet alles zien.",
  },
] as const;

export const readingOptions = [
  { id: "feels-more", label: "Ik denk dat je meer voelt dan je laat merken." },
  {
    id: "safer-than-says",
    label: "Ik denk dat je sneller veilig bent dan je zegt.",
  },
  {
    id: "more-careful",
    label: "Ik denk dat je voorzichtiger bent dan je lijkt.",
  },
] as const;

export const recognitionOptions = [
  { id: "yes", label: "Ja, dat herken ik wel." },
  { id: "partly", label: "Deels — het klopt en het klopt ook niet." },
  { id: "no", label: "Nee, zo voel ik het zelf niet." },
] as const;

// Laag 1 — Wat mensen snel aan mij zien
export const surfaceOptions = [
  "rustig",
  "vrolijk",
  "sterk",
  "direct",
  "zorgzaam",
  "slim",
  "grappig",
] as const;

// Laag 2 — Wat mensen pas later ontdekken
export const deeperOptions = [
  "onzekerheid",
  "trouw",
  "angst om lastig te zijn",
  "behoefte aan bevestiging",
  "diepe overtuiging",
  "gevoeligheid",
] as const;

// Laag 3 — Wat ik zelf soms nog niet goed begrijp
export const hiddenOptions = [
  "waarom ik afstand neem",
  "waarom ik controle wil",
  "waarom ik stil word",
  "waarom ik snel help",
  "waarom ik me bewijs",
] as const;

export const originPrompts = [
  "Waar komt dat vandaan, denk je?",
  "Is dat altijd zo geweest?",
] as const;

export const christianPrompts = [
  "Wie zegt God dat jij bent — los van wat mensen snel aan je zien?",
  "Wat van wat er onder je oppervlak ligt, durf je vandaag bij God neer te leggen?",
  "Hoe verandert het je zelfbeeld als je gelooft dat je dóór en dóór gekend en toch geliefd bent?",
] as const;

export const conversationQuestions = [
  "Welk beeld van jezelf draag je al lang met je mee?",
  "Waarin denk je dat mensen jou vaak verkeerd lezen?",
  "Wat laat je makkelijk zien, maar zegt eigenlijk weinig over wie je bent?",
  "Welke kant van jezelf bescherm je het meest?",
  "Wanneer voel jij je het meest jezelf?",
  "Welke eigenschap van jou is ontstaan omdat je iets moest overleven of dragen?",
  "Wat hoop je dat iemand ooit goed aan jou begrijpt?",
  "Waar ben je bang voor dat iemand ziet als hij dichterbij komt?",
  "Wat vind je mooi aan jezelf, maar vertrouw je nog niet helemaal?",
  "Welke versie van jezelf kennen de meeste mensen, en welke versie bijna niemand?",
] as const;
