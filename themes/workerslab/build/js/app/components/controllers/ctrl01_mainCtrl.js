angular.module('resourceMap.controllers')
  .controller('mainCtrl', ['$scope', 
                           '$rootScope',
                           '$state', 
                           '$log', 
                           '$sce',
                           '$compile',
                           '$timeout',
                           '$cookies',
                           'apiSrv',
    function($scope, $rootScope, $state, $log, $sce, $compile, $timeout, $cookies, apiSrv){
      var mapObj;
      $scope.htmlSafe = $sce.trustAsHtml;
      $scope.showLandingOverlay = true;
      //get WP pages
      $scope.pages = [];
      var pageHandler = function(data){
        $scope.pages = data;
        function loadMap(){
          var mapEl = document.getElementById('page_map');
          if(mapEl === null){
            $timeout(loadMap, 500);
          } else {
            mapEl.innerHTML = "<div id=\"map\" ui-view=\"map\" autoscroll=\"true\" class=\"page-content\"></div>";
            $compile(document.getElementById('map'))($scope);
          }
        }
        loadMap();
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
      };
      //
      $scope.companyActive = false;
      var companyHandler = function(data){
        $scope.companyActive = true;
        $scope.company = data;
        $log.info("company details:");
        $log.info(data);
      };
      //
      var markers;
      $scope.mapReady = function(map){
        mapObj = map;
        //map.setView([0,0], 3);
        if (!navigator.geolocation) {
          map.setView([0,0], 3);
          $log.info("Geolocation not available");
        } else {
          map.locate();
        }
        map.on('locationfound', function(e){
          map.setView([e.latlng.lat, e.latlng.lng], 13);
          $cookies.put('location', JSON.stringify({lat: e.latlng.lat, lng: e.latlng.lng}));
        });
        markers = L.mapbox.featureLayer().loadURL("/wp-content/plugins/workerslab/companies.json").addTo(map);
        markers.on('click', function(e){
          // e.target.closePopup();
          var compId = e.layer.feature.properties.compid;
          apiSrv.getCompany(compId, companyHandler, function(err){$log.error(err);});
        });
      };

      //
      $scope.filterBy = function(opts){
        markers.setFilter(function(f){
          if(opts.industry && opts.issue && opts.year){
            return (f.properties.industry.indexOf(opts.industry) !== -1 && f.properties.issue.indexOf(opts.issue) !== -1 && f.properties.year.indexOf(opts.year) !== -1);
          } else if(opts.industry && opts.issue){
            return (f.properties.industry.indexOf(opts.industry) !== -1 && f.properties.issue.indexOf(opts.issue) !== -1);
          } else if(opts.industry && opts.year){
            return (f.properties.industry.indexOf(opts.industry) !== -1 && f.properties.year.indexOf(opts.year) !== -1);
          } else if(opts.issue && opts.year){
            return (f.properties.issue.indexOf(opts.issue) !== -1 && f.properties.year.indexOf(opts.year) !== -1);
          } else if(opts.industry){
            return (f.properties.industry.indexOf(opts.industry) !== -1);
          } else if(opts.issue){
            return (f.properties.issue.indexOf(opts.issue) !== -1);
          } else if(opts.year){
            return (f.properties.year.indexOf(opts.year) !== -1);
          }
        });
      };

      //
      // var rendered = 0;
      // $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent){
      //   document.body.className = $rootScope.$state.current.name;
      //   var el = document.getElementById('menu');
      //   el.outerHTML = "<button menu-trigger=\"#siteNav\" class=\"toggle-btn\" id=\"menu\"><span class=\"screen-reader\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span></button>";
      //   $compile(document.getElementById('menu'))($scope);
      //   var mapEL = document.getElementById('page_map');
      //   if(rendered === 0){
      //     $log.info('load map');
      //     mapEL.innerHTML = "<div id=\"map\" ui-view=\"map\" autoscroll=\"true\" class=\"page-content\"></div>";
      //     $compile(document.getElementById('map'))($scope);
      //   }
      //   rendered++;
      // });

      //stateSwitch
      // $scope.stateSwitch = function(state){
      //   $log.info($scope.pages);
      // };

      //get WP options
      $scope.settings = [];
      var optHandler = function(data){
        $scope.settings = data;
      };
      apiSrv.getOptions(optHandler, function(err){
        $log.error(err);
      });

      //
      if($cookies.get("overlaid") === "true"){
        $scope.showLandingOverlay = false;
      } else {
        $log.info($cookies.get("overlaid"));
      }
      $scope.hideOverlay = function(){
        $scope.showLandingOverlay = false;
        $cookies.put('overlaid', true);
      };
      $scope.showOverlay = function(){
        $scope.showLandingOverlay = true;
      };

      //
      $scope.setMapView = function(lng,lat){
        $log.info(lng);
        $log.info(lat);
        mapObj.setView([lat,lng], 13);
      };
    }
  ])
;