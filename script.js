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

const PAGE_MAP = { freePanel:'free-panel.html', freeBypass:'free-bypass.html', emulator:'emulator.html', freeFireApk:'free-fire-apk.html', buyPanel:'buy-panel.html', mobilePanel:'mobile-panel.html' };

let globalDiscordLink = "https://discord.gg/9VGgu48bY";
let buyWebhook = "", mobileWebhook = "";
let buyDiscordLink = "", mobileDiscordLink = "";
let selectedBuy = null, selectedMobile = null;
let globalMobilePackages = [];
let currentMobileFilter = 'ALL';

if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  db.ref('panel_data').on('value', (snapshot) => {
    const data = snapshot.val() || {};

    if (data.general?.logo) document.querySelectorAll('.site-logo, .brand-logo img').forEach(img => img.src = data.general.logo);
    if (data.general?.discord) {
      globalDiscordLink = data.general.discord;
      document.querySelectorAll('a[href*="discord"], .discord-btn, .support-btn, .buy-now-btn').forEach(a => a.href = globalDiscordLink);
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
      const msg = document.getElementById('mp-message-text'), btn = document.getElementById('mp-ticket-btn'), label = document.getElementById('mp-btn-label');
      if (msg) msg.innerText = data.mobilePanel.message || '';
      if (label) label.innerText = data.mobilePanel.btnText || '';
      if (btn) btn.href = data.mobilePanel.ticketLink || '';

      globalMobilePackages = data.mobilePanel.packages || [];
      renderMobilePackagesUI();
    }
    else if (path.includes('buy-panel') && data.buyList) {
      const box = document.querySelector('.panel-list');
      if (box && Array.isArray(data.buyList)) {
        box.innerHTML = '';
        data.buyList.forEach((item, idx) => {
          const sellPrice = item.sellPrice || item.price || 0;
          const displayPrice = item.durationText ? `৳${sellPrice} / ${item.durationText}` : `৳${sellPrice}`;
          box.innerHTML += `<div class="panel-list-item" data-idx="${idx}" onclick="selectPackage('buy', ${idx}, '${esc(item.name)}', '${esc(displayPrice)}')">
            <div class="panel-info"><div class="panel-icon"><i class='bx bxs-crown'></i></div><div class="panel-text"><h3>${item.name}</h3><p>${item.desc||''}</p></div></div>
            <div class="panel-right-group"><div class="panel-price">${displayPrice}</div><button type="button" class="item-buy-btn" onclick="event.stopPropagation(); selectAndBuy('buy', '${esc(item.name)}', '${esc(displayPrice)}')"><i class='bx bx-cart'></i> BUY</button></div>
          </div>`;
        });
      }
      if (data.buyButton) {
        const label = document.getElementById('buy-now-label');
        if (label) label.innerText = data.buyButton.text || 'BUY NOW';
      }
    }
  });
}

function filterMobile(cat) {
  currentMobileFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.filter-btn[data-filter="${cat}"]`).classList.add('active');
  renderMobilePackagesUI();
}

function renderMobilePackagesUI() {
  const listBox = document.getElementById('mp-package-list');
  if (!listBox) return;
  listBox.innerHTML = '';

  globalMobilePackages.forEach((item, idx) => {
    if (currentMobileFilter !== 'ALL' && item.category !== currentMobileFilter) return;

    const sellPrice = item.sellPrice || item.price || 0;
    const displayPrice = item.durationText ? `৳${sellPrice} / ${item.durationText}` : `৳${sellPrice}`;
    const icon = item.category === 'IOS' ? "<i class='bx bxl-apple'></i>" : "<i class='bx bxl-android'></i>";
    const subTitle = item.category === 'IOS' ? 'APPLE IOS' : 'ANDROID SYSTEM';

    listBox.innerHTML += `<div class="mp-package-item" data-idx="${idx}" onclick="selectPackage('mobile', ${idx}, '${esc(item.name)}', '${esc(displayPrice)}')">
      <div class="mp-pkg-left">
        <div class="mp-pkg-icon">${icon}</div>
        <div class="mp-pkg-text"><h3>${item.name}</h3><p>${subTitle} • ${item.desc||''}</p></div>
      </div>
      <div class="mp-pkg-right">
        <div class="mp-pkg-price">${displayPrice}</div>
        <button type="button" class="item-buy-btn" onclick="event.stopPropagation(); selectAndBuy('mobile', '${esc(item.name)}', '${esc(displayPrice)}')"><i class='bx bx-cart'></i> BUY</button>
      </div>
    </div>`;
  });
}

function esc(s){ return String(s||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'"); }
function selectPackage(type, idx, name, price) {
  if (type === 'buy') {
    selectedBuy = { name, price };
    document.querySelectorAll('.panel-list-item').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.panel-list-item[data-idx="${idx}"]`)?.classList.add('selected');
    document.getElementById('buy-selected-hint').innerText = `সিলেক্টেড: ${name} — ${price}`;
  } else {
    selectedMobile = { name, price };
    document.querySelectorAll('.mp-package-item').forEach(el => el.classList.remove('selected'));
    document.querySelector(`.mp-package-item[data-idx="${idx}"]`)?.classList.add('selected');
    document.getElementById('mp-selected-hint').innerText = `সিলেক্টেড: ${name} — ${price}`;
  }
}
function selectAndBuy(type, name, price) {
  if (type==='buy') selectedBuy = { name, price }; else selectedMobile = { name, price };
  buyNowClick(type);
}
function buyNowClick(type) {
  const selected = type === 'mobile' ? selectedMobile : selectedBuy;
  if (!selected) return alert(type === 'mobile' ? 'আগে একটি Mobile প্যাকেজ সিলেক্ট করুন!' : 'আগে একটি PC প্যাকেজ সিলেক্ট করুন!');
  const pageName = type === 'mobile' ? '📱 MOBILE PANEL' : '💻 BUY PANEL (PC)';
  const webhook = type === 'mobile' ? mobileWebhook : buyWebhook;
  const invite = type === 'mobile' ? (mobileDiscordLink || globalDiscordLink) : (buyDiscordLink || globalDiscordLink);
  sendBuyAlert(pageName, selected.name, selected.price, webhook);
  window.open(invite, '_blank');
}
function ticketClick(e) { if(mobileWebhook) sendBuyAlert('📱 MOBILE PANEL', 'TICKET button (no package)', '—', mobileWebhook); return true; }
function sendBuyAlert(pageName, packageName, packagePrice, webhookUrl) {
  if (!webhookUrl || !webhookUrl.startsWith('http')) return;
  fetch(webhookUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: `🔔 **NEW ORDER CLICK!**\n📄 **Section:** \`${pageName}\`\n📦 **Package:** \`${packageName}\`\n💰 **Price:** \`${packagePrice}\`\n⏰ **Time:** \`${new Date().toLocaleString()}\`\n👉 User going to Discord...` }) }).catch(()=>{});
}

function renderHomeCards(cards) {
  const container = document.getElementById('home-cards'); if (!container) return;
  let html = '', visibleCount = 0;
  cards.forEach(c => {
    if (c.visible === false) return; visibleCount++;
    const href = PAGE_MAP[c.key] || '#';
    const badge = c.featured ? '<span class="featured-badge">FEATURED</span>' : '';
    const icon = (c.icon && c.icon.startsWith('http')) ? `<img src="${c.icon}" style="width:28px;height:28px;object-fit:contain;">` : `<span class="emoji">${c.icon||'📦'}</span>`;
    html += `<a href="${href}" class="system-card ${c.featured?'featured':''}" style="text-decoration:none;display:block;">
      <div class="card-art">${badge}<div class="icon-frame">${icon}</div></div>
      <div class="card-info"><h2>${c.title||'PANEL'}</h2><p>${c.subtitle||''}</p><span class="explore">Explore <b>→</b></span></div>
    </a>`;
  });
  container.innerHTML = html;
  const countEl = document.getElementById('system-count'); if(countEl) countEl.innerText = String(visibleCount).padStart(2,'0') + ' SYSTEMS';
}

function applyPageData(p) {
  const vw = document.querySelector('.video-container'), v = document.getElementById('main-video'), sk = document.querySelector('.how-to-skip-btn'), pass = document.getElementById('panel-password'), dls = document.querySelector('.download-grid');
  if (vw) { if(p.showVideo===false) vw.style.display='none'; else { vw.style.display=''; if(v&&p.video) v.src=formatYT(p.video); } }
  if (sk) { if(p.showSkip===false) sk.style.display='none'; else { sk.style.display=''; if(p.skip) sk.href=p.skip; } }
  if (pass && p.pass) pass.innerText = p.pass;
  if (dls && p.downloads && Array.isArray(p.downloads)) {
    dls.innerHTML = '';
    p.downloads.forEach(dl => {
      dls.innerHTML += `<div class="download-box"><div class="dl-box-top"><div class="dl-icon-frame"><i class='bx bx-shield-alt-2'></i></div><span class="version-badge">${dl.badge||'LIVE'}</span></div>
      <h3 class="dl-title">${dl.title||'DOWNLOAD'}</h3><a href="${dl.url||'#'}" target="_blank" class="dl-btn"><i class='bx bx-download'></i> Download</a></div>`;
    });
  }
}
function formatYT(url){ if(!url) return ''; if(url.includes('embed/')) return url; if(url.includes('watch?v=')) return 'https://www.youtube.com/embed/'+url.split('watch?v=')[1].split('&')[0]; if(url.includes('youtu.be/')) return 'https://www.youtube.com/embed/'+url.split('youtu.be/')[1].split('?')[0]; return url; }
document.addEventListener('mousemove', e => { const g=document.querySelector('.mouse-glow'); if(g){ g.style.left=e.clientX+'px'; g.style.top=e.clientY+'px'; } });
