export type DomeinId =
  | "gezien"
  | "veilig"
  | "vrijheid"
  | "betrouwbaar"
  | "eerlijk"
  | "nabij";

export type ReactionId =
  | "fight"
  | "fix"
  | "please"
  | "freeze"
  | "explain"
  | "withdraw";

export type NeedId =
  | "erkenning"
  | "veiligheid"
  | "ruimte"
  | "zekerheid"
  | "waarheid"
  | "nabijheid";

export type ProtectionId =
  | "hard-worden"
  | "oplossen"
  | "aanpassen"
  | "stilvallen"
  | "uitleggen"
  | "afstand";

export const domains: Record<
  DomeinId,
  { emoji: string; title: string; central: string; description: string }
> = {
  gezien: {
    emoji: "👀",
    title: "Zie je mij?",
    central: "Word ik gezien in wat ik draag, voel of bedoel?",
    description: "Rond aandacht, waardering, erkenning en onzichtbaar voelen.",
  },
  veilig: {
    emoji: "🛡️",
    title: "Ben ik veilig?",
    central: "Kan ik eerlijk zijn zonder dat verbinding breekt?",
    description: "Rond conflict, schaamte, kritiek, kwetsbaarheid en toon.",
  },
  vrijheid: {
    emoji: "🗝️",
    title: "Heb ik ruimte?",
    central: "Mag ik mezelf blijven zonder afstand te creëren?",
    description: "Rond autonomie, tempo, druk, claimen en eigenheid.",
  },
  betrouwbaar: {
    emoji: "🪢",
    title: "Kan ik op je rekenen?",
    central: "Blijf je staan als het niet vanzelf gaat?",
    description: "Rond afspraken, trouw, verantwoordelijkheid en teleurstelling.",
  },
  eerlijk: {
    emoji: "🕯️",
    title: "Klopt het tussen ons?",
    central: "Is wat we zeggen ook wat er echt speelt?",
    description: "Rond eerlijkheid, verborgen irritatie, maskers en waarheid.",
  },
  nabij: {
    emoji: "🤲",
    title: "Kom je dichtbij?",
    central: "Durven we contact te houden als het gevoelig wordt?",
    description: "Rond toenadering, afstand, troost, lichamelijke/emotionele nabijheid.",
  },
};

export const cases = [
  {
    id: "not-noticed",
    domain: "gezien",
    title: "De stille teleurstelling",
    story:
      "Je hebt veel gedaan, maar je partner merkt het nauwelijks op. Van buiten is het klein. Van binnen voelt het alsof jouw inzet vanzelfsprekend is.",
  },
  {
    id: "wrong-tone",
    domain: "veilig",
    title: "De toon raakt harder dan de inhoud",
    story:
      "Jullie bespreken iets praktisch. Eén zin komt scherper binnen dan bedoeld. Ineens gaat het niet meer over het onderwerp, maar over veiligheid.",
  },
  {
    id: "too-much-pressure",
    domain: "vrijheid",
    title: "Te veel druk op één moment",
    story:
      "Je partner wil nu duidelijkheid. Jij voelt dat je juist ruimte nodig hebt om eerlijk te kunnen kiezen.",
  },
  {
    id: "again-forgotten",
    domain: "betrouwbaar",
    title: "Weer vergeten",
    story:
      "Een afspraak die voor jou belangrijk was, is opnieuw vergeten. Je merkt dat je reactie groter is dan deze ene keer.",
  },
  {
    id: "everything-fine",
    domain: "eerlijk",
    title: "Alles is goed",
    story:
      "Je zegt dat er niets is, maar eigenlijk is er wel iets. Je weet alleen niet of het veilig, verstandig of eerlijk is om het nu te openen.",
  },
  {
    id: "comfort-missed",
    domain: "nabij",
    title: "Troost die niet landt",
    story:
      "Je zoekt nabijheid, maar wat je partner geeft voelt net verkeerd: oplossen waar jij troost zoekt, stilte waar jij woorden zoekt, woorden waar jij rust zoekt.",
  },
] as const;

export const reactions: Record<ReactionId, { label: string; text: string }> = {
  fight: { label: "Aanvallen", text: "Ik word fel, scherp of verwijtend." },
  fix: { label: "Oplossen", text: "Ik wil het direct regelen of repareren." },
  please: { label: "Aanpassen", text: "Ik slik mijn behoefte in om gedoe te voorkomen." },
  freeze: { label: "Bevriezen", text: "Ik val stil en weet even niet meer wat ik voel." },
  explain: { label: "Uitleggen", text: "Ik ga redeneren, verdedigen of alles precies uitleggen." },
  withdraw: { label: "Terugtrekken", text: "Ik neem afstand, letterlijk of vanbinnen." },
};

export const needs: Record<NeedId, { label: string; text: string }> = {
  erkenning: { label: "Erkenning", text: "Zie wat dit voor mij betekent." },
  veiligheid: { label: "Veiligheid", text: "Blijf zacht genoeg zodat ik eerlijk durf zijn." },
  ruimte: { label: "Ruimte", text: "Geef me tijd en druk me niet klem." },
  zekerheid: { label: "Zekerheid", text: "Laat me weten dat ik op je kan rekenen." },
  waarheid: { label: "Waarheid", text: "Laten we zeggen wat er echt speelt." },
  nabijheid: { label: "Nabijheid", text: "Kom bij me, ook als het onhandig is." },
};

export const protections: Record<
  ProtectionId,
  { label: string; text: string; softener: string }
> = {
  "hard-worden": {
    label: "Hard worden",
    text: "Ik maak mezelf groter of scherper zodat ik niet machteloos voel.",
    softener: "Ik word nu fel, maar eigenlijk wil ik serieus genomen worden.",
  },
  oplossen: {
    label: "Oplossen",
    text: "Ik ga fixen zodat ik de kwetsbaarheid niet hoef te voelen.",
    softener: "Ik wil dit oplossen, maar misschien moet ik eerst luisteren.",
  },
  aanpassen: {
    label: "Aanpassen",
    text: "Ik beweeg mee en raak intussen iets van mezelf kwijt.",
    softener: "Ik zeg snel dat het goed is, maar ik moet nog even voelen of dat klopt.",
  },
  stilvallen: {
    label: "Stilvallen",
    text: "Ik vertraag zo sterk dat de ander mij niet meer kan bereiken.",
    softener: "Ik val stil, maar ik ben niet weg. Geef me even tijd.",
  },
  uitleggen: {
    label: "Uitleggen",
    text: "Ik bescherm mezelf met logica, argumenten en nuance.",
    softener: "Ik ga nu uitleggen, maar daaronder zit spanning.",
  },
  afstand: {
    label: "Afstand nemen",
    text: "Ik ga uit contact om mezelf veilig te houden.",
    softener: "Ik heb afstand nodig, maar ik wil hier wel op terugkomen.",
  },
};

export const repairStarts = [
  "Toen dit gebeurde, voelde ik meer dan ik liet merken.",
  "Mijn eerste reactie beschermde iets in mij.",
  "Wat ik eigenlijk nodig had, was...",
  "Als ik dit zachter had kunnen zeggen, had ik gezegd...",
  "Wil je me helpen door de volgende keer...",
];

export const christianPrompts = [
  "Waar vraagt deze oude knop om waarheid spreken in liefde?",
  "Waar mag bescherming zachter worden zonder je waardigheid kwijt te raken?",
  "Welke vorm van vergeving of bekering is hier klein maar echt?",
];
