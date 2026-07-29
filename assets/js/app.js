/* 共通: スクロール出現・数量ステッパー・二重送信防止 (ES2022 / 依存ゼロ) */
'use strict';

/* frame-busting(X-Frame-Options の二重防御) */
if (top !== self) { try { top.location = self.location; } catch { document.body.hidden = true; } }

const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* スクロール出現 */
if (!prefersReduced && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    }
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
}

/* 数量ステッパー */
document.querySelectorAll('.qty-stepper').forEach((box) => {
  const input = box.querySelector('input');
  const min = Number(input.min || 1);
  const max = Number(input.max || 99);
  const clamp = (v) => Math.min(max, Math.max(min, v | 0));
  box.querySelectorAll('button[data-step]').forEach((btn) => {
    btn.addEventListener('click', () => {
      input.value = clamp(Number(input.value || min) + Number(btn.dataset.step));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
  input.addEventListener('change', () => { input.value = clamp(Number(input.value || min)); });
});

/* 印刷ボタン */
document.querySelectorAll('[data-print]').forEach((btn) => {
  btn.addEventListener('click', () => window.print());
});

/* 確認ダイアログ(CSP準拠: インラインハンドラ不使用) */
document.querySelectorAll('form[data-confirm]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    if (!confirm(form.dataset.confirm)) e.preventDefault();
  });
});

/* 送信ボタン二重押し防止 */
document.querySelectorAll('form[data-once]').forEach((form) => {
  form.addEventListener('submit', (e) => {
    if (e.defaultPrevented) return;
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = '送信しています…'; }
  });
});
