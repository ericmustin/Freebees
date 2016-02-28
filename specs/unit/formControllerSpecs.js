// "use strict";
// // Do we need the below?
// var formController = require('../../client/app/controller.js');
// var assert = chai.assert;
// var should = chai.should();
// var expect = chai.expect;

// describe('FormController', function(){
//   var $scope, $rootScope, $http, createController, DBActions, Map;

//   beforeEach(module('myApp'));

//   beforeEach(inject(function($injector){
//     $rootScope = $injector.get('$rootScope');
//     DBActions = $injector.get('DBActions');
//     $http = $injector.get('$http');
//     Map = $injector.get('Map');
//     $scope = $rootScope.$new();

//     var $controller = $injector.get('$controller');

//     createController = function(){
//       return $controller('FormController', {
//         $scope: $scope,
//         DBActions: DBActions,
//         Map: Map
//       });
//     }
//   }));
//   describe('$scope.user', function(){
//     it('should be an object', function(){
//       createController();
//       expect(typeof $scope.user).toBe('object');    
//     });
// });