var mark = "X";
var turnNum = 0;
var p1ScoreIds = [];
var p2ScoreIds = [];

app.controller('boardController', function ($scope) {
	$scope.boxrows = [[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]];
	var grid = $scope.boxrows;
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
		};

	$scope.makeMove = function(r, c) {
		cell = $scope.boxrows[r][c];
		if (!cell) {
      $scope.boxrows[r][c] = mark;
      horizontalScoreCheck(mark);
      verticalScoreCheck(mark);
      diagonalScoreCheck(mark);
      altTurn();
    }
	};

	var horizontalScoreCheck = function(mark) {
		var r = 0; var c = 0; var p1Index = 100; var p2Index = -100;
		var marks = mark + mark + mark;
		for (r; r < 3; r++) {
			for (c = 0; c < 6; c++) {
				if (grid[r][c] + grid[r][c+1] + grid[r][c+2] == marks) {
					if (marks == "XXX") {
						p1ScoreIds.push(p1Index);
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
		var r = 0; var c = 0; var p1Index = 110; var p2Index = -110;
		var marks = mark + mark + mark;
		for (c; c < 8; c++) {
			if (grid[r][c] + grid[r+1][c] + grid[r+2][c] == marks) {
				if (marks == "XXX") {
					p1ScoreIds.push(p1Index);
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
		var r = 0; var c = 0; var p1Index = 120; var p2Index = -120;
		var marks = mark + mark + mark;
		for (c; c < 6; c++) {
			if (grid[r][c] + grid[r+1][c+1] + grid[r+2][c+2] == marks) {
				if (marks == "XXX") {
					p1ScoreIds.push(p1Index);
				}
				else {
					p2ScoreIds.push(p2Index);
				}
			}
			p1Index++; p2Index--;
		}
		p1Index = 130; p2Index = -130;
		for (c = 0; c < 6; c++) {
			if (grid[r+2][c] + grid[r+1][c+1] + grid[r][c+2] == marks) {
				if (marks == "XXX") {
					p1ScoreIds.push(p1Index);
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

});