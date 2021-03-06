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
            'header':{
              templateUrl: templateDir + '/header.php'
            },
            'map@main': {
              templateUrl: templateDir + '/map.php'
            },
            'landing': {
              templateUrl: templateDir + '/landing.php'
            },
            'footer':{
              templateUrl: templateDir + '/footer.php'
            },
          }
        })
        .state('map', {
          url: '/map',
          views: {
            'main': {
              templateUrl: templateDir + '/main.php'
            },
            'header': {
              templateUrl: templateDir + '/header.php'
            },
            'map@map': {
              templateUrl: templateDir + '/map.php'
            },
            'footer':{
              templateUrl: templateDir + '/footer.php'
            }
          }
        })
        .state('map.companyView', {
          url: '/companies/:slug'
        })
      ;
    }
  ])
;