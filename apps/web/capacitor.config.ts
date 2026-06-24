import type { CapacitorConfig } from "@capacitor/cli";

// Na eerste Railway-deploy: zet hier je Railway-URL
const RAILWAY_URL = "https://JOUW-APP.railway.app";

const config: CapacitorConfig = {
  appId: "nl.slowdating.app",
  appName: "Slow Dating",
  webDir: "dist",
  server: {
    url: RAILWAY_URL,
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
