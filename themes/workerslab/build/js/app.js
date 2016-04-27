angular.module('resourceMap', [
               'ngMaterial',
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
  .config(['$httpProvider', '$compileProvider', '$mdThemingProvider', function($httpProvider, $compileProvider, $mdThemingProvider){
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|mailto|tel):/);
    $mdThemingProvider.theme('default')
      .primaryPalette('grey')
      .accentPalette('blue-grey');
    $mdThemingProvider.theme('docs-dark', 'default')
      .primaryPalette('yellow')
      .dark();
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
            'header@main':{
              templateUrl: templateDir + '/header.php'
            },
            'map@main': {
              templateUrl: templateDir + '/map.php'
            },
            'footer@main':{
              templateUrl: templateDir + '/footer.php'
            },
          }
        })
      ;
    }
  ])
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
          var map = L.mapbox.map($element[0], 'metatroid.pmafo9i6');
          $scope.mapReady(map);
        }
      };
    }
  ])
;
angular.module('resourceMap')
  .directive('menuTrigger', [
    function(){
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
              },
              stack = document.querySelector('#views'),
              pages = [].slice.call(stack.children),
              pagesTotal = pages.length,
              current = 0,
              menuCtrl = document.querySelector('.toggle-btn'),
              nav = document.querySelector('#siteNav'),
              navItems = [].slice.call(nav.querySelectorAll(".link-page")),
              isMenuOpen = false;
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
                  page.style.transform = "translate3d(0,100%,0)";
                } else {
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
            menuCtrl.addEventListener('click', toggleMenu);
            navItems.forEach(function(item){
              var pageId = item.getAttribute('href').slice(1);
              item.addEventListener('click', function(ev){
                console.log(pageId);
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
              closeMenu();
            } else {
              openMenu();
              isMenuOpen = true;
            }
          }
          function openMenu(){
            menuCtrl.classList.add('open');
            stack.classList.add('open');
            nav.classList.add('open');
            var stackPagesIdxs = getStackPagesIdxs();
            console.log(pages);
            for(var i=0;i<stackPagesIdxs.length;++i){
              var page = pages[stackPagesIdxs[i]];
              page.style.transform = "translate3d(0,75%,"+parseInt(-1 * 400 - 100 * i)+"px";
            }
          }
          function closeMenu(){
            openPage();
          }
          function openPage(id){
            var futurePage = id ? document.getElementById(id) : pages[current],
                futureCurrent = pages.indexOf(futurePage),
                stackPagesIdxs = getStackPagesIdxs(futureCurrent);
            futurePage.style.transform = 'translate3d(0, 0, 0)';
            futurePage.style.opacity = 1;
            for(var i=0;i<stackPagesIdxs.length;++i){
              var page = pages[stackPagesIdxs[i]];
              page.style.transform = "translate3d(0,100%,0)";
            }
            if(id){
              current = futureCurrent;
            }
            menuCtrl.classList.remove("open");
            nav.classList.remove("open");
            onEndTransition(futurePage, function(){
              stack.classList.remove("open");
              buildStack();
              isMenuOpen = false;
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
          init();
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
      }
    }
  )
;