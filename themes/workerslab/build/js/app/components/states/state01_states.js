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
              templateUrl: templateDir + '/map.php'
            },
            'footer@main':{
              templateUrl: templateDir + '/footer.php'
            },
          }
        })
      ;
    }
  ])
;