const colors = [
  { hex: '#FF69B4', rgb: '255, 105, 180' }, // Pink
  { hex: '#FFA500', rgb: '255, 165, 0' },   // Orange
  { hex: '#32CD32', rgb: '50, 205, 50' },   // Green
  { hex: '#4169E1', rgb: '65, 105, 225' },  // Blue
  { hex: '#FFD700', rgb: '255, 215, 0' },   // Yellow
  { hex: '#9370DB', rgb: '147, 112, 219' }  // Purple
];

let isTouch = false;

function createColorSplash(x, y) {
  const splash = document.createElement('div');
  splash.className = 'color-splash';
  document.querySelector('.color-container').appendChild(splash);

  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = Math.random() * 200 + 100;

  gsap.set(splash, {
      x: x - size/2,
      y: y - size/2,
      width: size,
      height: size,
      backgroundColor: color.hex,
      filter: 'blur(20px)',
      opacity: 0,
      scale: 0
  });

  gsap.to(splash, {
      duration: 2,
      scale: 2,
      opacity: 0.8,
      ease: "power2.out",
      onComplete: () => {
          gsap.to(splash, {
              duration: 1,
              opacity: 0,
              ease: "power2.in",
              onComplete: () => splash.remove()
          });
      }
  });

  createParticles(x, y, color);
}

function createParticles(x, y, color) {
  for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      document.querySelector('.particles-container').appendChild(particle);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 200 + 100;
      const size = Math.random() * 8 + 4;

      gsap.set(particle, {
          x: x,
          y: y,
          width: size,
          height: size,
          backgroundColor: color.hex,
          opacity: 1
      });

      gsap.to(particle, {
          duration: Math.random() * 1 + 1,
          x: x + Math.cos(angle) * velocity,
          y: y + Math.sin(angle) * velocity,
          opacity: 0,
          ease: "power2.out",
          onComplete: () => particle.remove()
      });
  }
}

function handleInteraction(event) {
  event.preventDefault();
  const x = event.type.includes('touch') ? event.touches[0].clientX : event.clientX;
  const y = event.type.includes('touch') ? event.touches[0].clientY : event.clientY;
  
  for (let i = 0; i < 3; i++) {
      setTimeout(() => {
          createColorSplash(
              x + (Math.random() - 0.5) * 100,
              y + (Math.random() - 0.5) * 100
          );
      }, i * 100);
  }
}

function createRandomSplash() {
  createColorSplash(
      Math.random() * window.innerWidth,
      Math.random() * window.innerHeight
  );
}

// Event Listeners
document.addEventListener('click', handleInteraction);
document.addEventListener('touchstart', (e) => {
  isTouch = true;
  handleInteraction(e);
});

// Initial animations
window.addEventListener('load', () => {
  // Create initial color splashes
  for (let i = 0; i < 5; i++) {
      setTimeout(createRandomSplash, i * 300);
  }

  // Animate title
  gsap.from('.holi-text h1', {
      duration: 1.5,
      y: -100,
      opacity: 0,
      ease: "bounce.out"
  });

  gsap.from('.holi-text p', {
      duration: 1.5,
      y: 100,
      opacity: 0,
      ease: "back.out(1.7)",
      delay: 0.5
  });

  // Create random splashes periodically
  setInterval(createRandomSplash, 3000);
});