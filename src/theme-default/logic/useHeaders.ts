import { useEffect, useState } from 'react';
import { Header } from 'shared/types/index';

export function useHeaders(initHeaders: Header) {
  const [headers, setHeaders] = useState(initHeaders);

  useEffect(() => {
    if (import.meta.env.DEV) {
      import.meta.hot.on('mdx-change', ({ filePath }: { filePath: string }) => {
        console.log('更新的 mdx 文件路径', filePath);
      });
    }
  });
  return headers;
}
