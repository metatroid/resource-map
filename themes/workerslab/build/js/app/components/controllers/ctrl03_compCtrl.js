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