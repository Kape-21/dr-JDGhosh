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
      e.preventDefault();
      e.stopPropagation();
      var isOpen = panel.classList.contains('is-open');
      setOpen(!isOpen);
    });

    panel.addEventListener('click', function(e){
      if(e.target.closest('a')){
        setOpen(false);
      }
    });

    document.addEventListener('click', function(e){
      if(panel.classList.contains('is-open') && 
         !panel.contains(e.target) && 
         !toggle.contains(e.target)){
        setOpen(false);
      }
    });
    
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape') setOpen(false);
    });
  }

  // 3. Dynamic Year
  function initYear(){
    var el = document.getElementById('year');
    if(!el) return;
    el.textContent = String(new Date().getFullYear());
  }

  // 4. Image Modal (Lightbox) Logic
  function initImageModal() {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const triggers = document.querySelectorAll('.outcomes-grid .outcome-image'); 
    const closeButtons = document.querySelectorAll('[data-close-modal]');

    if (!modal || !modalImg) return;

    function openModal(src, alt) {
      modalImg.src = src;
      modalImg.alt = alt || 'Outcome Image';
      modal.classList.add('is-visible');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; 
    }

    function closeModal() {
      modal.classList.remove('is-visible');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; 
      setTimeout(() => { modalImg.src = ''; }, 300); 
    }

    triggers.forEach(img => {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(img.src, img.alt);
      });
    });

    closeButtons.forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-visible')) {
        closeModal();
      }
    });
  }

  // 5. Video Loader (Facade Pattern)
  // Attached to window so the HTML onclick="loadVideo(this)" works
  window.loadVideo = function(element) {
    var videoId = element.getAttribute('data-id');
    if(!videoId) return;

    var iframe = document.createElement('iframe');
    // autoplay=1 starts it immediately
    iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&modestbranding=1';
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    
    element.innerHTML = '';
    element.appendChild(iframe);
  };

  // Initialize all functions
  window.addEventListener('DOMContentLoaded', function(){
    initStickyHeader();
    initMobileNav();
    initYear();
    initImageModal();
  });
})();