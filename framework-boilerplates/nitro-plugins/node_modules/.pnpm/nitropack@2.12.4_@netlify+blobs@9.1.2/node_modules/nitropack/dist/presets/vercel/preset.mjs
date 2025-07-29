import { defineNitroPreset } from "nitropack/kit";
import {
  deprecateSWR,
  generateEdgeFunctionFiles,
  generateFunctionFiles,
  generateStaticFiles
} from "./utils.mjs";
import { builtnNodeModules } from "../_unenv/node-compat/vercel.mjs";
const vercel = defineNitroPreset(
  {
    extends: "node",
    entry: "./runtime/vercel",
    output: {
      dir: "{{ rootDir }}/.vercel/output",
      serverDir: "{{ output.dir }}/functions/__nitro.func",
      publicDir: "{{ output.dir }}/static/{{ baseURL }}"
    },
    commands: {
      preview: "",
      deploy: "npx vercel deploy --prebuilt"
    },
    hooks: {
      "rollup:before": (nitro) => {
        deprecateSWR(nitro);
      },
      async compiled(nitro) {
        await generateFunctionFiles(nitro);
      }
    }
  },
  {
    name: "vercel",
    stdName: "vercel",
    url: import.meta.url
  }
);
const vercelEdge = defineNitroPreset(
  {
    extends: "base-worker",
    entry: "./runtime/vercel-edge",
    exportConditions: ["edge-light"],
    output: {
      dir: "{{ rootDir }}/.vercel/output",
      serverDir: "{{ output.dir }}/functions/__nitro.func",
      publicDir: "{{ output.dir }}/static/{{ baseURL }}"
    },
    commands: {
      preview: "",
      deploy: "npx vercel deploy --prebuilt"
    },
    unenv: {
      external: builtnNodeModules.flatMap((m) => `node:${m}`),
      alias: {
        ...Object.fromEntries(
          builtnNodeModules.flatMap((m) => [
            [m, `node:${m}`],
            [`node:${m}`, `node:${m}`]
          ])
        )
      }
    },
    rollupConfig: {
      output: {
        format: "module"
      }
    },
    wasm: {
      lazy: true,
      esmImport: false
    },
    hooks: {
      "rollup:before": (nitro) => {
        deprecateSWR(nitro);
      },
      async compiled(nitro) {
        await generateEdgeFunctionFiles(nitro);
      }
    }
  },
  {
    name: "vercel-edge",
    url: import.meta.url
  }
);
const vercelStatic = defineNitroPreset(
  {
    extends: "static",
    output: {
      dir: "{{ rootDir }}/.vercel/output",
      publicDir: "{{ output.dir }}/static/{{ baseURL }}"
    },
    commands: {
      preview: "npx serve {{ output.publicDir }}",
      deploy: "npx vercel deploy --prebuilt"
    },
    hooks: {
      "rollup:before": (nitro) => {
        deprecateSWR(nitro);
      },
      async compiled(nitro) {
        await generateStaticFiles(nitro);
      }
    }
  },
  {
    name: "vercel-static",
    stdName: "vercel",
    static: true,
    url: import.meta.url
  }
);
export default [vercel, vercelEdge, vercelStatic];
