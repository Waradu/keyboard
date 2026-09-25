import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [
    "src/index",
    "src/keyboard",
    "src/keybind",
    "src/helper",
    "src/keys",
    "src/types",
    "src/nuxt/module",
    "src/nuxt/runtime/composables",
    "src/nuxt/runtime/directives",
    "src/nuxt/runtime/plugin",
  ],
  declaration: "compatible",
  clean: true,
  externals: ["@nuxt/kit", "@nuxt/schema", "nuxt/app", "vue"],
});
