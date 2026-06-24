export const hitQuestions = [
  "Wat doe jij meestal als je onder druk staat?",
  "Word jij fanatieker of juist stiller als het spannend wordt?",
  "Wat helpt jou om rustig te blijven?",
  "Hoe merk ik aan jou dat je spanning voelt?",
  "Word jij liever geholpen of met rust gelaten?",
  "Wat vond je net grappig aan mij?",
  "Waarin ben jij een slechte verliezer?",
  "Wat doe jij als je controle kwijtraakt?",
  "Ga jij bij spanning naar voren of juist achteruit?",
  "Wat zou mij helpen als ik gestrest ben?",
  "Wanneer ga jij juist harder je best doen?",
  "Wat maakt spanning voor jou leuk in plaats van bedreigend?",
] as const;

export const christianHitQuestions = [
  "Wat helpt jou om onder druk niet alleen op controle te leunen?",
  "Wanneer bid jij sneller: vóór de spanning of pas erna?",
  "Wat betekent zachtmoedigheid voor jou als je fanatiek wordt?",
  "Hoe kan ik jou helpen zonder je klein te maken?",
] as const;

export const powerUps = [
  {
    id: "speed",
    icon: "🪶",
    label: "Windveer",
    description: "Je zwever beweegt vijf seconden sneller.",
  },
  {
    id: "shield",
    icon: "🛡️",
    label: "Hart-schild",
    description: "Blokkeert één zachte treffer.",
  },
  {
    id: "slow",
    icon: "⌛",
    label: "Zandloper",
    description: "De ander vliegt drie seconden trager.",
  },
] as const;

export const obstacleCatalog = [
  { id: "cloud-bank", icon: "☁️", label: "Wolkenbank" },
  { id: "gear", icon: "⚙️", label: "Draaiend tandwiel" },
  { id: "lantern", icon: "🏮", label: "Lantaarn aan kabel" },
  { id: "wind", icon: "🍃", label: "Windvlaag" },
  { id: "bridge", icon: "🌉", label: "Brugboog" },
] as const;
