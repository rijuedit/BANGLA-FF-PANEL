const glow = document.getElementById('mouse-glow');

window.addEventListener('mousemove', (e) => {
  // Smoothly move the background glowing aura with the native mouse pointer
  glow.animate({
    left: e.clientX + 'px',
    top: e.clientY + 'px'
  }, { duration: 600, fill: "forwards" });
});
