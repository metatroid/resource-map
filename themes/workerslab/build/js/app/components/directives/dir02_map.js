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
          $element.on('click', function(){
            var box = document.getElementById("autocomplete");
            box.innerHTML = "";
          });
        }
      };
    }
  ])
;