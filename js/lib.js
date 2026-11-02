// Helpers every module uses: DOM lookup, formatting, browser storage and the shared inline icons.
export const $ = (sel, el = document) => el.querySelector(sel)
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
export const money = n => `CA$${n.toFixed(2)}`
export const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

// localStorage can be missing or blocked (private windows); the page works without it
export const load = (key) => { try { return JSON.parse(localStorage.getItem(key)) } catch { return null } }
export const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)) } catch {} }

export const PLUS = '<img src="assets/icons/plus.svg" alt="" width="20" height="20">'
export const MINUS = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4.16667 10H15.8333" stroke="#202020" stroke-width="1.5" stroke-linecap="round"/></svg>'
export const BIN = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#202020" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 5.5h13M8 5.5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M5 5.5l.8 10.6a1.5 1.5 0 0 0 1.5 1.4h5.4a1.5 1.5 0 0 0 1.5-1.4L15 5.5M8.5 9v5M11.5 9v5"/></svg>'
export const CLOSE = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>'
