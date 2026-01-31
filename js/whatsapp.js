(function(){
  function normalizePhone(raw){
    return String(raw || '').replace(/\D/g,'');
  }

  function showToast(message){
    var toast = document.querySelector('[data-toast]');
    if(!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(function(){
      toast.classList.remove('is-visible');
    }, 3200);
  }

  function buildMessage(data){
    var lines = [
      'Hello Dr. Jay Deep Ghosh,',
      '',
      'I would like to book an appointment.',
      'Name: ' + data.name,
      'Phone: ' + data.phone
    ];
    if(data.visit) lines.push('Visit Type: ' + data.visit);
    if(data.date) lines.push('Preferred Date: ' + data.date);
    if(data.message) lines.push('Message: ' + data.message);
    lines.push('', 'Thank you.');
    return lines.join('\n');
  }

  function openWhatsApp(number, text){
    var clean = normalizePhone(number);
    if(!clean){
      showToast('Please set a WhatsApp number for the clinic.');
      return;
    }
    var url = 'https://wa.me/' + clean + '?text=' + encodeURIComponent(text);
    window.open(url, '_blank', 'noopener');
  }

  function initForm(form){
    var number = form.getAttribute('data-whatsapp-number') || '919999999999';

    form.addEventListener('submit', function(e){
      e.preventDefault();

      var name = form.querySelector('[name="name"]');
      var phone = form.querySelector('[name="phone"]');
      var message = form.querySelector('[name="message"]');
      var date = form.querySelector('[name="date"]');
      var visit = form.querySelector('[name="visit"]');

      var data = {
        name: name ? String(name.value || '').trim() : '',
        phone: phone ? String(phone.value || '').trim() : '',
        message: message ? String(message.value || '').trim() : '',
        date: date ? String(date.value || '').trim() : '',
        visit: visit ? String(visit.value || '').trim() : ''
      };

      if(!data.name || !data.phone){
        showToast('Please enter your name and phone number.');
        return;
      }

      var text = buildMessage(data);
      openWhatsApp(number, text);
      showToast('WhatsApp opened with a prefilled message. Please tap Send.');
      form.reset();
    });
  }

  window.addEventListener('DOMContentLoaded', function(){
    var forms = document.querySelectorAll('[data-whatsapp-form]');
    for(var i = 0; i < forms.length; i += 1){
      initForm(forms[i]);
    }
  });
})();
