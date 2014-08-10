var mark = "X";
var turnNum = 0;
var p1ScoreIds = [0];
var p2ScoreIds = [0];
var p1Score = 0;
var p2Score = 0;


app.controller('boardController', ['$scope', '$interval', function ($scope, $interval) {
	$scope.boxrows = [[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]];

	$scope.score1 = p1ScoreIds;
	$scope.score2 = p2ScoreIds;

	var grid = $scope.boxrows;
	console.log($scope.boxrows);
	console.log(p1ScoreIds.length);

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
		};

	$scope.makeMove = function(r, c) {
		cell = $scope.boxrows[r][c];
		if (!cell) {
      $scope.boxrows[r][c] = mark;
      horizontalScoreCheck(mark);
      verticalScoreCheck(mark);
      diagonalScoreCheck(mark);
      altTurn();
      scoreTally();
    }
	};

	var horizontalScoreCheck = function(mark) {
		var r = 0; var c = 0; var p1Index = 100; var p2Index = -100;
		var marks = mark + mark + mark;
		for (r; r < 3; r++) {
			for (c = 0; c < 6; c++) {
				if (grid[r][c] + grid[r][c+1] + grid[r][c+2] == marks) {
					if (marks == "XXX") {
						isScoreIndexUnique(p1Index);
					}
					else {
						p2ScoreIds.push(p2Index);
					}
				}
				p1Index++; p2Index--;
			}
		}
		console.log(p2ScoreIds + 'p2');
		console.log(p1ScoreIds + 'p1');
	};

	var verticalScoreCheck = function(mark) {
		var r = 0; var c = 0; var p1Index = 200; var p2Index = -200;
		var marks = mark + mark + mark;
		for (c; c < 8; c++) {
			if (grid[r][c] + grid[r+1][c] + grid[r+2][c] == marks) {
				if (marks == "XXX") {
					isScoreIndexUnique(p1Index);
				}
				else {
					p2ScoreIds.push(p2Index);
				}
			}
			p1Index++; p2Index--;
		}
		console.log(p2ScoreIds + 'p2');
		console.log(p1ScoreIds + 'p1');
	};

	var diagonalScoreCheck = function(mark) {
		var r = 0; var c = 0; var p1Index = 300; var p2Index = -300;
		var marks = mark + mark + mark;
		for (c; c < 6; c++) {
			if (grid[r][c] + grid[r+1][c+1] + grid[r+2][c+2] == marks) {
				if (marks == "XXX") {
					isScoreIndexUnique(p1Index);
				}
				else {
					isScoreIndexUnique(p2Index);
				}
			}
			p1Index++; p2Index--;
		}
		p1Index = 350; p2Index = -350;
		for (c = 0; c < 6; c++) {
			if (grid[r+2][c] + grid[r+1][c+1] + grid[r][c+2] == marks) {
				if (marks == "XXX") {
					isScoreIndexUnique(p1Index);
				}
				else {
					p2ScoreIds.push(p2Index);
				}
			}
			p1Index++; p2Index--;
		}
		console.log(p2ScoreIds + 'p2');
		console.log(p1ScoreIds + 'p1');
	};

	var isScoreIndexUnique = function(index) {
		if (index > 0) {
			x = p1ScoreIds;
		}
		else if (index < 0) {
			x = p2ScoreIds;
		}
		duplicate = false;
		for (i = 0; i < x.length; i++) {
			if (index == x[i]) {
				duplicate = true;
				break;
			}
		}
		if (!duplicate) {
			x.push(index);
			scoreTally();
			console.log(p1ScoreIds + 'p1 unique');
			console.log(p2ScoreIds + 'p2 unique');
		}
	};

	var scoreTally = function() {
		p1Score = p1ScoreIds.length - 1;
		p2Score = p2ScoreIds.length - 1;
	};

	$scope.shotclock = 5;
  var run;
  // sets function to start the round clock
  $scope.countdown = function() {
    run = $interval(function() {
    // counts until reaches zero
      if ($scope.shotclock > 0) {
        $scope.shotclock = $scope.shotclock - 1;
      }
    }, 1000);
  };

}]);