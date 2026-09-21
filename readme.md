# smallmarket

A simple browser-based marketplace — browse listings, search, filter by category, and list your own items for sale. Built with plain HTML, CSS, and JavaScript — no backend or database required.

🔗 **Live site:** https://aklilut40-code.github.io/smallmarket

## About

Everything is saved right in the browser (using `localStorage`), so there's nothing to host or configure beyond the static files themselves. You can:

- Browse and search products, filter by category
- Tap **+ Sell an item** to list something — name, description, price, category, location, contact info, and an optional photo
- Save products you're interested in
- Delete listings you've added

## Tech

- HTML5 / CSS3
- Vanilla JavaScript
- Hosted for free with [GitHub Pages](https://pages.github.com/)

## Structure

```
smallmarket/
├── index.html   # page structure
├── style.css    # styling
├── app.js       # all the logic
└── README.md    # this file
```

## Deployment

Pushed to `main` and served automatically via GitHub Pages (Settings → Pages → Deploy from branch → `main` / root).

## Note

Listings are stored per-browser, not shared between visitors. Someone else opening the site sees their own local listings, not yours. If you'd like a version where everyone sees the same listings (a shared marketplace), that needs a real backend and database.
