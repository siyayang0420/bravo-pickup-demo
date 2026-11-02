// Everything that adds to or shows the cart: dish steppers, the dish dialog, the nav count, the cart bar and the cart drawer.
import { $, esc, money, plural, PLUS, MINUS, CLOSE } from './lib.js'
import { cart, qty, cartLines, setQty, setNote, toggleOffer, totals, ITEMS, storeById, unit, OFFER_PCT, FIRST_MIN } from './state.js'
import { priceHtml, qtyInner, addBtn, dishImg, lessBtn } from './components.js'

const drawer = $('[data-drawer]')
const dishDialog = $('[data-dish-dialog]') // not on the checkout page

/* ── Cart lines, offers and totals (the checkout page uses the first two as well) ── */
export const linesHtml = () => cartLines().map(({ item: i, n }) => `
  <div class="cart-line">
    ${i.image ? dishImg(i, 48, 48) : ''}
    <div class="grow">
      <p>${esc(i.name)}</p>
      ${cart.notes[i.id] ? `<p class="line-note">“${esc(cart.notes[i.id])}”</p>` : ''}
      <p class="line-price">${i.pickup ? `<s>${money(i.price * n)}</s>` : ''}<b>${money(unit(i) * n)}</b></p>
      ${i.pickup ? `<p class="open line-save">You save ${money((i.price - i.pickup) * n)}</p>` : ''}
    </div>
    <div class="stepper">
      ${lessBtn(i, n)}
      <span aria-label="Quantity">${n}</span>
      <button type="button" data-step="${i.id}:1" aria-label="Add one ${esc(i.name)}">${PLUS}</button>
    </div>
  </div>`).join('')

// offers the shopper can apply in the cart; $5 off shows how far a first order is from $50
export function offersHtml() {
  const t = totals()
  const card = (key, title, sub) => {
    const on = cart.applied.includes(key)
    return `<div class="cart-offer${on ? ' is-applied' : ''}"><div><b>${title}</b><small>${sub}</small></div>
      <button class="offer-apply" type="button" data-apply="${key}" aria-pressed="${on}">${on ? 'Remove' : 'Apply'}</button></div>`
  }
  return [
    card('pct', 'Save 10%', cart.applied.includes('pct') ? `Applied: −${money(t.offer)}` : `−${money(Math.round(t.subtotal * OFFER_PCT * 100) / 100)} on this order`),
    !t.firstOrder ? ''
      : t.subtotal >= FIRST_MIN ? card('first', '$5 off your first order', t.first ? `Applied: −${money(t.first)}` : `Orders of ${money(FIRST_MIN)} or more`)
        : `<div class="cart-offer is-locked"><div><b>$5 off your first order</b><small>Add ${money(FIRST_MIN - t.subtotal)} more to use it</small></div></div>`,
  ].join('')
}

// "People also like these": three of the restaurant's dishes not in the cart, featured and photographed ones first
function recsHtml() {
  const store = storeById(cart.store)
  const picks = [...store.featured, ...store.menu.flatMap(c => c.items).map(i => i.id)].map(id => ITEMS.get(id))
    .filter((i, k, all) => !qty(i.id) && all.indexOf(i) === k)
    .sort((a, b) => !a.image - !b.image).slice(0, 3)
  return picks.map(i => `
    <div class="rec-card" data-dish="${i.id}">
      <div class="dish-media">${i.image ? dishImg(i, 140, 140) : ''}${addBtn(i)}</div>
      <p class="rec-name" title="${esc(i.name)}">${esc(i.name)}</p>
      ${priceHtml(i)}
    </div>`).join('')
}

function totalsHtml() {
  const t = totals()
  return `
    <div><span>Subtotal</span><span class="line-price">${t.dishSavings ? `<s>${money(t.subtotal + t.dishSavings)}</s>` : ''}<b>${money(t.subtotal)}</b></span></div>
    ${t.offer ? `<div class="open"><span>Save 10%</span><span>−${money(t.offer)}</span></div>` : ''}
    ${t.first ? `<div class="open"><span>$5 off your first order</span><span>−${money(t.first)}</span></div>` : ''}
    <div><span>GST (5%)</span><span>${money(t.tax)}</span></div>
    <div class="total"><span>Total</span><span>${money(t.total)}</span></div>
    ${t.savings ? `<p class="open">Saved: ${money(t.savings)}</p>` : ''}`
}

/* ── Drawer ── */
function renderDrawer() {
  const head = `<div class="drawer-head"><h2 id="cart-title">Your pickup order</h2><button class="round-btn" type="button" data-close aria-label="Close">${CLOSE}</button></div>`
  if (!cart.store) {
    drawer.innerHTML = `${head}
      <div class="drawer-body"><p class="empty">Your cart is empty. Add dishes from any restaurant to start a pickup order.</p></div>
      <div class="drawer-foot"><a class="btn btn-block btn-light" href="index.html#restaurants">Browse restaurants</a></div>`
    return
  }
  const store = storeById(cart.store)
  const recs = recsHtml()
  drawer.innerHTML = `${head}
    <div class="drawer-body">
      <p class="cart-store">From <a href="restaurant.html?id=${store.id}"><b>${esc(store.name)}</b></a></p>
      <div data-lines>${linesHtml()}</div>
      <div class="cart-offers" data-offers>${offersHtml()}</div>
      <section class="recs" aria-labelledby="recs-title"${recs ? '' : ' hidden'}>
        <h3 id="recs-title">People also like these</h3>
        <div class="rec-list" data-recs>${recs}</div>
      </section>
    </div>
    <div class="drawer-foot">
      <div class="totals" data-totals>${totalsHtml()}</div>
      <a class="btn btn-block" href="checkout.html">Continue to checkout</a>
    </div>`
}

/* ── Redraw after every cart change: nav count, "+" / "− n +" controls, cart bar and the open drawer ── */
function syncCart() {
  const t = totals()
  document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = t.count || '' })
  document.querySelectorAll('.cart-pill').forEach(b => b.setAttribute('aria-label', t.count ? `Cart, ${plural(t.count, 'item')}` : 'Cart'))

  // keep keyboard focus on the control that was pressed
  const focusedStep = document.activeElement?.getAttribute('data-step')
  const focusedCtl = document.activeElement?.closest('[data-qty]')
  for (const ctl of document.querySelectorAll('[data-qty]')) {
    const item = ITEMS.get(ctl.dataset.qty)
    ctl.classList.toggle('on', qty(item.id) > 0)
    ctl.innerHTML = qtyInner(item)
  }
  if (focusedCtl) (focusedCtl.querySelector(`[data-step="${focusedStep}"]`) || focusedCtl.querySelector('[data-step]')).focus()

  const bar = $('[data-cart-bar]') // not on the checkout page
  if (bar) bar.hidden = !t.count
  document.body.classList.toggle('has-cart', t.count > 0)
  if (bar && t.count) bar.innerHTML = `<span>View cart <small>${plural(t.count, 'item')} · ${esc(storeById(cart.store).name)}</small></span><span>${money(t.subtotal)}</span>`

  if (!drawer.open) return
  if (!t.count || !$('[data-lines]', drawer)) return renderDrawer()
  const focused = document.activeElement?.getAttribute('data-step') || document.activeElement?.getAttribute('data-apply')
  $('[data-lines]', drawer).innerHTML = linesHtml()
  $('[data-offers]', drawer).innerHTML = offersHtml()
  const recs = recsHtml()
  $('[data-recs]', drawer).innerHTML = recs
  $('[data-recs]', drawer).closest('section').hidden = !recs
  $('[data-totals]', drawer).innerHTML = totalsHtml()
  if (focused) $(`[data-step="${focused}"], [data-apply="${focused}"]`, drawer)?.focus()
}
document.addEventListener('cart:change', syncCart)
syncCart()

/* ── Dish dialog: the first "+" opens it; bigger photo, note and quantity before adding ── */
let dishQty = 1

function openDish(id) {
  const i = ITEMS.get(id)
  dishQty = 1
  dishDialog.dataset.id = id
  dishDialog.innerHTML = `
    <button class="round-btn dish-close" type="button" data-dish-close aria-label="Close">${CLOSE}</button>
    ${i.image ? `<img class="dish-hero" src="${esc(i.image)}" alt="${esc(i.name)}" width="560" height="420" decoding="async">` : ''}
    <form class="modal-body">
      <h2 id="dish-title">${esc(i.name)}</h2>
      ${i.desc ? `<p class="dish-desc">${esc(i.desc)}</p>` : ''}
      ${priceHtml(i)}
      <div class="field">
        <label for="dish-note">Note for the kitchen <span class="optional">(optional)</span></label>
        <textarea id="dish-note" name="note" rows="2" maxlength="140" placeholder="No onions, extra sauce…"></textarea>
      </div>
      <div class="dish-actions">
        <div class="stepper"><button type="button" data-dish-qty="-1" aria-label="One less">${MINUS}</button><span aria-live="polite">1</span><button type="button" data-dish-qty="1" aria-label="One more">${PLUS}</button></div>
        <button class="btn" type="submit" data-dish-add>Add to cart · ${money(unit(i))}</button>
      </div>
    </form>`
  dishDialog.classList.toggle('no-photo', !i.image)
  dishDialog.showModal()
}

dishDialog?.addEventListener('click', (e) => {
  if (e.target === dishDialog || e.target.closest('[data-dish-close]')) return dishDialog.close()
  const d = e.target.closest('[data-dish-qty]')
  if (!d) return
  dishQty = Math.max(1, dishQty + Number(d.dataset.dishQty))
  $('.stepper span', dishDialog).textContent = dishQty
  $('[data-dish-add]', dishDialog).textContent = `Add to cart · ${money(unit(ITEMS.get(dishDialog.dataset.id)) * dishQty)}`
})

dishDialog?.addEventListener('submit', (e) => {
  e.preventDefault()
  const id = dishDialog.dataset.id
  const note = new FormData(e.target).get('note').trim()
  if (!setQty(id, qty(id) + dishQty)) return // kept the other restaurant's order
  if (note) setNote(id, note)
  dishDialog.close()
})

/* ── Clicks anywhere: steppers, dish cards, offers, and opening or closing the drawer ── */
document.addEventListener('click', (e) => {
  if (dishDialog?.contains(e.target)) return
  const stepBtn = e.target.closest('[data-step]')
  if (stepBtn) {
    const [id, d] = stepBtn.dataset.step.split(':')
    if (!qty(id) && d === '1') return openDish(id)
    return setQty(id, qty(id) + Number(d))
  }
  const dish = !e.target.closest('a') && e.target.closest('[data-dish]') // anywhere on a dish card or menu row, except its links
  if (dish) return openDish(dish.dataset.dish)
  const apply = e.target.closest('[data-apply]')
  if (apply) return toggleOffer(apply.dataset.apply)
  if (e.target.closest('[data-open-cart]')) { renderDrawer(); return drawer.showModal() }
  if (e.target.closest('[data-close]') || e.target === drawer) drawer.close()
})
