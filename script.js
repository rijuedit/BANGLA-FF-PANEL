// Feature chips and system cards are intentionally non-clickable.
// Only the Home navigation and Discord support links are interactive.
document.querySelectorAll('.system-card, .benefit').forEach((item) => {
  item.setAttribute('tabindex', '-1');
  item.setAttribute('aria-disabled', 'true');
});
