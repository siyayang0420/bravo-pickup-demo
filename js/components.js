// Markup shared by the pages: prices, dish cards with their "+" / "− n +" control, carousels, addresses and opening hours.
import { $, esc, money, reducedMotion, PLUS, MINUS, BIN } from './lib.js'
import { qty } from './state.js'

export const ZONE = 'America/Vancouver' // restaurants are in Metro Vancouver, wherever the visitor is
export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/* ── Dishes ── */
export const priceHtml = i => `<span class="price">${i.pickup ? `<s>${money(i.price)}</s><b>${money(i.pickup)}</b>` : `<b>${money(i.price)}</b>`}</span>`
export const dishImg = (i, w, h) => `<img src="${esc(i.image)}" alt="${esc(i.name)}" width="${w}" height="${h}" loading="lazy" decoding="async">`

// the left stepper button: "−", or a bin when one more tap takes the dish out of the cart
export const lessBtn = (i, n) => n > 1
  ? `<button type="button" data-step="${i.id}:-1" aria-label="Remove one ${esc(i.name)}">${MINUS}</button>`
  : `<button type="button" data-step="${i.id}:-1" aria-label="Remove ${esc(i.name)} from cart">${BIN}</button>`

// "+" until the dish is in the cart, then "− n +"
export const qtyInner = (i) => {
  const n = qty(i.id)
  return n
    ? `${lessBtn(i, n)}<span>${n}</span><button type="button" data-step="${i.id}:1" aria-label="Add another ${esc(i.name)}">${PLUS}</button>`
    : `<button class="add-btn" type="button" data-step="${i.id}:1" aria-label="Add ${esc(i.name)}">${PLUS}</button>`
}
export const addBtn = i => `<div class="qty-ctl${qty(i.id) ? ' on' : ''}" data-qty="${i.id}">${qtyInner(i)}</div>`

// Figma 6243:314: photo with "+" and an optional "#n Most liked" badge, then name and price
export const dishCard = (i, rank) => `
  <article class="dish-card" data-dish="${i.id}">
    <div class="dish-media">
      ${dishImg(i, 152, 153)}
      ${addBtn(i)}
      ${rank ? `<span class="badge">#${rank} Most liked</span>` : ''}
    </div>
    <div class="dish-text">
      <p class="dish-name" title="${esc(i.name)}">${esc(i.name)}</p>
      ${priceHtml(i)}
    </div>
  </article>`

/* ── Restaurants ── */
export const ratingHtml = s => s.rating_count ? `<span class="star">★ ${s.rating.toFixed(1)}</span> (${s.rating_count})` : '<span class="star">New</span>'
export const dot = '<span class="dot" aria-hidden="true"></span>'
export const fullAddress = (s) => {
  const a = s.address.toLowerCase().includes(s.city.toLowerCase().replace('downtown ', '')) ? s.address : `${s.address}, ${s.city}`
  return /\bBC\b/.test(a) ? a : `${a}, BC`
}

/* ── Carousels: a scrolling track with previous / next buttons ── */
const chevrons = (on, off) => `<img class="${on}" src="assets/icons/chevron-right.svg" alt="" width="20" height="20"><img class="${off}" src="assets/icons/chevron-left.svg" alt="" width="20" height="20">`
export const carouselNav = (prevLabel, nextLabel) => `
  <div class="dish-row-nav">
    <button class="round-btn" type="button" data-prev aria-label="${esc(prevLabel)}">${chevrons('on flip', 'off')}</button>
    <button class="round-btn" type="button" data-next aria-label="${esc(nextLabel)}">${chevrons('on', 'off flip')}</button>
  </div>`

export function initCarousel(root) {
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

/* ── Opening hours ── */
const CLOCK = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="10" cy="10" r="7.25"/><path d="M10 6v4l2.5 1.5"/></svg>'
const CHEVRON = '<svg class="chev" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>'

/** A day's ordering ranges in minutes after midnight; one that runs past midnight ends after 1440. */
export const dayRanges = (s, day) => s.hours.filter(p => p.day === day).flatMap(p => p.hours)
  .map(r => /^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/.exec(r.trim())).filter(Boolean)
  .map(m => { const a = m[1] * 60 + +m[2], b = m[3] * 60 + +m[4]; return [a, b > a ? b : b + 1440] })
const clockText = (min) => { const h = Math.floor(min / 60) % 24; return `${h % 12 || 12}:${String(min % 60).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}` }
const rangesText = rs => rs.map(([a, b]) => `${clockText(a)} – ${clockText(b)}`).join(', ') || 'Closed'

/** Open/closed now in Vancouver, today's hours, and the week in a dropdown. */
export function hoursHtml(s) {
  if (!s.hours.length) return '<p class="hours-line">Online ordering hours not listed</p>'
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: ZONE, weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
    .formatToParts(new Date()).map(p => [p.type, p.value]))
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday)
  const now = parts.hour * 60 + +parts.minute
  const open = dayRanges(s, day).some(([a, b]) => now >= a && now < b)
    || dayRanges(s, (day + 6) % 7).some(([, b]) => now + 1440 < b) // still in last night's late hours
  return `
    <details class="hours">
      <summary>${CLOCK}<b class="${open ? 'is-open' : 'is-closed'}">${open ? 'Open' : 'Closed'}</b><span>Today ${rangesText(dayRanges(s, day))}</span>${CHEVRON}</summary>
      <p class="hours-note">Online ordering hours</p>
      <ul>${[1, 2, 3, 4, 5, 6, 0].map(d => `<li${d === day ? ' class="today"' : ''}><span>${DAYS[d]}</span><span>${rangesText(dayRanges(s, d))}</span></li>`).join('')}</ul>
    </details>`
}
