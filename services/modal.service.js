(function () {
    'use strict';

    angular
        .module('app')
        .factory('ModalService', Service);

    function Service() {
        var modals = [];
        var service = {};

        var nb_of_opened = 0;

        service.Add = Add;
        service.Remove = Remove;
        service.Open = Open;
        service.Close = Close;
        service.NbOfOpened = NbOfOpened;

        return service;

        function Add(modal) {
            // add modal to array of active modals
            modals.push(modal);
        }

        function Remove(id) {
            // remove modal from array of active modals
            var modalToRemove = _.findWhere(modals, { id: id });
            modals = _.without(modals, modalToRemove);
        }

        function Open(id) {
            // open modal specified by id
            var modal = _.findWhere(modals, { id: id });
            modal.open();
            nb_of_opened++;
        }

        function Close(id) {
            // close modal specified by id
            var modal = _.findWhere(modals, { id: id });
            modal.close();
            nb_of_opened--;
        }

        //Ajouté
        function NbOfOpened() {
            return nb_of_opened;
        }
    }
    
})();