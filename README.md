# Portfolio Site Scaffold

A static site built around a technical-drawing / engineering title-block aesthetic —
fits an ME/aero portfolio better than a generic template.

## Files
- `index.html` — all page content (hero, projects, skills-as-BOM, contact)
- `style.css` — all styling
- `script.js` — tiny script that stamps today's date into the footer
- `resume.pdf` — **you need to add this** (export your resume as a PDF with exactly this filename)

## Before you deploy — replace these placeholders
1. In `index.html`, swap the four `<article class="project-card">` blocks for
   your real projects. Duplicate the block for more projects.
2. Update every `href="#"` link — GitHub repo links, LinkedIn, case-study links.
3. Replace `YOUR-USERNAME` and `YOUR-HANDLE` in the footer with your real GitHub/LinkedIn.
4. Drop your resume PDF into this folder as `resume.pdf`.

## How to deploy on GitHub Pages
See the step-by-step walkthrough in chat — short version:
1. Create a repo named exactly `yourusername.github.io`
2. Push these files to the `main` branch (root of the repo, not a subfolder)
3. Go to Settings → Pages → confirm source is `main` / `/ (root)`
4. Your site goes live at `https://yourusername.github.io` within a minute or two
