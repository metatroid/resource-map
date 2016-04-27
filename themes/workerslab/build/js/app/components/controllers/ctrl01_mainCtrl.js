angular.module('resourceMap.controllers')
  .controller('mainCtrl', ['$scope', 
                           '$state', 
                           '$log', 
                           '$sce',
                           '$compile',
                           '$timeout',
                           'apiSrv',
    function($scope, $state, $log, $sce, $compile, $timeout, apiSrv){
      $scope.htmlSafe = $sce.trustAsHtml;
      $scope.pages = [];
      var pageHandler = function(data){
        $scope.pages = data;
      };
      apiSrv.getPages('menu_order', 'ASC', pageHandler, function(err){
        $log.error(err);
      });

      //category/filtering
      $scope.issues = [];
      $scope.industries = [];
      $scope.categories = [];
      $scope.years = [];
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
      var yearHandler = function(data){
        $scope.years = data;
      };
      apiSrv.getIndustries(industryHandler, function(err){
        $log.error(err);
      });
      apiSrv.getIssues(issueHandler, function(err){
        $log.error(err);
      });
      apiSrv.getYears(yearHandler, function(err){
        $log.error(err);
      });
      //
      $scope.searchLocation = function(terms){
        $log.info(terms);
      }
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
      };

      //
      $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
        var el = document.getElementById('menu');
        el.outerHTML = "<button menu-trigger=\"#siteNav\" class=\"toggle-btn\" id=\"menu\"><span class=\"screen-reader\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span></button>";
        $compile(document.getElementById('menu'))($scope);
        var mapEL = document.getElementById('page_map');
        mapEL.innerHTML = "<div id=\"map\" ui-view=\"map\" autoscroll=\"true\" class=\"page-content\"></div>";
        $compile(document.getElementById('map'))($scope);
      });
    }
  ])
;