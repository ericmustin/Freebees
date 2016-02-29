var app = angular.module('myApp', ['map.services', 'ui.bootstrap','ngAnimate', 'ui.router', 'ngFileUpload'])

.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home',
  {
    templateUrl: "./home.html",
    url: '/home',
    controller: 'FormController'
  });

  $urlRouterProvider.otherwise('/home');
})
//dependencies injected include DBActions factory and Map factory
.controller('FormController', function($scope, $http, DBActions, DBWActions, Map, Upload){
$scope.user = {};
$scope.image={}
$scope.datepickers = {
        dt: false,
        dtSecond: false
      };
$scope.formData = {};
$scope.today = function() {
        $scope.formData.dt = new Date();
      };
$scope.today();

$scope.showWeeks = true;
$scope.toggleWeeks = function () {
$scope.showWeeks = ! $scope.showWeeks;
};

$scope.clear = function () {
  $scope.dt = null;
};
 // Disable weekend selection
$scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

$scope.toggleMin = function() {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
      };
      $scope.toggleMin();

      $scope.open = function($event, which) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepickers[which]= true;
      };

      $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
      $scope.format = $scope.formats[0];



      console.log($scope.formData.dt);


  $scope.dateAdjust = function(date) {
    var obj = {};
    obj.day = date.getDate();
    console.log(obj.day);
    if(obj.day < 10) {
      obj.day = '0'+obj.day;
    }

    obj.month = date.getMonth();
    obj.month+=1;
     if(obj.month < 10) {
      obj.month = '0'+obj.month;
    }
    obj.year = date.getYear().toString().slice(-2);
    obj.start = 12;
    obj.end = 13;
    return obj;
  };

  $scope.submit=function(){
    console.log('$scope.image.file', $scope.image.file);
    if($scope.image.file){
      console.log('in submit if statement');
      $scope.upload($scope.image.file);
    }else {
      sendPost();
    }
  };

  $scope.upload=function(file){
    Upload.upload({
      url: 'api/item/image',
      data: {file: file}
    })
    .success(function(response){
      console.log('line 99 of controller', response);
      $scope.sendPost(response)
    });
  };

  window.uberInfo = function(lat,lng,thing) {
    // console.log('holla?');
    if(navigator.geolocation){
        var latitude;
        var longitude;
        navigator.geolocation.getCurrentPosition(function(position){
            startLat = position.coords.latitude;
            startLng = position.coords.longitude;
     $http.post('/api/uber', {startLat: startLat, startLng: startLng, endLat: lat, endLng: lng})
      .then(function(data){

       thing.firstChild.data+=". An Uber Ride Here would now cost: "+data.data.bestPrice;
       


      }, function(err){
        console.log('Error when filterDB invoked - get from "/api/items" failed. Error: ', err);
      });
    });
      }
  };

  $scope.clearForm = function(){
    //need a way to clear addresses filled with autocomplete, angular doesn't detect autocomplete as a change in DOM
    if(document.getElementById('inputAddress') !== null) {
    document.getElementById('inputAddress').value = '';
     }
    $scope.user = {};
    $scope.search = {};

  };

  //define function within this controller to convert a string to lowerCase for standardization
  var convertToLowerCase = function(itemString){
    return itemString.toLowerCase();
  };

  $scope.sendPost = function(imageUrl){
    //convert inputted item name to lowerCase

    var lowerCaseItem = convertToLowerCase($scope.user.item);
    //convert inputted address, need to get value with JS bc angular can't detect autocomplete
    //
    $scope.inputtedAddress =  document.getElementById('inputAddress').value;
    Map.geocodeAddress(geocoder, Map.map, $scope.inputtedAddress, function(converted){
      //after address converted, save user input item and location to db
      DBActions.saveToDB({item: lowerCaseItem, LatLng: converted, createdAt: new Date(), eventTime: $scope.dateAdjust($scope.formData.dt), itemImageUrl: imageUrl});
    });
    $scope.clearForm();
  };

  $scope.sendMPost = function() {
    var lowerCaseWorker = $scope.user.worker.toLowerCase();

    $scope.inputtedAddress = document.getElementById('inputAddress').value;
    console.log($scope.formData.dt);
    Map.geocodeAddress(geocoder, Map.map, $scope.inputtedAddress, function(converted){
      //after address converted, save user input item and location to db
      DBWActions.saveToWDB({worker: lowerCaseWorker, LatLng: converted, createdAt: new Date(), eventTime: $scope.dateAdjust($scope.formData.dt)});
    });
    $scope.clearForm();

  };

  //this function filters map based on what user enters into filter field
  $scope.filterMap = function(){
    //convert inputted filter item to lowerCase so that matches with lowerCase values stored in db
    var lowerCaseFilterItem = convertToLowerCase($scope.search.input);
    var searchInput = lowerCaseFilterItem;
    DBActions.filterDB(searchInput);
    $scope.clearForm();
  };

  //this function retrieves everything from the database and renders a map on page
  //this would happen when user first visits page, when user submits an item, or when user deletes an item
  $scope.initMap = function(){
    Map.loadAllItems();
  };
  //removes a posting from the db and from the map
  $scope.removePost = function(){
    //convert inputted item name to lowerCase to match what's already in db
    var lowerCaseDeleteItem = convertToLowerCase($scope.user.item);
    //convert inputted address
    var inputtedAddress = document.getElementById('inputAddress').value;
    Map.geocodeAddress(geocoder, Map.map, inputtedAddress, function(converted){
      DBActions.removeFromDB({item: lowerCaseDeleteItem, LatLng: converted});
    });
    $scope.clearForm();
  };

  //fills in the address field with current lat/lng
  $scope.ip = function(){
    Map.startSpinner();
    //check for the HTML5 geolocation feature, supported in most modern browsers
    if (navigator.geolocation){
      //async request to get users location from positioning hardware
      navigator.geolocation.getCurrentPosition(function(position){
        //if getCurrentPosition is method successful, returns a coordinates object
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        if(document.getElementById('inputAddress') !== null) {
        document.getElementById('inputAddress').value = lat + ', ' + long;
        
        }
        console.log('sup playa');
        Map.stopSpinner();
      });
    } else {
      error('Geo Location is not supported');
    }
  };

  $scope.clearForm();
})

.factory('DBActions', function($http, Map){
  //the 'toSave' parameter is an object that will be entered into database,
  //'toSave' has item prop and LatLng properties
  var saveToDB = function(toSave){
    console.log('waddup1');
  return $http.post('/submit', toSave)

    //after item has been saved to db, returned data has a data property
    //so we need to access data.data, see below
    .then(function(data){
      console.log('waddup');
      Map.stopSpinner();
      //data.data has itemName prop, itemLocation prop, and _id prop, which are all expected since this is how
      //our mongoDB is formatted. Anything returned from db should have these props
      Map.addMarker(map, data.data, infoWindow);
      //the 'map' argument here is referencing the global map declared in app.js
      //this could be manipulated in chrome console by user. Future refactor could be to store
      //map within Map factory instead of global space.
    }, function(err){
      console.log('Error when saveToDB invoked - post to "/" failed. Error: ', err);
    });
  };

  //this function creates a new map based on filtering by whatever user enters in filter field
  //it is invoked within $scope.filterMap, see the above controller
  var filterDB = function(toFilterBy){

    //gets everything from the db in an obj referenced as data
    return $http.get('/api/items')
      .then(function(data){

        //filter our returned db by the desired itemName
        var filtered = data.data.filter(function(item){
          return item.itemName.indexOf(toFilterBy) > -1;
        });

        //re-initialize map with only these markers
        Map.initMap(filtered);
      }, function(err){
        console.log('Error when filterDB invoked - get from "/api/items" failed. Error: ', err);
      });
  };

  var removeFromDB = function(toRemove){
    return $http.post('/pickup', toRemove)
      .then(function(data){
        loadAllItems();
      }, function(err){
        console.log('Error when removeFromDB invoked - post to "/pickup" failed. Error: ', err);
      });
  };

  //the DBActions factory returns the below object with methods of the functions
  //defined above
  return {
    saveToDB: saveToDB,
    filterDB: filterDB,
    removeFromDB: removeFromDB
  };
})

.factory('DBWActions', function($http, Map) {
  var saveToWDB = function(saveWaa) {
    return $http.post('/submitWork', saveWaa)

    .then(function(data){
      Map.stopSpinner();
      console.log(data.data);
      console.log('were adding new marker');
      Map.addMarker(map, data.data, infoWindow);

    }, function(err){
      console.log('You f**cked up. Error: ', err);
    });
  };

  return {
    saveToWDB: saveToWDB
  };
});
