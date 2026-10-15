// =========================================
// BANGLA FF PANEL - MAIN SITE DYNAMIC SCRIPT
// =========================================

// Firebase Configuration (Same Project)
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

// Initialize Firebase if library exists
if (typeof firebase !== 'undefined') {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.database();

  // Listen for Realtime Updates from Admin Panel
  db.ref('panel_data').on('value', (snapshot) => {
    const data = snapshot.val() || {};

    // 1. Update Discord & TopUp Links Everywhere
    if (data.general) {
      if (data.general.discord) {
        document.querySelectorAll('a[href*="discord.gg"], .discord-btn, .support-btn, .buy-now-btn').forEach(a => {
          a.href = data.general.discord;
        });
      }
      if (data.general.topup) {
        document.querySelectorAll('.topup-btn').forEach(a => {
          a.href = data.general.topup;
        });
      }
    }

    // 2. Page Specific Updates
    const path = window.location.pathname;

    // Free Panel Page
    if (path.includes('free-panel') && data.freePanel) {
      applyPageData(data.freePanel);
    }
    // Free Bypass Page
    else if (path.includes('free-bypass') && data.freeBypass) {
      applyPageData(data.freeBypass);
    }
    // Emulator Page
    else if (path.includes('emulator') && data.emulator) {
      applyPageData(data.emulator);
    }
    // Free Fire APK Page
    else if (path.includes('free-fire-apk') && data.apk) {
      applyPageData(data.apk);
    }
    // Buy Panel List Page
    else if (path.includes('buy-panel') && data.buyList && Array.isArray(data.buyList)) {
      const buyContainer = document.querySelector('.panel-list');
      if (buyContainer) {
        buyContainer.innerHTML = '';
        data.buyList.forEach(item => {
          buyContainer.innerHTML += `
            <div class="panel-list-item">
              <div class="panel-info">
                <div class="panel-icon"><i class='bx bxs-crown'></i></div>
                <div class="panel-text">
                  <h3>${item.name || 'PANEL'}</h3>
                  <p>${item.desc || 'Premium Features'}</p>
                </div>
              </div>
              <div class="panel-price">${item.price || ''}</div>
            </div>
          `;
        });
      }
    }
  });
}

// Function to update Video, Password, Links
function applyPageData(pData) {
  const videoIframe = document.getElementById('main-video');
  const skipBtn = document.querySelector('.how-to-skip-btn');
  const passText = document.getElementById('panel-password');
  const dlBtns = document.querySelectorAll('.dl-btn');

  if (videoIframe && pData.video) videoIframe.src = formatYoutubeUrl(pData.video);
  if (skipBtn && pData.skip) skipBtn.href = pData.skip;
  if (passText && pData.pass) passText.innerText = pData.pass;
  if (dlBtns[0] && pData.dl1) dlBtns[0].href = pData.dl1;
  if (dlBtns[1] && pData.dl2) dlBtns[1].href = pData.dl2;
}

// Helper: Format YouTube URL to Embed format
function formatYoutubeUrl(url) {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  if (url.includes('watch?v=')) {
    const id = url.split('watch?v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
}

// Mouse Glow Tracking Effect (Universal)
document.addEventListener('mousemove', function (e) {
  const glow = document.querySelector('.mouse-glow');
  if (glow) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }
});
