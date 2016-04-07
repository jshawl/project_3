"use strict";

(function(){
  angular
  .module("trips", [
    "ui.router",
    "ngResource"
  ])
  .config([
    "$stateProvider",
    RouterFunction
  ])
  .config(["$sceProvider", function($sceProvider){
   $sceProvider.enabled(false);
 }])
  .factory( "Trip", [
    "$resource",
    Trip
  ])
  .factory( "SearchFactory", [
    "$resource",
    SearchFactory
  ])
  .factory( "LocationFactory", [
    "$resource",
    LocationFactory
  ])
  .controller("indexCtrl", [
    "SearchFactory",
    "Trip",
    indexControllerFunction
  ])
  .controller( "tripNewCtrl", [
    "Trip",
    "$stateParams",
    tripFormFunction
  ])
  .controller( "tripEditCtrl", [
    "Trip",
    "$stateParams",
    tripEditControllerFunction
  ])
  .controller( "tripShowCtrl", [
    "SearchFactory",
    "Trip",
    "$stateParams",
    "LocationFactory",
    "$window",
    showCtrlFunction
  ])
  // .controller("locationNewController", [
  //   "Trip",
  //   "$stateParams",
  //   "LocationFactory",
  //   locationNewControllerFunction
  // ])
  .directive("tripForm",[
    "Trip",
    "$state",
    tripFormDirectiveFunction
  ]);

  function showCtrlFunction( Search, Trip, $stateParams, LocationFactory, $window ){
    var showVM = this;
    showVM.trip = Trip.get({id: $stateParams.id});
    showVM.search = function() {
      showVM.places = Search.query({q:showVM.query}, function(results){
        showVM.places = results;
      })
    };
    showVM.location = new LocationFactory();
    showVM.createLocation = function(trip_id, name, lat, long, place_id){
      showVM.location.$save({trip_id: trip_id, name: name, lat: lat, long: long, place_id: place_id});
      $window.location.reload();
    }
  };

  function indexControllerFunction( Search, Trip ){
    var indexVM = this;
    indexVM.trips = Trip.all;
  };

  function Trip( $resource ){
    var Trip = $resource( "http://localhost:3000/trips/:id.json", {}, {
      update: {
        method: "PUT",
        isArray: true
      },
    });
    Trip.all = Trip.query();
    return Trip;
  };

  function SearchFactory( $resource ){
    var Search = $resource( "http://localhost:3000/trips/1/locations/search", {}, {
      query: {
        method: "GET",
        isArray: true
      },
    });
    Search.all = Search.query()
    return Search;
  };

  function LocationFactory( $resource ){
    var Location = $resource( "http://localhost:3000/trips/:trip_id/locations/:id", {trip_id: "@trip_id"}, {
      update: {
        method: "PUT"
      }
    });
    return Location;
  }

  function RouterFunction($stateProvider){
    $stateProvider
    .state("tripIndex", {
      url: "/trips",
      templateUrl: "/ng-views/trip.index.html",
      controller: "indexCtrl",
      controllerAs: "indexVM"
    })
    .state("tripNew", {
      url: "/trips/new",
      templateUrl: "/ng-views/trip.new.html",
      controller: "tripNewCtrl",
      controllerAs: "tripNewVM"
    })
    .state("tripEdit", {
      url: "/trips/:id/edit",
      templateUrl: "/ng-views/trip.edit.html",
      controller: "tripEditCtrl",
      controllerAs: "tripEditVM"
    })
    .state("tripShow", {
      url: "/trips/:id",
      templateUrl: "/ng-views/trip.show.html",
      controller: "tripShowCtrl",
      controllerAs: "tripShowVM"
    })
  };
  function tripFormDirectiveFunction(Trip, $state){
    return{
      templateUrl: "/ng-views/_trip_form.html",
      restrict: "C",
      scope: {
        trip: "=",
        formType: "@",
      },
      link: function(scope){
        scope.create = function(){
          Trip.save(scope.trip, function(response){
            Trip.all.push(response);
            $state.go("tripShow", {id: response.id});
          });
        }
        scope.update = function(){
          Trip.update({id: scope.trip.id}, scope.trip, function(response){
          })
        }
        scope.delete = function(){
          Trip.delete({id: scope.trip.id}, scope.trip, function(response){
            console.log("Success")
          })
        }
      }
    }
  }

  function tripFormFunction(){

  }

  function tripEditControllerFunction( Trip, $stateParams ) {
    this.trip = Trip.get({id: $stateParams.id});
  }
})();
