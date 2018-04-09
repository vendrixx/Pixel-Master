/* Anciennement ModalController, c'est ici que la logique du jeu est implémentée. Ce controllers est relié à la page principale de l'appli */

(function () {
    'use strict';

    var config = {
        apiKey: "AIzaSyBbGMkSzB1recBMVOAz9hK4WGUS1Hukzco",
        authDomain: "pixel-master.firebaseapp.com",
        databaseURL: "https://pixel-master.firebaseio.com",
        projectId: "pixel-master",
        storageBucket: "pixel-master.appspot.com",
        messagingSenderId: "181134963224"
    };
    firebase.initializeApp(config);

    angular
        .module('app')
        .controller('Controllers.GameController', Controller);

function Controller(ModalService, $scope, $firebaseArray/*, $firebaseSimpleLogin*/) {
        var vm = this;

        vm.openModal = openModal;
        vm.closeModal = closeModal;
        vm.evaluation = evaluation;
        vm.success = success;
        vm.fail = fail;
        vm.alreadyFound = alreadyFound;

        vm.register = register;
        vm.login = login;
        vm.logout = logout;
        vm.isLoggedIn = isLoggedIn;
        vm.sendWelcomeEmail = sendWelcomeEmail;

        initController();


        var ref = firebase.database().ref().child('games');
        this.games = $firebaseArray(ref);

        this.games.$ref().once('value', function(snap) {
            angular.forEach(snap.val(), function(index) {
                vm.gamesList.push(index.name);
                //console.log(vm.gameList);

            });
        });
        console.log(this.games);


        /* Test authentification firebase */
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
        /*var firebaseObj = new Firebase("");
        $scope.SignIn = function($scope) {
            var username = $scope.user.email;
            var password = $scope.user.password;
        }*/

        function initController() {
            vm.bodyText = 'This text can be sd,vl.....';
            vm.isInTheList = false;
            vm.gamesList = [];
            vm.gameName = '';
            vm.gameNameImage = '';
            vm.score = 0;
            vm.scoreDisplay = '0000';
            vm.gamesFound = 0;
            vm.gamesFoundDisplay = '00';
            vm.gamesFoundList = [];
            vm.wrongAnswers = 0;
        }
        

        /* Open a modal window which correspond to the given id */
        function openModal(id) {
            ModalService.Open(id);
            /* Directly (without id) -> ModalService.Open('my-custom-modal'); */
        }

        function closeModal(id) {
            ModalService.Close(id);
        }



        /***** Logique du jeu (récupération du nom du jeu entré, mise à jour du score, etc.) *****/

        $('body').bind("keydown", function(event) { // lie les évenements keydown à une fonction
            var keyCode = event.which || event.keyCode;
            
            var inp = String.fromCharCode(keyCode); // transformation du code clavier (int) en string
            // si la touche appuyée est une lettre, un chiffre, un tiret, un underscore ou un espace ET qu'il n'y a pas d'autre modale ouverte
            if (/[a-zA-Z0-9-_ ]/.test(inp) && ModalService.NbOfOpened() < 1) {
                // si la modal de saisie de texte n'est pas encore ouverte
                ModalService.Open('custom-modal-2'); // on l'ouvre    
                // focus sur la zone de saisie de texte
                angular.element('#game_name').focus();
            }
        });

        /**
         * Ce qu'il se passe lorsque le nom d'un jeu est proposé par le joueur
         */
        function evaluation() {
            //var gamesList = ["dead space", "gta", "battlefield", "remember me", "tomb raider", "bioshock", "assassin's creed",
            //                "devil may cry", "the last of us", "call of duty", "saints row", "sim city", "metro", "bloodborne"];
            // si le jeu à déjà été touvé

            mostSimilarGame();

            if(vm.gamesFoundList.includes(vm.gameName)) {
                vm.alreadyFound();
            } else {
                // sinon on verifie si le jeu est dans la liste ou non
                if(vm.isInTheList) {
                    vm.success();
                } else {
                    vm.fail();
                }
            }
            angular.element('#game_name').focus().blur();             
        }

        /**
         * Appelée lorsqu'un jeu est bien deviné
         */
        function success() {
            findLinkedImage();
            console.log(vm.gameName + " fait bien parti de cette image.")
            vm.gamesFoundList.push(vm.gameName);
            console.log("Vous avez déjà trouvés : " + vm.gamesFoundList.toString());
            //mise à jour du score et de nombre de jeu trouvé
            updateScore(20);
            vm.gamesFound++;
            vm.gamesFoundDisplay = formatNumberLength(vm.gamesFound, 2);
            //fermeture de la fenetre de saisie
            ModalService.Close('custom-modal-2');
            //ouverture de la modale de réussite après 2,7 secondes
            ModalService.Open('good-answer');
            setTimeout(function() {
                $scope.$apply(function() {
                    ModalService.Close('good-answer');
                    vm.gameName = "";
                });
            }, 2700);

            //ajout d'un effet de brillance sur le score pour montrer qu'il a changé
            setTimeout(function() {
                $scope.$apply(function() {
                    $('#score_number > span').addClass('glow');
                    $('#nb_found').addClass('glow');
                });
            }, 2700);
            //on retire l'effet de brillance
            setTimeout(function() {
                $scope.$apply(function() {
                    $('#nb_found').removeClass('glow');
                    $('#score_number > span').removeClass('glow');
                });
            }, 3500);

            //affichage du tuto
            setTimeout(function() {
                $scope.$apply(function() {
                    //si le score est de 1 on affiche le 1er tuto
                if(vm.gamesFound == 1) {
                    ModalService.Open('tuto-score');
                    document.getElementById("score").style.zIndex = "1000";
                } else if(vm.gamesFound == 2) {
                    ModalService.Open('tuto-found');
                    document.getElementById("games-found").style.zIndex = "1000";
                }
                });
            }, 4400);
            vm.isInTheList = false;
        }

        /**
         * Appelée lorsqu'un jeu n'est pas bien deviné
         */
        function fail() {
            console.log("Non ce jeu n'est pas présent sur cette image.");
            updateScore(-50);
            vm.wrongAnswers++;
            ModalService.Close('custom-modal-2'); // on ferme la fenetre de saisie
            //ouverture de la modale de mauvaise réponse après 2,7 secondes
            ModalService.Open('glitch-modal');
            setTimeout(function() {
                $scope.$apply(function() {
                    ModalService.Close('glitch-modal');
                    vm.gameName = "";
                });
            }, 2700);
            //les croix qui indiquent le nombre d'erreur sont mise en gras au fur et à mesure
            $("#error > span:nth-child(" + vm.wrongAnswers + ")").addClass('bold');
            setTimeout(function() {
                $scope.$apply(function() {
                    //si le nombre d'erreur est de 3 c'est game over
                    if(vm.wrongAnswers == 3) {
                        ModalService.Open('game-over');
                    }
                });
            }, 3500);
        }

        /**
         * Affiche un message lorsque le joueur tape le nom d'un jeu qu'il a déjà trouvé
         */
        function alreadyFound() {
            console.log("Jeu déjà trouvé"); // on l'indique au joueur
            ModalService.Close('custom-modal-2'); // et on ferme la fenetre de saisie
            vm.gameName = "";
            ModalService.Open('games-already-found');
            document.getElementById("games-found").style.zIndex = "1000";
        }

        /**
         * Fait en sorte que le score s'affiche sur plusieurs chiffres (ex: avec 0 et 4 comme paramètres -> 0000 s'affiche)
         * @param {*} num le nombre de base
         * @param {*} length le nombre de chiffre que l'on veut
         */
        function formatNumberLength(num, length) {
            var r = "" + num;
            while(r.length < length) {
                r = "0" + r;
            }
            return r;
        }

        /**
         * Mise à jour du score
         * @param {*} score le nombre de points à ajouter
         */
        function updateScore(score) {
            vm.score = vm.score + score;
            if(vm.score < 0) {
                vm.score = 0;
            }
            vm.scoreDisplay = formatNumberLength(vm.score, 4);
        }



        /**
         * Associe le nom du jeu à une image (permet de retrouver l'image)
         */
        function findLinkedImage() {
            vm.gameNameImage = vm.gameName.toLowerCase().split(' ').join('_');
        }


        /**
         * Calcul de la distance de Levenshtein (la distance entre 2 chaînes de caractères)
         * @param {*} a première chaîne
         * @param {*} b deuxième chaîne
         */
        function levenshtein_distance_a (a, b) {
            if(a.length == 0) return b.length; 
            if(b.length == 0) return a.length; 
          
            var matrix = [];
          
            // increment along the first column of each row
            var i;
            for(i = 0; i <= b.length; i++){
                 matrix[i] = [i];
            }
          
            // increment each column in the first row
            var j;
            for(j = 0; j <= a.length; j++){
                matrix[0][j] = j;
            }
          
            // Fill in the rest of the matrix
            for(i = 1; i <= b.length; i++){
                for(j = 1; j <= a.length; j++){
                    if(b.charAt(i-1) == a.charAt(j-1)){
                        matrix[i][j] = matrix[i-1][j-1];
                    } else {
                        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                          Math.min(matrix[i][j-1] + 1, // insertion
                                                   matrix[i-1][j] + 1)); // deletion
                    }
                }
            }
          
            return matrix[b.length][a.length];
        }


        /**
         * Cherche le nom du jeu qui s'approche le plus de ce que le joueur à entré
         */
        function mostSimilarGame() {
            var stop = false;
            //parcours de la liste des jeux
            for(var i = 0; i < vm.gamesList.length; i++) {
                //si un jeu similaire à été trouvé on s'arrête
                if(!stop) {
                    //calcul de la distance entre les jeux de la liste et le nom entré par le joueur
                    var distance = levenshtein_distance_a(vm.gameName.toLowerCase(), vm.gamesList[i]);
                    //console.log('Distance = ' + distance);
                    //si la distance est petite (inférieure à 2)
                    if(distance <= 2) {
                        //console.log('Distance inferieure à 2');
                        //console.log('Le nom entré : ' + vm.gameName + ' ressemble à : ' + vm.gamesList[i]);
                        vm.gameName = vm.gamesList[i];
                        vm.isInTheList = true;
                        stop = true;
                    }
                }    
            }
        }

        
    }

})();