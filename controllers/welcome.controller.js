(function() {
    'use strict';

    angular.module('app')

    .controller('WelcomeCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', '$location', function($scope, CommonProp, $firebaseArray, $firebaseObject, $location){
        $scope.username = CommonProp.getUser();

        if(!$scope.username){
            //$location.path('/test-page.html');
        }

        var ref = firebase.database().ref().child('games');
        $scope.articles = $firebaseArray(ref);	


        $scope.logout = function(){
            CommonProp.logoutUser();
        }
    }])
}());