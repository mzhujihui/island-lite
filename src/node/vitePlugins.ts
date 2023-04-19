import pluginIndexHtml from './plugin-island/indexHtml';
import pluginConfig from './plugin-island/config';
import pluginReact from '@vitejs/plugin-react';
import pluginRoutes from './plugin-routes';
import pluginMdx from './plugin-mdx';
import pluginUnocss from 'unocss/vite';
import unocssOptions from './unocssOPtions';
import { SiteConfig } from 'shared/types';
import type { Plugin } from 'vite';

export async function createVitePlugins(
  config: SiteConfig,
  restartServer?: () => Promise<void>,
  isSSR = false
) {
  return [
    pluginUnocss(unocssOptions),
    pluginIndexHtml(),
    pluginReact(),
    pluginConfig(config, restartServer),
    pluginRoutes({
      root: config.root,
      isSSR
    }),
    await pluginMdx()
  ] as Plugin[];
}
