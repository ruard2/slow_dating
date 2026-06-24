import type { ComponentType } from "react";

export type GameMode = "couple";

export interface GameComponentProps<TState, TAction = unknown> {
  state: TState;
  installationId: string;
  memberIds: string[];
  partnerName: string;
  pending: boolean;
  christianLayer?: boolean;
  priorQualityOptions?: string[];
  priorAllergyOptions?: string[];
  priorFamilyData?: Record<string, unknown> | null;
  openChat?(text?: string): void;
  openCall?(): void;
  pauseGame?(): void;
  restartGame?(): void;
  dispatch(action: TAction): Promise<void>;
}

export interface GameDefinition<TState, TResult, TAction = unknown> {
  id: string;
  version: number;
  modes: GameMode[];
  createInitialState(): TState;
  validateContent(): void;
  serializeResult(state: TState): TResult;
  Component: ComponentType<GameComponentProps<TState, TAction>>;
}
