# Bravo pickup demo

A demo of pickup ordering for [Bravo](https://www.bravoup.ca): a landing page, a menu page for each of 20 restaurants, and a cart that ends in a pickup confirmation. It is a standalone static site with no build step and no dependencies, kept apart from the website repo (`bravo_web_client_v2`), whose design system it follows.

Nothing is sent anywhere: placing an order only shows a confirmation code. The cart and the signed-in name and email are kept in the browser's `localStorage`. The footer is a copy of the bravoup.ca gift card footer, with its links pointing to bravoup.ca.

## Open it

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 4300
```

Then go to http://localhost:4300. Photos load from Bravo's S3 bucket, so you need to be online.

## Pages

| Page | What it shows |
|---|---|
| `index.html` | Hero with search, a "Most liked for pickup" row (each restaurant's #1 dish), how pickup works, and the 20 restaurants with cuisine filters |
| `restaurant.html?id={store id}` | Photos, address, today's ordering hours and ready time, the "Featured items" row, and the full menu by section, with a sticky section bar |
| Sign In / Sign Up (both pages) | A dialog with email and password, or name, email and password to sign up. Placing an order needs an account. |
| Cart drawer (both pages) | Opened from the Yolk cart button in the nav. Quantities, pickup time (as soon as it's ready, or a 15-minute slot today), name, an optional note for the restaurant, payment (Bravo Balance, or credit card through Stripe with the Visa, Mastercard and Amex icons from bravoup.ca), subtotal, GST and total |

The dish cards follow the Figma frame "Featured items" (Bravo – Website, node 6243:314): 151.67 × 153 photo with 10px corners, a "#n Most liked" badge and a white "+" button inset 6px, name in 16px semibold, the regular price struck through in 12px grey next to the pickup price in 14px semibold. Two small departures: the two prices have a 4px gap and share a baseline (in the frame they touch), and the cards widen to 200px from 768px up. Once a dish is in the cart, its "+" becomes a "− n +" stepper.

## Data

- **From Bravo's catalog** (pulled on 2026-10-28 from the `/web` backend): the 20 restaurants, their names, addresses, cuisines, ratings, opening hours, tags, logos and photos, and the 123 dishes that have a Bravo photo (`recommend_dishes`). These dishes are the featured ones.
- **Made up for the demo:** the rest of each menu (21 to 25 dishes per restaurant), every price, descriptions, preparation times, the 20% pickup discount on featured dishes, and the order flow.

| File | Contents |
|---|---|
| `data/stores.json` | The 20 stores as saved from the catalog |
| `data/menus.mjs` | The menus, one line per dish: `Name \| price \| description`. A dish whose name matches one of the store's Bravo dishes gets its photo. |
| `js/data.js` | Generated from the two files above. Don't edit it by hand. |

After changing a menu, rebuild `js/data.js`:

```bash
node scripts/build-data.mjs
```

The build stops if a store has fewer than 20 or more than 30 dishes, or if one of its Bravo dishes is missing from its menu. To pull the 20 stores from the catalog again, pass the `/web` backend address (`NUXT_BACKEND_WEB_BASE` in the website repo's `.env`):

```bash
BRAVO_WEB_BASE=https://… node scripts/build-data.mjs --refresh
```

## Design system

Colours, type and spacing follow Bravo's web design system (`~/bravo web design system/`): Ink `#202020`, Yolk `#FEE160`, Berry `#C63659`, true-neutral greys, and FT Regola Neue (Regular, Medium, Semibold and Bold, in `assets/fonts/`). The logo and the three icons (`assets/icons/`, from the Figma frame) are the originals.

## Files

```
index.html, restaurant.html   the two pages
css/styles.css                all styles; tokens at the top
js/app.js                     rendering, carousels, cart and checkout
js/data.js                    generated menu data
data/                         sources for js/data.js
scripts/build-data.mjs        builds js/data.js
assets/                       logo, Figma icons, fonts
```

## Not built

- Sign-in is a demo: any email and password work, only the name and email are kept in this browser, and there's no Google or phone sign-in.
- Pickup times aren't checked against opening hours.
- No dish detail view or options (sizes, spice level, add-ons).
- Pages render in the browser, so search engines would see an empty page. A production version would render on the server, like the website does.
