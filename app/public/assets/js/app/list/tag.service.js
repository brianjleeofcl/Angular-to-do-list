(function() {
  'use strict';
  angular.module('app').service('tagService', tagService)

  tagService.$inject = ['$http']
  function tagService($http) {
    this.getTags = () => {
      return $http.get('/api/tags')
    }
    
    this.getTasks = (id) => {
      return $http.get(`/api/tag/${id}`)
    }
  }
})();
