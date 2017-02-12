(function() {
  'use strict';

  angular.module('app').config(config)

  config.$inject =['$stateProvider', '$urlRouterProvider', '$locationProvider'];

  function config($sp, $urp, $lp) {
    $lp.html5Mode(true)
    $sp.state({
      name: 'app',
      abstract: true,
      template: `<main layout="column" class="full-height"><navigation></navigation><ui-view flex="100"></ui-view></main>`,
      resolve: {
        resUser: authenticateUser
      }
    }).state({
      name: 'app.sidenav',
      abstract: true,
      resolve: {
        tasks: getTasks
      },
      component:'sidenav'
    }).state({
      name: 'list',
      parent: 'app.sidenav',
      url: '/',
      component: 'list'
    }).state({
      name: 'completed',
      parent: 'app.sidenav',
      url: '/completed',
      component: 'completedList'
    }).state({
      name: 'tag',
      parent: 'app.sidenav',
      url: '/tag/{id}',
      component: 'listTag'
    }).state({
      name: 'login',
      url: '/login',
      component: 'login'
    }).state({
      name: 'signup',
      url: '/signup',
      component: 'signup'
    })
  }

  authenticateUser.$inject = ['$state', 'authService']
  function authenticateUser($state, aS) {
    return aS.checkToken().then((res) => {
      if (!res.data) {
        $state.go('login')
      }
    })
  }

  getTasks.$inject = ['taskService']
  function getTasks(tS) {
    return tS.getTasks().then(res => res.data)
  }
})();
