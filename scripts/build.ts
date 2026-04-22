// scripts/build.ts
import { build as viteBuild } from "vite";
import { build as esbuild } from "esbuild";
import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

async function main(): Promise<void> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const rootDir = path.resolve(__dirname, "..");
  const distDir = path.join(rootDir, "dist");

  await rm(distDir, { recursive: true, force: true });

  await viteBuild({
    root: rootDir,
    logLevel: "info",
    build: {
      outDir: path.join(distDir, "public"),
      emptyOutDir: false,
    },
  });

  await esbuild({
    entryPoints: [path.join(rootDir, "server", "index.ts")],
    outfile: path.join(distDir, "index.cjs"),
    bundle: true,
    platform: "node",
    format: "cjs",
    target: "node20",
    sourcemap: true,
    minify: false,
    legalComments: "none",
    external: [
      "pg-native",
      "bufferutil",
      "utf-8-validate"
    ],
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    loader: {
      ".ts": "ts",
      ".tsx": "tsx",
      ".json": "json",
    },
  });

  console.log("Build completed successfully.");
}

main().catch((error) => {
  console.error("Build failed.");
  console.error(error);
  process.exit(1);
});
