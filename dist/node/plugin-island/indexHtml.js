"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginIndexHtml = void 0;
const promises_1 = require("fs/promises");
const index_1 = require("../constants/index");
function pluginIndexHtml() {
    return {
        name: "island:index-html",
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const content = await (0, promises_1.readFile)(index_1.DEFAULT_TEMPLATE_PATH, "utf-8");
                res.setHeader('Content-Type', 'text/html');
                res.end(content);
            });
        }
    };
}
exports.pluginIndexHtml = pluginIndexHtml;
