import { useState } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalysis } from './analysis-provider';
import { analyzeText, type Analysis } from '@/lib/sentiment';
import { fetchYoutubeComments } from '@/lib/youtube.functions';

export function YoutubeImport() {
  const { setRows, setDemo, setDatasetName } = useAnalysis();
  const fetchComments = useServerFn(fetchYoutubeComments);
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  async function run() {
    setBusy(true); setErr(''); setMsg('');
    try {
      const res = await fetchComments({ data: { url } });
      if (res.error && !res.comments.length) { setErr(res.error); return; }
      const rows: Analysis[] = [];
      let skipped = 0;
      for (const c of res.comments) {
        try { rows.push(analyzeText(c.text.slice(0, 5000), 'YouTube', c.date)); } catch { skipped++; }
      }
      if (!rows.length) { setErr('No English comments found on this video.'); return; }
      setRows(rows); setDemo(false); setDatasetName(`YouTube: ${res.title}`);
      setMsg(`${rows.length} comments analyzed · ${skipped} skipped (non-English or empty)`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Something went wrong.');
    } finally { setBusy(false); }
  }

  return (
    <section className="surface p-5 mb-5">
      <div className="flex items-center gap-2 mb-1"><Youtube size={18} className="text-negative" /><h2 className="subheading">Analyze YouTube comments</h2></div>
      <p className="small-caption mb-3">Paste a YouTube video or Shorts link. Up to 300 top comments are fetched and scored.</p>
      <div className="flex flex-wrap gap-2">
        <input aria-label="YouTube link" className="field-input flex-1 min-w-[240px] h-9" placeholder="https://www.youtube.com/watch?v=…" value={url} onChange={e => setUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && url && !busy && run()} />
        <Button className="h-9" onClick={run} disabled={!url.trim() || busy}>{busy ? 'Fetching…' : 'Fetch & analyze'}</Button>
      </div>
      {err && <p className="text-negative text-sm mt-2">{err}</p>}
      {msg && <p className="text-positive text-sm mt-2">{msg}</p>}
    </section>
  );
}
