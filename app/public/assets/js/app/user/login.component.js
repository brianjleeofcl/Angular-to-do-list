(function() {
  'use strict';

  angular.module('app').component('login', {
    controller, templateUrl: 'assets/js/app/user/login.template.html'
  })

  controller.$inject = ['authService', '$state']
  function controller(aS, $state) {

    const vm = this

    vm.login = (e, obj) => {
      e.preventDefault()
      aS.getToken(obj).then((res) => {
        return aS.checkToken()
      }).then((res) => {
        if (res.data) {
          $state.go('list')
        }
      })
    }

    
  }
})();
