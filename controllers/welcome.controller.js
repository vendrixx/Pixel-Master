(function() {
    'use strict';

    angular.module('app')

    .controller('WelcomeCtrl', ['$scope', 'AuthService', '$firebaseArray', '$firebaseObject', '$location', function($scope, AuthService, $firebaseArray, $firebaseObject, $location){
        $scope.username = AuthService.getUser();

        if(!$scope.username){
            $location.path('/log');
        }

        var ref = firebase.database().ref().child('games');
        $scope.articles = $firebaseArray(ref);	


        $scope.logout = function(){
            AuthService.logoutUser();
        }
    }])
}());