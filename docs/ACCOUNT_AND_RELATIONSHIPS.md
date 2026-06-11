# Accounts, relaties en toegang

## Eigendom

- Een account bezit het persoonlijke profiel, aangekochte werelden en alle
  persoonlijke voortgang.
- Een relatie bezit gezamenlijke berichten, gezamenlijke spelruns en
  beltoestemming.
- Een account kan maximaal één actieve relatie hebben.
- Ontkoppelen zet `disconnectedAt` en maakt de relatie read-only. Berichten en
  resultaten blijven voor beide voormalige leden als privéarchief beschikbaar.
- Een nieuwe partner krijgt nooit toegang tot een oud relatiearchief.

## Authenticatie

- Wachtwoorden worden met `scrypt`, een unieke 128-bit salt en een 64-byte
  afgeleide sleutel opgeslagen.
- Access tokens leven 15 minuten.
- Refresh tokens zijn 48-byte willekeurige waarden, staan alleen in een
  `HttpOnly`, `SameSite=Strict` cookie en worden uitsluitend gehasht opgeslagen.
- Iedere refresh roteert het token; wachtwoordherstel trekt alle refresh tokens
  van het account in.
- Verificatie- en herstelcodes zijn eenmalig, gehasht opgeslagen en verlopen
  respectievelijk na 24 uur en 1 uur.
- Lokale ontwikkeling schrijft e-mail naar `/api/dev/mail-outbox`. Productie
  moet deze outbox via een mailworker afleveren en mag het dev-endpoint niet
  aanbieden.

## Chat

- Chat is pas beschikbaar wanneer een actieve relatie exact twee leden heeft.
- Zowel REST als Socket.IO controleren lidmaatschap en actieve relatiestatus.
- `clientId` is per relatie uniek, zodat retries geen dubbele berichten maken.
- Na ontkoppeling is het archief alleen-lezen.

## Bellen

Bellen volgt de oorspronkelijke serverregels:

- 30 minuten gelijktijdig online;
- minimaal 10 berichten van ieder lid;
- minimaal 5 unieke gezamenlijke ontdekkingen;
- expliciete toestemming van beide leden.

Na weigering geldt 30 minuten bedenktijd. Ieder lid kan de toestemming later
weer intrekken. WebRTC-signaling wordt server-side geweigerd zolang bellen niet
is vrijgegeven.

## Werelden en betalingen

- Wereld 2, 3, 4 en 5 vereisen 5, 10, 15 en 20 unieke ontdekkingen.
- De vorige wereld moet geopend zijn.
- Voortgang en aankoop zijn afzonderlijke voorwaarden.
- Aankopen horen bij het persoonlijke account en blijven na ontkoppeling
  bestaan.
- De huidige lokale knop registreert een testtransactie. Voor productie mag
  `WorldPurchase` uitsluitend vanuit een geverifieerde betaalprovider-webhook
  worden aangemaakt; nooit rechtstreeks op basis van een clientclaim.
