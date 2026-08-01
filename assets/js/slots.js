/* 受取指定(checkout.php): 店舗→日付→時間枠の3段選択。残数は api/slots.php から取得 */
'use strict';

(() => {
  const root = document.getElementById('pickup-picker');
  if (!root) return;
  const base = root.dataset.base;
  const shopInput = document.getElementById('input-shop');
  const dateInput = document.getElementById('input-date');
  const slotInput = document.getElementById('input-slot');
  const slotArea = document.getElementById('slot-area');
  const submitBtn = document.getElementById('pickup-submit');

  const setPressed = (group, btn) => {
    group.querySelectorAll('[aria-pressed]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    btn.setAttribute('aria-pressed', 'true');
  };
  const updateSubmit = () => {
    const need = root.dataset.slotRequired !== '0';
    submitBtn.disabled = !(shopInput.value && dateInput.value && (!need || slotInput.value));
  };

  const loadSlots = async () => {
    slotInput.value = '';
    updateSubmit();
    if (!shopInput.value || !dateInput.value) { slotArea.innerHTML = ''; return; }
    slotArea.innerHTML = '<p class="field-note">時間枠を読み込んでいます…</p>';
    try {
      const res = await fetch(`${base}/api/slots.php?shop_id=${encodeURIComponent(shopInput.value)}&date=${encodeURIComponent(dateInput.value)}`);
      const data = await res.json();
      if (!data.slots || !data.slots.length) {
        slotArea.innerHTML = '<p class="field-error">この日はお受取枠の設定がありません。他の日をお選びいただくか、お電話でご相談ください。</p>';
        return;
      }
      const grid = document.createElement('div');
      grid.className = 'slot-grid';
      for (const s of data.slots) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slot-btn';
        btn.setAttribute('aria-pressed', 'false');
        const full = s.remaining <= 0;
        btn.disabled = full;
        btn.innerHTML = `<span class="slot-time">${s.label}</span><span class="slot-left">${full ? '満枠' : `残り ${s.remaining} 枠`}</span>`;
        if (!full) {
          btn.addEventListener('click', () => {
            setPressed(grid, btn);
            slotInput.value = s.id;
            updateSubmit();
          });
        }
        grid.append(btn);
      }
      slotArea.innerHTML = '<h3 id="slot-heading">お受取時間</h3>';
      slotArea.append(grid);
    } catch {
      slotArea.innerHTML = '<p class="field-error">時間枠の取得に失敗しました。再読み込みしてお試しください。</p>';
    }
  };

  root.querySelectorAll('.shop-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setPressed(root.querySelector('.shop-grid'), btn);
      shopInput.value = btn.dataset.shopId;
      const telBand = document.querySelector('.tel-band__num a');
      if (telBand && btn.dataset.tel) {
        telBand.textContent = btn.dataset.tel;
        telBand.href = 'tel:' + btn.dataset.tel.replace(/[^0-9]/g, '');
        const nameEl = document.querySelector('.tel-band__name');
        if (nameEl) nameEl.textContent = `（${btn.dataset.shopName}）`;
      }
      loadSlots();
    });
  });
  root.querySelectorAll('.date-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setPressed(btn.closest('.cal-wrap') || root.querySelector('.date-grid') || root, btn);
      dateInput.value = btn.dataset.date;
      loadSlots();
    });
  });

  /* 店舗の地域タブ(全店/愛知/岐阜/滋賀) */
  root.querySelectorAll('.shop-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      root.querySelectorAll('.shop-tab').forEach((t) => t.setAttribute('aria-selected', 'false'));
      tab.setAttribute('aria-selected', 'true');
      const region = tab.dataset.region;
      root.querySelectorAll('.shop-btn').forEach((b) => {
        b.hidden = region !== 'all' && b.dataset.region !== region;
      });
    });
  });

  updateSubmit();
})();
