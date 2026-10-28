// Bravo pickup demo: renders the landing and restaurant pages from window.STORES (js/data.js) and keeps a pickup cart.
const STORES = window.STORES.slice().sort((a, b) => b.rating_count - a.rating_count)
const ITEMS = new Map(STORES.flatMap(s => s.menu.flatMap(c => c.items.map(i => [i.id, { ...i, store: s }]))))
const ZONE = 'America/Vancouver' // restaurants are in Metro Vancouver, wherever the visitor is
const GST = 0.05

const $ = (sel, el = document) => el.querySelector(sel)
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
const money = n => `CA$${n.toFixed(2)}`
const unit = i => i.pickup ?? i.price
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
const PLUS = '<img src="assets/icons/plus.svg" alt="" width="20" height="20">'
const CLOSE = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'

/* ── Cart (one restaurant at a time, kept in this browser) ── */
const CART_KEY = 'bravo-pickup-cart'
const emptyCart = () => ({ store: null, lines: {} })
let cart = (() => {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || emptyCart() }
  catch { return emptyCart() }
})()
cart.lines = Object.fromEntries(Object.entries(cart.lines || {}).filter(([id]) => ITEMS.has(id)))

const qty = id => cart.lines[id] || 0
const cartLines = () => Object.entries(cart.lines).map(([id, n]) => ({ item: ITEMS.get(id), n }))

function setQty(id, n) {
  const item = ITEMS.get(id)
  if (n > 0 && cart.store && cart.store !== item.store.id) {
    const current = STORES.find(s => s.id === cart.store)
    if (!confirm(`Start a new pickup order from ${item.store.name}? This removes your order from ${current?.name}.`)) return
    cart = emptyCart()
  }
  if (n > 0) { cart.lines[id] = n; cart.store = item.store.id }
  else delete cart.lines[id]
  if (!Object.keys(cart.lines).length) cart.store = null
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)) } catch {}
  renderCart()
}

function totals() {
  const lines = cartLines()
  const subtotal = lines.reduce((t, l) => t + unit(l.item) * l.n, 0)
  const savings = lines.reduce((t, l) => t + (l.item.pickup ? (l.item.price - l.item.pickup) * l.n : 0), 0)
  const tax = Math.round(subtotal * GST * 100) / 100
  return { count: lines.reduce((t, l) => t + l.n, 0), subtotal, savings, tax, total: subtotal + tax }
}

/* ── Shared bits ── */
const priceHtml = i => `<span class="price">${i.pickup ? `<s>${money(i.price)}</s><b>${money(i.pickup)}</b>` : `<b>${money(i.price)}</b>`}</span>`
const addLabel = (i, n) => `Add ${i.name}${n ? ` (${n} in cart)` : ''}`
const addBtn = (i) => {
  const n = qty(i.id)
  return `<button class="add-btn${n ? ' has' : ''}" type="button" data-add="${i.id}" aria-label="${esc(addLabel(i, n))}">${PLUS}<span>${n || ''}</span></button>`
}
const dishImg = (i, w, h) => `<img src="${esc(i.image)}" alt="${esc(i.name)}" width="${w}" height="${h}" loading="lazy" decoding="async">`

// Figma 6243:314: photo with "+" and an optional "#n Most liked" badge, then name and price
const dishCard = (i, rank, withStore) => `
  <article class="dish-card">
    <div class="dish-media">
      ${dishImg(i, 152, 153)}
      ${addBtn(i)}
      ${rank ? `<span class="badge">#${rank} Most liked</span>` : ''}
    </div>
    <div class="dish-text">
      <p class="dish-name" title="${esc(i.name)}">${esc(i.name)}</p>
      ${withStore ? `<a class="dish-from" href="restaurant.html?id=${i.store.id}">${esc(i.store.name)}</a>` : ''}
      ${priceHtml(i)}
    </div>
  </article>`

const ratingHtml = s => s.rating_count ? `<span class="star">★ ${s.rating.toFixed(1)}</span> (${s.rating_count})` : '<span class="star">New</span>'
const dot = '<span class="dot" aria-hidden="true"></span>'
const fullAddress = s => s.address.toLowerCase().includes(s.city.toLowerCase().replace('downtown ', '')) ? s.address : `${s.address}, ${s.city}`

function initCarousel(root) {
  const track = $('[data-track]', root)
  const prev = $('[data-prev]', root)
  const next = $('[data-next]', root)
  const update = () => {
    prev.disabled = track.scrollLeft <= 1
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1
  }
  const go = dir => track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: reducedMotion ? 'auto' : 'smooth' })
  prev.addEventListener('click', () => go(-1))
  next.addEventListener('click', () => go(1))
  track.addEventListener('scroll', update, { passive: true })
  addEventListener('resize', update)
  update()
}

/** Today's hours in Vancouver and whether the store is open now. */
function today(s) {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: ZONE, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date())
  const get = type => parts.find(p => p.type === type).value
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  const now = Number(get('hour')) * 60 + Number(get('minute'))
  const hours = s.hours.filter(p => p.day === day).flatMap(p => p.hours)
  const ranges = hours.map(r => /^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/.exec(r.trim())).filter(Boolean)
    .map(m => [m[1] * 60 + Number(m[2]), m[3] * 60 + Number(m[4])])
  // ponytail: ignores yesterday's ranges that run past midnight; fine for these 20 stores' hours
  const open = ranges.some(([a, b]) => b <= a ? now >= a || now < b : now >= a && now < b)
  const clock = m => { const h = Math.floor(m / 60) % 24; return `${h % 12 || 12}:${String(m % 60).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}` }
  return { listed: s.hours.length > 0, open, text: ranges.map(([a, b]) => `${clock(a)} – ${clock(b)}`).join(', ') }
}

function pickupTimes(s) {
  const fmt = t => new Date(t).toLocaleTimeString('en-CA', { timeZone: ZONE, hour: 'numeric', minute: '2-digit' })
  const ready = Date.now() + s.ready * 60_000
  const first = Math.ceil(ready / 900_000) * 900_000 // next quarter hour
  return [
    { value: 'asap', label: `As soon as it's ready (about ${fmt(ready)})` },
    ...Array.from({ length: 8 }, (_, k) => first + k * 900_000).map(t => ({ value: String(t), label: `Today at ${fmt(t)}` })),
  ]
}

/* ── Landing page ── */
function renderHome() {
  const top = STORES.map(s => ITEMS.get(s.featured[0]))
  $('[data-top-dishes]').innerHTML = top.map(i => dishCard(i, 1, true)).join('')
  initCarousel($('[data-carousel]'))

  $('[data-hero-art]').innerHTML = top.slice(0, 4).map(i => `
    <figure>${dishImg(i, 280, 280)}<figcaption><b>${esc(i.name)}</b>${esc(i.store.name)}</figcaption></figure>`).join('')

  const cuisines = ['All', ...new Set(STORES.map(s => s.cuisine))]
  let cuisine = 'All'
  let query = ''
  const chips = $('[data-chips]')
  chips.innerHTML = cuisines.map(c => `<button class="chip" type="button" aria-pressed="${c === 'All'}" data-cuisine="${esc(c)}">${esc(c)}</button>`).join('')

  const grid = $('[data-store-grid]')
  const draw = () => {
    const q = query.trim().toLowerCase()
    const shown = STORES.flatMap((s) => {
      if (cuisine !== 'All' && s.cuisine !== cuisine) return []
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
    $('[data-store-count]').textContent = `${plural(shown.length, 'restaurant')} across Metro Vancouver`
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
  search.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') $('#restaurants').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
  })
  draw()
}

/* ── Restaurant page ── */
function renderStore() {
  const main = $('[data-store-page]')
  const s = STORES.find(x => x.id === Number(new URLSearchParams(location.search).get('id')))
  if (!s) {
    main.insertAdjacentHTML('beforeend', '<div class="container"><p class="empty">We couldn\'t find that restaurant. <a href="index.html#restaurants">See all restaurants</a></p></div>')
    return
  }
  document.title = `${s.name} Pickup Menu | Bravo`
  $('meta[name="description"]').content = `Order ${s.name} ahead for pickup in ${s.city}. Ready in about ${s.ready} minutes.`

  const hours = today(s)
  const priceLevel = '$'.repeat(s.average_price < 1500 ? 1 : s.average_price < 3000 ? 2 : 3)
  const slug = (t, k) => `cat-${k}-${t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

  main.insertAdjacentHTML('beforeend', `
    <div class="container">
      <div class="cover">${s.photos.slice(0, 3).map((p, k) => `<img src="${esc(p)}" alt="" width="800" height="320" ${k ? '' : 'fetchpriority="high"'} decoding="async">`).join('')}</div>
      <div class="store-head">
        <div>
          <div class="store-title">
            <img class="store-logo" src="${esc(s.logo)}" alt="" width="56" height="56">
            <div>
              <h1>${esc(s.name)}</h1>
              <p class="meta">${ratingHtml(s)}${dot}${esc(s.cuisine)}${dot}${esc(s.city)}${dot}${priceLevel}</p>
            </div>
          </div>
          <div class="store-tags">${s.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
        </div>
        <aside class="pickup-card" aria-label="Pickup details">
          <div class="row"><span>Pickup</span><span>Ready in about ${s.ready} mins</span></div>
          <div class="row"><span>Pickup deal</span><span>20% off featured items</span></div>
          <div class="row"><span>Address</span><span>${esc(fullAddress(s))}</span></div>
          <div class="row"><span>Today</span><span>${!hours.listed ? 'Hours not listed' : hours.text ? `<span class="${hours.open ? 'open' : 'closed'}">${hours.open ? 'Open now' : 'Closed now'}</span> · ${hours.text}` : '<span class="closed">Closed today</span>'}</span></div>
          <a href="https://www.bravoup.ca/store/${s.id}" target="_blank" rel="noopener">${esc(s.name)} on bravoup.ca</a>
        </aside>
      </div>

      <section class="section" style="padding-bottom: 0" aria-labelledby="featured">
        <div class="dish-row" data-carousel>
          <div class="dish-row-head">
            <div class="dish-row-title">
              <h2 id="featured">Featured items</h2>
              <p>Ready in <b>${s.ready}</b> mins</p>
            </div>
            <div class="dish-row-nav">
              <button class="round-btn" type="button" data-prev aria-label="Previous items"><img class="on flip" src="assets/icons/chevron-right.svg" alt="" width="20" height="20"><img class="off" src="assets/icons/chevron-left.svg" alt="" width="20" height="20"></button>
              <button class="round-btn" type="button" data-next aria-label="More items"><img class="on" src="assets/icons/chevron-right.svg" alt="" width="20" height="20"><img class="off flip" src="assets/icons/chevron-left.svg" alt="" width="20" height="20"></button>
            </div>
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
            <div class="menu-item">
              <div class="dish-text">
                <p class="dish-name">${esc(i.name)}</p>
                ${i.desc ? `<p class="menu-desc">${esc(i.desc)}</p>` : ''}
                ${priceHtml(i)}
              </div>
              ${i.image ? `<div class="dish-media">${dishImg(i, 96, 97)}${addBtn(i)}</div>` : addBtn(i)}
            </div>`).join('')}
          </div>
        </section>`).join('')}
    </div>`)

  initCarousel($('[data-carousel]'))

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
}

/* ── Cart bar and drawer ── */
const drawer = $('[data-drawer]')
let placed = null

function renderCart() {
  const t = totals()
  document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = t.count || '' })
  for (const b of document.querySelectorAll('[data-add]')) {
    const n = qty(b.dataset.add)
    b.classList.toggle('has', n > 0)
    b.lastElementChild.textContent = n || ''
    b.setAttribute('aria-label', addLabel(ITEMS.get(b.dataset.add), n))
  }
  const bar = $('[data-cart-bar]')
  bar.hidden = !t.count
  document.body.classList.toggle('has-cart', t.count > 0)
  if (t.count) {
    const store = STORES.find(s => s.id === cart.store)
    bar.innerHTML = `<span>View cart <small>${plural(t.count, 'item')} · ${esc(store.name)}</small></span><span>${money(t.subtotal)}</span>`
  }
  if (drawer.open && !placed) {
    if (!t.count || !$('[data-lines]', drawer)) return renderDrawer()
    const focused = document.activeElement?.getAttribute('data-step')
    $('[data-lines]', drawer).innerHTML = linesHtml()
    $('[data-totals]', drawer).innerHTML = totalsHtml()
    if (focused) $(`[data-step="${focused}"]`, drawer)?.focus()
  }
}

const linesHtml = () => cartLines().map(({ item: i, n }) => `
  <div class="cart-line">
    ${i.image ? dishImg(i, 48, 48) : ''}
    <div class="grow"><p>${esc(i.name)}</p><p>${money(unit(i) * n)}</p></div>
    <div class="stepper">
      <button type="button" data-step="${i.id}:-1" aria-label="Remove one ${esc(i.name)}">−</button>
      <span aria-label="Quantity">${n}</span>
      <button type="button" data-step="${i.id}:1" aria-label="Add one ${esc(i.name)}">+</button>
    </div>
  </div>`).join('')

function totalsHtml() {
  const t = totals()
  return `
    <div><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
    <div><span>GST (5%)</span><span>${money(t.tax)}</span></div>
    <div class="total"><span>Total</span><span>${money(t.total)}</span></div>
    ${t.savings ? `<p class="open">You're saving ${money(t.savings)} with pickup</p>` : ''}`
}

function renderDrawer() {
  const head = title => `<div class="drawer-head"><h2 id="cart-title">${title}</h2><button class="round-btn" type="button" data-close aria-label="Close">${CLOSE}</button></div>`

  if (placed) {
    drawer.innerHTML = `${head('Order placed')}
      <div class="drawer-body"><div class="done">
        <div class="done-mark"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <h3>Thanks, ${esc(placed.name)}!</h3>
        <p>${esc(placed.store.name)} is preparing your order.</p>
        <span class="code">${placed.code}</span>
        <p>Pickup ${esc(placed.time)} at ${esc(fullAddress(placed.store))}. Show this code at the counter.</p>
        <p>${placed.pay === 'giftcard' ? `${money(placed.total)} will be paid from your Bravo Dining Gift Card.` : `Pay ${money(placed.total)} at the counter.`}</p>
        <p><small>This is a demo. No order was sent to the restaurant.</small></p>
      </div></div>
      <div class="drawer-foot"><button class="btn btn-block" type="button" data-close>Done</button></div>`
    return
  }

  if (!cart.store) {
    drawer.innerHTML = `${head('Your pickup order')}
      <div class="drawer-body"><p class="empty">Your cart is empty. Add dishes from any restaurant to start a pickup order.</p></div>
      <div class="drawer-foot"><a class="btn btn-block btn-light" href="index.html#restaurants">Browse restaurants</a></div>`
    return
  }

  const store = STORES.find(s => s.id === cart.store)
  drawer.innerHTML = `${head('Your pickup order')}
    <form data-checkout>
      <div class="drawer-body">
        <p class="cart-store">From <a href="restaurant.html?id=${store.id}"><b>${esc(store.name)}</b></a></p>
        <div data-lines>${linesHtml()}</div>
        <div class="field">
          <label for="pickup-time">Pickup time</label>
          <select id="pickup-time" name="time">${pickupTimes(store).map(o => `<option value="${o.value}">${esc(o.label)}</option>`).join('')}</select>
        </div>
        <div class="field">
          <label for="pickup-name">Name for the order</label>
          <input id="pickup-name" name="name" type="text" autocomplete="given-name" required>
        </div>
        <fieldset class="field">
          <legend>Payment</legend>
          <label class="radio"><input type="radio" name="pay" value="giftcard" checked><span>Bravo Dining Gift Card<small>Pay from your card balance</small></span></label>
          <label class="radio"><input type="radio" name="pay" value="counter"><span>Pay at the counter<small>Card or cash when you pick up</small></span></label>
        </fieldset>
      </div>
      <div class="drawer-foot">
        <div class="totals" data-totals>${totalsHtml()}</div>
        <button class="btn btn-block" type="submit">Place pickup order</button>
      </div>
    </form>`
}

function openDrawer() {
  placed = null
  renderDrawer()
  drawer.showModal()
}

document.addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]')
  if (add) return setQty(add.dataset.add, qty(add.dataset.add) + 1)
  const step = e.target.closest('[data-step]')
  if (step) {
    const [id, d] = step.dataset.step.split(':')
    return setQty(id, qty(id) + Number(d))
  }
  if (e.target.closest('[data-open-cart]')) return openDrawer()
  if (e.target.closest('[data-close]') || e.target === drawer) drawer.close()
})

drawer.addEventListener('submit', (e) => {
  e.preventDefault()
  const form = new FormData(e.target)
  placed = {
    store: STORES.find(s => s.id === cart.store),
    name: form.get('name').trim(),
    pay: form.get('pay'),
    total: totals().total,
    code: `B${Math.floor(1000 + Math.random() * 9000)}`,
    time: e.target.elements.time.selectedOptions[0].textContent.replace(/^./, c => c.toLowerCase()),
  }
  cart = emptyCart()
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)) } catch {}
  renderCart()
  renderDrawer()
})

if (document.body.dataset.page === 'home') renderHome()
else renderStore()
renderCart()
