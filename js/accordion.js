(function(){
  
  /* --- 1. TEXT ACCORDION LOGIC (Procedures) --- */
  function setPanelHeight(panel, height){
    panel.style.height = height;
  }

  function openItem(item){
    var trigger = item.querySelector('[data-accordion-trigger]');
    var panel = item.querySelector('[data-accordion-panel]');
    if(!trigger || !panel) return;

    item.classList.add('is-open');
    trigger.setAttribute('aria-expanded', 'true');
    panel.setAttribute('aria-hidden', 'false');

    setPanelHeight(panel, panel.scrollHeight + 'px');

    var onEnd = function(e){
      if(e.propertyName !== 'height') return;
      panel.removeEventListener('transitionend', onEnd);
      if(item.classList.contains('is-open')) setPanelHeight(panel, 'auto');
    };
    panel.addEventListener('transitionend', onEnd);
  }

  function closeItem(item){
    var trigger = item.querySelector('[data-accordion-trigger]');
    var panel = item.querySelector('[data-accordion-panel]');
    if(!trigger || !panel) return;

    item.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    panel.setAttribute('aria-hidden', 'true');

    var current = panel.scrollHeight;
    setPanelHeight(panel, current + 'px');
    window.requestAnimationFrame(function(){
      setPanelHeight(panel, '0px');
    });
  }

  function initAccordion(root){
    var multi = root.hasAttribute('data-accordion-multi');
    if(multi){
      try{
        if(window.matchMedia('(max-width: 980px)').matches) multi = false;
      }catch(_e){}
    }
    var items = Array.prototype.slice.call(root.querySelectorAll('.accordion-item'));

    items.forEach(function(item){
      var trigger = item.querySelector('[data-accordion-trigger]');
      var panel = item.querySelector('[data-accordion-panel]');
      if(!trigger || !panel) return;

      panel.style.height = '0px';
      panel.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');

      trigger.addEventListener('click', function(){
        var isOpen = item.classList.contains('is-open');
        if(!multi){
          items.forEach(function(other){
            if(other !== item) closeItem(other);
          });
        }
        if(isOpen) closeItem(item);
        else openItem(item);
      });
    });

    // Check if any item is hardcoded to be open in HTML
    var firstOpen = items.find(function(item){ return item.classList.contains('is-open'); });
    if(firstOpen) openItem(firstOpen);
    
    // REMOVED: The logic that forced the first item to open automatically
  }

  /* --- 2. CARD GROUP LOGIC (Areas of Care) --- */
  function initCardGroup(group) {
    var cards = Array.prototype.slice.call(group.children);

    cards.forEach(function(card) {
      card.addEventListener('click', function() {
        var isOpen = card.getAttribute('aria-expanded') === 'true';

        // Close others
        cards.forEach(function(otherCard) {
          if (otherCard !== card) {
            otherCard.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle current
        card.setAttribute('aria-expanded', !isOpen);
      });
    });
  }

  /* --- INITIALIZATION --- */
  window.addEventListener('DOMContentLoaded', function(){
    // Init Text Accordions
    var accordions = document.querySelectorAll('[data-accordion]');
    for(var i = 0; i < accordions.length; i += 1){
      initAccordion(accordions[i]);
    }

    // Init Card Groups
    var cardGroups = document.querySelectorAll('[data-card-group]');
    for(var j = 0; j < cardGroups.length; j += 1){
      initCardGroup(cardGroups[j]);
    }
  });
})();