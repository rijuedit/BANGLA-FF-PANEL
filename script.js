// Feature chips and system cards are intentionally non-clickable.
// Only the Home navigation and Discord support links are interactive.
document.querySelectorAll('.system-card, .benefit').forEach((item) => {
  item.setAttribute('tabindex', '-1');
  item.setAttribute('aria-disabled', 'true');
});

// --- Mouse Glow Tracking Effect ---
document.addEventListener('mousemove', function(e) {
    const glow = document.querySelector('.mouse-glow');
    if(glow) {
        // মাউস যেখানে যাবে, গ্লো ইফেক্ট ঠিক সেখানে চলে যাবে
        glow.style.setProperty('--mouse-x', `${e.clientX}px`);
        glow.style.setProperty('--mouse-y', `${e.clientY}px`);
    }
});
