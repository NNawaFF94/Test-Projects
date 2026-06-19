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
function saveRecipes() { localStorage.setItem(STORE_KEY, JSON.stringify(recipes)); }

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
    return `
      <article class="recipe-card" data-id="${r.id}">
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

  $("#detailContent").innerHTML = `
    <h2>${esc(r.name)}</h2>
    <div class="detail-meta">
      <span class="badge badge-age">${esc(ageLabel(r.age))}</span>
      <span class="badge">⏱ ${esc(r.prep)} min</span>
      ${allergens}
    </div>
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
      <button class="btn btn-danger btn-sm" id="deleteFromDetail">Delete</button>
    </div>
  `;
  $("#editFromDetail").onclick = () => { closeModal("#detailModal"); openForm(r.id); };
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
function openForm(id) {
  const form = $("#recipeForm");
  form.reset();
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
    $("#f_notes").value = r.notes || "";
  } else {
    $("#formTitle").textContent = "Add Recipe";
    $("#recipeId").value = "";
  }
  openModal("#formModal");
  $("#f_name").focus();
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
    notes: $("#f_notes").value.trim()
  };

  if (!data.ingredients.length || !data.steps.length) {
    alert("Please add at least one ingredient and one step.");
    return;
  }

  if (id) {
    const r = findRecipe(id);
    Object.assign(r, data);
  } else {
    recipes.push({ id: uid(), seed: false, ...data });
  }
  saveRecipes();
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
