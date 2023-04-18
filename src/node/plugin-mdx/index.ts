import { pluginMdxRollup } from './pluginMdxRollup';
import { Plugin } from 'vite';

export default async function createMdxPlugins(): Promise<Plugin> {
  return [await pluginMdxRollup()];
}
