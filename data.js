/*
 * Little Bites — seed data
 *
 * Recipes and age stages are based on widely published infant-feeding
 * guidance from the American Academy of Pediatrics (AAP), the UK NHS
 * "Start for Life" weaning advice, and the World Health Organization (WHO).
 *
 * Key principles reflected here:
 *  - Most babies are ready for solids around 6 months (never before 4 months).
 *  - Start with smooth single-ingredient purees, then progress texture.
 *  - Introduce common allergens (egg, peanut, dairy, fish, etc.) early and
 *    one at a time, around 6 months, unless your doctor advises otherwise.
 *  - No added salt or sugar. No honey before 12 months (botulism risk).
 *  - No whole nuts, whole grapes, or other choking hazards for young babies.
 *
 * This is general information, not medical advice.
 */

const AGE_STAGES = [
  { id: "6m",   label: "Around 6 months",  short: "6m+",   order: 1 },
  { id: "7-9m", label: "7–9 months",       short: "7–9m",  order: 2 },
  { id: "9-12m",label: "9–12 months",      short: "9–12m", order: 3 },
  { id: "12m",  label: "12+ months",       short: "12m+",  order: 4 }
];

const SEED_RECIPES = [
  {
    id: "seed-1",
    name: "Smooth Apple Purée",
    age: "6m",
    prep: 20,
    ingredients: [
      "2 sweet apples (e.g. Gala or Fuji), peeled, cored and chopped",
      "Splash of water or unsalted baby-safe water"
    ],
    steps: [
      "Steam apple pieces for 8–10 minutes until very soft.",
      "Blend or mash until completely smooth.",
      "Add a little of the cooking water to loosen to a runny texture for first tastes.",
      "Cool to lukewarm and check temperature before serving."
    ],
    allergens: [],
    notes: "A classic first food. Freeze leftovers in an ice-cube tray for handy portions (use within 3 months).",
    seed: true
  },
  {
    id: "seed-2",
    name: "Banana & Avocado Mash",
    age: "6m",
    prep: 5,
    ingredients: [
      "1/2 ripe banana",
      "1/4 ripe avocado"
    ],
    steps: [
      "Mash the banana with a fork until smooth.",
      "Add avocado and mash together.",
      "Add a splash of your baby's usual milk if a thinner texture is needed.",
      "Serve immediately — avocado browns quickly."
    ],
    allergens: [],
    notes: "No cooking needed. Great source of healthy fats. Make fresh each time.",
    seed: true
  },
  {
    id: "seed-3",
    name: "Sweet Potato Purée",
    age: "6m",
    prep: 25,
    ingredients: [
      "1 medium sweet potato, peeled and cubed",
      "Water or baby's usual milk to loosen"
    ],
    steps: [
      "Steam or boil sweet potato for 12–15 minutes until tender.",
      "Drain and blend until smooth.",
      "Loosen with a little water or milk to a soft, spoonable texture.",
      "Cool and test temperature before serving."
    ],
    allergens: [],
    notes: "Naturally sweet and rich in beta-carotene. Pairs well with a pinch of cinnamon (no salt or sugar).",
    seed: true
  },
  {
    id: "seed-4",
    name: "Iron-Rich Lentil & Carrot Purée",
    age: "6m",
    prep: 30,
    ingredients: [
      "3 tbsp dried red lentils, rinsed",
      "1 carrot, peeled and chopped",
      "1 cup unsalted water or no-salt veg stock"
    ],
    steps: [
      "Add lentils, carrot and water to a pan.",
      "Simmer 20–25 minutes until lentils and carrot are very soft.",
      "Blend until smooth, adding water to reach a soft purée.",
      "Cool and check temperature."
    ],
    allergens: [],
    notes: "Iron is critical from 6 months as babies' own stores run low. Pair with vitamin-C foods (like the carrot) to boost iron absorption.",
    seed: true
  },
  {
    id: "seed-5",
    name: "Creamy Yogurt with Berry Purée",
    age: "6m",
    prep: 10,
    ingredients: [
      "3 tbsp plain whole-milk (full-fat) unsweetened yogurt",
      "2 tbsp blueberries or raspberries"
    ],
    steps: [
      "Gently warm berries in a small pan with a splash of water until soft, or mash fresh ripe berries well.",
      "Push through a sieve if you want to remove seeds for early eaters.",
      "Stir the berry purée into the plain yogurt.",
      "Serve cool."
    ],
    allergens: ["dairy"],
    notes: "Plain full-fat yogurt is a good early way to introduce dairy. Avoid sweetened or low-fat yogurts for babies.",
    seed: true
  },
  {
    id: "seed-6",
    name: "Scrambled Egg Fingers",
    age: "7-9m",
    prep: 10,
    ingredients: [
      "1 whole egg",
      "1 tbsp baby's usual milk",
      "Tiny knob of unsalted butter or drizzle of olive oil"
    ],
    steps: [
      "Whisk egg with the milk.",
      "Cook gently in butter, stirring, until fully set (no runny parts).",
      "Let cool, then cut or shape into finger-sized pieces your baby can grip.",
      "Serve warm, not hot."
    ],
    allergens: ["egg"],
    notes: "Egg is a common allergen — introduce early and watch for reactions. Always cook eggs thoroughly for babies.",
    seed: true
  },
  {
    id: "seed-7",
    name: "Soft Veggie Finger Sticks",
    age: "7-9m",
    prep: 20,
    ingredients: [
      "1 carrot and/or 1 parsnip, peeled and cut into thick sticks",
      "Small broccoli florets"
    ],
    steps: [
      "Steam vegetables 10–12 minutes until soft enough to squash between your fingers.",
      "Cut into finger-length pieces (about the size of an adult finger) for easy grabbing.",
      "Cool to a safe temperature before serving.",
      "Always supervise during eating."
    ],
    allergens: [],
    notes: "Great for baby-led weaning. Pieces should be soft and large enough to grip but not small/round (choking risk).",
    seed: true
  },
  {
    id: "seed-8",
    name: "Smooth Peanut Butter & Banana Toast Strips",
    age: "7-9m",
    prep: 5,
    ingredients: [
      "1 slice wholemeal bread, lightly toasted",
      "1 tsp smooth (no added salt/sugar) peanut butter",
      "1/4 banana, mashed"
    ],
    steps: [
      "Spread a thin layer of smooth peanut butter on the toast.",
      "Top with mashed banana and spread thinly.",
      "Cut into finger strips.",
      "Serve and supervise."
    ],
    allergens: ["peanut", "gluten"],
    notes: "Early peanut introduction (around 6 months) may reduce allergy risk per AAP guidance. Use ONLY smooth peanut butter — never whole or chopped nuts. If your baby is high-risk (severe eczema/egg allergy), check with your doctor first.",
    seed: true
  },
  {
    id: "seed-9",
    name: "Salmon & Pea Mash",
    age: "7-9m",
    prep: 20,
    ingredients: [
      "1 small skinless, boneless salmon fillet",
      "3 tbsp frozen peas",
      "1 small potato, peeled and cubed"
    ],
    steps: [
      "Boil or steam potato until soft (about 12 min); add peas for the last 3 minutes.",
      "Steam or poach salmon until fully cooked and flaky (8–10 min).",
      "Check very carefully for any bones, then flake the fish.",
      "Mash everything together with a little baby milk to a soft texture."
    ],
    allergens: ["fish"],
    notes: "Oily fish provides omega-3s. Always double-check for bones. Limit oily fish to about twice a week.",
    seed: true
  },
  {
    id: "seed-10",
    name: "Mini Veggie Omelette Bites",
    age: "9-12m",
    prep: 20,
    ingredients: [
      "2 eggs",
      "2 tbsp finely chopped soft cooked vegetables (e.g. spinach, pepper, tomato)",
      "1 tbsp grated mild cheese",
      "Drizzle of olive oil"
    ],
    steps: [
      "Whisk eggs, stir in vegetables and cheese.",
      "Pour into a greased mini-muffin tin.",
      "Bake at 180°C / 350°F for 12–15 minutes until fully set.",
      "Cool and serve as soft hand-held bites."
    ],
    allergens: ["egg", "dairy"],
    notes: "Make a batch and refrigerate up to 2 days. A great protein-packed finger food for self-feeders.",
    seed: true
  },
  {
    id: "seed-11",
    name: "Soft Chicken & Veg Risotto",
    age: "9-12m",
    prep: 35,
    ingredients: [
      "3 tbsp risotto/arborio rice",
      "1 small cooked chicken breast, finely shredded",
      "Handful of soft chopped vegetables (courgette, peas, carrot)",
      "1 cup no-salt chicken or veg stock"
    ],
    steps: [
      "Cook rice gently in stock, stirring, adding more liquid as it absorbs (about 20 min).",
      "Stir in chopped vegetables to cook through and soften.",
      "Add shredded chicken to warm through.",
      "Mash slightly if needed; serve warm."
    ],
    allergens: [],
    notes: "A filling, balanced meal. Use no-salt stock — babies' kidneys can't handle much salt.",
    seed: true
  },
  {
    id: "seed-12",
    name: "Toddler Pasta with Hidden-Veg Tomato Sauce",
    age: "12m",
    prep: 30,
    ingredients: [
      "Small pasta shapes (fusilli or macaroni)",
      "1 cup chopped tomatoes (no added salt)",
      "1/2 courgette and 1 carrot, grated",
      "1 small onion and 1 garlic clove, finely chopped",
      "Drizzle of olive oil",
      "Grated cheese to serve"
    ],
    steps: [
      "Soften onion and garlic in olive oil.",
      "Add grated veg and chopped tomatoes; simmer 15 minutes until thick.",
      "Blend the sauce smooth if preferred.",
      "Cook pasta until soft, stir through sauce, top with a little cheese."
    ],
    allergens: ["gluten", "dairy"],
    notes: "Family-friendly — cook a bigger batch for everyone and keep baby's portion salt-free.",
    seed: true
  }
];

const FEEDING_GUIDE = [
  {
    title: "When to start solids",
    body: "Most babies are developmentally ready for solid foods at around 6 months. Signs of readiness include sitting up with support and good head control, showing interest in food, and being able to move food to the back of the mouth and swallow. Never start before 4 months. Breast milk or formula remains the main source of nutrition through the first year."
  },
  {
    title: "Progressing textures",
    body: "Start with smooth, runny single-ingredient purées. By 7–9 months move to mashed and lumpier textures plus soft finger foods. By 9–12 months offer more texture and a variety of soft finger foods. Around 12 months babies can eat chopped versions of most family meals."
  },
  {
    title: "Introducing allergens",
    body: "Current guidance (AAP) is to introduce common allergens early — around 6 months — rather than delaying. Offer one new allergen at a time (e.g. egg, smooth peanut butter, dairy, wheat, fish, soy, sesame) and wait a couple of days to watch for any reaction. If your baby is high-risk (severe eczema or existing food allergy), talk to your pediatrician first."
  },
  {
    title: "Foods to avoid",
    body: "No honey before 12 months (botulism risk). No added salt or sugar. Avoid whole nuts, whole grapes, popcorn, hard raw vegetables, and other choking hazards. Avoid unpasteurized foods, high-mercury fish (like shark, swordfish, marlin), and rice drinks as a main milk before age 5."
  },
  {
    title: "Choking safety",
    body: "Always supervise your baby while eating and keep them sitting upright. Cut round foods like grapes and cherry tomatoes lengthways into quarters. Offer soft foods that squash easily. Learn infant first aid and know the difference between gagging (normal) and choking."
  },
  {
    title: "Building healthy habits",
    body: "Offer a variety of flavours and colours early. It can take 8–10+ tries before a baby accepts a new food — keep offering without pressure. Let baby self-feed to develop skills. Aim for iron-rich foods daily, as iron stores deplete around 6 months."
  }
];
