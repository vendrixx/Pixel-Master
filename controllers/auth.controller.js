/*(function () {
    'use strict';

    angular
        .module('app')
        .controller('Controllers.AuthController', Controller);

function Controller(AuthService, $scope) {
        var vm = this;

        vm.register = register;
        vm.login = login;
        vm.logout = logout;
        vm.isLoggedIn = isLoggedIn;
        vm.sendWelcomeEmail = sendWelcomeEmail;

        initController();

        function initController() {
            vm.bodyText = 'Bla bla bla';
        }
        
        function register(user) {
            AuthService.register(user);
        }
        function login(user) {
            AuthService.login(user);
        }
     
        function logout() {
            AuthService.logout();
        }
     
        function isLoggedIn() {
            AuthService.isLoggedIn();
        }
     
        function sendWelcomeEmail(emailAddress) {
            AuthService.sendWelcomeEmail(emailAddress);
        }

        
    }

})();
*/

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

    /*.service('CommonProp', ['$location', '$firebaseAuth', function($location, $firebaseAuth){
        var user = "";
        var auth = $firebaseAuth();

        return {
            getUser: function(){
                if(user == ""){
                    user = localStorage.getItem("userEmail");
                }
                return user;
            },
            setUser: function(value){
                localStorage.setItem("userEmail", value);
                user = value;
            },
            logoutUser: function(){
                auth.$signOut();
                console.log("Logged Out Succesfully");
                user = "";
                localStorage.removeItem('userEmail');
                $location.path('/');
                console.log("Log out");
            }
        };
    }]);*/

}());