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

   // describe('$scope.sendPost', function(){
   //   it('should be a function that invokes a save to the DB', function(){
   //     spyOn(DBActions, 'saveToDB');
   //     createController();
   //     Map.initMap();
   //     $scope.inputtedAddress = '611 Mission Street, San Francisco, CA, United States';
   //     $scope.user.item = 'testingbox';
   //     $scope.sendPost();
      
   //     expect(DBActions.saveToDB).toHaveBeenCalled();  
   //   });
   // });

   describe('the formatDate function', function() {
       it('formats a date to this format: mm/dd/yy', function() {
           expect(formatDate(new Date())).toEqual('2/28/16');
       });
   });

   // describe('the initMap function', function() {
   //     it('invokes the init', function() {
   //         spyOn(DBActions, 'filterDB');
   //         createController();
   //         DBActions.filterDB()
   //         expect(Map.initMap).toHaveBeenCalled();
   //     });

   // });

   describe('the formController', function(){
       
      describe('the dateAdjust function', function(){
           it('should be a function', function(){
               createController();
               expect(typeof $scope.dateAdjust).toBe('function');
           });
           it('should return an object with month date and year', function(){
               createController();
               expect ($scope.dateAdjust(new Date('February 09, 2016 03:12:12'))).toEqual({day: '09', month: '02', year: '16', start: 12, end: 13})
           });
       });

      describe('the clearForm function', function(){
           it('should be a function', function(){
               createController();
               expect(typeof $scope.clearForm).toBe('function');
           });
           it('should clear user and search', function(){
               createController();
               $scope.user='fish';
               $scope.search='fishStix';
               $scope.clearForm();
               expect($scope.user).toEqual({}); 
               expect($scope.search).toEqual({});
           });
       });

      describe('the ip function', function() {
        
        it('should start the spinner', function() {
            createController();
            spyOn(Map, 'startSpinner');
            $scope.ip();
            setTimeout(function() {
              expect(Map.startSpinner).toHaveBeenCalled();
            }, 2000);       
        });

        it('should stop the spinner', function() {
            createController();
            spyOn(Map, 'stopSpinner');
            $scope.ip();
            setTimeout(function() {
              expect(Map.stopSpinner).toHaveBeenCalled();
            }, 2000);  
        })
      });

      describe('the filter map function', function() {
        it('should invoke DBActions filterDB function', function(){
          createController();
          spyOn(DBActions, 'filterDB');
          $scope.search.input='test';
          $scope.filterMap();
          expect(DBActions.filterDB).toHaveBeenCalled();
        });
      });



        




   });

   describe('map Factory tests', function(){
       describe('initMap', function(){
           it('should be a function', function(){
               expect (typeof Map.initMap).toBe('function')
           });

           // it('should be invoked on success of load all items', function(){
           //     spyOn(Map, 'initMap');
           //     initMap();
           //     expect(Map.initMap).toHaveBeenCalled();
           // });
       });
   });

 
 });
});

