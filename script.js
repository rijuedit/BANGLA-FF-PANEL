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
  freePanel:'free-panel.html', freeBypass:'free-bypass.html', emulator:'emulator.html',
  freeFireApk:'free-fire-apk.html', buyPanel:'buy-panel.html', mobilePanel:'mobile-panel.html'
};

let globalDiscordLink = "https://discord.gg/9VGgu48bY";
let buyWebhook = "";
let mobileWebhook = "";
let buyDiscordLink = "";
let mobileDiscordLink = "";
let selectedBuy = null;
let selectedMobile = null;

if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  db.ref('panel_data').on('value', (snapshot) => {
    const data = snapshot.val() || {};

    if (data.general?.logo) {
      document.querySelectorAll('.site-logo, .brand-logo img').forEach(img => img.src = data.general.logo);
    }
    if (data.general?.discord) {
      globalDiscordLink = data.general.discord;
      document.querySelectorAll('.discord-btn, .support-btn').forEach(a => a.href = globalDiscordLink);
    }
    if (data.general?.topup) {
      document.querySelectorAll('.topup-btn').forEach(a => a.href = data.general.topup);
    }

    buyWebhook = data.buyButton?.webhook || '';
    mobileWebhook = data.mobilePanel?.webhook || '';
    buyDiscordLink = data.buyButton?.link || globalDiscordLink;
    mobileDiscordLink = data.mobilePanel?.ticketLink || globalDiscordLink;

    if (data.homeCards && Array.isArray(data.homeCards)) renderHomeCards(data.homeCards);

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

      const listBox = document.getElementById('mp-package-list');
      if (listBox && Array.isArray(data.mobilePanel.packages)) {
        listBox.innerHTML = '';
        data.mobilePanel.packages.forEach((item, idx) => {
          const priceShow = item.displayPrice || (item.durationText ? `${item.priceText||'৳'+item.price} / ${item.durationText}` : (item.priceText||'৳'+item.price));
          const name = item.name || 'PACKAGE';
          listBox.innerHTML += `
            <div class="mp-package-item" data-idx="${idx}" onclick="selectPackage('mobile', ${idx}, '${esc(name)}', '${esc(priceShow)}')">
              <div class="mp-pkg-left">
                <div class="mp-pkg-icon"><i class='bx bxs-crown'></i></div>
                <div class="mp-pkg-text"><h3>${name}</h3><p>${item.desc||''}</p></div>
              </div>
              <div class="mp-pkg-right">
                <div class="mp-pkg-price">${priceShow}</div>
                <button type="button" class="item-buy-btn" onclick="event.stopPropagation(); selectAndBuy('mobile', '${esc(name)}', '${esc(priceShow)}')">
                  <i class='bx bx-cart'></i> BUY
                </button>
              </div>
            </div>`;
        });
      }
    }

    else if (path.includes('buy-panel')) {
      const box = document.getElementById('buy-panel-list') || document.querySelector('.panel-list');
      if (box && Array.isArray(data.buyList)) {
        box.innerHTML = '';
        data.buyList.forEach((item, idx) => {
          const priceShow = item.displayPrice || (item.durationText ? `${item.priceText||'৳'+item.price} / ${item.durationText}` : (item.priceText||'৳'+item.price));
          const name = item.name || 'PANEL';
          box.innerHTML += `
            <div class="panel-list-item" data-idx="${idx}" onclick="selectPackage('buy', ${idx}, '${esc(name)}', '${esc(priceShow)}')">
              <div class="panel-info">
                <div class="panel-icon"><i class='bx bxs-crown'></i></div>
                <div class="panel-text"><h3>${name}</h3><p>${item.desc||''}</p></div>
              </div>
              <div class="panel-right-group">
                <div class="panel-price">${priceShow}</div>
                <button type="button" class="item-buy-btn" onclick="event.stopPropagation(); selectAndBuy('buy', '${esc(name)}', '${esc(priceShow)}')">
                  <i class='bx bx-cart'></i> BUY
                </button>
              </div>
            </div>`;
        });
      }
      if (data.buyButton) {
        const label = document.getElementById('buy-now-label');
        if (label && data.buyButton.text) label.innerText = data.buyButton.text;
      }
    }
  });
}

function esc(s) {
  return String(s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function selectPackage(type, idx, name, price) {
  if (type === 'buy') {
    selectedBuy = { name, price };
    document.querySelectorAll('.panel-list-item').forEach(el => el.classList.remove('selected'));
    const el = document.querySelector(`.panel-list-item[data-idx="${idx}"]`);
    if (el) el.classList.add('selected');
    const hint = document.getElementById('buy-selected-hint');
    if (hint) hint.innerText = `সিলেক্টেড: ${name} — ${price}`;
  } else {
    selectedMobile = { name, price };
    document.querySelectorAll('.mp-package-item').forEach(el => el.classList.remove('selected'));
    const el = document.querySelector(`.mp-package-item[data-idx="${idx}"]`);
    if (el) el.classList.add('selected');
    const hint = document.getElementById('mp-selected-hint');
    if (hint) hint.innerText = `সিলেক্টেড: ${name} — ${price}`;
  }
}

function selectAndBuy(type, name, price) {
  if (type === 'buy') selectedBuy = { name, price };
  else selectedMobile = { name, price };
  buyNowClick(type);
}

function buyNowClick(type) {
  const selected = type === 'mobile' ? selectedMobile : selectedBuy;
  if (!selected) {
    alert(type === 'mobile' ? 'আগে একটি Mobile প্যাকেজ সিলেক্ট করুন!' : 'আগে একটি PC প্যাকেজ সিলেক্ট করুন!');
    return;
  }

  const pageName = type === 'mobile' ? '📱 MOBILE PANEL' : '💻 BUY PANEL (PC)';
  const webhook = type === 'mobile' ? mobileWebhook : buyWebhook;
  const invite = type === 'mobile' ? (mobileDiscordLink || globalDiscordLink) : (buyDiscordLink || globalDiscordLink);

  sendBuyAlert(pageName, selected.name, selected.price, webhook);
  window.open(invite, '_blank');
}

function ticketClick(e) {
  // TICKET alone - optional alert without package
  if (mobileWebhook) {
    sendBuyAlert('📱 MOBILE PANEL', 'TICKET button (no package)', '—', mobileWebhook);
  }
  return true; // allow default href
}

function sendBuyAlert(pageName, packageName, packagePrice, webhookUrl) {
  if (!webhookUrl || !webhookUrl.startsWith('http')) return;
  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: `🔔 **NEW ORDER CLICK!**\n📄 **Section:** \`${pageName}\`\n📦 **Package:** \`${packageName}\`\n💰 **Price:** \`${packagePrice}\`\n⏰ **Time:** \`${new Date().toLocaleString()}\`\n👉 User going to Discord...`
    })
  }).catch(() => {});
}

function renderHomeCards(cards) {
  const container = document.getElementById('home-cards'); if (!container) return;
  let html = '', n = 0;
  cards.forEach(c => {
    if (c.visible === false) return;
    n++;
    const href = PAGE_MAP[c.key] || '#';
    const badge = c.featured ? '<span class="featured-badge">FEATURED</span>' : '';
    const icon = (c.icon && c.icon.startsWith('http'))
      ? `<img src="${c.icon}" style="width:28px;height:28px;object-fit:contain;">`
      : `<span class="emoji">${c.icon||'📦'}</span>`;
    html += `<a href="${href}" class="system-card ${c.featured?'featured':''}" style="text-decoration:none;display:block;">
      <div class="card-art">${badge}<div class="icon-frame">${icon}</div></div>
      <div class="card-info"><h2>${c.title||'PANEL'}</h2><p>${c.subtitle||''}</p><span class="explore">Explore <b>→</b></span></div>
    </a>`;
  });
  container.innerHTML = html;
  const countEl = document.getElementById('system-count');
  if (countEl) countEl.innerText = String(n).padStart(2,'0') + ' SYSTEMS';
}

function applyPageData(p) {
  const videoWrap = document.querySelector('.video-container');
  const video = document.getElementById('main-video');
  const skip = document.querySelector('.how-to-skip-btn');
  const pass = document.getElementById('panel-password');
  const dlGrid = document.querySelector('.download-grid');

  if (videoWrap) {
    if (p.showVideo === false) videoWrap.style.display = 'none';
    else { videoWrap.style.display = ''; if (video && p.video) video.src = formatYT(p.video); }
  }
  if (skip) {
    if (p.showSkip === false) skip.style.display = 'none';
    else { skip.style.display = ''; if (p.skip) skip.href = p.skip; }
  }
  if (pass && p.pass) pass.innerText = p.pass;

  if (dlGrid && p.downloads && Array.isArray(p.downloads)) {
    dlGrid.innerHTML = '';
    p.downloads.forEach(dl => {
      dlGrid.innerHTML += `<div class="download-box">
        <div class="dl-box-top">
          <div class="dl-icon-frame"><i class='bx bx-shield-alt-2'></i></div>
          <span class="version-badge">${dl.badge||'LIVE'}</span>
        </div>
        <h3 class="dl-title">${dl.title||'DOWNLOAD'}</h3>
        <a href="${dl.url||'#'}" target="_blank" class="dl-btn"><i class='bx bx-download'></i> Download</a>
      </div>`;
    });
  }
}

function formatYT(url) {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  if (url.includes('watch?v=')) return 'https://www.youtube.com/embed/'+url.split('watch?v=')[1].split('&')[0];
  if (url.includes('youtu.be/')) return 'https://www.youtube.com/embed/'+url.split('youtu.be/')[1].split('?')[0];
  return url;
}

document.addEventListener('mousemove', e => {
  const g = document.querySelector('.mouse-glow');
  if (g) { g.style.left = e.clientX+'px'; g.style.top = e.clientY+'px'; }
});

function copyPassword() {
  const el = document.getElementById('panel-password'); if (!el) return;
  navigator.clipboard.writeText(el.innerText).then(() => {
    const btn = document.querySelector('.copy-btn'); if (!btn) return;
    const old = btn.innerHTML;
    btn.innerHTML = "<i class='bx bx-check'></i> Copied!";
    setTimeout(() => btn.innerHTML = old, 2000);
  });
}
