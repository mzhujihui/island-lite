import { Plugin } from 'vite';
import { RouteService } from './RouteService';
import { PageModule } from 'shared/types';

export interface Route {
  path: string;
  element: React.ReactElement;
  filePath: string;
  preload: () => Promise<PageModule>;
}

interface PluginOption {
  root: string;
  isSSR: boolean;
}

const virtualModuleId = 'virtual:island-routes';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

export default function pluginRoutes(options: PluginOption): Plugin {
  const routeService = new RouteService(options.root);
  return {
    name: 'island:routes',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return routeService.generateRoutesCode(options.isSSR || false);
      }
    },
    async configResolved() {
      await routeService.init();
    }
  };
}
