(function() {
  'use strict';

  angular.module('app').component('sidenav', {
    controller, templateUrl:'assets/js/app/list/sidenav.template.html', bindings: {tasks:'='}
  })

  controller.$inject = ['userService', 'authService', 'tagService', 'taskService', '$state']
  function controller(uS, aS, tagS, taskS, $state) {
    const vm = this

    vm.$onInit = () => {
      uS.getUserInfo().then((res) => {
        vm.user = res.data
      })
      tagS.getTags().then(res => {
        vm.tags = res.data
      })
    }

    vm.logout = () => {
      aS.delToken().then((res) => {
        $state.go('login')
      })
    }
  }
})();
