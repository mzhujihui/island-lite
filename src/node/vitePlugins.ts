import pluginIndexHtml from './plugin-island/indexHtml';
import pluginConfig from './plugin-island/config';
import pluginReact from '@vitejs/plugin-react';
import pluginRoutes from './plugin-routes';
import { SiteConfig } from 'shared/types';
import { createMdxPlugins } from './plugin-mdx';
import type { Plugin } from 'vite';

export function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>
) {
  return [
    pluginIndexHtml(),
    pluginReact(),
    pluginConfig(config, restartServer),
    pluginRoutes({
      root: config.root
    }),
    createMdxPlugins()
  ] as Plugin[];
}
