(function() {
  'use strict';

  angular.module('app').component('completedTask', {
    controller, templateUrl:'assets/js/app/list/completed-task.template.html', bindings: {
      taskName: '<',
      completedAt: '<',
      tags: '<',
      taskId: '<',
      incomplete: '&'
    }
  })

  function controller() {
    const vm = this
    vm.$onInit = () => {
      vm.check = true
    }
    vm.undoTask = (id) => {
      vm.incomplete({ id })
    }
  }
})();
