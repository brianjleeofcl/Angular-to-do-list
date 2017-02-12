(function() {
  'use strict';

  angular.module('app').component('list', {
    controller, templateUrl:'assets/js/app/list/list.template.html', bindings:{
      tasks: '='
    }
  })

  controller.$inject = ['taskService']
  function controller(tS) {
    const vm = this;

    vm.$onInit = () => {
      console.log(vm.tasks);
    }

    vm.complete = (task) => {
      const now = new Date()
      tS.updateTask({ id: task.id, completedAt: now }).then(res => {
        task.completedAt = now
      })
    }
  }
})();
