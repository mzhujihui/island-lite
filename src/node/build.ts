import { InlineConfig, build as viteBuild } from 'vite'
import { CLIENT_ENTRY_PATH, SERVER_ENTRY_PATH } from './constants'
import type { RollupOutput } from "rollup";
import * as path from "path";
import * as fs from "fs-extra";
import pluginReact from '@vitejs/plugin-react';

export async function bundle(root: string) {
  try {
    const resolveViteConfig = (isServer: boolean): InlineConfig => {
      return {
        mode: "production",
        root,
        plugins: [pluginReact()],
        build: {
          ssr: isServer,
          outDir: isServer ? ".temp" : "build",
          rollupOptions: {
            input: isServer ? SERVER_ENTRY_PATH : CLIENT_ENTRY_PATH,
            output: {
              format: isServer ? "cjs" : "esm"
            }
          }
        }
      }
    }
    console.log("Building client + server bundles...")
    const [clientBundle, serverBundle] = await Promise.all([
      // client build
      viteBuild(resolveViteConfig(false)),
      // server build
      viteBuild(resolveViteConfig(true))
    ]);
    return [clientBundle, serverBundle] as [RollupOutput, RollupOutput];
  } catch(e) {
    console.log(e)
  }
}

export async function renderPage(
  render: () => string,
  root: string,
  clientBundle: RollupOutput
) {
  const appHtml = render();
  const clientChunk = clientBundle.output.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  );
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <title>title</title>
        <meta name="description" content="xxx">
      </head>
      <body>
        <div id="root">${appHtml}</div>
        <script type="module" src="/${clientChunk?.fileName}"></script>
      </body>
    </html>`
  .trim();
  await fs.writeFile(path.join(root, "build", "index.html"), html);
  await fs.remove(path.join(root, ".temp"));
}

export async function build(root: string = process.cwd()) {
  // 1. bundle - client 端 + server 端
  const [clientBundle] = await bundle(root);
  // 2. 引入 server-entry 模块
  const serverEntryPath = path.resolve(root, ".temp", "ssr-entry.js");
  // 3. 服务端渲染，产出 HTML
  const { render } = require(serverEntryPath);
  await renderPage(render, root, clientBundle);
}