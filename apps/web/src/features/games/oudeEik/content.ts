export const atmosphereOptions = [
  { id: "warm", label: "Warm en betrokken" },
  { id: "busy", label: "Levendig en druk" },
  { id: "quiet", label: "Rustig, met weinig woorden" },
  { id: "careful", label: "Voorzichtig en conflictmijdend" },
  { id: "unpredictable", label: "Wisselend of onvoorspelbaar" },
  { id: "independent", label: "Zelfstandig: ieder regelde veel zelf" },
] as const;

export const messageOptions = [
  { id: "be-strong", label: "Wees sterk; red jezelf" },
  { id: "keep-peace", label: "Houd de sfeer goed" },
  { id: "perform", label: "Laat zien dat je het goed doet" },
  { id: "do-not-burden", label: "Val een ander niet lastig" },
  { id: "stay-close", label: "Blijf dichtbij en loyaal" },
  { id: "be-yourself", label: "Je mag jezelf zijn" },
] as const;

export const roleOptions = [
  { id: "carer", label: "De zorgdrager" },
  { id: "peacemaker", label: "De vredestichter" },
  { id: "achiever", label: "Degene die het goed moest doen" },
  { id: "observer", label: "De stille waarnemer" },
  { id: "rebel", label: "Degene die zich losmaakte" },
  { id: "connector", label: "De verbinder of sfeermaker" },
] as const;

export const responseOptions = [
  { id: "pursue", label: "Ik zoek direct contact en antwoorden" },
  { id: "withdraw", label: "Ik neem afstand en word stiller" },
  { id: "solve", label: "Ik ga regelen, uitleggen of oplossen" },
  { id: "please", label: "Ik pas me aan om de rust terug te krijgen" },
  { id: "defend", label: "Ik verdedig mezelf of ga in de tegenaanval" },
  { id: "freeze", label: "Ik weet even niet meer wat ik moet doen" },
] as const;

export const needOptions = [
  { id: "reassurance", label: "Bevestiging dat we nog goed zijn" },
  { id: "space", label: "Even ruimte zonder verlies van verbinding" },
  { id: "clarity", label: "Duidelijkheid over wat er speelt" },
  { id: "gentleness", label: "Een rustige, zachte benadering" },
  { id: "recognition", label: "Erkenning van mijn bedoeling of gevoel" },
  { id: "reliability", label: "Merken dat woorden en afspraken betrouwbaar zijn" },
] as const;

export const conversationQuestions = [
  "Wat aan deze reactie herken je al tussen ons, zonder dat iemand de schuld krijgt?",
  "Wat probeerde jouw oude rol vroeger voor jou of je gezin te beschermen?",
  "Waaraan kan ik eerder merken dat jouw behoefte geraakt wordt?",
  "Wat kan ik dan concreet doen dat helpt, en wat werkt juist averechts?",
  "Welke mooie erfenis uit jouw thuis wil je bewust aan onze relatie geven?",
  "Welke oude regel hoeven wij samen niet te blijven volgen?",
] as const;
