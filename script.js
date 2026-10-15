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

// Initialize Firebase safely
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = typeof firebase !== 'undefined' ? firebase.database() : null;

// Render Discord Bot URL
const BOT_URL = "https://bangla-ff-bot-server.onrender.com";

// 1. Mouse Glow Effect Listener
document.addEventListener('DOMContentLoaded', () => {
    const glow = document.querySelector('.mouse-glow');
    if (glow) {
        window.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    }
    
    // Load dynamic cards
    loadHomeCards();
});

// Default Cards (যাতে ফায়ারবেসে কিছু না থাকলেও সাইট ভাঙা না দেখায়)
const defaultSystemCards = [
    {
        title: "FREE PANEL",
        subtitle: "NEW PC PANEL UPDATED OB55",
        icon: "💻",
        badge: "FEATURED",
        link: "free.html",
        isVisible: true
    },
    {
        title: "EMULATOR",
        subtitle: "WORKING EMULATOR & BYPASS",
        icon: "💎",
        badge: "HOT",
        link: "emulator.html",
        isVisible: true
    },
    {
        title: "FREE FIRE APK",
        subtitle: "DOWNLOAD LATEST MOD APK",
        icon: "⚡",
        badge: "",
        link: "apk.html",
        isVisible: true
    },
    {
        title: "BUY PANEL",
        subtitle: "PREMIUM • FAST • RELIABLE",
        icon: "🔥",
        badge: "VIP",
        link: "buy.html",
        isVisible: true
    },
    {
        title: "MOBILE PANEL",
        subtitle: "ANDROID & IOS MOBILE SYSTEM",
        icon: "📱",
        badge: "",
        link: "mobile.html",
        isVisible: true
    }
];

// 2. Load Home Cards from Firebase or Fallback
function loadHomeCards() {
    const container = document.getElementById('home-cards');
    const countElement = document.getElementById('system-count');
    if (!container) return;

    if (!database) {
        renderCards(defaultSystemCards);
        return;
    }

    database.ref('home_cards').on('value', (snapshot) => {
        const data = snapshot.val();
        let cardsToRender = [];

        if (data && Object.keys(data).length > 0) {
            cardsToRender = Object.values(data);
        } else {
            cardsToRender = defaultSystemCards;
        }

        renderCards(cardsToRender);
    }, (error) => {
        console.warn("Firebase fetch error, loading default system cards:", error);
        renderCards(defaultSystemCards);
    });
}

// Render Card Items into HTML
function renderCards(cardsArray) {
    const container = document.getElementById('home-cards');
    const countElement = document.getElementById('system-count');
    if (!container) return;

    container.innerHTML = '';
    let visibleCount = 0;

    cardsArray.forEach((card) => {
        if (card.isVisible !== false) {
            visibleCount++;
            
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';

            // Icon HTML check (Image URL or Emoji/Icon)
            let iconHTML = `<span class="card-icon-text">${card.icon || '⚡'}</span>`;
            if (card.icon && (card.icon.startsWith('http://') || card.icon.startsWith('https://'))) {
                iconHTML = `<img src="${card.icon}" alt="${card.title} icon" class="card-icon-img">`;
            }

            // Badge HTML
            const badgeHTML = card.badge ? `<span class="badge">${card.badge}</span>` : '';

            cardDiv.innerHTML = `
                <div class="card-top">
                    <div class="icon-frame">
                        ${iconHTML}
                    </div>
                    ${badgeHTML}
                </div>
                <h3 class="card-title">${card.title || 'SYSTEM PANEL'}</h3>
                <p class="card-desc">${card.subtitle || 'ADVANCED SYSTEM'}</p>
                <a href="${card.link || '#'}" class="explore-btn">
                    Explore <span class="arrow">→</span>
                </a>
            `;

            container.appendChild(cardDiv);
        }
    });

    // Update auto count display (e.g. "05 SYSTEMS")
    if (countElement) {
        const formattedCount = String(visibleCount).padStart(2, '0');
        countElement.innerText = `${formattedCount} SYSTEMS`;
    }
}
