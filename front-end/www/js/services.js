angular.module('services', [])

  .factory('userFactory', function($http) {
    var token = localStorage.getItem("token");
    var reqResponse;
    var apiUrl = "https://api-friendlee.herokuapp.com/api/";

    return {
      getUsers: function(){
        return $http.get(apiUrl+"user/", {
          headers: {"x-access-token": token}
        }).then(function(response){
          console.log(response);
          reqResponse = response.data;
          return reqResponse;
        });
      },
      getUserById: function (userId) {
        return $http.get(apiUrl+"user/"+userId+"/getUserById", {
          headers: {"x-access-token": token}
        }).then(function(response){
          console.log(response);
          reqResponse = response.data;
          return reqResponse;
        });
      },
      getUserByUsername: function (username) {
        return $http.get(apiUrl+"user/"+username+"/getUserByUsername", {
          headers: {"x-access-token": token}
        }).then(function(response){
          console.log(response);
          reqResponse = response.data;
          return reqResponse;
        });
      },
      updateUser: function(userId, updateUserObject) {
        return $http({
          method: 'POST',
          url: apiUrl + 'user/'+userId+'/updatePassword',
          headers: {
            "x-access-token": token
          },
          data: updateUserObject
        }).then(function(response) {
          console.log(response);
          reqResponse = response.data;
          return reqResponse
        });
      },
      updatePassword: function(userId, updatePwdObject) {
        $http({
          method: 'POST',
          url: apiUrl + 'user/'+userId+'/updatePassword',
          headers: {
            "x-access-token": token
          },
          data: updatePwdObject
        }).then(function(response) {
          console.log(response);
          reqResponse = response.data;
          return reqResponse
        });
      },
      deleteUser: function(userId) {
        $http({
          method: 'POST',
          url: apiUrl + 'user/'+userId+'/deleteUser',
          headers: {
            "x-access-token": token
          }
        }).then(function(response) {
          console.log(response)
          reqResponse = response.data;
          return reqResponse;
        });
      }
    }
  })

  .factory('searchFactory', function($rootScope, $state, $http) {
    var apiUrl = "https://api-friendlee.herokuapp.com/api/";
    var token = localStorage.getItem("token");
    var reqResponse;

    return {
      searchMate: function(searchObject) {
        return $http({
          method: 'POST',
          url: apiUrl + 'search/searchMateByLikeName',
          data: searchObject,
          headers: {
            "x-access-token": token
          }
        }).then(function (response) {
          reqResponse = response.data;
          if(reqResponse.errorCode === 'E_USER_NOT_FOUND') {
            reqResponse = null;
          }
          return reqResponse;
        })
      },
      getSearch: function () {
        // console.log(reqResponse);
        return reqResponse || [];
      }
    }
  })

  .factory('registerFactory', function($rootScope, $state, $http) {
    var apiUrl = "https://api-friendlee.herokuapp.com/api/";
    return {
      register: function(user){
        $http({
          method: 'POST',
          url: apiUrl + 'user/register',
          data: user
        }).then(function(response) {
          // console.log(response);
          if(response.data.success == false)
            $rootScope.$broadcast('event:register-failed', response.data.message);
          else {
            $state.go('app.login', 'You are registered ! you can log into app :)');
          }
        });
      }
    }
  })

  .factory('authFactory', function($rootScope, $state, $http) {
    var apiUrl = "https://api-friendlee.herokuapp.com/api/";

    return {
      auth: function (userLog) {
        $http({
          url: apiUrl+'auth/authenticate',
          method: "POST",
          data: userLog
        }).then(function (response) {
          //console.log(response.data);
          if(response.data.success == false)
            $rootScope.$broadcast('event:auth-login-failed', response.data.message);
          else
            $rootScope.$broadcast('event:auth-loginConfirmed', response.data.token);
        })
      },
      check: function () {
        if(localStorage.getItem("token"))
          return true;
        else
          return false;
      },
      logout: function () {
        localStorage.clear();
        $state.go('app.login');
      }
    }
  })
