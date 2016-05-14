/**
 * Created by lienmergan on 23/04/16.
 */

;(function () {
    'use strict';

    angular.module('app.home')
        .controller('HomeCtrl', HomeCtrl);

    // Inject dependencies into constructor (needed when JS minification is applied).
    HomeCtrl.$inject = [
        // Angular
        '$log',
        '$state',
        '$scope',
        // Custom
        'PostalcodesResourceFactory',
        'CitiesResourceFactory'
    ];

    function HomeCtrl(
        // Angular
        $log,
        $state,
        $scope,
        // Custom
        PostalcodesResourceFactory,
        CitiesResourceFactory
    ) {
        // ViewModel
        // =========
        var vm = this;

        vm.title = 'Home';
        vm.cities = getCities();
        vm.postalcodes = getPostalcodes();

        // Functions
        // ----------
        function getPostalcodes() {
          return PostalcodesResourceFactory.query();
        }

        function getCities() {
          return CitiesResourceFactory.query();
        }
    }
})();
