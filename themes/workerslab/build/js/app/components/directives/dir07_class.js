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