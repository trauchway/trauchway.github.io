# trauchway.github.io

Personal engineering portfolio for Teddy Rauchway — live at **[trauchway.github.io](https://trauchway.github.io)**.

Plain HTML/CSS/JS, no framework or build step, deployed directly from `main` via GitHub Pages.
The design leans on a technical-drawing / title-block aesthetic (corner brackets, mono-spaced
callouts, revision stamps) rather than a generic portfolio template.

## Structure

```
index.html              Homepage — hero, project grid, skills-as-BOM, contact
f1wing.html             Project page — F1 front wing CFD study
uav.html                Project page — LIDAR hexacopter + scratch-built autopilot aircraft
makerspace.html         Project page — Iron Man Mark III helmet build
icr-enclosure.html      Project page — ICR motorized enclosure redesign (text + line drawing only)
style.css               All styling (shared across every page)
script.js               Shared behavior: footer date stamp, photo lightbox, homepage hero video reel

assets/
  homescreen_media/     Homepage hero background clips (see below)
  f1wing/, uav/, makerspace/    Per-project images, video, and CAD/CFD exports
  resume.pdf, *.pdf      Resume, deck, and poster downloads linked from the site
```

There's no CMS and no templating — adding a project means duplicating the closest existing
`.html` page and its `<article class="project-card">` entry on `index.html`.

## Homepage hero video reel

The homepage background is a looping, cross-fading sequence of clips read from
`assets/homescreen_media/`. The playlist isn't hand-coded — on every page load,
`script.js` calls the GitHub API to list whatever video files currently exist in that
folder on `main` and builds the loop from them. If that lookup fails (offline, GitHub API
rate-limited), it falls back to a hardcoded filename list near the top of `script.js`; if
that also comes up empty, the hero just keeps its plain dark background — it never breaks.

**To add a clip:** compress it first, then drop it in and push.

```bash
ffmpeg -i input.mov -vf "scale=-2:1080" -c:v libx264 -preset medium -crf 28 \
  -pix_fmt yuv420p -an -movflags +faststart assets/homescreen_media/output.mp4

git add assets/homescreen_media/output.mp4
git commit -m "Add clip to homepage reel"
git push
```

Notes:
- Landscape (16:9) footage reads best — the background uses `object-fit: cover`, so portrait
  clips get cropped/zoomed to fill a wide viewport.
- Supported extensions: `.mp4`, `.webm`, `.m4v`.
- Raw, uncompressed source footage lives in `assets/homescreen_media/_source/` locally and is
  gitignored — never pushed, kept only as a backup for re-encoding.
- If you rename or remove a clip, update the fallback list in `script.js` to match.

## Local preview

Any static file server works:

```bash
python -m http.server 4507
```

then open `http://localhost:4507`. `.claude/launch.json` already points Claude Code's preview
tooling at this command.

## Deployment

Already configured — GitHub Pages serves directly from the `main` branch root. Pushing to
`main` is the only deploy step; the live site updates within a minute or two.
