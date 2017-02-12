(function() {
  'use strict';

  angular.module('app').service('userService', userService)

  userService.$inject = ['$http']
  function userService($http) {
    this.getUserInfo = () => {
      return $http.get('/api/users')
    }
  }
})();
