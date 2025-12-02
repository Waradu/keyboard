/// <reference path="./index.d.ts" />

import { defineNuxtModule, addPlugin, createResolver, addImports } from "@nuxt/kit";
import type { Nuxt } from "@nuxt/schema";
import { existsSync } from "node:fs";

const DEVTOOLS_UI_ROUTE = "/__keyboard";
const DEVTOOLS_UI_LOCAL_PORT = 3300;

export interface ModuleOptions {
  debug?: boolean | undefined;
}

export default defineNuxtModule<ModuleOptions>({
  meta: { name: "@waradu/keyboard/nuxt", configKey: "keyboard" },
  defaults: {
    debug: false
  },
  setup(options: ModuleOptions, nuxt: Nuxt) {
    const { resolve } = createResolver(import.meta.url);

    nuxt.options.runtimeConfig.public.keyboard = {
      debug: options.debug ?? false
    };

    addPlugin({
      src: resolve("./runtime/plugin"),
    });

    addImports({
      as: "useKeybind",
      name: "useKeybind",
      from: resolve("./runtime/composable")
    });

    const clientPath = resolve("../../dist/client");
    const exists = existsSync(clientPath);

    if (exists) {
      nuxt.hook("vite:serverCreated", async (server) => {
        const sirv = await import("sirv").then(r => r.default || r);
        server.middlewares.use(
          DEVTOOLS_UI_ROUTE,
          sirv(clientPath, { dev: true, single: true }),
        );
      });
    } else {
      console.warn("dist/client does not exist");
    }

    nuxt.hook("devtools:customTabs", (tabs) => {
      tabs.push({
        name: "keyboard",
        title: "Keyboard",
        icon: "carbon:keyboard",
        view: {
          type: "iframe",
          src: DEVTOOLS_UI_ROUTE,
        },
      });
    });
  }
});