# Daily Content — static site test

A static, date-tabbed page for GitHub Pages. Each day is one markdown file.
The landing page always opens to the **latest** date.

## Files

```
index.html              # page shell
assets/style.css        # styling
assets/app.js           # reads the manifest, builds tabs, renders markdown
content/manifest.json   # list of entries (newest first)
content/YYYY-MM-DD.md   # one file per day
```

## Adding a new day

This is the part you wanted to confirm works:

1. Create `content/YYYY-MM-DD.md` with that day's content.
2. Add one line to `content/manifest.json`, e.g.:
   ```json
   { "date": "2026-06-19", "file": "2026-06-19.md", "title": "Day three" }
   ```
3. Commit and push.

A new tab appears for that date, and since it's the newest it becomes the
default tab on the landing page. (App.js sorts by date, so the line's
position in the file doesn't matter.)

## Hosting on GitHub Pages

1. Push this repo to GitHub.
2. Repo **Settings → Pages**.
3. **Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Wait ~1 min, then open `https://<user>.github.io/<repo>/`.

No build step — GitHub serves the files as-is.

## Run locally

GitHub Pages serves over HTTP, and `fetch()` needs that (it fails on
`file://`), so use a local server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
