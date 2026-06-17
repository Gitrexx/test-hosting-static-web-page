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

That's it. The Pages deploy workflow (`.github/workflows/static.yml`) runs
`scripts/build_manifest.py` on every push, which rebuilds the manifest from the
`content/*.md` files and bundles it into the deployed site. A new tab then
appears for that date, and since it's the newest it becomes the default tab.

- `date`  = the filename (without `.md`), so name files `YYYY-MM-DD.md`
- `title` = the first `# heading` in the file (falls back to the date)

The manifest is generated at deploy time, so the copy committed in the repo is
just a convenience for local viewing — you don't need to keep it in sync.

### Regenerating the manifest locally

```bash
python3 scripts/build_manifest.py
```

## Hosting on GitHub Pages

1. Push this repo to GitHub.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/static.yml`, which builds the
   manifest and deploys the site.
4. Open `https://<user>.github.io/<repo>/` once the Actions run finishes.

## Run locally

GitHub Pages serves over HTTP, and `fetch()` needs that (it fails on
`file://`), so use a local server:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```
