// --- 1. Mouse Glow Effect ---
const glow = document.getElementById('mouse-glow');

window.addEventListener('mousemove', (e) => {
  // Smoothly move the background glowing aura with the native mouse pointer
  glow.animate({
    left: e.clientX + 'px',
    top: e.clientY + 'px'
  }, { duration: 600, fill: "forwards" });
});


// --- 2. Notification Dropdown Logic ---
const notifBtn = document.getElementById('notif-btn');
const notifDropdown = document.getElementById('notif-dropdown');

// Toggle dropdown when clicking the bell button
notifBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Prevents the window click event from firing immediately
  notifDropdown.classList.toggle('show');
});

// Hide dropdown when clicking anywhere else on the screen
window.addEventListener('click', (e) => {
  if (!notifDropdown.contains(e.target)) {
    notifDropdown.classList.remove('show');
  }
});
