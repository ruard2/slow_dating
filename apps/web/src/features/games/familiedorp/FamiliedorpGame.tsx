import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import type { FamiliedorpAction, FamiliedorpState, PlacedItem } from "./contracts";
import {
  DIER_IDS,
  LABELS,
  NAPRAAT_VRAGEN,
  SFEER_OPTIES,
  TRAY_CATS,
  ZIN_OPTIES,
} from "./content";
import type { TrayItem } from "./content";
import styles from "./FamiliedorpGame.module.css";

type Screen = "intro" | "canvas" | "sfeer" | "zin" | "wacht" | "reveal" | "napraat";

interface DragState {
  uid: string;
  startClientX: number;
  startClientY: number;
  startItemX: number;
  startItemY: number;
  el: HTMLElement;
  canvasRect: DOMRect;
  isDragging: boolean;
  currentX: number;
  currentY: number;
}

export function FamiliedorpGame({
  state,
  dispatch,
  installationId,
  memberIds,
  partnerName,
  pending,
}: GameComponentProps<FamiliedorpState, FamiliedorpAction>) {
  const partnerId = memberIds.find((id) => id !== installationId) ?? "";
  const myVillage = state.villageByPlayer[installationId];
  const partnerVillage = state.villageByPlayer[partnerId];
  const bothSubmitted = Boolean(myVillage && partnerVillage);

  const [screen, setScreen] = useState<Screen>(() => {
    if (myVillage) {
      return bothSubmitted ? "reveal" : "wacht";
    }
    return "intro";
  });

  // Local canvas state
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [sfeer, setSfeer] = useState<string[]>([]);
  const [zin, setZin] = useState("");
  const [zinEigen, setZinEigen] = useState("");
  const [activeCat, setActiveCat] = useState("ouders");
  const [pendingTrayItem, setPendingTrayItem] = useState<TrayItem | null>(null);
  const [editModal, setEditModal] = useState<PlacedItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editLabel, setEditLabel] = useState("");

  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const uidRef = useRef(0);

  function newUid() {
    return `item_${++uidRef.current}`;
  }

  // Transition wacht → reveal when partner submits
  useEffect(() => {
    if (screen === "wacht" && bothSubmitted) {
      const timeout = window.setTimeout(() => setScreen("reveal"), 0);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
  }, [screen, bothSubmitted]);

  const napraatQuestions = useMemo(() => {
    return NAPRAAT_VRAGEN.slice(0, 5);
  }, []);

  // ── Tray pick ─────────────────────────────────────────────
  function pickFromTray(item: TrayItem) {
    setPendingTrayItem(item);
  }

  // ── Canvas pointer: place pending item ───────────────────
  function handleCanvasPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!pendingTrayItem) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const uid = newUid();
    const newItem: PlacedItem = {
      uid,
      assetId: pendingTrayItem.id,
      role: pendingTrayItem.role,
      imgSrc: pendingTrayItem.img,
      name: "",
      label: "",
      x: Math.max(0.02, Math.min(0.98, x)),
      y: Math.max(0.02, Math.min(0.98, y)),
    };
    setPlacedItems((prev) => [...prev, newItem]);
    setPendingTrayItem(null);
  }

  // ── Placed item drag ──────────────────────────────────────
  const handleItemPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, item: PlacedItem) => {
      e.stopPropagation();
      const canvas = canvasRef.current;
      if (!canvas) return;
      const el = e.currentTarget as HTMLElement;
      el.setPointerCapture(e.pointerId);
      dragRef.current = {
        uid: item.uid,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startItemX: item.x,
        startItemY: item.y,
        el,
        canvasRect: canvas.getBoundingClientRect(),
        isDragging: false,
        currentX: item.x,
        currentY: item.y,
      };
    },
    [],
  );

  const handleItemPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, uid: string) => {
      const ds = dragRef.current;
      if (!ds || ds.uid !== uid) return;
      const dx = e.clientX - ds.startClientX;
      const dy = e.clientY - ds.startClientY;
      if (!ds.isDragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        ds.isDragging = true;
      }
      if (!ds.isDragging) return;
      const newX = Math.max(0.02, Math.min(0.98, ds.startItemX + dx / ds.canvasRect.width));
      const newY = Math.max(0.02, Math.min(0.98, ds.startItemY + dy / ds.canvasRect.height));
      ds.currentX = newX;
      ds.currentY = newY;
      ds.el.style.left = `${newX * 100}%`;
      ds.el.style.top = `${newY * 100}%`;
    },
    [],
  );

  const handleItemPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, item: PlacedItem) => {
      const ds = dragRef.current;
      if (!ds || ds.uid !== item.uid) return;
      if (ds.isDragging) {
        setPlacedItems((prev) =>
          prev.map((pi) =>
            pi.uid === item.uid
              ? { ...pi, x: ds.currentX, y: ds.currentY }
              : pi,
          ),
        );
      } else {
        // eslint-disable-next-line react-hooks/immutability
        openEditModal(item);
      }
      dragRef.current = null;
    },
    [],
  );

  // ── Edit modal ────────────────────────────────────────────
  function openEditModal(item: PlacedItem) {
    setEditModal(item);
    setEditName(item.name);
    setEditLabel(item.label);
  }

  function saveEditModal() {
    if (!editModal) return;
    setPlacedItems((prev) =>
      prev.map((pi) =>
        pi.uid === editModal.uid
          ? { ...pi, name: editName.trim(), label: editLabel }
          : pi,
      ),
    );
    setEditModal(null);
  }

  function deleteEditModal() {
    if (!editModal) return;
    setPlacedItems((prev) => prev.filter((pi) => pi.uid !== editModal.uid));
    setEditModal(null);
  }

  // ── Submit ────────────────────────────────────────────────
  function submitVillage() {
    void dispatch({
      type: "familiedorp.village.submitted",
      actorId: installationId,
      village: { placedItems, sfeer, zin },
    });
    setScreen("wacht");
  }

  function finish() {
    void dispatch({
      type: "familiedorp.game.completed",
      actorId: installationId,
    });
  }

  // ── Active cat ────────────────────────────────────────────
  const activeCatData = TRAY_CATS.find((c) => c.id === activeCat) ?? TRAY_CATS[0]!;

  // ── Render ────────────────────────────────────────────────
  return (
    <div className={styles.root}>
      <div className={styles.bgLayer} />

      {/* ── INTRO ─────────────────────────────────────────── */}
      {screen === "intro" && (
        <div className={styles.screen}>
          <div className={styles.introWrap}>
            <div className={styles.introTitle}>Zo werkt het</div>
            <div className={styles.introStep}>
              <div className={styles.stepNum}>1</div>
              <p>
                Sleep mensen en dieren vanuit de lade naar het dorpsplein. Zet ze{" "}
                <strong>dichterbij jou</strong> als ze dichtbij staan in je leven,{" "}
                <strong>verder weg</strong> als ze er wel bij horen maar wat meer op afstand,
                of aan de <strong>rand</strong> als je ze er liever even kort insluit.
              </p>
            </div>
            <div className={styles.introStep}>
              <div className={styles.stepNum}>2</div>
              <p>
                Geef ieder optioneel een <strong>naam of bijnaam</strong> en een{" "}
                <strong>lichte typering</strong> — zoals "de grappenmaker" of "de echte
                baas van het huis".
              </p>
            </div>
            <div className={styles.introStep}>
              <div className={styles.stepNum}>3</div>
              <p>
                Kies daarna <strong>drie sfeerwoorden</strong> die typisch zijn voor jouw
                thuis, en één <strong>herkenbare familiezin</strong>.
              </p>
            </div>
            <div className={styles.introStep}>
              <div className={styles.stepNum}>4</div>
              <p>
                Als jullie <strong>allebei klaar</strong> zijn, openen jullie elkaars dorp
                tegelijk.
              </p>
            </div>
            <div className={styles.safeNote}>
              Deel alleen wat goed voelt. Je hoeft niemand te benoemen die je er liever
              buiten houdt. Je mag altijd een mysteriepersoon plaatsen of zeggen: "hier
              kom ik later op terug."
            </div>
            <button className={styles.btn} onClick={() => setScreen("canvas")}>
              Bouw mijn dorp →
            </button>
          </div>
        </div>
      )}

      {/* ── CANVAS ────────────────────────────────────────── */}
      {screen === "canvas" && (
        <div className={styles.canvasScreen}>
          <div className={styles.canvasTopbar}>
            <button className={styles.backBtn} onClick={() => setScreen("intro")}>
              ←
            </button>
            <div className={styles.canvasTitle}>Jouw familiedorp</div>
            <button
              className={styles.doneBtn}
              onClick={() => setScreen("sfeer")}
            >
              Klaar →
            </button>
          </div>

          {/* Village canvas */}
          <div
            ref={canvasRef}
            className={`${styles.villageCanvas} ${pendingTrayItem ? styles.placing : ""}`}
            onPointerDown={handleCanvasPointerDown}
          >
            {pendingTrayItem && (
              <div className={styles.canvasHint}>
                Tik op het plein om {pendingTrayItem.role} te plaatsen…
              </div>
            )}
            {placedItems.map((item) => {
              const isDier = DIER_IDS.has(item.assetId);
              return (
                <div
                  key={item.uid}
                  className={`${styles.placedItem} ${isDier ? styles.placedItemDier : ""}`}
                  style={{ left: `${item.x * 100}%`, top: `${item.y * 100}%` }}
                  onPointerDown={(e) => handleItemPointerDown(e, item)}
                  onPointerMove={(e) => handleItemPointerMove(e, item.uid)}
                  onPointerUp={(e) => handleItemPointerUp(e, item)}
                >
                  <img src={item.imgSrc} alt={item.role} />
                  <div className={styles.itemLabels}>
                    <div className={styles.itemRole}>{item.name || item.role}</div>
                    {item.label && (
                      <div className={styles.itemLabel}>{item.label}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Icon tray */}
          <div className={styles.iconTray}>
            <div className={styles.trayTabs}>
              {TRAY_CATS.map((cat) => (
                <button
                  key={cat.id}
                  className={`${styles.trayTab} ${activeCat === cat.id ? styles.trayTabActive : ""}`}
                  onClick={() => {
                    setActiveCat(cat.id);
                    setPendingTrayItem(null);
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className={styles.trayIcons}>
              {activeCatData.items.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.trayIcon} ${activeCatData.isDier || item.isDier ? styles.trayIconDier : ""} ${pendingTrayItem?.id === item.id ? styles.trayIconPending : ""}`}
                  onClick={() => pickFromTray(item)}
                >
                  <img src={item.img} alt={item.role} />
                  <span>{item.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT MODAL ────────────────────────────────────── */}
      {editModal && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) setEditModal(null);
          }}
        >
          <div className={styles.modalSheet}>
            <h3 className={styles.modalTitle}>Persoon aanpassen</h3>
            <input
              className={styles.modalInput}
              placeholder="Naam of bijnaam (optioneel)"
              maxLength={20}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <div className={styles.modalSubLabel}>Typering (optioneel):</div>
            <div className={styles.labelChips}>
              {LABELS.map((lbl) => (
                <button
                  key={lbl}
                  className={`${styles.labelChip} ${editLabel === lbl ? styles.labelChipSelected : ""}`}
                  onClick={() => setEditLabel((prev) => (prev === lbl ? "" : lbl))}
                >
                  {lbl}
                </button>
              ))}
            </div>
            <div className={styles.modalActions}>
              <button className={styles.modalDel} onClick={deleteEditModal}>
                Verwijder
              </button>
              <button className={styles.modalSave} onClick={saveEditModal}>
                Opslaan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SFEER ─────────────────────────────────────────── */}
      {screen === "sfeer" && (
        <div className={styles.screen}>
          <button className={styles.backBtnTop} onClick={() => setScreen("canvas")}>
            ← Terug
          </button>
          <div className={styles.scrollArea}>
            <div className={styles.sectionTitle}>Hoe voelt jouw thuis?</div>
            <div className={styles.sectionSub}>Kies drie woorden die typisch zijn.</div>
            <div className={styles.sfeerGrid}>
              {SFEER_OPTIES.map((opt) => {
                const selected = sfeer.includes(opt);
                const disabled = !selected && sfeer.length >= 3;
                return (
                  <button
                    key={opt}
                    className={`${styles.sfeerChip} ${selected ? styles.sfeerChipSelected : ""} ${disabled ? styles.sfeerChipDisabled : ""}`}
                    onClick={() => {
                      if (selected) {
                        setSfeer((prev) => prev.filter((x) => x !== opt));
                      } else if (sfeer.length < 3) {
                        setSfeer((prev) => [...prev, opt]);
                      }
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            <button
              className={styles.btn}
              disabled={sfeer.length < 3}
              onClick={() => setScreen("zin")}
            >
              Volgende →
            </button>
          </div>
        </div>
      )}

      {/* ── ZIN ───────────────────────────────────────────── */}
      {screen === "zin" && (
        <div className={styles.screen}>
          <button className={styles.backBtnTop} onClick={() => setScreen("sfeer")}>
            ← Terug
          </button>
          <div className={styles.scrollArea}>
            <div className={styles.sectionTitle}>De typische familiezin</div>
            <div className={styles.sectionSub}>
              Welke zin klinkt het meest als jouw thuis? Kies of schrijf er zelf één.
            </div>
            <div className={styles.zinList}>
              {ZIN_OPTIES.map((z) => (
                <button
                  key={z}
                  className={`${styles.zinItem} ${zin === z && !zinEigen ? styles.zinItemSelected : ""}`}
                  onClick={() => {
                    setZin(z);
                    setZinEigen("");
                  }}
                >
                  {z}
                </button>
              ))}
            </div>
            <input
              className={styles.zinInput}
              placeholder="Of schrijf je eigen familiezin..."
              maxLength={60}
              value={zinEigen}
              onChange={(e) => {
                setZinEigen(e.target.value);
                setZin(e.target.value);
              }}
            />
            <button
              className={styles.btn}
              style={{ marginTop: 16 }}
              disabled={!zin.trim() || pending}
              onClick={submitVillage}
            >
              Klaar om te delen →
            </button>
          </div>
        </div>
      )}

      {/* ── WACHT ─────────────────────────────────────────── */}
      {screen === "wacht" && (
        <div className={styles.screen}>
          <div className={styles.wachtWrap}>
            <div className={styles.wachtDots}>
              <span />
              <span />
              <span />
            </div>
            <div className={styles.wachtTitle}>Jouw dorp is klaar!</div>
            <div className={styles.wachtSub}>
              Wacht tot {partnerName} ook klaar is…
            </div>
            <div className={styles.wachtNote}>
              Jullie dorpen openen tegelijk.
            </div>
          </div>
        </div>
      )}

      {/* ── REVEAL ────────────────────────────────────────── */}
      {screen === "reveal" && myVillage && (
        <div className={styles.revealScreen}>
          <div className={styles.canvasTopbar}>
            <div className={styles.canvasTitle} style={{ textAlign: "left", paddingLeft: 0 }}>
              Jullie familiedorpen
            </div>
            <button
              className={styles.doneBtn}
              onClick={() => setScreen("napraat")}
            >
              Verder →
            </button>
          </div>
          <div className={styles.revealWrap}>
            <VillagePreview label="Jouw dorp" village={myVillage} />
            {partnerVillage && (
              <VillagePreview
                label={`Dorp van ${partnerName}`}
                village={partnerVillage}
              />
            )}
          </div>
        </div>
      )}

      {/* ── NAPRAAT ───────────────────────────────────────── */}
      {screen === "napraat" && (
        <div className={styles.revealScreen}>
          <div className={styles.canvasTopbar}>
            <button className={styles.backBtn} onClick={() => setScreen("reveal")}>
              ←
            </button>
            <div className={styles.canvasTitle}>Praat er verder over</div>
          </div>
          <div className={styles.scrollArea} style={{ paddingTop: 12 }}>
            <div className={styles.napraatSub}>
              Kies een vraag om samen over te praten:
            </div>
            {napraatQuestions.map((v) => (
              <button key={v} className={styles.napraatBtn}>
                {v}
              </button>
            ))}
            <button
              className={styles.btn}
              style={{ marginTop: 8 }}
              disabled={pending}
              onClick={finish}
            >
              Afronden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Village preview (shared between reveal blocks) ───────────
function VillagePreview({
  label,
  village,
}: {
  label: string;
  village: { placedItems: PlacedItem[]; sfeer: string[]; zin: string };
}) {
  return (
    <div className={styles.villagePreviewBlock}>
      <div className={styles.villagePreviewInner}>
        <div className={styles.previewLabel}>{label}</div>
        <div className={styles.previewCanvas}>
          {village.placedItems.map((item, i) => (
            <div
              key={i}
              className={styles.previewItem}
              style={{ left: `${item.x * 100}%`, top: `${item.y * 100}%` }}
            >
              <img src={item.imgSrc} alt={item.role} />
              <span>{item.name || item.role}</span>
              {item.label && <span className={styles.previewItemLabel}>{item.label}</span>}
            </div>
          ))}
        </div>
      </div>
      {village.sfeer.length > 0 && (
        <div className={styles.sfeerRow}>
          {village.sfeer.map((s) => (
            <div key={s} className={styles.sfeerPreview}>
              {s}
            </div>
          ))}
        </div>
      )}
      {village.zin && (
        <div className={styles.zinPreview}>"{village.zin}"</div>
      )}
    </div>
  );
}
