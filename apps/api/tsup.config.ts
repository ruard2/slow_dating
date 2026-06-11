import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  clean: true,
  dts: false,
  format: ["esm"],
  noExternal: ["@slow-dating/config", "@slow-dating/contracts"],
  platform: "node",
  sourcemap: true,
  target: "node22",
});
