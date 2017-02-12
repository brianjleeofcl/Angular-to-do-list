(function() {
  'use strict';

  angular.module('app').component('navigation', {
    controller, templateUrl:'assets/js/app/list/navigation.template.html'
  })

  controller.$inject = ['$mdSidenav']
  function controller($mdSidenav) {
    const vm = this

    vm.showSidenav = (navId) => {
        $mdSidenav(navId).toggle()
    }
  }
})();
