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
                           '$mdDialog',
                           'apiSrv',
                           'msgSrv',
    function($scope, $rootScope, $state, $log, $sce, $compile, $timeout, $cookies, $mdBottomSheet, $mdDialog, apiSrv, msgSrv){
      var mapObj;
      var mLayer;
      var geojson;
      var _geojson;
      $scope.htmlSafe = $sce.trustAsHtml;
      var overlay = false;
      //
      if($state.is('map.companyView')){
        var slug = $state.params.slug;
        msgSrv.setState('companyView', {slug: slug});
      }
      $scope.showLandingOverlay = true;
      //
      $scope.pages = [];
      var pageHandler = function(data){
        $scope.pages = data;
      };
      apiSrv.getPages('menu_order', 'ASC', pageHandler, function(err){
        $log.error(err);
      });
      //
      $scope.campaigns = [];
      $scope.industries = [];
      $scope.categories = [];
      $scope.states = [];
      $scope.filter = {
        "campaign": "",
        "industry": "",
        "state": ""
      };
      var industryHandler = function(data){
        $scope.industries = data;
      };
      var campaignHandler = function(data){
        $scope.campaigns = data;
      };
      var stateHandler = function(data){
        $scope.states = data;
      };
      apiSrv.getIndustries(industryHandler, function(err){
        $log.error(err);
      });
      apiSrv.getCampaigns(campaignHandler, function(err){
        $log.error(err);
      });
      apiSrv.getStates(stateHandler, function(err){
        $log.error(err);
      });
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
          msgSrv.setState('companyView', {slug: compSlug});
          $state.go("map.companyView", {slug: compSlug});
        });
        map.on('click', function(e){
          markers = L.mapbox.featureLayer().loadURL("/wp-content/plugins/workerslab/companies.json");
        });
        apiSrv.getJson(function(data){
          geojson = data;
          _geojson = data;
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
            break;
        }
      });
      $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $timeout(function(){
          var bodyClass = toState.name;
          document.body.className = bodyClass;
        }, 100);
        switch(toState.name){
          case "map.companyView":
            if(!overlay){$scope.showCompany(toParams.slug);}
            break;
          default:
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
                  $scope.company = company;
                });
              }, 0);
            }, function(err){
              $log.error(err);
            });
          },
          controllerAs: 'ctrl',
          templateUrl: '/wp-content/themes/workerslab/views/company_detail.php',
          clickOutsideToClose: true,
          onComplete: function(){
            angular.element(document.querySelector('md-bottom-sheet md-content')).on('touchmove', function(e){
              e.stopPropagation();
            });
          }
        }).finally(function(){
          mLayer.setGeoJSON(geojson);
          for(var i=0;i<geojson.length;i++){
            geojson[i].properties.icon.iconUrl = "/assets/img/marker_icon.svg";
            geojson[i].properties.icon.iconSize = [22,31];
            geojson[i].properties.icon.iconAnchor = [11,31];
          }
          if($state.current.name === "map"){
            mLayer.setGeoJSON(geojson);
          }
          overlay = false;
          $state.go("map");
        });
      };
      //
      $scope.companyActive = false;
      var companyHandler = function(data){
        $scope.companyActive = true;
        $scope.company = data;
      };
      //
      var getFilterChoices = function(filters){
        var choices = [];
        for(var category in filters){
          var id = filters[category];
          var name = '';
          switch(category){
            case "campaign":
              for(var i=0;i<$scope.campaigns.length;i++){
                if($scope.campaigns[i].id === id){
                  name = $scope.campaigns[i].name;
                }
              }
              if(id === 'all'){
                name = 'all';
              }
              break;
            case "industry":
              for(var n=0;n<$scope.industries.length;n++){
                if($scope.industries[n].id === id){
                  name = $scope.industries[n].name;
                }
              }
              if(id === 'all'){
                name = 'all';
              }
              break;
            case "state":
              for(var y=0;y<$scope.states.length;y++){
                if($scope.states[y].id === id){
                  name = $scope.states[y].name;
                }
              }
              if(id === 'all'){
                name = 'all';
              }
              break;
            default:
              break;
          }
          choices.push(name);
        }
        return choices;
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
            if(opts.industry && opts.campaign && opts.state){
              return (f.properties.industry.indexOf(opts.industry) !== -1 && f.properties.campaign.indexOf(opts.campaign) !== -1 && f.properties.state.indexOf(opts.state) !== -1);
            } else if(opts.industry && opts.campaign){
              return (f.properties.industry.indexOf(opts.industry) !== -1 && f.properties.campaign.indexOf(opts.campaign) !== -1);
            } else if(opts.industry && opts.state){
              return (f.properties.industry.indexOf(opts.industry) !== -1 && f.properties.state.indexOf(opts.state) !== -1);
            } else if(opts.campaign && opts.state){
              return (f.properties.campaign.indexOf(opts.campaign) !== -1 && f.properties.state.indexOf(opts.state) !== -1);
            } else if(opts.industry){
              return (f.properties.industry.indexOf(opts.industry) !== -1);
            } else if(opts.campaign){
              return (f.properties.campaign.indexOf(opts.campaign) !== -1);
            } else if(opts.state){
              return (f.properties.state.indexOf(opts.state) !== -1);
            }
          });
          $scope.filterType = 'filter';
          var filterChoicesArray = getFilterChoices($scope.filter);
          filterChoicesArray = filterChoicesArray.clean('');
          filterChoicesArray = filterChoicesArray.getUnique();
          if(filterChoicesArray.length >= 2){
            filterChoicesArray.splice(filterChoicesArray.length-1, 0, "&");
          }
          $scope.filterChoices = filterChoicesArray.join(", ").replace("&,", "&");
          if(opts.state && opts.state !== 'all'){
            //move map to state
            var stateName = '';
            for(var y=0;y<$scope.states.length;y++){
              if($scope.states[y].id === opts.state){
                stateName = $scope.states[y].name;
              }
            }
            apiSrv.getCoords(stateName, function(data){
              if(data){
                var lat = data.results[0].geometry.location.lat;
                var lng = data.results[0].geometry.location.lng;
                mapObj.setView([lat,lng], 7);
              }
            }, function(err){
              $log.error(err);
            });
          } else {
            mapObj.fitBounds(markers.getBounds());
          }
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
              $scope.filterType = 'location';
              $scope.filterChoice = '';
              var filterLocationParts = data.results[0].formatted_address;
              var filterLocationArray = filterLocationParts.split(", ");
              $scope.filterLocation1 = filterLocationArray[0];
              $scope.filterLocation2 = filterLocationArray.slice(1, -1).join(", ");
              document.getElementById("autocomplete").innerHTML = "";
            }
          }, function(err){
            $log.error(err);
          });
        }, 0);
      };
      $scope.mapLocator = function(location, name){
        var locationParts = location.split(",");
        $scope.setMapView(locationParts[0], locationParts[1]);
        $scope.filterType = 'location';
        $scope.filterChoice = '';
        var filterLocationArray = name.split(", ");
        $scope.filterLocation1 = filterLocationArray[0];
        $scope.filterLocation2 = filterLocationArray.slice(1, -1).join(", ");
        document.getElementById("autocomplete").innerHTML = "";
      };
      //
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
      //
      $scope.filterType = null;
      $scope.filterChoice = '';
      $scope.filterLocation = '';
      $scope.selectFilter = function(name, id, filterName){
        $scope.filter[name] = id;
        $scope.filterChoice = filterName;
        $scope.filterLocation = '';
        $scope.filterType = null;
      };
      $scope.cancelFilters = function(){
        $mdDialog.cancel();
      };
      $scope.confirmFilters = function(){
        $scope.filterBy($scope.filter);
        $mdDialog.hide();
      };
      $scope.openFilterModal = null;
      $scope.revealFilterModal = function(filter){
        $scope.openFilterModal = filter;
        $scope.filterSelectionsOpen = false;
        $scope.filterSet = [];
        switch(filter){
          case "industry":
            $scope.filterSet = $scope.industries;
            break;
          case "campaign":
            $scope.filterSet = $scope.campaigns;
            break;
          case "state":
            $scope.filterSet = $scope.states;
            break;
          default:
            break;
        }
        $mdDialog.show({
          controller: function(){
            this.parent = $scope;
          },
          controllerAs: 'ctrl',
          templateUrl: '/wp-content/themes/workerslab/views/filter-modal.php',
          parent: angular.element(document.body),
          clickOutsideToClose: true,
          disableParentScroll: true,
          openFrom: {top: -500},
          closeTo: {bottom: -500},
        }).finally(function(){
          //
        });
      };
      //
      $scope.filterSelectionsOpen = false;
      $scope.toggleFilterSelections = function(){
        $scope.filterSelectionsOpen = !$scope.filterSelectionsOpen;
      };
      //
      $scope.currentYear = (new Date()).getFullYear();
    }
  ])
;