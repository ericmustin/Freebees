describe('first describe', function() {
 
//module function is from ngMock module, which loads the module it's give
//so it's available in tests

 beforeEach(module('myApp'));

 describe('no idea? second describe', function(){
   var test;

   console.log('we running');
//inject lets us access the various controllers/factories
    beforeEach(inject(function($injector){
   $rootScope = $injector.get('$rootScope');
   DBActions = $injector.get('DBActions');
   $http = $injector.get('$http');
   Map = $injector.get('Map');
   $scope = $rootScope.$new();
//controller lets us accress the specific controller we want
   var $controller = $injector.get('$controller');

   createController = function(){
     return $controller('FormController', {
       $scope: $scope,
       DBActions: DBActions,
       Map: Map
     });
   };
   }));

   describe('$scope.user', function(){
     it('should be an object', function(){
       createController();
       expect(typeof $scope.user).toBe('object');    
       });
   });

   describe('$scope.sendPost', function(){
     it('should be a function', function(){
       createController();
       expect(typeof $scope.sendPost).toBe('function');    
     });
   });


   describe('the formatDate function', function() {
       it('formats a date to this format: mm/dd/yy', function() {
           expect(formatDate(new Date())).toEqual('2/27/16');
       });
   });

   describe('the formController', function(){
       describe('the dateAdjust function', function(){
           it('should be a function', function(){
            createController();
               expect(typeof $scope.dateAdjust).toBe('function');
           });
           it('should return an object with month date and year', function(){
               expect dateAdjust( Sat Feb 9 2016 10:26:16 GMT-0800 (PST) ).toEqual({day: 09, month: 02, year: 2016})
           });
       });
   });

  


 
 });
});