import { SiteConfig } from 'shared/types/index';
import { Plugin } from 'vite';
import { join, relative } from 'path';
import { PACKAGE_ROOT } from 'node/constants';
import sirv from 'sirv';

const virtualModuleId = 'virtual:island-site-data';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

export default function pluginConfig(
  config: SiteConfig,
  restartServer?: () => Promise<void>
): Plugin {
  return {
    name: 'island:config',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    config() {
      return {
        resolve: {
          alias: {
            '@runtime': join(PACKAGE_ROOT, 'src', 'runtime', 'index.ts')
          }
        },
        css: {
          modules: {
            localsConvention: 'camelCaseOnly'
          }
        }
      };
    },
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [config.configPath];
      const include = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file));

      if (include(ctx.file)) {
        console.log(
          `\n${relative(config.root, ctx.file)} changed, restarting server...`
        );
        // 重启 Dev Server
        await restartServer();
      }
    },
    configureServer(server) {
      const publicDir = join(config.root, 'public');
      server.middlewares.use(sirv(publicDir));
    }
  };
}
