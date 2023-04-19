import { defineConfig } from '../dist/index.mjs';
import { ThemeConfig } from '../src/shared/types/index';

export default defineConfig({
  title: 'Island.js',
  themeConfig: {
    nav: [
      {
        text: '主页',
        link: '/'
      },
      {
        text: '指南',
        link: '/guide'
      },
    ]
  }
})