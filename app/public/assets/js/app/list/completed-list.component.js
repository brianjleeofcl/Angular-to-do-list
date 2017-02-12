(function() {
  'use strict';

  angular.module('app').component('completedList', {
    controller, templateUrl:'assets/js/app/list/completed-list.template.html', bindings: { tasks: '='}
  })

  controller.$inject = ['taskService']
  function controller(tS) {
    const vm = this
    vm.incomplete = (task) => {
      tS.updateTask({ id: task.id, completedAt: null }).then(res => {
        task.completedAt = null
      })
    }
  }
})();
