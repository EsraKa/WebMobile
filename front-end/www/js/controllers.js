'use strict';

angular.module('starter.controllers', [])

  .controller('AppController', function ($scope, authFactory) {
    $scope.logout = function () {
      authFactory.logout();
    }
  })

  .controller('AuthController', function ($scope, $state, $stateParams, authFactory) {


    $scope.message = "";
    $scope.userLog = {
      email: "string@string.com",
      password: "test"
    };

    $scope.auth = function() {
      console.log('auth in progress ..');
      authFactory.auth($scope.userLog);
    };

    $scope.$on('event:auth-loginConfirmed', function(event, token) {
      console.log('auth confirmed, go to dashboard');
      console.log('store token in localStorage');
      localStorage.setItem("token", token);
      $scope.userLog.username = null;
      $scope.userLog.password = null;
      $state.go('app.dashboard');
    });

    $scope.$on('event:auth-login-failed', function(event, errorMessage) {
      console.log('cancel auth ...');
      console.log(errorMessage);
      $scope.message = errorMessage;
    });

    $scope.$on('event:no-token-provided', function(event, message) {
      $scope.message = message;
    });

  })
  .controller('LogoutCtrl', function($scope, $rootScope, $state, authFactory) {

  })

  .controller('RegisterController', function($scope, registerFactory){
    $scope.title = "Register";
    $scope.user = {};
    $scope.message = "";

    $scope.register = function() {
      registerFactory.register($scope.user);
    };

    $scope.$on('event:register-failed', function(event, message) {
      $scope.message = message;
    });

  })

  .controller('searchController', function($scope, $state, searchFactory){
    // $scope.users = {};
    $scope.message = "";
    //interests
    $scope.intCheckbox = [
      {text: "Cinema"},
      {text: "Shopping"},
      {text: "Party"},
      {text: "Trip"}
    ];
    $scope.intCheckedItem = {};
    //gender
    $scope.genCheckbox = [
      {id: 'M' ,text: "Homme"},
      {id: 'W' ,text: "Femme"}
    ];
    $scope.genCheckedItem = {}

    $scope.searchObject = {
      findString: "",
      interests: [],
      gender: []
    };


    $scope.search = function() {
      console.log('start search ...');
      var array = [];
      var array1 = [];
      for(var i in $scope.intCheckedItem) {
        // console.log($scope.intCheckedItem[i]);
        if($scope.intCheckedItem[i] == true) {
          array.push(i);
        }
      }
      for(var j in $scope.genCheckedItem) {
        // console.log($scope.genCheckedItem[i]);
        if($scope.genCheckedItem[j] == true) {
          array1.push(j);
        }
      }
      $scope.searchObject.gender = array1;
      $scope.searchObject.interests = array;

      // console.log($scope.searchObject);

      searchFactory.searchMate($scope.searchObject)
        .then(function (data) {
          console.log('front data',data);
          $state.go("app.searchResult");
        });
    };
  })

  .controller('searchResultController', function ($scope, searchFactory) {

    var data;
    $scope.users = [];
    $scope.message = "";
    data = searchFactory.getSearch();

    // console.log(data);
    if(data.length == 0) {
      $scope.users = [];
      $scope.message = "no Users found ..., please retry";
    }
    else {
      $scope.users = data;
    }
    // console.log($scope.users.length);
    // console.log($scope.message);


  })

  .controller('UserController', function ($scope, $state, userFactory) {

    // if(localStorage.getItem("token"))
    // {
    userFactory.getUsers().then(function(users){
      //users is an array of user objects
      $scope.users = users;
    });
    // }
    // else{
    //   $state.go("login");
    // }

  });






