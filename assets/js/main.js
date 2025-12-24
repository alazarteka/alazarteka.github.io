// Main site JavaScript
(function() {
  'use strict';

  // Theme toggle functionality
  function initThemeToggle() {
    const toggle = document.querySelector('.theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.dataset.theme;
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.dataset.theme = newTheme;
      localStorage.setItem('theme', newTheme);
    });

    // Listen for system preference changes (only if no manual override)
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', function(e) {
      if (!localStorage.getItem('theme')) {
        document.documentElement.dataset.theme = e.matches ? 'light' : 'dark';
      }
    });
  }

  // Add active state to navigation
  function updateActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (currentPath === linkPath || (currentPath === '/' && linkPath.endsWith('/'))) {
        link.classList.add('active');
      }
    });
  }

  // Smooth scroll for anchor links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }

  // Initialize on DOM ready
  function init() {
    updateActiveNav();
    initSmoothScroll();
    initThemeToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
