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
            .state('game', {
                url: '/game',
                templateUrl: 'partials/game.view.html',
                controller: 'Controllers.GameController',
                controllerAs: 'vm'
            })
            .state('menu', {
                url: '/menu',
                templateUrl: 'partials/menu.view.html',
                controller: 'WelcomeCtrl',
                controllerAs: 'vm'
            })
            .state('home', {
                url: '/',
                templateUrl: 'partials/home.view.html'/*,
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