angular.module('resourceMap', [
               'ngMaterial',
               'ngCookies',
               'resourceMap.controllers',
               'resourceMap.states',
               'resourceMap.services',
               'resourceMap.directives',
               'resourceMap.filters'
]);

angular.module('resourceMap.states', []);
angular.module('resourceMap.services', []);
angular.module('resourceMap.directives', []);
angular.module('resourceMap.filters', []);

angular.module('resourceMap')
  .config(['$httpProvider', '$compileProvider', '$mdThemingProvider', '$mdGestureProvider', function($httpProvider, $compileProvider, $mdThemingProvider, $mdGestureProvider){
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    // $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|tel):/);
    $mdThemingProvider.theme('default')
      .primaryPalette('grey')
      .accentPalette('blue-grey');
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
    $mdGestureProvider.skipClickHijack();
  }
]);
angular.module('resourceMap.controllers', []);
angular.module('resourceMap.directives', []);
angular.module('resourceMap.filters', []);
angular.module('resourceMap.services', []);
angular.module('resourceMap.states', ['ui.router']);
var formatErr = function(err){
  var errString = JSON.stringify(err),
      errArray = errString.split(','),
      responseString = "";
  for(var i=0;i<errArray.length;i++){
    var clean = errArray[i].replace(/\[|\]|"|{|}/g,''),
        item = clean.match(/.*(?=:)/)[0],
        message = clean.match(/(:)(.*)/)[2];
    responseString += "<li>"+item+": "+message+"</li>";
  }
  return responseString;
};
function waitForEl(selector, fn){
  var el = document.querySelectorAll(selector)[0];
  if(typeof el === 'undefined' || el.length < 1){
    setTimeout(function(){waitForEl(selector, fn);}, 500);
  } else {
    fn();
  }
}
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};
Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
};
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
angular.module('resourceMap.controllers')
  .controller('mapCtrl', ['$scope', 
                           '$state', 
                           '$log', 
                           'apiSrv',
    function($scope, $state, $log, apiSrv){
      //
    }
  ])
;
// angular.module('resourceMap.controllers')
//   .controller('compCtrl', ['$scope',
//                            '$log',
//                            'apiSrv',
//     function($scope, $log, apiSrv){
//       $log.info("company selected");
//       var $scope = msgSrv.getScope('mainCtrl');
//       var vars = msgSrv.getVars();
//       var it = this;
//       this.parent = $scope;
//       this.parent.company = {};
//       //
//       apiSrv.getCompany(slug, function(company){
//         company = company[0];
//         $timeout(function(){
//           $scope.$apply(function(){
//             $scope.company = company[0];
//             // this.parent = $scope;
//             // this.parent.company = company;
//           });
//         }, 0);
//       }, function(err){
//         $log.error(err);
//       });
//       //
//     }
//   ])
// ;
var smoothScroll = function(element, options){
  options = options || {};
  var duration = 800,
      offset = 0;

  var easing = function(n){
    return n < 0.5 ? 8 * Math.pow(n, 4) : 1 - 8 * (--n) * Math.pow(n, 3);
  };

  var getScrollLocation = function(){
    return window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop;
  };

  setTimeout(function(){
    var startLocation = getScrollLocation(),
        timeLapsed = 0,
        percentage, position;

    var getEndLocation = function(element){
      var location = 0;
      if(element.offsetParent){
        do {
          location += element.offsetTop;
          element = element.offsetParent;
        } while (element);
      }
      location = Math.max(location - offset, 0);
      return location;
    };

    var endLocation = getEndLocation(element);
    var distance = endLocation - startLocation;

    var stopAnimation = function(){
      var currentLocation = getScrollLocation();
      if(position == endLocation || currentLocation == endLocation || ((window.innerHeight + currentLocation) >= document.body.scrollHeight)){
        clearInterval(runAnimation);
      }
    };

    var animateScroll = function(){
      timeLapsed += 16;
      percentage = (timeLapsed / duration);
      percentage = (percentage > 1) ? 1 : percentage;
      position = startLocation + (distance * easing(percentage));
      window.scrollTo(0, position);
      stopAnimation();
    };

    var runAnimation = setInterval(animateScroll, 16);
  }, 0);
};
//
// function ready(fn) {
//   if (document.readyState != 'loading'){
//     fn();
//   } else {
//     document.addEventListener('DOMContentLoaded', fn);
//   }
// }
// //
// ready(function(){
//   var imgs = document.querySelectorAll('.fit-images');
//   for(var i=0;i<imgs.length;i++){
//     var img = imgs[i].querySelector('img');
//     var imgClass = (img.width/img.height > 1) ? 'tall' : 'wide';
//     img.classList.add(imgClass);
//   }
// });
angular.module('resourceMap.directives')
  .directive('scrollTo', 
    function(){
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          var targetElement;
          
          $element.on('click', function(e){
            e.preventDefault();
            this.blur();
            var targetId = $attrs.scrollTo;

            targetElement = document.getElementById(targetId);
            if(!targetElement) return; 

            smoothScroll(targetElement, {});

            return false;
          });
        }
      };
    }
  )
;
angular.module('resourceMap')
  .directive('map', [
    function(){
      return {
        restrict: 'EA',
        replace: true,
        scope: {
          mapReady: "="
        },
        template: '<div></div>',
        link: function ($scope, $element, $attrs){
          L.mapbox.accessToken = "pk.eyJ1IjoibWV0YXRyb2lkIiwiYSI6ImNpbjB5bjA0NjBhbzd1cmtrcTA2a2p3MzcifQ.66Stn21WtMpGU9lV2FoS6Q";
          var map = L.mapbox.map($element[0], 'metatroid.pmafo9i6', {
            maxZoom: 15,
            minZoom: 3
          });
          $scope.mapReady(map);
          $element.on('click', function(){
            var box = document.getElementById("autocomplete");
            box.innerHTML = "";
          });
        }
      };
    }
  ])
;
/* jshint expr: true */
angular.module('resourceMap')
  .directive('menuTrigger', ['$timeout',
    function($timeout){
      return {
        restrict: 'A',
        link: function ($scope, $element, $attrs){
          var support = {
            transitions: Modernizr.csstransitions
          };
          var transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
              transEndEventName = transEndEventNames[Modernizr.prefixed('transition')],
              onEndTransition = function(el, callback){
                var onEndCallbackFn = function(ev){
                  if(support.transitions){
                    if(ev.target !== this){
                      return;
                    }
                    this.removeEventListener(transEndEventName, onEndCallbackFn);
                  }
                  if(callback && typeof callback === 'function'){
                    callback.call(this);
                  }
                };
                if(support.transitions){
                  el.addEventListener(transEndEventName, onEndCallbackFn);
                } else {
                 onEndCallbackFn();
                }
              };
          waitForEl("#views", function(){
            var stack = document.querySelector('#views'),
                pages = [].slice.call(stack.children),
                pagesTotal = pages.length,
                current = 0,
                menuCtrl = document.querySelector('#menu-btn'),
                nav = document.querySelector('#siteNav'),
                navItems = [].slice.call(nav.querySelectorAll(".link-page"));
            isMenuOpen = false;
            function reInit(){
              if(pages.length < 1){
                pages = [].slice.call(stack.children),
                pagesTotal = pages.length,
                navItems = [].slice.call(nav.querySelectorAll(".link-page"));
                $timeout(reInit, 500);
              } else {
                init();
              }
            }
            function init(){
              buildStack();
              initEvents();
            }
            function buildStack(){
              var stackPagesIdxs = getStackPagesIdxs();
              for(var i=0;i<pagesTotal;++i){
                var page = pages[i],
                    posIdx = stackPagesIdxs.indexOf(i);
                if(current !== i){
                  page.classList.add("page-inactive");
                  if(posIdx !== -1){
                    page.style.WebkitTransform = "translate3d(0,100%,0)";
                    page.style.transform = "translate3d(0,100%,0)";
                  } else {
                    page.style.WebkitTransform = "translate3d(0,75%,-300px)";
                    page.style.transform = "translate3d(0,75%,-300px)";
                  }
                } else {
                  page.classList.remove("page-inactive");
                }
                page.style.zIndex = i < current ? parseInt(current -i) : parseInt(pagesTotal + current - i);
                if(posIdx !== -1){
                  page.style.opacity = parseFloat(1 - 0.1 * posIdx);
                } else {
                  page.style.opacity = 0;
                }
              }
            }
            function initEvents(){
              // for(var i=0;i<menuCtrl.length;i++){
                menuCtrl.addEventListener('click', toggleMenu);
              // }
              navItems.forEach(function(item){
                var pageId = item.getAttribute('href').slice(1);
                item.addEventListener('click', function(ev){
                  ev.preventDefault();
                  openPage(pageId);
                });
              });
              pages.forEach(function(page){
                var pageId = page.getAttribute('id');
                page.addEventListener('click', function(ev){
                  if(isMenuOpen){
                    ev.preventDefault();
                    openPage(pageId);
                  }
                });
              });
              document.addEventListener('click', function(e){
                // e.preventDefault();
                var targetContainer = document.getElementById('landing');
                if(targetContainer !== null && targetContainer.contains(e.target)){
                  openPage('page_map');
                  closeMenu();
                }
              });
              document.addEventListener('keydown', function(ev){
                if(!isMenuOpen){
                  return;
                }
                var keyCode = ev.keyCode || ev.which;
                if(keyCode === 27){
                  closeMenu();
                }
              });
            }
            function toggleMenu(){
              if(isMenuOpen){
                if(menuCtrl.classList.contains("open")){
                  closeMenu();
                } else {
                  isMenuOpen = true;
                  openMenu();
                }
              } else {
                isMenuOpen = true;
                openMenu();
              }
            }
            function openMenu(){
              // for(var i=0;i<menuCtrl.length;i++){
                menuCtrl.classList.add('open');
              // }
              stack.classList.add('open');
              nav.classList.add('open');
              if(document.getElementById("landing") !== null){
                document.getElementById("landing").parentNode.classList.add("menu-open");
              }
              var stackPagesIdxs = getStackPagesIdxs();
              for(var i=0;i<stackPagesIdxs.length;++i){
                var page = pages[stackPagesIdxs[i]];
                page.style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)'; // -200px, -230px, -260px
                page.style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)';
                page.style.top = '50px';
              }
            }
            closeMenu = function(){
              openPage();
            };
            function openPage(id){
              var futurePage = id ? document.getElementById(id) : pages[current],
                  futureCurrent = pages.indexOf(futurePage),
                  stackPagesIdxs = getStackPagesIdxs(futureCurrent);
              futurePage.style.WebkitTransform = 'translate3d(0, 0, 0)';
              futurePage.style.transform = 'translate3d(0, 0, 0)';
              futurePage.style.top = '0px';
              futurePage.style.opacity = 1;
              for(var i=0;i<stackPagesIdxs.length;++i){
                var page = pages[stackPagesIdxs[i]];
                page.style.WebkitTransform = "translate3d(0,100%,0)";
                page.style.transform = "translate3d(0,100%,0)";
              }
              if(id){
                current = futureCurrent;
              }
              // for(var i=0;i<menuCtrl.length;i++){
                menuCtrl.classList.remove('open');
              // }
              nav.classList.remove("open");
              if(document.getElementById("landing") !== null){
                document.getElementById("landing").parentNode.classList.remove("menu-open");
              }
              onEndTransition(futurePage, function(){
                if(!isMenuOpen){
                  stack.classList.remove("open");
                  buildStack();
                  isMenuOpen = false;
                  if(id === "page_map"){window.location.href = "/#/map";}
                }
              });
            }
            function getStackPagesIdxs(excludePageIdx){
              var nextStackPageIdx = current + 1 < pagesTotal ? current + 1 : 0,
                  nextStackPageIdx_2 = current + 2 < pagesTotal ? current + 2 : 1,
                  idxs = [],
                  excludeIdx = excludePageIdx || -1;
              if(excludePageIdx != current){
                idxs.push(current);
              }
              if(excludePageIdx != nextStackPageIdx){
                idxs.push(nextStackPageIdx);
              }
              if(excludePageIdx != nextStackPageIdx_2){
                idxs.push(nextStackPageIdx_2);
              }
              return idxs;
            }
            if(pages.length > 0){
              init();
            } else {
              reInit();
            }
          });
        }
      };
    }
  ])
;
angular.module('resourceMap')
  .directive('onFinishRender', 
    function($timeout){
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          if($scope.$last === true){
            $timeout(function(){
              $scope.$emit('ngRepeatFinished');
            });
          }
        }
      };
    }
  )
;
angular.module('resourceMap')
  .directive('locator', ['$http', '$cookies', '$compile',
    function($http, $cookies, $compile){
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          $element.on('keyup', function(e){
            var part = $element[0].value;
            var location = $cookies.get('location');
            var uri = "https://api.tiles.mapbox.com/geocoding/v5/mapbox.places/"+encodeURIComponent(part)+".json?access_token=pk.eyJ1IjoibWV0YXRyb2lkIiwiYSI6ImNpbjB5bjA0NjBhbzd1cmtrcTA2a2p3MzcifQ.66Stn21WtMpGU9lV2FoS6Q"+(typeof(location) !== "undefined" ? "&proximity="+JSON.parse(location).lng+","+JSON.parse(location).lat : "")+"&types=postcode,address";
            if(part.length > 0){
              $http({
                method: 'GET',
                url: uri
              }).success(function(data){
                var ul = document.getElementById("autocomplete");
                var htmlFrag = document.createDocumentFragment();
                // data.features[0].
                data.features.forEach(function(place){
                  var li = document.createElement("li");
                  li.innerHTML = "<a ng-click='mapLocator(\""+place.center+"\", \""+place.place_name+"\")'>"+place.place_name+"</a>";
                  htmlFrag.appendChild(li);
                });
                ul.innerHTML = "";
                ul.appendChild(htmlFrag);
                $compile(document.getElementById('autocomplete'))($scope);
              }).error(function(err){
                console.error(err);
              });
            } else {
              var ul = document.getElementById("autocomplete");
              ul.innerHTML = "";
            }
            if(e.which === 13){
              e.preventDefault();
              // setMapView(place.center)
            }
          });
        }
      };
    }
  ])
;
angular.module('resourceMap')
  .directive('slideshow', ['$timeout',
    function($timeout){
      return {
        restrict: 'EA',
        link: function ($scope, $element, $attrs){
          waitForEl('.comp-images', function(){
            var elem = document.querySelector('.comp-images');
            var flkty = new Flickity(elem, {
              imagesLoaded: true,
              wrapAround: true,
              prevNextButtons: false,
              pageDots: true,
              cellSelector: '.img',
              percentPosition: false
            });
          });
        }
      };
    }
  ])
;
angular.module('resourceMap.directives')
  .directive('toggleClass', 
    function(){
      return {
        restrict: 'A',
        link: function($scope, $element, $attrs){
          $element.on('click', function(e){
            e.preventDefault();
            var el = document.querySelector($attrs.toggleClassTarget);
            el.classList.add($attrs.toggleClass);
          });
        }
      };
    }
  )
;
angular.module('resourceMap.filters')
  .filter('telephone', 
    function(){
      return function(telephone){
        if(!telephone){
          return "";
        }
        var value = telephone.toString().trim().replace(/^\+/, '');
        if(value.match(/[^0-9]/)){
          return telephone;
        }
        var country, city, number;
        switch(value.length){
          case 10:
            country = 1;
            city = value.slice(0,3);
            number = value.slice(3);
            break;
          case 11:
            country = value[0];
            city = value.slice(1,4);
            number = value.slice(4);
            break;
          case 12:
            country = value.slice(0,3);
            city = value.slice(3,5);
            number = value.slice(5);
            break;
          default:
            return telephone;
        }
        if(country === 1){
          country = "";
        }
        number = number.slice(0, 3) + '-' + number.slice(3);
        return (country + " (" + city + ") " + number).trim();
      };
    }
  )
;
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
      apiSrv.getCampaigns = function(successFn, errorFn){
        return $http({
          method: 'GET',
          url: '/wp-json/wp/v2/campaign?per_page=100'
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
        var apiUrl = "https://maps.googleapis.com/maps/api/geocode/json?key="+apiKey+"&components=country:US&address="+lookup;
        return $http({
          method: 'GET',
          url: apiUrl
        }).success(successFn).error(errorFn);
      };
      return apiSrv;
    }
  ])
;
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
angular.module('resourceMap.states')
  .run(['$rootScope', 
        '$state', 
        '$stateParams', 
    function($rootScope, $state, $stateParams){
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ])
  .config(['$stateProvider', 
           '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider){
      var templateDir = '/wp-content/themes/workerslab/views';

      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('main', {
          url: '/',
          views: {
            'main': {
              templateUrl: templateDir + '/main.php'
            },
            'header':{
              templateUrl: templateDir + '/header.php'
            },
            'map@main': {
              templateUrl: templateDir + '/map.php'
            },
            'landing': {
              templateUrl: templateDir + '/landing.php'
            },
            'footer':{
              templateUrl: templateDir + '/footer.php'
            },
          }
        })
        .state('map', {
          url: '/map',
          views: {
            'main': {
              templateUrl: templateDir + '/main.php'
            },
            'header': {
              templateUrl: templateDir + '/header.php'
            },
            'map@map': {
              templateUrl: templateDir + '/map.php'
            },
            'footer':{
              templateUrl: templateDir + '/footer.php'
            }
          }
        })
        .state('map.companyView', {
          url: '/companies/:slug'
        })
      ;
    }
  ])
;