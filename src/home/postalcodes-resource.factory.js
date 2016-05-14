/**
 * Created by lienmergan on 24/04/16.
 */

;(function () {
    'use strict';

    angular.module('app.home')
        .factory('PostalcodesResourceFactory', PostalcodesResourceFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    PostalcodesResourceFactory.$inject = [
        // Angular
        '$resource',
        // Custom
        'UriFactory'
    ];

    function PostalcodesResourceFactory(
        // Angular
        $resource,
        // Custom
        UriFactory
    ) {
        var url = UriFactory.getApi('/postalcodes');

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
