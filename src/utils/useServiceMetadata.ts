import { useLayoutEffect } from 'react';
import { SERVICE_SEO, SITE_ORIGIN } from '../data/serviceSeo';

export function useServiceMetadata(path: string | undefined) {
  useLayoutEffect(() => {
    const metadata = path ? SERVICE_SEO.get(path) : undefined;
    if (!metadata) return;

    const previousTitle = document.title;
    const tags = [
      ['meta[name="description"]', metadata.description],
      ['meta[property="og:title"]', metadata.title],
      ['meta[property="og:description"]', metadata.description],
    ];
    const previousTags = tags.map(([selector, content]) => {
      const tag = document.querySelector<HTMLMetaElement>(selector);
      const previous = tag?.content;
      if (tag) tag.content = content;
      return { tag, previous };
    });

    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = `${SITE_ORIGIN}${path}`;
    document.head.append(canonical);
    document.title = metadata.title;

    return () => {
      document.title = previousTitle;
      for (const { tag, previous } of previousTags) {
        if (tag && previous !== undefined) tag.content = previous;
      }
      canonical.remove();
    };
  }, [path]);
}
