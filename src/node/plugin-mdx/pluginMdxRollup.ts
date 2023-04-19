import pluginMdx from '@mdx-js/rollup';
import remarkGFM from 'remark-gfm';
import rehypePluginAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter';
import remarkPluginFrontmatter from 'remark-frontmatter';
import rehypePluginPreWrapper from './rehypePlugins/preWrapper';
import rehypePluginShiki from './rehypePlugins/shiki';
import { getHighlighter } from 'shiki';
import remarkPluginToc from './remarkPlugins/toc';
import type { Plugin } from 'vite';

export async function pluginMdxRollup() {
  return pluginMdx({
    remarkPlugins: [
      remarkGFM,
      remarkPluginFrontmatter,
      [remarkPluginMDXFrontMatter, { name: 'frontmatter' }],
      remarkPluginToc
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
      ],
      rehypePluginPreWrapper,
      [
        rehypePluginShiki,
        {
          highlighter: await getHighlighter({
            theme: 'nord'
          })
        }
      ]
    ]
  }) as unknown as Plugin;
}
