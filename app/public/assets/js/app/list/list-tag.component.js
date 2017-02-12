(function() {
  'use strict';

  angular.module('app').component('listTag', {
    controller, templateUrl: 'assets/js/app/list/list.template.html'
  })

  controller.$inject = ['tagService', '$stateParams']

  function controller(tS, $sP) {
    const vm = this
    vm.$onInit = () => {
      tS.getTasks($sP.id).then(res => {
        vm.data = res.data
        vm.tasks = vm.data.tasks
      })
    }
  }
})();
