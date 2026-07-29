/* 予約完了の紙吹雪: 金・朱・白 / canvas + rAF / 3秒で自然停止 / DOM要素不使用 */
'use strict';

(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const DPR = Math.min(devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = innerWidth * DPR;
    canvas.height = innerHeight * DPR;
  };
  resize();
  addEventListener('resize', resize, { passive: true });

  const COLORS = ['#B99334', '#C4342E', '#FFFFFF', '#D9BC6B'];
  const N = 120;
  const parts = Array.from({ length: N }, () => ({
    x: Math.random() * canvas.width,
    y: -Math.random() * canvas.height * 0.4,
    w: (4 + Math.random() * 5) * DPR,
    h: (8 + Math.random() * 8) * DPR,
    vy: (1.6 + Math.random() * 2.4) * DPR,
    vx: (Math.random() - 0.5) * 1.6 * DPR,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.18,
    color: COLORS[(Math.random() * COLORS.length) | 0],
  }));

  const start = performance.now();
  const DURATION = 3000;
  const frame = (t) => {
    const elapsed = t - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const fade = elapsed > DURATION - 600 ? Math.max(0, (DURATION - elapsed) / 600) : 1;
    ctx.globalAlpha = fade;
    for (const p of parts) {
      p.x += p.vx + Math.sin(t / 300 + p.rot) * 0.6 * DPR;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(t / 250 + p.rot)));
      ctx.restore();
    }
    if (elapsed < DURATION) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  requestAnimationFrame(frame);
})();
