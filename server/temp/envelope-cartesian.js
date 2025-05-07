/**
 * Generatore di Busta con sistema di coordinate cartesiane
 * Versione che usa attributi personalizzati data-env e sistema cartesiano (0,0 al centro)
 * Supporta 4 quadranti e mostra coordinate al passaggio del mouse
 */

(function() {
  const defaultSettings = {
    lineColor: '#22c55e', // verde como padrão
    lineWidth: 2,
    pointSize: 8,
    showGrid: true,
    snapToGrid: false,
    gridSize: 20,
    zoomIncrement: 1.2,
    minZoom: 0.2,
    maxZoom: 8,
    tooltipOffset: { x: 10, y: -20 },
    showCoordinatesTooltip: true
  };

  let points = [];
  let freePoint = { x: 150, y: 150 };
  let settings = {...defaultSettings};
  let canvasState = {
    scale: 1,
    offset: { x: 0, y: 0 },
    isDragging: false,
    selectedPointIndex: -1,
    isDraggingFreePoint: false,
    startDragPos: { x: 0, y: 0 }
  };

  let container = null;
  let canvas = null;
  let ctx = null;
  let canvasWidth = 0;
  let canvasHeight = 0;

  function getColorByValue(value) {
    value = parseInt(value);
    if (value === 0) return '#22c55e';  // verde
    if (value === 1 || value === -1) return '#eab308';  // amarelo
    if (value === 2 || value === -2) return '#f97316';  // laranja
    if (value === 3) return '#ef4444';  // vermelho
    return '#22c55e';  // verde como padrão
  }

  function findInputs() {
    const allInputs = document.querySelectorAll('input[data-env]');
    const vertexMap = new Map();

    allInputs.forEach(input => {
      const envValue = input.getAttribute('data-env');

      if (envValue === 'color') {
        const colorValue = input.value;
        settings.lineColor = getColorByValue(colorValue);
      } else if (envValue === 'wp-x') {
        freePoint.x = parseFloat(input.value) || 150;
        freePoint.xInput = input;
      } else if (envValue === 'wp-y') {
        freePoint.y = parseFloat(input.value) || 150;
        freePoint.yInput = input;
      } else if (envValue && envValue.includes('-')) {
        const parts = envValue.split('-');
        if (parts.length === 2) {
          const vertexId = parts[0];
          const coordinate = parts[1];

          if (!vertexMap.has(vertexId)) {
            vertexMap.set(vertexId, { id: vertexId });
          }

          const vertex = vertexMap.get(vertexId);

          if (coordinate === 'x') {
            vertex.x = parseFloat(input.value) || 0;
            vertex.xInput = input;
          } else if (coordinate === 'y') {
            vertex.y = parseFloat(input.value) || 0;
            vertex.yInput = input;
          }
        }
      }
    });

    points = Array.from(vertexMap.values())
      .filter(vertex => vertex.x !== undefined && vertex.y !== undefined);
  }

  function setupInputsObserver() {
    const allInputs = document.querySelectorAll('input[data-env]');
    
    // Observer for manual input changes
    allInputs.forEach(input => {
      input.addEventListener('input', () => {
        findInputs();
        drawCanvas();
      });
    });

    // Polling system to check for remote changes
    let previousValues = new Map();
    
    // Store initial values
    allInputs.forEach(input => {
      previousValues.set(input, input.value);
    });

    // Check for changes every 100ms
    setInterval(() => {
      allInputs.forEach(input => {
        const currentValue = input.value;
        const previousValue = previousValues.get(input);
        
        if (currentValue !== previousValue) {
          previousValues.set(input, currentValue);
          findInputs();
          drawCanvas();
        }
      });
    }, 100);
  }

  function createCanvas() {
    canvas = document.createElement('canvas');
    canvas.className = 'envelope-canvas';
    ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
      position: absolute;
      display: none;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 14px;
      pointer-events: none;
      z-index: 1000;
    `;
    container.appendChild(tooltip);
    window.tooltip = tooltip;

    // Add basic canvas styles
    canvas.style.cssText = `
      display: block;
      width: 100%;
      height: 100%;
      cursor: grab;
    `;

    // Bind events
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('wheel', handleMouseWheel);
    window.addEventListener('resize', resizeCanvas);
  }

  function init() {
    container = document.querySelector('.envelope-container');
    if (!container) return;

    createCanvas();
    findInputs();
    setupInputsObserver();
    centerView();
    resizeCanvas();
    drawCanvas();
  }

  function centerView() {
    canvasState.offset.x = canvasWidth / 2;
    canvasState.offset.y = canvasHeight / 2;
    canvasState.scale = 1;
  }

  function resizeCanvas() {
    canvasWidth = container.clientWidth;
    canvasHeight = container.clientHeight;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    if (canvasState.offset.x === 0 && canvasState.offset.y === 0) {
      centerView();
    }
    drawCanvas();
  }

  function worldToCanvas(x, y) {
    return {
      x: canvasState.offset.x + x * canvasState.scale,
      y: canvasState.offset.y - y * canvasState.scale
    };
  }

  function canvasToWorld(x, y) {
    return {
      x: (x - canvasState.offset.x) / canvasState.scale,
      y: (canvasState.offset.y - y) / canvasState.scale
    };
  }

  function handleMouseDown(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    canvasState.isDragging = true;
    canvasState.startDragPos = { x: mouseX, y: mouseY };
    canvas.classList.add('dragging');
  }

  function handleMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    canvasState.mousePos = { x: mouseX, y: mouseY };

    if (canvasState.selectedPointIndex !== -1) {
      const worldPos = canvasToWorld(mouseX, mouseY);
      points[canvasState.selectedPointIndex].x = worldPos.x;
      points[canvasState.selectedPointIndex].y = worldPos.y;
      updateInputsFromPoints();
      drawCanvas();
    } else if (canvasState.isDraggingFreePoint) {
      const worldPos = canvasToWorld(mouseX, mouseY);
      freePoint.x = worldPos.x;
      freePoint.y = worldPos.y;
      updateInputsFromPoints();
      drawCanvas();
    } else if (canvasState.isDragging) {
      const deltaX = mouseX - canvasState.startDragPos.x;
      const deltaY = mouseY - canvasState.startDragPos.y;

      canvasState.offset.x += deltaX;
      canvasState.offset.y += deltaY;
      canvasState.startDragPos = { x: mouseX, y: mouseY };

      drawCanvas();
    } else {
      const hoverPointIndex = findPointAt(mouseX, mouseY);
      const isHoveringFreePoint = isPointNear(mouseX, mouseY, freePoint);
      const isHoveringLine = isNearLine(mouseX, mouseY);

      canvasState.hoverPointIndex = hoverPointIndex;
      canvasState.isHoveringFreePoint = isHoveringFreePoint;

      if (hoverPointIndex !== -1 || isHoveringFreePoint) {
        canvas.style.cursor = 'pointer';
        if (settings.showCoordinatesTooltip) {
          if (hoverPointIndex !== -1) {
            const point = points[hoverPointIndex];
            showTooltip(mouseX, mouseY, `(${point.x.toFixed(2)}, ${point.y.toFixed(2)})`);
          } else if (isHoveringFreePoint) {
            showTooltip(mouseX, mouseY, `(${freePoint.x.toFixed(2)}, ${freePoint.y.toFixed(2)})`);
          }
        }
      } else {
        canvas.style.cursor = 'grab';
        hideTooltip();
      }

      if (canvasState.hoverPointIndex !== hoverPointIndex || 
          canvasState.isHoveringFreePoint !== isHoveringFreePoint) {
        drawCanvas();
      }
    }
  }

  function handleMouseUp() {
    canvasState.isDragging = false;
    canvasState.selectedPointIndex = -1;
    canvasState.isDraggingFreePoint = false;
    canvas.classList.remove('dragging');
    canvas.style.cursor = 'grab';
  }

  function findPointAt(x, y) {
    const hitRadius = (settings.pointSize + 2) * canvasState.scale;

    for (let i = 0; i < points.length; i++) {
      const canvasPos = worldToCanvas(points[i].x, points[i].y);
      const distance = Math.sqrt(
        Math.pow(x - canvasPos.x, 2) + 
        Math.pow(y - canvasPos.y, 2)
      );

      if (distance <= hitRadius) {
        return i;
      }
    }

    return -1;
  }

  function isPointNear(x, y, point) {
    const canvasPos = worldToCanvas(point.x, point.y);
    const hitRadius = (settings.pointSize + 2) * canvasState.scale;

    const distance = Math.sqrt(
      Math.pow(x - canvasPos.x, 2) + 
      Math.pow(y - canvasPos.y, 2)
    );

    return distance <= hitRadius;
  }

  function isNearLine(x, y) {
    if (points.length < 2) return false;
    const threshold = 5;

    for (let i = 0; i < points.length; i++) {
      const p1 = worldToCanvas(points[i].x, points[i].y);
      const p2 = worldToCanvas(points[(i + 1) % points.length].x, points[(i + 1) % points.length].y);
      
      const d = distanceToSegment(x, y, p1.x, p1.y, p2.x, p2.y);
      if (d < threshold) return true;
    }
    return false;
  }

  function distanceToSegment(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;

    if (len_sq !== 0) param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function showTooltip(x, y, content) {
    if (!tooltip) return;

    const rect = canvas.getBoundingClientRect();
    tooltip.textContent = content;
    tooltip.style.display = 'block';
    tooltip.style.left = `${x + rect.left + settings.tooltipOffset.x}px`;
    tooltip.style.top = `${y + rect.top + settings.tooltipOffset.y}px`;
  }

  function getColorDescription(value) {
    value = parseInt(value);
    if (value === 0) return "Verde (0) - Normal";
    if (value === 1 || value === -1) return "Amarelo (±1) - Atenção";
    if (value === 2 || value === -2) return "Laranja (±2) - Alerta";
    if (value === 3) return "Vermelho (3) - Crítico";
    return "Verde (0) - Normal";
  }

  function hideTooltip() {
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }

  function handleMouseWheel(event) {
    event.preventDefault();
    const delta = -Math.sign(event.deltaY);
    const factor = delta > 0 ? settings.zoomIncrement : 1 / settings.zoomIncrement;
    zoomCanvas(factor, { x: event.offsetX, y: event.offsetY });
  }

  function zoomCanvas(factor, zoomPoint = null) {
    if (!zoomPoint) {
      zoomPoint = {
        x: canvasWidth / 2,
        y: canvasHeight / 2
      };
    }

    const oldScale = canvasState.scale;
    canvasState.scale = Math.max(
      settings.minZoom, 
      Math.min(settings.maxZoom, canvasState.scale * factor)
    );

    if (oldScale !== canvasState.scale) {
      const scaleRatio = canvasState.scale / oldScale;
      canvasState.offset.x = zoomPoint.x - (zoomPoint.x - canvasState.offset.x) * scaleRatio;
      canvasState.offset.y = zoomPoint.y - (zoomPoint.y - canvasState.offset.y) * scaleRatio;
      drawCanvas();
    }
  }


  function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (settings.showGrid) {
      drawGrid();
    }

    drawAxes();
    drawEnvelope();
    drawPoints();
  }

  function drawGrid() {
    const gridSize = settings.gridSize * canvasState.scale;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    const originCanvas = worldToCanvas(0, 0);
    const startX = originCanvas.x % gridSize;
    const startY = originCanvas.y % gridSize;

    for (let x = startX; x < canvasWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight);
      ctx.stroke();
    }

    for (let y = startY; y < canvasHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }
  }

  function drawAxes() {
    const origin = worldToCanvas(0, 0);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, origin.y);
    ctx.lineTo(canvasWidth, origin.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(origin.x, 0);
    ctx.lineTo(origin.x, canvasHeight);
    ctx.stroke();

    if (canvasState.scale > 0.5) {
      ctx.fillStyle = '#64748b';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('X', canvasWidth - 20, origin.y + 5);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('Y', origin.x + 5, 20);
    }
  }

  function drawEnvelope() {
    if (points.length < 3) return;
    const { lineColor, lineWidth } = settings;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    const firstPointCanvas = worldToCanvas(points[0].x, points[0].y);
    ctx.moveTo(firstPointCanvas.x, firstPointCanvas.y);

    for (let i = 1; i < points.length; i++) {
      const pointCanvas = worldToCanvas(points[i].x, points[i].y);
      ctx.lineTo(pointCanvas.x, pointCanvas.y);
    }

    ctx.closePath();
    ctx.stroke();
  }

  function drawPoints() {
    const { pointSize } = settings;

    for (let i = 0; i < points.length; i++) {
      const canvasPos = worldToCanvas(points[i].x, points[i].y);
      ctx.beginPath();
      ctx.arc(canvasPos.x, canvasPos.y, pointSize, 0, Math.PI * 2);

      const colorInput = document.querySelector('input[data-env="color"]');
      const currentColor = getColorByValue(colorInput ? colorInput.value : '0');
      ctx.fillStyle = currentColor;

      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    const freePointCanvas = worldToCanvas(freePoint.x, freePoint.y);
    ctx.beginPath();
    ctx.arc(freePointCanvas.x, freePointCanvas.y, pointSize, 0, Math.PI * 2);

    ctx.fillStyle = '#000000';  // Preto fixo para o workpoint

    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  function updateInputsFromPoints() {
    points.forEach((point) => {
      if (point.xInput) {
        point.xInput.value = Math.round(point.x);
      }
      if (point.yInput) {
        point.yInput.value = Math.round(point.y);
      }
    });

    if (freePoint.xInput) {
      freePoint.xInput.value = Math.round(freePoint.x);
    }
    if (freePoint.yInput) {
      freePoint.yInput.value = Math.round(freePoint.y);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();