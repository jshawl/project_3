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
  .factory( "TripFactory", [
    "$resource",
    TripFactory
  ])
  .factory( "SearchFactory", [
    "$resource",
    SearchFactory
  ])
  .controller("indexCtrl", [
    "SearchFactory",
    "TripFactory",
    indexControllerFunction
  ])
  .controller( "showCtrl", [
    "SearchFactory",
    "TripFactory",
    "$stateParams",
    showStrlFunction
  ]);

  function showStrlFunction( TripFactory, $stateParams ){
  this.trip = TripFactory.get({id: $stateParams.id});
  };

  function indexControllerFunction( Search, Trip ){
    var indexVM = this;
    indexVM.trips = Trip.all;
    indexVM.search = function() {
      indexVM.places = Search.query({q:indexVM.query}, function(results){
        indexVM.places = results;
        console.log(results)
      })
    }
  };

  function TripFactory( $resource ){
    var Trip = $resource( "http://localhost:3000/trips/:id.json", {}, {
      update: { method: "PUT" }
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

  function RouterFunction($stateProvider){
    $stateProvider
    .state("tripIndex", {
      url: "/trips",
      templateUrl: "ng-views/trip.index.html",
      controller: "indexCtrl",
      controllerAs: "indexVM"
    })
    .state("show", {
      url: "/trips/:id",
      templateUrl: "ng-views/trip.show.html",
      controller: "showCtrl",
      controllerAs: "showVM"
    })
  };
})();
