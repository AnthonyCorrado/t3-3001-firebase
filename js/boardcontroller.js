var windowWidth = $(window).width();
$.noConflict();
var mark = "X";
var turnNum = 0;
var p1ScoreIds = [0];
var p2ScoreIds = [0];
var p1Score = 0;
var p2Score = 0;
var timerExpire = 0;
var boxesFull = false;
var fxCall = "";
var leader = 0;

app.controller('boardController', ['$scope', '$interval', function ($scope, $interval) {
	$scope.boxrows = [[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]];

	$scope.score1 = p1ScoreIds;
	$scope.score2 = p2ScoreIds;
	$scope.halftimeShow = false;

	var grid = $scope.boxrows;
	console.log($scope.boxrows);
	console.log(p1ScoreIds.length);

	$scope.startGame = function() {
		// bases countdown on window width
		emScaler = windowWidth * 0.028;
		$('.startScreen').fadeOut(1000);
			$('.gameStartCountdown3').fadeIn(500);
			$('.large-text3').animate({'font-size' : emScaler + 'em'}, 1000);
			$('.large-text3').fadeOut(1000);
			$('.gameStartCountdown2').delay(1700).fadeIn(500);
			$('.large-text2').delay(1700).fadeIn(500);
			$('.large-text2').animate({'font-size' : emScaler + 'em'}, 1000);
			$('.large-text2').delay(2700).fadeOut(1000);
			$('.gameStartCountdown1').delay(3500).fadeIn(500);
			$('.large-text1').delay(3500).fadeIn(500);
			$('.large-text1').animate({'font-size' : emScaler + 'em'}, 1000);
			$('.large-text1').fadeOut(1000);
			$('.gameStartCountdown3').delay(1600).fadeOut(300);
			$('.gameStartCountdown2').delay(1600).fadeOut(300);
			$('.gameStartCountdown1').delay(1600).fadeOut(300);
		setTimeout($scope.clock, 6000);
	};
	
	var roundOver = function() {
    var box = $scope.boxrows;
      if ((box[0][5] == "X" || box[0][5] == "O") && (box[0][6] == "X" || box[0][6] == "O") && (box[0][7] == "X" || box[0][7] == "O") && (box[1][5] == "X" || box[1][5] == "O") && (box[1][6] == "X" || box[1][6] == "O") && (box[1][7] == "X" || box[1][7] == "O") && (box[2][5] == "X" || box[2][5] == "O") && (box[2][6] == "X" || box[2][6] == "O") && (box[2][7] == "X" || box[2][7] == "O")) {
      boxesFull = true;
        // if (gameRound === 1) {
        //   $timeout(gameReset, 5000);
        //   setTimeout(function() {halftimeSummary();}, 2000);
        //   gameRound += 1;
        // }
        // else {
        //   setTimeout(function() {determineWinner();}, 2000);
        // }
      }
	};
	$scope.shotclock = 5;
  // sets function to start the round clock
  $scope.countdown = function() {
    run = $interval(function() {
    // counts until reaches zero
      if ($scope.shotclock > 0) {
        $scope.shotclock = $scope.shotclock - 1;
      }
    }, 1000);
  };
  $scope.countdown();
  
	altTurn = function () {
		if (turnNum % 2 === 0) {
			mark = "O";
			$scope.countdown();
		}
		else {
			mark = "X";
			console.log($scope.countdown());
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
      roundOver();
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
						isScoreIndexUnique(p2Index);
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
					isScoreIndexUnique(p2Index);
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
					isScoreIndexUnique(p2Index);
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
	function halftimeSummary() {
		halftimeSummary = Function("");
		$scope.halftimeShow = true;
		if (p1Score > p2Score) {
			leader = 1;
		}
		else if (p2Score > p1Score) {
			leader = 2;
		}
		else {
			leader = 0;
		}
		specialFX('half');
	}

	// main clock and timer section ---------------------------------------->
	// sets the initial round clock
  $scope.timer = 30;
  var run;
  var boardPosition = 21.6;
  // sets function to start the round clock
  $scope.clock = function() {
    run = $interval(function() {
      if ($scope.timer === 0 || boxesFull === true) {
        halftimeSummary();
      }
    // counts until reaches zero
      else if ($scope.timer > 0) {
        $scope.timer = $scope.timer - 1;
        if($scope.timer % 5 === 0 && $scope.timer > 0){
          shiftBoard();
        }
      }
    }, 1000);
  };
// function resets game timer after first round
  var resetClock = function() {
    $scope.timer = 30;
  };
// clock reset as post round action
// shifting of the board ------------------------->
  shiftBoard = function(){
    $('.board-container').animate({'margin-left' : boardPosition + '%'});
    boardPosition -= 8.45;
    };
}]);

// special fx and animation section --------------------------->

function specialFX(fx){
	fxCall = fx;
	jQuery( document ).ready(function( $ ) {
		var flexFont = windowWidth * 0.052;
		if (fxCall == 'half') {
			console.log('once')
			$('.fx-text').fadeIn(1500)
			.css({'font-size' : flexFont});
  $('.fxScreen').animate({'background-color':'rgba(0, 20, 0, .5)'}, 1000);
	$('.decoration-bar').delay(2000).css({'box-shadow' : '0px 30px 20px 0px rgba(0,0,0,0.8)'});
			if(leader === 1){
				$('.fxScreen').delay(2000).animate({'background-color' : 'rgba(22, 120, 255, .5)' }, 1000);
				setTimeout(function(){
					$('.player1Lead').css({'text-shadow' : '3px 3px 3px rgba(22, 120, 255, 1)'})
					.css({'font-size' : flexFont});
					$('.fx-text').fadeOut(690);
					$('.player1Lead').delay(700).fadeIn(1000);
					$('.decoration-bar').css({'border' : '2px solid rgba(22, 120, 255, .7)'}, 'fast');
				}, 3000);
			}
			else if (leader === 2) {
				$('.fxScreen').delay(2000).animate({'background-color' : 'rgba(111, 50, 177, .5)' }, 1000);
				setTimeout(function(){
					$('.player2Lead').css({'text-shadow' : '3px 3px 3px rgba(111, 50, 177, 1)'})
					.css({'font-size' : flexFont});
					$('.fx-text').fadeOut(690);
					$('.player2Lead').delay(700).fadeIn(1000);
					$('.decoration-bar').css({'border' : '2px solid rgba(111, 50, 177, .7)'}, 'fast');
				}, 3000);
			}
			else {
				alert('tie');
			}
		}
		else if (fxCall === 'end') {
			console.log('once');
			$('.fxScreen').animate({'background-color' : 'blue' }, 1000);
		}
	});
}
// end of jQuery section. Life gets boring from here --------------------->