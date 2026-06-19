/* Little Bites — app logic (vanilla JS, localStorage persistence) */

const STORE_KEY = "littleBites.recipes.v1";
const PLAN_KEY = "littleBites.plan.v1";
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEALS = ["Breakfast", "Lunch", "Dinner", "Snack"];

/* ---------- State ---------- */
let recipes = loadRecipes();
let plan = loadPlan();
let assignTarget = null; // { day, meal }

function loadRecipes() {
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) {
    localStorage.setItem(STORE_KEY, JSON.stringify(SEED_RECIPES));
    return [...SEED_RECIPES];
  }
  try { return JSON.parse(raw); } catch { return [...SEED_RECIPES]; }
}
function saveRecipes() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(recipes)); return true; }
  catch (e) { return false; }
}

function loadPlan() {
  const raw = localStorage.getItem(PLAN_KEY);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}
function savePlan() { localStorage.setItem(PLAN_KEY, JSON.stringify(plan)); }

/* ---------- Helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ageLabel = (id) => (AGE_STAGES.find((a) => a.id === id) || {}).label || id;
const ageShort = (id) => (AGE_STAGES.find((a) => a.id === id) || {}).short || id;
const ageOrder = (id) => (AGE_STAGES.find((a) => a.id === id) || { order: 99 }).order;
const findRecipe = (id) => recipes.find((r) => r.id === id);
const uid = () => "r-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);

/* ---------- Tabs ---------- */
$("#tabs").addEventListener("click", (e) => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  $$(".tab").forEach((t) => t.classList.toggle("active", t === btn));
  $$(".view").forEach((v) => v.classList.remove("active"));
  $("#view-" + btn.dataset.view).classList.add("active");
});

/* ---------- Populate filters / selects ---------- */
function populateAgeOptions() {
  const filter = $("#ageFilter");
  const formSel = $("#f_age");
  AGE_STAGES.forEach((a) => {
    filter.insertAdjacentHTML("beforeend", `<option value="${a.id}">${esc(a.label)}</option>`);
    formSel.insertAdjacentHTML("beforeend", `<option value="${a.id}">${esc(a.label)}</option>`);
  });
}

/* ---------- Render recipes ---------- */
function renderRecipes() {
  const q = $("#searchInput").value.trim().toLowerCase();
  const age = $("#ageFilter").value;
  const allergen = $("#allergenFilter").value;

  let list = recipes.filter((r) => {
    if (age && r.age !== age) return false;
    if (allergen === "none" && r.allergens && r.allergens.length) return false;
    if (q) {
      const hay = (r.name + " " + r.ingredients.join(" ")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  list.sort((a, b) => ageOrder(a.age) - ageOrder(b.age) || a.name.localeCompare(b.name));

  const grid = $("#recipeGrid");
  $("#emptyState").hidden = list.length > 0;
  $("#resultCount").textContent = `${list.length} recipe${list.length === 1 ? "" : "s"}`;

  grid.innerHTML = list.map((r) => {
    const allergenBadge = (r.allergens && r.allergens.length)
      ? `<span class="badge badge-allergen">contains ${esc(r.allergens.join(", "))}</span>`
      : `<span class="badge badge-clean">no common allergens</span>`;
    const photo = r.photo ? `<img class="card-photo" src="${esc(r.photo)}" alt="${esc(r.name)}" loading="lazy" />` : "";
    return `
      <article class="recipe-card" data-id="${r.id}">
        ${photo}
        <h3>${esc(r.name)}</h3>
        <div class="card-meta">
          <span class="badge badge-age">${esc(ageShort(r.age))}</span>
          <span class="card-time">⏱ ${esc(r.prep)} min</span>
        </div>
        <div class="card-meta">${allergenBadge}</div>
      </article>`;
  }).join("");
}

$("#recipeGrid").addEventListener("click", (e) => {
  const card = e.target.closest(".recipe-card");
  if (card) openDetail(card.dataset.id);
});
["searchInput", "ageFilter", "allergenFilter"].forEach((id) =>
  $("#" + id).addEventListener("input", renderRecipes)
);

/* ---------- Recipe detail ---------- */
function openDetail(id) {
  const r = findRecipe(id);
  if (!r) return;
  const allergens = (r.allergens && r.allergens.length)
    ? `<span class="badge badge-allergen">contains ${esc(r.allergens.join(", "))}</span>`
    : `<span class="badge badge-clean">no common allergens</span>`;

  const photo = r.photo ? `<img class="detail-photo" src="${esc(r.photo)}" alt="${esc(r.name)}" />` : "";
  const source = r.source ? `<p class="detail-source">🔗 Source: <a href="${esc(r.source)}" target="_blank" rel="noopener noreferrer">${esc(r.source)}</a></p>` : "";
  $("#detailContent").innerHTML = `
    ${photo}
    <h2>${esc(r.name)}</h2>
    <div class="detail-meta">
      <span class="badge badge-age">${esc(ageLabel(r.age))}</span>
      <span class="badge">⏱ ${esc(r.prep)} min</span>
      ${allergens}
    </div>
    ${source}
    <div class="detail-section">
      <h4>Ingredients</h4>
      <ul>${r.ingredients.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    </div>
    <div class="detail-section">
      <h4>Method</h4>
      <ol>${r.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
    </div>
    ${r.notes ? `<div class="detail-section"><h4>Notes</h4><div class="detail-notes">${esc(r.notes)}</div></div>` : ""}
    <div class="detail-actions">
      <button class="btn btn-ghost btn-sm" id="editFromDetail">Edit</button>
      <button class="btn btn-ghost btn-sm" id="printFromDetail">🖨 Print</button>
      <button class="btn btn-danger btn-sm" id="deleteFromDetail">Delete</button>
    </div>
  `;
  $("#editFromDetail").onclick = () => { closeModal("#detailModal"); openForm(r.id); };
  $("#printFromDetail").onclick = () => printRecipe(r);
  $("#deleteFromDetail").onclick = () => deleteRecipe(r.id);
  openModal("#detailModal");
}

function deleteRecipe(id) {
  const r = findRecipe(id);
  if (!confirm(`Delete "${r.name}"? This can't be undone.`)) return;
  recipes = recipes.filter((x) => x.id !== id);
  saveRecipes();
  // Remove from any plan slots
  for (const key in plan) { if (plan[key] === id) delete plan[key]; }
  savePlan();
  closeModal("#detailModal");
  renderRecipes();
  renderPlanner();
}

/* ---------- Add / edit form ---------- */
function openForm(id, prefill) {
  const form = $("#recipeForm");
  form.reset();
  setPhotoPreview("");
  if (id) {
    const r = findRecipe(id);
    $("#formTitle").textContent = "Edit Recipe";
    $("#recipeId").value = r.id;
    $("#f_name").value = r.name;
    $("#f_age").value = r.age;
    $("#f_prep").value = r.prep;
    $("#f_ingredients").value = r.ingredients.join("\n");
    $("#f_steps").value = r.steps.join("\n");
    $("#f_allergens").value = (r.allergens || []).join(", ");
    $("#f_source").value = r.source || "";
    $("#f_notes").value = r.notes || "";
    setPhotoPreview(r.photo || "");
  } else {
    $("#formTitle").textContent = "Add Recipe";
    $("#recipeId").value = "";
    if (prefill) {
      if (prefill.name) $("#f_name").value = prefill.name;
      if (prefill.source) $("#f_source").value = prefill.source;
      if (prefill.notes) $("#f_notes").value = prefill.notes;
      if (prefill.photo) setPhotoPreview(prefill.photo);
    }
  }
  openModal("#formModal");
  $("#f_name").focus();
}

/* ---------- Photo handling ---------- */
function setPhotoPreview(dataUrl) {
  const preview = $("#photoPreview");
  $("#f_photo_data").value = dataUrl || "";
  if (dataUrl) {
    preview.innerHTML = `<img src="${esc(dataUrl)}" alt="preview" />`;
    preview.dataset.empty = "false";
    $("#removePhotoBtn").hidden = false;
  } else {
    preview.innerHTML = "<span>No photo</span>";
    preview.dataset.empty = "true";
    $("#removePhotoBtn").hidden = true;
  }
}

$("#f_photo").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  compressImage(file, 900, 0.72)
    .then(setPhotoPreview)
    .catch(() => alert("Sorry, that image couldn't be loaded."));
});
$("#removePhotoBtn").addEventListener("click", () => { setPhotoPreview(""); $("#f_photo").value = ""; });

// Resize/compress an image file to a JPEG data URL to keep storage small.
function compressImage(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) { height = Math.round(height * maxDim / width); width = maxDim; }
        else if (height > maxDim) { width = Math.round(width * maxDim / height); height = maxDim; }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

$("#addRecipeBtn").addEventListener("click", () => openForm());

$("#recipeForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = $("#recipeId").value;
  const splitLines = (v) => v.split("\n").map((s) => s.trim()).filter(Boolean);
  const allergens = $("#f_allergens").value.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

  const data = {
    name: $("#f_name").value.trim(),
    age: $("#f_age").value,
    prep: parseInt($("#f_prep").value, 10) || 0,
    ingredients: splitLines($("#f_ingredients").value),
    steps: splitLines($("#f_steps").value),
    allergens,
    source: $("#f_source").value.trim(),
    photo: $("#f_photo_data").value,
    notes: $("#f_notes").value.trim()
  };

  if (!data.ingredients.length || !data.steps.length) {
    alert("Please add at least one ingredient and one step.");
    return;
  }

  const snapshot = JSON.stringify(recipes);
  if (id) {
    const r = findRecipe(id);
    Object.assign(r, data);
  } else {
    recipes.push({ id: uid(), seed: false, ...data });
  }
  if (!saveRecipes()) {
    recipes = JSON.parse(snapshot); // roll back
    alert("Couldn't save — browser storage is full. Try removing some recipe photos.");
    return;
  }
  closeModal("#formModal");
  renderRecipes();
});

/* ---------- Planner ---------- */
function renderPlanner() {
  $("#planner").innerHTML = DAYS.map((day) => `
    <div class="day-row">
      <p class="day-name">${day}</p>
      <div class="meals">
        ${MEALS.map((meal) => {
          const key = `${day}|${meal}`;
          const rid = plan[key];
          const r = rid ? findRecipe(rid) : null;
          const inner = r
            ? `<div class="meal-assigned">
                 <span class="meal-recipe" data-id="${r.id}">${esc(r.name)}</span>
                 <button class="meal-remove" data-key="${esc(key)}" title="Remove">&times;</button>
               </div>`
            : `<button class="meal-empty" data-day="${day}" data-meal="${meal}">+ Add</button>`;
          return `<div class="meal-slot"><span class="meal-label">${meal}</span>${inner}</div>`;
        }).join("")}
      </div>
    </div>
  `).join("");
}

$("#planner").addEventListener("click", (e) => {
  const empty = e.target.closest(".meal-empty");
  if (empty) { openAssign(empty.dataset.day, empty.dataset.meal); return; }
  const remove = e.target.closest(".meal-remove");
  if (remove) { delete plan[remove.dataset.key]; savePlan(); renderPlanner(); return; }
  const recipe = e.target.closest(".meal-recipe");
  if (recipe) openDetail(recipe.dataset.id);
});

$("#clearPlanBtn").addEventListener("click", () => {
  if (!Object.keys(plan).length) return;
  if (!confirm("Clear the whole week's plan?")) return;
  plan = {};
  savePlan();
  renderPlanner();
});

/* ---------- Assign modal ---------- */
function openAssign(day, meal) {
  assignTarget = { day, meal };
  $("#assignSlotLabel").textContent = `${day} · ${meal}`;
  $("#assignSearch").value = "";
  renderAssignList("");
  openModal("#assignModal");
  $("#assignSearch").focus();
}

function renderAssignList(q) {
  q = q.toLowerCase();
  const list = recipes
    .filter((r) => !q || r.name.toLowerCase().includes(q))
    .sort((a, b) => ageOrder(a.age) - ageOrder(b.age) || a.name.localeCompare(b.name));
  $("#assignList").innerHTML = list.length
    ? list.map((r) => `
        <button class="assign-item" data-id="${r.id}">
          <span>${esc(r.name)}</span>
          <span class="badge badge-age">${esc(ageShort(r.age))}</span>
        </button>`).join("")
    : `<p class="hint">No recipes found.</p>`;
}

$("#assignSearch").addEventListener("input", (e) => renderAssignList(e.target.value));
$("#assignList").addEventListener("click", (e) => {
  const item = e.target.closest(".assign-item");
  if (!item || !assignTarget) return;
  plan[`${assignTarget.day}|${assignTarget.meal}`] = item.dataset.id;
  savePlan();
  closeModal("#assignModal");
  renderPlanner();
});

/* ---------- Feeding guide ---------- */
function renderGuide() {
  $("#guideContent").innerHTML = FEEDING_GUIDE.map((g) => `
    <div class="guide-card">
      <h3>${esc(g.title)}</h3>
      <p>${esc(g.body)}</p>
    </div>
  `).join("");
}

/* ---------- Import from link ---------- */
$("#importBtn").addEventListener("click", () => {
  $("#importUrl").value = "";
  $("#importStatus").textContent = "";
  $("#importStatus").classList.remove("error");
  openModal("#importModal");
  $("#importUrl").focus();
});

$("#importGoBtn").addEventListener("click", importFromLink);
$("#importUrl").addEventListener("keydown", (e) => { if (e.key === "Enter") importFromLink(); });

async function importFromLink() {
  const url = $("#importUrl").value.trim();
  const status = $("#importStatus");
  status.classList.remove("error");
  if (!/^https?:\/\//i.test(url)) {
    status.textContent = "Please paste a full link starting with http(s)://";
    status.classList.add("error");
    return;
  }
  status.textContent = "Fetching details from the link…";

  let meta = null;
  // noembed.com is a free, CORS-enabled oEmbed proxy that supports
  // Instagram, TikTok, YouTube, Pinterest, Vimeo and many blogs.
  try {
    const res = await fetch("https://noembed.com/embed?url=" + encodeURIComponent(url));
    if (res.ok) meta = await res.json();
  } catch (e) { /* network blocked or offline — fall through */ }

  closeModal("#importModal");

  const prefill = { source: url };
  if (meta && !meta.error) {
    if (meta.title) prefill.name = meta.title;
    if (meta.thumbnail_url) prefill.photo = meta.thumbnail_url;
    const author = meta.author_name ? `by ${meta.author_name} ` : "";
    prefill.notes = `Imported ${author}from ${url}`.trim();
  } else {
    prefill.notes = `Imported from ${url}`;
  }
  // Open the recipe form pre-filled; user adds ingredients & steps from the post.
  openForm(null, prefill);
  if (!meta || meta.error) {
    setTimeout(() => alert("We saved the link, but couldn't auto-read the title/image for this site. Just fill in the recipe details from the post."), 50);
  }
}

/* ---------- Shopping list ---------- */
function plannedRecipeIds() {
  const ids = Object.values(plan).filter(Boolean);
  return [...new Set(ids)];
}

function buildShoppingList() {
  const ids = plannedRecipeIds();
  const map = new Map(); // normalized ingredient -> { text, sources:Set }
  ids.forEach((id) => {
    const r = findRecipe(id);
    if (!r) return;
    r.ingredients.forEach((ing) => {
      const key = ing.toLowerCase().trim();
      if (!map.has(key)) map.set(key, { text: ing, sources: new Set() });
      map.get(key).sources.add(r.name);
    });
  });
  return { items: [...map.values()].sort((a, b) => a.text.localeCompare(b.text)), recipeCount: ids.length };
}

$("#shoppingBtn").addEventListener("click", () => {
  const { items, recipeCount } = buildShoppingList();
  $("#shoppingSummary").textContent = recipeCount
    ? `${items.length} ingredients across ${recipeCount} planned recipe${recipeCount === 1 ? "" : "s"}.`
    : "Your week is empty — add some recipes to the planner first.";
  $("#shoppingList").innerHTML = items.map((it, i) => `
    <div class="shop-item" data-i="${i}">
      <input type="checkbox" id="shop-${i}" />
      <label for="shop-${i}">
        ${esc(it.text)}
        <span class="shop-source">${esc([...it.sources].join(", "))}</span>
      </label>
    </div>`).join("");
  openModal("#shoppingModal");
});

$("#shoppingList").addEventListener("change", (e) => {
  if (e.target.type === "checkbox") e.target.closest(".shop-item").classList.toggle("checked", e.target.checked);
});

$("#printShoppingBtn").addEventListener("click", () => {
  const { items, recipeCount } = buildShoppingList();
  const rows = items.map((it) => `<li>☐ ${esc(it.text)} <small style="color:#888">(${esc([...it.sources].join(", "))})</small></li>`).join("");
  printHtml("Shopping List", `
    <h1>🛒 Shopping List</h1>
    <p>${recipeCount} planned recipe(s)</p>
    <ul style="list-style:none;padding:0;line-height:2">${rows || "<li>No items.</li>"}</ul>
  `);
});

/* ---------- Printing ---------- */
function printHtml(title, body) {
  const w = window.open("", "_blank");
  if (!w) { alert("Please allow pop-ups to print."); return; }
  w.document.write(`<!DOCTYPE html><html><head><title>${esc(title)}</title>
    <style>
      body { font-family: system-ui, sans-serif; color: #333; max-width: 700px; margin: 30px auto; padding: 0 20px; }
      h1 { color: #d96b51; } h2 { color: #7bb7a8; margin-top: 24px; }
      ul, ol { padding-left: 22px; } li { margin-bottom: 6px; }
      .meta { color: #777; font-size: 14px; }
      table { border-collapse: collapse; width: 100%; margin-top: 10px; }
      td, th { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; font-size: 14px; }
      th { background: #f6efe9; }
    </style></head><body>${body}
    <script>window.onload=function(){window.print();}<\/script></body></html>`);
  w.document.close();
}

function printRecipe(r) {
  printHtml(r.name, `
    <h1>${esc(r.name)}</h1>
    <p class="meta">Suitable from ${esc(ageLabel(r.age))} · ${esc(r.prep)} min${r.allergens && r.allergens.length ? " · contains " + esc(r.allergens.join(", ")) : ""}</p>
    <h2>Ingredients</h2>
    <ul>${r.ingredients.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
    <h2>Method</h2>
    <ol>${r.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
    ${r.notes ? `<h2>Notes</h2><p>${esc(r.notes)}</p>` : ""}
    ${r.source ? `<p class="meta">Source: ${esc(r.source)}</p>` : ""}
  `);
}

$("#printPlanBtn").addEventListener("click", () => {
  const rows = DAYS.map((day) => {
    const cells = MEALS.map((meal) => {
      const r = findRecipe(plan[`${day}|${meal}`]);
      return `<td>${r ? esc(r.name) : "—"}</td>`;
    }).join("");
    return `<tr><th>${day}</th>${cells}</tr>`;
  }).join("");
  printHtml("Weekly Meal Plan", `
    <h1>🍼 Weekly Meal Plan</h1>
    <table>
      <tr><th>Day</th>${MEALS.map((m) => `<th>${m}</th>`).join("")}</tr>
      ${rows}
    </table>
  `);
});

/* ---------- Modals ---------- */
function openModal(sel) { $(sel).hidden = false; document.body.style.overflow = "hidden"; }
function closeModal(sel) { $(sel).hidden = true; document.body.style.overflow = ""; }
document.addEventListener("click", (e) => {
  if (e.target.matches("[data-close]") || e.target.classList.contains("modal-backdrop")) {
    const modal = e.target.closest(".modal-backdrop") || e.target;
    if (modal.classList.contains("modal-backdrop")) closeModal("#" + modal.id);
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") $$(".modal-backdrop").forEach((m) => { if (!m.hidden) closeModal("#" + m.id); });
});

/* ---------- Init ---------- */
populateAgeOptions();
renderRecipes();
renderPlanner();
renderGuide();
