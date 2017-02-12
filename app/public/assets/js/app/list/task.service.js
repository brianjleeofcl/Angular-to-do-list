(function() {
  'use strict';

  angular.module('app').service('taskService', taskService)

  taskService.$inject = ['$http']
  function taskService($http) {
    this.getTasks = () => {
      return $http.get('/api/list')
    }

    this.updateTask = (obj) => {
      return $http.patch('/api/task', obj)
    }
  }
})();
