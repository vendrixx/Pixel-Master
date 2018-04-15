(function() {
    'use strict';

    angular.module('app')

    .controller('WelcomeCtrl', ['$scope', 'AuthService', '$firebaseArray', '$firebaseObject', '$location', function($scope, AuthService, $firebaseArray, $firebaseObject, $location){
        $scope.username = AuthService.getUser();

        if($scope.username == null) {
            $scope.username = "Anonyme";
            document.getElementById("menu-connected").style.display = 'none';
        } else {
            document.getElementById("menu-not-connected").style.display = 'none';
        }


        if(!$scope.username){
            //$location.path('/log');
        }

        var ref = firebase.database().ref().child('games');
        $scope.articles = $firebaseArray(ref);	


        $scope.logout = function(){
            AuthService.logoutUser();
        }
    }])
}());