# Bravo pickup demo

A demo of pickup ordering for [Bravo](https://www.bravoup.ca): a landing page, a menu page for each of 20 restaurants, and a cart that ends in a pickup confirmation. It is a standalone static site with no build step and no dependencies, kept apart from the website repo (`bravo_web_client_v2`), whose design system it follows.

Nothing is sent anywhere: placing an order only shows a confirmation code. The cart and the signed-in name and email are kept in the browser's `localStorage`. The footer is a copy of the bravoup.ca gift card footer, with its links pointing to bravoup.ca.

## Open it

Serve the folder (the scripts are ES modules, which browsers don't run from a `file://` page):

```bash
python3 -m http.server 4300
```

Then go to http://localhost:4300. Photos load from Bravo's S3 bucket, so you need to be online.

## Pages

| Page | What it shows |
|---|---|
| `index.html` | Hero with a city picker and search bar (both filter the restaurant list), "Most liked for pickup" (a row per restaurant, headed by its logo, with its featured dishes), how pickup works, the 20 restaurants with cuisine filters, and an FAQ (the site's `Faq.vue` layout, with native `<details>`) |
| `restaurant.html?id={store id}` | Photos, address, whether the restaurant is open now (Vancouver time, including hours past midnight) with today's ordering hours and the week in a dropdown, the ready time, a carousel of three demo "Offers & savings" (10% off every order and $5 off a first order of $50 or more in this browser, both applied with an Apply button in the cart; and a $2 Bonus with Bravo Balance, shown under the cart total when Balance is the payment), the "Featured items" row, and the full menu by section, with a sticky section bar |
| Sign in (every page) | The same views and flow as bravoup.ca's `LoginModal.vue`: Welcome to Bravo (email and password, Forgot password, Continue with Google, Continue with phone), Create An Account → Check Your Email (6-digit code), Reset Password → code and new password → done, and Log in with phone → SMS code with a 30-second resend. Signed in, the nav shows a demo avatar, the name and a menu (Profile Settings, My Gift Card, Transactions, Order History, Log Out), and the "Balance • $85" button styled like bravoup.ca's "My Gift Card" header button, or a "$85" chip on phones. Guests can order with a card; Bravo Balance and Bonus need an account. |
| Cart drawer (`index.html`, `restaurant.html`) | Opened from the Yolk cart button in the nav: the dishes with quantities and kitchen notes (a bin replaces "−" at 1), the offers this order qualifies for in light green with Apply / Remove (10% off; $5 off a first order, or how much more is needed to reach $50), "People also like these" with three more of the restaurant's dishes, the totals and "Continue to checkout" |
| `checkout.html` | Its own page in two columns, like Uber Eats. Left: back to the menu, "Secure checkout", a Yolk "Check out with Bravo" box for guests (sign up or sign in); then pickup time and a note for the restaurant, contact (who's picking up, email for the receipt, optional phone), offers and payment. Right, sticky from 960px up: the restaurant and its hours, "Place pickup order", the order as in the cart (photo, note, prices, "You save", and the bin or − n + stepper) with a "+ Add items" button back to the menu, and the order total. On phones it's one column with the order card last and its button at the bottom. Paying with Bravo Balance shows a "Use Bravo Bonus" switch and a slider that snaps to five stops: $0, about a quarter, half and three quarters in whole dollars, and All (the bonus, or the order total if that is less); the total then shows "Bravo Bonus used", "You pay" and "Bravo Bonus earned" (+CA$2.00). Balance (made-up CA$85.00) and bonus (CA$12.50) are the same for every account. Placing the order shows the pickup code on the same page, with a sign-up prompt for guests. Card payments are a radio button only: no card form. |

The dish cards follow the Figma frame "Featured items" (Bravo – Website, node 6243:314): 151.67 × 153 photo with 12px corners (10px in the frame), a "#n Most liked" badge and a white "+" button inset 6px, name in 16px semibold, the regular price struck through in 12px grey next to the pickup price in 14px semibold. Two small departures: the two prices have a 4px gap and share a baseline (in the frame they touch), and the cards widen to 200px from 768px up. Line heights follow the design system (16/24 for names and row titles, 14/20 for prices) rather than the frame's 21px. The first "+" on a dish opens a dialog with a bigger photo, the description and prices, a note for the kitchen and a quantity, then adds it to the cart (the note shows under the dish in the cart). Once a dish is in the cart, its "+" becomes a "− n +" stepper that changes the quantity directly.

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

## SEO and loading

- Every page has a title, description, the bravoup.ca favicons and a theme colour. The landing and restaurant pages add Open Graph and Twitter card tags with a 1200 × 630 share image (`assets/og-image.jpg`). The landing page has a canonical link and Bravo's Organization as JSON-LD, with the same `@id` as on bravoup.ca. Checkout and unknown restaurant ids are `noindex`.
- Each restaurant page sets its own title, description and canonical link, and adds the restaurant as JSON-LD (address, hours, rating and the full menu with prices) with a breadcrumb. Scripts add these; Google runs scripts, but link previews in chat and social apps only see the static tags.
- Once the demo has an address, build with it. This writes `sitemap.xml` (the landing page and the 20 restaurants) and `robots.txt`, and makes the canonical link and share image absolute. `robots.txt` only counts at the root of a domain.

  ```bash
  SITE_URL=https://… node scripts/build-data.mjs
  ```

- Each page loads only its own modules, deferred, and preloads `js/data.js` (the largest) so it doesn't wait for the module that imports it. The two weights above the fold (Regular and Semibold) are preloaded, the S3 photo host is preconnected, and images below the fold load lazily.

## Files

```
index.html, restaurant.html,
checkout.html                 the three pages
css/styles.css                all styles; tokens at the top
js/pages/                     one entry module per page: home.js, store.js, checkout.js
js/nav.js                     nav scroll edge, account menu and sign-in dialog
js/cart.js                    steppers, dish dialog, cart bar and drawer
js/components.js              markup the pages share: dish cards, prices, carousels, hours
js/state.js                   restaurants, account and cart; fires cart:change and account:change
js/lib.js                     helpers, storage and icons
js/data.js                    generated menu data
data/                         sources for js/data.js
scripts/build-data.mjs        builds js/data.js, and the sitemap when given SITE_URL
assets/                       logo, Figma icons, fonts, share image
favicon.ico, favicon.svg,
apple-touch-icon.png          the bravoup.ca icons
```

## Not built

- Sign-in is a demo: any email, password and 6-digit code work, nothing is sent, "Continue with Google" signs in a made-up Google account, and only the name, email or phone are kept in this browser. The account menu links go to bravoup.ca.
- Pickup times aren't checked against opening hours.
- No dish options (sizes, spice level, add-ons).
- The restaurant lists and menus render in the browser. Google runs the scripts and sees them, but other crawlers and link previews only get the static parts, so every restaurant shares one preview. A production version would render each restaurant page on the server, like the website does, or at build time.
