const ChangeList = {
  init: function () {
        this.convertDetailsToSelect2();
        this.handleSelect2Change();
        this.modifyObjectTools();
        this.modifyChangelistSearch();
        this.modifyResultsTable();
        this.addClickToTableRows();
        this.modifyBreadcrumbs();
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

        $('.select2').select2();
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
        $('.field-thumbnail').addClass('w-25');
        $(".results td, .results th").addClass('text-sm font-weight-bold mb-0');
        $(".results th").addClass('text-uppercase');

        if ($("table tr").length > 0) {
            $("table tr").click(function (e) {
                if ($(e.target).is(':checkbox')) return; // Ignore when clicking on the checkbox
                $(this).find(':checkbox').click();
            });
        }
    },

    addClickToTableRows: function () {
        if ($("table tr").length > 0) {
            $("table tr").click(function (e) {
                if ($(e.target).is(':checkbox')) return; // Ignore when clicking on the checkbox
                $(this).find(':checkbox').click();
            });
        }
    },

    modifyBreadcrumbs: function () {
        $('.breadcrumb-container').prepend('<ol class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5"></ol>');
        $('.breadcrumbs a').addClass('opacity-5 text-white').wrap('<li class="breadcrumb-item text-sm text-white"></li>');
        $('.breadcrumbs')
            .contents()
            .filter(function () {
                return this.nodeType == 3 && $.trim(this.textContent).length > 3;
            })
            .wrap('<li class="breadcrumb-item text-sm text-white active"></li>');

        $('.breadcrumb-container .breadcrumb').append($('.breadcrumbs li'));
    },
};

export default ChangeList