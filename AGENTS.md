<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the sentiment workspace in a shared presentation module with distinct TanStack content routes so navigation preserves a consistent dashboard.
- Keep analysis state in a root React provider, in memory only, because imported feedback remains private and export is the retention path.
- Use the tested English AFINN library for word polarity and grapheme-segmented emoji scoring; do not label lexicon scores as model confidence or generative AI.
