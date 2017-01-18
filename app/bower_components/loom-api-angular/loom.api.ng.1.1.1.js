'use strict';

angular.module('loom.api',[])
  .factory('loomApi', ['$resource', function ($resource) {

    var initAuth = function(authObj) {
      return "Bearer " + authObj;
    };

    //Config    
    var loomApiServer = null;
    var service = {
      protocol : "http",
      hostname : "localhost",
      port : "9000"
    };

    service.init = function(configObj) {
      if(Object.keys(configObj).length !== 0){
        for(var prop in arguments[0]){
          if(service.hasOwnProperty(prop)){
              service[prop]=arguments[0][prop];   
          }
        }
      }

      loomApiServer = service.protocol 
                    + "://" 
                    + service.hostname 
                    + ":" 
                    + service.port;
    }
    service.init({});

    //Article Service
    service.Article = {};
    service.Article.getArticle = function(id) {
      var r=$resource(loomApiServer + '/api/articles/getarticle/:id', {},
                      {
                          getArticle: { method: 'GET', params: { id: id }}
                      });

      return r.getArticle({id: id}).$promise.then(function(data) {
        return data;
      });
    };

    service.Article.saveArticle = function(modelData, modelId, auth) {
      console.log(modelData);
      var r=$resource(loomApiServer + '/api/articles/saveArticle', {},
                      {
                          saveArticle: { method: 'POST', params: {'modelId': modelId}, headers: {'Authorization': initAuth(auth)}}
                      });

      return r.saveArticle(modelData).$promise.then(function(data) {
        return data; 
      });
    };

    service.Article.listAllMyArticles = function() {
      var r=$resource(loomApiServer + '/api/articles/listMyArticles', {}, 
                      {
                          listAllMyArticles: {method: 'GET', isArray: true, params: {getAllData: false}}
                      });
      return r.listAllMyArticles().$promise.then(function(data){
        return data;
      });
    };

    service.Article.delete = function(id, rev) {
      console.log("delete, id:" + id + ", rev:" + rev);
      var r=$resource(loomApiServer + '/api/articles/deleteArticle', {}, 
                      {
                          deleteArticle: {method: 'POST', params: { id: id, rev: rev}}
                      });
      return r.deleteArticle().$promise.then(function(data){
        return data;
      });
    };

    service.Article.updateArticle = function(docData) {
      var r=$resource(loomApiServer + '/api/articles/updateArticle', {},
                      {
                          updateArticle: { method: 'Post', params: { updateData: docData }}
                      });

      return r.updateArticle({updateData: docData}).$promise.then(function(data) {
        return data;
      });
    };

    //User Service
    service.User = {};

    service.User.createNewUser = function(modelData){
      var r=$resource(loomApiServer + '/api/users/signup', {},
                      {
                          createNewUser: { method: 'Post', params: {}, headers: {} }
                      });

      return r.createNewUser(modelData).$promise.then(
        function(data) {
          return data;
        });
    };

    service.User.signInUser = function(username, password){
      var r=$resource(loomApiServer + '/api/users/signin', {},
                      {
                          signInUser: { method: 'Post', params: {username: username, password: password }}
                      });

      return r.signInUser({username: username, password: password }).$promise.then(
        function(success) {
          return success;
        },
        function(error){
          return error;
        });
    };

    service.User.getUser = function(userid, authToken) {
      var r=$resource(loomApiServer + '/api/users/getuser/:username', {},
        {
          getUser: { method: 'GET', params: {username: '' }, headers: {'Authorization': initAuth(authToken)}}
        });

      return r.getUser({username: userid}).$promise.then(function(data) {
        return data;
      });
    };

    service.User.getSpecifiedUser = function(userid, authToken) {
      var r=$resource(loomApiServer + '/api/users/getspecifieduser/:username', {},
        {
          getUser: { method: 'GET', params: {username: '' }, headers: {'Authorization': initAuth(authToken)}}
        });

      return r.getUser({username: userid}).$promise.then(function(data) {
        return data;
      });
    };

    return service;

  }]);
