function startCountdown() {
  // Holi 2025 date: March 13, 2025
  const countdownDate = new Date("March 13, 2025 00:00:00").getTime();
  
  function updateCountdown() {
      const now = new Date().getTime();
      const distance = countdownDate - now;
      
      if (distance <= 0) {
          clearInterval(interval);
          document.getElementById('days').textContent = '00';
          document.getElementById('hours').textContent = '00';
          document.getElementById('minutes').textContent = '00';
          document.getElementById('seconds').textContent = '00';
          
          // Show celebration message
          const title = document.querySelector('.title');
          title.textContent = 'Happy Holi!';
          title.style.fontSize = '4rem';
          title.style.animation = 'pulse 2s infinite';
          document.body.style.setProperty('--celebration', '1');
          return;
      }
      
      // Calculate time units
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Update the text content
      document.getElementById('days').textContent = days < 10 ? `0${days}` : days;
      document.getElementById('hours').textContent = hours < 10 ? `0${hours}` : hours;
      document.getElementById('minutes').textContent = minutes <10 ? `0${minutes}` : minutes;
      document.getElementById('seconds').textContent = seconds < 10 ? `0${seconds}` : seconds;
  }
  
  // Initial update
  updateCountdown();
  
  // Update every second
  const interval = setInterval(updateCountdown, 1000);
  
  // Add random color pulses
  setInterval(() => {
      const items = document.querySelectorAll('.circle-outer');
      const randomItem = items[Math.floor(Math.random() * items.length)];
      randomItem.style.boxShadow = '0 0 50px rgba(255, 255, 255, 0.8)';
      
      setTimeout(() => {
          randomItem.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.2)';
      }, 500);
  }, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  startCountdown();
  
  // Add keyframe animation for title pulse
  const style = document.createElement('style');
  style.textContent = `
      @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
      }
  `;
  document.head.appendChild(style);
});