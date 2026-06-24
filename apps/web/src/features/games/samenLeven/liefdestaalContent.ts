export type LoveRoute =
  | "woorden"
  | "aandacht"
  | "aanraking"
  | "hulp"
  | "attenties";

export const loveRouteInfo: Record<
  LoveRoute,
  {
    icon: string;
    title: string;
    shortTitle: string;
    description: string;
    tryThis: string;
  }
> = {
  woorden: {
    icon: "💬",
    title: "Lieve en bemoedigende woorden",
    shortTitle: "Lieve woorden",
    description:
      "Je merkt liefde sneller wanneer waardering, liefde en vertrouwen ook echt worden uitgesproken.",
    tryThis:
      "Zeg niet alleen dát je de ander waardeert, maar noem één concreet ding dat je vandaag zag.",
  },
  aandacht: {
    icon: "⏳",
    title: "Echte tijd samen",
    shortTitle: "Tijd samen",
    description:
      "Je merkt liefde sneller wanneer iemand tijd maakt, luistert en er met volle aandacht bij is.",
    tryThis:
      "Maak een kort moment zonder telefoon of haast en laat de ander bepalen waar het gesprek over gaat.",
  },
  aanraking: {
    icon: "🤝",
    title: "Lichamelijke nabijheid",
    shortTitle: "Nabijheid",
    description:
      "Je merkt liefde sneller door passende en welkome aanraking, zoals een knuffel, hand of dicht bij elkaar zitten.",
    tryThis:
      "Vraag welke vorm van aanraking nu fijn is; nabijheid werkt alleen wanneer die veilig en welkom voelt.",
  },
  hulp: {
    icon: "🧺",
    title: "Helpen en ontzorgen",
    shortTitle: "Helpen",
    description:
      "Je merkt liefde sneller wanneer iemand ziet wat nodig is en iets praktisch lichter maakt.",
    tryThis:
      "Vraag welke taak vandaag echt zou helpen, of pak iets op waarvan je zeker weet dat het welkom is.",
  },
  attenties: {
    icon: "🎁",
    title: "Cadeaus met betekenis",
    shortTitle: "Cadeaus",
    description:
      "Je merkt liefde sneller in een klein cadeau of aandenken dat laat zien: ik ken jou en ik dacht aan je.",
    tryThis:
      "Kies iets kleins met een persoonlijk verhaal; de betekenis telt meestal meer dan de prijs.",
  },
};
