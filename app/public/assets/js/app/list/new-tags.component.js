(function() {
  'use strict';

  angular.module('app').component('newTags', {
    controller, templateUrl:'assets/js/app/list/new-tags.template.html', bindings: {
      tags: '='
    }
  })

  function controller() {
    const vm = this
    vm.$onInit = () => {
      vm.tags = []
    }
  }
})();
