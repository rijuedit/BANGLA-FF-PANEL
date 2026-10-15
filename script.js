const dot = document.getElementById('cursor-dot');
const aura = document.getElementById('cursor-aura');

window.addEventListener('mousemove', (e) => {
  // Move inner dot instantly
  dot.style.left = e.clientX + 'px';
  dot.style.top = e.clientY + 'px';
  
  // Move outer aura smoothly
  aura.animate({
    left: e.clientX + 'px',
    top: e.clientY + 'px'
  }, { duration: 400, fill: "forwards" });
});

// Cursor animation when hovering on links or cards
const clickables = document.querySelectorAll('a, .card');
clickables.forEach(item => {
  item.addEventListener('mouseenter', () => {
    aura.style.width = '60px';
    aura.style.height = '60px';
    aura.style.borderColor = 'rgba(255, 0, 102, 0.6)';
    aura.style.background = 'radial-gradient(circle, rgba(255, 0, 102, 0.2) 0%, transparent 70%)';
  });
  item.addEventListener('mouseleave', () => {
    aura.style.width = '40px';
    aura.style.height = '40px';
    aura.style.borderColor = 'rgba(157, 0, 255, 0.5)';
    aura.style.background = 'radial-gradient(circle, rgba(157, 0, 255, 0.2) 0%, transparent 70%)';
  });
});
