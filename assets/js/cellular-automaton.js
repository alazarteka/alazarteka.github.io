// Cellular Automaton Background - HighLife (B36/S23)
(function() {
  'use strict';

  // Configuration
  const CELL_SIZE = 10;
  const UPDATE_INTERVAL = 250; // milliseconds
  const MOBILE_DENSITY_REDUCTION = 0.5;

  // State
  let canvas, ctx;
  let grid, nextGrid;
  let cols, rows;
  let animationId;
  let lastUpdateTime = 0;
  let isPaused = false;
  let isMobile = false;

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Detect mobile devices
  function detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Initialize canvas and grid
  function init() {
    if (prefersReducedMotion) {
      console.log('Cellular automaton disabled: user prefers reduced motion');
      return;
    }

    canvas = document.getElementById('automaton-canvas');
    if (!canvas) {
      console.error('Canvas element not found');
      return;
    }

    ctx = canvas.getContext('2d', { alpha: true });
    isMobile = detectMobile();

    resizeCanvas();
    createGrid();
    seedPattern();

    // Start animation loop
    requestAnimationFrame(animate);

    // Setup event listeners
    window.addEventListener('resize', debounce(handleResize, 250));
    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  // Resize canvas to fill viewport
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    cols = Math.floor(canvas.width / CELL_SIZE);
    rows = Math.floor(canvas.height / CELL_SIZE);

    // Reduce grid size on mobile
    if (isMobile) {
      cols = Math.floor(cols * MOBILE_DENSITY_REDUCTION);
      rows = Math.floor(rows * MOBILE_DENSITY_REDUCTION);
    }
  }

  // Create 2D grid
  function createGrid() {
    grid = Array(rows).fill().map(() => Array(cols).fill(0));
    nextGrid = Array(rows).fill().map(() => Array(cols).fill(0));
  }

  // Seed initial pattern
  function seedPattern() {
    // Random seed with 20% alive cells
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        grid[y][x] = Math.random() < 0.1 ? 1 : 0;
      }
    }

    // Add some gliders for interesting movement
    addGlider(10, 10);
    addGlider(cols - 15, 15);
    addGlider(15, rows - 15);
  }

  // Add a glider pattern at position
  function addGlider(startX, startY) {
    const glider = [
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 1]
    ];

    for (let y = 0; y < glider.length; y++) {
      for (let x = 0; x < glider[y].length; x++) {
        const gridY = (startY + y) % rows;
        const gridX = (startX + x) % cols;
        grid[gridY][gridX] = glider[y][x];
      }
    }
  }

  // Count live neighbors (with wrapping edges)
  function countNeighbors(x, y) {
    let count = 0;

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0) continue;

        const newY = (y + dy + rows) % rows;
        const newX = (x + dx + cols) % cols;
        count += grid[newY][newX];
      }
    }

    return count;
  }

  // Update grid using HighLife rules (B36/S23)
  function updateGrid() {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const neighbors = countNeighbors(x, y);
        const cell = grid[y][x];

        // HighLife rules: B36/S23
        // Birth: 3 or 6 neighbors
        // Survival: 2 or 3 neighbors
        if (cell === 1) {
          nextGrid[y][x] = (neighbors === 2 || neighbors === 3) ? 1 : 0;
        } else {
          nextGrid[y][x] = (neighbors === 3 || neighbors === 6) ? 1 : 0;
        }
      }
    }

    // Swap grids (double buffering)
    [grid, nextGrid] = [nextGrid, grid];
  }

  // Render grid to canvas
  function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get cell color from CSS variable
    const cellColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--automaton-cell-color').trim() || '#3b82f6';

    ctx.fillStyle = cellColor;

    // Draw alive cells
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y][x] === 1) {
          const screenX = x * CELL_SIZE * (isMobile ? (1 / MOBILE_DENSITY_REDUCTION) : 1);
          const screenY = y * CELL_SIZE * (isMobile ? (1 / MOBILE_DENSITY_REDUCTION) : 1);
          const size = CELL_SIZE * (isMobile ? (1 / MOBILE_DENSITY_REDUCTION) : 1);

          // Render cells at 90% size with a gap
          const gapSize = size * 0.9;
          const offset = (size - gapSize) / 2;
          ctx.fillRect(screenX + offset, screenY + offset, gapSize, gapSize);
        }
      }
    }
  }

  // Animation loop
  function animate(currentTime) {
    if (isPaused) {
      animationId = null;
      return;
    }

    animationId = requestAnimationFrame(animate);

    // Throttle updates to UPDATE_INTERVAL
    if (currentTime - lastUpdateTime < UPDATE_INTERVAL) {
      return;
    }

    lastUpdateTime = currentTime;

    updateGrid();
    render();
  }

  // Handle window resize
  function handleResize() {
    resizeCanvas();
    createGrid();
    seedPattern();
  }

  // Handle page visibility changes
  function handleVisibilityChange() {
    if (document.hidden) {
      pause();
    } else {
      resume();
    }
  }

  // Pause animation
  function pause() {
    isPaused = true;
  }

  // Resume animation
  function resume() {
    if (isPaused && !prefersReducedMotion) {
      isPaused = false;
      lastUpdateTime = performance.now();
      requestAnimationFrame(animate);
    }
  }

  // Utility: Debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export control functions for debugging
  window.cellularAutomaton = {
    pause,
    resume,
    reset: () => {
      seedPattern();
    }
  };
})();
