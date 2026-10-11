import { createFileRoute } from '@tanstack/react-router';
import { SentimentWorkspace } from '@/components/sentiment-workspace';
export const Route = createFileRoute('/datasets')({
  head: () => ({ meta: [
    { title: 'Sentra — Sentiment Datasets' },
    { name: 'description', content: 'Import CSV feedback and explore English sentiment results with filters and exports.' },
    { property: 'og:title', content: 'Sentra — Sentiment Datasets' },
    { property: 'og:description', content: 'Import CSV feedback and explore English sentiment results with filters and exports.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: () => <SentimentWorkspace view="datasets"/>,
});
