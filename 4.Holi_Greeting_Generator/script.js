// Initialize canvas
const canvas = new fabric.Canvas('canvas', {
  width: 600,
  height: 400,
  backgroundColor: '#ffffff'
});

// Drawing mode state
let isDrawingMode = false;

// Initialize with default settings
function init() {
  // Set canvas size based on container
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Set default brush settings
  canvas.freeDrawingBrush.width = 5;
  canvas.freeDrawingBrush.color = '#ff0000';
}

// Resize canvas based on container
function resizeCanvas() {
  const container = document.querySelector('.canvas-container');
  const containerWidth = container.clientWidth - 32; // Subtract padding
  const ratio = canvas.height / canvas.width;
  
  canvas.setWidth(containerWidth);
  canvas.setHeight(containerWidth * ratio);
  canvas.renderAll();
}

// Template loading
function loadTemplate(templateId) {
  // Clear canvas
  canvas.clear();
  
  // Set background color based on template
  const backgrounds = {
      template1: '#FFE4E1',
      template2: '#E6E6FA'
  };
  
  canvas.setBackgroundColor(backgrounds[templateId], canvas.renderAll.bind(canvas));
  
  // Add template-specific elements
  if (templateId === 'template1') {
      addText('Happy Holi!', {
          left: 200,
          top: 150,
          fontSize: 40,
          fill: '#FF3366'
      });
  } else if (templateId === 'template2') {
      addText('Let\'s celebrate colors!', {
          left: 150,
          top: 200,
          fontSize: 35,
          fill: '#6C63FF'
      });
  }
}

// Add text to canvas
function addText(text = null) {
  const inputText = text || document.getElementById('textInput').value;
  if (!inputText) return;
  
  const textColor = document.getElementById('textColor').value;
  const fontSize = document.getElementById('fontSize').value;
  
  const fabricText = new fabric.Text(inputText, {
      left: 100,
      top: 100,
      fontSize: parseInt(fontSize),
      fill: textColor,
      fontFamily: 'Arial'
  });
  
  canvas.add(fabricText);
  canvas.setActiveObject(fabricText);
  canvas.renderAll();
  
  // Clear input
  document.getElementById('textInput').value = '';
}

// Toggle drawing mode
function toggleDrawing() {
  isDrawingMode = !isDrawingMode;
  canvas.isDrawingMode = isDrawingMode;
  canvas.freeDrawingBrush.color = document.getElementById('brushColor').value;
}

// Add sticker to canvas
function addSticker(stickerType) {
  const stickerUrls = {
      splash: '/api/placeholder/100/100',
      pichkari: '/api/placeholder/100/100',
      balloon: '/api/placeholder/100/100'
  };
  
  fabric.Image.fromURL(stickerUrls[stickerType], function(img) {
      img.scale(0.5);
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
  });
}

// Upload image
function uploadImage() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  
  input.onchange = function(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = function(f) {
          const data = f.target.result;
          fabric.Image.fromURL(data, function(img) {
              img.scaleToWidth(200);
              canvas.add(img);
              canvas.renderAll();
          });
      };
      
      reader.readAsDataURL(file);
  };
  
  input.click();
}

// Download greeting
function downloadGreeting() {
  const link = document.createElement('a');
  link.download = 'holi-greeting.png';
  link.href = canvas.toDataURL({
      format: 'png',
      quality: 0.8
  });
  link.click();
}

// Share greeting
function shareGreeting() {
  if (navigator.share) {
      canvas.toDataURL({
          format: 'png',
          quality: 0.8
      }).then(dataUrl => {
          navigator.share({
              title: 'Holi Greeting',
              text: 'Check out my Holi greeting!',
              url: dataUrl
          });
      });
  } else {
      alert('Sharing is not supported on this browser. You can download the image and share it manually.');
  }
}

// Color picker event listeners
document.getElementById('brushColor').addEventListener('change', function(e) {
  canvas.freeDrawingBrush.color = e.target.value;
});

// Initialize the app
init();