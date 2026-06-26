import { useEffect, useMemo, useRef, useState } from "react";

import type { GameComponentProps } from "@slow-dating/game-kit";

import {
  christianHitQuestions,
  hitQuestions,
  obstacleCatalog,
  powerUps,
} from "./content";
import type {
  StressmeterAction,
  StressmeterRoundSummary,
  StressmeterState,
} from "./contracts";
import styles from "./StressmeterGame.module.css";

type Phase = "intro" | "countdown" | "playing" | "question" | "ended";
type PlayerKey = "self" | "partner";
type PowerId = "speed" | "shield" | "slow";

type Plane = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  lives: number;
  shield: number;
  speedUntil: number;
  slowUntil: number;
  invulnerableUntil: number;
};

type Shot = {
  id: string;
  owner: PlayerKey;
  x: number;
  y: number;
  vy: number;
  born: number;
  piercesObstacles: boolean;
};

type Obstacle = {
  id: string;
  kind: string;
  x: number;
  y: number;
  radius: number;
  drift: number;
};

type PowerUp = {
  id: string;
  kind: PowerId;
  x: number;
  y: number;
  born: number;
};

type StormDebris = {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  icon: string;
  warnUntil: number;
};

type CoopShip = {
  active: boolean;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  until: number;
  defeated: boolean;
  nextAt: number;
};

type Runtime = {
  phase: Phase;
  startedAt: number;
  lastAt: number;
  countdownUntil: number;
  lastQuestionAt: number;
  question: string;
  self: Plane;
  partner: Plane;
  shots: Shot[];
  obstacles: Obstacle[];
  powerUps: PowerUp[];
  nextShotAt: number;
  nextAiShotAt: number;
  nextPowerAt: number;
  nextQuestionIndex: number;
  shotsFired: number;
  powerUpsCollected: string[];
  questionsShown: string[];
  pressureBursts: number;
  closeSamples: number;
  farSamples: number;
  samples: number;
  winner: PlayerKey | null;
  crossedAt: number;
  tension: number;
  stormUntil: number;
  nextStormDebrisAt: number;
  stormBursts: number;
  stormDebris: StormDebris[];
  coopShip: CoopShip;
  coopTriggered: boolean;
  coopHits: number;
  lastUiAt: number;
};

const WIDTH = 390;
const HEIGHT = 680;
const MAX_LIVES = 5;
const PLANE_RADIUS = 17;
const SHOT_RADIUS = 6;
const NORMAL_SHOT_COOLDOWN = 380;
const COMEBACK_SHOT_COOLDOWN = 285;

function makePlane(key: PlayerKey): Plane {
  return {
    x: WIDTH / 2,
    y: key === "self" ? HEIGHT - 76 : 76,
    vx: 0,
    vy: key === "self" ? -1 : 1,
    lives: MAX_LIVES,
    shield: 0,
    speedUntil: 0,
    slowUntil: 0,
    invulnerableUntil: 0,
  };
}

function createRuntime(now: number): Runtime {
  return {
    phase: "intro",
    startedAt: now,
    lastAt: now,
    countdownUntil: now,
    lastQuestionAt: -15000,
    question: "",
    self: makePlane("self"),
    partner: makePlane("partner"),
    shots: [],
    obstacles: [
      { id: "o1", kind: "cloud-bank", x: 86, y: 240, radius: 34, drift: 11 },
      { id: "o2", kind: "gear", x: 290, y: 270, radius: 24, drift: -8 },
      { id: "o3", kind: "lantern", x: 185, y: 342, radius: 22, drift: 6 },
      { id: "o4", kind: "wind", x: 78, y: 438, radius: 28, drift: -10 },
      { id: "o5", kind: "bridge", x: 306, y: 472, radius: 30, drift: 9 },
    ],
    powerUps: [],
    nextShotAt: 0,
    nextAiShotAt: now + 1200,
    nextPowerAt: now + 2300,
    nextQuestionIndex: 0,
    shotsFired: 0,
    powerUpsCollected: [],
    questionsShown: [],
    pressureBursts: 0,
    closeSamples: 0,
    farSamples: 0,
    samples: 0,
    winner: null,
    crossedAt: 0,
    tension: 18,
    stormUntil: 0,
    nextStormDebrisAt: now + 800,
    stormBursts: 0,
    stormDebris: [],
    coopShip: {
      active: false,
      x: WIDTH / 2,
      y: HEIGHT / 2,
      hp: 12,
      maxHp: 12,
      until: 0,
      defeated: false,
      nextAt: now + 26000,
    },
    coopTriggered: false,
    coopHits: 0,
    lastUiAt: 0,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function otherPlayer(owner: PlayerKey): PlayerKey {
  return owner === "self" ? "partner" : "self";
}

function isBehind(runtime: Runtime, owner: PlayerKey) {
  return runtime[owner].lives < runtime[otherPlayer(owner)].lives;
}

function comebackLevel(runtime: Runtime, owner: PlayerKey) {
  return Math.max(0, runtime[otherPlayer(owner)].lives - runtime[owner].lives);
}

function comebackSpeedMultiplier(runtime: Runtime, owner: PlayerKey) {
  const level = comebackLevel(runtime, owner);
  return level > 0 ? 1 + Math.min(0.28, level * 0.075) : 1;
}

function shotCooldown(runtime: Runtime, owner: PlayerKey) {
  return isBehind(runtime, owner) ? COMEBACK_SHOT_COOLDOWN : NORMAL_SHOT_COOLDOWN;
}

function hearts(lives: number) {
  const safeLives = clamp(lives, 0, MAX_LIVES);
  return `${"♥".repeat(safeLives)}${"♡".repeat(MAX_LIVES - safeLives)}`;
}

function drawPlane(
  ctx: CanvasRenderingContext2D,
  plane: Plane,
  key: PlayerKey,
  now: number,
) {
  ctx.save();
  ctx.translate(plane.x, plane.y);
  ctx.rotate(plane.vy < 0 ? 0 : Math.PI);
  ctx.globalAlpha =
    plane.invulnerableUntil > now && Math.floor(now / 120) % 2 ? 0.45 : 1;
  const fill = key === "self" ? "#75b7d0" : "#d97b83";
  ctx.fillStyle = fill;
  ctx.strokeStyle = "#f8e5a9";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(18, 16);
  ctx.lineTo(0, 9);
  ctx.lineTo(-18, 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#3b2b20";
  ctx.fillRect(-4, -2, 8, 13);
  if (plane.shield > 0) {
    ctx.strokeStyle = "rgba(233, 232, 175, .88)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 25, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawObstacle(ctx: CanvasRenderingContext2D, obstacle: Obstacle) {
  const item = obstacleCatalog.find((entry) => entry.id === obstacle.kind);
  ctx.save();
  ctx.font = `${Math.round(obstacle.radius * 1.25)}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.globalAlpha = 0.86;
  ctx.fillText(item?.icon ?? "☁️", obstacle.x, obstacle.y);
  ctx.restore();
}

function spawnStormDebris(runtime: Runtime, now: number) {
  const side = Math.floor(Math.random() * 4);
  const fromLeft = side === 0;
  const fromRight = side === 1;
  const fromTop = side === 2;
  const x = fromLeft ? -22 : fromRight ? WIDTH + 22 : 34 + Math.random() * (WIDTH - 68);
  const y = fromTop ? -22 : side === 3 ? HEIGHT + 22 : 92 + Math.random() * (HEIGHT - 184);
  const targetX = 42 + Math.random() * (WIDTH - 84);
  const targetY = 72 + Math.random() * (HEIGHT - 144);
  const length = Math.hypot(targetX - x, targetY - y) || 1;
  const speed = 140 + Math.random() * 90;
  runtime.stormDebris.push({
    id: `storm-${now}-${runtime.stormDebris.length}`,
    x,
    y,
    vx: ((targetX - x) / length) * speed,
    vy: ((targetY - y) / length) * speed,
    radius: 12 + Math.random() * 9,
    icon: ["🍂", "☁️", "🪨", "💨"][Math.floor(Math.random() * 4)]!,
    warnUntil: now + 650,
  });
}

function drawStormDebris(ctx: CanvasRenderingContext2D, debris: StormDebris, now: number) {
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (now < debris.warnUntil) {
    ctx.globalAlpha = 0.72;
    ctx.strokeStyle = "#f7df8e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(clamp(debris.x, 16, WIDTH - 16), clamp(debris.y, 16, HEIGHT - 16));
    ctx.lineTo(
      clamp(debris.x + debris.vx * 0.35, 16, WIDTH - 16),
      clamp(debris.y + debris.vy * 0.35, 16, HEIGHT - 16),
    );
    ctx.stroke();
  } else {
    ctx.font = `${Math.round(debris.radius * 1.55)}px serif`;
    ctx.globalAlpha = 0.9;
    ctx.fillText(debris.icon, debris.x, debris.y);
  }
  ctx.restore();
}

function drawCoopShip(ctx: CanvasRenderingContext2D, ship: CoopShip) {
  if (!ship.active) return;
  ctx.save();
  ctx.translate(ship.x, ship.y);
  ctx.fillStyle = "rgba(54, 36, 22, .92)";
  ctx.strokeStyle = "#efd889";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 0, 72, 34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(117, 177, 190, .82)";
  ctx.beginPath();
  ctx.ellipse(0, -8, 36, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#efd889";
  [-42, -14, 14, 42].forEach((x) => {
    ctx.beginPath();
    ctx.arc(x, 9, 5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
  ctx.save();
  ctx.fillStyle = "rgba(0,0,0,.45)";
  ctx.fillRect(ship.x - 62, ship.y - 52, 124, 8);
  ctx.fillStyle = "#e8d86d";
  ctx.fillRect(ship.x - 62, ship.y - 52, 124 * (ship.hp / ship.maxHp), 8);
  ctx.restore();
}

function beginStorm(runtime: Runtime, now: number) {
  runtime.tension = 48;
  runtime.stormUntil = now + 9500;
  runtime.nextStormDebrisAt = now + 250;
  runtime.stormBursts += 1;
  runtime.pressureBursts += 2;
}

function beginCoopShip(runtime: Runtime, now: number) {
  runtime.coopTriggered = true;
  runtime.coopShip = {
    active: true,
    x: WIDTH / 2,
    y: HEIGHT / 2,
    hp: 12,
    maxHp: 12,
    until: now + 17000,
    defeated: false,
    nextAt: Number.POSITIVE_INFINITY,
  };
  runtime.shots = [];
  runtime.nextAiShotAt = now + 450;
  runtime.tension = Math.max(35, runtime.tension - 18);
}

function applyPower(runtime: Runtime, collector: PlayerKey, kind: PowerId, now: number) {
  const own = runtime[collector];
  const other = runtime[otherPlayer(collector)];
  runtime.powerUpsCollected.push(kind);
  if (kind === "speed") own.speedUntil = now + 5000;
  if (kind === "shield") own.shield = Math.min(1, own.shield + 1);
  if (kind === "slow") other.slowUntil = now + 3000;
}

function fire(runtime: Runtime, owner: PlayerKey, now: number) {
  const plane = runtime[owner];
  const direction = plane.vy < 0 ? -1 : 1;
  const comeback = isBehind(runtime, owner);
  runtime.shots.push({
    id: `${owner}-${now}-${runtime.shots.length}`,
    owner,
    x: plane.x,
    y: plane.y + direction * 24,
    vy: direction * (comeback ? 405 : 350),
    born: now,
    piercesObstacles: comeback,
  });
  if (owner === "self") runtime.shotsFired += 1;
}

function separatePlanes(runtime: Runtime, now: number) {
  const gap = distance(runtime.self, runtime.partner);
  if (gap > PLANE_RADIUS * 2.25) return;
  const dx = runtime.self.x - runtime.partner.x || 1;
  const dy = runtime.self.y - runtime.partner.y || 1;
  const length = Math.hypot(dx, dy) || 1;
  const push = PLANE_RADIUS * 2.25 - gap + 10;
  runtime.self.x = clamp(runtime.self.x + (dx / length) * push, 28, WIDTH - 28);
  runtime.self.y = clamp(runtime.self.y + (dy / length) * push, 42, HEIGHT - 42);
  runtime.partner.x = clamp(runtime.partner.x - (dx / length) * push, 28, WIDTH - 28);
  runtime.partner.y = clamp(runtime.partner.y - (dy / length) * push, 42, HEIGHT - 42);
  runtime.self.vy = runtime.self.y > runtime.partner.y ? 1 : -1;
  runtime.partner.vy = -runtime.self.vy;
  runtime.self.invulnerableUntil = Math.max(runtime.self.invulnerableUntil, now + 900);
  runtime.partner.invulnerableUntil = Math.max(runtime.partner.invulnerableUntil, now + 900);
  runtime.pressureBursts += 1;
}

function recoverAfterHit(runtime: Runtime, targetKey: PlayerKey, now: number) {
  const target = runtime[targetKey];
  const other = runtime[otherPlayer(targetKey)];
  runtime.shots = [];
  runtime.nextAiShotAt = now + 2500;
  runtime.nextShotAt = now + 900;
  target.invulnerableUntil = now + 3200;
  target.vy = targetKey === "self" ? -1 : 1;
  other.vy = -target.vy;
  target.y = targetKey === "self" ? HEIGHT - 94 : 94;
  other.y = targetKey === "self" ? 94 : HEIGHT - 94;
  target.x = clamp(target.x + (targetKey === "self" ? -34 : 34), 42, WIDTH - 42);
  other.x = clamp(other.x + (targetKey === "self" ? 34 : -34), 42, WIDTH - 42);
}

function createSummary(
  runtime: Runtime,
  actorId: string,
): StressmeterRoundSummary {
  const durationMs = Math.max(1, Math.round(runtime.lastAt - runtime.startedAt));
  return {
    roundId: crypto.randomUUID(),
    actorId,
    winner: runtime.winner ?? "partner",
    durationMs,
    selfHitsTaken: MAX_LIVES - runtime.self.lives,
    partnerHitsTaken: MAX_LIVES - runtime.partner.lives,
    shotsFired: runtime.shotsFired,
    powerUpsCollected: runtime.powerUpsCollected,
    questionsShown: runtime.questionsShown,
    stormBursts: runtime.stormBursts,
    coopShipDefeated: runtime.coopShip.defeated,
    coopHits: runtime.coopHits,
    stressSignals: {
      riskTaking: Math.round((runtime.closeSamples / Math.max(1, runtime.samples)) * 100),
      distanceKeeping: Math.round((runtime.farSamples / Math.max(1, runtime.samples)) * 100),
      pressureBursts: runtime.pressureBursts,
    },
  };
}

export function StressmeterGame({
  christianLayer,
  dispatch,
  installationId,
  openCall,
  openChat,
  partnerName,
  pauseGame,
  pending,
  state,
}: GameComponentProps<StressmeterState, StressmeterAction>) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const runtimeRef = useRef<Runtime>(createRuntime(0));
  const controlsRef = useRef({ left: false, right: false, forward: false });
  const [phase, setPhase] = useState<Phase>("intro");
  const [countdown, setCountdown] = useState(3);
  const [question, setQuestion] = useState("");
  const [lives, setLives] = useState({ self: MAX_LIVES, partner: MAX_LIVES });
  const [winner, setWinner] = useState<PlayerKey | null>(null);
  const [roundSaved, setRoundSaved] = useState(false);
  const [status, setStatus] = useState({
    tension: 18,
    storm: false,
    coop: false,
    coopHp: 0,
    coopMaxHp: 12,
    comebackFor: null as PlayerKey | null,
  });
  const questions = useMemo(
    () =>
      christianLayer
        ? [...hitQuestions, ...christianHitQuestions]
        : [...hitQuestions],
    [christianLayer],
  );

  const ownRounds = state.roundsByPerson[installationId] ?? [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;
    let frame = 0;
    const loop = (now: number) => {
      const runtime = runtimeRef.current;
      const dt = Math.min(0.032, (now - runtime.lastAt) / 1000 || 0.016);
      runtime.lastAt = now;

      ctx.clearRect(0, 0, WIDTH, HEIGHT);
      ctx.fillStyle = "rgba(8, 22, 15, .28)";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      if (runtime.phase === "countdown") {
        const left = Math.max(0, runtime.countdownUntil - now);
        setCountdown(Math.max(1, Math.ceil(left / 1000)));
        if (left <= 0) {
          runtime.phase = "playing";
          runtime.startedAt = now;
          setPhase("playing");
        }
      }

      if (runtime.phase === "playing") {
        const selfComeback = comebackSpeedMultiplier(runtime, "self");
        const partnerComeback = comebackSpeedMultiplier(runtime, "partner");
        const selfSpeed =
          (runtime.self.speedUntil > now ? 265 : 188) *
          (controlsRef.current.forward ? 1.42 : 1) *
          (runtime.self.slowUntil > now ? 0.58 : 1) *
          selfComeback;
        const partnerSpeed =
          (runtime.partner.speedUntil > now ? 235 : 158) *
          (runtime.partner.slowUntil > now ? 0.58 : 1) *
          partnerComeback;
        const horizontal =
          (controlsRef.current.right ? 1 : 0) -
          (controlsRef.current.left ? 1 : 0);
        runtime.self.x = clamp(
          runtime.self.x + horizontal * selfSpeed * dt,
          28,
          WIDTH - 28,
        );
        runtime.self.y = clamp(runtime.self.y + runtime.self.vy * selfSpeed * 0.38 * dt, 42, HEIGHT - 42);
        const targetX =
          runtime.self.x + Math.sin(now / 520) * 34 + Math.cos(now / 900) * 42;
        runtime.partner.x = clamp(
          runtime.partner.x +
            clamp(targetX - runtime.partner.x, -1, 1) * partnerSpeed * dt,
          28,
          WIDTH - 28,
        );
        runtime.partner.y = clamp(runtime.partner.y + runtime.partner.vy * partnerSpeed * 0.38 * dt, 42, HEIGHT - 42);
        if (runtime.self.y <= 48) runtime.self.vy = Math.abs(runtime.self.vy);
        if (runtime.self.y >= HEIGHT - 48) runtime.self.vy = -Math.abs(runtime.self.vy);
        if (runtime.partner.y <= 48) runtime.partner.vy = Math.abs(runtime.partner.vy);
        if (runtime.partner.y >= HEIGHT - 48) runtime.partner.vy = -Math.abs(runtime.partner.vy);
        if (
          runtime.self.y < runtime.partner.y - 8 &&
          now - runtime.crossedAt > 900
        ) {
          runtime.self.vy = Math.abs(runtime.self.vy);
          runtime.partner.vy = -Math.abs(runtime.partner.vy);
          runtime.crossedAt = now;
        }
        separatePlanes(runtime, now);

        const moving = horizontal !== 0 || controlsRef.current.forward;
        const gapNow = Math.abs(runtime.self.y - runtime.partner.y);
        runtime.tension = clamp(
          runtime.tension +
            (5.5 + (moving ? -2.5 : 7.5) + (gapNow < 230 ? 3.5 : 0)) * dt,
          0,
          100,
        );
        if (runtime.tension >= 100 && runtime.stormUntil < now) {
          beginStorm(runtime, now);
        }
        if (
          !runtime.coopTriggered &&
          now > runtime.coopShip.nextAt &&
          now - runtime.startedAt > 18000
        ) {
          beginCoopShip(runtime, now);
        }
        if (runtime.coopShip.active && now > runtime.coopShip.until) {
          runtime.coopShip.active = false;
          runtime.tension = Math.min(100, runtime.tension + 14);
        }
        if (runtime.stormUntil > now && now > runtime.nextStormDebrisAt) {
          spawnStormDebris(runtime, now);
          runtime.nextStormDebrisAt = now + 360 + Math.random() * 280;
        }

        runtime.obstacles.forEach((obstacle, index) => {
          obstacle.x += Math.sin(now / (680 + index * 90)) * obstacle.drift * dt;
          if (distance(runtime.self, obstacle) < obstacle.radius + PLANE_RADIUS) {
            runtime.self.x = clamp(runtime.self.x - Math.sign(obstacle.x - runtime.self.x) * 42 * dt, 28, WIDTH - 28);
            runtime.pressureBursts += Math.random() < 0.04 ? 1 : 0;
          }
        });

        if (now > runtime.nextAiShotAt) {
          if (distance(runtime.self, runtime.partner) < 105) {
            runtime.nextAiShotAt = now + 650;
          } else {
          fire(runtime, "partner", now);
          const partnerBehind = isBehind(runtime, "partner");
          runtime.nextAiShotAt = runtime.coopShip.active
            ? now + (partnerBehind ? 410 : 520) + Math.random() * 260
            : now + (partnerBehind ? 520 : 780) + Math.random() * (partnerBehind ? 420 : 680);
          }
        }
        if (now > runtime.nextPowerAt) {
          const kind = powerUps[Math.floor(Math.random() * powerUps.length)]!.id as PowerId;
          runtime.powerUps.push({
            id: `${kind}-${now}`,
            kind,
            x: 52 + Math.random() * (WIDTH - 104),
            y: 180 + Math.random() * (HEIGHT - 360),
            born: now,
          });
          runtime.nextPowerAt = now + 3300 + Math.random() * 2600;
        }

        runtime.shots = runtime.shots
          .map((shot) => ({ ...shot, y: shot.y + shot.vy * dt }))
          .filter((shot) => shot.y > -30 && shot.y < HEIGHT + 30 && now - shot.born < 3400);

        let clearShotsAfterHit = false;
        runtime.shots = runtime.shots.filter((shot) => {
          if (clearShotsAfterHit) return false;
          if (
            runtime.coopShip.active &&
            distance(shot, runtime.coopShip) < 76
          ) {
            runtime.coopShip.hp = Math.max(0, runtime.coopShip.hp - 1);
            runtime.coopHits += shot.owner === "self" ? 1 : 0;
            runtime.tension = Math.max(0, runtime.tension - 2.5);
            if (runtime.coopShip.hp <= 0) {
              runtime.coopShip.active = false;
              runtime.coopShip.defeated = true;
              runtime.self.shield = Math.max(runtime.self.shield, 1);
              runtime.partner.shield = Math.max(runtime.partner.shield, 1);
              runtime.self.lives = Math.min(MAX_LIVES, runtime.self.lives + 1);
              runtime.partner.lives = Math.min(MAX_LIVES, runtime.partner.lives + 1);
              runtime.tension = 18;
              runtime.shots = [];
              setLives({ self: runtime.self.lives, partner: runtime.partner.lives });
            }
            return false;
          }
          if (
            !shot.piercesObstacles &&
            runtime.obstacles.some(
              (obstacle) => distance(shot, obstacle) < obstacle.radius + SHOT_RADIUS,
            )
          ) {
            return false;
          }
          const targetKey = shot.owner === "self" ? "partner" : "self";
          const target = runtime[targetKey];
          if (
            target.invulnerableUntil < now &&
            distance(shot, target) < PLANE_RADIUS + SHOT_RADIUS
          ) {
            if (target.shield > 0) {
              target.shield -= 1;
              recoverAfterHit(runtime, targetKey, now);
              clearShotsAfterHit = true;
            } else {
              target.lives = Math.max(0, target.lives - 1);
              recoverAfterHit(runtime, targetKey, now);
              clearShotsAfterHit = true;
              setLives({ self: runtime.self.lives, partner: runtime.partner.lives });
              if (target.lives <= 0) {
                runtime.winner = shot.owner;
                runtime.phase = "ended";
                setWinner(shot.owner);
                setPhase("ended");
              } else if (now - runtime.lastQuestionAt > 12000) {
                const picked =
                  questions[runtime.nextQuestionIndex % questions.length] ??
                  hitQuestions[0]!;
                runtime.nextQuestionIndex += 1;
                runtime.lastQuestionAt = now;
                runtime.questionsShown.push(picked);
                runtime.question = picked;
                runtime.phase = "question";
                setQuestion(picked);
                setPhase("question");
              }
            }
            return false;
          }
          return true;
        });

        runtime.stormDebris = runtime.stormDebris
          .map((debris) =>
            now < debris.warnUntil
              ? debris
              : {
                  ...debris,
                  x: debris.x + debris.vx * dt,
                  y: debris.y + debris.vy * dt,
                },
          )
          .filter((debris) => debris.x > -80 && debris.x < WIDTH + 80 && debris.y > -80 && debris.y < HEIGHT + 80);
        runtime.stormDebris.forEach((debris) => {
          if (now < debris.warnUntil) return;
          if (distance(debris, runtime.self) < debris.radius + PLANE_RADIUS) {
            runtime.self.x = clamp(runtime.self.x + Math.sign(runtime.self.x - debris.x) * 64 * dt, 28, WIDTH - 28);
            runtime.self.y = clamp(runtime.self.y + Math.sign(runtime.self.y - debris.y) * 64 * dt, 42, HEIGHT - 42);
            runtime.tension = clamp(runtime.tension + 12 * dt, 0, 100);
          }
        });

        runtime.powerUps = runtime.powerUps.filter((power) => {
          if (now - power.born > 10000) return false;
          if (distance(power, runtime.self) < 28) {
            applyPower(runtime, "self", power.kind, now);
            return false;
          }
          if (distance(power, runtime.partner) < 28) {
            applyPower(runtime, "partner", power.kind, now);
            return false;
          }
          return true;
        });

        const gap = Math.abs(runtime.self.y - runtime.partner.y);
        runtime.samples += 1;
        if (gap < 260) runtime.closeSamples += 1;
        if (gap > 430) runtime.farSamples += 1;
        if (now - runtime.lastUiAt > 120) {
          runtime.lastUiAt = now;
          setStatus({
            tension: runtime.tension,
            storm: runtime.stormUntil > now,
            coop: runtime.coopShip.active,
            coopHp: runtime.coopShip.hp,
            coopMaxHp: runtime.coopShip.maxHp,
            comebackFor: isBehind(runtime, "self")
              ? "self"
              : isBehind(runtime, "partner")
                ? "partner"
                : null,
          });
        }
        if (now - runtime.startedAt > 120000) {
          runtime.winner =
            runtime.partner.lives < runtime.self.lives ? "self" : "partner";
          runtime.phase = "ended";
          setWinner(runtime.winner);
          setPhase("ended");
        }
      }

      runtime.powerUps.forEach((power) => {
        const item = powerUps.find((entry) => entry.id === power.kind);
        ctx.save();
        ctx.fillStyle = "rgba(250, 229, 158, .22)";
        ctx.beginPath();
        ctx.arc(power.x, power.y, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "24px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item?.icon ?? "✨", power.x, power.y);
        ctx.restore();
      });
      runtime.obstacles.forEach((obstacle) => drawObstacle(ctx, obstacle));
      drawCoopShip(ctx, runtime.coopShip);
      runtime.stormDebris.forEach((debris) => drawStormDebris(ctx, debris, now));
      runtime.shots.forEach((shot) => {
        ctx.save();
        ctx.fillStyle = shot.owner === "self" ? "#f8e67b" : "#ffd0d6";
        if (shot.piercesObstacles) {
          ctx.shadowColor = shot.owner === "self" ? "#f8e67b" : "#ffd0d6";
          ctx.shadowBlur = 12;
        }
        ctx.beginPath();
        ctx.arc(shot.x, shot.y, SHOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
        if (shot.piercesObstacles) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.restore();
      });
      drawPlane(ctx, runtime.partner, "partner", now);
      drawPlane(ctx, runtime.self, "self", now);

      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [questions]);

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();
        controlsRef.current.left = true;
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        event.preventDefault();
        controlsRef.current.right = true;
      }
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
        event.preventDefault();
        controlsRef.current.forward = true;
      }
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        const runtime = runtimeRef.current;
        const now = performance.now();
        if (runtime.phase === "playing" && runtime.nextShotAt < now) {
          fire(runtime, "self", now);
          runtime.nextShotAt = now + shotCooldown(runtime, "self");
        }
      }
    };
    const up = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        controlsRef.current.left = false;
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        controlsRef.current.right = false;
      }
      if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
        controlsRef.current.forward = false;
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return undefined;
    const timer = window.setInterval(() => {
      const runtime = runtimeRef.current;
      const left = Math.max(0, runtime.countdownUntil - performance.now());
      setCountdown(Math.max(1, Math.ceil(left / 1000)));
      if (left <= 0 && runtime.phase === "countdown") {
        runtime.phase = "playing";
        runtime.startedAt = performance.now();
        runtime.lastAt = runtime.startedAt;
        setPhase("playing");
      }
    }, 120);
    return () => window.clearInterval(timer);
  }, [phase]);

  const startRound = () => {
    const now = performance.now();
    const runtime = createRuntime(now);
    runtime.phase = "countdown";
    runtime.countdownUntil = now + 3100;
    runtimeRef.current = runtime;
    setRoundSaved(false);
    setWinner(null);
    setLives({ self: MAX_LIVES, partner: MAX_LIVES });
    setStatus({
      tension: 18,
      storm: false,
      coop: false,
      coopHp: 0,
      coopMaxHp: 12,
      comebackFor: null,
    });
    setCountdown(3);
    setQuestion("");
    setPhase("countdown");
  };

  const shoot = () => {
    const runtime = runtimeRef.current;
    const now = performance.now();
    if (runtime.phase !== "playing" || runtime.nextShotAt > now) return;
    fire(runtime, "self", now);
    runtime.nextShotAt = now + shotCooldown(runtime, "self");
  };

  const continueAfterQuestion = () => {
    const runtime = runtimeRef.current;
    if (runtime.phase !== "question") return;
    runtime.phase = "playing";
    runtime.question = "";
    runtime.lastAt = performance.now();
    runtime.shots = [];
    runtime.nextAiShotAt = runtime.lastAt + 1800;
    runtime.nextShotAt = runtime.lastAt + shotCooldown(runtime, "self");
    runtime.self.invulnerableUntil = Math.max(runtime.self.invulnerableUntil, runtime.lastAt + 1600);
    runtime.partner.invulnerableUntil = Math.max(runtime.partner.invulnerableUntil, runtime.lastAt + 1600);
    setQuestion("");
    setPhase("playing");
  };

  const saveRound = async () => {
    if (roundSaved || !winner) return;
    const summary = createSummary(runtimeRef.current, installationId);
    await dispatch({
      type: "stressmeter.round.finished",
      actorId: installationId,
      summary,
    });
    setRoundSaved(true);
  };

  useEffect(() => {
    if (phase === "ended" && winner && !roundSaved) {
      const timeout = window.setTimeout(() => {
        void saveRound();
      }, 0);
      return () => window.clearTimeout(timeout);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, winner, roundSaved]);

  return (
    <section className={styles.game}>
      <div className={styles.panel}>
        <header className={styles.header}>
          <span className={styles.kicker}>De Stressmeter</span>
          <h1>De Spanningsvlucht</h1>
          <p>
            Raak elkaar vijf keer met lichtvonken, ontwijk obstakels en merk
            hoe jullie reageren als het even spannend wordt. Vlieg langs elkaar
            heen; daarna keren jullie automatisch om. Wie achter staat krijgt
            een beetje inhaalwind.
          </p>
        </header>

        <div className={styles.arena}>
          <div className={styles.hud}>
            <div>
              <span>{partnerName}</span>
              <b>{hearts(lives.partner)}</b>
            </div>
            <div>
              <span>Jij</span>
              <b>{hearts(lives.self)}</b>
            </div>
          </div>
          <div className={styles.tensionHud}>
            <span>{status.storm ? "Storm!" : "Spanning"}</span>
            <div>
              <i style={{ width: `${status.tension}%` }} />
            </div>
          </div>
          {status.coop && (
            <div className={styles.coopHud}>
              <span>Samen: luchtship kalmeren</span>
              <div>
                <i
                  style={{
                    width: `${(status.coopHp / Math.max(1, status.coopMaxHp)) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
          {status.comebackFor && (
            <div className={styles.comebackHud}>
              {status.comebackFor === "self"
                ? "Inhaalwind: jij beweegt sneller en schiet door obstakels"
                : `Inhaalwind voor ${partnerName}`}
            </div>
          )}
          <canvas
            aria-label="Speelveld van De Spanningsvlucht"
            className={styles.canvas}
            height={HEIGHT}
            ref={canvasRef}
            width={WIDTH}
          />
          {phase === "intro" && (
            <div className={styles.overlay}>
              <span>✈️</span>
              <h2>Klaar voor een zachte luchtduel?</h2>
              <ul className={styles.instructions}>
                <li>Beweeg met ←/→ of A/D.</li>
                <li>Houd boost/↑/W vast om sneller vooruit te vliegen.</li>
                <li>Schiet met spatie, Enter of de knop vuur ✨.</li>
                <li>Vlieg je elkaar voorbij? Dan draaien jullie vanzelf om.</li>
              </ul>
              <button className={styles.primary} onClick={startRound} type="button">
                Start
              </button>
            </div>
          )}
          {phase === "countdown" && (
            <div className={styles.countdown}>{countdown}</div>
          )}
          {phase === "question" && (
            <div className={styles.questionCard}>
              <span>Even geraakt</span>
              <p>{question}</p>
              <button onClick={continueAfterQuestion} type="button">
                Oké, verder
              </button>
            </div>
          )}
          {phase === "ended" && (
            <div className={styles.overlay}>
              <span>{winner === "self" ? "🏆" : "🛩️"}</span>
              <h2>
                {winner === "self" ? "Jij wint deze ronde" : `${partnerName} wint deze ronde`}
              </h2>
              <p>
                Ronde opgeslagen. Niet te veel analyseren: lach even, adem uit,
                en speel eventueel nog een keer.
              </p>
              <div className={styles.actions}>
                <button className={styles.primary} onClick={startRound} type="button">
                  Nog een ronde
                </button>
                <button
                  className={styles.secondary}
                  disabled={pending}
                  onClick={() =>
                    dispatch({
                      type: "stressmeter.game.completed",
                      actorId: installationId,
                    })
                  }
                  type="button"
                >
                  Terug naar kaart
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.controls}>
          <button
            onPointerDown={() => { controlsRef.current.left = true; }}
            onPointerLeave={() => { controlsRef.current.left = false; }}
            onPointerUp={() => { controlsRef.current.left = false; }}
            type="button"
          >
            ←
          </button>
          <button
            onPointerDown={() => { controlsRef.current.forward = true; }}
            onPointerLeave={() => { controlsRef.current.forward = false; }}
            onPointerUp={() => { controlsRef.current.forward = false; }}
            type="button"
          >
            boost
          </button>
          <button
            onPointerDown={() => { controlsRef.current.right = true; }}
            onPointerLeave={() => { controlsRef.current.right = false; }}
            onPointerUp={() => { controlsRef.current.right = false; }}
            type="button"
          >
            →
          </button>
          <button className={styles.fire} onClick={shoot} type="button">
            vuur ✨
          </button>
        </div>

        <footer className={styles.footer}>
          <span>{ownRounds.length} ronde{ownRounds.length === 1 ? "" : "s"} opgeslagen</span>
          <button onClick={() => openChat?.("Wat deed jij net onder spanning?")} type="button">
            Chat
          </button>
          <button onClick={() => openCall?.()} type="button">
            Bel
          </button>
          <button onClick={pauseGame} type="button">
            Bewaar en terug
          </button>
        </footer>
      </div>
    </section>
  );
}
