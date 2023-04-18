import { visit } from 'unist-util-visit';
import { fromHtml } from 'hast-util-from-html';
import shiki from 'shiki';
import type { Plugin } from 'unified';
import type { Text, Root } from 'hast';

interface Options {
  highlighter: shiki.Highlighter;
}

const rehypePluginShiki: Plugin<[Options], Root> = ({ highlighter }) => {
  return (tree) => {
    // <pre><code>...</code></pre>
    visit(tree, 'element', (node, index, parent) => {
      if (
        node.tagName === 'pre' &&
        node.children[0]?.type === 'element' &&
        node.children[0].tagName === 'code'
      ) {
        const codeNode = node.children[0];
        const codeContent = (codeNode.children[0] as Text).value;
        const codeClassName = codeNode.properties?.className?.toString() || '';

        const lang = codeClassName.split('-')[1];
        if (!lang) {
          return;
        }
        const highlightedCode = highlighter.codeToHtml(codeContent, { lang });
        const fragmentAst = fromHtml(highlightedCode, { fragment: true });
        parent.children.splice(index, 1, ...fragmentAst.children);
      }
    });
  };
};

export default rehypePluginShiki;
