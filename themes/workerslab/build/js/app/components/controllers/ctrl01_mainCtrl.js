angular.module('resourceMap.controllers')
  .controller('mainCtrl', ['$scope', 
                           '$state', 
                           '$log', 
                           'apiSrv',
    function($scope, $state, $log, apiSrv){
      $scope.issues = [];
      $scope.industries = [];
      $scope.categories = [];
      $scope.years = [];
      var currentYear = new Date().getFullYear(),
          startYear = 1970;
      while(startYear <= currentYear){
        $scope.years.push(startYear++);
      }
      $scope.filter = {
        "issue": "",
        "industry": "",
        "year": ""
      };
      var industryHandler = function(data){
        $scope.industries = data;
      };
      var issueHandler = function(data){
        $scope.issues = data;
      };
      apiSrv.getIndustries(industryHandler, function(err){
        $log.error(err);
      });
      apiSrv.getIssues(issueHandler, function(err){
        $log.error(err);
      });
      //
      var markers;
      $scope.mapReady = function(map){
        //map.setView([0,0], 3);
        if (!navigator.geolocation) {
          map.setView([0,0], 3);
          $log.info("Geolocation not available");
        } else {
          map.locate();
        }
        map.on('locationfound', function(e){
          map.setView([e.latlng.lat, e.latlng.lng], 13);
        });
        markers = L.mapbox.featureLayer().loadURL("/wp-content/plugins/workerslab/companies.json").addTo(map);
      };
      //
      $scope.filterBy = function(opts){
        markers.setFilter(function(f){
          if(opts.industry && opts.issue && opts.year){
            return (f.properties["industry"].indexOf(opts.industry) !== -1 && f.properties["issue"].indexOf(opts.issue) !== -1 && f.properties["year"].indexOf(opts.year) !== -1);
          } else if(opts.industry && opts.issue){
            return (f.properties["industry"].indexOf(opts.industry) !== -1 && f.properties["issue"].indexOf(opts.issue) !== -1);
          } else if(opts.industry && opts.year){
            return (f.properties["industry"].indexOf(opts.industry) !== -1 && f.properties["year"].indexOf(opts.year) !== -1);
          } else if(opts.issue && opts.year){
            return (f.properties["issue"].indexOf(opts.issue) !== -1 && f.properties["year"].indexOf(opts.year) !== -1);
          } else if(opts.industry){
            return (f.properties["industry"].indexOf(opts.industry) !== -1);
          } else if(opts.issue){
            return (f.properties["issue"].indexOf(opts.issue) !== -1);
          } else if(opts.year){
            return (f.properties["year"].indexOf(opts.year) !== -1);
          }
        });
        $log.info(opts);
      };
    }
  ])
;