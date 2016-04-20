angular.module('resourceMap', [
               'ngMaterial',
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
  .config(['$httpProvider', '$compileProvider', '$mdThemingProvider', function($httpProvider, $compileProvider, $mdThemingProvider){
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|tel):/);
    $mdThemingProvider.theme('default')
      .primaryPalette('grey')
      .accentPalette('blue-grey');
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
  }
]);
angular.module('resourceMap.controllers', []);
angular.module('resourceMap.directives', []);
angular.module('resourceMap.filters', []);
angular.module('resourceMap.services', []);
angular.module('resourceMap.states', ['ui.router']);
var formatErr = function(err){
  var errString = JSON.stringify(err),
      errArray = errString.split(','),
      responseString = "";
  for(var i=0;i<errArray.length;i++){
    var clean = errArray[i].replace(/\[|\]|"|{|}/g,''),
        item = clean.match(/.*(?=:)/)[0],
        message = clean.match(/(:)(.*)/)[2];
    responseString += "<li>"+item+": "+message+"</li>";
  }
  return responseString;
};
angular.module('resourceMap.controllers')
  .controller('mainCtrl', ['$scope', 
                           '$state', 
                           '$log', 
                           'apiSrv',
    function($scope, $state, $log, apiSrv){
      $log.info("loaded");
    }
  ])
;
angular.module('resourceMap.controllers')
  .controller('mapCtrl', ['$scope', 
                           '$state', 
                           '$log', 
                           'apiSrv',
    function($scope, $state, $log, apiSrv){
      $log.info("map");
    }
  ])
;
angular.module('resourceMap.services')
  .factory('apiSrv', ['$http', 
    function($http){
      var apiSrv = {};
      apiSrv.request = function(method, url, args, successFn, errorFn){
        return $http({
          method: method,
          url: '/wp-json/wp/v2/' + url,
          data: JSON.stringify(args)
        }).success(successFn).error(errorFn);
      };
      return apiSrv;
    }
  ])
;
var smoothScroll = function(element, options){
  options = options || {};
  var duration = 800,
      offset = 0;

  var easing = function(n){
    return n < 0.5 ? 8 * Math.pow(n, 4) : 1 - 8 * (--n) * Math.pow(n, 3);
  };

  var getScrollLocation = function(){
    return window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop;
  };

  setTimeout(function(){
    var startLocation = getScrollLocation(),
        timeLapsed = 0,
        percentage, position;

    var getEndLocation = function(element){
      var location = 0;
      if(element.offsetParent){
        do {
          location += element.offsetTop;
          element = element.offsetParent;
        } while (element);
      }
      location = Math.max(location - offset, 0);
      return location;
    };

    var endLocation = getEndLocation(element);
    var distance = endLocation - startLocation;

    var stopAnimation = function(){
      var currentLocation = getScrollLocation();
      if(position == endLocation || currentLocation == endLocation || ((window.innerHeight + currentLocation) >= document.body.scrollHeight)){
        clearInterval(runAnimation);
      }
    };

    var animateScroll = function(){
      timeLapsed += 16;
      percentage = (timeLapsed / duration);
      percentage = (percentage > 1) ? 1 : percentage;
      position = startLocation + (distance * easing(percentage));
      window.scrollTo(0, position);
      stopAnimation();
    };

    var runAnimation = setInterval(animateScroll, 16);
  }, 0);
};
angular.module('resourceMap.directives')
  .directive('scrollTo', 
    function(){
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          var targetElement;
          
          $element.on('click', function(e){
            e.preventDefault();
            this.blur();
            var targetId = $attrs.scrollTo;

            targetElement = document.getElementById(targetId);
            if(!targetElement) return; 

            smoothScroll(targetElement, {});

            return false;
          });
        }
      };
    }
  )
;
angular.module('resourceMap.states')
  .run(['$rootScope', 
        '$state', 
        '$stateParams', 
    function($rootScope, $state, $stateParams){
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ])
  .config(['$stateProvider', 
           '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider){
      var templateDir = '/wp-content/themes/workerslab/views';

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('main', {
          url: '/',
          views: {
            'main': {
              templateUrl: templateDir + '/main.php'
            },
            'header@main':{
              templateUrl: templateDir + '/header.php'
            },
            'map@main': {
              templateUrl: templateDir + '/map.php',
              controller: 'mapCtrl'
            }
          }
        })
      ;
    }
  ])
;
angular.module('resourceMap.filters')
  .filter('telephone', 
    function(){
      return function(telephone){
        if(!telephone){
          return "";
        }
        var value = telephone.toString().trim().replace(/^\+/, '');
        if(value.match(/[^0-9]/)){
          return telephone;
        }
        var country, city, number;
        switch(value.length){
          case 10:
            country = 1;
            city = value.slice(0,3);
            number = value.slice(3);
            break;
          case 11:
            country = value[0];
            city = value.slice(1,4);
            number = value.slice(4);
            break;
          case 12:
            country = value.slice(0,3);
            city = value.slice(3,5);
            number = value.slice(5);
            break;
          default:
            return telephone;
        }
        if(country === 1){
          country = "";
        }
        number = number.slice(0, 3) + '-' + number.slice(3);
        return (country + " (" + city + ") " + number).trim();
      };
    }
  )
;