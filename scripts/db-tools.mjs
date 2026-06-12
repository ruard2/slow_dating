import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

export const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://slowdating:slowdating@127.0.0.1:5432/slowdating";

function commandPath(command) {
  if (
    command === "docker" &&
    process.platform === "win32" &&
    existsSync("C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe")
  ) {
    return "C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe";
  }
  return process.platform === "win32" && command === "npm"
    ? "npm.cmd"
    : command;
}

export function run(command, args, options = {}) {
  const result = spawnSync(commandPath(command), args, {
    cwd: options.cwd,
    env: { ...process.env, DATABASE_URL: databaseUrl, ...options.env },
    encoding: "utf8",
    stdio: options.capture ? "pipe" : "inherit",
  });
  if (result.status !== 0) {
    const detail = options.capture
      ? `\n${result.stdout ?? ""}\n${result.stderr ?? ""}`
      : "";
    throw new Error(
      `${command} ${args.join(" ")} is mislukt met code ${result.status}.${detail}`,
    );
  }
  return result.stdout?.trim() ?? "";
}

export function compose(...args) {
  return run("docker", ["compose", ...args]);
}
