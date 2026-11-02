// Checkout page: what you fill in on the left, a sticky order card on the right (like Uber Eats), then the pickup code.
import '../nav.js'
import { linesHtml, offersHtml } from '../cart.js'
import { $, esc, money, PLUS } from '../lib.js'
import { cart, user, signedIn, totals, storeById, completeOrder, BALANCE, BONUS, BALANCE_BONUS } from '../state.js'
import { fullAddress, hoursHtml, ZONE } from '../components.js'

// card and wallet icons from bravoup.ca (public/images in the website repo)
const CARDS = [['Visa', 'visa'], ['Mastercard', 'mastercard'], ['American Express', 'amex'], ['Alipay', 'alipay'], ['WeChat Pay', 'wechat']]
  .map(([label, f]) => `<img src="assets/pay/${f}_icon.svg" alt="${label}" title="${label}" width="29" height="20">`).join('')

let bonusOn = true // use Bravo Bonus when paying with Balance
let bonusStop = null // which of the slider's stops; null until the shopper picks one (then "All")
let placed = null

function pickupTimes(s) {
  const fmt = t => new Date(t).toLocaleTimeString('en-CA', { timeZone: ZONE, hour: 'numeric', minute: '2-digit' })
  const ready = Date.now() + s.ready * 60_000
  const first = Math.ceil(ready / 900_000) * 900_000 // next quarter hour
  return [
    { value: 'asap', label: `As soon as it's ready (about ${fmt(ready)})` },
    ...Array.from({ length: 8 }, (_, k) => first + k * 900_000).map(t => ({ value: String(t), label: `Today at ${fmt(t)}` })),
  ]
}

const field = (id, label, input, hint = '') => `<div class="field"><label for="${id}">${label}</label>${input}${hint}</div>`

// the balance needs an account: signed out, it's locked and asks to sign up, and card is picked
const payHtml = pay => `
  <label class="radio"><input type="radio" name="pay" value="giftcard" ${!signedIn() ? 'disabled' : pay === 'giftcard' ? 'checked' : ''}><span>Bravo Balance${signedIn()
    ? `<small><b>${money(BALANCE)}</b> balance + <b>${money(BONUS)}</b> bonus available</small>`
    : `<small><button class="link-btn" type="button" data-auth="signup">Sign up</button> or <button class="link-btn" type="button" data-auth="signin">sign in</button> to pay with your balance and bonus</small>`
  }</span><span class="pay-logo bravo-logo"><img src="assets/logo-bravo.svg" alt="Bravo" width="40" height="12"></span></label>
  <div class="bonus-box" data-bonus-box></div>
  <label class="radio"><input type="radio" name="pay" value="card" ${pay === 'card' ? 'checked' : ''}><span>Credit card<small class="pay-methods">${CARDS}<span title="Additional payment methods via Stripe">+ more</span></small></span><img class="pay-logo" src="assets/pay/stripe-logo.svg" alt="Stripe" width="41" height="17"></label>`

const payChoice = () => $('[data-co-form] [name="pay"]:checked')?.value || (signedIn() ? 'giftcard' : 'card')
const bonusMax = () => Math.min(BONUS, totals().total)
// five stops: $0, about a quarter, half and three quarters in whole dollars (ties to even: $10 → 0, 2, 5, 8), then all of it
const roundEven = x => (Math.abs(x % 1) === 0.5 ? 2 * Math.round(x / 2) : Math.round(x))
const bonusStops = () => {
  const max = bonusMax()
  return [...new Set([0, ...[0.25, 0.5, 0.75].map(f => roundEven(max * f)).filter(v => v > 0 && v < max), max])]
}
const stopIndex = () => Math.min(bonusStop ?? Infinity, bonusStops().length - 1)
const bonusUsed = () => (payChoice() === 'giftcard' && bonusOn ? bonusStops()[stopIndex()] : 0)

// "Use Bravo Bonus" switch and a slider for how much, under the Balance option
function bonusHtml() {
  if (payChoice() !== 'giftcard' || !BONUS) return ''
  const max = bonusMax(), stops = bonusStops(), at = stopIndex(), last = stops.length - 1
  const short = v => (v % 1 ? money(v) : `CA$${v}`) // whole dollars without ".00"
  const pos = k => `${(k / last) * 100}%`
  return `
    <label class="bonus-toggle"><input type="checkbox" data-bonus-on ${bonusOn ? 'checked' : ''}><span>Use Bravo Bonus</span><b data-bonus-out>${money(bonusUsed())}</b></label>
    <div class="bonus-slider${bonusOn ? '' : ' is-off'}" style="--fill: ${pos(at)}">
      <div class="bonus-track" aria-hidden="true">${stops.map((v, k) => `<i class="${k <= at ? 'on' : ''}" style="left: ${pos(k)}"></i>`).join('')}</div>
      <input class="bonus-range" type="range" min="0" max="${last}" step="1" value="${at}" data-bonus-amt aria-label="Bravo Bonus to use" aria-valuetext="${money(stops[at])}" ${bonusOn ? '' : 'disabled'}>
      <div class="bonus-stops">${stops.map((v, k) => `<button type="button" class="${k === at ? 'on' : ''}" style="left: ${pos(k)}" data-bonus-stop="${k}" ${bonusOn ? '' : 'disabled'}>${k === last ? `All ${short(v)}` : short(v)}</button>`).join('')}</div>
    </div>
    <p class="bonus-note">You have ${money(BONUS)} in Bravo Bonus${max < BONUS ? `; up to ${money(max)}, the order total, can go toward this order` : ''}. The rest comes from your balance.</p>`
}

// order summary: Bravo Bonus used lowers what you pay; paying with Balance also earns bonus
function coTotalsHtml() {
  const t = totals(), pay = payChoice(), used = bonusUsed(), due = t.total - used
  return `
    <div><span>Subtotal</span><span class="line-price">${t.dishSavings ? `<s>${money(t.subtotal + t.dishSavings)}</s>` : ''}<b>${money(t.subtotal)}</b></span></div>
    ${t.offer ? `<div class="open"><span>Save 10%</span><span>−${money(t.offer)}</span></div>` : ''}
    ${t.first ? `<div class="open"><span>$5 off your first order</span><span>−${money(t.first)}</span></div>` : ''}
    <div><span>GST (5%)</span><span>${money(t.tax)}</span></div>
    <div class="${used ? '' : 'total'}"><span>Total</span><span>${money(t.total)}</span></div>
    ${used ? `<div class="open"><span>Bravo Bonus used</span><span>−${money(used)}</span></div>
      <div class="total"><span>You pay</span><span>${money(due)}</span></div>` : ''}
    ${pay === 'giftcard' ? `<div class="open"><span>Bravo Bonus earned</span><span>+${money(BALANCE_BONUS)}</span></div>` : ''}
    ${t.savings ? `<p class="open">Saved: ${money(t.savings)}</p>` : ''}`
}

function refreshPlaceButton() {
  const due = totals().total - bonusUsed()
  const short = payChoice() === 'giftcard' && due > BALANCE
  const btn = $('[data-co-place]')
  btn.textContent = short ? 'Not enough Bravo Balance' : `Place pickup order · ${money(due)}`
  btn.disabled = short
}

// refresh what depends on the cart, payment or bonus, keeping what the shopper typed
function refreshCheckout() {
  // the order lines are the cart's own, with their steppers; keep focus on the button that was pressed
  const focused = document.activeElement?.getAttribute('data-step')
  $('[data-lines]').innerHTML = linesHtml()
  if (focused) $(`[data-lines] [data-step="${focused}"]`)?.focus()
  $('[data-co-count]').textContent = totals().count
  $('[data-offers]').innerHTML = offersHtml()
  $('[data-bonus-box]').innerHTML = bonusHtml()
  $('[data-co-totals]').innerHTML = coTotalsHtml()
  refreshPlaceButton()
}

function renderCheckout() {
  const main = $('[data-checkout-page]')
  if (placed) return renderPlaced(main)
  if (!cart.store) {
    main.innerHTML = `<div class="checkout"><h1>Checkout</h1><p class="empty">Your cart is empty. Add dishes from any restaurant to start a pickup order.</p><a class="btn btn-block btn-light" href="index.html#restaurants">Browse restaurants</a></div>`
    return
  }
  // keep typed values when the page redraws (signing in, for example)
  const old = $('[data-co-form]') ? Object.fromEntries(new FormData($('[data-co-form]'))) : {}
  const balanceWasLocked = $('[data-co-form] [name="pay"][value="giftcard"]')?.disabled // just signed in: switch to Balance
  const pay = !signedIn() ? 'card' : old.pay === 'card' && !balanceWasLocked ? 'card' : 'giftcard'
  const store = storeById(cart.store)
  main.innerHTML = `
    <div class="checkout">
      <a class="back" href="restaurant.html?id=${store.id}">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12.5 15 7.5 10l5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Back to menu
      </a>
      <div class="co-title">
        <h1>Checkout</h1>
        <span class="co-secure"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="2"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/></svg>Secure checkout</span>
      </div>
      <form class="co-grid" data-co-form>
        <div class="co-main">
          ${signedIn() ? '' : `
          <section class="co-account">
            <h2>Check out with Bravo</h2>
            <p>Pay with your Bravo Balance, use your Bravo Bonus on this order, and earn ${money(BALANCE_BONUS)} more after pickup.</p>
            <div class="co-account-actions">
              <button class="btn" type="button" data-auth="signup">Create a free account</button>
              <button class="btn btn-light" type="button" data-auth="signin">Sign in</button>
            </div>
          </section>
          <p class="co-or"><span>or continue as a guest</span></p>`}

          <section class="co-section">
            <h2>Pick up at</h2>
            <div class="co-pickup">
              <img class="brand-logo" src="${esc(store.logo)}" alt="" width="48" height="48">
              <div><b>${esc(store.name)}</b><p>${esc(fullAddress(store))}</p></div>
            </div>
          </section>

          <section class="co-section">
            <h2>Pickup details</h2>
            ${field('co-time', 'Pickup time', `<select id="co-time" name="time">${pickupTimes(store).map(o => `<option value="${o.value}"${o.value === old.time ? ' selected' : ''}>${esc(o.label)}</option>`).join('')}</select>`)}
            ${field('co-note', 'Note for the restaurant <span class="optional">(optional)</span>', `<textarea id="co-note" name="note" rows="3" maxlength="200" placeholder="Allergies, spice level, extra utensils…">${esc(old.note ?? '')}</textarea>`)}
          </section>

          <section class="co-section">
            <h2>Contact</h2>
            ${field('co-name', "Who's picking up", `<input id="co-name" name="name" type="text" autocomplete="name" value="${esc(old.name || (signedIn() ? user.name || '' : ''))}" required>`)}
            ${field('co-email', 'Email for your receipt', `<input id="co-email" name="email" type="email" autocomplete="email" value="${esc(old.email || (signedIn() ? user.email || '' : ''))}" required>`)}
            ${field('co-phone', 'Phone <span class="optional">(optional, for order updates)</span>', `<input id="co-phone" name="phone" type="tel" autocomplete="tel" value="${esc(old.phone || (signedIn() ? user.phone || '' : ''))}">`)}
          </section>

          <section class="co-section">
            <h2>Offers</h2>
            <div class="cart-offers" data-offers></div>
          </section>

          <section class="co-section">
            <h2>Payment</h2>
            <fieldset class="field co-pay"><legend class="sr-only">Payment</legend>${payHtml(pay)}</fieldset>
          </section>
        </div>

        <aside class="co-side" aria-label="Your order">
          <div class="co-card">
            <section class="co-store">
              <h2>${esc(store.name)}</h2>
              <p>${esc(fullAddress(store))}</p>
              ${hoursHtml(store)}
            </section>
            <button class="btn btn-block" type="submit" data-co-place></button>
            <h3 class="co-order-title">Your order (<span data-co-count>${totals().count}</span>)</h3>
            <div class="co-lines" data-lines>${linesHtml()}</div>
            <a class="btn btn-block btn-light co-add" href="restaurant.html?id=${store.id}">${PLUS}Add items</a>
            <h3 class="co-total-title">Order total</h3>
            <div class="totals" data-co-totals></div>
            <p class="co-legal">Card payments are handled by Stripe; Bravo never sees your card number. This is a demo: nothing is charged or sent to the restaurant.</p>
          </div>
        </aside>
      </form>
    </div>`
  refreshCheckout()
}

function renderPlaced(main) {
  const p = placed
  main.innerHTML = `
    <div class="checkout"><div class="done">
      <div class="done-mark"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <h1>Thanks, ${esc(p.name)}!</h1>
      <p>${esc(p.store.name)} is preparing your order.</p>
      <span class="code">${p.code}</span>
      <p>Pickup ${esc(p.time)} at ${esc(fullAddress(p.store))}. Show this code at the counter.</p>
      ${p.note ? `<p class="done-note">Your note: “${esc(p.note)}”</p>` : ''}
      <p>${p.pay === 'giftcard'
        ? `${money(p.due)} paid from your Bravo Balance${p.used ? `, after ${money(p.used)} of Bravo Bonus` : ''}. You'll earn ${money(BALANCE_BONUS)} Bravo Bonus after pickup.`
        : `${money(p.due)} charged to your card through Stripe. A receipt is on its way to ${esc(p.email)}.`}</p>
      ${signedIn() ? '' : `<div class="co-account">
        <h2>Earn Bravo Bonus next time</h2>
        <p>Create a free account to pay with Bravo Balance and earn bonus on every pickup.</p>
        <div class="co-account-actions"><button class="btn" type="button" data-auth="signup">Create a free account</button></div>
      </div>`}
      <a class="btn btn-block btn-light" href="index.html">Back to restaurants</a>
    </div></div>`
}

/* ── Events ── */
const main = $('[data-checkout-page]')
main.addEventListener('change', (e) => {
  if (e.target.name === 'pay') refreshCheckout()
  if (e.target.matches('[data-bonus-on]')) { bonusOn = e.target.checked; refreshCheckout() }
})

// dragging snaps to a stop; redraw the dots, labels and totals but keep the same slider so the drag carries on
const setStop = (k) => {
  bonusStop = k
  const box = $('[data-bonus-box]'), at = stopIndex(), last = bonusStops().length - 1
  $('.bonus-slider', box).style.setProperty('--fill', `${(at / last) * 100}%`)
  box.querySelectorAll('.bonus-track i').forEach((dot, i) => dot.classList.toggle('on', i <= at))
  box.querySelectorAll('[data-bonus-stop]').forEach((b, i) => b.classList.toggle('on', i === at))
  $('[data-bonus-amt]', box).value = at
  $('[data-bonus-amt]', box).setAttribute('aria-valuetext', money(bonusUsed()))
  $('[data-bonus-out]', box).textContent = money(bonusUsed())
  $('[data-co-totals]').innerHTML = coTotalsHtml()
  refreshPlaceButton()
}
main.addEventListener('input', (e) => { if (e.target.matches('[data-bonus-amt]')) setStop(Number(e.target.value)) })
main.addEventListener('click', (e) => { const b = e.target.closest('[data-bonus-stop]'); if (b) setStop(Number(b.dataset.bonusStop)) })

main.addEventListener('submit', (e) => {
  e.preventDefault()
  const form = Object.fromEntries(new FormData(e.target))
  const used = bonusUsed()
  placed = {
    store: storeById(cart.store),
    name: form.name.trim(),
    email: form.email.trim(),
    note: form.note.trim(),
    pay: form.pay,
    used,
    due: totals().total - used,
    code: `B${Math.floor(1000 + Math.random() * 9000)}`,
    time: e.target.elements.time.selectedOptions[0].textContent.replace(/^./, c => c.toLowerCase()),
  }
  completeOrder() // empties the cart; the 'cart:change' below shows the pickup code
  scrollTo(0, 0)
})

document.addEventListener('cart:change', () => ($('[data-co-form]') && cart.store ? refreshCheckout() : renderCheckout()))
document.addEventListener('account:change', renderCheckout)
renderCheckout()
