angular.module('resourceMap.controllers')
  .controller('mainCtrl', ['$scope', 
                           '$rootScope',
                           '$state', 
                           '$log', 
                           '$sce',
                           '$compile',
                           '$timeout',
                           '$cookies',
                           '$mdBottomSheet',
                           'apiSrv',
                           'msgSrv',
    function($scope, $rootScope, $state, $log, $sce, $compile, $timeout, $cookies, $mdBottomSheet, apiSrv, msgSrv){
      var mapObj;
      var mLayer;
      var geojson;
      var _geojson;
      $scope.htmlSafe = $sce.trustAsHtml;
      var overlay = false;
      if($state.is('map.companyView')){
        var slug = $state.params.slug;
        msgSrv.setState('companyView', {slug: slug});
      }
      $scope.showLandingOverlay = true;
      //get WP pages
      $scope.pages = [];
      var pageHandler = function(data){
        $scope.pages = data;
        // function loadMap(){
        //   var mapEl = document.getElementById('page_map');
        //   if(mapEl === null){
        //     $timeout(loadMap, 500);
        //   } else {
        //     mapEl.innerHTML = "<div id=\"map\" ui-view=\"map\" autoscroll=\"true\" class=\"page-content\"></div>";
        //     $compile(document.getElementById('map'))($scope);
        //   }
        // }
        // loadMap();
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
      $scope.searchLocation = function(terms){};
      //
      var markers;
      $scope.mapReady = function(map){
        mapObj = map;
        if(typeof($cookies.get('location')) !== 'undefined'){
          var loc = JSON.parse($cookies.get('location')),
              lat = loc.lat,
              lng = loc.lng;
          map.setView([lat, lng], 13);
        } else {
          if (!navigator.geolocation) {
            map.setView([0,0], 3);
          } else {
            map.locate();
          }
        }
        map.on('locationfound', function(e){
          map.setView([e.latlng.lat, e.latlng.lng], 13);
          $cookies.put('location', JSON.stringify({lat: e.latlng.lat, lng: e.latlng.lng}));
        });
        markers = L.mapbox.featureLayer().loadURL("/wp-content/plugins/workerslab/companies.json").addTo(map);
        markers.on('ready', function(){
          map.fitBounds(markers.getBounds());
        });
        mLayer = markers;
        markers.on('layeradd', function(e){
          var marker = e.layer,
              feature = marker.feature;
          marker.setIcon(L.icon(feature.properties.icon));
        });
        markers.on('click', function(e){
          var marker = e.layer,
              feature = marker.feature;
          marker.setIcon(L.icon({
            "iconUrl":"/assets/img/marker_icon_clicked.svg",
            "iconSize":[44,62],
            "iconAnchor":[25,60],
            "popupAnchor":[0,0],
            "className":"dot"
          }));
          //
          var compId = e.layer.feature.properties.compid,
              compTitle = e.layer.feature.properties.title;
          var compSlug = e.layer.feature.properties.slug;
          // $log.info(e.layer.feature.properties);
          msgSrv.setState('companyView', {slug: compSlug});
          $state.go("map.companyView", {slug: compSlug});
        });
        map.on('click', function(e){
          markers = L.mapbox.featureLayer().loadURL("/wp-content/plugins/workerslab/companies.json");
        });
        apiSrv.getJson(function(data){
          geojson = data;
          _geojson = data;
          for(var i=0;i<_geojson.length;i++){
            if(_geojson[i].properties.compSlug === $state.params.slug){
              // _geojson[i].properties.icon.iconUrl = "/assets/img/marker_icon_clicked.svg";
              // _geojson[i].properties.icon.iconSize = [44,62];
              // _geojson[i].properties.icon.iconAnchor = [25,60];
            }
          }
          if($state.current.name === "map.companyView"){
            markers.setGeoJSON(_geojson);
            markers.eachLayer(function(marker){
              if(marker.feature.properties.slug === $state.params.slug){
                marker.setIcon(L.icon({
                  "iconUrl":"/assets/img/marker_icon_clicked.svg",
                  "iconSize":[44,62],
                  "iconAnchor":[25,60],
                  "popupAnchor":[0,0],
                  "className":"dot"
                }));
              }
            });
          }
        }, function(err){
          $log.error(err);
        });
      };
      //
      $scope.$on('updateState', function(){
        switch(msgSrv.state.fn){
          case "companyView":
            $scope.showCompany(msgSrv.state.args.slug);
            break;
          default:
            // $log.info(msgSrv.state);
            break;
        }
      });
      $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        switch(toState.name){
          case "map.companyView":
            if(!overlay){$scope.showCompany(toParams.slug);}
            // $log.info(toParams);
            break;
          default:
            // $log.info(msgSrv.state);
            break;
        }
      });
      //
      $scope.closeSheet = function(){
        $mdBottomSheet.hide();
      };
      //
      $scope.showCompany = function(slug){
        overlay = true;
        $mdBottomSheet.show({
          controller: function(){
            this.parent = $scope;
            this.parent.company = {};
            apiSrv.getCompany(slug, function(company){
              company = company[0];
              $timeout(function(){
                $scope.$apply(function(){
                  this.parent = $scope;
                  this.parent.company = company;
                });
              }, 0);
            }, function(err){
              $log.error(err);
            });
          },
          controllerAs: 'ctrl',
          templateUrl: '/wp-content/themes/workerslab/views/company_detail.php',
          // parent: angular.element(document.querySelector('#main')),
          clickOutsideToClose: true
        }).finally(function(){
          mLayer.setGeoJSON(geojson);
          for(var i=0;i<geojson.length;i++){
            // if(geojson[i].properties.compSlug === $state.params.slug){
              geojson[i].properties.icon.iconUrl = "/assets/img/marker_icon.svg";
              geojson[i].properties.icon.iconSize = [22,31];
              geojson[i].properties.icon.iconAnchor = [11,31];
            // }
          }
          if($state.current.name === "map"){
            mLayer.setGeoJSON(geojson);
          }
          overlay = false;
          $state.go("map");
        });
      };
      //
      // $scope.showCompany = function(slug){
      //   overlay = true;
      //   msgSrv.setScope('mainCtrl', $scope);
      //   msgSrv.setVars({slug: slug});
      //   $mdBottomSheet.show({
      //     controller: 'compCtrl',
      //     controllerAs: 'ctrl',
      //     templateUrl: '/wp-content/themes/workerslab/views/company_detail.php',
      //     parent: angular.element(document.querySelector('#main')),
      //     clickOutsideToClose: true
      //   }).finally(function(){
      //     mLayer.setGeoJSON(geojson);
      //     for(var i=0;i<geojson.length;i++){
      //       // if(geojson[i].properties.compSlug === $state.params.slug){
      //         geojson[i].properties.icon.iconUrl = "/assets/img/marker_icon.svg";
      //         geojson[i].properties.icon.iconSize = [22,31];
      //         geojson[i].properties.icon.iconAnchor = [11,31];
      //       // }
      //     }
      //     if($state.current.name === "map"){
      //       mLayer.setGeoJSON(geojson);
      //     }
      //     $state.go("map");
      //   });
      // };
      //
      $scope.companyActive = false;
      var companyHandler = function(data){
        $scope.companyActive = true;
        $scope.company = data;
      };
      //
      $scope.filterBy = function(opts){
        if($state.current.name !== "map"){
          $state.go("map");
        }
        if(isMenuOpen){
          $timeout(function(){
            closeMenu();
          }, 0);
        }
        $timeout(function(){
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
          mapObj.fitBounds(markers.getBounds());
        }, 0);
      };
      //
      $scope.searchFor = function(search){
        if($state.current.name !== "map"){
          $state.go("map");
        }
        if(isMenuOpen){
          $timeout(function(){
            closeMenu();
          }, 0);
        }
        $timeout(function(){
          apiSrv.getCoords(search, function(data){
            if(data){
              var lat = data.results[0].geometry.location.lat;
              var lng = data.results[0].geometry.location.lng;
              $scope.setMapView(lng,lat);
            }
          }, function(err){
            $log.error(err);
          });
        }, 0);
      };
      //get WP options
      $scope.settings = [];
      var optHandler = function(data){
        $scope.settings = data;
      };
      apiSrv.getOptions(optHandler, function(err){
        $log.error(err);
      });

      //
      $scope.setMapView = function(lng,lat){
        if($state.current.name !== "map"){
          $state.go("map");
        }
        if(isMenuOpen){
          $timeout(function(){
            closeMenu();
          }, 0);
        }
        $timeout(function(){
          mapObj.setView([lat,lng], 13);
        }, 0);
      };
    }
  ])
;