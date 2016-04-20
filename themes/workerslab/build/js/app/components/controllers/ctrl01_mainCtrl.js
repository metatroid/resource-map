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