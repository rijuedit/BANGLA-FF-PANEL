// Firebase Configuration
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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// Smooth Mouse Glow Tracking
const mouseGlow = document.getElementById('mouse-glow');
if (mouseGlow) {
    document.addEventListener('mousemove', (e) => {
        mouseGlow.style.left = e.clientX + 'px';
        mouseGlow.style.top = e.clientY + 'px';
    });
}

// Default Systems List matching your screenshot
const defaultCategories = [
    {
        id: 'free',
        title: 'FREE PANEL',
        subtitle: 'NEW PC PANEL UPDATED OB55',
        icon: '💻',
        badge: 'FEATURED',
        link: 'free.html'
    },
    {
        id: 'emulator',
        title: 'EMULATOR',
        subtitle: 'WORKING EMULATOR',
        icon: '💎',
        link: 'emulator.html'
    },
    {
        id: 'apk',
        title: 'FREE FIRE APK',
        subtitle: 'DOWNLOAD LATEST APK',
        icon: '⚡',
        link: 'apk.html'
    },
    {
        id: 'buy',
        title: 'BUY PANEL',
        subtitle: 'PREMIUM • FAST • RELIABLE',
        icon: '🔥',
        link: 'buy.html'
    },
    {
        id: 'mobile',
        title: 'MOBILE PANEL',
        subtitle: 'ANDROID MOBILE SYSTEM',
        icon: '📱',
        link: 'mobile.html'
    }
];

// Load System Category Cards
function loadHomepageCards() {
    const grid = document.getElementById('card-grid');
    if (!grid) return;

    database.ref('home_categories').on('value', (snapshot) => {
        grid.innerHTML = '';
        const data = snapshot.val();
        
        // Use database cards or default screen cards
        const cardsToRender = data ? Object.values(data) : defaultCategories;
        
        document.getElementById('system-count').innerText = String(cardsToRender.length).padStart(2, '0');

        cardsToRender.forEach(card => {
            if (card.isVisible !== false) {
                const cardEl = document.createElement('div');
                cardEl.className = 'system-card';

                let iconHTML = `<span class="emoji-icon">${card.icon || '⚡'}</span>`;
                if (card.icon && card.icon.startsWith('http')) {
                    iconHTML = `<img src="${card.icon}" alt="icon">`;
                }

                let badgeHTML = card.badge ? `<div class="card-badge">${card.badge}</div>` : '';

                cardEl.innerHTML = `
                    ${badgeHTML}
                    <div class="icon-box">
                        ${iconHTML}
                    </div>
                    <h3 class="card-title">${card.title}</h3>
                    <p class="card-subtitle">${card.subtitle}</p>
                    <a href="${card.link || 'buy.html'}" class="explore-btn">
                        Explore &rarr;
                    </a>
                `;
                grid.appendChild(cardEl);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', loadHomepageCards);
