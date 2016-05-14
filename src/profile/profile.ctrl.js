/**
 * Created by lienmergan on 09/05/16.
 */

;(function () {
    'use strict';

    angular.module('app.profile')
        .controller('ProfileCtrl', ProfileCtrl);

    // Inject dependencies into constructor (needed when JS minification is applied).
    ProfileCtrl.$inject = [
        // Angular
        '$log',
        '$state',
        '$scope'
        // Custom

    ];

    function ProfileCtrl(
        // Angular
        $log,
        $state,
        $scope
        // Custom
    ) {
        // ViewModel
        // =========
        var vm = this;

        vm.title = 'Kies uw profiel';
    }
})();
