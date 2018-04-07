(function () {
    'use strict';
 
    angular
        .module('app')
        .directive('type', Directive);
 
    function Directive(ModalService) {
        return {
            link: function(scope, element, attrs, controller) {
                element.bind("keydown", function(event) { // lie les évenements keydown à une fonction
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
            },
        }
    };

    
})();