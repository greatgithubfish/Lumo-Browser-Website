# Lumo website

The bilingual marketing site and user guide for Lumo Browser, published with GitHub Pages:

- Website: https://greatgithubfish.github.io/Lumo-Browser-Website/
- App Store: https://apps.apple.com/app/id6794906429
- Support: https://github.com/greatgithubfish/Lumo-Browser-Support/issues

## Content

`index.html` presents the browser, an interactive tour with real iPad and iPhone screenshots, three switchable website palettes, feature illustrations, the 6.6 update, the existing Page Shockwave recording, and the 6.0–6.5 release archive.

`support.html` retains the existing guide anchors and adds 6.6 instructions for scripts, private extension permissions, password autofill, bookmarks, iCloud sync and automatic Picture in Picture. Search, Chinese/English switching and light/dark appearance are shared through `assets/site.js` and `assets/website.css`.

The illustrative controls do not connect to accounts or read passwords. The recording plays on request and pauses when the document is hidden. No frontend build or third-party runtime is needed.

## Preview locally

```sh
python3 -m http.server 8666 --bind 127.0.0.1
```

Open `http://127.0.0.1:8666/`. Use `?lang=zh` or `?lang=en` to choose a language.

## Release status

The Chinese App Store listing reports version **6.6** as of 2026-11-27. Historical 6.5 references identify the original recording and release notes.

## Deployment and verification

GitHub Pages publishes the root of `main`. Push the reviewed website commit, then verify the Pages build and the live HTML/CSS/JS.

The redesign was checked at widths 320, 390, 768, 1024 and 1440 in both languages, with light/dark appearance, reduced motion, working demo controls, guide search, empty-search results, disclosure controls, and local asset/anchor checks.
