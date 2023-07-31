import ChangeList from './core/ChangeList.js'
import ChangeForm from './core/ChangeForm.js'
import BreadCrumbs from './core/BreadCrumbs.js'
import Dashboard from './core/Dashboard.js'

window.BootstrapAdmin = {
  intialized: false,
  init: function (config) {
    console.info('Bootstrap Admin:', 'init')

    this.initialized = true
    const page = this.page()
    console.info('Bootstrap Admin:', `detected page ${page}`)
    $('body').addClass('page-' + page)
    
    BreadCrumbs.init()

    if (page === 'changelist') {
      ChangeList.init(config)
    } else if (page === 'add_form' || page === 'change_form') {
      ChangeForm.init(config)
    } else if (page === 'dashboard') {
      Dashboard.init(config)
    } 

    console.info('Bootstrap Admin:', 'ready')
  },
  page: function () {
    if (/^(\/[a-z]{2})?\/admin\/$/.test(location.pathname)) {
      return 'dashboard'
    } else if (/^(\/[a-z]{2})?\/admin\/doc\//.test(location.pathname)) {
      return 'admindocs'
    } else if (/^(\/[a-z]{2})?\/admin\/login\/$/.test(location.pathname)) {
      return 'login'
    } else if (/^(\/[a-z]{2})?\/admin\/logout\/$/.test(location.pathname)) {
      return 'logout'
    } else if (/^(\/[a-z]{2})?\/admin\/password_change\/$/.test(location.pathname)) {
      return 'password_change'
    } else if (/^(\/[a-z]{2})?\/admin\/password_change\/done\/$/.test(location.pathname)) {
      return 'password_change_success'
    } else if (/\/add\//.test(location.pathname)) {
      return 'add_form'
    } else if (/\/change\//.test(location.pathname)) {
      return 'change_form'
    } else if (document.getElementById('changelist')) {
      return 'changelist'
    } else if (document.getElementById('change-history') || /^(\/[a-z]{2})?\/admin\/[^/]+\/[^/]+\/[^/]+\/history/.test(location.pathname)) {
      return 'changehistory'
    } else if (/\/filer\//.test(location.pathname)) {
      return 'filer'
    } else {
      return 'default'
    }
  },
}

window.jQuery = jQuery