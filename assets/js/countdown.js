/* 締切カウントダウン(日めくり: 変わる数字だけ1px上へ入替) */
'use strict';

(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nodes = document.querySelectorAll('[data-deadline]');
  if (!nodes.length) return;

  const render = (el, ms) => {
    if (ms <= 0) {
      el.classList.add('countdown--closed');
      el.textContent = el.dataset.closedText || '受付を終了しました';
      return false;
    }
    const d = Math.floor(ms / 86400000);
    const h = Math.floor(ms / 3600000) % 24;
    const m = Math.floor(ms / 60000) % 60;
    const s = Math.floor(ms / 1000) % 60;
    const parts = [['日', d], ['時間', h], ['分', m], ['秒', s]];
    let out = el._built;
    if (!out) {
      el.textContent = '';
      const label = document.createElement('span');
      label.textContent = '締切まで ';
      el.append(label);
      el._nums = {};
      for (const [unit] of parts) {
        const num = document.createElement('span');
        num.className = 'num';
        const inner = document.createElement('span');
        num.append(inner);
        el.append(num, document.createTextNode(unit + ' '));
        el._nums[unit] = inner;
      }
      el._built = true;
    }
    for (const [unit, v] of parts) {
      const inner = el._nums[unit];
      const text = String(v).padStart(2, '0');
      if (inner.textContent !== text) {
        inner.textContent = text;
        if (!reduced) {
          const parent = inner.parentElement;
          parent.classList.remove('tick');
          void parent.offsetWidth; /* reflowでアニメ再始動 */
          parent.classList.add('tick');
        }
      }
    }
    return true;
  };

  const tick = () => {
    let alive = false;
    const now = Date.now();
    nodes.forEach((el) => {
      const dl = Date.parse(el.dataset.deadline); /* ISO8601 +09:00付きで出力される */
      if (render(el, dl - now)) alive = true;
    });
    if (alive) setTimeout(tick, 1000);
  };
  tick();
})();
