# Profiel-scoremodel — ontwerp (ter review)

> **Status:** v2 geïmplementeerd in `apps/api/src/traitEngine.ts` (6 domeinen,
> facetten, convergentie/dekking, gelaagde gewichten, uitbreidbaar register
> `GAME_EXTRACTORS`). Getest in `traitEngine.test.ts`. Dit document is de
> leidende specificatie; gewichten in §5 zijn instelbaar.

Doel: uit de spelkeuzes een **genuanceerd, eerlijk** beeld van iemand opbouwen
dat groeit over de spellen heen — en dat nooit vervalt tot simplistische
etiketten ("0,8 impulsief"). Dit document legt vast: welke kaders we lenen,
welke dimensies we meten, hoeveel "bars", en exact welke keuze welk gewicht
krijgt. Het is een voorstel om samen bij te stellen.

---

## 1. Uitgangspunten (anti-simplistisch)

1. **Geen losse-keuze-conclusies.** Eén keuze is een signaal, geen oordeel. Een
   dimensie wordt pas met vertrouwen getoond als **meerdere onafhankelijke
   signalen** dezelfde kant op wijzen (convergentie). Dit is het belangrijkste
   verschil met de huidige v1.
2. **Onzekerheid is een eersteklas burger.** Elke dimensie krijgt een
   *dekkingsgraad* (hoeveel data eronder ligt). Weinig data → "voorlopig beeld",
   niet gepresenteerd als feit.
3. **Brede neutrale zone.** Mensen zijn meestal "gemiddeld". Alleen duidelijke
   uitslagen (genoeg signaal én ver van het midden) worden benoemd.
4. **Waarden ≠ trekken ≠ toestand.** We houden drie lagen apart:
   - *Waarden* — wat iemand belangrijk vindt (Schwartz-achtig).
   - *Trekken* — hoe iemand doorgaans is (Big Five / HEXACO-achtig).
   - *Toestand/relationeel* — wat in déze relatie/dit moment speelt (tempo,
     hechtingssignalen, conflictstijl).
5. **Tendensen, geen labels.** Naar de gebruiker toe: gewone taal en richtingen
   ("je zoekt eerder rust"), nooit cijfers, percentages of diagnoses.
6. **Transparant & instelbaar.** Elk gewicht staat in §5; niets is een black box.

---

## 2. Professionele kaders (wat we lenen — en de eerlijke disclaimer)

Wat de wetenschap als standaard gebruikt voor dit soort metingen:

| Kader | Waarvoor | Wat we lenen |
|---|---|---|
| **Big Five / OCEAN** (gouden standaard persoonlijkheid; HEXACO voegt Eerlijkheid-Bescheidenheid toe) | Stabiele trekken | De 5–6 hoofddomeinen + het idee van *facetten* onder een domein |
| **Hechtingstheorie (ECR-R: angst & vermijding)** | Hoe iemand nabijheid aangaat | Twee relationele assen: behoefte aan nabijheid ↔ ruimte; toenadering ↔ terugtrekken |
| **Schwartz' waardencirkel** (10 basiswaarden) | Wat iemand drijft | Onze waardenspellen mappen hier natuurlijk op |
| **Gottman (conflicthantering)** | Hoe een stel botst/herstelt | Conflictstijl als aparte relationele dimensie |

**Echte standaard = meerdere items per construct, betrouwbaarheid (Cronbach's
α ≥ .70), validatie en normering tegen een populatie (percentielen).** Een
dating-spel is *geen* gevalideerd instrument. Daarom:

> We presenteren dit expliciet als "patronen die we in jullie keuzes zien",
> nooit als test, score of diagnose. Dat past ook bij het app-principe "geen
> diagnose, geen etiket".

Wat we wél overnemen van de standaard: meerdere items per dimensie,
convergentie-eis, onzekerheid tonen, brede neutrale zone, en domeinen met
facetten i.p.v. losse ad-hoc assen.

---

## 3. Het model: 6 domeinen met facetten

Niet 9 losse assen, maar **6 domeinen** (de "bars"), elk met 2–3 facetten die
samen de score voeden. Zo blijft het rijk maar overzichtelijk.

| # | Domein | Facetten | Voornaamste bronnen |
|---|---|---|---|
| 1 | **Openheid & nieuwsgierigheid** | avontuurlijkheid, verbeelding/creativiteit, behoefte aan rust↔prikkel | waarden (avontuur/vrijheid/groei/rust), interesses, spiegelvijver, vrolijke-open-plek |
| 2 | **Zorgvuldigheid & toewijding** | betrouwbaarheid, serieusheid van intentie, structuur | waarden (trouw/ambitie), relatie-intentie, grenzen & tempo |
| 3 | **Verbinding & nabijheid** | behoefte aan nabijheid, warmte, hechtingsangst↔veiligheid | waarden (warmte/verbinding/familie), oude eik (need), stilteruisje (nabijheid), grenzen & tempo |
| 4 | **Mildheid & samenwerking** | zorgzaamheid, conflictstijl (terugtrekken↔confronteren), aanpassing | oude eik (respons), kernkwadranten, familiedorp, kruispunt-reacties |
| 5 | **Emotionele rust & tempo** | bedachtzaamheid↔vlotheid, behoefte aan veiligheid, prikkelbaarheid | wachtkamer (tempo), stilteruisje (tijd/veiligheid), oude eik (freeze) |
| 6 | **Zingeving & richting** | geloof/spiritualiteit, betekenis, traditie↔vernieuwing | waarden (geloof/dankbaarheid), christelijke laag, profielintentie |

Elk domein toont alleen iets als er **≥3 signalen** zijn (convergentie) én de
uitslag duidelijk is. Anders: "nog te vroeg / voorlopig".

---

## 4. Hoe we precies meten (de rekenregels)

Per facet verzamelen we **signalen** (keuze → richting + gewicht). Dan:

1. **Per facet:** gewogen gemiddelde van de signalen → ruwe waarde op een as
   (−100…+100), waarbij het gewicht ook de *sterkte* van het signaal weergeeft
   (een directe keuze weegt zwaarder dan een afgeleid trefwoord).
2. **Per domein:** gemiddelde van zijn facetten → domeinwaarde.
3. **Dekking (confidence):** aantal onafhankelijke bron-spellen dat bijdroeg.
   0–2 = "voorlopig" (niet stellig tonen), 3–4 = "redelijk", 5+ = "stevig".
4. **Naar tekst:** alleen domeinen met dekking ≥3 én |waarde| boven een drempel
   worden als tendens benoemd; de rest blijft impliciet of als "nog ontdekken".
5. **Nooit naar cijfers in de UI** — de AI vertaalt naar gewone taal, met de
   dekking als rem op stelligheid ("lijkt", "voorlopig", "tot nu toe").

Signaal-gewichten (richtlijn):
- **Directe, expliciete keuze** in een spel dat het construct meet: gewicht 3.
- **Afgeleide keuze** (bv. een waarde die het construct raakt): gewicht 2.
- **Zwak/trefwoord** (interesse, los woord): gewicht 1.

---

## 5. Scorematrix — per spel en keuze (kern)

Notatie: `keuze → Domein.facet ±sterkte`. (+ = meer, − = minder.)

### Je waarden (waarden) — gewicht 2 per gekozen waarde
| Waarde | Bijdrage |
|---|---|
| avontuur | Openheid.avontuur +3 |
| vrijheid | Openheid.avontuur +2, Verbinding.nabijheid −2 |
| groei | Openheid.verbeelding +2 |
| rust | Openheid.rust +3, Tempo.bedachtzaam +2 |
| creativiteit | Openheid.verbeelding +3 |
| trouw | Zorgvuldigheid.betrouwbaar +3, Verbinding.nabijheid +1 |
| ambitie | Zorgvuldigheid.structuur +2 |
| eerlijkheid | Mildheid.aanpassing 0 / Openheid (uiten) +2 |
| warmte | Verbinding.warmte +3, Mildheid.zorgzaam +2 |
| verbinding | Verbinding.nabijheid +3 |
| familie | Verbinding.nabijheid +2, Mildheid.zorgzaam +2 |
| vriendschap | Verbinding.warmte +2 |
| respect | Mildheid.zorgzaam +2 |
| geloof | Zingeving.geloof +3 |
| dankbaarheid | Zingeving.betekenis +2 |

### Oude eik (oude-eik) — gewicht 3 (direct gedragssignaal)
| Veld → keuze | Bijdrage |
|---|---|
| respons: pursue | Mildheid.conflict +3 (confronteren), Verbinding.nabijheid +2 |
| respons: withdraw | Mildheid.conflict −3 (terugtrekken) |
| respons: solve | Mildheid.conflict +1, Tempo.vlot +2 |
| respons: please | Mildheid.zorgzaam +3, Mildheid.conflict −1 |
| respons: defend | Mildheid.conflict +3 |
| respons: freeze | Rust&tempo.bedachtzaam +2, Mildheid.conflict −2 |
| behoefte: reassurance/gentleness | Verbinding.hechtingsangst +2 |
| behoefte: space | Verbinding.nabijheid −3 |
| behoefte: clarity | Zorgvuldigheid.structuur +2 |

### Onder de oppervlakte (spiegelvijver) — gewicht 3
| Keuze | Bijdrage |
|---|---|
| openheid: observe-first | Openheid (uiten) −3 |
| openheid: open-not-deep | Openheid +1 |
| openheid: easy-but-guarded | Openheid +2, Verbinding.warmte +1 |
| laag "wat ik zelf nog niet snap" gevuld | Zelfreflectie-signaal (Openheid.verbeelding +1) |

### Stilteruisje (stilteruisje) — gewicht 2 (schaal 1–5 → ± t.o.v. 3)
| Kanaal | Bijdrage |
|---|---|
| closeness | Verbinding.nabijheid + (waarde−3)×1,5 |
| time | Rust&tempo.bedachtzaam + (waarde−3)×1,2 |
| safety | Rust&tempo.veiligheid + (waarde−3)×1,2 |
| clarity | Zorgvuldigheid.structuur + (waarde−3) |
| gentleness | Mildheid.zorgzaam + (waarde−3) |

### Grenzen & tempo (grenzen-tempo) — gewicht 3
| Signaal | Bijdrage |
|---|---|
| gem. tempo-niveau laag (liever later) | Rust&tempo.bedachtzaam +2, Verbinding.nabijheid −1 |
| gem. tempo-niveau hoog (prima/snel) | Verbinding.nabijheid +2 |
| veel "eerst vragen"/"niet goed" grenzen | Zorgvuldigheid.structuur +2, Rust&tempo.veiligheid +2 |
| kleine-nee respons: respecteren | Mildheid.zorgzaam +2 |

### Kernkwadranten (kernkwadranten) — gewicht 2 (trefwoord op kwaliteit)
Kwaliteit/uitdaging-woord → trefwoordtabel (zie hieronder).

### Kruispunt van reacties (kruispunt-reacties) — gewicht 2
| Signaal | Bijdrage |
|---|---|
| veel snelle/impulsieve keuzes | Rust&tempo.vlot +2 |
| vaak "te laat gekozen" (timeouts) | Rust&tempo.bedachtzaam +2 |
| keuzes botsen vaak met partner | (relationeel: verschil-signaal, geen trek) |

### Legacy/vrije vorm (kwaliteiten, familiedorp, kennismaking, lach-samen, brug, stille vijver) — gewicht 1
Best-effort via **trefwoordtabel**:
| Trefwoord (regex) | Bijdrage |
|---|---|
| geduld/rust/kalm/luister | Mildheid.zorgzaam +2, Rust&tempo.bedachtzaam +2 |
| spontaan/avontuur/reiz | Openheid.avontuur +2, Rust&tempo.vlot +1 |
| humor/grap/lach | Openheid (speels) +2 |
| zorg/vredestichter/warm | Mildheid.zorgzaam +2, Verbinding.warmte +1 |
| eerlijk/open/direct | Openheid (uiten) +2 |
| muziek/zing/foto/kunst | Openheid.verbeelding +1 |

### Wachtkamer (state, geen trek-bron op zich) — gewicht 2
Aandeel wachttijd waarop op deze persoon werd gewacht → Rust&tempo.bedachtzaam
(meer = bedachtzamer/trager). Telt als **toestand**, niet als kerntrek.

---

## 6. Van scores naar tekst

- De AI-schrijver krijgt per domein: richting, sterkte-band (laag/midden/hoog),
  **dekking**, en de bron-spellen.
- Regels: alleen domeinen met dekking ≥3 stellig benoemen; lagere dekking
  voorzichtig of weglaten; nooit cijfers; tendensen, geen labels.
- Tegenstrijdige signalen binnen een domein → expliciet als spanning benoemen
  ("soms zoek je nabijheid, soms juist ruimte"), niet middelen tot grijs.

---

## 7. Beperkingen & ethiek

- Geen gevalideerd instrument, geen diagnose. Framing altijd: "patronen in jullie
  keuzes", herzienbaar, groeit met meer spellen.
- Niet gebruiken voor onomkeerbare beslissingen; bedoeld als gespreksopener.
- Transparantie: gewichten staan hier; bij te stellen na ervaring/feedback.

---

## 8. Wat dit verandert t.o.v. de huidige engine (v1 → v2)

| v1 (nu) | v2 (dit ontwerp) |
|---|---|
| 9 losse assen | 6 domeinen met facetten |
| één keuze kan kantelen | convergentie-eis (≥3 signalen) |
| geen onzekerheid | dekkingsgraad stuurt stelligheid |
| waarden/trekken door elkaar | drie lagen apart (waarde/trek/toestand) |
| vaste banden | brede neutrale zone, alleen duidelijke uitslagen |
| ad-hoc gewichten | gedocumenteerde, gelaagde gewichten (§5) |

---

## 9. Dekkingsbevindingen na kaart 1 + 2 (gemeten op het seed-koppel)

Alle 14 spellen (7 + 7) gevoed; dekking per domein:

| Domein | Dekking | Bron-spellen |
|---|---|---|
| Openheid & nieuwsgierigheid | redelijk–stevig | profiel, waarden, kernkwadranten, vrolijke open plek, spiegelvijver |
| Mildheid & samenwerking | redelijk–stevig | familiedorp, kwaliteiten, kernkwadranten, oude eik, grenzen & tempo |
| Emotionele rust & tempo | voorlopig–redelijk | stilteruisje, grenzen & tempo, kruispunt, wachtkamer |
| Verbinding & nabijheid | voorlopig | oude eik, stilteruisje |
| Zorgvuldigheid & toewijding | voorlopig | profiel (trouw, intentie), waarden |
| Zingeving & richting | voorlopig | profiel (kinderwens), geloofslaag |

**Goed gedekt:** persoonlijkheid (openheid), conflict/zorg (mildheid), tempo. De kaart-2-spellen voegen hier veel toe (oude eik = conflictstijl, spiegelvijver = zich openen, grenzen & tempo = nabijheid, kernkwadranten = kwaliteit/valkuil, kruispunt = impulsiviteit).

**Nog dun — dit zijn CONTENT-gaten, geen engine-gaten** (de engine weegt ze zodra er vragen voor zijn):
- **Zingeving/levensrichting** — alleen via waarde "geloof", de geloofslaag-toggle en kinderwens. Een spel over toekomst/betekenis/roeping zou dit echt vullen.
- **Zorgvuldigheid/betrouwbaarheid** — gemeten via trouw-waarde en intentie, maar niet via gedrag (afspraken nakomen, plannen). Een spel over afspraken/betrouwbaarheid zou helpen.
- **Verbinding/affectie** — warmte hangt nu af van gekozen warmte-waarden; geen spel meet genegenheid/affectie direct.

Reeds opgevuld in deze ronde: geloofslaag + kinderwens → Zingeving; oude-eik-rol "verbinder" + trefwoord "warm" → Verbinding.
