// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.controllers', 'services'])

  .run(function($ionicPlatform, $rootScope, $state, authFactory) {

    $ionicPlatform.ready(function() {

      if(window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });

    $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
      // console.log(toState.url);
      $rootScope.isLogged = authFactory.check();
      // console.log($rootScope.isLogged);
      if(toState.url === '/' || toState.url === '/login' || toState.url === '/register') {
        console.log('public routes, no token needed');
      }
      else {
        if(!authFactory.check()) {
          console.log('no token provided ...');
          e.preventDefault();
          $rootScope.$broadcast('event:no-token-provided', 'no token provided ... please, log into app');
          $state.go('app.login');
        }
        else {
          console.log('token provided, gogo');
        }
      }
    });
  })

  /*
   .config(function ($stateProvider, $urlRouterProvider) {
   $urlRouterProvider.otherwise('/login');

   $stateProvider
   .state('register',{
   cache: false,
   url:'/register',
   templateUrl: 'templates/register.html',
   controller: 'RegisterController'
   })
   .state('login',{
   cache: false,
   url: '/login',
   templateUrl: 'templates/login.html',
   controller: 'AuthController'
   })
   .state('dashboard', {
   url: '/dashboard',
   templateUrl: 'templates/dashboard.html',
   controller: 'LogoutCtrl'
   })
   .state('search', {
   url: '/search',
   templateUrl: 'templates/search.html',
   controller: 'searchController'
   })
   .state('profile', {
   url: '/profile',
   templateUrl: 'templates/profile.html'
   })
   .state('users', {
   url: '/users',
   templateUrl: 'templates/users.html',
   controller: 'UserController'
   })
   .state('otherwise', {
   url: '/login',
   templateUrl: 'templates/login.html'
   })

   });
   */


  .config(function ($stateProvider, $urlRouterProvider) {


    $stateProvider
      .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppController'
      })
      .state('app.register',{
        url:'/register',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/register.html',
            controller: 'RegisterController'
          }
        }
      })
      .state('app.login',{
        url: '/login',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'AuthController'
          }
        }
      })
      .state('app.dashboard', {
        url: '/dashboard',
        views: {
          'menuContent': {
            templateUrl: 'templates/dashboard.html'
          }
        }
      })
      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'searchController'
          }
        }
      })
      .state('app.searchResult', {
        url: '/searchResult',
        views: {
          'menuContent': {
            templateUrl: 'templates/searchResult.html',
            controller: 'searchResultController'
          }
        }
      })
      .state('app.profile', {
        url: '/profile',
        views: {
          'menuContent': {
            templateUrl: 'templates/profile.html'
          }
        }
      })
      .state('app.users', {
        url: '/users',
        views: {
          'menuContent': {
            templateUrl: 'templates/users.html',
            controller: 'UserController'
          }
        }
      });
    /* .state('app.otherwise', {
     url: '/',
     templateUrl: 'templates/login.html'
     })
     */

    $urlRouterProvider.otherwise('/app/login');
  });
