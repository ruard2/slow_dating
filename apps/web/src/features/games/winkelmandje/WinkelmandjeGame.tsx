import { useEffect, useMemo, useRef, useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import {
  conversationCards,
  faithDesires,
  faithPractices,
  faithWeights,
  partnerReactions,
  shopDays,
  shopInterruptions,
  shopNeeds,
  shopProducts,
  supportLines,
} from "./content";
import type {
  ShopDecision,
  WinkelmandjeAction,
  WinkelmandjeState,
} from "./contracts";
import {
  cartProductIds,
  cartTotal,
  hiddenBudgetFor,
  needsBreakdown,
  selectShopSession,
} from "./reducer";
import styles from "./WinkelmandjeGame.module.css";

function Pause({
  pauseGame,
  pending,
}: {
  pauseGame: (() => void) | undefined;
  pending: boolean;
}) {
  if (!pauseGame) return null;
  return (
    <button
      className={styles.pause}
      disabled={pending}
      onClick={pauseGame}
      type="button"
    >
      Bewaar en ga later verder
    </button>
  );
}

function Waiting({
  partnerName,
  pauseGame,
  pending,
}: {
  partnerName: string;
  pauseGame: (() => void) | undefined;
  pending: boolean;
}) {
  return (
    <section className={styles.game}>
      <div className={styles.waiting}>
        <span className={styles.kicker}>De winkel blijft even open</span>
        <h1>Jouw gesloten pakketjes staan bij de kassa</h1>
        <p>De kassabon rolt uit zodra {partnerName} ook klaar is.</p>
        <Pause pauseGame={pauseGame} pending={pending} />
      </div>
    </section>
  );
}

function ProductCard({
  interruption,
  onDecision,
  pending,
  product,
}: {
  interruption: string;
  onDecision(decision: ShopDecision): void;
  pending: boolean;
  product: (typeof shopProducts)[number];
}) {
  const startX = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  return (
    <article
      className={styles.productCard}
      onPointerCancel={() => {
        startX.current = null;
        setDragX(0);
      }}
      onPointerDown={(event) => {
        if (pending) return;
        startX.current = event.clientX;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (startX.current === null) return;
        setDragX(Math.max(-150, Math.min(150, event.clientX - startX.current)));
      }}
      onPointerUp={() => {
        if (dragX < -70) onDecision("pass");
        else if (dragX > 70) onDecision("cart");
        startX.current = null;
        setDragX(0);
      }}
      style={{
        transform: `translateX(${dragX}px) rotate(${dragX / 24}deg)`,
      }}
    >
      <div className={styles.adBubble}>{interruption}</div>
      <span className={styles.productIcon}>{product.icon}</span>
      <span className={styles.secretPrice}>prijs verborgen</span>
      <h2>{product.title}</h2>
      <p>{product.pitch}</p>
      <div className={styles.swipeHints}>
        <span>← voorbij</span>
        <span>in mandje →</span>
      </div>
      <div className={styles.cardActions}>
        <button
          disabled={pending}
          onClick={(event) => {
            event.stopPropagation();
            onDecision("pass");
          }}
          onPointerDown={(event) => event.stopPropagation()}
          type="button"
        >
          Voorbij
        </button>
        <button
          disabled={pending}
          onClick={(event) => {
            event.stopPropagation();
            onDecision("save");
          }}
          onPointerDown={(event) => event.stopPropagation()}
          type="button"
        >
          Bewaren
        </button>
        <button
          disabled={pending}
          onClick={(event) => {
            event.stopPropagation();
            onDecision("cart");
          }}
          onPointerDown={(event) => event.stopPropagation()}
          type="button"
        >
          In mandje
        </button>
      </div>
    </article>
  );
}

function Receipt({
  personId,
  title,
  state,
}: {
  personId: string;
  title: string;
  state: WinkelmandjeState;
}) {
  const cart = cartProductIds(state, personId);
  const total = cartTotal(state, personId);
  const budget = state.budgetByPerson[personId] ?? 0;
  const breakdown = needsBreakdown(state, personId);
  return (
    <article className={styles.receipt}>
      <span className={styles.receiptTop}>{title}</span>
      <h2>{cart.length} aankopen · €{total}</h2>
      <p>
        Verborgen ruimte: €{budget} ·{" "}
        <strong>{total > budget ? `€${total - budget} te veel` : `€${budget - total} over`}</strong>
      </p>
      <div className={styles.receiptItems}>
        {cart.map((id) => {
          const product = shopProducts.find((item) => item.id === id);
          return product ? (
            <div key={id}>
              <span>{product.icon}</span>
              <b>{product.title}</b>
              <em>€{product.price}</em>
            </div>
          ) : null;
        })}
      </div>
      <div className={styles.needBars}>
        {shopNeeds.map((need) => (
          <label key={need.id}>
            <span>{need.icon} {need.title}</span>
            <i>
              <b
                style={{
                  width: `${Math.min(100, ((breakdown[need.id] ?? 0) / Math.max(total, 1)) * 100)}%`,
                }}
              />
            </i>
            <small>€{breakdown[need.id] ?? 0}</small>
          </label>
        ))}
      </div>
    </article>
  );
}

export function WinkelmandjeGame({
  christianLayer,
  dispatch,
  installationId,
  memberIds,
  openCall,
  openChat,
  partnerName,
  pauseGame,
  pending,
  state,
}: GameComponentProps<WinkelmandjeState, WinkelmandjeAction>) {
  const [started, setStarted] = useState(
    () => Boolean(state.dayId || state.decisionsByPerson[installationId]),
  );
  const [selectedPartnerProducts, setSelectedPartnerProducts] = useState<string[]>([]);
  const [giftIntention, setGiftIntention] = useState("");
  const [faith, setFaith] = useState({
    goodDesire: "",
    heavyDesire: "",
    practice: "",
    reflection: "",
  });
  const [supportText, setSupportText] = useState(state.supportLine?.text ?? "");
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const day = shopDays.find((item) => item.id === state.dayId);
  const decisions = state.decisionsByPerson[installationId] ?? {};
  const currentProductId = state.productIds.find((id) => !decisions[id]);
  const currentProduct = shopProducts.find((item) => item.id === currentProductId);
  const decidedCount = Object.keys(decisions).length;
  const ownSubmitted = state.submittedIds.includes(installationId);
  const bothSubmitted = memberIds.every((id) => state.submittedIds.includes(id));
  const ownCart = cartProductIds(state, installationId);
  const ownMeaningProducts = ownCart.slice(0, 2);
  const ownMeaningsDone = state.meaningsSubmittedIds.includes(installationId);
  const bothMeaningsDone = memberIds.every((id) =>
    state.meaningsSubmittedIds.includes(id),
  );
  const partnerTotal = cartTotal(state, partnerId);
  const partnerBudget = state.budgetByPerson[partnerId] ?? 0;
  const partnerOver = partnerTotal > partnerBudget;
  const partnerCart = cartProductIds(state, partnerId);
  const availableGiftProducts = state.productIds
    .map((id) => shopProducts.find((product) => product.id === id))
    .filter((product): product is (typeof shopProducts)[number] => Boolean(product))
    .filter((product) => !partnerCart.includes(product.id));
  const ownPartnerActionDone = Object.values(state.partnerActionsByTarget).some(
    (action) => action.actorId === installationId,
  );
  const bothPartnerActionsDone = memberIds.every(
    (id) => Boolean(state.partnerActionsByTarget[id]),
  );
  const ownReactionDone = Boolean(state.reactionsByPerson[installationId]);
  const bothReactionsDone = memberIds.every((id) => state.reactionsByPerson[id]);
  const ownConversation = state.conversationDoneByPerson[installationId] ?? [];
  const conversationIndex = conversationCards.findIndex(
    (_, index) => !ownConversation.includes(index),
  );
  const bothConversationsDone = memberIds.every(
    (id) => (state.conversationDoneByPerson[id] ?? []).length >= conversationCards.length,
  );
  const ownFaithDone = state.faithSubmittedIds.includes(installationId);
  const bothFaithDone =
    !christianLayer ||
    memberIds.every((id) => state.faithSubmittedIds.includes(id));
  const supportConfirmed = state.supportConfirmedIds.includes(installationId);
  const allSupportConfirmed =
    Boolean(state.supportLine) &&
    memberIds.every((id) => state.supportConfirmedIds.includes(id));

  useEffect(() => {
    if (!started || state.dayId) return;
    const session = selectShopSession(
      `${installationId}:${Date.now()}:${Math.random()}`,
    );
    void dispatch({
      type: "winkelmandje.session.started",
      actorId: installationId,
      ...session,
      budget: hiddenBudgetFor(`${installationId}:${session.dayId}`),
    });
  }, [dispatch, installationId, started, state.dayId]);

  useEffect(() => {
    setSupportText(state.supportLine?.text ?? "");
  }, [state.supportLine?.text]);

  const interruption = useMemo(
    () =>
      shopInterruptions[
        Math.max(0, state.productIds.indexOf(currentProductId ?? "")) %
          shopInterruptions.length
      ]!,
    [currentProductId, state.productIds],
  );

  if (!started) {
    return (
      <section className={styles.game}>
        <div className={styles.intro}>
          <span className={styles.kicker}>Het Winkelmandje</span>
          <h1>Wat leg je in je mandje na een lange dag?</h1>
          <p>
            Loop binnen, volg je eerste impuls en ontdek bij de kassa wat er
            eigenlijk in je mandje belandde.
          </p>
          <figure>
            <img
              alt="Een warm verlichte winkel langs het tuinpad, vol reizen, gereedschap, comfort en pakketjes"
              src="/assets/winkelmandje-scene.png"
            />
          </figure>
          <div className={styles.introRules}>
            <span>← voorbij</span>
            <span>bewaren</span>
            <span>in mandje →</span>
          </div>
          <button className={styles.primary} onClick={() => setStarted(true)} type="button">
            Loop de winkel binnen
          </button>
        </div>
      </section>
    );
  }

  if (!state.dayId || !day) {
    return <Waiting partnerName={partnerName} pauseGame={pauseGame} pending={pending} />;
  }

  if (!ownSubmitted && currentProduct) {
    return (
      <section className={styles.game}>
        <div className={styles.shop}>
          <div className={styles.dayCard}>
            <span className={styles.kicker}>De dag die je meeneemt</span>
            <h1>{day.title}</h1>
            <p>{day.story}</p>
            <small>{day.whisper}</small>
          </div>
          <div className={styles.progress}>
            <i style={{ width: `${(decidedCount / state.productIds.length) * 100}%` }} />
            <span>Je loopt door de winkel · prijzen en aantallen verborgen</span>
          </div>
          <ProductCard
            interruption={interruption}
            onDecision={(decision) =>
              dispatch({
                type: "winkelmandje.product.decided",
                actorId: installationId,
                productId: currentProduct.id,
                decision,
              })
            }
            pending={pending}
            product={currentProduct}
          />
          <Pause pauseGame={pauseGame} pending={pending} />
        </div>
      </section>
    );
  }

  if (!ownSubmitted) {
    return (
      <section className={styles.game}>
        <div className={styles.checkout}>
          <span className={styles.kicker}>De winkel gaat sluiten</span>
          <h1>Je pakketjes zijn dichtgeplakt</h1>
          <div className={styles.closedPackages}>
            {Array.from({ length: 7 }, (_, index) => <span key={index}>📦</span>)}
          </div>
          <p>
            Je ziet nog niet hoeveel je kocht of wat het kostte. Bij de
            gezamenlijke kassa gaat alles tegelijk open.
          </p>
          <div className={styles.actions}>
            <button
              className={styles.primary}
              disabled={pending}
              onClick={() =>
                dispatch({
                  type: "winkelmandje.shopping.submitted",
                  actorId: installationId,
                  budget: hiddenBudgetFor(`${installationId}:${state.dayId}`),
                })
              }
              type="button"
            >
              Zet mijn pakketjes bij de kassa
            </button>
            <Pause pauseGame={pauseGame} pending={pending} />
          </div>
        </div>
      </section>
    );
  }

  if (!bothSubmitted) {
    return <Waiting partnerName={partnerName} pauseGame={pauseGame} pending={pending} />;
  }

  if (!ownMeaningsDone) {
    if (!ownMeaningProducts.length) {
      return (
        <section className={styles.game}>
          <div className={styles.checkpoint}>
            <span className={styles.kicker}>De kassabon</span>
            <h1>Vandaag kocht je niets</h1>
            <p>
              Ook dat is informatie, geen score. Misschien trok niets, misschien
              hield je afstand, misschien had deze dag niets uit een winkel nodig.
            </p>
            <button
              className={styles.primary}
              onClick={() =>
                dispatch({
                  type: "winkelmandje.meanings.submitted",
                  actorId: installationId,
                })
              }
              type="button"
            >
              Bekijk onze kassabonnen
            </button>
          </div>
        </section>
      );
    }
    const unresolvedId = ownMeaningProducts.find(
      (id) => !state.meaningsByPerson[installationId]?.[id],
    );
    if (unresolvedId) {
      const product = shopProducts.find((item) => item.id === unresolvedId)!;
      return (
        <section className={styles.game}>
          <div className={styles.meaning}>
            <span className={styles.kicker}>De prijs is niet het hele verhaal</span>
            <span className={styles.meaningIcon}>{product.icon}</span>
            <h1>{product.title}</h1>
            <p>Wat beloofde dit je op deze specifieke dag?</p>
            <div className={styles.needChoices}>
              {shopNeeds.map((need) => (
                <button
                  key={need.id}
                  onClick={() =>
                    dispatch({
                      type: "winkelmandje.meaning.chosen",
                      actorId: installationId,
                      productId: product.id,
                      meaning: need.id,
                    })
                  }
                  type="button"
                >
                  <span>{need.icon}</span>
                  <b>{need.title}</b>
                  <small>{need.description}</small>
                </button>
              ))}
            </div>
          </div>
        </section>
      );
    }
    return (
      <section className={styles.game}>
        <div className={styles.receiptPage}>
          <span className={styles.kicker}>De grote onthulling</span>
          <h1>Wie gaf waaraan hoeveel uit?</h1>
          <div className={styles.receiptGrid}>
            <Receipt personId={installationId} state={state} title="Jouw kassabon" />
            <Receipt personId={partnerId} state={state} title={`Kassabon van ${partnerName}`} />
          </div>
          <button
            className={styles.primary}
            onClick={() =>
              dispatch({
                type: "winkelmandje.meanings.submitted",
                actorId: installationId,
              })
            }
            type="button"
          >
            Naar de gezamenlijke kassa
          </button>
        </div>
      </section>
    );
  }

  if (!bothMeaningsDone) {
    return <Waiting partnerName={partnerName} pauseGame={pauseGame} pending={pending} />;
  }

  if (!ownPartnerActionDone) {
    const requiredReturn = Math.max(0, partnerTotal - partnerBudget);
    const selectedValue = selectedPartnerProducts.reduce(
      (sum, id) => sum + (shopProducts.find((p) => p.id === id)?.price ?? 0),
      0,
    );
    const products = partnerOver
      ? partnerCart
          .map((id) => shopProducts.find((product) => product.id === id))
          .filter(
            (product): product is (typeof shopProducts)[number] =>
              Boolean(product),
          )
      : availableGiftProducts;
    return (
      <section className={styles.game}>
        <div className={styles.partnerDesk}>
          <span className={styles.kicker}>De gezamenlijke kassa</span>
          <h1>
            {partnerOver
              ? `Wat geef je voor ${partnerName} terug?`
              : `Wat geef je ${partnerName} uit de ruimte die overbleef?`}
          </h1>
          <p>
            {partnerOver
              ? `${partnerName} kwam €${requiredReturn} boven de verborgen ruimte uit. Kies zelf welke pakketjes retour gaan. Het goedkoopste of duurste is niet automatisch het zorgvuldigste.`
              : `${partnerName} bleef binnen de verborgen ruimte en hield €${partnerBudget - partnerTotal} over. Daarom mag jij één extra product kiezen dat bij de ander past. Dit cadeau telt niet opnieuw mee bij de kassa.`}
          </p>
          <div className={styles.partnerProducts}>
            {products.map((product) => {
              const active = selectedPartnerProducts.includes(product.id);
              return (
                <button
                  data-active={active}
                  key={product.id}
                  onClick={() =>
                    setSelectedPartnerProducts((current) =>
                      partnerOver
                        ? active
                          ? current.filter((id) => id !== product.id)
                          : [...current, product.id]
                        : [product.id],
                    )
                  }
                  type="button"
                >
                  <span>{product.icon}</span>
                  <b>{product.title}</b>
                  <em>€{product.price}</em>
                </button>
              );
            })}
          </div>
          {!partnerOver && selectedPartnerProducts.length > 0 && (
            <div className={styles.intentions}>
              <p>Wat gun je de ander hiermee?</p>
              {shopNeeds.map((need) => (
                <button
                  data-active={giftIntention === need.id}
                  key={need.id}
                  onClick={() => setGiftIntention(need.id)}
                  type="button"
                >
                  {need.icon} {need.title}
                </button>
              ))}
            </div>
          )}
          <button
            className={styles.primary}
            disabled={
              pending ||
              (partnerOver
                ? selectedValue < requiredReturn
                : selectedPartnerProducts.length !== 1 || !giftIntention)
            }
            onClick={() =>
              dispatch({
                type: "winkelmandje.partner-action.submitted",
                actorId: installationId,
                targetId: partnerId,
                kind: partnerOver ? "return" : "gift",
                productIds: selectedPartnerProducts,
                intention: giftIntention,
              })
            }
            type="button"
          >
            {partnerOver ? `Retourneer voor €${selectedValue}` : "Pak dit cadeau in"}
          </button>
        </div>
      </section>
    );
  }

  if (!bothPartnerActionsDone) {
    return <Waiting partnerName={partnerName} pauseGame={pauseGame} pending={pending} />;
  }

  if (!ownReactionDone) {
    const partnerAction = state.partnerActionsByTarget[installationId]!;
    return (
      <section className={styles.game}>
        <div className={styles.reveal}>
          <span className={styles.kicker}>
            {partnerAction.kind === "return" ? "Het retourpakket" : "Je extra pakket"}
          </span>
          <h1>
            {partnerAction.kind === "return"
              ? `${partnerName} koos dit om terug te geven`
              : `${partnerName} koos dit voor jou`}
          </h1>
          <div className={styles.revealProducts}>
            {partnerAction.productIds.map((id) => {
              const product = shopProducts.find((item) => item.id === id);
              return product ? (
                <article key={id}>
                  <span>{product.icon}</span>
                  <b>{product.title}</b>
                  <small>€{product.price}</small>
                </article>
              ) : null;
            })}
          </div>
          {partnerAction.intention && (
            <p>
              Bedoeling:{" "}
              <strong>
                {shopNeeds.find((need) => need.id === partnerAction.intention)?.title}
              </strong>
            </p>
          )}
          <div className={styles.reactions}>
            {partnerReactions.map((reaction) => (
              <button
                key={reaction}
                onClick={() =>
                  dispatch({
                    type: "winkelmandje.reaction.chosen",
                    actorId: installationId,
                    reaction,
                  })
                }
                type="button"
              >
                {reaction}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!bothReactionsDone) {
    return <Waiting partnerName={partnerName} pauseGame={pauseGame} pending={pending} />;
  }

  if (conversationIndex >= 0) {
    const index = Math.max(0, conversationIndex);
    return (
      <section className={styles.game}>
        <div className={styles.conversation}>
          <span className={styles.kicker}>
            Gesprekskaart {index + 1} van {conversationCards.length}
          </span>
          <h1>{conversationCards[index]}</h1>
          <p>
            Praat hier kort hardop over. Jullie hoeven het niet eens te worden;
            probeer vooral te begrijpen wat zorg, vrijheid en gezien worden
            voor ieder betekenen.
          </p>
          <div className={styles.actions}>
            <button
              className={styles.primary}
              onClick={() =>
                dispatch({
                  type: "winkelmandje.conversation.done",
                  actorId: installationId,
                  cardIndex: index,
                })
              }
              type="button"
            >
              Besproken · volgende kaart
            </button>
            <button
              className={styles.secondary}
              onClick={() => openChat?.(conversationCards[index])}
              type="button"
            >
              Open in chat
            </button>
            <button className={styles.secondary} onClick={() => openCall?.()} type="button">
              Bel elkaar
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!bothConversationsDone) {
    return <Waiting partnerName={partnerName} pauseGame={pauseGame} pending={pending} />;
  }

  if (christianLayer && !ownFaithDone) {
    const complete = faith.goodDesire && faith.heavyDesire && faith.practice;
    return (
      <section className={styles.game}>
        <div className={styles.faith}>
          <span className={styles.kicker}>Christelijke verdieping</span>
          <h1>Welk verlangen mocht bestaan—and wat moest te veel dragen?</h1>
          <p>
            Verlangen is niet de vijand. Avontuur, schoonheid, rust en
            vakmanschap kunnen goede gaven zijn. De vraag is wat een product
            vanavond voor je moest oplossen.
          </p>
          {([
            { title: "Welk goed verlangen herken je?", options: faithDesires, key: "goodDesire" },
            { title: "Welk verlangen kreeg mogelijk te veel gewicht?", options: faithWeights, key: "heavyDesire" },
            { title: "Welke oefening past bij jou?", options: faithPractices, key: "practice" },
          ] as const).map((section) => (
            <div className={styles.faithCards} key={section.key}>
              <h2>{section.title}</h2>
              {section.options.map((option) => (
                <button
                  data-active={faith[section.key] === option}
                  key={option}
                  onClick={() =>
                    setFaith((current) => ({
                      ...current,
                      [section.key]: option,
                    }))
                  }
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          ))}
          <label>
            <span>Optioneel: wat hoopte je van bezit te ontvangen dat bezit niet lang kan dragen?</span>
            <textarea
              maxLength={500}
              onChange={(event) =>
                setFaith((current) => ({ ...current, reflection: event.target.value }))
              }
              rows={3}
              value={faith.reflection}
            />
          </label>
          <button
            className={styles.primary}
            disabled={!complete || pending}
            onClick={() =>
              dispatch({
                type: "winkelmandje.faith.submitted",
                actorId: installationId,
                ...faith,
              })
            }
            type="button"
          >
            Bewaar deze verdieping
          </button>
        </div>
      </section>
    );
  }

  if (!bothFaithDone) {
    return <Waiting partnerName={partnerName} pauseGame={pauseGame} pending={pending} />;
  }

  if (!allSupportConfirmed) {
    return (
      <section className={styles.game}>
        <div className={styles.support}>
          <span className={styles.kicker}>Eén zin voor later</span>
          <h1>Geen koopregel—wel een manier om nieuwsgierig te blijven</h1>
          <div className={styles.supportOptions}>
            {supportLines.map((line) => (
              <button
                data-active={supportText === line}
                key={line}
                onClick={() => setSupportText(line)}
                type="button"
              >
                {line}
              </button>
            ))}
          </div>
          <label>
            <span>Of jullie eigen zin</span>
            <input
              maxLength={240}
              onChange={(event) => setSupportText(event.target.value)}
              value={supportText}
            />
          </label>
          {state.supportLine && (
            <blockquote>{state.supportLine.text}</blockquote>
          )}
          <div className={styles.actions}>
            <button
              className={styles.secondary}
              disabled={!supportText.trim() || pending}
              onClick={() =>
                dispatch({
                  type: "winkelmandje.support.proposed",
                  actorId: installationId,
                  text: supportText,
                })
              }
              type="button"
            >
              {state.supportLine ? "Werk de zin bij" : "Stel deze zin voor"}
            </button>
            <button
              className={styles.primary}
              disabled={!state.supportLine || supportConfirmed || pending}
              onClick={() =>
                dispatch({
                  type: "winkelmandje.support.confirmed",
                  actorId: installationId,
                })
              }
              type="button"
            >
              {supportConfirmed ? "Jij hebt bevestigd" : "Deze zin helpt mij"}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.game}>
      <div className={styles.end}>
        <span className={styles.kicker}>De winkel is dicht</span>
        <h1>Jullie zagen meer dan pakketjes</h1>
        <p>
          De uitkomst zegt niet wie verstandig, gul of materialistisch is. Hij
          laat zien wat deze dag aantrekkelijk maakte, hoe jullie elkaar
          begrensden of iets gunden en waar jullie elkaar verrassend goed zagen.
        </p>
        <div className={styles.finalReceipts}>
          <Receipt personId={installationId} state={state} title="Jij" />
          <Receipt personId={partnerId} state={state} title={partnerName} />
        </div>
        <div className={styles.partnerOutcome}>
          {memberIds.map((targetId) => {
            const action = state.partnerActionsByTarget[targetId];
            if (!action) return null;
            const targetName =
              targetId === installationId ? "jou" : partnerName;
            const actorName =
              action.actorId === installationId ? "Jij" : partnerName;
            const productTitles = action.productIds
              .map(
                (id) =>
                  shopProducts.find((product) => product.id === id)?.title ??
                  id,
              )
              .join(", ");
            return (
              <article key={targetId}>
                <span>{action.kind === "return" ? "↩️" : "🎁"}</span>
                <div>
                  <b>
                    {actorName} koos voor {targetName}
                  </b>
                  <p>
                    {action.kind === "return"
                      ? `Retour: ${productTitles}`
                      : `Extra cadeau: ${productTitles}`}
                  </p>
                  {action.intention && (
                    <small>
                      Bedoeling:{" "}
                      {
                        shopNeeds.find(
                          (need) => need.id === action.intention,
                        )?.title
                      }
                    </small>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <blockquote>{state.supportLine?.text}</blockquote>
        <div className={styles.actions}>
          <button
            className={styles.primary}
            disabled={pending}
            onClick={() =>
              dispatch({
                type: "winkelmandje.game.completed",
                actorId: installationId,
              })
            }
            type="button"
          >
            Opslaan en terug naar kaart 3
          </button>
          <button
            className={styles.secondary}
            disabled={pending}
            onClick={() =>
              dispatch({
                type: "winkelmandje.game.replayed",
                actorId: installationId,
              })
            }
            type="button"
          >
            Opnieuw spelen met een andere dag
          </button>
        </div>
      </div>
    </section>
  );
}
