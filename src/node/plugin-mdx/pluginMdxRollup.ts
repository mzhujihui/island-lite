import pluginMdx from '@mdx-js/rollup';
import remarkGFM from 'remark-gfm';
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter';
import remarkPluginFrontmatter from 'remark-frontmatter';
import type { Plugin } from 'vite';

export function pluginMdxRollup() {
  return pluginMdx({
    remarkPlugins: [
      remarkGFM,
      remarkPluginFrontmatter,
      [remarkPluginMDXFrontMatter, { name: 'frontmatter' }]
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePluginAutolinkHeadings,
        {
          properties: {
            class: 'header-anchor'
          },
          content: {
            type: 'text',
            value: '#'
          }
        }
      ]
    ]
  }) as unknown as Plugin;
}
