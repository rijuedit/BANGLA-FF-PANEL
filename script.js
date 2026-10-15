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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const BOT_URL = "https://bangla-ff-bot-server.onrender.com";

// Mouse Glow Tracking
const mouseGlow = document.getElementById('mouse-glow');
document.addEventListener('mousemove', (e) => {
    mouseGlow.style.left = e.clientX + 'px';
    mouseGlow.style.top = e.clientY + 'px';
});

// Load Panels Dynamically
function loadPanels() {
    const container = document.getElementById('list-container');
    
    database.ref('panels').on('value', (snapshot) => {
        container.innerHTML = '';
        const data = snapshot.val();
        
        if (data) {
            let visibleCount = 0;
            Object.keys(data).forEach(key => {
                const panel = data[key];
                
                if (panel.isVisible !== false) {
                    visibleCount++;
                    const row = document.createElement('div');
                    row.className = 'panel-row';
                    
                    // Icon/Logo System
                    let iconHTML = '<i class="fa-solid fa-crown"></i>'; // Default Crown
                    if (panel.icon) {
                        if (panel.icon.startsWith('http')) {
                            iconHTML = `<img src="${panel.icon}" alt="logo">`;
                        } else {
                            iconHTML = panel.icon; // Emoji
                        }
                    }

                    // Price Options System (Dropdown)
                    let optionsHTML = '';
                    if (panel.priceList && panel.priceList.length > 0) {
                        // If multiple prices exist from admin
                        panel.priceList.forEach(p => {
                            optionsHTML += `<option value="${p.price}" data-duration="${p.duration}">৳${p.price} / ${p.duration}</option>`;
                        });
                    } else {
                        // Fallback for old panels
                        optionsHTML = `<option value="${panel.sellPrice || 0}" data-duration="Lifetime">৳${panel.sellPrice || 0} / Lifetime</option>`;
                    }

                    row.innerHTML = `
                        <div class="row-left">
                            <div class="icon-box">${iconHTML}</div>
                            <div class="panel-title">${panel.title || 'BR MODS'}</div>
                        </div>
                        <div class="row-right">
                            <select id="select-${key}" class="duration-select">
                                ${optionsHTML}
                            </select>
                            <button onclick="handleBuyClick('${panel.title}', 'select-${key}')" class="buy-btn">
                                <i class="fa-solid fa-cart-shopping"></i> BUY
                            </button>
                        </div>
                    `;
                    container.appendChild(row);
                }
            });

            if (visibleCount === 0) {
                container.innerHTML = '<div class="loading-spinner"><p>বর্তমানে কোনো প্যানেল নেই</p></div>';
            }
        } else {
            container.innerHTML = '<div class="loading-spinner"><p>কোনো প্যানেল পাওয়া যায়নি</p></div>';
        }
    });
}

// Handle Buy Click
async function handleBuyClick(basePanelName, selectId) {
    const selectEl = document.getElementById(selectId);
    const selectedPrice = selectEl.value;
    const selectedDuration = selectEl.options[selectEl.selectedIndex].getAttribute('data-duration');
    
    // Create final name like "BR MODS GLOBAL [ 30 Days ]"
    const finalPanelName = `${basePanelName} [ ${selectedDuration} ]`;

    const { value: userName } = await Swal.fire({
        title: 'অর্ডার নিশ্চিত করুন',
        text: 'আপনার নাম দিন:',
        input: 'text',
        inputPlaceholder: 'আপনার নাম লিখুন...',
        showCancelButton: true,
        confirmButtonText: 'টিকিট খুলুন',
        cancelButtonText: 'বাতিল',
        background: '#0d1117',
        color: '#ffffff',
        confirmButtonColor: '#00f0ff',
        inputValidator: (value) => {
            if (!value) return 'নাম লেখা আবশ্যক!';
        }
    });

    if (userName) {
        Swal.fire({
            title: 'অপেক্ষা করুন...',
            text: 'ডিসকর্ডে টিকিট তৈরি হচ্ছে।',
            allowOutsideClick: false,
            background: '#0d1117',
            color: '#ffffff',
            didOpen: () => Swal.showLoading()
        });

        try {
            const response = await fetch(`${BOT_URL}/create-ticket`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userName: userName,
                    panelName: finalPanelName,
                    price: `${selectedPrice} ৳`
                })
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'টিকিট তৈরি হয়েছে!',
                    text: 'নিচের বাটনে ক্লিক করে টিকিটে যান।',
                    confirmButtonText: 'ডিসকর্ডে যান',
                    confirmButtonColor: '#00f0ff',
                    background: '#0d1117',
                    color: '#ffffff'
                }).then(() => {
                    window.open(result.url, '_blank');
                });
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'ভুল হয়েছে',
                text: 'টিকিট খোলা যায়নি।',
                background: '#0d1117',
                color: '#ffffff'
            });
        }
    }
}

// Start
document.addEventListener('DOMContentLoaded', loadPanels);
