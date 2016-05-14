angular.module('resourceMap.services')
  .factory('msgSrv', ['$rootScope',
    function($rootScope){
      var msgSrv = {};
      msgSrv.state = {};
      msgSrv.appScope = {};
      msgSrv.vars = {};
      msgSrv.setState = function(stateLabel, data){
        msgSrv.state = {
          fn: stateLabel,
          args: data
        };
        $rootScope.$broadcast('updateState');
      };
      msgSrv.setScope = function(key, value){
        msgSrv.appScope[key] = value;
      };
      msgSrv.getScope = function(key){
        return msgSrv.appScope[key];
      };
      msgSrv.setVars = function(obj){
        msgSrv.vars = obj;
      };
      msgSrv.getVars = function(){
        return msgSrv.vars;
      };
      return msgSrv;
    }
  ])
;