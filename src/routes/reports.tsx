import { createFileRoute } from '@tanstack/react-router';
import { SentimentWorkspace } from '@/components/sentiment-workspace';
export const Route = createFileRoute('/reports')({
  head: () => ({ meta: [
    { title: 'Sentra — Sentiment Reports' },
    { name: 'description', content: 'Export professional sentiment insight reports and scored feedback datasets.' },
    { property: 'og:title', content: 'Sentra — Sentiment Reports' },
    { property: 'og:description', content: 'Export professional sentiment insight reports and scored feedback datasets.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: () => <SentimentWorkspace view="reports"/>,
});
