export const houseTasks = [
  { id: "cooking", emoji: "🍳", label: "Koken", detail: "Maaltijden bedenken, boodschappen plannen en dagelijks koken." },
  { id: "cleaning", emoji: "🧹", label: "Schoonmaken", detail: "Stofzuigen, dweilen, badkamer, keuken schoonhouden." },
  { id: "laundry", emoji: "🧺", label: "Wassen & strijken", detail: "Was sorteren, wassen, ophangen, vouwen en strijken." },
  { id: "groceries", emoji: "🛒", label: "Boodschappen doen", detail: "Lijstjes maken, inkopen doen, voorraad beheren." },
  { id: "finances", emoji: "💰", label: "Financiën", detail: "Rekeningen betalen, budget bijhouden, verzekeringen regelen." },
  { id: "admin", emoji: "📋", label: "Administratie", detail: "Papierwerk, belasting, abonnementen, gemeentezaken." },
  { id: "planning", emoji: "📅", label: "Afspraken plannen", detail: "Verjaardagen, cadeaus, sociale verplichtingen, onderhoud." },
  { id: "family-contact", emoji: "👨‍👩‍👧", label: "Familiecontact", detail: "Contact onderhouden met familie, verjaardagen, feestdagen." },
  { id: "vacation", emoji: "✈️", label: "Vakantie plannen", detail: "Bestemming kiezen, boeken, inpakken, reis voorbereiden." },
  { id: "household-org", emoji: "🏠", label: "Huishoudelijke organisatie", detail: "Voorraad beheren, klusjes bijhouden, onderhoud plannen." },
  { id: "pets", emoji: "🐾", label: "Zorg voor dieren", detail: "Voeren, uitlaten, dierenarts, verzorging." },
  { id: "children", emoji: "👶", label: "Zorg voor kinderen", detail: "Ophalen, brengen, activiteiten, schoolcontact, opvoeding." },
  { id: "mental-load", emoji: "🧠", label: "Mentale last", detail: "Alles onthouden, overal aan denken, lijstjes in je hoofd." },
] as const;

export const houseRooms = [
  { id: "keuken", label: "Keuken", emoji: "🍳" },
  { id: "woonkamer", label: "Woonkamer", emoji: "🛋️" },
  { id: "wasruimte", label: "Wasruimte", emoji: "🧺" },
  { id: "administratie", label: "Administratiehoek", emoji: "📋" },
  { id: "slaapkamer", label: "Slaapkamer", emoji: "🛏️" },
  { id: "tuin", label: "Tuin/Balkon", emoji: "🌿" },
  { id: "agenda", label: "Agenda", emoji: "📅" },
] as const;

export const discussionQuestions = [
  "Welke taak vind jij zwaarder dan anderen vaak denken?",
  "Waar wil jij waardering voor krijgen als het om taken gaat?",
  "Wat zou voor jou oneerlijk voelen in een taakverdeling?",
  "Wat heb jij thuis geleerd over taken verdelen tussen partners?",
  "Wat betekent 'samen verantwoordelijk' voor jou?",
  "Welke taak doe je liever alleen — en waarom?",
  "Waar botst jouw tempo of netheid met dat van de ander?",
  "Wat zou je graag willen dat de ander overneemt, maar durf je niet te vragen?",
] as const;

export const categories = [
  { id: "enjoy" as const, emoji: "❤️", label: "Doe ik graag", description: "Hier word ik blij van of kost me weinig moeite." },
  { id: "draining" as const, emoji: "⚡", label: "Kost me energie", description: "Ik kan het doen, maar het kost me moeite." },
  { id: "avoid" as const, emoji: "😰", label: "Doe ik liever niet", description: "Dit vergeet ik snel, stel ik uit, of ontwijk ik." },
] as const;

export function labelFor<T extends { id: string; label: string }>(
  items: readonly T[],
  id: string,
) {
  return items.find((item) => item.id === id)?.label ?? id;
}

export function emojiForTask(taskId: string) {
  return houseTasks.find((t) => t.id === taskId)?.emoji ?? "📌";
}

export function detailForTask(taskId: string) {
  return houseTasks.find((t) => t.id === taskId)?.detail ?? "";
}