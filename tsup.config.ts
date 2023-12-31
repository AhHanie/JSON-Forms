import { defineConfig } from "tsup";

export default defineConfig({
  target: "es2020",
  format: ["cjs", "esm"],
  clean: true,
  dts: {
    banner: `/// <reference path="types.d.ts" />`,
  },
  minify: true,
});
