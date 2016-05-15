angular.module('resourceMap', [
               'ngMaterial',
               'ngCookies',
               'resourceMap.controllers',
               'resourceMap.states',
               'resourceMap.services',
               'resourceMap.directives',
               'resourceMap.filters'
]);

angular.module('resourceMap.states', []);
angular.module('resourceMap.services', []);
angular.module('resourceMap.directives', []);
angular.module('resourceMap.filters', []);

angular.module('resourceMap')
  .config(['$httpProvider', '$compileProvider', '$mdThemingProvider', '$mdGestureProvider', function($httpProvider, $compileProvider, $mdThemingProvider, $mdGestureProvider){
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    // $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|tel):/);
    $mdThemingProvider.theme('default')
      .primaryPalette('grey')
      .accentPalette('blue-grey');
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
    $mdGestureProvider.skipClickHijack();
  }
]);