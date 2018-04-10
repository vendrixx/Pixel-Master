(function () {
    'use strict';
 
    angular
        .module('app')
        .directive('modal', Directive);
 
    function Directive(ModalService, $timeout) {
        return {
            link: function (scope, element, attrs) {
                var modalOpen = false; // indique si la modal de saisie de texte est ouverte
                
                // ensure id attribute exists
                if (!attrs.id) {
                    console.error('modal must have an id');
                    return;
                }
 
                // move element to bottom of page (just before </body>) so it can be displayed above everything else
                element.appendTo('body');
 
                // close modal on background click NE MARCHE PAS VRAIMENT
                element.on('click', function (e) {
                    var target = $(e.target);
                    //fermeture au moindre clique sur la modale credits, legal ou glitch
                    var modalToCloseOnClick = ["credits-modal", "legal-modal", "glitch-modal", "tuto-score", "tuto-score-neg", "tuto-found", "games-found-modal"]
                    if(modalToCloseOnClick.includes(attrs.id)) {
                        ModalService.Close(attrs.id);
                    }
                    //des fois ça bug donc on le fait tout le temps pour être sur
                    document.getElementById("score").style.zIndex = "1";
                    document.getElementById("games-found").style.zIndex = "1";
                    document.getElementById("score").style.zIndex = "1";
                    if (!target.closest('.modal-body').length) {
                        scope.$evalAsync(Close);

                        ModalService.Close(attrs.id); // fermeture réelle de la modale (pas comme dans le code de base...)
                        if(attrs.id == "custom-modal-2") {
                            angular.element('#game_name').val(""); //supprime la valeur du champ texte lorsque la fenêtre de saisie est fermée
                        }    
                        if(attrs.id == "tuto-score") {
                            document.getElementById("score").style.zIndex = "1"; //on repasse le z-index à 1 après la fermeture du tuto
                        }
                        if(attrs.id == "tuto-score-neg") {
                            document.getElementById("error").style.zIndex = "1"; //on repasse le z-index à 1 après la fermeture du tuto
                        }
                        if(attrs.id == "tuto-found") {
                            document.getElementById("games-found").style.zIndex = "1"; //on repasse le z-index à 1 après la fermeture du tuto
                        }
                    }
                });
 
                // add self (this modal instance) to the modal service so it's accessible from controllers
                var modal = {
                    id: attrs.id,
                    open: Open,
                    close: Close
                };
                ModalService.Add(modal);
             
                // remove self from modal service when directive is destroyed
                scope.$on('$destroy', function() {
                    ModalService.Remove(attrs.id);
                    element.remove();
                });               
 
                // open modal
                function Open() {
                    element.show();
                    $('body').addClass('modal-open');
                }
 
                // close modal
                function Close() {
                    element.hide();
                    $('body').removeClass('modal-open');
                }

            }
        };
    }
    
})();