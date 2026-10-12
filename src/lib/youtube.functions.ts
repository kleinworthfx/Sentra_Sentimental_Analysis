import { createServerFn } from '@tanstack/react-start';

export function extractVideoId(url: string): string | null {
  const s = url.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return m?.[1] ?? null;
}

type Thread = { snippet: { topLevelComment: { snippet: { textOriginal: string; publishedAt: string } } } };

export const fetchYoutubeComments = createServerFn({ method: 'POST' })
  .inputValidator((d: { url: string }) => {
    if (typeof d?.url !== 'string' || d.url.length > 500) throw new Error('Paste a valid YouTube link.');
    return d;
  })
  .handler(async ({ data }) => {
    const id = extractVideoId(data.url);
    if (!id) return { error: 'That does not look like a YouTube video link.', comments: [], title: '' };
    const key = process.env.GOOGLE_API_KEY;
    if (!key) return { error: 'YouTube access is not configured.', comments: [], title: '' };
    const vid = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${key}`);
    const vj: any = await vid.json();
    if (!vid.ok) return { error: vj?.error?.message ?? 'Could not reach YouTube.', comments: [], title: '' };
    const title: string = vj.items?.[0]?.snippet?.title ?? '';
    if (!title) return { error: 'Video not found or private.', comments: [], title: '' };
    const comments: { text: string; date: string }[] = [];
    let pageToken = '';
    for (let i = 0; i < 3; i++) {
      const r = await fetch(`https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&maxResults=100&order=relevance&textFormat=plainText&videoId=${id}&key=${key}${pageToken ? `&pageToken=${pageToken}` : ''}`);
      const j: any = await r.json();
      if (!r.ok) {
        const reason = j?.error?.errors?.[0]?.reason;
        return { error: reason === 'commentsDisabled' ? 'Comments are turned off for this video.' : (j?.error?.message ?? 'Could not load comments.'), comments, title };
      }
      for (const t of (j.items ?? []) as Thread[]) {
        const c = t.snippet.topLevelComment.snippet;
        comments.push({ text: c.textOriginal, date: c.publishedAt });
      }
      if (!j.nextPageToken) break;
      pageToken = j.nextPageToken;
    }
    return { error: '', comments, title };
  });
