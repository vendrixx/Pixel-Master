(function () {
    'use strict';

    angular
        .module('app')
        .service('AuthService', ['$location', '$firebaseAuth', function($location, $firebaseAuth){
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
        }]);

}());