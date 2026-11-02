// The demo's state: the restaurants (js/data.js), the signed-in account, and the pickup cart with its offers and totals.
// Every change fires 'account:change' or 'cart:change' on document, and the UI redraws from there.
import data from './data.js'
import { load, save } from './lib.js'

const emit = type => document.dispatchEvent(new Event(type))

/* ── Restaurants ── */
export const STORES = [...data].sort((a, b) => b.rating_count - a.rating_count)
export const ITEMS = new Map(STORES.flatMap(s => s.menu.flatMap(c => c.items.map(i => [i.id, { ...i, store: s }]))))
export const storeById = id => STORES.find(s => s.id === id)
export const unit = i => i.pickup ?? i.price

/* ── Account (demo: name and email only, no password is kept) ── */
const USER_KEY = 'bravo-pickup-user'
export let user = load(USER_KEY) // { name, email, phone, signedIn }
export const signedIn = () => Boolean(user?.signedIn)
// demo amounts for every signed-in account
export const BALANCE = 85
export const BONUS = 12.5

export function signIn(fields) {
  user = { name: null, email: null, phone: null, ...fields, signedIn: true }
  save(USER_KEY, user)
  emit('account:change')
}

export function signOut() {
  user = { ...user, signedIn: false }
  save(USER_KEY, user)
  emit('account:change')
}

/* ── Cart (one restaurant at a time, kept in this browser) ── */
const CART_KEY = 'bravo-pickup-cart'
const ORDERED_KEY = 'bravo-pickup-ordered' // set once an order is placed in this browser
// notes: per-dish requests from the dish dialog; applied: offer keys the shopper applied in the cart
const emptyCart = () => ({ store: null, lines: {}, notes: {}, applied: [] })
export let cart = load(CART_KEY) || emptyCart()
cart.lines = Object.fromEntries(Object.entries(cart.lines || {}).filter(([id]) => ITEMS.has(id)))
cart.notes = Object.fromEntries(Object.entries(cart.notes || {}).filter(([id]) => cart.lines[id]))
cart.applied = cart.applied || []

const commit = () => { save(CART_KEY, cart); emit('cart:change') }

export const qty = id => cart.lines[id] || 0
export const cartLines = () => Object.entries(cart.lines).map(([id, n]) => ({ item: ITEMS.get(id), n }))

export function setQty(id, n) {
  const item = ITEMS.get(id)
  if (n > 0 && cart.store && cart.store !== item.store.id) {
    if (!confirm(`Start a new pickup order from ${item.store.name}? This removes your order from ${storeById(cart.store)?.name}.`)) return false
    cart = emptyCart()
  }
  if (n > 0) { cart.lines[id] = n; cart.store = item.store.id }
  else { delete cart.lines[id]; delete cart.notes[id] }
  if (!Object.keys(cart.lines).length) cart.store = null
  commit()
  return true
}

export function setNote(id, note) { cart.notes[id] = note; commit() }

export function toggleOffer(key) {
  cart.applied = cart.applied.includes(key) ? cart.applied.filter(k => k !== key) : [...cart.applied, key]
  commit()
}

export function completeOrder() {
  save(ORDERED_KEY, true)
  cart = emptyCart()
  commit()
}

/* ── Offers and totals ── */
// demo offers applied from the cart: 10% off, and $5 off a first order of $50 or more
export const OFFER_PCT = 0.10
export const FIRST_OFF = 5
export const FIRST_MIN = 50
// not a discount: paying with Bravo Balance earns this bonus after pickup
export const BALANCE_BONUS = 2
const GST = 0.05

export function totals() {
  const lines = cartLines()
  const subtotal = lines.reduce((t, l) => t + unit(l.item) * l.n, 0)
  const dishSavings = lines.reduce((t, l) => t + (l.item.pickup ? (l.item.price - l.item.pickup) * l.n : 0), 0)
  const offer = cart.applied.includes('pct') ? Math.round(subtotal * OFFER_PCT * 100) / 100 : 0
  const firstOrder = !load(ORDERED_KEY)
  const first = firstOrder && subtotal >= FIRST_MIN && cart.applied.includes('first') ? FIRST_OFF : 0
  const taxable = subtotal - offer - first
  const tax = Math.round(taxable * GST * 100) / 100
  return { count: lines.reduce((t, l) => t + l.n, 0), subtotal, dishSavings, firstOrder, offer, first, savings: dishSavings + offer + first, tax, total: taxable + tax }
}
