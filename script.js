// Mark JS as available so CSS only hides .reveal items when scripts run
document.documentElement.classList.add('js');

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

// ===== Mobile menu =====
const burger = $('#burger');
const navEl = $('.nav nav');
function setMenu(open) {
  navEl.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
burger.addEventListener('click', () => setMenu(!navEl.classList.contains('open')));
$$('#menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// ===== Scroll reveal =====
const revealer = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); revealer.unobserve(en.target); }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach((el) => revealer.observe(el));

// ===== Active nav link =====
const links = $$('#menu a');
const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
$$('main section[id]').forEach((s) => spy.observe(s));

// ===== Back to top =====
const topBtn = $('#top');
window.addEventListener('scroll', () => topBtn.classList.toggle('show', window.scrollY > 500), { passive: true });
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ===== Footer year =====
$('#year').textContent = new Date().getFullYear();

// ===== Contact form validation =====
const form = $('#form');
const rules = {
  name: (v) => (v.trim().length < 2 ? 'Enter your name (at least 2 characters).' : ''),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.'),
  subject: (v) => (v.trim().length < 3 ? 'Enter a subject (at least 3 characters).' : ''),
  message: (v) => (v.trim().length < 10 ? 'Write a message of at least 10 characters.' : ''),
};
function check(field) {
  const input = form.elements[field];
  const msg = rules[field](input.value);
  $('#e-' + field).textContent = msg;
  input.classList.toggle('invalid', !!msg);
  input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  return !msg;
}
Object.keys(rules).forEach((f) => form.elements[f].addEventListener('blur', () => check(f)));

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const ok = Object.keys(rules).map(check).every(Boolean);
  const status = $('#status');
  if (!ok) { status.textContent = ''; return; }
  // No backend yet: open the visitor's email app with the message prefilled.
  // To use a form service (Formspree, Netlify Forms), replace this with a fetch() call.
  const { name, email, subject, message } = form.elements;
  const body = `${message.value}\n\nFrom: ${name.value} (${email.value})`;
  window.location.href = `mailto:gboopathy2005@gmail.com?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Opening your email app to send the message.';
  form.reset();
});
