document.addEventListener('DOMContentLoaded', function() {
  // Initialize FabricJS canvas
  const canvas = new fabric.Canvas('canvas', {
      width: 800,
      height: 600,
      backgroundColor: '#f9f9f9'
  });
  
  let originalImage = null;
  let undoStack = [];
  let redoStack = [];
  
  // Setup countdown background
  setupCountdownBackground();
  
  // Setup upload area
  const uploadArea = document.getElementById('upload-area');
  const imageUpload = document.getElementById('imageUpload');
  const editorWorkspace = document.getElementById('editor-workspace');
  const actionButtons = document.getElementById('action-buttons');
  
  uploadArea.addEventListener('click', () => {
      imageUpload.click();
  });
  
  uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('drag-over');
  });
  
  uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('drag-over');
  });
  
  uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('drag-over');
      
      if (e.dataTransfer.files.length) {
          imageUpload.files = e.dataTransfer.files;
          handleImageUpload(e.dataTransfer.files[0]);
      }
  });
  
  imageUpload.addEventListener('change', (e) => {
      if (e.target.files.length) {
          handleImageUpload(e.target.files[0]);
      }
  });
  
  function handleImageUpload(file) {
      if (!file.type.match('image.*')) {
          alert('Please select an image file');
          return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
          fabric.Image.fromURL(e.target.result, (img) => {
              // Scale image to fit canvas
              canvas.clear();
              const scale = Math.min(
                  (canvas.width - 50) / img.width,
                  (canvas.height - 50) / img.height
              );
              
              img.scale(scale);
              img.set({
                  left: canvas.width / 2,
                  top: canvas.height / 2,
                  originX: 'center',
                  originY: 'center'
              });
              
              originalImage = img;
              canvas.add(img);
              canvas.renderAll();
              
              // Show editor workspace and hide upload area
              uploadArea.style.display = 'none';
              editorWorkspace.style.display = 'flex';
              actionButtons.style.display = 'flex';
              
              // Save initial state
              saveState();
          });
      };
      
      reader.readAsDataURL(file);
  }
  
  // Setup tools
  const brushTool = document.getElementById('brush-tool');
  const eraserTool = document.getElementById('eraser-tool');
  const undoBtn = document.getElementById('undo-btn');
  const redoBtn = document.getElementById('redo-btn');
  const brushColor = document.getElementById('brush-color');
  const brushSize = document.getElementById('brush-size');
  
  // Holi effect buttons
  const colorSplashBtn = document.getElementById('color-splash');
  const waterSplashBtn = document.getElementById('water-splash');
  const colorBurstBtn = document.getElementById('color-burst');
  
  // Action buttons
  const downloadBtn = document.getElementById('download-btn');
  const shareBtn = document.getElementById('share-btn');
  const resetBtn = document.getElementById('reset-btn');
  
  // Setup brush
  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  canvas.freeDrawingBrush.color = brushColor.value;
  canvas.freeDrawingBrush.width = parseInt(brushSize.value, 10);
  
  brushTool.addEventListener('click', () => {
      deactivateAllTools();
      brushTool.classList.add('active');
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = brushColor.value;
      canvas.freeDrawingBrush.width = parseInt(brushSize.value, 10);
  });
  
  eraserTool.addEventListener('click', () => {
      deactivateAllTools();
      eraserTool.classList.add('active');
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = '#ffffff';
      canvas.freeDrawingBrush.width = parseInt(brushSize.value, 10);
  });
  
  brushColor.addEventListener('change', () => {
      if (!eraserTool.classList.contains('active')) {
          canvas.freeDrawingBrush.color = brushColor.value;
      }
  });
  
  brushSize.addEventListener('change', () => {
      canvas.freeDrawingBrush.width = parseInt(brushSize.value, 10);
  });
  
  function deactivateAllTools() {
      brushTool.classList.remove('active');
      eraserTool.classList.remove('active');
      canvas.isDrawingMode = false;
  }
  
  // Undo/Redo functionality
  undoBtn.addEventListener('click', undo);
  redoBtn.addEventListener('click', redo);
  
  canvas.on('object:added', saveState);
  canvas.on('object:modified', saveState);
  canvas.on('object:removed', saveState);
  
  function saveState() {
      // Keep only the last 20 states to avoid memory issues
      if (undoStack.length >= 20) {
          undoStack.shift();
      }
      
      // Save current state
      undoStack.push(JSON.stringify(canvas));
      
      // Clear redo stack
      redoStack = [];
      updateUndoRedoButtons();
  }
  
  function undo() {
      if (undoStack.length > 1) {
          // Save current state to redo stack
          redoStack.push(undoStack.pop());
          
          // Load previous state
          const state = undoStack[undoStack.length - 1];
          canvas.loadFromJSON(state, canvas.renderAll.bind(canvas));
          
          updateUndoRedoButtons();
      }
  }
  
  function redo() {
      if (redoStack.length > 0) {
          // Get last redo state
          const state = redoStack.pop();
          
          // Add to undo stack
          undoStack.push(state);
          
          // Load state
          canvas.loadFromJSON(state, canvas.renderAll.bind(canvas));
          
          updateUndoRedoButtons();
      }
  }
  
  function updateUndoRedoButtons() {
      undoBtn.disabled = undoStack.length <= 1;
      redoBtn.disabled = redoStack.length === 0;
  }
  
  // Holi Effect buttons
  colorSplashBtn.addEventListener('click', () => {
      applyColorSplashEffect();
  });
  
  waterSplashBtn.addEventListener('click', () => {
      applyWaterSplashEffect();
  });
  
  colorBurstBtn.addEventListener('click', () => {
      applyColorBurstEffect();
  });
  
  // Stickers panel
  const stickersGrid = document.getElementById('stickers-grid');
  loadHoliStickers();
  
  function loadHoliStickers() {
      const stickersList = [
          { name: 'Happy Holi', src: 'stickers/happy-holi.png' },
          { name: 'Color Splash', src: 'stickers/color-splash.png' },
          { name: 'Pichkari', src: 'stickers/pichkari.png' },
          { name: 'Gulal', src: 'stickers/gulal.png' },
          { name: 'Water Balloon', src: 'stickers/balloon.png' },
          { name: 'Color Powder', src: 'stickers/powder.png' },
          { name: 'Holi Text', src: 'stickers/holi-text.png' },
          { name: 'Colorful Hands', src: 'stickers/colorful-hands.png' }
      ];
      
      // For demo purposes, we'll create placeholder stickers
      for (let i = 0; i < 8; i++) {
          const stickerItem = document.createElement('div');
          stickerItem.className = 'sticker-item';
          stickerItem.setAttribute('data-sticker-id', i);
          
          // Create a colorful placeholder for demo
          const colors = ['#ff4081', '#536dfe', '#ffeb3b', '#4caf50', '#f44336', '#9c27b0', '#00bcd4', '#ff9800'];
          stickerItem.style.backgroundColor = colors[i % colors.length];
          
          stickerItem.addEventListener('click', () => {
              addStickerToCanvas(i);
          });
          
          stickersGrid.appendChild(stickerItem);
      }
  }
  
  function addStickerToCanvas(stickerId) {
      // In a real app, you would load real sticker images
      // For this demo, we'll create colorful shapes
      
      const shapes = [
          () => new fabric.Circle({ radius: 50, fill: randomHoliColor() }),
          () => new fabric.Rect({ width: 100, height: 100, fill: randomHoliColor() }),
          () => new fabric.Triangle({ width: 100, height: 100, fill: randomHoliColor() }),
          () => {
              const text = new fabric.Text('Happy Holi!', {
                  fontFamily: 'Arial',
                  fontSize: 30,
                  fill: randomHoliColor()
              });
              return text;
          },
          () => {
              const polygon = new fabric.Polygon([
                  { x: 0, y: 0 },
                  { x: 50, y: 50 },
                  { x: 100, y: 0 },
                  { x: 75, y: 75 },
                  { x: 100, y: 100 },
                  { x: 50, y: 75 },
                  { x: 0, y: 100 },
                  { x: 25, y: 75 }
              ], {
                  fill: randomHoliColor()
              });
              return polygon;
          },
          () => {
              // Create a simple star shape
              const points = [];
              for (let i = 0; i < 10; i++) {
                  const radius = i % 2 === 0 ? 50 : 25;
                  const angle = (i * Math.PI) / 5;
                  points.push({
                      x: radius * Math.cos(angle),
                      y: radius * Math.sin(angle)
                  });
              }
              return new fabric.Polygon(points, {
                  fill: randomHoliColor(),
                  left: 0,
                  top: 0
              });
          },
          () => {
              // Create a colorful hand shape
              const path = "M 10,10 C 20,20 30,10 40,20 C 50,30 60,20 70,30 C 80,40 90,30 100,40";
              return new fabric.Path(path, {
                  fill: '',
                  stroke: randomHoliColor(),
                  strokeWidth: 10
              });
          },
          () => {
              // Create water balloon shape
              const ellipse = new fabric.Ellipse({
                  rx: 40,
                  ry: 60,
                  fill: randomHoliColor(),
                  opacity: 0.7
              });
              return ellipse;
          }
      ];
      
      // Create the sticker shape
      const shapeFunc = shapes[stickerId % shapes.length];
      const stickerObj = shapeFunc();
      
      // Set sticker position and properties
      stickerObj.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center',
          borderColor: '#2196F3',
          cornerColor: '#2196F3',
          cornerSize: 10,
          transparentCorners: false
      });
      
      canvas.add(stickerObj);
      canvas.setActiveObject(stickerObj);
      saveState();
  }
  
  function randomHoliColor() {
      const holiColors = [
          '#ff4081', // Pink
          '#536dfe', // Indigo
          '#ffeb3b', // Yellow
          '#4caf50', // Green
          '#f44336', // Red
          '#9c27b0', // Purple
          '#00bcd4', // Cyan
          '#ff9800'  // Orange
      ];
      return holiColors[Math.floor(Math.random() * holiColors.length)];
  }
  
  // Effect functions
  function applyColorSplashEffect() {
      if (!originalImage) return;
      
      // Create 10 random colored circles around the image
      for (let i = 0; i < 10; i++) {
          const radius = 20 + Math.random() * 40;
          const circle = new fabric.Circle({
              radius: radius,
              fill: randomHoliColor(),
              opacity: 0.7,
              left: Math.random() * canvas.width,
              top: Math.random() * canvas.height,
              originX: 'center',
              originY: 'center'
          });
          canvas.add(circle);
          canvas.sendToBack(circle);
      }
      
      canvas.renderAll();
      saveState();
  }
  
  function applyWaterSplashEffect() {
      if (!originalImage) return;
      
      // Create water-like splash effect
      for (let i = 0; i < 5; i++) {
          const points = [];
          const centerX = Math.random() * canvas.width;
          const centerY = Math.random() * canvas.height;
          const size = 30 + Math.random() * 50;
          
          // Create random splash shape
          for (let j = 0; j < 8; j++) {
              const angle = (j * Math.PI) / 4;
              const radius = size * (0.7 + Math.random() * 0.3);
              points.push({
                  x: centerX + radius * Math.cos(angle),
                  y: centerY + radius * Math.sin(angle)
              });
          }
          
          const splash = new fabric.Polygon(points, {
              fill: randomHoliColor(),
              opacity: 0.5,
              selectable: false
          });
          
          canvas.add(splash);
          canvas.sendToBack(splash);
      }
      
      canvas.renderAll();
      saveState();
  }
  
  function applyColorBurstEffect() {
      if (!originalImage) return;
      
      // Create a burst of colors from the center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      for (let i = 0; i < 12; i++) {
          const angle = (i * Math.PI) / 6;
          const length = 100 + Math.random() * 150;
          
          const line = new fabric.Line([
              centerX,
              centerY,
              centerX + length * Math.cos(angle),
              centerY + length * Math.sin(angle)
          ], {
              stroke: randomHoliColor(),
              strokeWidth: 10 + Math.random() * 20,
              opacity: 0.6,
              selectable: false
          });
          
          canvas.add(line);
          canvas.sendToBack(line);
      }
      
      // Add a central circle
      const circle = new fabric.Circle({
          radius: 40,
          fill: randomHoliColor(),
          left: centerX,
          top: centerY,
          originX: 'center',
          originY: 'center',
          opacity: 0.7,
          selectable: false
      });
      
      canvas.add(circle);
      canvas.sendToBack(circle);
      canvas.renderAll();
      saveState();
  }
  
  // Download functionality
  downloadBtn.addEventListener('click', () => {
      const dataURL = canvas.toDataURL({
          format: 'png',
          quality: 0.8
      });
      
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'holi-splash-image.png';
      link.click();
  });
  
  // Share functionality
  const shareModal = document.getElementById('share-modal');
  const closeModal = document.querySelector('.close-modal');
  const copyLinkBtn = document.getElementById('copy-link-btn');
  const shareUrl = document.getElementById('share-url');
  
  shareBtn.addEventListener('click', () => {
      // In a real app, you would upload the image to a server and get a shareable URL
      // For demo purposes, we'll just show the modal with a dummy URL
      shareUrl.value = 'https://example.com/shared-image/' + Date.now();
      shareModal.style.display = 'flex';
  });
  
  closeModal.addEventListener('click', () => {
      shareModal.style.display = 'none';
  });
  
  copyLinkBtn.addEventListener('click', () => {
      shareUrl.select();
      document.execCommand('copy');
      copyLinkBtn.textContent = 'Copied!';
      setTimeout(() => {
          copyLinkBtn.textContent = 'Copy Link';
      }, 2000);
  });
  
  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
      if (e.target === shareModal) {
          shareModal.style.display = 'none';
      }
  });
  
  // Reset button
  resetBtn.addEventListener('click', () => {
      // Reset to upload state
      canvas.clear();
      uploadArea.style.display = 'flex';
      editorWorkspace.style.display = 'none';
      actionButtons.style.display = 'none';
      originalImage = null;
      undoStack = [];
      redoStack = [];
      updateUndoRedoButtons();
  });
  
  // Countdown background
  function setupCountdownBackground() {
      const background = document.getElementById('countdown-background');
      
      // Create colorful circles for the background
      for (let i = 0; i < 10; i++) {
          createBackgroundCircle(background);
      }
  }
  
  function createBackgroundCircle(container) {
      const circle = document.createElement('div');
      circle.className = 'timer-circle';
      
      // Random position
      const size = 100 + Math.random() * 200;
      circle.style.width = size + 'px';
      circle.style.height = size + 'px';
      circle.style.left = Math.random() * 100 + '%';
      circle.style.top = Math.random() * 100 + '%';
      
      // Random color
      circle.style.backgroundColor = randomHoliColor();
      
      // Random animation duration
      const duration = 10 + Math.random() * 20;
      circle.style.animationDuration = duration + 's';
      
      container.appendChild(circle);
  }
});