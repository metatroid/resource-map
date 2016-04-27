angular.module('resourceMap.services')
  .factory('apiSrv', ['$http', 
    function($http){
      var apiSrv = {};
      apiSrv.getPages = function(order, direction, successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/wp-json/wp/v2/pages?filter[orderby]='+order+'&filter[order]='+direction
        }).success(successFn).error(errorFn);
      };
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
      apiSrv.getYears = function(successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/wp-json/wp/v2/year'
        }).success(successFn).error(errorFn);
      };
      return apiSrv;
    }
  ])
;