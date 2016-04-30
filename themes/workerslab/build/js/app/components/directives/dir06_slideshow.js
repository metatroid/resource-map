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