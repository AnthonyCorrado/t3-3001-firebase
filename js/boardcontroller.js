var mark = "X";
var turnNum = 0;

app.controller('boardController', function ($scope) {
	$scope.boxrows = [[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]];
	console.log($scope.boxrows);

	altTurn = function () {
		if (turnNum % 2 === 0) {
			mark = "O";
			// p2TimerReset();
		}
		else {
			mark = "X";
			// p1TimerReset();
		}
		turnNum += 1;
		console.log(mark);
		};

	$scope.makeMove = function(r, c) {
		cell = $scope.boxrows[r][c];
		if (!cell) {
      $scope.boxrows[r][c] = mark;
      altTurn();
    }
	};

});