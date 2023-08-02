const ChangeForm = {
  init: function () {
    this.formatInputs();
    this.formatInlines();
    this.createTabs();
    this.collapseInlines();
    this.updateSubmitRow();
    this.waitForSelectorToLoad('.selector-available', () => {
      this.addClassSelector();
    });
  },
  formatInputs: function() {
    $('form fieldset:not(.inline-related fieldset)').addClass('p-4 mb-3')
    $('form .related-widget-wrapper').addClass('ms-2 flex-grow-1')
    $('form input:not([type="checkbox"]), form textarea, form select').addClass('form-control ms-2');
    $('form input[type="checkbox"]').addClass('form-check-input').wrap('<div class="form-check my-auto"></div>');
    $('form label').addClass('form-label');
    $('form .form-check label').addClass('form-check-label');
    $('form .form-check').addClass('form-check');
    $('select').select2({ width: '100%' });
  },
  formatInlines: function() {
    $('h3').addClass('fs-5 d-flex bg-gray-200 p-2 mt-2')
    $('h3 .delete, span:has(.inline-deletelink').addClass('ms-auto')
    $('.inline-related fieldset').addClass('mb-3')
    $('.flex-container').addClass('d-block d-md-flex')
    $('.inline-related').addClass('mb-4')
    $('.delete').addClass('d-flex align-items-center')
  },
  collapseInlines: function() {
    let i = 0;
    $('.inline-related').each(function() {
        let id = 'inline_' + i

        $(this).find('h3')
          .attr('data-bs-toggle', "collapse")
          .attr('data-bs-target', "#"+id)
          .attr('role', 'button')
          .attr('aria-expanded', i == 0 ? 'true' : 'false')
          .attr('aria-controls', id)

        $(this).find('fieldset')
          .addClass('collapse' + (i === 0 ? ' show' : ''))
          .attr('id', id)
        
          i += 1
    });
  },
  addClassSelector: function () {
    $('.selector-available, .selector-chosen').addClass('p-3 border');
    $('.selector select, .selector input').addClass('form-control');
    $('.selector-remove').html("<i class='bx bxs-left-arrow-circle' ></i>")
    $('.selector-add').html("<i class='bx bxs-right-arrow-circle' ></i>")
    $('.inline-related table').wrap('<div class="bg-gray-100 p-2"></div>')
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
      
      $(this).addClass('bg-white p-4');
      $(this).find('.form-row').addClass('mt-3 bg-gray-100 p-3');
  
      if (!title) {
        return;
      }

      $(this).attr('id', `fieldset_${i}`);
      $(this).addClass('tab-pane show' + (i === 0 ? ' active' : ''));
      $(this).attr('role', 'tabpanel');
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