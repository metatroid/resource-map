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