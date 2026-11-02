// Restaurant page (restaurant.html?id=…): photos, hours, offers, featured dishes and the full menu with a sticky section bar.
import '../nav.js'
import '../cart.js'
import { $, esc, reducedMotion } from '../lib.js'
import { STORES, ITEMS, unit } from '../state.js'
import { priceHtml, dishImg, addBtn, dishCard, fullAddress, hoursHtml, dayRanges, DAYS, carouselNav, initCarousel } from '../components.js'

// demo offers shown on every restaurant page; the first two are applied in the cart, the third when paying with Bravo Balance
const SPARK = (x, y, s) => `<path class="art-spark" transform="translate(${x} ${y}) scale(${s})" d="M0-6 1.4-1.4 6 0 1.4 1.4 0 6-1.4 1.4-6 0-1.4-1.4z"/>`
const OFFER_ART = {
  // scalloped badge with a %
  pct: `<g class="art-yolk"><circle cx="60" cy="60" r="32"/>${Array.from({ length: 12 }, (_, k) => {
    const a = k * Math.PI / 6
    return `<circle cx="${(60 + 31 * Math.cos(a)).toFixed(1)}" cy="${(60 + 31 * Math.sin(a)).toFixed(1)}" r="11"/>`
  }).join('')}</g>
    <g class="art-ink"><path d="M49 75 71 45"/><circle cx="50" cy="48" r="5"/><circle cx="70" cy="72" r="5"/></g>${SPARK(16, 18, 1)}${SPARK(104, 98, 0.8)}`,
  // price tag with a $
  tag: `<rect class="art-yolk-dark" x="42" y="30" width="48" height="62" rx="12" transform="rotate(10 66 61)"/>
    <rect class="art-yolk" x="34" y="30" width="48" height="62" rx="12" transform="rotate(-10 58 61)"/>
    <circle cx="54" cy="40" r="4" fill="#fff"/>
    <text class="art-glyph" x="58" y="76" text-anchor="middle" transform="rotate(-10 58 61)">$</text>${SPARK(104, 20, 1)}${SPARK(18, 100, 0.8)}`,
  // stacked coin with a star
  coin: `<circle class="art-yolk-dark" cx="66" cy="64" r="32"/><circle class="art-yolk" cx="58" cy="58" r="32"/>
    <path class="art-ink" stroke-linejoin="round" d="M${Array.from({ length: 10 }, (_, k) => {
      const a = -Math.PI / 2 + k * Math.PI / 5
      const r = k % 2 ? 7 : 16
      return `${(58 + r * Math.cos(a)).toFixed(1)} ${(58 + r * Math.sin(a)).toFixed(1)}`
    }).join(' ')}z"/>${SPARK(18, 22, 1)}${SPARK(106, 100, 0.8)}`,
}
const OFFERS = [
  { art: 'pct', title: 'Save 10%', foot: 'Apply in your cart' },
  { art: 'tag', title: '$5 off your first order of $50+', foot: 'Apply in your cart' },
  { art: 'coin', title: '$2 Bonus with Bravo Balance', foot: 'Earned after pickup' },
]

// for search engines that run scripts, as Google does: the canonical address, and the restaurant with its menu as JSON-LD
function addSeo(s) {
  const url = new URL(`restaurant.html?id=${s.id}`, location.href).href
  document.head.insertAdjacentHTML('beforeend', `<link rel="canonical" href="${esc(url)}">`)
  const hhmm = m => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
  const ld = document.createElement('script')
  ld.type = 'application/ld+json'
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'Restaurant',
      '@id': `${url}#restaurant`,
      name: s.name,
      url,
      image: s.photos,
      logo: s.logo,
      servesCuisine: s.cuisine,
      address: { '@type': 'PostalAddress', streetAddress: s.address.replace(/,[^,]*,\s*BC\b.*$/, ''), addressLocality: s.city.replace('Downtown ', ''), addressRegion: 'BC', addressCountry: 'CA' },
      ...(s.rating_count && { aggregateRating: { '@type': 'AggregateRating', ratingValue: s.rating.toFixed(1), reviewCount: s.rating_count, bestRating: 5 } }),
      openingHoursSpecification: DAYS.flatMap((day, d) => dayRanges(s, d).map(([a, b]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: day, opens: hhmm(a), closes: hhmm(b) }))),
      hasMenu: {
        '@type': 'Menu',
        hasMenuSection: s.menu.map(c => ({
          '@type': 'MenuSection',
          name: c.title,
          hasMenuItem: c.items.map(i => ({ '@type': 'MenuItem', name: i.name, description: i.desc, image: i.image, offers: { '@type': 'Offer', price: unit(i).toFixed(2), priceCurrency: 'CAD' } })),
        })),
      },
    }, {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Pickup', item: new URL('./', location.href).href },
        { '@type': 'ListItem', position: 2, name: s.name, item: url },
      ],
    }],
  })
  document.head.append(ld)
}

function renderStore() {
  const main = $('[data-store-page]')
  const s = STORES.find(x => x.id === Number(new URLSearchParams(location.search).get('id')))
  if (!s) {
    document.head.insertAdjacentHTML('beforeend', '<meta name="robots" content="noindex">')
    main.insertAdjacentHTML('beforeend', '<div class="container"><p class="empty">We couldn\'t find that restaurant. <a href="index.html#restaurants">See all restaurants</a></p></div>')
    return
  }
  document.title = `${s.name} Pickup Menu | Bravo`
  $('meta[name="description"]').content = `Order ${s.name} ahead for pickup in ${s.city}. Ready in about ${s.ready} minutes.`
  addSeo(s)

  const slug = (t, k) => `cat-${k}-${t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

  main.insertAdjacentHTML('beforeend', `
    <div class="container">
      <div class="cover">${s.photos.slice(0, 3).map((p, k) => `<img src="${esc(p)}" alt="" width="800" height="320" ${k ? '' : 'fetchpriority="high"'} decoding="async">`).join('')}</div>
      <div class="store-head">
        <div class="store-info">
          <h1>${esc(s.name)}</h1>
          <p class="store-address">${esc(fullAddress(s))}</p>
          ${hoursHtml(s)}
        </div>
        <div class="ready-box"><b>${s.ready} min</b><span>ready for pickup</span></div>
      </div>

      <section class="offers dish-row" data-carousel aria-labelledby="offers">
        <div class="dish-row-head">
          <h2 id="offers">Offers &amp; savings</h2>
          ${carouselNav('Previous offers', 'More offers')}
        </div>
        <div class="offer-list dish-track hide-scrollbar" data-track>${OFFERS.map(o => `
          <div class="offer">
            <h3>${o.title}</h3>
            <p class="offer-foot">${o.foot}</p>
            <svg class="offer-art" viewBox="0 0 120 120" aria-hidden="true">${OFFER_ART[o.art]}</svg>
          </div>`).join('')}
        </div>
      </section>

      <section class="section" style="padding-bottom: 0" aria-labelledby="featured">
        <div class="dish-row" data-carousel>
          <div class="dish-row-head">
            <div class="dish-row-title">
              <h2 id="featured">Featured items</h2>
              <p>Ready in <b>${s.ready}</b> mins</p>
            </div>
            ${carouselNav('Previous items', 'More items')}
          </div>
          <div class="dish-track hide-scrollbar" data-track>${s.featured.map((id, k) => dishCard(ITEMS.get(id), k < 3 ? k + 1 : 0)).join('')}</div>
        </div>
      </section>
    </div>

    <nav class="cat-nav" aria-label="Menu sections">
      <div class="container"><div class="chips hide-scrollbar" data-cat-chips>${s.menu.map((c, k) => `<a class="chip" href="#${slug(c.title, k)}">${esc(c.title)}</a>`).join('')}</div></div>
    </nav>

    <div class="container">
      ${s.menu.map((c, k) => `
        <section class="menu-cat" id="${slug(c.title, k)}" aria-labelledby="${slug(c.title, k)}-h">
          <h2 id="${slug(c.title, k)}-h">${esc(c.title)}</h2>
          <div class="menu-list">${c.items.map(i => `
            <div class="menu-item" data-dish="${i.id}">
              <div class="dish-text">
                <p class="dish-name">${esc(i.name)}</p>
                ${i.desc ? `<p class="menu-desc">${esc(i.desc)}</p>` : ''}
                ${priceHtml(i)}
              </div>
              <div class="dish-media">${i.image ? dishImg(i, 96, 97) : ''}${addBtn(i)}</div>
            </div>`).join('')}
          </div>
        </section>`).join('')}
    </div>`)

  document.querySelectorAll('[data-carousel]').forEach(initCarousel)

  // highlight the menu section in view
  const chips = $('[data-cat-chips]')
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      chips.querySelectorAll('.chip').forEach((c) => {
        const on = c.hash === `#${e.target.id}`
        c.setAttribute('aria-current', on ? 'true' : 'false')
        if (on) chips.scrollTo({ left: c.offsetLeft - chips.offsetLeft - 20, behavior: reducedMotion ? 'auto' : 'smooth' })
      })
    }
  }, { rootMargin: '-140px 0px -60% 0px' })
  document.querySelectorAll('.menu-cat').forEach(sec => io.observe(sec))

  // the section bar gets the nav's soft edge once it sticks under the nav
  const nav = $('.nav')
  const bar = $('.cat-nav')
  const onScroll = () => bar.classList.toggle('stuck', bar.getBoundingClientRect().top <= nav.offsetHeight + 1)
  addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}

renderStore()
