export type DateCategory =
  | "Eten & drinken"
  | "Knus & rustig"
  | "Buiten & natuur"
  | "Actief & avontuurlijk"
  | "Cultuur & stad"
  | "Persoonlijk & sfeer"
  | "Christelijke laag";

export type DateObject = {
  id: string;
  label: string;
  icon: string;
  category: DateCategory;
  placement: "table" | "edge" | "beside";
  tags: string[];
  requiresChristianLayer?: boolean;
};

export const maxDateObjects = 16;

export const dateObjects: DateObject[] = [
  { id: "coffee", label: "Koffie", icon: "☕", category: "Eten & drinken", placement: "table", tags: ["rustig", "drinken", "praten", "laagdrempelig"] },
  { id: "tea", label: "Thee", icon: "🫖", category: "Eten & drinken", placement: "table", tags: ["rustig", "drinken", "binnen"] },
  { id: "wine", label: "Wijn", icon: "🍷", category: "Eten & drinken", placement: "table", tags: ["drinken", "romantisch", "avond"] },
  { id: "beer", label: "Speciaalbier", icon: "🍺", category: "Eten & drinken", placement: "table", tags: ["drinken", "ongedwongen"] },
  { id: "icecream", label: "IJsje", icon: "🍦", category: "Eten & drinken", placement: "table", tags: ["speels", "buiten", "zomer"] },
  { id: "cake", label: "Taart", icon: "🍰", category: "Eten & drinken", placement: "table", tags: ["zoet", "koffie", "gezellig"] },
  { id: "pizza", label: "Pizza", icon: "🍕", category: "Eten & drinken", placement: "table", tags: ["eten", "makkelijk", "ongedwongen"] },
  { id: "sushi", label: "Sushi", icon: "🍣", category: "Eten & drinken", placement: "table", tags: ["eten", "stad", "proeven"] },
  { id: "cook", label: "Zelf koken", icon: "🍳", category: "Eten & drinken", placement: "edge", tags: ["eten", "samen", "binnen"] },
  { id: "restaurant", label: "Restaurant", icon: "🍽️", category: "Eten & drinken", placement: "edge", tags: ["eten", "klassiek", "praten"] },
  { id: "foodtruck", label: "Foodtruck", icon: "🚚", category: "Eten & drinken", placement: "beside", tags: ["eten", "stad", "spontaan"] },
  { id: "picnic", label: "Picknickmand", icon: "🧺", category: "Eten & drinken", placement: "beside", tags: ["buiten", "eten", "rustig"] },
  { id: "sofa", label: "Bank", icon: "🛋️", category: "Knus & rustig", placement: "beside", tags: ["knus", "binnen", "rustig"] },
  { id: "blanket", label: "Dekentje", icon: "🧣", category: "Knus & rustig", placement: "edge", tags: ["knus", "warm", "rustig"] },
  { id: "candles", label: "Kaarsen", icon: "🕯️", category: "Knus & rustig", placement: "table", tags: ["sfeer", "romantisch", "rustig"] },
  { id: "fireplace", label: "Open haard", icon: "🔥", category: "Knus & rustig", placement: "beside", tags: ["warm", "knus", "avond"] },
  { id: "movie", label: "Film", icon: "🎬", category: "Knus & rustig", placement: "table", tags: ["binnen", "rustig"] },
  { id: "series", label: "Serie kijken", icon: "📺", category: "Knus & rustig", placement: "table", tags: ["binnen", "ontspannen"] },
  { id: "boardgame", label: "Bordspel", icon: "🎲", category: "Knus & rustig", placement: "table", tags: ["speels", "praten", "binnen"] },
  { id: "cards", label: "Kaartspel", icon: "🃏", category: "Knus & rustig", placement: "table", tags: ["speels", "klein", "binnen"] },
  { id: "book", label: "Boek", icon: "📖", category: "Knus & rustig", placement: "table", tags: ["rustig", "persoonlijk"] },
  { id: "read", label: "Samen lezen", icon: "📚", category: "Knus & rustig", placement: "table", tags: ["rustig", "diepgang"] },
  { id: "puzzle", label: "Puzzel", icon: "🧩", category: "Knus & rustig", placement: "table", tags: ["rustig", "samen"] },
  { id: "music-soft", label: "Rustige muziek", icon: "🎵", category: "Knus & rustig", placement: "table", tags: ["muziek", "sfeer"] },
  { id: "beach", label: "Strand", icon: "🐚", category: "Buiten & natuur", placement: "edge", tags: ["buiten", "natuur", "wandelen"] },
  { id: "forest", label: "Bos", icon: "🌲", category: "Buiten & natuur", placement: "beside", tags: ["buiten", "natuur", "rustig"] },
  { id: "park", label: "Park", icon: "🌳", category: "Buiten & natuur", placement: "beside", tags: ["buiten", "laagdrempelig"] },
  { id: "water", label: "Waterkant", icon: "🌊", category: "Buiten & natuur", placement: "beside", tags: ["buiten", "rustig"] },
  { id: "walk", label: "Wandeling", icon: "🥾", category: "Buiten & natuur", placement: "beside", tags: ["buiten", "praten", "laagdrempelig"] },
  { id: "bike", label: "Fietsen", icon: "🚲", category: "Buiten & natuur", placement: "beside", tags: ["actief", "buiten"] },
  { id: "boat", label: "Bootje", icon: "⛵", category: "Buiten & natuur", placement: "beside", tags: ["buiten", "avontuurlijk"] },
  { id: "stars", label: "Sterren kijken", icon: "✨", category: "Buiten & natuur", placement: "table", tags: ["romantisch", "avond", "rustig"] },
  { id: "sunset", label: "Zonsondergang", icon: "🌅", category: "Buiten & natuur", placement: "edge", tags: ["romantisch", "buiten"] },
  { id: "campfire", label: "Kampvuur", icon: "🏕️", category: "Buiten & natuur", placement: "beside", tags: ["buiten", "warm"] },
  { id: "dog", label: "Hond uitlaten", icon: "🐕", category: "Buiten & natuur", placement: "beside", tags: ["buiten", "alledaags"] },
  { id: "flowers-field", label: "Bloemenveld", icon: "🌼", category: "Buiten & natuur", placement: "beside", tags: ["natuur", "zacht"] },
  { id: "surf", label: "Surfbord", icon: "🏄", category: "Actief & avontuurlijk", placement: "beside", tags: ["actief", "water", "avontuurlijk"] },
  { id: "swim", label: "Zwemmen", icon: "🏊", category: "Actief & avontuurlijk", placement: "beside", tags: ["actief", "water"] },
  { id: "ball", label: "Sportbal", icon: "⚽", category: "Actief & avontuurlijk", placement: "beside", tags: ["actief", "speels"] },
  { id: "dance", label: "Dansschoenen", icon: "💃", category: "Actief & avontuurlijk", placement: "edge", tags: ["muziek", "actief", "speels"] },
  { id: "skate", label: "Schaatsen", icon: "⛸️", category: "Actief & avontuurlijk", placement: "beside", tags: ["actief", "winter"] },
  { id: "skates", label: "Skates", icon: "🛼", category: "Actief & avontuurlijk", placement: "beside", tags: ["actief", "speels"] },
  { id: "bowling", label: "Bowlingbal", icon: "🎳", category: "Actief & avontuurlijk", placement: "beside", tags: ["actief", "stad", "speels"] },
  { id: "minigolf", label: "Minigolf", icon: "⛳", category: "Actief & avontuurlijk", placement: "beside", tags: ["actief", "speels"] },
  { id: "canoe", label: "Kano", icon: "🛶", category: "Actief & avontuurlijk", placement: "beside", tags: ["water", "avontuurlijk"] },
  { id: "climb", label: "Klimtouw", icon: "🪢", category: "Actief & avontuurlijk", placement: "beside", tags: ["actief", "avontuurlijk"] },
  { id: "quest", label: "Speurtocht", icon: "🧭", category: "Actief & avontuurlijk", placement: "table", tags: ["speels", "avontuurlijk"] },
  { id: "escape", label: "Escape room", icon: "🔐", category: "Actief & avontuurlijk", placement: "table", tags: ["stad", "puzzel", "actief"] },
  { id: "museum", label: "Museumkaartje", icon: "🎟️", category: "Cultuur & stad", placement: "table", tags: ["cultuur", "stad", "praten"] },
  { id: "concert", label: "Concertticket", icon: "🎫", category: "Cultuur & stad", placement: "table", tags: ["muziek", "stad"] },
  { id: "theater", label: "Theatermasker", icon: "🎭", category: "Cultuur & stad", placement: "table", tags: ["cultuur", "avond"] },
  { id: "bookstore", label: "Boekwinkel", icon: "🏷️", category: "Cultuur & stad", placement: "table", tags: ["cultuur", "rustig", "stad"] },
  { id: "market", label: "Marktmand", icon: "🧺", category: "Cultuur & stad", placement: "beside", tags: ["stad", "eten", "struinen"] },
  { id: "terrace", label: "Terras", icon: "☀️", category: "Cultuur & stad", placement: "edge", tags: ["stad", "praten", "drinken"] },
  { id: "citymap", label: "Stadskaart", icon: "🗺️", category: "Cultuur & stad", placement: "table", tags: ["stad", "wandelen"] },
  { id: "camera", label: "Fotocamera", icon: "📷", category: "Cultuur & stad", placement: "table", tags: ["creatief", "stad", "buiten"] },
  { id: "vintage", label: "Vintage winkel", icon: "🧥", category: "Cultuur & stad", placement: "beside", tags: ["stad", "struinen"] },
  { id: "live-music", label: "Live muziek", icon: "🎻", category: "Cultuur & stad", placement: "edge", tags: ["muziek", "avond"] },
  { id: "flowers", label: "Bloemen", icon: "💐", category: "Persoonlijk & sfeer", placement: "table", tags: ["romantisch", "zacht"] },
  { id: "note", label: "Klein briefje", icon: "💌", category: "Persoonlijk & sfeer", placement: "table", tags: ["persoonlijk", "attent"] },
  { id: "chocolate", label: "Chocolade", icon: "🍫", category: "Persoonlijk & sfeer", placement: "table", tags: ["zoet", "attent"] },
  { id: "records", label: "Platen", icon: "💿", category: "Persoonlijk & sfeer", placement: "table", tags: ["muziek", "persoonlijk"] },
  { id: "guitar", label: "Gitaar", icon: "🎸", category: "Persoonlijk & sfeer", placement: "beside", tags: ["muziek", "sfeer"] },
  { id: "hammock", label: "Hangmat", icon: "🌙", category: "Persoonlijk & sfeer", placement: "beside", tags: ["rustig", "buiten"] },
  { id: "train", label: "Treinritje", icon: "🚂", category: "Persoonlijk & sfeer", placement: "beside", tags: ["avontuurlijk", "stad"] },
  { id: "umbrella", label: "Paraplu", icon: "☂️", category: "Persoonlijk & sfeer", placement: "edge", tags: ["regen", "zorgzaam"] },
  { id: "roof", label: "Dakterras", icon: "🏙️", category: "Persoonlijk & sfeer", placement: "beside", tags: ["stad", "avond"] },
  { id: "brunch", label: "Brunch", icon: "🥐", category: "Persoonlijk & sfeer", placement: "table", tags: ["eten", "ochtend"] },
  { id: "drawing", label: "Tekenspullen", icon: "🎨", category: "Persoonlijk & sfeer", placement: "table", tags: ["creatief", "rustig"] },
  { id: "arcade", label: "Arcadekast", icon: "🕹️", category: "Persoonlijk & sfeer", placement: "beside", tags: ["speels", "stad"] },
  { id: "karaoke", label: "Karaoke-microfoon", icon: "🎤", category: "Persoonlijk & sfeer", placement: "table", tags: ["muziek", "speels"] },
  { id: "bible", label: "Bijbel", icon: "📖", category: "Christelijke laag", placement: "table", tags: ["geloof", "rustig", "diepgang"], requiresChristianLayer: true },
  { id: "prayer-card", label: "Gebedskaartje", icon: "✉️", category: "Christelijke laag", placement: "table", tags: ["geloof", "gebed", "persoonlijk"], requiresChristianLayer: true },
  { id: "church", label: "Kerkgebouwtje", icon: "⛪", category: "Christelijke laag", placement: "edge", tags: ["geloof", "stad", "rust"], requiresChristianLayer: true },
  { id: "hymnbook", label: "Psalmboek", icon: "🎼", category: "Christelijke laag", placement: "table", tags: ["geloof", "muziek"], requiresChristianLayer: true },
  { id: "silent-candle", label: "Kaars van stilte", icon: "🕯️", category: "Christelijke laag", placement: "table", tags: ["geloof", "rustig", "gebed"], requiresChristianLayer: true },
  { id: "hospitality", label: "Gastvrije tafel", icon: "🍽️", category: "Christelijke laag", placement: "edge", tags: ["geloof", "gastvrijheid"], requiresChristianLayer: true },
  { id: "diaconal-basket", label: "Diaconaal mandje", icon: "🧺", category: "Christelijke laag", placement: "table", tags: ["geloof", "dienstbaar", "gastvrijheid"], requiresChristianLayer: true },
  { id: "gratitude-jar", label: "Dankbaarheidspotje", icon: "🏺", category: "Christelijke laag", placement: "table", tags: ["geloof", "dankbaarheid"], requiresChristianLayer: true },
  { id: "pilgrim-walk", label: "Pelgrimswandeling", icon: "🦪", category: "Christelijke laag", placement: "beside", tags: ["geloof", "wandelen", "betekenis"], requiresChristianLayer: true },
  { id: "sunday-coffee", label: "Zondagse koffie", icon: "☕", category: "Christelijke laag", placement: "table", tags: ["geloof", "koffie", "gemeenschap"], requiresChristianLayer: true },
  { id: "small-group-book", label: "Kringboekje", icon: "📘", category: "Christelijke laag", placement: "table", tags: ["geloof", "gesprek"], requiresChristianLayer: true },
  { id: "blessing-card", label: "Zegenkaartje", icon: "🌿", category: "Christelijke laag", placement: "table", tags: ["geloof", "zegen", "persoonlijk"], requiresChristianLayer: true },
];

export const conversationStarters = [
  "Wat maakt een eerste date voor jou ontspannen?",
  "Wanneer voelt een date voor jou te veel?",
  "Ben jij meer van rustig praten of samen iets doen?",
  "Wat vind jij een fijne plek om iemand beter te leren kennen?",
  "Wat maakt een avond voor jou gezellig?",
  "Ben jij meer van spontaan of gepland?",
  "Wat zou jij liever vermijden op een eerste date?",
  "Wanneer voel jij je op je gemak bij iemand?",
  "Wat is romantisch zonder dat het ongemakkelijk wordt?",
  "Wat zegt jouw ideale kleine date over jou?",
];

export const tableSpots = [
  [49, 45], [38, 32], [60, 33], [28, 48], [70, 48], [50, 24], [18, 58], [82, 58],
  [34, 64], [64, 64], [47, 70], [22, 34], [77, 35], [12, 45], [88, 45], [50, 56],
] as const;
