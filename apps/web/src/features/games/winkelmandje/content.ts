export const shopNeeds = [
  { id: "freedom", icon: "🧭", title: "Vrijheid", description: "Ruimte, avontuur en even weg uit wat moet." },
  { id: "mastery", icon: "🛠️", title: "Grip", description: "Kunnen maken, oplossen en ergens beter in worden." },
  { id: "comfort", icon: "🫖", title: "Rust", description: "Zachtheid, gemak en minder prikkels." },
  { id: "recognition", icon: "✨", title: "Erkenning", description: "Gezien worden, meetellen en iets uitstralen." },
  { id: "renewal", icon: "🌱", title: "Vernieuwing", description: "Een frisse start of een nieuw mogelijk zelf." },
  { id: "connection", icon: "🎁", title: "Verbinding", description: "Samen beleven, zorgen, geven en nabij zijn." },
] as const;

export type ShopNeedId = (typeof shopNeeds)[number]["id"];

export const shopDays = [
  {
    id: "frustrating-workday",
    title: "De dag waarop alles terugkwam",
    story:
      "Je dag liep uit, iemand leverde kritiek op iets waar je hard aan werkte en thuis wacht nog gedoe. Onderweg zie je een warme winkel. Je hebt twintig minuten voordat hij sluit.",
    whisper: "Misschien helpt iets nieuws om deze dag toch nog van jou te maken.",
  },
  {
    id: "responsible-weeks",
    title: "Al weken vooral verantwoordelijk",
    story:
      "Je hebt wekenlang geregeld, geholpen en volgehouden. Vandaag vroeg opnieuw iemand iets van je. Op weg naar huis brandt licht in een merkwaardige winkel vol mogelijkheden.",
    whisper: "Je hebt toch ook recht op iets dat alleen voor jou is?",
  },
  {
    id: "comparison",
    title: "Iedereen lijkt verder",
    story:
      "Je zag vandaag hoe avontuurlijk, succesvol of opgeruimd het leven van anderen eruitziet. Jouw eigen leven voelt ineens kleiner. Dan kom je langs de winkel.",
    whisper: "Misschien ontbreekt er maar één ding.",
  },
  {
    id: "uncertain-future",
    title: "Een hoofd vol toekomst",
    story:
      "Een plan is onzeker geworden en je weet niet goed wat de volgende stap is. Je wilt iets dóén. Voor je ligt een winkel vol gereedschap, reizen, comfort en nieuwe beginnen.",
    whisper: "Kiezen voelt tenminste als vooruitgaan.",
  },
  {
    id: "celebration",
    title: "Dit ging eindelijk goed",
    story:
      "Iets waar je lang voor werkte is gelukt. Je voelt opluchting en trots. De winkel is nog open en alles lijkt vanavond nét iets mooier.",
    whisper: "Een goede dag mag toch zichtbaar worden?",
  },
] as const;

export const shopProducts = [
  { id: "trail-pack", icon: "🎒", title: "De Verder-Weg-rugzak", pitch: "Voor plannen die groter voelen zodra je iets hebt om ze in te dragen.", need: "freedom", price: 168 },
  { id: "night-train", icon: "🚆", title: "Een onverwachte nachttrein", pitch: "Vertrek vrijdag. Bedenk zaterdag waarom.", need: "freedom", price: 237 },
  { id: "camp-kit", icon: "🏕️", title: "Het complete buitenpakket", pitch: "Inclusief het geloof dat je voortaan ieder weekend naar buiten gaat.", need: "freedom", price: 314 },
  { id: "binoculars", icon: "🔭", title: "De horizonverrekijker", pitch: "Voor wie vermoedt dat het interessante leven net iets verderop gebeurt.", need: "freedom", price: 119 },
  { id: "workbench", icon: "🪚", title: "De serieuze werkbank", pitch: "Maakt van ieder hoekje onmiddellijk een werkplaats met potentie.", need: "mastery", price: 289 },
  { id: "drill", icon: "🛠️", title: "De Overal-Een-Oplossing-voor-set", pitch: "Zesentachtig onderdelen. Minstens zeven begrijp je direct.", need: "mastery", price: 246 },
  { id: "camera", icon: "📷", title: "De camera voor je echte blik", pitch: "Omdat je misschien niet méér avontuur nodig hebt, maar beter licht.", need: "mastery", price: 425 },
  { id: "chef-knife", icon: "🔪", title: "Het mes voor mensen met overzicht", pitch: "Snijdt groenten, twijfel en mogelijk ook dinsdagavondchaos.", need: "mastery", price: 132 },
  { id: "headphones", icon: "🎧", title: "De wereld-even-uit-koptelefoon", pitch: "Dempt verkeer, gesprekken en vier vijfde van vandaag.", need: "comfort", price: 184 },
  { id: "blanket", icon: "🧶", title: "Het nooddekentje voor lange dagen", pitch: "Geen oplossing. Wel zacht genoeg om daar even vrede mee te hebben.", need: "comfort", price: 79 },
  { id: "coffee", icon: "☕", title: "De bijna-professionele koffiemachine", pitch: "Voor ochtenden die zich voortaan hopelijk gedragen.", need: "comfort", price: 352 },
  { id: "hotel", icon: "🛏️", title: "Eén nacht nergens verantwoordelijk", pitch: "Ontbijt inbegrepen. Vragen van anderen niet.", need: "comfort", price: 218 },
  { id: "jacket", icon: "🧥", title: "De jas waarin iets kan gebeuren", pitch: "Dezelfde jij, maar met overtuigender zakken.", need: "recognition", price: 196 },
  { id: "watch", icon: "⌚", title: "Het horloge dat zegt dat je ertoe doet", pitch: "Geeft dezelfde tijd aan, alleen met meer gezag.", need: "recognition", price: 338 },
  { id: "chair", icon: "🪑", title: "De stoel die het huis eindelijk afmaakt", pitch: "Waarschijnlijk. Tot je de lamp ernaast ziet.", need: "recognition", price: 274 },
  { id: "profile", icon: "🖼️", title: "De foto waarop alles klopt", pitch: "Professioneel licht voor een leven dat gewoon buiten beeld mag blijven.", need: "recognition", price: 145 },
  { id: "language", icon: "🗺️", title: "De nieuwe-taal-in-negentig-dagen-doos", pitch: "Inclusief kaarten, audio en een verrassend ambitieus toekomstbeeld.", need: "renewal", price: 127 },
  { id: "garden", icon: "🌿", title: "De volwassen-mens-moestuin", pitch: "Zaden, bakken en het rustige leven dat er volgens de verpakking bij hoort.", need: "renewal", price: 153 },
  { id: "instrument", icon: "🎸", title: "Het instrument voor je volgende hoofdstuk", pitch: "Je buren krijgen gratis toegang tot het leerproces.", need: "renewal", price: 263 },
  { id: "planner", icon: "📔", title: "De Maandag-Wordt-Anders-planner", pitch: "Met drie lintjes en genoeg vakjes om chaos professioneel te rangschikken.", need: "renewal", price: 58 },
  { id: "dinner", icon: "🍲", title: "Een lange tafel voor zes", pitch: "Jij nodigt uit. De winkel doet alsof agenda’s vanzelf meewerken.", need: "connection", price: 186 },
  { id: "partner-gift", icon: "🎁", title: "Het cadeau dat bewijst dat je luisterde", pitch: "Zelfs als je vooral heel hard hebt nagedacht.", need: "connection", price: 112 },
  { id: "shared-trip", icon: "🛶", title: "Een dag samen het water op", pitch: "Telefoons blijven droog aan de kant. Dat is althans het plan.", need: "connection", price: 174 },
  { id: "care-box", icon: "📦", title: "De ik-dacht-aan-je-doos", pitch: "Voor iemand die zorg kan gebruiken en het zelf niet snel vraagt.", need: "connection", price: 67 },
] as const;

export const shopInterruptions = [
  "Nog maar één beschikbaar.",
  "Mensen met goede smaak bekeken dit ook.",
  "Je dag was al lang genoeg.",
  "Vandaag gratis bezorgd.",
  "Dit past opvallend goed bij je toekomstige zelf.",
  "Testpartner bleef hier net iets langer naar kijken.",
  "De winkel sluit sneller dan jouw twijfel.",
  "Je kunt het altijd terugsturen. Waarschijnlijk.",
] as const;

export const partnerReactions = [
  "Dit voelt zorgvuldig.",
  "Dit verrast me.",
  "Je hebt iets belangrijks beschermd.",
  "Ik wil uitleggen waarom dit me raakt.",
] as const;

export const conversationCards = [
  "Welke keuze liet je voelen dat je partner je begreep?",
  "Wanneer voelt begrenzen als zorg, en wanneer als controle?",
  "Wat vond je makkelijker: iets voor de ander kiezen of diens keuze voor jou ontvangen?",
] as const;

export const faithDesires = [
  "Rust",
  "Schoonheid",
  "Avontuur",
  "Vakmanschap",
  "Verbinding",
  "Gulheid",
  "Vreugde",
] as const;

export const faithWeights = [
  "Veiligheid",
  "Status",
  "Controle",
  "Troost",
  "Zelfverbetering",
  "Onafhankelijkheid",
  "Erbij horen",
  "Geen van deze",
] as const;

export const faithPractices = [
  "Dankbaar genieten",
  "48 uur wachten",
  "Gebruiken of repareren wat ik al heb",
  "Iets delen of weggeven",
  "Vertellen wat ik werkelijk nodig heb",
  "Rust zoeken zonder iets te kopen",
  "Bewust iets moois kiezen zonder schuldgevoel",
] as const;

export const supportLines = [
  "Wil je dat ik meedenk of wil je alleen hardop twijfelen?",
  "Ik keur niets af; vertel me wat het je belooft.",
  "Is dit voor vandaag of voor je toekomstige zelf?",
  "Zullen we het in de 48-uursmand zetten?",
  "Is dit vooral nodig, mooi, leuk of troostend?",
] as const;

