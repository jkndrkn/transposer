var app = angular.module('transposerApp', []);

app.controller('MainCtrl', function MainCtrl($scope, $log) {
  var transposer = new Transposer();
  $scope.name = 'World';

  $scope.transpose = function(userInput) {
    $scope.results = transposer.transposedScales(userInput, transposer.notesSharps);
  };
});
