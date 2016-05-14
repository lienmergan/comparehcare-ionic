/**
 * Created by lienmergan on 06/05/16.
 */

;(function () {
    'use strict';

    angular.module('app.home')
        .factory('CitiesResourceFactory', CitiesResourceFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    CitiesResourceFactory.$inject = [
        // Angular
        '$resource',
        // Custom
        'UriFactory'
    ];

    function CitiesResourceFactory(
        // Angular
        $resource,
        // Custom
        UriFactory
    ) {
        var url = UriFactory.getApi('/cities');

        var paramDefaults = {
            format : 'json'
        };

        var actions = {
            'get': {
                method: 'GET',
                isArray: false
            }
        };


        return $resource(url, actions, paramDefaults);
    }
})();
