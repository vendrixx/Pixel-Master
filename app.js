(function () {
    'use strict';

    angular
        .module('app', ['ui.router'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        // app routes
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'partials/index.view.html',
                controller: 'Controllers.ModalController',
                controllerAs: 'vm'
            })
            .state('game', {
                url: '/',
                templateUrl: 'partials/index.view.html',
                controller: 'Controllers.GameController',
                controllerAs: 'vm'
            });
    }

    function run() {
    }
})();