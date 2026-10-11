import { createFileRoute } from '@tanstack/react-router';
import { SentimentWorkspace } from '@/components/sentiment-workspace';
export const Route = createFileRoute('/insights')({
  head: () => ({ meta: [
    { title: 'Sentra — Data Insights' },
    { name: 'description', content: 'Discover trends, recurring sentiment signals, and conflicting word and emoji expressions.' },
    { property: 'og:title', content: 'Sentra — Data Insights' },
    { property: 'og:description', content: 'Discover trends, recurring sentiment signals, and conflicting word and emoji expressions.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: () => <SentimentWorkspace view="insights"/>,
});
