// Date-tabbed static content viewer.
//
// How it works (important for the daily-new-file workflow):
//   1. content/manifest.json lists every entry, newest first.
//   2. Each entry points at a markdown file in content/.
//   3. To publish a new day: drop content/YYYY-MM-DD.md and add ONE line
//      to manifest.json. The newest entry automatically becomes the
//      default selected tab.

const MANIFEST_URL = "content/manifest.json";

const tabsEl = document.getElementById("tabs");
const contentEl = document.getElementById("content");
const footerEl = document.getElementById("footer-note");

async function loadManifest() {
  const res = await fetch(MANIFEST_URL, { cache: "no-cache" });
  if (!res.ok) throw new Error(`manifest ${res.status}`);
  const entries = await res.json();
  // Newest first, regardless of file order.
  entries.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return entries;
}

async function renderEntry(entry) {
  contentEl.innerHTML = '<p class="loading">Loading…</p>';
  try {
    const res = await fetch(`content/${entry.file}`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`content ${res.status}`);
    const md = await res.text();
    contentEl.innerHTML = marked.parse(md);
  } catch (err) {
    contentEl.innerHTML = `<p class="error">Could not load ${entry.file} (${err.message}).</p>`;
  }
}

function setActive(date) {
  document.querySelectorAll(".tab").forEach((b) => {
    b.classList.toggle("active", b.dataset.date === date);
  });
  // Keep the URL hash in sync so a date can be deep-linked.
  if (location.hash.slice(1) !== date) {
    history.replaceState(null, "", `#${date}`);
  }
}

function buildTabs(entries) {
  tabsEl.innerHTML = "";
  entries.forEach((entry) => {
    const btn = document.createElement("button");
    btn.className = "tab";
    btn.dataset.date = entry.date;
    btn.innerHTML = `${entry.date}<span class="tab-title">${entry.title || ""}</span>`;
    btn.addEventListener("click", () => {
      setActive(entry.date);
      renderEntry(entry);
    });
    tabsEl.appendChild(btn);
  });
}

async function init() {
  let entries;
  try {
    entries = await loadManifest();
  } catch (err) {
    contentEl.innerHTML = `<p class="error">Could not load content list (${err.message}).</p>`;
    return;
  }
  if (!entries.length) {
    contentEl.innerHTML = '<p class="error">No content yet.</p>';
    return;
  }

  buildTabs(entries);

  // Default to the date in the URL hash if it exists, else the latest entry.
  const wanted = location.hash.slice(1);
  const selected = entries.find((e) => e.date === wanted) || entries[0];

  setActive(selected.date);
  renderEntry(selected);

  footerEl.textContent = `${entries.length} entr${entries.length === 1 ? "y" : "ies"} · latest ${entries[0].date}`;
}

init();
