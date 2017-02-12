(function() {
  'use strict';

  angular.module('app').component('newTask', {
    controller, templateUrl:'assets/js/app/list/new-task.template.html', bindings: {

    }
  })

  controller.$inject = []
  function controller() {
    const vm = this
    vm.toggleTagField = () => {
      vm.tagFieldVisible = !vm.tagFieldVisible
    }
  }
})();
