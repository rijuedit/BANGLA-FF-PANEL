// =========================================
// BANGLA FF PANEL - MAIN SITE DYNAMIC SCRIPT
// =========================================
const firebaseConfig = {
  apiKey: "AIzaSyDOFL6dKvw_RfyKMe3QQgvE4lt7Gtc4yaM",
  authDomain: "bangla-ff-admin.firebaseapp.com",
  databaseURL: "https://bangla-ff-admin-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bangla-ff-admin",
  storageBucket: "bangla-ff-admin.firebasestorage.app",
  messagingSenderId: "295013484465",
  appId: "1:295013484465:web:b6bc2a949e239095761f90",
  measurementId: "G-BBL16S84J8"
};

const PAGE_MAP = {
  freePanel: 'free-panel.html',
  freeBypass: 'free-bypass.html',
  emulator: 'emulator.html',
  freeFireApk: 'free-fire-apk.html',
  buyPanel: 'buy-panel.html',
  mobilePanel: 'mobile-panel.html'
};

if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  db.ref('panel_data').on('value', (snapshot) => {
    const data = snapshot.val() || {};

    // 1. Logo Update
    if (data.general?.logo) {
      document.querySelectorAll('.site-logo, .brand-logo img').forEach(img => img.src = data.general.logo);
    }

    // 2. Discord & TopUp Update
    if (data.general?.discord) {
      document.querySelectorAll('a[href*="discord"], .discord-btn, .support-btn, .buy-now-btn').forEach(a => a.href = data.general.discord);
    }
    if (data.general?.topup) {
      document.querySelectorAll('.topup-btn').forEach(a => a.href = data.general.topup);
    }

    // 3. Homepage Dynamic Cards
    if (data.homeCards && Array.isArray(data.homeCards)) {
      renderHomeCards(data.homeCards);
    }

    // 4. Page Specific Data Updates
    const path = window.location.pathname;

    if (path.includes('free-panel') && data.freePanel) applyPageData(data.freePanel);
    else if (path.includes('free-bypass') && data.freeBypass) applyPageData(data.freeBypass);
    else if (path.includes('emulator') && data.emulator) applyPageData(data.emulator);
    else if (path.includes('free-fire-apk') && data.apk) applyPageData(data.apk);
    else if (path.includes('mobile-panel') && data.mobilePanel) {
      const msg = document.getElementById('mp-message-text');
      const btn = document.getElementById('mp-ticket-btn');
      const label = document.getElementById('mp-btn-label');
      if (msg && data.mobilePanel.message) msg.innerText = data.mobilePanel.message;
      if (label && data.mobilePanel.btnText) label.innerText = data.mobilePanel.btnText;
      if (btn && data.mobilePanel.ticketLink) btn.href = data.mobilePanel.ticketLink;
    }
    else if (path.includes('buy-panel') && data.buyList) {
      const box = document.querySelector('.panel-list');
      if (box && Array.isArray(data.buyList)) {
        box.innerHTML = '';
        data.buyList.forEach(item => {
          const priceShow = item.displayPrice || (item.durationText ? `${item.priceText || ('৳' + item.price)} / ${item.durationText}` : (item.priceText || ('৳' + item.price)));
          box.innerHTML += `
            <div class="panel-list-item">
              <div class="panel-info">
                <div class="panel-icon"><i class='bx bxs-crown'></i></div>
                <div class="panel-text">
                  <h3>${item.name || 'PANEL'}</h3>
                  <p>${item.desc || ''}</p>
                </div>
              </div>
              <div class="panel-price">${priceShow}</div>
            </div>`;
        });
      }
    }
  });
}

function renderHomeCards(cards) {
  const container = document.getElementById('home-cards');
  if (!container) return;

  let html = '';
  let visibleCount = 0;

  cards.forEach(c => {
    if (c.visible === false) return;
    visibleCount++;
    const href = PAGE_MAP[c.key] || '#';
    const featuredBadge = c.featured ? '<span class="featured-badge">FEATURED</span>' : '';
    const iconContent = (c.icon && c.icon.startsWith('http'))
      ? `<img src="${c.icon}" style="width:28px;height:28px;object-fit:contain;">`
      : `<span class="emoji">${c.icon || '📦'}</span>`;

    html += `
      <a href="${href}" class="system-card ${c.featured ? 'featured' : ''}" data-card="${c.key}" style="text-decoration:none;display:block;">
        <div class="card-art">
          ${featuredBadge}
          <div class="icon-frame">${iconContent}</div>
        </div>
        <div class="card-info">
          <h2>${c.title || 'PANEL'}</h2>
          <p>${c.subtitle || ''}</p>
          <span class="explore">Explore <b>→</b></span>
        </div>
      </a>`;
  });

  container.innerHTML = html;
  const countEl = document.getElementById('system-count');
  if (countEl) countEl.innerText = String(visibleCount).padStart(2, '0') + ' SYSTEMS';
}

function applyPageData(p) {
  const videoWrap = document.querySelector('.video-container');
  const video = document.getElementById('main-video');
  const skip = document.querySelector('.how-to-skip-btn');
  const pass = document.getElementById('panel-password');
  const dlGrid = document.querySelector('.download-grid');

  if (videoWrap) {
    if (p.showVideo === false) videoWrap.style.display = 'none';
    else {
      videoWrap.style.display = '';
      if (video && p.video) video.src = formatYT(p.video);
    }
  }

  if (skip) {
    if (p.showSkip === false) skip.style.display = 'none';
    else {
      skip.style.display = '';
      if (p.skip) skip.href = p.skip;
    }
  }

  if (pass && p.pass) pass.innerText = p.pass;

  if (dlGrid && p.downloads && Array.isArray(p.downloads)) {
    dlGrid.innerHTML = '';
    p.downloads.forEach(dl => {
      const badgeText = dl.badge || 'LIVE';
      dlGrid.innerHTML += `
        <div class="download-box">
          <div class="dl-box-top">
            <div class="dl-icon-frame"><i class='bx bx-shield-alt-2'></i></div>
            <span class="version-badge">${badgeText}</span>
          </div>
          <h3 class="dl-title">${dl.title || 'DOWNLOAD LINK'}</h3>
          <a href="${dl.url || '#'}" target="_blank" class="dl-btn">
            <i class='bx bx-download'></i> Download
          </a>
        </div>`;
    });
  }
}

function formatYT(url) {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  if (url.includes('watch?v=')) return 'https://www.youtube.com/embed/' + url.split('watch?v=')[1].split('&')[0];
  if (url.includes('youtu.be/')) return 'https://www.youtube.com/embed/' + url.split('youtu.be/')[1].split('?')[0];
  return url;
}

// Mouse Glow
document.addEventListener('mousemove', e => {
  const g = document.querySelector('.mouse-glow');
  if (g) { g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; }
});

// Copy Password
function copyPassword() {
  const el = document.getElementById('panel-password');
  if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    const btn = document.querySelector('.copy-btn');
    if (!btn) return;
    const old = btn.innerHTML;
    btn.innerHTML = "<i class='bx bx-check'></i> Copied!";
    setTimeout(() => btn.innerHTML = old, 2000);
  });
}
