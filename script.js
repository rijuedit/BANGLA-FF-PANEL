import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDOFL6dKvw_RfyKMe3QQgvE4lt7Gtc4yaM",
    authDomain: "bangla-ff-admin.firebaseapp.com",
    databaseURL: "https://bangla-ff-admin-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bangla-ff-admin",
    storageBucket: "bangla-ff-admin.firebasestorage.app",
    messagingSenderId: "295013484465",
    appId: "1:295013484465:web:b6bc2a949e239095761f90"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Mouse Glow
document.addEventListener('mousemove', (e) => {
    const glow = document.querySelector('.mouse-glow');
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

// Load General Settings (Diamond Link)
onValue(ref(db, 'general_settings'), (snapshot) => {
    const data = snapshot.val();
    if (data && data.discord_url) {
        document.getElementById('diamond-link').href = data.discord_url; // Use discord or any specific link
    }
});

// Load Home Cards
const cardData = [
    { id: 'freePanel', title: 'FREE PANEL', sub: 'NEW PC PANEL UPDATED OB55', icon: '💻', link: 'free-panel.html', badge: 'FEATURED' },
    { id: 'emulator', title: 'EMULATOR', sub: 'WORKING EMULATOR & BYPASS', icon: '💎', link: 'emulator.html', badge: 'HOT' },
    { id: 'freeFireApk', title: 'FREE FIRE APK', sub: 'DOWNLOAD LATEST MOD APK', icon: '⚡', link: 'apk.html', badge: '' },
    { id: 'buyPanel', title: 'BUY PANEL', sub: 'PREMIUM • FAST • RELIABLE', icon: '🔥', link: 'buy.html', badge: 'VIP' },
    { id: 'mobilePanel', title: 'MOBILE PANEL', sub: 'ANDROID & IOS MOBILE SYSTEM', icon: '📱', link: 'mobile.html', badge: '' }
];

const cardsGrid = document.getElementById('home-cards');
const systemCount = document.getElementById('system-count');
systemCount.innerText = "05"; // Total categories

cardData.forEach(card => {
    const cardHtml = `
        <div class="card">
            <div class="card-header">
                <div class="card-icon">${card.icon}</div>
                ${card.badge ? `<span class="badge ${card.badge.toLowerCase()}">${card.badge}</span>` : ''}
            </div>
            <h3>${card.title}</h3>
            <p>${card.sub}</p>
            <a href="${card.link}" class="explore-btn">Explore <span>→</span></a>
        </div>
    `;
    cardsGrid.innerHTML += cardHtml;
});
