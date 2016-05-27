/**
 * @author    Lien Mergan based on example of Olivier Parent
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */

;(function () {
    'use strict';

    // Module declarations
    var app = angular.module('app', [
        'ionic',
        'ngCordova',
        'ngResource',
        'chosen',
        // Modules
        'app.home',
        'app.common',
        'app.database',
        'app.services',
        'app.profile',
        'app.overview'
    ]);
    angular.module('app.home'  , []);
    angular.module('app.common', []);
    angular.module('app.database', []);
    angular.module('app.services', []);
    angular.module('app.profile', []);
    angular.module('chosen', []);
    angular.module('app.overview', []);

    app.run(function($ionicPlatform) {
        $ionicPlatform.ready(whenReady);

        function whenReady() {
            console.log('read');
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs).
            // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
            // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
            // useful especially with forms, though we would prefer giving the user a little more room
            // to interact with the app.
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if (window.StatusBar) {
                // Set the statusbar to use the default style, tweak this to
                // remove the status bar on iOS or change it to use white instead of dark colors.
                StatusBar.styleDefault();
            }
        }

    });

})();

/**
 * @author    Lien Mergan based on an example of Olivier Parent
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */

;(function () {
    'use strict';

    angular.module('app')
        .config(Config);

    // Inject dependencies into constructor (needed when JS minification is applied).
    Config.$inject = [
        // Angular
        '$compileProvider',
        '$httpProvider',
        '$urlRouterProvider'
    ];

    function Config(
        // Angular
        $compileProvider,
        $httpProvider,
        $urlRouterProvider
    ) {
        // Allow 'app:' as protocol (for use in Hybrid Mobile apps)
        $compileProvider
            .aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|app):/)
            .imgSrcSanitizationWhitelist(/^\s*((https?|ftp|file|app):|data:image\/)/)
        ;

        $httpProvider.defaults.headers.common['X-CSRFToken'] = '{{ csrf_token|escapejs }}';

        // Basic Auth
        // var username = 'lienmergan',
        //     password = 'bap.admin',
        //     credentials = window.btoa(username + ':' + password);
        // $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + credentials;

        // Routes
        $urlRouterProvider.otherwise('/');
    }

})();



/**
 * @author    Lien Mergan based on an example of Olivier Parent
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */

;(function () {
    'use strict';

    // var secure = false;

    angular.module('app')
        .constant('config', {
            api: {
                // protocol: secure ? 'https' : 'http',
                protocol: 'https',
                host    : 'bap-comparehcare.herokuapp.com',
                path    : '/www/api'
            }
        });
})();

/**
 * Angucomplete
 * Autocomplete directive for AngularJS
 * By Daryl Rowland
 */

angular.module('angucomplete', [] )
    .directive('angucomplete', function ($parse, $http, $sce, $timeout) {
    return {
        restrict: 'EA',
        scope: {
            "id": "@id",
            "placeholder": "@placeholder",
            "selectedObject": "=selectedobject",
            "url": "@url",
            "dataField": "@datafield",
            "titleField": "@titlefield",
            "descriptionField": "@descriptionfield",
            "imageField": "@imagefield",
            "imageUri": "@imageuri",
            "inputClass": "@inputclass",
            "userPause": "@pause",
            "localData": "=localdata",
            "searchFields": "@searchfields",
            "minLengthUser": "@minlength",
            "matchClass": "@matchclass"
        },
        template: '<div class="angucomplete-holder"><input id="{{id}}_value" ng-model="searchStr" type="text" placeholder="{{placeholder}}" class="{{inputClass}}" onmouseup="this.select();" ng-focus="resetHideResults()" ng-blur="hideResults()" /><div id="{{id}}_dropdown" class="angucomplete-dropdown" ng-if="showDropdown"><div class="angucomplete-searching" ng-show="searching">Searching...</div><div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)">No results found</div><div class="angucomplete-row" ng-repeat="result in results" ng-mousedown="selectResult(result)" ng-mouseover="hoverRow()" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}"><div ng-if="imageField" class="angucomplete-image-holder"><img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="angucomplete-image"/><div ng-if="!result.image && result.image != \'\'" class="angucomplete-image-default"></div></div><div class="angucomplete-title" ng-if="matchClass" ng-bind-html="result.title"></div><div class="angucomplete-title" ng-if="!matchClass">{{ result.title }}</div><div ng-if="result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div></div></div></div>',

        link: function($scope, elem, attrs) {
            $scope.lastSearchTerm = null;
            $scope.currentIndex = null;
            $scope.justChanged = false;
            $scope.searchTimer = null;
            $scope.hideTimer = null;
            $scope.searching = false;
            $scope.pause = 500;
            $scope.minLength = 3;
            $scope.searchStr = null;

            if ($scope.minLengthUser && $scope.minLengthUser != "") {
                $scope.minLength = $scope.minLengthUser;
            }

            if ($scope.userPause) {
                $scope.pause = $scope.userPause;
            }

            isNewSearchNeeded = function(newTerm, oldTerm) {
                return newTerm.length >= $scope.minLength && newTerm != oldTerm
            }

            $scope.processResults = function(responseData, str) {
                if (responseData && responseData.length > 0) {
                    $scope.results = [];

                    var titleFields = [];
                    if ($scope.titleField && $scope.titleField != "") {
                        titleFields = $scope.titleField.split(",");
                    }

                    for (var i = 0; i < responseData.length; i++) {
                        // Get title variables
                        var titleCode = [];

                        for (var t = 0; t < titleFields.length; t++) {
                            titleCode.push(responseData[i][titleFields[t]]);
                        }

                        var description = "";
                        if ($scope.descriptionField) {
                            description = responseData[i][$scope.descriptionField];
                        }

                        var imageUri = "";
                        if ($scope.imageUri) {
                            imageUri = $scope.imageUri;
                        }

                        var image = "";
                        if ($scope.imageField) {
                            image = imageUri + responseData[i][$scope.imageField];
                        }

                        var text = titleCode.join(' ');
                        if ($scope.matchClass) {
                            var re = new RegExp(str, 'i');
                            var strPart = text.match(re)[0];
                            text = $sce.trustAsHtml(text.replace(re, '<span class="'+ $scope.matchClass +'">'+ strPart +'</span>'));
                        }

                        var resultRow = {
                            title: text,
                            description: description,
                            image: image,
                            originalObject: responseData[i]
                        }

                        $scope.results[$scope.results.length] = resultRow;
                    }


                } else {
                    $scope.results = [];
                }
            }

            $scope.searchTimerComplete = function(str) {
                // Begin the search

                if (str.length >= $scope.minLength) {
                    if ($scope.localData) {
                        var searchFields = $scope.searchFields.split(",");

                        var matches = [];

                        for (var i = 0; i < $scope.localData.length; i++) {
                            var match = false;

                            for (var s = 0; s < searchFields.length; s++) {
                                match = match || (typeof $scope.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && $scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                            }

                            if (match) {
                                matches[matches.length] = $scope.localData[i];
                            }
                        }

                        $scope.searching = false;
                        $scope.processResults(matches, str);

                    } else {
                        $http.get($scope.url + str, {}).
                            success(function(responseData, status, headers, config) {
                                $scope.searching = false;
                                $scope.processResults((($scope.dataField) ? responseData[$scope.dataField] : responseData ), str);
                            }).
                            error(function(data, status, headers, config) {
                                console.log("error");
                            });
                    }
                }
            }

            $scope.hideResults = function() {
                $scope.hideTimer = $timeout(function() {
                    $scope.showDropdown = false;
                }, $scope.pause);
            };

            $scope.resetHideResults = function() {
                if($scope.hideTimer) {
                    $timeout.cancel($scope.hideTimer);
                };
            };

            $scope.hoverRow = function(index) {
                $scope.currentIndex = index;
            }

            $scope.keyPressed = function(event) {
                if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                    if (!$scope.searchStr || $scope.searchStr == "") {
                        $scope.showDropdown = false;
                        $scope.lastSearchTerm = null
                    } else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm)) {
                        $scope.lastSearchTerm = $scope.searchStr
                        $scope.showDropdown = true;
                        $scope.currentIndex = -1;
                        $scope.results = [];

                        if ($scope.searchTimer) {
                            $timeout.cancel($scope.searchTimer);
                        }

                        $scope.searching = true;

                        $scope.searchTimer = $timeout(function() {
                            $scope.searchTimerComplete($scope.searchStr);
                        }, $scope.pause);
                    }
                } else {
                    event.preventDefault();
                }
            }

            $scope.selectResult = function(result) {
                if ($scope.matchClass) {
                    result.title = result.title.toString().replace(/(<([^>]+)>)/ig, '');
                }
                $scope.searchStr = $scope.lastSearchTerm = result.title;
                $scope.selectedObject = result;
                $scope.showDropdown = false;
                $scope.results = [];
                //$scope.$apply();
            }

            var inputField = elem.find('input');

            inputField.on('keyup', $scope.keyPressed);

            elem.on("keyup", function (event) {
                if(event.which === 40) {
                    if ($scope.results && ($scope.currentIndex + 1) < $scope.results.length) {
                        $scope.currentIndex ++;
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                    $scope.$apply();
                } else if(event.which == 38) {
                    if ($scope.currentIndex >= 1) {
                        $scope.currentIndex --;
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 13) {
                    if ($scope.results && $scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                        $scope.selectResult($scope.results[$scope.currentIndex]);
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    } else {
                        $scope.results = [];
                        $scope.$apply();
                        event.preventDefault;
                        event.stopPropagation();
                    }

                } else if (event.which == 27) {
                    $scope.results = [];
                    $scope.showDropdown = false;
                    $scope.$apply();
                } else if (event.which == 8) {
                    $scope.selectedObject = null;
                    $scope.$apply();
                }
            });

        }
    };
});


;(function () {
    'use strict';

    angular.module('app.home')
        .directive('chosen', function() {
          var linker = function(scope,element,attr){
            scope.$watch('placeList', function () {
              element.trigger('list:updated');
            });
            element.chosen();
          };

      return {
        restrict:'A',
        link: linker
      }
        });


})();

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

;(function () {
    'use strict';

    angular.module('app.home')
        .factory('CityServiceFactory', CityServiceFactory);

    function CityServiceFactory() {
        var city = {};

        return city;

        // return {
        //   getCityObject: function () {
        //       // city.postalCode = '';
        //       return city;
        //   },
        //   setCityObject: function (cityObject) {
        //       city = cityObject;
        //   }
        // };

        // city.postalCode = '';
    }
})();

/**
 * Created by lienmergan on 23/04/16.
 */

;(function () {
    'use strict';

    angular.module('app.home')
        .config(Routes);

    // Inject dependencies into constructor (needed when JS minification is applied).
    Routes.$inject = [
        // Angular
        '$stateProvider'
    ];

    function Routes(
        // Angular
        $stateProvider
    ) {
        $stateProvider
            .state('home', {
                controller: 'HomeCtrl as vm',
                templateUrl: 'templates/home/home.view.html',
                url: '/'
            });
    }

})();

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
        'CitiesResourceFactory',
        'CityServiceFactory'
    ];

    function HomeCtrl(
        // Angular
        $log,
        $state,
        $scope,
        // Custom
        PostalcodesResourceFactory,
        CitiesResourceFactory,
        CityServiceFactory
    ) {
        // ViewModel
        // =========
        var vm = this;
        var _selected;

        vm.title = 'Home';
        vm.cities = getCities();
        vm.postalcodes = getPostalcodes();
        vm.selectedPostalcodeCity = vm.postalcodes[0];
        CityServiceFactory = [];

        $scope.addPostalcodeCity = function () {
          CityServiceFactory.push({
            code: vm.selectedPostalcodeCity.code});
            $log.info('Gekozen postcode:', CityServiceFactory);
        };


        // CityServiceFactory = vm.selectedPostalcodeCity;
        // $log.info('Gekozen postalcode:', CityServiceFactory);

        // vm.changedValue = function(item) {
        //   vm.selectedItems.push(item.code);
        //   $log.info('Gekozen postcode:', item.code)
        // };


        // $log.info('Gekozen postcode:', vm.selectedPostalcodeCity);

        // vm.showSelectValue = function(selectedPostalcodeCity) {
        //   // var code = selectedPostalcodeCity.code;
        //   $log.info('Gekozen postalcode:', vm.selectedPostalcodeCity.code);
        //   // CityServiceFactory = code;
        // };


        // $scope.input = {};
        // $scope.$watch('input', function (newValue, oldValue) {
        //   if (newValue !== oldValue) CityServiceFactory.setCityObject(newValue);
        // }, true);

        // vm.label = CityServiceFactory;
        // vm.placeList = [];
        // vm.clicked = itemClicked(callback);
        // vm.selected = undefined;

        // Functions
        // ----------
        function getPostalcodes() {
          return PostalcodesResourceFactory.query();
        }
        // vm.placeList = getPostalcodes();

        function getCities() {
          return CitiesResourceFactory.query();
        }

        // function itemClicked(callback) {
        //   // print out the selected item
        //   console.log(callback.item);
        // }
        //
        // vm.ngModelOptionsSelected = function(value) {
        //   if (postalcodes.length) {
        //     _selected = value;
        //   } else {
        //     return _selected;
        //   }
        // };
        //
        // vm.modelOptions = {
        //   debounce: {
        //     default: 500,
        //     blur: 250
        //   },
        //   getterSetter: true
        // };
      }
})();

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

;(function () {
    'use strict';

    angular.module('app.overview')
        .factory('HealthInsuranceContributionResourceFactory', HealthInsuranceContributionResourceFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    HealthInsuranceContributionResourceFactory.$inject = [
        // Angular
        '$resource',
        // Custom
        'UriFactory'
    ];

    function HealthInsuranceContributionResourceFactory(
        // Angular
        $resource,
        // Custom
        UriFactory
    ) {
        var url = UriFactory.getApi('/healthinsurancecontributions');

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

;(function () {
    'use strict';

    angular.module('app.overview')
        .factory('HealthInsuranceResourceFactory', HealthInsuranceResourceFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    HealthInsuranceResourceFactory.$inject = [
        // Angular
        '$resource',
        // Custom
        'UriFactory'
    ];

    function HealthInsuranceResourceFactory(
        // Angular
        $resource,
        // Custom
        UriFactory
    ) {
        var url = UriFactory.getApi('/healthinsurances');

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


;(function () {
    'use strict';

    angular.module('app.overview')
        .config(Routes);

    // Inject dependencies into constructor (needed when JS minification is applied).
    Routes.$inject = [
        // Angular
        '$stateProvider'
    ];

    function Routes(
        // Angular
        $stateProvider
    ) {
        $stateProvider
            .state('overview', {
                controller: 'OverviewCtrl as vm',
                templateUrl: 'templates/overview/overview.view.html',
                url: '/overview'
            });
    }

})();

;(function () {
    'use strict';

    angular.module('app.overview')
        .controller('OverviewCtrl', OverviewCtrl);

    // Inject dependencies into constructor (needed when JS minification is applied).
    OverviewCtrl.$inject = [
        // Angular
        '$log',
        '$state',
        '$scope',
        // Custom
        'HealthInsuranceResourceFactory',
        'HealthInsuranceContributionResourceFactory'
    ];

    function OverviewCtrl(
        // Angular
        $log,
        $state,
        $scope,
        // Custom
        HealthInsuranceResourceFactory,
        HealthInsuranceContributionResourceFactory
    ) {
        // ViewModel
        // =========
        var vm = this;

        vm.title = "Mogelijke ziekenfondsen";
        vm.healthinsurances = getHealthInsurances();
        vm.healthinsurancecontributions = getHealthInsuranceContributions();

        // Functions
        // ----------
        function getHealthInsurances() {
          return HealthInsuranceResourceFactory.query();
        }

        function getHealthInsuranceContributions() {
          return HealthInsuranceContributionResourceFactory.query();
        }
      }
})();

;(function () {
    'use strict';

    angular.module('app.profile')
        .factory('HouseholdtypesResourceFactory', HouseholdtypesResourceFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    HouseholdtypesResourceFactory.$inject = [
        // Angular
        '$resource',
        // Custom
        'UriFactory'
    ];

    function HouseholdtypesResourceFactory(
        // Angular
        $resource,
        // Custom
        UriFactory
    ) {
        var url = UriFactory.getApi('/householdtypes');

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

;(function () {
    'use strict';

    angular.module('app.profile')
        .factory('HouseholdtypesSpecificResourceFactory', HouseholdtypesSpecificResourceFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    HouseholdtypesSpecificResourceFactory.$inject = [
        // Angular
        '$resource',
        // Custom
        'UriFactory'
    ];

    function HouseholdtypesSpecificResourceFactory(
        // Angular
        $resource,
        // Custom
        UriFactory
    ) {
        var url = UriFactory.getApi('/householdtypes/:household_type_id');

        var paramDefaults = {
            household_type_id: '@id',
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

;(function () {
    'use strict';

    angular.module('app.profile')
        .factory('ProfileServiceFactory', ProfileServiceFactory);

    function ProfileServiceFactory() {
        var profile = {};

        // return profile;

        return {
          getProfileObject: function () {
              return profile;
          },
          setProfileObject: function (profileObject) {
              profile = profileObject;
          }
        };
    }
})();

;(function () {
    'use strict';

    angular.module('app.home')
        .config(Routes);

    // Inject dependencies into constructor (needed when JS minification is applied).
    Routes.$inject = [
        // Angular
        '$stateProvider'
    ];

    function Routes(
        // Angular
        $stateProvider
    ) {
        $stateProvider
            .state('profile', {
                controller: 'ProfileCtrl as vm',
                templateUrl: 'templates/profile/profile.view.html',
                url: '/profile'
            });
    }

})();

;(function () {
    'use strict';

    angular.module('app.profile')
        .controller('ProfileCtrl', ProfileCtrl);

    // Inject dependencies into constructor (needed when JS minification is applied).
    ProfileCtrl.$inject = [
        // Angular
        '$log',
        '$state',
        '$scope',
        // Custom
        'HouseholdtypesResourceFactory',
        'HouseholdtypesSpecificResourceFactory',
        'CityServiceFactory',
        'ProfileServiceFactory'
    ];

    function ProfileCtrl(
        // Angular
        $log,
        $state,
        $scope,
        // Custom
        HouseholdtypesResourceFactory,
        HouseholdtypesSpecificResourceFactory,
        CityServiceFactory,
        ProfileServiceFactory
    ) {
        // ViewModel
        // =========
        var vm = this;

        vm.title = 'Kies uw profiel';
        vm.householdtypes = getHouseholdtypes();
        vm.alleenstaand = getHouseholdtypeAlleenstaand();
        vm.koppels = getHouseholdtypeKoppels();
        vm.gezinKleineKinderen = getHouseholdtypeGezinKleineKinderen();
        vm.gezinTieners = getHouseholdtypeGezinTieners();
        vm.senioren = getHouseholdtypeSenioren();

        $log.info('Gekozen postcode:', CityServiceFactory);
        ProfileServiceFactory = [];

        $scope.addHouseholdTypeAlleenstaand = function () {
            ProfileServiceFactory.push({
            household_type: vm.alleenstaand.household_type});
            $log.info('Gekozen profiel:', ProfileServiceFactory);
        };

        $scope.addHouseholdTypeKoppels = function () {
            ProfileServiceFactory.push({
            household_type: vm.koppels.household_type});
            $log.info('Gekozen profiel:', ProfileServiceFactory);
        };

        $scope.addHouseholdTypeGezinKleineKinderen = function () {
            ProfileServiceFactory.push({
            household_type: vm.gezinKleineKinderen.household_type});
            $log.info('Gekozen profiel:', ProfileServiceFactory);
        };

        $scope.addHouseholdTypeGezinTieners = function () {
            ProfileServiceFactory.push({
            household_type: vm.gezinTieners.household_type});
            $log.info('Gekozen profiel:', ProfileServiceFactory);
        };

        $scope.addHouseholdTypeSenioren = function () {
            ProfileServiceFactory.push({
            household_type: vm.senioren.household_type});
            $log.info('Gekozen profiel:', ProfileServiceFactory);
        };

        $log.info('Gekozen postcode:', CityServiceFactory);

        // $scope.input = {};
        // $scope.city = getCity();
        // vm.input = CityServiceFactory;
        // vm.label = CityServiceFactory;


        // vm.selected = ProfileServiceFactory;
        // $log.info('Gekozen householdtype:', vm.selected);

        // Functions
        // ----------
        function getHouseholdtypes() {
          return HouseholdtypesResourceFactory.query();
        }

        function getHouseholdtypeAlleenstaand() {
          var params = {
                household_type_id: 1
          };
          return HouseholdtypesSpecificResourceFactory.get(params);
        }

        function getHouseholdtypeKoppels() {
          var params = {
                household_type_id: 2
          };
          return HouseholdtypesSpecificResourceFactory.get(params);
        }

        function getHouseholdtypeGezinKleineKinderen() {
          var params = {
                household_type_id: 3
          };
          return HouseholdtypesSpecificResourceFactory.get(params);
        }

        function getHouseholdtypeGezinTieners() {
          var params = {
                household_type_id: 4
          };
          return HouseholdtypesSpecificResourceFactory.get(params);
        }

        function getHouseholdtypeSenioren() {
          var params = {
                household_type_id: 5
          };
          return HouseholdtypesSpecificResourceFactory.get(params);
        }

        // function getCity() {
        //   $scope.input = CityServiceFactory.getCityObject();
        // }

        // $scope.addHouseholdType = function (household_type) {
        //   switch (household_type) {
        //       case vm.alleenstaand:
        //           ProfileServiceFactory.push({
        //             household_type: vm.alleenstaand.household_type});
        //             $log.info('Gekozen profiel:', ProfileServiceFactory);
        //           break;
        //       case vm.koppels:
        //           ProfileServiceFactory.push({
        //             household_type: vm.koppels.household_type});
        //             $log.info('Gekozen profiel:', ProfileServiceFactory);
        //           break;
        //       case vm.gezinKleineKinderen:
        //           ProfileServiceFactory.push({
        //             household_type: vm.gezinKleineKinderen.household_type});
        //             $log.info('Gekozen profiel:', ProfileServiceFactory);
        //           break;
        //       case vm.gezinTieners:
        //           ProfileServiceFactory.push({
        //             household_type: vm.gezinTieners.household_type});
        //             $log.info('Gekozen profiel:', ProfileServiceFactory);
        //           break;
        //       case vm.senioren:
        //           ProfileServiceFactory.push({
        //             household_type: vm.senioren.household_type});
        //             $log.info('Gekozen profiel:', ProfileServiceFactory);
        //           break;
        //       default:
        //   }
        // };
      }
})();

/**
 * @author    Lien Mergan based on an example of Olivier Parent
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */

;(function () {
    'use strict';

    angular.module('app.services')
        .factory('UriFactory', UriFactory);

    // Inject dependencies into constructor (needed when JS minification is applied).
    UriFactory.$inject = [
        // Angular
        '$location',
        // Custom
        'config'
    ];

    function UriFactory(
        // Angular
        $location,
        // Custom
        config
    ) {
        function getApi(path) {
            var protocol = config.api.protocol ? config.api.protocol : $location.protocol(),
                host     = config.api.host     ? config.api.host     : $location.host(),
                uri      = protocol + '://' + host + config.api.path + path;

            return uri;
        }

        return {
            getApi: getApi
        };
    }
})();
