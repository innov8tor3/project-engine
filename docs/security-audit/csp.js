const glow = document.getElementById('cursorGlow');

let targetX = window.innerWidth / 2;
let targetY = window.innerHeight / 2;
let currentX = targetX;
let currentY = targetY;

function animate() {
  currentX += (targetX - currentX) * 0.08;
  currentY += (targetY - currentY) * 0.08;
  glow.style.transform = `translate3d(${currentX - 170}px, ${currentY - 170}px, 0)`;
  requestAnimationFrame(animate);
}

window.addEventListener('pointermove', (event) => {
  targetX = event.clientX;
  targetY = event.clientY;
}, { passive: true });

window.addEventListener('pointerleave', () => {
  targetX = window.innerWidth / 2;
  targetY = window.innerHeight / 2;
});

animate();
