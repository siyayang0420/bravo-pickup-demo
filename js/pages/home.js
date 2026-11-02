// Landing page: a row of featured dishes per restaurant, then every restaurant, filtered by city, search and cuisine.
import '../nav.js'
import '../cart.js'
import { $, esc, plural, reducedMotion } from '../lib.js'
import { STORES, ITEMS } from '../state.js'
import { dishCard, ratingHtml, dot, carouselNav, initCarousel } from '../components.js'

function renderHome() {
  // one row per restaurant: logo and name, then its featured dishes
  $('[data-brand-rows]').innerHTML = STORES.map(s => `
    <div class="dish-row" data-carousel>
      <div class="dish-row-head">
        <a class="brand-head" href="restaurant.html?id=${s.id}">
          <img class="brand-logo" src="${esc(s.logo)}" alt="" width="48" height="48" loading="lazy" decoding="async">
          <div class="dish-row-title">
            <h3>${esc(s.name)}</h3>
            <p class="meta">${ratingHtml(s)}${dot}${esc(s.cuisine)}${dot}${esc(s.city)}${dot}Ready in ${s.ready} min</p>
          </div>
        </a>
        ${carouselNav(`Previous dishes from ${s.name}`, `More dishes from ${s.name}`)}
      </div>
      <div class="dish-track hide-scrollbar" data-track>${s.featured.map((id, k) => dishCard(ITEMS.get(id), k < 3 ? k + 1 : 0)).join('')}</div>
    </div>`).join('')
  document.querySelectorAll('[data-carousel]').forEach(initCarousel)

  const cuisines = ['All', ...new Set(STORES.map(s => s.cuisine))]
  let cuisine = 'All'
  let query = ''
  let city = ''
  const chips = $('[data-chips]')
  chips.innerHTML = cuisines.map(c => `<button class="chip" type="button" aria-pressed="${c === 'All'}" data-cuisine="${esc(c)}">${esc(c)}</button>`).join('')

  const grid = $('[data-store-grid]')
  const draw = () => {
    const q = query.trim().toLowerCase()
    const shown = STORES.flatMap((s) => {
      if (cuisine !== 'All' && s.cuisine !== cuisine) return []
      if (!s.city.includes(city)) return [] // "Vancouver" also matches "Downtown Vancouver"
      if (!q) return [{ s, hits: [] }]
      const hits = s.menu.flatMap(c => c.items).filter(i => i.name.toLowerCase().includes(q)).map(i => i.name)
      return [s.name, s.cuisine, s.city].some(t => t.toLowerCase().includes(q)) || hits.length ? [{ s, hits }] : []
    })
    grid.innerHTML = shown.map(({ s, hits }) => `
      <a class="store-card" href="restaurant.html?id=${s.id}">
        <div class="store-card-media">
          <img src="${esc(s.photos[0])}" alt="" width="400" height="300" loading="lazy" decoding="async">
          <span class="ready-pill">Ready in ${s.ready} min</span>
        </div>
        <div>
          <h3>${esc(s.name)}</h3>
          <p class="meta">${ratingHtml(s)}${dot}${esc(s.cuisine)}${dot}${esc(s.city)}</p>
          ${hits.length ? `<p class="meta">Has ${esc(hits.slice(0, 2).join(', '))}${hits.length > 2 ? ` and ${hits.length - 2} more` : ''}</p>` : ''}
        </div>
      </a>`).join('')
    $('[data-store-count]').textContent = `${plural(shown.length, 'restaurant')} ${city ? `in ${city}` : 'across Metro Vancouver'}`
    $('[data-empty]').hidden = shown.length > 0
  }

  chips.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-cuisine]')
    if (!chip) return
    cuisine = chip.dataset.cuisine
    chips.querySelectorAll('[data-cuisine]').forEach(c => c.setAttribute('aria-pressed', c === chip))
    draw()
  })
  const search = $('[data-search]')
  search.addEventListener('input', () => { query = search.value; draw() })
  const citySel = $('[data-city]')
  citySel.addEventListener('change', () => { city = citySel.value; draw() })
  $('[data-finder]').addEventListener('submit', (e) => {
    e.preventDefault()
    $('#restaurants').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
  })
  draw()
}

renderHome()
