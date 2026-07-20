import React, { useEffect } from 'react';

export default function Root({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const _hmt: any[] = [];
    (function () {
      var hm = document.createElement('script');
      hm.src = 'https://hm.baidu.com/hm.js?5039b7192683967aa1b4e9f8a4a9716a';
      var s = document.getElementsByTagName('script')[0];
      if (s.parentNode) {
        s.parentNode.insertBefore(hm, s);
      }
    })();
  }, []);

  return <>{children}</>;
}
