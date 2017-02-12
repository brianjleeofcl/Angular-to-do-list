(function() {
  'use strict';

  angular.module('app').component('task', {
    controller, templateUrl:'assets/js/app/list/task.template.html', bindings: {
      taskName: '=',
      tags: '=',
      complete: '&',
      taskId: '<'
    }
  })

  controller.$inject = ['taskService']
  function controller(tS) {
    const vm = this

    vm.completeTask = (id) => {
      vm.complete({ id })
    }
  }
})();
