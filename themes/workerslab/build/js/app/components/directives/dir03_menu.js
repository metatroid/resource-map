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
                var target = document.querySelector('#landing .overlay-content > div');
                if(e.target.closest('#landing') !== null){
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
                closeMenu();
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
                stack.classList.remove("open");
                buildStack();
                isMenuOpen = false;
                if(id === "page_map"){window.location.href = "/#/map";}
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