(function(){
  // Check for reduced motion preference
  var prefersReducedMotion = false;
  try { 
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; 
  } catch(_e){}

  function initOne(root) {
    var track = root.querySelector('.swiper-track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.swiper-slide'));
    
    // Safety check
    if (!track || slides.length === 0) return;

    // SELECTORS
    var prevBtn = root.querySelector('.swiper-prev');
    var nextBtn = root.querySelector('.swiper-next');
    var pagination = root.querySelector('[data-swiper-pagination]');

    var index = 0;
    var totalSlides = slides.length;
    var autoplayTimer = null;

    // CONFIG
    var autoplayMs = parseInt(root.getAttribute('data-autoplay') || '0', 10);
    if (prefersReducedMotion) autoplayMs = 0;

    // 1. RENDER & NAVIGATION LOGIC
    function render() {
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      
      // Update Dots
      if (pagination) {
        var dots = Array.prototype.slice.call(pagination.children);
        dots.forEach(function(dot, i) {
          dot.classList.toggle('is-active', i === index);
        });
      }
      
      // Accessibility
      slides.forEach(function(slide, i) {
        slide.setAttribute('aria-hidden', String(i !== index));
      });
    }

    function goTo(i) {
      index = (i + totalSlides) % totalSlides;
      render();
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    // 2. BUILD PAGINATION DOTS
    if (pagination) {
      pagination.innerHTML = '';
      slides.forEach(function(_s, i) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'swiper-dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        
        // Prevent Drag Logic on Dots too
        dot.addEventListener('pointerdown', function(e){ e.stopPropagation(); });
        dot.addEventListener('click', function() {
          goTo(i);
          restartAutoplay();
        });
        
        pagination.appendChild(dot);
      });
    }

    // 3. ARROW CLICK LISTENERS
    function setupBtn(btn, action) {
      if (!btn) return;
      
      btn.addEventListener('pointerdown', function(e) { 
        e.stopPropagation(); 
      });

      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        action();
        restartAutoplay();
      });
    }

    setupBtn(nextBtn, next);
    setupBtn(prevBtn, prev);

    // 4. AUTOPLAY ENGINE
    function startAutoplay() {
      if (!autoplayMs || autoplayMs < 1500) return;
      stopAutoplay();
      autoplayTimer = window.setInterval(function() { next(); }, autoplayMs);
    }
    function stopAutoplay() {
      if (autoplayTimer) { window.clearInterval(autoplayTimer); autoplayTimer = null; }
    }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    // Pause on interaction
    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);

    // 5. DRAG / SWIPE LOGIC
    var pointerDown = false;
    var startX = 0;
    var activePointerId = null;

    root.addEventListener('pointerdown', function(e) {
      // Ignore right-clicks
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      
      // CRITICAL FIX: If user clicks a Link (A) or Button, DO NOT start drag logic.
      // This allows the click to pass through to the href.
      if (e.target.closest('a, button')) return; 
      
      pointerDown = true;
      activePointerId = e.pointerId;
      startX = e.clientX;
      stopAutoplay();
      
      try { root.setPointerCapture(e.pointerId); } catch(_e) {}
    });

    root.addEventListener('pointerup', function(e) {
      if (!pointerDown || e.pointerId !== activePointerId) return;
      pointerDown = false;
      activePointerId = null;
      
      var deltaX = e.clientX - startX;
      var threshold = Math.min(80, Math.max(40, window.innerWidth * 0.07));

      if (Math.abs(deltaX) > threshold) {
        if (deltaX < 0) next();
        else prev();
      }
      
      // Release capture to ensure other events behave normally
      try { root.releasePointerCapture(e.pointerId); } catch(_e) {}
      
      restartAutoplay();
    });

    root.addEventListener('pointercancel', function() {
      pointerDown = false;
      activePointerId = null;
      restartAutoplay();
    });

    // INITIALIZE
    goTo(0);
    startAutoplay();
  }

  // Init when DOM is ready
  window.addEventListener('DOMContentLoaded', function() {
    var swipers = document.querySelectorAll('[data-swiper]');
    for (var i = 0; i < swipers.length; i += 1) {
      initOne(swipers[i]);
    }
  });
})();