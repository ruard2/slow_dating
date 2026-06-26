export const KWALITEITEN_ALL = [
  'Zorgzaam', 'Eerlijk', 'Enthousiast', 'Geduldig', 'Empathisch',
  'Betrouwbaar', 'Creatief', 'Nieuwsgierig', 'Loyaal', 'Doorzetter',
  'Optimistisch', 'Directief', 'Daadkrachtig', 'Spontaan', 'Sensitief',
  'Gedreven', 'Bescheiden', 'Rustig', 'Humoristisch', 'Onafhankelijk',
  'Hartelijk', 'Analytisch', 'Flexibel', 'Organisatietalent', 'Rechtvaardig',
  'Perfectionistisch', 'Avontuurlijk', 'Behulpzaam', 'Nuchter', 'Inspirerend',
];

export const ALLERGIEËN_ALL = [
  'Passiviteit', 'Oneerlijkheid', 'Onverschilligheid', 'Onbetrouwbaarheid', 'Negativiteit',
  'Chaos', 'Oppervlakkigheid', 'Arrogantie', 'Onrechtvaardigheid', 'Starheid',
  'Onduidelijkheid', 'Afstandelijkheid', 'Veeleisendheid', 'Omslachtigheid', 'Luiheid',
  'Regelzucht', 'Klagen', 'Eigenwijsheid', 'Neerbuigendheid', 'Ongeduld',
  'Wantrouwen', 'Onvolwassenheid', 'Bemoeizucht', 'Egoïsme', 'Dramatisch',
  'Bangheid', 'Gierigheid', 'Ongeduldigheid', 'Klagerigheid', 'Onbezonnenheid',
];

export const ICONS: Record<string, string> = {
  Zorgzaam: '🤲', Eerlijk: '🎯', Enthousiast: '🌟', Geduldig: '⏳', Empathisch: '💜',
  Betrouwbaar: '🔒', Creatief: '🎨', Nieuwsgierig: '🔍', Loyaal: '🤝', Doorzetter: '💪',
  Optimistisch: '☀️', Directief: '🧭', Daadkrachtig: '⚡', Spontaan: '🎉', Sensitief: '🌸',
  Gedreven: '🚀', Bescheiden: '🌿', Rustig: '🕊️', Humoristisch: '😄', Onafhankelijk: '🦅',
  Hartelijk: '❤️', Analytisch: '🔬', Flexibel: '🌊', Organisatietalent: '📋', Rechtvaardig: '⚖️',
  Perfectionistisch: '💎', Avontuurlijk: '🗺️', Behulpzaam: '🙌', Nuchter: '🪨', Inspirerend: '✨',
  Passiviteit: '😴', Oneerlijkheid: '🎭', Onverschilligheid: '🥶', Onbetrouwbaarheid: '💔',
  Negativiteit: '⛈️', Chaos: '🌀', Oppervlakkigheid: '🫧', Arrogantie: '👑',
  Onrechtvaardigheid: '⚠️', Starheid: '🧱', Onduidelijkheid: '🌫️', Afstandelijkheid: '🧊',
  Veeleisendheid: '📏', Omslachtigheid: '🌿', Luiheid: '🛋️', Regelzucht: '📐',
  Klagen: '💬', Eigenwijsheid: '🦁', Neerbuigendheid: '👇', Ongeduld: '⏰',
  Wantrouwen: '🔐', Onvolwassenheid: '🎠', Bemoeizucht: '🔎', Egoïsme: '🪞',
  Dramatisch: '🎬', Bangheid: '🫤', Gierigheid: '🏦', Ongeduldigheid: '⏱️',
  Klagerigheid: '🌧️', Onbezonnenheid: '🎲',
};

export const VRAGEN: Record<string, [string, string, string]> = {
  Zorgzaam: [
    'Wanneer voel jij je het meest zorgzaam — voor wie of wat?',
    'Hoe herken jij dat iemand jouw zorg nodig heeft zonder dat ze het zeggen?',
    'Is er een moment geweest dat jouw zorgzaamheid je ook iets kostte?',
  ],
  Eerlijk: [
    'Wanneer is eerlijkheid voor jou moeilijk?',
    'Hoe ga jij om met eerlijkheid als het pijn kan doen bij de ander?',
    'Wat heeft eerlijkheid jou al eens gebracht, ook als het eng was?',
  ],
  Enthousiast: [
    'Waarover ben jij het meest enthousiast in je dagelijks leven?',
    'Hoe reageert jouw enthousiasme wanneer anderen minder meegenomen worden?',
    'Wat gebeurt er met jou als je enthousiasme niet gedeeld wordt?',
  ],
  Geduldig: [
    'In welke situatie is geduld voor jou het moeilijkst?',
    'Wat helpt jou om geduldig te blijven als het knijpt?',
    'Heb je ooit spijt gehad van te veel geduld — of juist te weinig?',
  ],
  Empathisch: [
    'Hoe weet jij dat je je echt inleeft — wat voel jij dan?',
    'Is er een risico aan veel empathie voor jou persoonlijk?',
    'Wanneer helpt jouw empathie iemand echt verder?',
  ],
  Betrouwbaar: [
    'Wat betekent betrouwbaarheid voor jou in een relatie?',
    'Hoe ga jij om als iemand jouw vertrouwen schendt?',
    'Wanneer heb jij jezelf op de proef gesteld wat betreft betrouwbaarheid?',
  ],
  Creatief: [
    'In welke vorm uit jouw creativiteit zich het meest?',
    'Wat blokkeert jouw creativiteit — en wat geeft het juist ruimte?',
    'Hoe heeft creativiteit jou al eens geholpen in een moeilijke situatie?',
  ],
  Nieuwsgierig: [
    'Waar ben jij de laatste tijd het meest nieuwsgierig naar geweest?',
    'Is nieuwsgierigheid voor jou ook weleens een belemmering?',
    'Wat wil jij ooit nog écht begrijpen of ontdekken?',
  ],
  Loyaal: [
    'Aan wie of wat ben jij het meest loyaal — en waarom?',
    'Hoe ga jij om als loyaliteit en eerlijkheid botsen?',
    'Heeft loyaliteit je ooit in een moeilijke positie gebracht?',
  ],
  Doorzetter: [
    'Wat geeft jou kracht om door te zetten als het zwaar wordt?',
    'Is er iets waarbij je doorzetten misschien te lang volhield?',
    'Hoe herken jij het verschil tussen volhouden en loslaten?',
  ],
  Optimistisch: [
    'Hoe blijf jij optimistisch als dingen tegenvallen?',
    'Wat is het risico van optimisme voor jou persoonlijk?',
    'Is er een situatie geweest waarbij jouw optimisme anderen heeft geholpen?',
  ],
  Directief: [
    'Wanneer neem jij graag de leiding — en wanneer liever niet?',
    'Hoe reageer jij als anderen jouw richting niet volgen?',
    'In welke situatie heeft jouw directheid het meeste opgeleverd?',
  ],
  Daadkrachtig: [
    'Wanneer voelt daadkracht voor jou als de juiste reactie?',
    'Is er ooit een moment geweest dat je te snel handelde?',
    'Wat geeft jou het vertrouwen om in actie te komen?',
  ],
  Spontaan: [
    'Wat is een spontaan moment dat je altijd bij zal blijven?',
    'Is spontaniteit ook weleens lastig voor mensen in jouw omgeving?',
    'Hoe vind jij balans tussen plannen en spontaan zijn?',
  ],
  Sensitief: [
    'Wat bedoel jij als jij jezelf sensitief noemt?',
    'Hoe ga jij om met prikkels of emoties die sterk binnenkomen?',
    'Heeft jouw sensitiviteit je ooit een voordeel gegeven dat anderen misten?',
  ],
  Gedreven: [
    'Waar kom jouw drijfveer vandaan — wat maakt jou gedreven?',
    'Heeft gedrevenheid weleens gezorgd voor spanning in jouw leven?',
    'Hoe weet jij wanneer genoeg ook echt genoeg is?',
  ],
  Bescheiden: [
    'Wanneer vind je het moeilijk om bescheiden te zijn?',
    'Is er een moment waarop bescheidenheid je belemmerde?',
    'Hoe zie jij het verschil tussen bescheidenheid en jezelf wegcijferen?',
  ],
  Rustig: [
    'Wat is voor jou nodig om je écht rustig te voelen?',
    'Hoe beïnvloedt jouw rust anderen in jouw omgeving?',
    'Is er een situatie waarbij jouw rust verkeerd begrepen werd?',
  ],
  Humoristisch: [
    'Wanneer gebruik jij humor — wat zit er dan achter?',
    'Is humor voor jou ook een manier om moeilijke dingen te vermijden?',
    'Wat is een moment waarop jouw humor perfect landde?',
  ],
  Onafhankelijk: [
    'Wat betekent onafhankelijkheid voor jou in een relatie?',
    'Is er spanning geweest tussen jouw onafhankelijkheid en verbinding met anderen?',
    'Wanneer heb je onafhankelijkheid moeten loslaten — en hoe voelde dat?',
  ],
  Hartelijk: [
    'Hoe uit jij jouw hartelijkheid naar mensen die je dierbaar zijn?',
    'Is hartelijkheid voor jou ook weleens te veel van jezelf vragen?',
    'Wanneer voelde jij je hartelijkheid het meest beantwoord?',
  ],
  Analytisch: [
    'In welke situaties helpt jouw analytisch denken het meest?',
    'Is er een nadeel aan altijd alles willen analyseren?',
    'Wanneer werkt analyseren eigenlijk tegen je?',
  ],
  Flexibel: [
    'Hoe ver gaat jouw flexibiliteit — waar zit een grens?',
    'Is er weleens een situatie waarbij meer flexibiliteit gevraagd werd dan je kon geven?',
    'Wat helpt jou om flexibel te blijven zonder jezelf te verliezen?',
  ],
  Organisatietalent: [
    'Wat organiseer jij het liefst — en wat liever niet?',
    'Hoe reageer jij als jouw organisatie niet gevolgd wordt?',
    'Heeft jouw organisatietalent je ooit echt gered in een lastige situatie?',
  ],
  Rechtvaardig: [
    'Wanneer voel jij onrechtvaardigheid het sterkst?',
    'Hoe uit jij jouw rechtvaardigheidsgevoel — ook als het ongemakkelijk is?',
    'Is er een prijs geweest die jij betaalde voor rechtvaardig zijn?',
  ],
  Perfectionistisch: [
    'Op welk vlak wil jij het meeste perfectie — en waarom dat vlak?',
    'Hoe gaat jouw perfectionisme om met fouten van jezelf of anderen?',
    'Wanneer heeft perfectionisme je belemmerd?',
  ],
  Avontuurlijk: [
    'Wat is het avontuurlijkste wat jij ooit gedaan hebt?',
    'Hoe ga jij om met mensen die minder avontuurlijk zijn?',
    'Is avontuur voor jou ook een manier om iets te vermijden?',
  ],
  Behulpzaam: [
    'Wanneer help jij graag — en wanneer kost helpen jou te veel?',
    'Is er een grens aan jouw behulpzaamheid die je geleerd hebt te bewaken?',
    'Wat geeft jou het gevoel dat je echt geholpen hebt?',
  ],
  Nuchter: [
    'Hoe uit jouw nuchterheid zich in emotionele situaties?',
    'Is nuchterheid weleens als koud of afstandelijk gezien terwijl je dat niet bedoelde?',
    'Wanneer helpt jouw nuchterheid anderen om helder te blijven?',
  ],
  Inspirerend: [
    'Wat inspireert jou zelf het meest?',
    'Hoe weet jij dat jij iemand geïnspireerd hebt?',
    'Wanneer voel je de verantwoordelijkheid van inspirerend zijn?',
  ],
};

export const ALLERGIE_VRAGEN: Record<string, [string, string, string]> = {
  Passiviteit: [
    'Wanneer irriteert passiviteit jou het meest?',
    'Herken jij soms passiviteit ook in jezelf?',
    'Wat doet passiviteit met jou als je het tegenkomt?',
  ],
  Oneerlijkheid: [
    'Hoe reageer jij als je merkt dat iemand niet eerlijk is?',
    'Is er een situatie geweest waarbij oneerlijkheid jou echt raakte?',
    'Wat maakt oneerlijkheid voor jou zo sterk voelbaar?',
  ],
  Onverschilligheid: [
    'Wat doet onverschilligheid met jou?',
    'In welke situatie stoor jij je hier het meest aan?',
    'Hoe reageer jij op iemand die onverschillig lijkt?',
  ],
  Onbetrouwbaarheid: [
    'Wat is het ergste dat onbetrouwbaarheid je ooit gekost heeft?',
    'Hoe herstelt jij vertrouwen nadat iemand onbetrouwbaar bleek?',
    'Merk jij onbetrouwbaarheid snel op, of soms pas later?',
  ],
  Negativiteit: [
    'Hoe bescherm jij jezelf tegen negativiteit van anderen?',
    'Is er een vorm van negativiteit die jij minder erg vindt dan andere?',
    'Wat doe jij als je in een negatieve sfeer terecht komt?',
  ],
  Chaos: [
    'Welke soort chaos stoort jou het meest?',
    'Hoe reageer jij in een chaotische situatie?',
    'Is er ook een vorm van chaos die jij kunt accepteren?',
  ],
  Oppervlakkigheid: [
    'Wanneer voel jij dat een gesprek oppervlakkig blijft?',
    'Hoe reageer jij op oppervlakkigheid — ga jij de diepte in of haak je af?',
    'Is er een situatie waarbij jij zelf oppervlakkig bleef?',
  ],
  Arrogantie: [
    'Wat precies aan arrogantie irriteert jou het meest?',
    'Hoe ga jij om met arrogante mensen in jouw omgeving?',
    'Is er een verschil voor jou tussen arrogantie en zelfvertrouwen?',
  ],
  Onrechtvaardigheid: [
    'Hoe reageer jij als jij iets onrechtvaardigs ziet?',
    'Kun je een voorbeeld geven van onrechtvaardigheid die jou sterk raakte?',
    'Hoe ga jij om met onrechtvaardigheid als jij er niets aan kunt doen?',
  ],
  Starheid: [
    'Wanneer stoort starheid jou het meest?',
    'Heb jij zelf ook ervaringen met star zijn geweest?',
    'Hoe ga jij het gesprek aan met iemand die star is?',
  ],
  Onduidelijkheid: [
    'Welke soort onduidelijkheid frustreert jou het meest?',
    'Hoe reageer jij als iemand onduidelijk communiceert?',
    'Is er een situatie waarin jij zelf onduidelijk was?',
  ],
  Afstandelijkheid: [
    'Hoe herken jij afstandelijkheid bij anderen?',
    'Wat doe jij als iemand afstandelijk wordt?',
    'Is er een reden dat afstandelijkheid jou zo triggert?',
  ],
  Veeleisendheid: [
    'Wanneer voel jij iemand als veeleisend?',
    'Hoe ga jij om met veeleisende mensen in jouw directe omgeving?',
    'Herken jij soms veeleisendheid ook in jezelf?',
  ],
  Omslachtigheid: [
    'Wanneer stoort omslachtigheid jou het meest?',
    'Hoe reageer jij als iemand omslachtig communiceert?',
    'Hoe ga jij zelf om met complexe situaties — ben jij dan ook soms omslachtig?',
  ],
  Luiheid: [
    'Wat bedoel jij precies als je luiheid zegt — wat is voor jou de grens?',
    'Hoe ga jij om met iemand die jij als lui ervaart?',
    'Is er ook een situatie waarbij luiheid eigenlijk iets anders was?',
  ],
  Regelzucht: [
    'Welke regels ergeren jou — en welke begrijp jij wel?',
    'Hoe reageer jij op iemand die heel veel regels stelt?',
    'Is regelzucht voor jou ook een vorm van controle?',
  ],
  Klagen: [
    'Wat is het verschil voor jou tussen klagen en jezelf uitspreken?',
    'Hoe ga jij om met iemand die veel klaagt?',
    'Herken jij soms klagen in jezelf?',
  ],
  Eigenwijsheid: [
    'Wat precies aan eigenwijsheid stoort jou?',
    'Is er een verschil voor jou tussen eigenwijsheid en een sterke mening?',
    'Hoe ga jij om met iemand die niet luistert?',
  ],
  Neerbuigendheid: [
    'Wanneer voel jij neerbuigendheid het sterkst?',
    'Hoe reageer jij als iemand neerbuigend doet?',
    'Is er een situatie waarbij neerbuigendheid jou echt heeft geraakt?',
  ],
  Ongeduld: [
    'Wanneer stoort ongeduld van een ander jou het meest?',
    'Herken jij ongeduld ook in jezelf — in welke situaties?',
    'Hoe ga jij om als iemand ongeduldig wordt richting jou?',
  ],
  Wantrouwen: [
    'Hoe herken jij wantrouwen bij iemand anders?',
    'Hoe ga jij om met iemand die jou wantrouwt zonder reden?',
    'Is wantrouwen voor jou ooit terecht geweest?',
  ],
  Onvolwassenheid: [
    'Wat bedoel jij precies als je onvolwassenheid zegt?',
    'In welke situatie irriteert onvolwassenheid jou het meest?',
    'Is er ook een kant van onvolwassenheid die jij waardeert?',
  ],
  Bemoeizucht: [
    'Waar ligt de grens voor jou tussen betrokkenheid en bemoeizucht?',
    'Hoe reageer jij als iemand zich te veel bemoeit?',
    'Herken jij soms bemoeizucht ook in jezelf?',
  ],
  Egoïsme: [
    'Wat is voor jou de grens tussen voor jezelf zorgen en egoïsme?',
    'Hoe ga jij om met iemand die jij als egoïstisch ervaart?',
    'Is er een situatie geweest waarbij jij zelf egoïstischer was dan je wilde?',
  ],
  Dramatisch: [
    'Wat doet dramatisch gedrag met jou?',
    'Hoe ga jij om met iemand die snel dramatisch reageert?',
    'Is er een verschil voor jou tussen emotioneel en dramatisch?',
  ],
  Bangheid: [
    'Wanneer ervaar jij bangheid bij iemand als remmend?',
    'Hoe ga jij om met mensen die door angst niet in actie komen?',
    'Is er ook een kant van voorzichtigheid die jij wel waardeert?',
  ],
  Gierigheid: [
    'Hoe gaat jij om met gierigheid in jouw omgeving?',
    'Is er een situatie geweest waarbij gierigheid jou echt heeft geraakt?',
    'Wat is voor jou het verschil tussen zuinig zijn en gierig zijn?',
  ],
  Ongeduldigheid: [
    'Wanneer stoort ongeduldigheid jou het meest?',
    'Hoe ga jij om met iemand die altijd haast heeft?',
    'Herken jij ongeduldigheid ook wel eens in jezelf?',
  ],
  Klagerigheid: [
    'Wat is het verschil voor jou tussen klagen en klagerigheid?',
    'Hoe reageer jij als iemand voortdurend klaagt?',
    'Is er een situatie waarbij klagerigheid jou echt heeft uitgeput?',
  ],
  Onbezonnenheid: [
    'Wanneer stoort onbezonnenheid jou het meest?',
    'Hoe ga jij om met iemand die impulsief handelt?',
    'Is er ook een kant van onbezonnenheid die jij soms wel aantrekkelijk vindt?',
  ],
};
