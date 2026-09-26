import { useEffect } from 'react';
import type { AppView } from '../types';

const siteUrl = 'https://ai.cyvorastudio.com/';
const landingMetadata = {
  title: 'Cyvora AI | AI Technology Copilot for Cloud, DevOps & Code',
  description:
    'Solve technical problems with Cyvora AI, your technology copilot for cloud, code, Linux, DevOps, data, and generative AI.',
};

const privatePageTitles: Partial<Record<AppView, string>> = {
  signin: 'Sign in | Cyvora AI',
  workspace: 'Workspace | Cyvora AI',
  workflows: 'AI Workflows | Cyvora AI',
  knowledge: 'Saved Knowledge | Cyvora AI',
  history: 'Conversation History | Cyvora AI',
  settings: 'Settings | Cyvora AI',
};

function setMeta(attributes: Record<string, string>, content: string) {
  const selector = Object.entries(attributes)
    .map(([key, value]) => `[${key}="${value}"]`)
    .join('');
  let element = document.head.querySelector<HTMLMetaElement>(`meta${selector}`);

  if (!element) {
    element = document.createElement('meta');
    Object.entries(attributes).forEach(([key, value]) => element?.setAttribute(key, value));
    document.head.appendChild(element);
  }

  element.content = content;
}

export function SEO({ view }: { view: AppView }) {
  useEffect(() => {
    const isPublicLandingPage = view === 'landing';
    const title = isPublicLandingPage
      ? landingMetadata.title
      : privatePageTitles[view] ?? 'Cyvora AI';
    const description = isPublicLandingPage
      ? landingMetadata.description
      : 'Sign in to access your Cyvora AI workspace and personalized technical copilot tools.';
    const robots = isPublicLandingPage ? 'index, follow' : 'noindex, nofollow';

    document.title = title;
    setMeta({ name: 'description' }, description);
    setMeta({ name: 'robots' }, robots);
    setMeta({ property: 'og:title' }, title);
    setMeta({ property: 'og:description' }, description);
    setMeta({ property: 'og:type' }, 'website');
    setMeta({ property: 'og:site_name' }, 'Cyvora AI');
    setMeta({ property: 'og:url' }, siteUrl);
    setMeta({ name: 'twitter:card' }, 'summary');
    setMeta({ name: 'twitter:title' }, title);
    setMeta({ name: 'twitter:description' }, description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (isPublicLandingPage) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = siteUrl;
    } else {
      canonical?.remove();
    }

    let structuredData = document.head.querySelector<HTMLScriptElement>(
      'script[data-cyvora-structured-data]',
    );
    if (isPublicLandingPage) {
      if (!structuredData) {
        structuredData = document.createElement('script');
        structuredData.type = 'application/ld+json';
        structuredData.dataset.cyvoraStructuredData = 'true';
        document.head.appendChild(structuredData);
      }
      structuredData.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Cyvora AI',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        url: siteUrl,
        description: landingMetadata.description,
      });
    } else {
      structuredData?.remove();
    }
  }, [view]);

  return null;
}
