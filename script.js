// Stamps today's date into the footer title block, like a drawing revision date.
document.addEventListener('DOMContentLoaded', () => {
  const rev = document.getElementById('rev-date');
  if (rev) {
    const d = new Date();
    rev.textContent = d.toISOString().slice(0, 10);
  }
});
