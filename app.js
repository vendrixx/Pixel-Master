(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'firebase'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        // app routes
        $stateProvider
            .state('principal', {
                url: '/principal',
                templateUrl: 'partials/index.view.html',
                controller: 'Controllers.GameController',
                controllerAs: 'vm'
            })
            .state('test-page', {
                url: '/test-page',
                templateUrl: 'partials/test-page.html',
                controller: 'Controllers.AuthController',
                controllerAs: 'vm'
            })
            .state('welcome', {
                url: '/welcome',
                templateUrl: 'partials/welcome.html',
                controller: 'WelcomeCtrl',
                controllerAs: 'vm'
            })
            .state('home', {
                url: '/',
                templateUrl: 'partials/home.html'/*,
                controller: 'Controllers.AuthController',
                controllerAs: 'vm'*/
            })
            .state('log', {
                url: '/log',
                templateUrl: 'partials/log.view.html',
                controller: 'Controllers.AuthController',
                controllerAs: 'vm'
            });
    }

    function run() {
    }
})();