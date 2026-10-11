import { createFileRoute } from "@tanstack/react-router";
import { SentimentWorkspace } from '@/components/sentiment-workspace';
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: 'Sentra — Sentiment Analytics Dashboard' },
    { name: 'description', content: 'Analyze English words and emojis with professional sentiment charts, dataset analysis, and insights.' },
    { property: 'og:title', content: 'Sentra — Sentiment Analytics Dashboard' },
    { property: 'og:description', content: 'Explore positive, negative, and neutral sentiment in English feedback and emojis.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});
function Index() { return <SentimentWorkspace view="overview"/>; }
