const ChangeForm = {
  init: function () {
    this.waitForSelectorToLoad('.selector-available', () => {
      this.addClassSelector();
    });
    this.createTabs();
    this.updateSubmitRow();
  },
  addClassSelector: function () {
    $('.selector-available, .selector-chosen').addClass('p-3 border');
    $('.selector select, .selector input').addClass('form-control');
  },
  waitForSelectorToLoad: function (element, callback) {
    const checkInterval = 100; 
    let attempts = 0;
    const maxAttempts = 50;

    const checkElements = () => {
      const availableElement = document.querySelector(element);

      if (availableElement) {
        console.log('Elements are loaded');
        callback();
        clearInterval(interval);
      } else {
        attempts++;
        if (attempts >= maxAttempts) {
          console.log('Max attempts reached, elements not loaded.');
          clearInterval(interval);
        }
      }
    };

    const interval = setInterval(checkElements, checkInterval);
  },
  createTabs: function () {
    const ul = $('<ul class="nav nav-tabs bg-white" role="tablist"></ul>');
    let i = 0;

    $('#content > div.container-fluid.py-4.px-4 > h2').addClass('text-white');
    $('#mod_form > div').prepend('<div class="tab-content" id="myTabContent"></div>');

    $('#content fieldset').each(function () {
      const title = $(this).find('h2').text().trim();
      if (!title) return;

      $(this).attr('id', `fieldset_${i}`);
      $(this).addClass('bg-white p-4 tab-pane fade show' + (i === 0 ? ' active' : ''));
      $(this).attr('role', 'tabpanel');
      $(this).find('.form-row').addClass('mt-3 bg-gray-100 p-3');
      $(this).appendTo('.tab-content');

      ul.append(`<li class="nav-item" role="presentation" style="order: 0;"><a class="nav-link${i === 0 ? ' active' : ''}" data-bs-toggle="tab" data-bs-target="#fieldset_${i}" aria-selected="true" role="button">${title}</a></li>`);
      i++;
    });

    $('#mod_form > div').prepend(ul);
  },
  updateSubmitRow: function () {
    $('.submit-row').addClass('d-flex mt-4 flex-row-reverse');
    $('.submit-row input[type=submit]').addClass('me-2 btn btn-primary');
    $('.submit-row a').addClass('me-auto btn btn-warning');
  }
};

export default ChangeForm