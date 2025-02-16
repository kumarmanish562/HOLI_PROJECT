// Global variables
let canvas;
let isDrawingMode = false;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCanvas();
    setupEventListeners();
});

// Canvas initialization
function initializeCanvas() {
    try {
        canvas = new fabric.Canvas('canvas', {
            width: 800,
            height: 600,
            backgroundColor: '#ffffff'
        });
        
        canvas.selection = true;
        canvas.isDrawingMode = false;

        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = 10;
            canvas.freeDrawingBrush.color = '#ff0000';
        }
    } catch (error) {
        console.error('Canvas initialization error:', error);
    }
}

// Event listeners setup
function setupEventListeners() {
    const brushColor = document.getElementById('brushColor');
    const brushSize = document.getElementById('brushSize');

    if (brushColor) {
        brushColor.addEventListener('change', updateBrushColor);
    }

    if (brushSize) {
        brushSize.addEventListener('change', updateBrushSize);
    }
}

// Templates configuration
const templates = {
    template1: {
        background: createGradient(['#FF9A8B', '#FF6B6B', '#FA4C64']),
        elements: [
            createCircle(100, 100, '#FFE66D'),
            createCircle(700, 500, '#4ECDC4'),
            createText("Happy Holi!", 400, 300)
        ]
    },
    template2: {
        background: createGradient(['#A8E6CF', '#DCEDC1', '#FFD3B6']),
        elements: [
            createFlower(200, 150),
            createFlower(600, 450),
            createText("Let's celebrate colors!", 400, 300)
        ]
    },
    template3: {
        background: createGradient(['#FF8B94', '#FFB2A6', '#FFC2A9']),
        elements: [
            createColorBurst(400, 300),
            createText("Color your life!", 400, 200)
        ]
    },
    template4: {
        background: createGradient(['#6C5CE7', '#A8E6CF', '#FFE66D']),
        elements: [
            createMagicalEffect(400, 300),
            createText("Magical Holi Wishes!", 400, 200)
        ]
    }
};

// Create gradient background
function createGradient(colors) {
    try {
        return new fabric.Gradient({
            type: 'linear',
            coords: {
                x1: 0,
                y1: 0,
                x2: 800,
                y2: 600
            },
            colorStops: colors.map((color, index) => ({
                offset: index / (colors.length - 1),
                color: color
            }))
        });
    } catch (error) {
        console.error('Gradient creation error:', error);
        return '#ffffff'; // Fallback color
    }
}

// Create circle element
function createCircle(x, y, color) {
    return new fabric.Circle({
        left: x,
        top: y,
        radius: 50,
        fill: color,
        opacity: 0.7,
        originX: 'center',
        originY: 'center'
    });
}

// Create flower element
function createFlower(x, y) {
    try {
        const petals = [];
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            petals.push(
                new fabric.Ellipse({
                    left: x + 30 * Math.cos(angle),
                    top: y + 30 * Math.sin(angle),
                    rx: 20,
                    ry: 10,
                    angle: angle * (180 / Math.PI),
                    fill: '#FF6B6B',
                    opacity: 0.7
                })
            );
        }
        return new fabric.Group(petals, {
            left: x,
            top: y,
            originX: 'center',
            originY: 'center'
        });
    } catch (error) {
        console.error('Flower creation error:', error);
        return null;
    }
}

// Create color burst effect
function createColorBurst(x, y) {
    try {
        const burst = [];
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'];
        
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI) / 6;
            burst.push(
                new fabric.Triangle({
                    left: x + 50 * Math.cos(angle),
                    top: y + 50 * Math.sin(angle),
                    width: 30,
                    height: 60,
                    angle: angle * (180 / Math.PI),
                    fill: colors[i % colors.length],
                    opacity: 0.7
                })
            );
        }
        
        return new fabric.Group(burst, {
            left: x,
            top: y,
            originX: 'center',
            originY: 'center'
        });
    } catch (error) {
        console.error('Color burst creation error:', error);
        return null;
    }
}

// Create magical effect
function createMagicalEffect(x, y) {
    try {
        const elements = [];
        const colors = ['#6C5CE7', '#A8E6CF', '#FFE66D'];
        
        for (let i = 0; i < 15; i++) {
            const angle = (i * Math.PI * 2) / 15;
            const distance = 30 + Math.random() * 50;
            elements.push(
                new fabric.Circle({
                    left: x + distance * Math.cos(angle),
                    top: y + distance * Math.sin(angle),
                    radius: 3 + Math.random() * 5,
                    fill: colors[Math.floor(Math.random() * colors.length)],
                    opacity: 0.7
                })
            );
        }
        
        return new fabric.Group(elements, {
            left: x,
            top: y,
            originX: 'center',
            originY: 'center'
        });
    } catch (error) {
        console.error('Magical effect creation error:', error);
        return null;
    }
}

// Create text element
function createText(text, x, y) {
    return new fabric.Text(text, {
        left: x,
        top: y,
        fontSize: 40,
        fontFamily: 'Dancing Script',
        fill: '#ffffff',
        textAlign: 'center',
        originX: 'center',
        originY: 'center',
        shadow: new fabric.Shadow({
            color: 'rgba(0,0,0,0.3)',
            blur: 5,
            offsetX: 2,
            offsetY: 2
        })
    });
}

// Load template
function loadTemplate(templateName) {
    if (!canvas) return;
    
    const template = templates[templateName];
    if (!template) return;

    try {
        canvas.clear();
        canvas.setBackgroundColor(template.background, canvas.renderAll.bind(canvas));
        
        template.elements.forEach(element => {
            if (element) {
                canvas.add(element);
            }
        });

        canvas.renderAll();
    } catch (error) {
        console.error('Template loading error:', error);
    }
}

// Add text to canvas
function addText() {
    if (!canvas) return;

    const textInput = document.getElementById('textInput');
    const textColor = document.getElementById('textColor');
    const fontSize = document.getElementById('fontSize');
    const fontFamily = document.getElementById('fontFamily');

    if (!textInput || !textInput.value) return;

    try {
        const textObject = new fabric.Text(textInput.value, {
            left: canvas.width / 2,
            top: canvas.height / 2,
            fontSize: parseInt(fontSize ? fontSize.value : 30),
            fontFamily: fontFamily ? fontFamily.value : 'Arial',
            fill: textColor ? textColor.value : '#000000',
            originX: 'center',
            originY: 'center'
        });

        canvas.add(textObject);
        canvas.setActiveObject(textObject);
        canvas.renderAll();
    } catch (error) {
        console.error('Text addition error:', error);
    }
}

// Sticker configuration
const stickerEmojis = {
    'splash': '💦',
    'pichkari': '🎨',
    'balloon': '🎈',
    'gulaal': '🌺',
    'drum': '🥁',
    'sweets': '🍬'
};

// Add sticker to canvas
function addSticker(type) {
    if (!canvas) return;
    
    const emoji = stickerEmojis[type];
    if (!emoji) return;

    try {
        const text = new fabric.Text(emoji, {
            left: canvas.width / 2,
            top: canvas.height / 2,
            fontSize: 50,
            originX: 'center',
            originY: 'center'
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    } catch (error) {
        console.error('Sticker addition error:', error);
    }
}

// Add glitter effect
function addGlitter() {
    if (!canvas) return;

    try {
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const glitter = new fabric.Circle({
                left: x,
                top: y,
                radius: 2 + Math.random() * 3,
                fill: '#ffffff',
                opacity: 0.7
            });
            canvas.add(glitter);
        }
        canvas.renderAll();
    } catch (error) {
        console.error('Glitter effect error:', error);
    }
}

// Add color splash effect
function addColorSplash() {
    if (!canvas) return;

    try {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'];
        const x = canvas.width / 2;
        const y = canvas.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const splash = new fabric.Circle({
                left: x + 100 * Math.cos(angle),
                top: y + 100 * Math.sin(angle),
                radius: 30,
                fill: colors[i % colors.length],
                opacity: 0.5
            });
            canvas.add(splash);
        }
        canvas.renderAll();
    } catch (error) {
        console.error('Color splash effect error:', error);
    }
}

// Toggle drawing mode
function toggleDrawing() {
    if (!canvas) return;

    try {
        isDrawingMode = !isDrawingMode;
        canvas.isDrawingMode = isDrawingMode;
        
        const brushSize = document.getElementById('brushSize');
        const brushColor = document.getElementById('brushColor');
        
        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = parseInt(brushSize ? brushSize.value : 10);
            canvas.freeDrawingBrush.color = brushColor ? brushColor.value : '#ff0000';
        }
    } catch (error) {
        console.error('Drawing mode toggle error:', error);
    }
}

// Update brush color
function updateBrushColor(e) {
    if (canvas && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = e.target.value;
    }
}

// Update brush size
function updateBrushSize(e) {
    if (canvas && canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = parseInt(e.target.value);
    }
}

// Upload image
function uploadImage() {
    if (!canvas) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        
        reader.onload = function(event) {
            fabric.Image.fromURL(event.target.result, function(img) {
                try {
                    img.scaleToWidth(200);
                    canvas.add(img);
                    canvas.renderAll();
                } catch (error) {
                    console.error('Image processing error:', error);
                }
            });
        };
        
        reader.readAsDataURL(file);
    };
    
    input.click();
}

// Download greeting
function downloadGreeting() {
    if (!canvas) return;

    try {
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        
        const link = document.createElement('a');
        link.download = 'holi-greeting.png';
        link.href = dataURL;
        link.click();
    } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download the greeting. Please try again.');
    }
}

// Share greeting
function shareGreeting() {
    if (!canvas) return;

    if (navigator.share) {
        canvas.toBlob(function(blob) {
            try {
                const file = new File([blob], 'holi-greeting.png', { type: 'image/png' });
                navigator.share({
                    files: [file],
                    title: 'Holi Greeting',
                    text: 'Check out my Holi greeting!'
                }).catch(error => {
                    console.error('Sharing error:', error);
                    alert('Failed to share the greeting. Please try again.');
                });
            } catch (error) {
                console.error('Share preparation error:', error);
                alert('Failed to prepare the greeting for sharing.');
            }
        });
    } else {
        alert('Sharing is not supported on this browser');
    }
}

// Clear canvas
function clearCanvas() {
    if (!canvas) return;

    if (confirm('Are you sure you want to clear the canvas?')) {
        try {
            canvas.clear();
            canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
        } catch (error) {
            console.error('Canvas clearing error:', error);
        }
    }
}