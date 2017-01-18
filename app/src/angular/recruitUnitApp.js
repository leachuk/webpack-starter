'use strict';
/*Initialise app*/
var recruitUnitApp = angular.module('recruitUnitApp', [
  'ngMaterial',
  'ngResource',
  'ngCookies',
  'ngNewRouter',
  'loom.api',
  'ngLodash',
  'angularMoment',
  'angular-jwt',
  'app.homeController',
  'app.user.userLandingController',
  'recruitunit.util'
]).controller('AppController', ['$router', '$mdComponentRegistry', 'loomApi', 'recruitUnitUtil', 'jwtHelper', AppController])
.config(['$componentLoaderProvider', '$locationProvider', '$httpProvider', '$mdIconProvider', function($componentLoaderProvider, $locationProvider, $httpProvider, $mdIconProvider){
  $componentLoaderProvider.setTemplateMapping(function (name) {
    return 'src/angular/components/' + name + '/' + name + '.html';
  });
  $locationProvider.html5Mode(true);
}]);

function AppController($router, $mdComponentRegistry, loomApi, recruitUnitUtil, jwtHelper) {
  var sideNav;
  this.user = {
    email: "",
    password: ""
  };
  this.submitmessage = "";
  
  $mdComponentRegistry.when('sidenav-main').then(function(mainSideNav){
    sideNav = mainSideNav;
    //mainSideNav.open();
    //console.log(mainSideNav.isOpen());
  });
  //$mdSidenav('left').open();
  $router.config([
    { path: '/', redirectTo: '/home' },
    { path: '/home', component: 'home' },
    { path: '/user/:email', component: 'userLanding' }
  ]);

  AppController.prototype.initApp = function() {
    this.user.isLoggedIn = recruitUnitUtil.Util.isLocalUserLoggedIn();
    this.user.isDeveloper = recruitUnitUtil.Util.getUserRoles().indexOf(recruitUnitUtil.Constants.DEVELOPER_ROLE) != -1;
    if (this.user.isLoggedIn){
      this.user.email = recruitUnitUtil.Util.getLocalUser().email;
    }
  }

  AppController.prototype.test = function() {
    console.log("test");
  }

  AppController.prototype.toggleSideNav = function() {
    sideNav.toggle();
  }

  //login existing user
  AppController.prototype.signInUser = function(){
    console.log("in signInUser");
    console.log(this.user);

    loomApi.User.signInUser(this.user.email, this.user.password).then(angular.bind(this,function(result, status, headers, config) {
      console.log(result);
      console.log(status);
      console.log(headers);
      console.log(config);

      if (result.success) {
        recruitUnitUtil.Util.persistUserAuth(result.token, this.user.email);
        this.initApp();
        this.user.password = "";
        this.submitmessage = "";

        recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_USER + this.user.email);
      } else {
        recruitUnitUtil.Util.redirectUserToPath(recruitUnitUtil.Constants.PATH_HOME);
      }
    }));
  }

  AppController.prototype.signOutUser = function(){
    console.log("in signOutUser");
    recruitUnitUtil.Util.deleteUserAuth();
    recruitUnitUtil.Util.redirectUserToPath("/home");
  }

}


