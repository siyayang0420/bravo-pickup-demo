// The nav on every page: its soft edge once the page scrolls, the account menu, and the sign-in dialog.
// Sign-in has the same views and flow as bravoup.ca's LoginModal.vue (demo: nothing is checked or sent).
import { $, esc, CLOSE } from './lib.js'
import { user, signedIn, signIn, signOut, BALANCE } from './state.js'

const nav = $('.nav')
const onScroll = () => nav.classList.toggle('scrolled', scrollY > 0)
addEventListener('scroll', onScroll, { passive: true })
onScroll()

const icon = (paths, size = 20) => `<svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`
const ICONS = {
  user: '<circle cx="10" cy="6.75" r="3.25"/><path d="M3.75 17a6.25 6.25 0 0 1 12.5 0"/>',
  chevron: '<path d="m5 7.5 5 5 5-5"/>',
  card: '<rect x="2.75" y="4.75" width="14.5" height="10.5" rx="2"/><path d="M2.75 8.25h14.5M5.75 12.25h3"/>',
  logout: '<path d="M8 3.75H5a1.25 1.25 0 0 0-1.25 1.25v10A1.25 1.25 0 0 0 5 16.25h3M12.5 13.5 16 10l-3.5-3.5M16 10H7.5"/>',
  mail: '<rect x="2.75" y="4.25" width="14.5" height="11.5" rx="2"/><path d="m3.25 5.25 6.75 5.25 6.75-5.25"/>',
  lock: '<rect x="4.25" y="8.75" width="11.5" height="8" rx="2"/><path d="M6.75 8.75V6.5a3.25 3.25 0 0 1 6.5 0v2.25"/>',
  phone: '<rect x="5.75" y="2.25" width="8.5" height="15.5" rx="2"/><path d="M9 14.75h2"/>',
  back: '<path d="M16 10H4.5M9 4.5 3.5 10 9 15.5"/>',
  check: '<circle cx="10" cy="10" r="7.25"/><path d="m7 10.25 2 2 4-4.25"/>',
}
const GOOGLE = '<svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>'

/* ── Account menu ── */
const DEMO_AVATAR = 'assets/avatar-demo.jpg' // demo profile picture: a bubble tea cup
const shownName = () => user.name || user.email?.split('@')[0] || (user.phone ? `•••-${user.phone.slice(-4)}` : 'My account')
// bravoup.ca's account menu (routesProfileLinks in the website repo), then Log Out
const PROFILE_LINKS = [
  ['Profile Settings', 'https://www.bravoup.ca/profile', '<circle cx="10" cy="10" r="7.25"/><circle cx="10" cy="8.5" r="2.5"/><path d="M5.5 15.2a5 5 0 0 1 9 0"/>'],
  ['My Gift Card', 'https://www.bravoup.ca/profile/wallet', ICONS.card],
  ['Transactions', 'https://www.bravoup.ca/profile/transactions', '<path d="M3 7h12.5l-3-3M17 13H4.5l3 3"/>'],
  ['Order History', 'https://www.bravoup.ca/profile/orders', '<path d="M2.75 3.25h2l2 9.5h8.5l1.75-6.5H6"/><circle cx="8" cy="16" r="1"/><circle cx="14.5" cy="16" r="1"/>'],
]

function renderAccount() {
  const slot = $('[data-auth-slot]')
  if (!signedIn()) {
    slot.innerHTML = `<button class="btn-ghost nav-signin" type="button" data-auth="signin">${icon(ICONS.user, 18)}Sign in</button>`
    return
  }
  slot.innerHTML = `
    <details class="user-menu">
      <summary class="btn-ghost"><img class="avatar" src="${DEMO_AVATAR}" alt="" width="24" height="24"><span class="user-name">${esc(shownName())}</span>${icon(ICONS.chevron, 16)}</summary>
      <div class="user-menu-list">
        ${PROFILE_LINKS.map(([label, href, paths]) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${icon(paths)}${label}</a>`).join('')}
        <button type="button" data-signout>${icon(ICONS.logout)}Log Out</button>
      </div>
    </details>
    <a class="hero-btn" href="https://www.bravoup.ca/profile/wallet" target="_blank" rel="noopener noreferrer"><span class="hero-btn__rim" aria-hidden="true"><i></i><i></i></span>${icon(ICONS.card, 18)}Balance • $${Math.floor(BALANCE)}</a>
    <a class="gift-chip" href="https://www.bravoup.ca/profile/wallet" target="_blank" rel="noopener noreferrer" aria-label="Your Bravo Balance: $${BALANCE.toFixed(2)}">${icon(ICONS.card, 16)}$${Math.floor(BALANCE)}</a>`
}
document.addEventListener('account:change', renderAccount)
renderAccount()

/* ── Sign-in dialog: login · signup (form → email code) · reset (email → code + new password → done) · phone (number → SMS code) ── */
const authDialog = $('[data-auth-dialog]')
let authView = 'login'
let authStep = 1
let authDraft = {} // what the shopper typed, carried between steps
let resendTimer = null

const req = '<span class="req" aria-hidden="true">*</span>'
const authField = (id, label, ico, attrs, hint = '') => `
  <div class="auth-field"><label for="${id}">${label}${req}</label>
    <div class="auth-input">${icon(ICONS[ico])}<input id="${id}" ${attrs} required></div>${hint}</div>`
const pin = () => `<div class="pin" data-pin>${Array.from({ length: 6 }, (_, k) => `<input inputmode="numeric" maxlength="1" pattern="[0-9]" aria-label="Digit ${k + 1}" placeholder="-" required>`).join('')}</div>`
const PW_RULE = 'Must be at least 8 characters, with 1 uppercase, 1 lowercase, and 1 number.'
const PW_PATTERN = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}'

function authHtml() {
  const back = `<button class="auth-icon-btn auth-back" type="button" data-auth-back aria-label="Back">${icon(ICONS.back)}</button>`
  const card = (title, body, foot, withBack = true) => `
    <button class="auth-icon-btn auth-close" type="button" data-auth-close aria-label="Close">${CLOSE}</button>
    <div class="auth-head">${withBack ? back : ''}<h2 id="auth-title">${title}</h2></div>
    <div class="auth-body">${body}</div>
    ${foot ? `<div class="auth-foot">${foot}</div>` : ''}`
  const footLink = (text, view, label) => `${text} <button class="auth-link" type="button" data-auth-view="${view}">${label}</button>`
  const sub = text => `<p class="auth-sub">${text}</p>`
  const err = '<p class="auth-error" data-auth-error hidden></p>'
  const submit = label => `<button class="btn btn-block auth-submit" type="submit">${label}</button>`
  const d = authDraft

  if (authView === 'login') return card('Welcome to Bravo', `
    ${sub('Log In to enjoy your Bravo benefits!')}
    <form class="auth-form" data-auth-form="login">
      ${authField('auth-email', 'Email', 'mail', `name="email" type="email" autocomplete="email" placeholder="you@example.com" value="${esc(d.email ?? '')}"`)}
      ${authField('auth-password', 'Password', 'lock', 'name="password" type="password" autocomplete="current-password" placeholder="Password"')}
      <div><button class="auth-link" type="button" data-auth-view="reset">Forgot password</button></div>
      ${err}${submit('Log In')}
    </form>
    <p class="auth-or"><span>Or</span></p>
    <div class="auth-alt">
      <button class="auth-outline" type="button" data-auth-google>${GOOGLE}Continue with Google</button>
      <button class="auth-outline" type="button" data-auth-view="phone">${icon(ICONS.phone)}Continue with phone</button>
    </div>`, footLink("Don't have an account?", 'signup', 'Sign up'), false)

  if (authView === 'signup') return card(authStep === 1 ? 'Create An Account' : 'Check Your Email', authStep === 1 ? `
    ${sub('Join Bravo & start saving today!')}
    <form class="auth-form" data-auth-form="signup">
      ${authField('auth-email', 'Email', 'mail', `name="email" type="email" autocomplete="email" placeholder="you@example.com" value="${esc(d.email ?? '')}"`)}
      ${authField('auth-password', 'Password', 'lock', `name="password" type="password" autocomplete="new-password" placeholder="Password" pattern="${PW_PATTERN}" title="${PW_RULE}"`, `<p class="auth-hint">${PW_RULE}</p>`)}
      ${authField('auth-confirm', 'Confirm Password', 'lock', 'name="confirm" type="password" autocomplete="new-password" placeholder="Confirm Password"')}
      ${err}${submit('Continue')}
    </form>` : `
    ${sub(`We sent a verification code to <b>${esc(d.email)}</b>`)}
    <form class="auth-form auth-form-code" data-auth-form="signup-code">${pin()}${err}${submit('Verify &amp; Sign Up')}</form>`,
  footLink('Already have an account?', 'login', 'Log in'))

  if (authView === 'reset') return card(['Reset Password', 'Enter Code & New Password', 'Password Reset'][authStep - 1], [`
    ${sub('Enter your email to receive a reset code.')}
    <form class="auth-form" data-auth-form="reset-email">
      ${authField('auth-email', 'Email', 'mail', `name="email" type="email" autocomplete="email" placeholder="you@example.com" value="${esc(d.email ?? '')}"`)}
      ${err}${submit('Send Code')}
    </form>`, `
    ${sub(`Enter the code sent to <b>${esc(d.email)}</b> and your new password.`)}
    <form class="auth-form" data-auth-form="reset-code">
      <p class="auth-pin-label">Verification Code</p>${pin()}
      ${authField('auth-password', 'New Password', 'lock', `name="password" type="password" autocomplete="new-password" placeholder="New Password" pattern="${PW_PATTERN}" title="${PW_RULE}"`, `<p class="auth-hint">${PW_RULE}</p>`)}
      ${authField('auth-confirm', 'Confirm New Password', 'lock', 'name="confirm" type="password" autocomplete="new-password" placeholder="Confirm New Password"')}
      ${err}${submit('Reset Password')}
    </form>`, `
    <div class="auth-done">${icon(ICONS.check, 64)}<p class="auth-done-title">Password Reset Successful!</p><p>You can now log in with your new password.</p>
      <button class="btn" type="button" data-auth-view="login">Back to Log In</button></div>`][authStep - 1],
  footLink('Remembered your password?', 'login', 'Log in'), authStep < 3)

  // phone
  return card(authStep === 1 ? 'Log in with phone' : 'Enter your code', authStep === 1 ? `
    ${sub("We'll text you a 6-digit code. New to Bravo? An account is created for you.")}
    <form class="auth-form" data-auth-form="phone">
      <div class="auth-field"><label for="auth-phone">Canadian mobile number${req}</label>
        <div class="auth-input auth-phone"><span class="auth-cc">🇨🇦 +1</span><input id="auth-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="(604) 555-0123" pattern="[^0-9]*([0-9][^0-9]*){10}" title="A 10-digit Canadian number" value="${esc(d.phone ?? '')}" required></div></div>
      ${err}${submit('Text me a code')}
      <p class="auth-fine">Canadian numbers only. Message and data rates may apply.</p>
    </form>` : `
    ${sub(`We texted a code to <b>${esc(d.phone)}</b>`)}
    <form class="auth-form auth-form-code" data-auth-form="phone-code">${pin()}${err}${submit('Log In')}</form>
    <p class="auth-resend" data-resend></p>`,
  footLink('Prefer email?', 'login', 'Log in with email'))
}

function showAuth(view, step = 1) {
  authView = view
  authStep = step
  clearInterval(resendTimer)
  authDialog.innerHTML = authHtml()
  if (!authDialog.open) authDialog.showModal()
  $('input, .btn', authDialog)?.focus()
  if (view === 'phone' && step === 2) startResend()
}

function startResend(seconds = 30) {
  let left = seconds
  const tick = () => {
    const el = $('[data-resend]', authDialog)
    if (!el) return clearInterval(resendTimer)
    el.innerHTML = left > 0 ? `Didn't get it? Resend in ${left}s` : 'Didn\'t get it? <button class="auth-link" type="button" data-auth-resend>Resend code</button>'
    left -= 1
    if (left < 0) clearInterval(resendTimer)
  }
  tick()
  resendTimer = setInterval(tick, 1000)
}

const closeAuth = () => { clearInterval(resendTimer); authDialog.close() }
const finish = (fields) => { closeAuth(); signIn(fields) }
const authError = msg => { const el = $('[data-auth-error]', authDialog); el.textContent = msg; el.hidden = false }
const pinValue = form => [...form.querySelectorAll('[data-pin] input')].map(i => i.value).join('')

authDialog.addEventListener('submit', (e) => {
  e.preventDefault()
  const form = e.target, data = Object.fromEntries(new FormData(form)), kind = form.dataset.authForm
  if ((kind === 'signup' || kind === 'reset-code') && data.password !== data.confirm) return authError('Passwords do not match.')
  if (form.querySelector('[data-pin]') && !/^\d{6}$/.test(pinValue(form))) return authError('Enter the 6-digit code.')
  const sameEmail = e => (user?.email === e ? user.name : null)
  if (kind === 'login') return finish({ email: data.email.trim(), name: sameEmail(data.email.trim()) })
  if (kind === 'signup') { authDraft.email = data.email.trim(); return showAuth('signup', 2) }
  if (kind === 'signup-code') return finish({ email: authDraft.email })
  if (kind === 'reset-email') { authDraft.email = data.email.trim(); return showAuth('reset', 2) }
  if (kind === 'reset-code') return showAuth('reset', 3)
  if (kind === 'phone') { authDraft.phone = data.phone.trim(); return showAuth('phone', 2) }
  if (kind === 'phone-code') return finish({ phone: authDraft.phone.replace(/\D/g, '') })
})

authDialog.addEventListener('click', (e) => {
  if (e.target === authDialog || e.target.closest('[data-auth-close]')) return closeAuth()
  const view = e.target.closest('[data-auth-view]')
  if (view) return showAuth(view.dataset.authView)
  if (e.target.closest('[data-auth-back]')) return authStep > 1 ? showAuth(authView, authStep - 1) : showAuth('login')
  if (e.target.closest('[data-auth-google]')) return finish({ name: 'Demo User', email: 'demo.user@gmail.com' }) // demo: no Google round trip
  if (e.target.closest('[data-auth-resend]')) startResend()
})

// 6-digit code boxes: type to move on, Backspace to go back, paste fills them all
authDialog.addEventListener('input', (e) => {
  const box = e.target.closest('[data-pin] input')
  if (!box) return
  box.value = box.value.replace(/\D/g, '').slice(-1)
  if (box.value) box.nextElementSibling?.focus()
})
authDialog.addEventListener('keydown', (e) => {
  const box = e.target.closest('[data-pin] input')
  if (box && e.key === 'Backspace' && !box.value) box.previousElementSibling?.focus()
})
authDialog.addEventListener('paste', (e) => {
  const box = e.target.closest('[data-pin] input')
  if (!box) return
  e.preventDefault()
  const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
  ;[...box.parentElement.children].forEach((b, k) => { b.value = digits[k] ?? '' })
  box.parentElement.children[Math.min(digits.length, 5)].focus()
})

/* ── Anywhere on the page: [data-auth="signin" | "signup"] opens the dialog; the account menu closes on a click outside or Escape ── */
document.addEventListener('click', (e) => {
  const menu = $('.user-menu[open]')
  if (menu && !menu.contains(e.target)) menu.open = false
  const open = e.target.closest('[data-auth]')
  if (open) { authDraft = {}; return showAuth(open.dataset.auth === 'signup' ? 'signup' : 'login') }
  if (e.target.closest('[data-signout]')) signOut()
})

document.addEventListener('keydown', (e) => {
  const menu = $('.user-menu[open]')
  if (e.key === 'Escape' && menu) { menu.open = false; menu.querySelector('summary').focus() }
})
