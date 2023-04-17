"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = exports.renderPage = exports.bundle = void 0;
const vite_1 = require("vite");
const constants_1 = require("./constants");
const path = require("path");
const fs = require("fs-extra");
const plugin_react_1 = require("@vitejs/plugin-react");
async function bundle(root) {
    try {
        const resolveViteConfig = (isServer) => {
            return {
                mode: "production",
                root,
                plugins: [(0, plugin_react_1.default)()],
                build: {
                    ssr: isServer,
                    outDir: isServer ? ".temp" : "build",
                    rollupOptions: {
                        input: isServer ? constants_1.SERVER_ENTRY_PATH : constants_1.CLIENT_ENTRY_PATH,
                        output: {
                            format: isServer ? "cjs" : "esm"
                        }
                    }
                }
            };
        };
        console.log("Building client + server bundles...");
        const [clientBundle, serverBundle] = await Promise.all([
            // client build
            (0, vite_1.build)(resolveViteConfig(false)),
            // server build
            (0, vite_1.build)(resolveViteConfig(true))
        ]);
        return [clientBundle, serverBundle];
    }
    catch (e) {
        console.log(e);
    }
}
exports.bundle = bundle;
async function renderPage(render, root, clientBundle) {
    const appHtml = render();
    const clientChunk = clientBundle.output.find((chunk) => chunk.type === 'chunk' && chunk.isEntry);
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
exports.renderPage = renderPage;
async function build(root = process.cwd()) {
    // 1. bundle - client 端 + server 端
    const [clientBundle] = await bundle(root);
    // 2. 引入 server-entry 模块
    const serverEntryPath = path.resolve(root, ".temp", "ssr-entry.js");
    // 3. 服务端渲染，产出 HTML
    const { render } = require(serverEntryPath);
    await renderPage(render, root, clientBundle);
}
exports.build = build;
