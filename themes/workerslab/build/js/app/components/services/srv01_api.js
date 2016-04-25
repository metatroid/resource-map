angular.module('resourceMap.services')
  .factory('apiSrv', ['$http', 
    function($http){
      var apiSrv = {};
      apiSrv.getCompanies = function(successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/wp-json/wp/v2/company'
        }).success(successFn).error(errorFn);
      };
      apiSrv.getIndustries = function(successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/wp-json/wp/v2/industry'
        }).success(successFn).error(errorFn);
      };
      apiSrv.getIssues = function(successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/wp-json/wp/v2/issue'
        }).success(successFn).error(errorFn);
      };
      return apiSrv;
    }
  ])
;