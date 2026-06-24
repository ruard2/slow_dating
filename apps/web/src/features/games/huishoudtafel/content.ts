export const rhythms = [
  { id: "daily", icon: "☀️", label: "Dagelijks" },
  { id: "weekly", icon: "🗓️", label: "Wekelijks" },
  { id: "sometimes", icon: "🌙", label: "Maandelijks / soms" },
] as const;

export const baseHouseTasks = [
  {
    id: "groceries-buy",
    emoji: "🛒",
    label: "Boodschappen doen",
    rhythm: "weekly",
    detail: "Inclusief controleren of “we hebben nog genoeg kaas” echt waar is.",
  },
  {
    id: "groceries-list",
    emoji: "📝",
    label: "Boodschappenlijst maken",
    rhythm: "weekly",
    detail: "De stille motor van de relatie: zien wat ontbreekt voordat iemand misgrijpt.",
  },
  {
    id: "cooking",
    emoji: "🍳",
    label: "Koken",
    rhythm: "daily",
    detail: "Of tenminste iets warm maken met zelfvertrouwen.",
  },
  {
    id: "dishes-loading",
    emoji: "🍽️",
    label: "Afwassen / vaatwasser inruimen",
    rhythm: "daily",
    detail: "Ja, er ís een goede manier. En iemand heeft daar waarschijnlijk gevoelens over.",
  },
  {
    id: "dishwasher-unloading",
    emoji: "🧺",
    label: "Vaatwasser uitruimen",
    rhythm: "daily",
    detail: "De taak die niemand ooit heeft gezien, maar die toch steeds terugkomt.",
  },
  {
    id: "counter-cleaning",
    emoji: "🧽",
    label: "Aanrecht schoonmaken",
    rhythm: "daily",
    detail: "Kruimels zijn geen interieurstijl.",
  },
  {
    id: "fridge-check",
    emoji: "🧊",
    label: "Koelkast checken",
    rhythm: "weekly",
    detail: "Inclusief mysterieuze bakjes identificeren en eerlijk durven ruiken.",
  },
  {
    id: "trash-empty",
    emoji: "🗑️",
    label: "Prullenbak legen",
    rhythm: "weekly",
    detail: "Het moment waarop liefde praktisch wordt.",
  },
  {
    id: "trash-bag",
    emoji: "♻️",
    label: "Nieuwe vuilniszak erin doen",
    rhythm: "weekly",
    detail: "Hoort erbij, mensen. De lege bak is pas half werk.",
  },
  {
    id: "toilet-cleaning",
    emoji: "🚽",
    label: "WC poetsen",
    rhythm: "weekly",
    detail: "Karaktervorming in porseleinen vorm.",
  },
  {
    id: "bathroom-cleaning",
    emoji: "🚿",
    label: "Badkamer schoonmaken",
    rhythm: "weekly",
    detail: "Haren, kalkaanslag en tandpastaspikkels: de drie vijanden.",
  },
  {
    id: "shower-drain",
    emoji: "🕳️",
    label: "Doucheputje schoonmaken",
    rhythm: "sometimes",
    detail: "Voor gevorderden. Niet leuk, wel relationeel indrukwekkend.",
  },
  {
    id: "vacuuming",
    emoji: "🧹",
    label: "Stofzuigen",
    rhythm: "weekly",
    detail: "Vooral onder de bank, waar de waarheid woont.",
  },
  {
    id: "mopping",
    emoji: "🪣",
    label: "Dweilen",
    rhythm: "weekly",
    detail: "Als je sokken blijven plakken, ben je te laat.",
  },
  {
    id: "dusting",
    emoji: "🪶",
    label: "Stoffen",
    rhythm: "sometimes",
    detail: "Ook bovenop kasten, zegt iemand ooit.",
  },
  {
    id: "laundry-collecting",
    emoji: "👕",
    label: "Was verzamelen",
    rhythm: "weekly",
    detail: "Kleding hoort niet zelfstandig door het huis te zwerven.",
  },
  {
    id: "washing-machine",
    emoji: "🫧",
    label: "Wasmachine aanzetten",
    rhythm: "weekly",
    detail: "Wit bij wit, zwart bij zwart, rood bij paniek.",
  },
  {
    id: "laundry-drying",
    emoji: "🧺",
    label: "Was ophangen / droger leeghalen",
    rhythm: "weekly",
    detail: "De was stopt niet vanzelf, hoe hoopvol je ook naar de mand kijkt.",
  },
  {
    id: "laundry-folding",
    emoji: "🧦",
    label: "Was opvouwen",
    rhythm: "weekly",
    detail: "Inclusief sokken die hun partner kwijt zijn.",
  },
  {
    id: "ironing",
    emoji: "👔",
    label: "Strijken",
    rhythm: "sometimes",
    detail: "Voor mensen met hoop en geduld.",
  },
  {
    id: "bedsheets",
    emoji: "🛏️",
    label: "Bed verschonen",
    rhythm: "weekly",
    detail: "Klinkt klein, voelt als een verhuizing.",
  },
  {
    id: "windows",
    emoji: "🪟",
    label: "Ramen zemen",
    rhythm: "sometimes",
    detail: "Zodat je weer ziet hoe vies het buiten is.",
  },
  {
    id: "mirrors",
    emoji: "🪞",
    label: "Spiegels schoonmaken",
    rhythm: "sometimes",
    detail: "Tandpasta-kunst verwijderen voordat het een collectie wordt.",
  },
  {
    id: "plants",
    emoji: "🪴",
    label: "Planten water geven",
    rhythm: "weekly",
    detail: "Voordat ze een preek over verwaarlozing houden.",
  },
  {
    id: "money-admin",
    emoji: "💶",
    label: "Geldzaken betalen/bijhouden",
    rhythm: "sometimes",
    detail: "Rekeningen verdwijnen niet door ze niet te openen.",
  },
  {
    id: "agenda-sync",
    emoji: "🗓️",
    label: "Agenda’s afstemmen",
    rhythm: "weekly",
    detail: "“Had jij dat niet onthouden?” voorkomen.",
  },
  {
    id: "meal-planning",
    emoji: "🍲",
    label: "Maaltijden plannen",
    rhythm: "weekly",
    detail: "Elke dag om 17:12 paniek is geen systeem.",
  },
  {
    id: "stock-refill",
    emoji: "👀",
    label: "Voorraad aanvullen",
    rhythm: "weekly",
    detail: "Wc-papier, koffie en tandpasta: heilige drie-eenheid van huisvrede.",
  },
  {
    id: "clothes-away",
    emoji: "🪑",
    label: "Kleding opruimen",
    rhythm: "daily",
    detail: "De stoel is geen kledingkast, al lijkt het soms wel zo.",
  },
  {
    id: "hallway-reset",
    emoji: "🧥",
    label: "Schoenen, jassen en tassen opruimen",
    rhythm: "daily",
    detail: "De hal is geen stormschadegebied.",
  },
  {
    id: "small-repairs",
    emoji: "🔧",
    label: "Kleine reparaties regelen",
    rhythm: "sometimes",
    detail: "Lampen, schroeven, piepende deuren en losse handgrepen.",
  },
  {
    id: "vehicle-maintenance",
    emoji: "🚲",
    label: "Auto/fiets onderhoud regelen",
    rhythm: "sometimes",
    detail: "Banden, benzine, accu en de vraag: “wat is dat geluid?”",
  },
  {
    id: "guests-ready",
    emoji: "🏠",
    label: "Gasten ontvangen / huis toonbaar maken",
    rhythm: "sometimes",
    detail: "In 12 minuten doen alsof je altijd zo leeft.",
  },
] as const;

export const christianHouseTasks = [
  {
    id: "church-services",
    emoji: "⛪",
    label: "Kerkdiensten plannen en bijhouden",
    rhythm: "weekly",
    detail: "Wie weet hoe laat, waar, en of er oppas is?",
  },
  {
    id: "church-committees",
    emoji: "☕",
    label: "Meedraaien in kerkcommissies",
    rhythm: "sometimes",
    detail: "Jeugdwerk, kringen, techniek, koffie, diaconie: wie zegt “ja” voordat hij nadenkt?",
  },
  {
    id: "post-service-hospitality",
    emoji: "🤲",
    label: "Gastvrijheid na de dienst",
    rhythm: "weekly",
    detail: "Mensen uitnodigen, koffie drinken, iemand meenemen die alleen staat.",
  },
  {
    id: "praying-together",
    emoji: "🙏",
    label: "Samen bidden",
    rhythm: "weekly",
    detail: "Niet alleen bij crisis, maar ook op dinsdagavond als niemand zin heeft.",
  },
  {
    id: "bible-rhythm",
    emoji: "📖",
    label: "Bijbellezen / stille tijd vormgeven",
    rhythm: "weekly",
    detail: "Wie neemt initiatief zonder dat het een geestelijk functioneringsgesprek wordt?",
  },
  {
    id: "giving",
    emoji: "🌱",
    label: "Geven aan kerk en goede doelen",
    rhythm: "sometimes",
    detail: "Hoeveel, waaraan, en wie bewaakt dat het niet alleen bij goede bedoelingen blijft?",
  },
  {
    id: "pastoral-attention",
    emoji: "💌",
    label: "Pastorale/diaconale aandacht",
    rhythm: "sometimes",
    detail: "Kaartje sturen, appje doen, maaltijd brengen, op bezoek gaan: liefde met schoenen aan.",
  },
] as const;

export const houseTasks = [
  ...baseHouseTasks,
  ...christianHouseTasks,
] as const;

export const comparisonReactions = [
  "Dit herken ik",
  "Dit had ik niet gezien",
  "Ik ervaar dit anders",
  "Hier wil ik meer over horen",
  "Dit vraagt misschien verandering",
  "Dit hoeft niet opgelost te worden",
] as const;

export const ownershipParts = [
  { id: "notice", icon: "👁️", label: "Ziet dat het nodig is" },
  { id: "plan", icon: "🧠", label: "Onthoudt en regelt" },
  { id: "execute", icon: "✋", label: "Voert het uit" },
] as const;

export const faithRisks = [
  "Stille bitterheid",
  "Controle",
  "Martelaarschap",
  "Onzichtbaarheid",
  "Bewijsdrang",
  "Vermijding",
  "Geen van deze",
] as const;

export const experimentTemplates = [
  "Deze taak krijgt twee weken één duidelijke eigenaar.",
  "Signaleren, plannen en uitvoeren komen bij dezelfde persoon.",
  "We spreken hiervoor één vast moment in de week af.",
  "We maken deze taak bewust kleiner of eenvoudiger.",
  "We vragen hiervoor hulp van buitenaf.",
  "We laten deze taak voorlopig bewust vervallen.",
  "We veranderen nog niets en observeren twee weken eerlijk.",
] as const;

export function taskById(taskId: string) {
  return houseTasks.find((task) => task.id === taskId);
}
