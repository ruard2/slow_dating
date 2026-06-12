import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent,
} from "react";
import { NavLink, useNavigate } from "react-router-dom";

import type { WorldProgress } from "@slow-dating/contracts";
import {
  getWorldPlacements,
  worlds,
  type WorldDefinition,
} from "@slow-dating/content";

import styles from "../App.module.css";

const WAYPOINTS = [7.4, 14.5, 24.9, 35.2, 48.5];

function progressPosition(completedGames: number) {
  const completed = Math.max(0, Math.min(completedGames, 20));
  const segment = Math.min(Math.floor(completed / 5), 3);
  const start = WAYPOINTS[segment] ?? 7.4;
  const end = WAYPOINTS[segment + 1] ?? 48.5;
  return start + (end - start) * ((completed % 5) / 5);
}

function formatPrice(priceCents: number) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(priceCents / 100);
}

function WorldCard({
  activate,
  progress,
  world,
}: {
  activate(world: WorldDefinition): void;
  progress: WorldProgress;
  world: WorldDefinition;
}) {
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const pinch = useRef<{ distance: number; scale: number } | null>(null);
  const unlocked = progress.unlockedWorlds.includes(world.id);
  const placements = getWorldPlacements(world.id);
  const zoomable = unlocked && placements.length > 0;

  function setScale(nextScale: number) {
    const scale = Math.max(1, Math.min(nextScale, 3));
    setTransform((current) =>
      scale === 1 ? { scale: 1, x: 0, y: 0 } : { ...current, scale },
    );
  }

  function pointerDown(event: ReactPointerEvent<HTMLElement>) {
    if ((event.target as Element).closest("a,button")) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    lastPoint.current = { x: event.clientX, y: event.clientY };
    if (zoomable && transform.scale > 1) {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (pointers.current.size === 2) {
      event.currentTarget.setPointerCapture(event.pointerId);
      const [first, second] = [...pointers.current.values()];
      if (first && second) {
        pinch.current = {
          distance: Math.hypot(second.x - first.x, second.y - first.y),
          scale: transform.scale,
        };
      }
    }
  }

  function pointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (!pointers.current.has(event.pointerId)) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [first, second] = [...pointers.current.values()];
      if (first && second) {
        const distance = Math.hypot(second.x - first.x, second.y - first.y);
        setScale(pinch.current.scale * (distance / pinch.current.distance));
      }
      return;
    }
    if (zoomable && transform.scale > 1 && lastPoint.current) {
      const dx = event.clientX - lastPoint.current.x;
      const dy = event.clientY - lastPoint.current.y;
      setTransform((current) => ({
        ...current,
        x: current.x + dx,
        y: current.y + dy,
      }));
      lastPoint.current = { x: event.clientX, y: event.clientY };
    }
  }

  function pointerUp(event: ReactPointerEvent<HTMLElement>) {
    pointers.current.delete(event.pointerId);
    pinch.current = null;
    lastPoint.current = null;
  }

  function wheel(event: WheelEvent<HTMLElement>) {
    if (!event.ctrlKey || !zoomable) return;
    event.preventDefault();
    setScale(transform.scale + (event.deltaY < 0 ? 0.2 : -0.2));
  }

  return (
    <section
      aria-label={
        world.id === 1
          ? "Wereld 1 met spellen"
          : `Wereld ${world.id}: ${world.name}`
      }
      className={styles.worldCard}
      data-world-id={world.id}
      onDoubleClick={() => {
        if (zoomable) setTransform({ scale: 1, x: 0, y: 0 });
      }}
      onPointerCancel={pointerUp}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={pointerUp}
      onWheel={wheel}
      style={{
        touchAction: zoomable && transform.scale > 1 ? "none" : "pan-y",
      }}
    >
      <div
        className={styles.mapInner}
        data-testid={
          world.id === 1
            ? "world-one-map-inner"
            : `world-${world.id}-map-inner`
        }
        style={{
          transform: `translate3d(${transform.x}px,${transform.y}px,0) scale(${transform.scale})`,
        }}
      >
        <img
          className={unlocked ? styles.worldImage : styles.lockedWorldImage}
          src={world.image}
          alt={`Kaart van wereld ${world.id}`}
        />
        {unlocked &&
          placements.map(({ game, position }) => (
            <NavLink
              aria-label={game.title}
              className={styles.mapHotspot ?? ""}
              key={game.id}
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
                width: `${position.width}%`,
                height: `${position.height}%`,
              }}
              to={`/games/${game.id}`}
            />
          ))}
      </div>
      {!unlocked && (
        <div className={styles.worldLockOverlay}>
          <strong>
            Wereld {world.id} - {world.name}
          </strong>
          <span>
            {progress.unlockedWorlds.includes(world.id - 1)
              ? progress.eligibleWorlds.includes(world.id)
                ? "Klaar om vrij te schakelen"
                : `${progress.completedGames} / ${world.requiredDiscoveries} ontdekkingen`
              : `Open eerst wereld ${world.id - 1}`}
          </span>
          <small>Tik voor details</small>
        </div>
      )}
      {zoomable && (
        <div
          className={styles.zoomControls}
          aria-label="Kaartzoom"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button
            aria-label="Inzoomen"
            onClick={() => setScale(transform.scale + 0.25)}
            type="button"
          >
            +
          </button>
          <button
            aria-label="Uitzoomen"
            disabled={transform.scale === 1}
            onClick={() => setScale(transform.scale - 0.25)}
            type="button"
          >
            -
          </button>
          {transform.scale > 1 && (
            <button
              aria-label="Zoom herstellen"
              onClick={() => setTransform({ scale: 1, x: 0, y: 0 })}
              type="button"
            >
              1x
            </button>
          )}
        </div>
      )}
      {world.id > 1 && (
        <button
          aria-label={`${unlocked ? "Open" : "Bekijk"} wereld ${world.id}: ${
            world.name
          }`}
          className={styles.worldPortalButton}
          onClick={() => activate(world)}
          type="button"
        />
      )}
    </section>
  );
}

export function WorldMap({
  focusWorld = 1,
  progress,
  purchaseWorld,
  purchasing,
}: {
  focusWorld?: number;
  progress: WorldProgress;
  purchaseWorld(world: number): void;
  purchasing: boolean;
}) {
  const navigate = useNavigate();
  const scroller = useRef<HTMLDivElement | null>(null);
  const [selectedWorld, setSelectedWorld] = useState<WorldDefinition | null>(null);
  const [toastWorld, setToastWorld] = useState<WorldDefinition | null>(null);
  const position = progressPosition(progress.completedGames);

  function scrollToWorld(worldId: number) {
    const target = scroller.current?.querySelector<HTMLElement>(
      `[data-world-id="${worldId}"]`,
    );
    target?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  useEffect(() => {
    const showWorld = () => {
      const target = scroller.current?.querySelector<HTMLElement>(
        `[data-world-id="${focusWorld}"]`,
      );
      if (scroller.current && target) scroller.current.scrollTop = target.offsetTop;
    };
    const frame = requestAnimationFrame(() => requestAnimationFrame(showWorld));
    const timeout = window.setTimeout(showWorld, 250);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [focusWorld]);

  useEffect(() => {
    const ready = worlds.find(
      (world) =>
        world.id > 1 &&
        progress.eligibleWorlds.includes(world.id) &&
        !progress.purchasedWorlds.includes(world.id) &&
        progress.unlockedWorlds.includes(world.id - 1),
    );
    if (!ready) return;
    const key = `slow-dating-world-ready-${ready.id}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, "seen");
      const timeout = window.setTimeout(() => setToastWorld(ready), 500);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  function activateWorld(world: WorldDefinition) {
    if (progress.unlockedWorlds.includes(world.id)) {
      navigate(world.id === 1 ? "/" : `/worlds/${world.id}`);
      scrollToWorld(world.id);
      return;
    }
    setSelectedWorld(world);
  }

  return (
    <main className={styles.worldPage}>
      <div className={styles.progressBar} aria-label="Voortgang wereldkaart">
        <img className={styles.progressTrack} src="/assets/nabijheid_balk2.webp" alt="" />
        <img className={styles.progressFigure} src="/assets/figuur_t.webp" alt="" style={{ left: `${position}%` }} />
        <img className={styles.partnerFigure} src="/assets/figuur2_t.webp" alt="" style={{ right: `${position}%` }} />
      </div>

      <nav className={styles.worldNavigator} aria-label="Werelden">
        {[...worlds].reverse().map((world) => (
          <button
            aria-label={`Ga naar wereld ${world.id}: ${world.name}`}
            data-unlocked={progress.unlockedWorlds.includes(world.id)}
            key={world.id}
            onClick={() => scrollToWorld(world.id)}
            type="button"
          >
            {world.id}
          </button>
        ))}
      </nav>

      <div className={styles.worldScroller} ref={scroller}>
        {[...worlds].reverse().map((world) => (
          <WorldCard
            activate={activateWorld}
            key={world.id}
            progress={progress}
            world={world}
          />
        ))}
      </div>

      {toastWorld && (
        <button className={styles.unlockToast} onClick={() => { scrollToWorld(toastWorld.id); setToastWorld(null); }} type="button">
          <strong>Wereld {toastWorld.id} is klaar</strong>
          <span>Scroll omhoog om {toastWorld.name} vrij te schakelen</span>
        </button>
      )}

      {selectedWorld && (
        <div className={styles.unlockBackdrop} role="dialog" aria-modal="true" aria-label={`Wereld ${selectedWorld.id} vrijschakelen`}>
          <section className={styles.unlockCard}>
            <span className={styles.panelKicker}>Wereld {selectedWorld.id}</span>
            <h2>{selectedWorld.name}</h2>
            <p>{selectedWorld.description}</p>
            <div className={styles.unlockRequirement}>
              <span>Ontdekkingen</span>
              <strong>{progress.completedGames} / {selectedWorld.requiredDiscoveries}</strong>
            </div>
            <div className={styles.unlockRequirement}>
              <span>Vorige wereld</span>
              <strong>{progress.unlockedWorlds.includes(selectedWorld.id - 1) ? "Geopend" : "Nog gesloten"}</strong>
            </div>
            <div className={styles.unlockRequirement}>
              <span>Aankoop</span>
              <strong>{progress.purchasedWorlds.includes(selectedWorld.id) ? "Hersteld" : "Nog niet"}</strong>
            </div>
            <div className={styles.unlockPrice}>{formatPrice(selectedWorld.priceCents)} - eenmalig voor je account</div>
            <button
              className={styles.primaryButton}
              disabled={
                purchasing ||
                (!progress.unlockedWorlds.includes(selectedWorld.id) &&
                  (!progress.eligibleWorlds.includes(selectedWorld.id) ||
                    !progress.unlockedWorlds.includes(selectedWorld.id - 1)))
              }
              onClick={() => {
                if (progress.unlockedWorlds.includes(selectedWorld.id)) {
                  activateWorld(selectedWorld);
                } else {
                  purchaseWorld(selectedWorld.id);
                }
              }}
              type="button"
            >
              {purchasing
                ? "Bezig..."
                : progress.unlockedWorlds.includes(selectedWorld.id)
                  ? "Open wereld"
                  : "Wereld vrijschakelen"}
            </button>
            <button className={styles.unlockClose} onClick={() => setSelectedWorld(null)} type="button">Misschien later</button>
          </section>
        </div>
      )}
    </main>
  );
}
