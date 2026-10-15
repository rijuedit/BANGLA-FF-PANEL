// =========================================
// BANGLA FF PANEL - SCRIPT
// =========================================

// Mouse Tracking Glow Effect (Bulletproof & Smooth)
document.addEventListener('mousemove', function (e) {
  const glow = document.querySelector('.mouse-glow');
  if (glow) {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }
});
