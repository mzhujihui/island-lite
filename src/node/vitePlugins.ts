import pluginIndexHtml from './plugin-island/indexHtml';
import pluginConfig from './plugin-island/config';
import pluginReact from '@vitejs/plugin-react';
import pluginRoutes from './plugin-routes';
import pluginMdx from './plugin-mdx';
import { SiteConfig } from 'shared/types';
import type { Plugin } from 'vite';

export async function createVitePlugins(
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
    await pluginMdx()
  ] as Plugin[];
}
