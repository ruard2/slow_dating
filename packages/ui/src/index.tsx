import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  PropsWithChildren,
} from "react";

import buttonStyles from "./Button.module.css";
import surfaceStyles from "./Surface.module.css";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps) {
  const classes = [buttonStyles.button, className].filter(Boolean).join(" ");

  return <button className={classes} {...props} />;
}

export type SurfaceProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Surface({ className, ...props }: SurfaceProps) {
  const classes = [surfaceStyles.surface, className].filter(Boolean).join(" ");

  return <div className={classes} {...props} />;
}
