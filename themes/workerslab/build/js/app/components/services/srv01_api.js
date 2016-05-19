angular.module('resourceMap.services')
  .factory('apiSrv', ['$http', 
    function($http){
      var apiSrv = {};
      apiSrv.getJson = function(successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/wp-content/plugins/workerslab/companies.json'
        }).success(successFn).error(errorFn);
      };
      apiSrv.getOptions = function(successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/wp-json/wp/v2/options'
        }).success(successFn).error(errorFn);
      };
      apiSrv.getPages = function(order, direction, successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/wp-json/wp/v2/pages?filter[orderby]='+order+'&filter[order]='+direction
        }).success(successFn).error(errorFn);
      };
      apiSrv.getCompanies = function(successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/wp-json/wp/v2/company?per_page=100'
        }).success(successFn).error(errorFn);
      };
      apiSrv.getCompany = function(slug, successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/wp-json/wp/v2/company?filter[name]='+slug
        }).success(successFn).error(errorFn);
      };
      apiSrv.getIndustries = function(successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/wp-json/wp/v2/industry?per_page=100'
        }).success(successFn).error(errorFn);
      };
      apiSrv.getIssues = function(successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/wp-json/wp/v2/issue?per_page=100'
        }).success(successFn).error(errorFn);
      };
      apiSrv.getStates = function(successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/wp-json/wp/v2/state?per_page=100'
        }).success(successFn).error(errorFn);
      };
      apiSrv.getCoords = function(terms, successFn, errorFn){
        var apiKey = "AIzaSyDCeNiQn5pxEpsoOGBIRChItBfGSYwe2VY";
        var lookup = encodeURI(terms);
        var apiUrl = "https://maps.googleapis.com/maps/api/geocode/json?key="+apiKey+"&address="+lookup;
        return $http({
          method: 'GET',
          url: apiUrl
        }).success(successFn).error(errorFn);
      };
      return apiSrv;
    }
  ])
;