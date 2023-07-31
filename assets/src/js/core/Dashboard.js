const Dashboard = {
  init: function () {
        this.updateBase();
        this.modifyResultsTable();
    },

    updateBase: function() {
        $('#content > .container-fluid').addClass('d-md-flex')
        $('#content-main').addClass('flex-grow-1').prepend($('<div class="d-md-flex flex-wrap" id="dashboard-wrapper"></div>'));
        $('#content-main .module').addClass('w-100 w-md-25 p-2').appendTo('#dashboard-wrapper')
        $('#content-main').addClass('main card p-3')
        $('#content-related').addClass('px-3')
        $('#content-related .module').addClass('card p-3')
    },
    modifyResultsTable: function () {
        $('#content-main table').addClass('table table-striped caption-top')
    },
};

export default Dashboard