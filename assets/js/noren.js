/* シグネチャ「のれん割れ」: 企画ページ初回のみ / 0.9s / sessionStorage 1回限り */
'use strict';

(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const slug = document.body.dataset.norenKey;
  if (!slug) return;
  const key = 'noren_seen_' + slug;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch { return; }

  const overlay = document.createElement('div');
  overlay.className = 'noren-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 4; i++) {
    overlay.append(Object.assign(document.createElement('div'), { className: 'noren-panel' }));
  }
  document.body.append(overlay);

  requestAnimationFrame(() => {
    overlay.classList.add('play');
    setTimeout(() => overlay.classList.add('split'), 30);
    setTimeout(() => overlay.remove(), 950);
  });
})();
