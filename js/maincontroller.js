app.controller("MainController", ['$scope', '$interval', function ($scope, $interval) {
		// sets the initial round clock
		$scope.timer = 30;
    var run;
    // sets function to start the round clock
    $scope.clock = function() {
    run = $interval(function() {
    // counts until reaches zero
      if ($scope.timer > 0) {
        $scope.timer = $scope.timer - 1;
      }
    }, 1000);
    clock();
  };
  // clock reset as post round action
  $scope.resetClock = function() {
    $scope.timer = 30;
  };
}]);