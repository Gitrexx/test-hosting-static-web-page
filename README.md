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

You only need to add the markdown file:

1. Create `content/YYYY-MM-DD.md` with that day's content.
2. Commit and push to `main`.

That's it. The GitHub Actions workflow (`.github/workflows/build-manifest.yml`)
runs `scripts/build_manifest.py`, which rebuilds `content/manifest.json` from
the `content/*.md` files and commits it back. A new tab then appears for that
date, and since it's the newest it becomes the default tab.

- `date`  = the filename (without `.md`), so name files `YYYY-MM-DD.md`
- `title` = the first `# heading` in the file (falls back to the date)

### Regenerating the manifest by hand

The workflow does this automatically, but you can also run it locally:

```bash
python3 scripts/build_manifest.py
```

> First-run note: GitHub Actions needs write permission to commit the manifest
> back. Repo **Settings → Actions → General → Workflow permissions** → select
> **Read and write permissions**.

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
