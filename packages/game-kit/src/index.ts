import type { ComponentType } from "react";

export type GameMode = "solo" | "couple";

export interface GameComponentProps<TState> {
  state: TState;
}

export interface GameDefinition<TState, TResult> {
  id: string;
  version: number;
  modes: GameMode[];
  createInitialState(): TState;
  validateContent(): void;
  serializeResult(state: TState): TResult;
  Component: ComponentType<GameComponentProps<TState>>;
}
