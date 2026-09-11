import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.dawitbekalu.faithmark",
  appName: "Faith Mark",
  webDir: ".output/public",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https"
  }
};

export default config;
