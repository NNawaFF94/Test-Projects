# 🍼 Little Bites — Baby Recipes & Meal Planner

A simple, friendly web app for managing baby food recipes and planning your
little one's weekly meals. Built to be effortless for everyday use — no account,
no install, no internet required after the first load.

## Features

- **Browse recipes** by age stage (around 6 months → 12+ months), with search
  by name or ingredient and a filter for allergen-free recipes.
- **Add, edit, and delete** your own recipes.
- **Weekly meal planner** — assign recipes to breakfast, lunch, dinner, and
  snack for each day of the week.
- **Feeding guide** with verified, plain-language guidance on starting solids,
  textures, allergens, foods to avoid, and choking safety.
- **Everything saves automatically** in your browser (localStorage), so your
  recipes and plans are there next time you open the app.
- Ships with **12 verified starter recipes**.

## How to use it

Just open `index.html` in any modern web browser (Chrome, Safari, Firefox, Edge),
including on a phone or tablet. That's it — no setup.

To use it across devices or share it, you can host the folder on any static
web host (e.g. GitHub Pages, Netlify, Vercel).

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
