(function() {
  'use strict';

  angular.module('app').service('authService', authService)

  authService.$inject = ['$http']

  function authService($http) {
    this.checkToken = () => {
      return $http.get('/api/token')
    }

    this.getToken = (obj) => {
      return $http.post('/api/token', obj)
    }

    this.delToken = () => {
      return $http.delete('/api/token')
    }
  }
})();
