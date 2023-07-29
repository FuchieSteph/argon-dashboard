const BreadCrumbs = {
  init: function () {
        this.modifyBreadcrumbs();
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

export default BreadCrumbs