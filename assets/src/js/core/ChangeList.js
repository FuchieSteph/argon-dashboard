const ChangeList = {
  init: function () {
        this.updateBase();
        this.convertDetailsToSelect2();
        this.handleSelect2Change();
        this.modifyObjectTools();
        this.modifyChangelistSearch();
        this.modifyResultsTable();
        this.addClickToTableRows();
        this.bindQuickActionButtons();
        this.modifyCheckboxes();
        this.bindConfirmButton();
    },

    updateBase: function() {
        $('#content-main').wrap('<div class="d-md-flex"></div>')
        $('#content-main').addClass('flex-grow-1 main card p-3')
        $('#changelist-filter').wrap('<div id="filters-wrapper" class="p-3 px-md-3 w-md-15"></div>').addClass('card p-3')
        $('#content-main').after($('#filters-wrapper'))
    },

    convertDetailsToSelect2: function () {
        $('details').each(function (index, element) {
            const filterTitle = $(element).attr('data-filter-title');
            const html = $('<select class="select2" name="' + filterTitle + '"></select>');

            $(element).addClass('mt-2').find('ul li').each(function (index, option) {
                const optionUrl = option.querySelector('a').getAttribute('href');
                const optionLabel = option.querySelector('a').textContent;
                html.append('<option value="' + optionUrl + '">' + optionLabel + '</option>');
            });

            $(element).html('').append('<summary class="text-uppercase fw-bold">' + filterTitle + '</summary>').append(html);
        });

        $('.select2').select2({theme: 'bootstrap-5'});
    },

    handleSelect2Change: function () {
        $('.select2').on('select2:select', function () {
            console.log(this);
            window.location.href = this.value;
        });
    },

    modifyObjectTools: function () {
        $('.object-tools li a').each(function () {
            const $link = $(this);
            $('#filters_block').append(
                $('<div class="dt-action-buttons text-xl-end text-lg-start text-md-end text-start mt-md-0 mt-3 mb-3 mb-md-0"><div class="dt-buttons btn-group flex-wrap"></div></div>')
                    .find('.dt-buttons')
                    .append(
                        $('<a>')
                            .attr('href', $link.attr('href'))
                            .addClass('btn btn-secondary btn-primary')
                            .attr('tabindex', '0')
                            .attr('aria-controls', 'DataTables_Table_0')
                            .attr('type', 'button')
                            .append($('<span><i class="bx bx-plus me-md-1"></i><span class="d-md-inline-block d-none">' + $link.text() + '</span></span>'))
                    )
                    .end()
            );
            $link.parent().remove();
        });
    },

    modifyChangelistSearch: function () {
        const $searchDiv = $('#changelist-search div');
        $searchDiv.addClass('input-group d-flex align-items-center');
        $searchDiv.find('input[type=text]').addClass('form-control');
        $searchDiv.find('input[type=submit]').addClass('btn btn-outline-primary mb-0 me-2');
        $searchDiv.find('label').remove();
        $('#filters_block').append($('#changelist-search'));
    },

    modifyResultsTable: function () {
        $('#result_list').addClass('table table-striped mb-0 table align-items-center');
        $('.actions select').addClass('form-select');
        $('.actions button').addClass('btn btn-primary me-2');
        $('#cta_block').append($('.actions'));
        $('.paginator').addClass('pagination').find('a').wrap('<div class="page-item me-2"></div>').addClass('page-link');
        $('.pagination span').wrap('<div class="page-item active me-2"></div>').addClass('page-link');
        $(".results td, .results th").addClass('text-sm font-weight-bold mb-0');
        $(".results th").addClass('text-uppercase');
        $('table:has(.tree-node)').addClass('mptt-table').removeClass('table-striped')
        $('div[style*="text-indent:0px"]').closest('tr').addClass('mptt-parent')
    },

    addClickToTableRows: function () {
        if ($("table tr").length > 0) {
            $("table tr").click(function (e) {
                if ($(e.target).is(':checkbox')) return;
                $(this).find(':checkbox').click();
            });
        }
    },

    bindQuickActionButtons: function () {
        $('.quick-action-button').on('click', function (event) {
            const template = $(this).data('template');
            const url = $(this).data('url');
            const that = $(this);

            if (!that.hasClass('data-loaded')) {
                $.get(template, function (data) {
                    that.parent().append($(data));
                    that.parent().find('#confirmButton').attr('data-url', url);
                    that.addClass('data-loaded');
                    that.next('.dropdown-menu').dropdown('toggle');
                }).fail(function (xhr, status, error) {
                    console.error('Error fetching template:', error);
                });
            } else {
                that.next('.dropdown-menu').dropdown('toggle');
            }
        });
    },

    modifyCheckboxes: function () {
        $('input[type=checkbox]').addClass('form-check-input').wrap('<div class="form-check"></div>');
    },

    bindConfirmButton: function () {
        const that = this;

        $(document).on('click', '#confirmButton', function (event) {
            event.preventDefault();
            const parentDiv = $(this).closest('.dropdown-menu');
            const url = $(this).data('url');
            const formData = {};

            parentDiv.find('input, select').each(function () {
                const inputName = $(this).attr('name');
                const inputValue = $(this).val();
                formData[inputName] = inputValue;
            });

            const selectedIds = [];
            $('tbody tr.selected').each(function () {
                const id = $(this).find('.action-checkbox input').val();
                selectedIds.push(id);
            });
            formData['selected_ids'] = selectedIds;

            const activeToggleBtn = parentDiv.find('.toggle-button.active');
            const toggleValue = activeToggleBtn.data('toggle');
            formData['toggle_value'] = toggleValue;

            $.ajax({
                url: url,
                type: 'POST',
                data: formData,
                success: function (response) {
                    window.location.reload();
                },
                error: function (xhr, status, error) {
                    console.error(error);
                },
                headers: {
                    "X-CSRFToken": that.getCookie('csrftoken')
                }
            });
        });
    },
    getCookie: function(name) {
            let value = '; ' + document.cookie,
                parts = value.split('; ' + name + '=');
            if (parts.length === 2) return parts.pop().split(';').shift();
    }
};

export default ChangeList