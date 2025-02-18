const quotes = [
  "Let the colors of Holi spread happiness, peace, and success in your life.",
  "May your life be as colorful as the shades of Holi.",
  "Wishing you a Holi filled with sweet moments and colorful memories.",
  "Let's celebrate the victory of colors, love, and joy.",
  "May this festival of colors paint your life with beautiful moments."
];

// Initialize GSAP
gsap.config({
  force3D: true
});

// Background 1: Mandala Pattern
function createMandala() {
  const container = document.querySelector('.mandala-container');
  for (let i = 0; i < 12; i++) {
      const circle = document.createElement('div');
      circle.className = 'mandala-circle';
      container.appendChild(circle);
      
      gsap.set(circle, {
          width: 200,
          height: 200,
          borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.3)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
      });

      gsap.to(circle, {
          rotation: 360,
          duration: 20,
          repeat: -1,
          ease: "none"
      });
  }
}

// Background 2: Rangoli Pattern
function createRangoli() {
  const container = document.querySelector('.rangoli-container');
  const colors = ['#FF69B4', '#FFA500', '#32CD32', '#4169E1', '#FFD700', '#9370DB'];
  
  for (let i = 0; i < 8; i++) {
      const petal = document.createElement('div');
      petal.className = 'rangoli-petal';
      container.appendChild(petal);

      gsap.set(petal, {
          width: 100,
          height: 100,
          backgroundColor: colors[i % colors.length],
          borderRadius: '50%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          filter: 'blur(20px)',
      });

      gsap.to(petal, {
          rotation: 360,
          duration: 10,
          repeat: -1,
          ease: "none",
          transformOrigin: "100px 0",
      });
  }
}

// Background 3: Particle System
function initParticleSystem() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#FF69B4', '#FFA500', '#32CD32', '#4169E1', '#FFD700', '#9370DB'];

  class Particle {
      constructor() {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 5 + 2;
          this.speedX = Math.random() * 3 - 1.5;
          this.speedY = Math.random() * 3 - 1.5;
          this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
          this.x += this.speedX;
          this.y += this.speedY;

          if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
          if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
      }
  }

  for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
  }

  function animate() {
      ctx.fillStyle = 'rgba(10, 77, 104, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
          particle.update();
          particle.draw();
      });

      requestAnimationFrame(animate);
  }

  animate();
}

// Background 4: Powder Effect
function createPowderEffect() {
  const container = document.querySelector('.powder-container');
  const colors = ['#FF69B4', '#FFA500', '#32CD32', '#4169E1', '#FFD700', '#9370DB'];

  function createPowder() {
      const powder = document.createElement('div');
      powder.className = 'powder';
      container.appendChild(powder);

      const x = Math.random() * window.innerWidth;
      const y = window.innerHeight + 100;
      const color = colors[Math.floor(Math.random() * colors.length)];

      gsap.set(powder, {
          width: Math.random() * 30 + 20,
          height: Math.random() * 30 + 20,
          backgroundColor: color,
          borderRadius: '50%',
          filter: 'blur(20px)',
          x: x,
          y: y,
          opacity: 0
      });

      gsap.to(powder, {
          y: -100,
          x: x + (Math.random() - 0.5) * 200,
          rotation: Math.random() * 360,
          opacity: 0.6,
          duration: Math.random() * 5 + 3,
          ease: "power1.out",
          onComplete: () => {
              powder.remove();
              createPowder();
          }
      });
  }

  for (let i = 0; i < 20; i++) {
      createPowder();
  }
}

// Background 5: Kaleidoscope Effect
function createKaleidoscope() {
  const container = document.querySelector('.kaleidoscope-container');
  const segments = 12;
  const colors = ['#FF69B4', '#FFA500', '#32CD32', '#4169E1', '#FFD700', '#9370DB'];

  for (let i = 0; i < segments; i++) {
      const segment = document.createElement('div');
      segment.className = 'kaleidoscope-segment';
      container.appendChild(segment);

      gsap.set(segment, {
          width: 200,
          height: 200,
          backgroundColor: colors[i % colors.length],
          position: 'absolute',
          top: '50%',
          left: '50%',
          clipPath: `polygon(0 0, 100% 0, 50% 100%)`,
          transform: `translate(-50%, -50%) rotate(${i * (360/segments)}deg)`,
          transformOrigin: '50% 0',
          opacity: 0.5
      });

      gsap.to(segment, {
          rotation: `+=${360}`,
          duration: 20,
          repeat: -1,
          ease: "none"
      });
  }
}

// Initialize all backgrounds
function initBackgrounds() {
  createMandala();
  createRangoli();
  initParticleSystem();
  createPowderEffect();
  createKaleidoscope();
}

// Background switching
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
      const bgNum = btn.dataset.bg;
      document.querySelectorAll('.background').forEach(bg => bg.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelector(`.bg${bgNum}`).classList.add('active');
      btn.classList.add('active');
      
      // Update quote
      const quote = quotes[parseInt(bgNum) - 1];
      gsap.to('.quote', {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
              document.querySelector('.quote').textContent = quote;
              gsap.to('.quote', {
                  opacity: 1,
                  duration: 0.5
              });
          }
      });
  });
});

// Initialize
window.addEventListener('load', () => {
  initBackgrounds();
  document.querySelector('.quote').textContent = quotes[0];
  
  // Initial animations
  gsap.from('.main-title', {
      y: -100,
      opacity: 0,
      duration: 1.5,
      ease: "bounce.out"
  });

  gsap.from('.quote', {
      y: 100,
      opacity: 0,
      duration: 1.5,
      delay: 0.5,
      ease: "back.out(1.7)"
  });

  gsap.from('.nav-btn', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "back.out(1.7)"
  });
});