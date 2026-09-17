import React, { useEffect } from 'react';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '../../config/site';

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  keywords?: string;
}

const upsertMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const SEOHead: React.FC<SEOHeadProps> = ({ title, description, path, keywords }) => {
  useEffect(() => {
    const url = path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;

    document.title = title;
    upsertMeta('name', 'description', description);
    if (keywords) {
      upsertMeta('name', 'keywords', keywords);
    }

    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', DEFAULT_OG_IMAGE);
    upsertMeta('property', 'og:site_name', SITE_NAME);

    upsertMeta('property', 'twitter:title', title);
    upsertMeta('property', 'twitter:description', description);
    upsertMeta('property', 'twitter:url', url);
    upsertMeta('property', 'twitter:image', DEFAULT_OG_IMAGE);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path, keywords]);

  return null;
};

export default SEOHead;
