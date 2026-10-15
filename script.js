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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Render Discord Bot Backend URL
const BOT_URL = "https://bangla-ff-bot-server.onrender.com";

// Mouse Glow Tracking
const mouseGlow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', (e) => {
    mouseGlow.style.left = e.clientX + 'px';
    mouseGlow.style.top = e.clientY + 'px';
});

// Load Panels Dynamically from Firebase
function loadPanels() {
    const container = document.getElementById('card-container');
    
    database.ref('panels').on('value', (snapshot) => {
        container.innerHTML = '';
        const data = snapshot.val();
        
        if (data) {
            let visiblePanelCount = 0;
            Object.keys(data).forEach(key => {
                const panel = data[key];
                
                // Show card if set visible by Admin
                if (panel.isVisible !== false) {
                    visiblePanelCount++;
                    const card = document.createElement('div');
                    card.className = 'panel-card';
                    
                    // Card Icon Check (Image URL or Emoji)
                    let iconHTML = '';
                    if (panel.icon && (panel.icon.startsWith('http://') || panel.icon.startsWith('https://'))) {
                        iconHTML = `<img src="${panel.icon}" alt="icon" class="card-img-icon">`;
                    } else {
                        iconHTML = `<span class="emoji-icon">${panel.icon || '⚡'}</span>`;
                    }

                    card.innerHTML = `
                        <div class="card-header">
                            <div class="icon-frame">
                                ${iconHTML}
                            </div>
                            <span class="version-badge">${panel.version || 'v2.0'}</span>
                        </div>
                        <h3 class="card-title">${panel.title || 'VIP Panel'}</h3>
                        <p class="card-subtitle">${panel.subtitle || 'High Performance Cheat'}</p>
                        <div class="card-price-tag">
                            <span class="price-label">Price:</span>
                            <span class="price-amount">${panel.sellPrice || '0'} ৳</span>
                        </div>
                        <button onclick="handleBuyClick('${panel.title || 'VIP Panel'}', '${panel.sellPrice || '0'} ৳')" class="buy-btn">
                            <i class="fa-solid fa-cart-shopping"></i> Buy Now
                        </button>
                    `;
                    container.appendChild(card);
                }
            });

            if (visiblePanelCount === 0) {
                container.innerHTML = '<div class="no-data"><i class="fa-solid fa-triangle-exclamation"></i><p>বর্তমানে কোনো প্যানেল এভেলেবল নেই</p></div>';
            }
        } else {
            container.innerHTML = '<div class="no-data"><i class="fa-solid fa-triangle-exclamation"></i><p>কোনো প্যানেল পাওয়া যায়নি</p></div>';
        }
    });
}

// Handle Buy Button Click (Name Input Popup & Discord Ticket)
async function handleBuyClick(panelName, price) {
    const { value: userName } = await Swal.fire({
        title: 'অর্ডার নিশ্চিত করুন',
        text: 'ডিসকর্ড টিকিট তৈরির জন্য আপনার নাম দিন:',
        input: 'text',
        inputPlaceholder: 'আপনার নাম লিখুন (যেমন: Riju)',
        showCancelButton: true,
        confirmButtonText: '<i class="fa-solid fa-ticket"></i> টিকিট খুলুন',
        cancelButtonText: 'বাতিল',
        confirmButtonColor: '#8a2be2',
        cancelButtonColor: '#333',
        background: '#0d0714',
        color: '#ffffff',
        inputValidator: (value) => {
            if (!value) {
                return 'দয়া করে টিকিট খুলতে আপনার নাম লিখুন!';
            }
        }
    });

    if (userName) {
        // Show Loading Modal
        Swal.fire({
            title: 'অপেক্ষা করুন...',
            text: 'আপনার টিকিট ডিসকর্ড সার্ভারে তৈরি করা হচ্ছে।',
            allowOutsideClick: false,
            background: '#0d0714',
            color: '#ffffff',
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Send Request to Render Bot Server
            const response = await fetch(`${BOT_URL}/create-ticket`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: userName,
                    panelName: panelName,
                    price: price
                })
            });

            const result = await response.json();

            if (result.success) {
                // Success Modal with direct Discord link
                Swal.fire({
                    icon: 'success',
                    title: 'টিকিট সফলভাবে খোলা হয়েছে!',
                    text: 'আপনার প্রাইভেট টিকিট চ্যানেলে যেতে নিচের বাটনে ক্লিক করুন।',
                    confirmButtonText: '<i class="fa-brands fa-discord"></i> ডিসকর্ডে যান',
                    confirmButtonColor: '#5865F2',
                    background: '#0d0714',
                    color: '#ffffff'
                }).then(() => {
                    window.open(result.url, '_blank');
                });
            } else {
                throw new Error(result.error || 'Server error');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'দুঃখিত!',
                text: 'টিকিট তৈরি করা যায়নি। আবার চেষ্টা করুন বা বটের স্ট্যাটাস চেক করুন।',
                confirmButtonColor: '#ff4757',
                background: '#0d0714',
                color: '#ffffff'
            });
        }
    }
}

// Start Application
document.addEventListener('DOMContentLoaded', loadPanels);
