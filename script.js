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

if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  db.ref('panel_data').on('value', (snapshot) => {
    const data = snapshot.val() || {};

    // Discord + TopUp
    if (data.general) {
      if (data.general.discord) {
        document.querySelectorAll('a[href*="discord"], .discord-btn, .support-btn, .buy-now-btn').forEach(a => a.href = data.general.discord);
      }
      if (data.general.topup) {
        document.querySelectorAll('.topup-btn').forEach(a => a.href = data.general.topup);
      }
    }

    const path = window.location.pathname;

    if (path.includes('free-panel') && data.freePanel) applyPageData(data.freePanel);
    else if (path.includes('free-bypass') && data.freeBypass) applyPageData(data.freeBypass);
    else if (path.includes('emulator') && data.emulator) applyPageData(data.emulator);
    else if (path.includes('free-fire-apk') && data.apk) applyPageData(data.apk);
    else if (path.includes('buy-panel') && data.buyList) {
      const box = document.querySelector('.panel-list');
      if (box && Array.isArray(data.buyList)) {
        box.innerHTML = '';
        data.buyList.forEach(item => {
          box.innerHTML += `
            <div class="panel-list-item">
              <div class="panel-info">
                <div class="panel-icon"><i class='bx bxs-crown'></i></div>
                <div class="panel-text">
                  <h3>${item.name || 'PANEL'}</h3>
                  <p>${item.desc || ''}</p>
                </div>
              </div>
              <div class="panel-price">${item.price || ''}</div>
            </div>`;
        });
      }
    }
  });
}

function applyPageData(p) {
  const video = document.getElementById('main-video');
  const skip = document.querySelector('.how-to-skip-btn');
  const pass = document.getElementById('panel-password');
  const dls = document.querySelectorAll('.dl-btn');

  if (video && p.video) video.src = formatYT(p.video);
  if (skip && p.skip) skip.href = p.skip;
  if (pass && p.pass) pass.innerText = p.pass;
  if (dls[0] && p.dl1) dls[0].href = p.dl1;
  if (dls[1] && p.dl2) dls[1].href = p.dl2;
}

function formatYT(url) {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  if (url.includes('watch?v=')) return 'https://www.youtube.com/embed/' + url.split('watch?v=')[1].split('&')[0];
  if (url.includes('youtu.be/')) return 'https://www.youtube.com/embed/' + url.split('youtu.be/')[1].split('?')[0];
  return url;
}

// Mouse Glow
document.addEventListener('mousemove', function(e) {
  const glow = document.querySelector('.mouse-glow');
  if (glow) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }
});

// Copy Password (if exists)
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
