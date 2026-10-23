# 🍼 Little Bites — Baby Recipes & Meal Planner

A simple, friendly web app for managing baby food recipes and planning your
little one's weekly meals. Built to be effortless for everyday use — no account,
no install, no internet required after the first load.

## Features

- **Browse recipes** by age stage (around 6 months → 12+ months), with search
  by name or ingredient and a filter for allergen-free recipes.
- **Add, edit, and delete** your own recipes.
- **Photos** — upload a picture for any recipe (auto-resized so it stays small).
- **Import from a link** — paste a recipe link from Instagram, TikTok, YouTube,
  Pinterest, or a blog. The app grabs the title and cover image and pre-fills a
  new recipe; you add the ingredients and steps from the post.
- **Weekly meal planner** — assign recipes to breakfast, lunch, dinner, and
  snack for each day of the week.
- **Shopping list** — automatically generated from everything in your weekly
  plan, with tick-off checkboxes and a print option.
- **Print** any recipe, the weekly plan, or the shopping list.
- **Feeding guide** with verified, plain-language guidance on starting solids,
  textures, allergens, foods to avoid, and choking safety.
- **Everything saves automatically** in your browser (localStorage), so your
  recipes and plans are there next time you open the app.
- Ships with **12 verified starter recipes**.

## How to use it

Just open `index.html` in any modern web browser (Chrome, Safari, Firefox, Edge),
including on a phone or tablet. That's it — no setup.

### Hosted version (GitHub Pages)

This repo includes a GitHub Actions workflow
(`.github/workflows/deploy-pages.yml`) that deploys the app to GitHub Pages
automatically on every push. Once it runs, the app is available at:

```
https://<your-github-username>.github.io/<repo-name>/
```

The workflow attempts to enable Pages for you. If deployment is blocked, enable
it manually under **Settings → Pages → Build and deployment → Source: GitHub
Actions** and re-run the workflow.

### A note on the link importer

The importer runs entirely in your browser and uses a free, CORS-enabled oEmbed
service to read a post's title and cover image — that's the information most
social platforms expose publicly. Reading the full ingredient/step list out of a
photo or video isn't possible from a static site without a backend and an AI
service, so those fields are left for you to fill in (this keeps the app free,
private, and account-free). If you'd like full AI-powered extraction later, that
would require adding a small server component.

## About the information

Recipes and the feeding guide are based on widely published infant-feeding
guidance from:

- The **American Academy of Pediatrics (AAP)**
- The **UK NHS "Start for Life"** weaning advice
- The **World Health Organization (WHO)**

Key safety principles built in: start solids around 6 months, no honey before
12 months, no added salt or sugar, introduce allergens early and one at a time,
and avoid choking hazards.

> **Disclaimer:** This app provides general information, not medical advice.
> Every baby is different. Always talk to your pediatrician about your child's
> diet, allergies, and readiness for solid foods.

## Tech

Plain HTML, CSS, and JavaScript — zero dependencies, zero build step.

- `index.html` — markup and views
- `styles.css` — styling
- `data.js` — seed recipes, age stages, and feeding guide content
- `app.js` — application logic and localStorage persistence

---

## 🖥️ Inside the Case — how PC parts work

A second app lives in [`pc-parts/`](pc-parts/index.html): an interactive cutaway
of a desktop PC. Tap any part (CPU, cooler, RAM, GPU, motherboard, SSD, HDD,
PSU, fans, chipset, CMOS battery) to see how it works, its specs decoded, a
buying tip and a common myth. It also has:

- **Data journey**: an animated, step-by-step walk through what happens inside
  the case when you launch a game.
- **Speed scale**: cache, RAM, SSD and hard disk latency stretched to human
  time (if one CPU tick lasted a second).
- **What matters**: which parts matter most for gaming, video, office work,
  programming or local AI.
- **Quiz**: 10 questions with explanations.

Open `pc-parts/index.html` directly, or visit `/pc-parts/` on the GitHub Pages site.
