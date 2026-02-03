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

    toggle.addEventListener('click', function(){
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

  // 5. Counter Animation Logic (Smart Duration)
  function initCounters() {
    const counters = document.querySelectorAll('.counter-val');
    if (counters.length === 0) return;

    // Total duration for animation (in ms)
    const duration = 2000; 

    const animate = (counter) => {
      const value = +counter.getAttribute('data-target');
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1); 

        // Ease-out effect
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
      // Staggered delay based on index
      pill.style.transitionDelay = (index * 0.1) + 's';
      observer.observe(pill);
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
  });

})();