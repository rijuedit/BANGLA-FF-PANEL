// =========================================
// BANGLA FF PANEL - SCRIPT
// =========================================

// Benefit chips are non-clickable (visual only)
document.querySelectorAll('.benefit').forEach((item) => {
  item.setAttribute('tabindex', '-1');
  item.setAttribute('aria-disabled', 'true');
});

// =========================================
// MOUSE GLOW TRACKING EFFECT
// =========================================
document.addEventListener('mousemove', function (e) {
  const glow = document.querySelector('.mouse-glow');
  if (glow) {
    glow.style.setProperty('--mouse-x', e.clientX + 'px');
    glow.style.setProperty('--mouse-y', e.clientY + 'px');
  }
});
