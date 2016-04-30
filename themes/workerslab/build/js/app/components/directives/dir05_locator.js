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
            $http({
              method: 'GET',
              url: uri
            }).success(function(data){
              var ul = document.getElementById("autocomplete");
              var htmlFrag = document.createDocumentFragment();
              // data.features[0].
              data.features.forEach(function(place){
                var li = document.createElement("li");
                li.innerHTML = "<a ng-click='setMapView("+place.center+")'>"+place.place_name+"</a>";
                htmlFrag.appendChild(li);
              });
              ul.innerHTML = "";
              ul.appendChild(htmlFrag);
              $compile(document.getElementById('autocomplete'))($scope);
            }).error(function(err){
              console.error(err);
            });
          });
        }
      };
    }
  ])
;