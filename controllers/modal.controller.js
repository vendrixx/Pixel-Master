(function () {
    'use strict';

    angular
        .module('app')
        .controller('Controllers.ModalController', Controller);

    function Controller(ModalService, $scope) {
        var vm = this;

        vm.openModal = openModal;
        vm.closeModal = closeModal;
        vm.evaluation = evaluation;
        vm.success = success;
        vm.fail = fail;
        vm.alreadyFound = alreadyFound;

        initController();

        function initController() {
            vm.bodyText = 'This text can be sd,vl.....';
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

        //fonction appelée quand la touche entrée est pressée
        function evaluation() {
            var gamesList = ["dead space", "gta", "battlefield", "remember me", "tomb raider", "bioshock", "assassin's creed",
                            "devil may cry", "the last of us", "call of duty", "saints row", "sim city", "metro", "bloodborne"];
            // si le jeu à déjà été touvé
            if(vm.gamesFoundList.includes(vm.gameName.toLowerCase())) {
                vm.alreadyFound();
            } else {
                // sinon on verifie si le jeu est dans la liste ou non
                if(gamesList.includes(vm.gameName)) {
                    vm.success();
                } else {
                    vm.fail();
                }
            }
            angular.element('#game_name').focus().blur();             
        }

        //fonction appelée lorsqu'un jeu est bien deviné
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
        }

        //fonction appelée lorsqu'un jeu n'est pas bien deviné
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

        //fonction appelée lorsque le joueur tape le nom d'un jeu qu'il a déjà trouvé
        function alreadyFound() {
            console.log("Jeu déjà trouvé"); // on l'indique au joueur
            ModalService.Close('custom-modal-2'); // et on ferme la fenetre de saisie
            vm.gameName = "";
            ModalService.Open('games-already-found');
            document.getElementById("games-found").style.zIndex = "1000";
        }

        //fonction qui affiche le score sur 4 chiffres (ex: 0 s'affiche 0000)
        function formatNumberLength(num, length) {
            var r = "" + num;
            while(r.length < length) {
                r = "0" + r;
            }
            return r;
        }

        //fonction de mise à jour du score
        function updateScore(score) {
            vm.score = vm.score + score;
            if(vm.score < 0) {
                vm.score = 0;
            }
            vm.scoreDisplay = formatNumberLength(vm.score, 4);
        }


        //fonction qui associe le nom du jeu à une image
        function findLinkedImage() {
            vm.gameNameImage = vm.gameName.toLowerCase().split(' ').join('_');
        }

        
    }

})();