angular.module('resourceMap.services')
  .factory('msgSrv', ['$rootScope',
    function($rootScope){
      var msgSrv = {};
      msgSrv.state = {};
      msgSrv.setState = function(stateLabel, data){
        msgSrv.state = {
          fn: stateLabel,
          args: data
        };
        $rootScope.$broadcast('updateState');
      };

      return msgSrv;
    }
  ])
;