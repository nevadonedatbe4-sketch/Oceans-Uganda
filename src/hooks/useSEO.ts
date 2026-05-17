import { useEffect } from 'react';

interface SEOMeta {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  noIndex?: boolean;
}

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://example.com';

export function useSEO(meta: SEOMeta) {
  useEffect(() => {
    const prev = {
      title: document.title,
      desc: (document.querySelector('meta[name="description"]') as HTMLMetaElement)?.content,
      keywords: (document.querySelector('meta[name="keywords"]') as HTMLMetaElement)?.content,
    };

    // Title
    document.title = meta.title;

    // Helper to set/create meta
    function setMeta(selector: string, attr: string, value: string) {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        const parts = selector.match(/\[(\w+)="([^"]+)"\]/);
        if (parts) el.setAttribute(parts[1], parts[2]);
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
      return el;
    }

    function setLink(rel: string, href: string) {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
      return el;
    }

    setMeta('meta[name="description"]', 'content', meta.description);
    if (meta.keywords) setMeta('meta[name="keywords"]', 'content', meta.keywords);
    if (meta.noIndex) {
      setMeta('meta[name="robots"]', 'content', 'noindex, nofollow');
    } else {
      setMeta('meta[name="robots"]', 'content', 'index, follow');
    }

    // Canonical
    const canonicalHref = meta.canonical ? `${SITE_URL}${meta.canonical}` : SITE_URL;
    setLink('canonical', canonicalHref);

    // OG tags
    setMeta('meta[property="og:title"]', 'content', meta.ogTitle || meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.ogDescription || meta.description);
    setMeta('meta[property="og:url"]', 'content', canonicalHref);
    setMeta('meta[property="og:type"]', 'content', meta.ogType || 'website');
    if (meta.ogImage) setMeta('meta[property="og:image"]', 'content', meta.ogImage);

    // Twitter
    setMeta('meta[name="twitter:title"]', 'content', meta.ogTitle || meta.title);
    setMeta('meta[name="twitter:description"]', 'content', meta.ogDescription || meta.description);
    if (meta.ogImage) setMeta('meta[name="twitter:image"]', 'content', meta.ogImage);

    return () => {
      document.title = prev.title;
      if (prev.desc) setMeta('meta[name="description"]', 'content', prev.desc);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.title, meta.description, meta.canonical]);
}

export function injectSchemaLD(id: string, schema: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(schema);
  return () => {
    const toRemove = document.getElementById(id);
    if (toRemove) document.head.removeChild(toRemove);
  };
}

export { SITE_URL };