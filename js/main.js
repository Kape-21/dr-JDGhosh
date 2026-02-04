(function(){
  
  // 1. Sticky Header Logic
  function initStickyHeader(){
    var header = document.querySelector('[data-header]');
    if(!header) return;

    var ticking = false;
    function onScroll(){
      if(ticking) return;
      ticking = true;
      window.requestAnimationFrame(function(){
        header.classList.toggle('is-scrolled', window.scrollY > 10);
        ticking = false;
      });
    }

    onScroll(); 
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  // 2. Mobile Menu Logic
  function initMobileNav(){
    var toggle = document.querySelector('[data-nav-toggle]');
    var panel = document.querySelector('[data-nav-panel]');
    var icon = document.getElementById('nav-icon');
    
    if(!toggle || !panel) return;

    function setOpen(open){
      panel.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : ''; 

      if(icon) {
        if(open) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    }

    toggle.addEventListener('click', function(e){
      e.stopPropagation(); // Prevent bubbling issues
      var isOpen = panel.classList.contains('is-open');
      setOpen(!isOpen);
    });

    // Close when clicking a link
    var links = panel.querySelectorAll('a');
    Array.prototype.forEach.call(links, function(link){
      link.addEventListener('click', function(){
        setOpen(false);
      });
    });

    // Close when clicking outside
    document.addEventListener('click', function(e){
      if(panel.classList.contains('is-open') && !panel.contains(e.target) && !toggle.contains(e.target)){
        setOpen(false);
      }
    });
  }

  // 3. Contact Form Logic (Google Sheets)
  function initContactForm(){
    var contactForm = document.getElementById('footerContactForm');
    if(!contactForm) return;

    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxRSaMbfHTQMYPPDyE_S9Wu2ppS0kNPoqdAJiAnox8lAMC42jcI3eSj0Lxd8moiKWQnHA/exec"; 

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var btn = document.getElementById('c_submit_btn');
      
      btn.innerHTML = 'Sending...';
      btn.disabled = true;

      var formData = new FormData(contactForm);
      var payload = {
        formType: "contact",
        name: formData.get('name'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        honeypot: formData.get('honeypot')
      };

      fetch(SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      })
      .then(function(res) { return res.json(); })
      .then(function(response) {
        if (response.result === "success") {
          alert("Thank you! Your message has been sent.");
          contactForm.reset();
        } else {
          alert("Error: " + response.message);
        }
      })
      .catch(function(error) {
        alert("Network error. Please try again.");
      })
      .finally(function() {
        btn.disabled = false;
        btn.innerHTML = 'Send Message';
      });
    });
  }

  // 4. Image Modal Logic
  function initImageModal(){
    var modal = document.getElementById('image-modal');
    if(!modal) return;
    
    var modalImg = document.getElementById('modal-img');
    var triggers = document.querySelectorAll('[data-open-modal]');
    var closeBtns = document.querySelectorAll('[data-close-modal]');

    function openModal(src){
      modalImg.src = src;
      modal.classList.add('is-visible');
      modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal(){
      modal.classList.remove('is-visible');
      modal.setAttribute('aria-hidden', 'true');
      setTimeout(function(){ modalImg.src = ''; }, 300);
    }

    Array.prototype.forEach.call(triggers, function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault();
        var img = btn.querySelector('img'); 
        if(img) openModal(img.src); 
      });
    });

    Array.prototype.forEach.call(closeBtns, function(btn){
      btn.addEventListener('click', closeModal);
    });
    
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && modal.classList.contains('is-visible')) {
        closeModal();
      }
    });
  }

  // 5. Counter Animation Logic
  function initCounters() {
    const counters = document.querySelectorAll('.counter-val');
    if (counters.length === 0) return;

    const duration = 2000; 

    const animate = (counter) => {
      const value = +counter.getAttribute('data-target');
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1); 

        const easeProgress = 1 - Math.pow(1 - progress, 3);

        const currentVal = Math.floor(easeProgress * value);
        counter.innerText = currentVal.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = value.toLocaleString();
        }
      };

      requestAnimationFrame(updateCount);
    }

    const observerOptions = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  // 6. Badge Fly-In Animation
  function initBadgeAnimation() {
    var pills = document.querySelectorAll('.cert-pill');
    if(pills.length === 0) return;

    var observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 
    };

    var observer = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var target = entry.target;
          target.classList.add('is-visible');
          obs.unobserve(target); 
        }
      });
    }, observerOptions);

    pills.forEach(function(pill, index) {
      pill.style.transitionDelay = (index * 0.1) + 's';
      observer.observe(pill);
    });
  }

 // 7. Video Modal Logic (Desktop Optimized + Mobile Preserved)
  function initVideoFacades() {
    var facades = document.querySelectorAll('.video-facade');
    var modal = document.getElementById('video-modal');
    var wrapper = document.getElementById('video-frame-wrapper'); 
    var content = document.getElementById('video-modal-content'); 
    var closeButtons = document.querySelectorAll('[data-close-video]');
    var overlay = document.querySelector('.video-modal-overlay');

    if (!modal || !wrapper || !content) return;

    function openModal(videoId, type) {
      // 1. Reset Styles
      wrapper.style.maxWidth = '';
      content.style.paddingBottom = ''; 
      
      // Simple check: Is this a large screen? (Desktop/Laptop)
      var isDesktop = window.innerWidth > 1024;

      // 2. Apply Sizing Logic
      if (type === 'vertical') {
        // --- Vertical (Shorts) ---
        if (isDesktop) {
          // DESKTOP: Scale down to 320px width. 
          // Resulting Height is ~570px, which fits easily on monitors without cropping.
          wrapper.style.maxWidth = '320px'; 
        } else {
          // MOBILE: Keep your "Perfect" setting
          wrapper.style.maxWidth = '400px'; 
        }
        content.style.paddingBottom = '177.77%'; // 9/16 Ratio
      } else {
        // --- Horizontal ---
        // Constrain desktop slightly more (850px) to match the grid feel
        wrapper.style.maxWidth = isDesktop ? '850px' : '900px'; 
        content.style.paddingBottom = '56.25%'; // 16/9 Ratio
      }

      // 3. Inject Iframe (Exact string that works)
      content.innerHTML = '<iframe src="https://www.youtube.com/embed/' + videoId + '?autoplay=1&playsinline=1&controls=1&rel=0&modestbranding=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>';

      // 4. Show Modal
      modal.classList.add('is-visible');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; 
    }

    function closeModal() {
      modal.classList.remove('is-visible');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; 
      
      setTimeout(function(){ 
        content.innerHTML = ''; 
      }, 300);
    }

    // Facade Click Listeners
    Array.prototype.forEach.call(facades, function(facade) {
      facade.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        var videoId = this.getAttribute('data-id');
        if (!videoId) return;

        // Auto-detect type
        var isVertical = this.closest('.edu-card-tall') !== null;
        var type = isVertical ? 'vertical' : 'horizontal';

        openModal(videoId, type);
      });
    });

    // Close Button Listeners
    Array.prototype.forEach.call(closeButtons, function(btn) {
      btn.addEventListener('click', closeModal);
    });

    // Overlay Click Listener
    if(overlay) {
      overlay.addEventListener('click', closeModal);
    }

    // Escape Key Listener
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('is-visible')) {
        closeModal();
      }
    });
  }
  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', function(){
    initStickyHeader();
    initMobileNav();
    initContactForm();
    initImageModal();
    initCounters(); 
    initBadgeAnimation(); 
    initVideoFacades(); // Updated unified logic
  });

})();
