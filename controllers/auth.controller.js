(function() {
    'use strict';

    angular.module('app')

    .controller('Controllers.AuthController', ['$scope', '$firebaseAuth', '$location', 'AuthService', function($scope, $firebaseAuth, $location, AuthService){

        $scope.username = AuthService.getUser();

        if($scope.username){
            $location.path('/game');
            console.log("User name = " + $scope.username);
        }

        $scope.signIn = function(){
            var username = $scope.user.email;
            var password = $scope.user.password;
            var auth = $firebaseAuth();

            auth.$signInWithEmailAndPassword(username, password).then(function(){
                console.log("User Login Successful");
                AuthService.setUser($scope.user.email);
                $location.path('/game');
                console.log("Yeah");
            }).catch(function(error){
                $scope.errMsg = true;
                $scope.errorMessage = error.message;
            });
        }

    }])


}());