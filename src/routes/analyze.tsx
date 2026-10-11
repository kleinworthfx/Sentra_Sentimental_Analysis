import { createFileRoute } from '@tanstack/react-router';
import { SentimentWorkspace } from '@/components/sentiment-workspace';
export const Route = createFileRoute('/analyze')({
  head: () => ({ meta: [
    { title: 'Sentra — Text & Emoji Analysis' },
    { name: 'description', content: 'Classify English words and emojis as positive, negative, or neutral with individual signal scores.' },
    { property: 'og:title', content: 'Sentra — Text & Emoji Analysis' },
    { property: 'og:description', content: 'Classify English words and emojis as positive, negative, or neutral with individual signal scores.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: () => <SentimentWorkspace view="analyze"/>,
});
