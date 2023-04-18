import { Plugin } from 'vite';
import { RouteService } from './RouteService';

interface PluginOption {
  root: string;
}

const virtualModuleId = 'virtual:island-routes';
const resolvedVirtualModuleId = '\0' + virtualModuleId;

export function pluginRoutes(options: PluginOption): Plugin {
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
        return routeService.generateRoutesCode();
      }
    },
    async configResolved() {
      await routeService.init();
    }
  };
}
