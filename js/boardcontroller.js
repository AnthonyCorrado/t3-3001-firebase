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
var flexFont = windowWidth * 0.044;
var multiplier = 1.7;
var markerSize = windowWidth * 0.035;
var emScaler = windowWidth * 0.024;
var roundCount = 1;
var boardPosition2 = -12.2;
var clockBreak = true;

$(window).ready(function() {
	fontScaler();
	if (windowWidth > 800 && windowWidth < 1200) {
		$('.sub-font-scale').css({'font-size' : windowWidth * 0.024 });
	}
	else if (windowWidth < 801)	{
		$('.sub-font-scale').css({'font-size' : windowWidth * 0.035 });
	}
	else {
		$('.sub-font-scale').css({'font-size' : windowWidth * 0.025 });
	}
});
$(function() {
    FastClick.attach(document.body);
});

app.controller('boardController', ['$scope', '$interval', function ($scope, $interval) {
	$scope.boxrows = [[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]];

	$scope.timer = 0;

	clearBoard = function() {
		$scope.boxrows = [[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]];
		grid = $scope.boxrows;
	};

	$scope.score1 = p1ScoreIds;
	$scope.score2 = p2ScoreIds;
	$scope.halftimeShow = false;
	$scope.introShow = false;

	var grid = $scope.boxrows;
	console.log($scope.boxrows);
	console.log(p1ScoreIds.length);

// ------------- cues up game and starts intro animations -------------->
	$scope.startGame = function() {
		$scope.roundStart();
		// bases countdown size on window width		
		if (windowWidth < 801) {
			multiplier *= 1.3;
		}
		$('.wave1-bar').fadeIn(1000);
		$('.wave1-bar').css({'height' : flexFont * multiplier});
		$scope.introShow = true;
		$('.startScreen').fadeOut(1000);
		$('.fxScreenOpen').delay(1000).fadeIn(1000);
		$('.wave1Start').delay(1500).fadeIn(1000);
		$('.wave1Start').css({'font-size' : flexFont });
		// $('.wave1-bar').delay(2500).fadeOut(2000);
		$('.fxScreenOpen').delay(2000).fadeOut(2000);
		// $('.wave1Start').delay(2500).fadeOut(2000);
		setTimeout(function(){
			$('.gameStartCountdown3').fadeIn(500);
			$('.large-text3').animate({'font-size' : emScaler + 'em'}, 1000);
			$('.large-text3').fadeOut(1000);
			$('.gameStartCountdown2').delay(1700).fadeIn(500);
			$('.large-text2').delay(1700).fadeIn(500);
			$('.large-text2').animate({'font-size' : emScaler + 'em'}, 1000);
			$('.large-text2').fadeOut(1000);
			$('.gameStartCountdown1').delay(3500).fadeIn(500);
			$('.large-text1').delay(3500).fadeIn(500);
			$('.large-text1').animate({'font-size' : emScaler + 'em'}, 1000);
			$('.large-text1').fadeOut(1000);
			$('.board-cover-center').delay(1000).css({'background-color' : 'rgba(0,100,0,0.5)'});
			$('.gameStartCountdown3').delay(1600).fadeOut(300);
			$('.gameStartCountdown2').delay(1600).fadeOut(300);
			$('.gameStartCountdown1').delay(1600).fadeOut(300);
			$('.board-cover-center').delay(4000).fadeOut(500);
			$('.board-cover-bottom').delay(10000).fadeOut(1000);
			setTimeout($scope.halftimeShow = false, 2000);
			setTimeout($scope.clock, 5000);
		},5000);
	};
// ----------------------------------------------------------

	var roundOver = function() {
    var box = $scope.boxrows;
    if ((box[0][5] == "X" || box[0][5] == "O") && (box[0][6] == "X" || box[0][6] == "O") && (box[0][7] == "X" || box[0][7] == "O") && (box[1][5] == "X" || box[1][5] == "O") && (box[1][6] == "X" || box[1][6] == "O") && (box[1][7] == "X" || box[1][7] == "O") && (box[2][5] == "X" || box[2][5] == "O") && (box[2][6] == "X" || box[2][6] == "O") && (box[2][7] == "X" || box[2][7] == "O")) {
      boxesFull = true;
      setTimeout($scope.timer = 0, 4000);
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


	function summary() {
		// summary = Function("");
		setTimeout(function(){
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
			if (roundCount === 1) {
				specialFX('half');
				setTimeout(function(){
					boxesFull = false;
					roundCount++;
					setTimeout($scope.roundStart, 4000);
				}, 6000);
			}
			else {
				specialFX('end');
			}
		}, 500);
	}

	// main clock and timer section ---------------------------------------->
	// sets the initial round clock
	
	var run;
	var boardPosition = 21.6;
	$scope.roundStart = function (){
		if(roundCount === 1){
			$scope.timer = 30;
		}
		else {
			setTimeout(function(){
        $scope.timer = 35;
        clockBreak = true;
			}, 6000);
		}
		// sets function to start the round clock
		$scope.clock = function(){
			run = $interval(function(){
				if (($scope.timer === 0 || boxesFull === true) && clockBreak ) {
					summary();
					clockBreak = false;
					if (roundCount === 1) {
						$('.board-container').animate({'margin-left' : boardPosition2 + '%'});
					}
				}
		// counts until reaches zero
				else if ($scope.timer > 0) {
					$scope.timer = $scope.timer - 1;
				}
				// determings shifting board per round
				if (roundCount === 1){
					if($scope.timer % 5 === 0 && $scope.timer > 0){
						shiftBoard();
					}
				}
				else {
					if($scope.timer % 3 === 0 && $scope.timer > 15 && $scope.timer < 31){
						shiftBoardLeft();
					}
					else if ($scope.timer % 3 === 0 && $scope.timer < 16 && $scope.timer > 0){
						shiftBoardRight();
					}
				}
			}, 1000);
		};
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

  shiftBoardLeft = function(){
    boardPosition2 += 8.45;
    $('.board-container').animate({'margin-left' : boardPosition2 + '%'});
  };
  shiftBoardRight = function(){
    boardPosition2 -= 8.45;
    $('.board-container').animate({'margin-left' : boardPosition2 + '%'});
  };
}]);

// special fx and animation section --------------------------->

function roundTwoCountdown(){
	$('.large-text3, .large-text2, .large-text1').css({ 'text-shadow' : '3px 3px 1px rgba(255, 0, 0, .7)'});
	$('.gameStartCountdown3').delay(1000).fadeIn(500);
	$('.large-text3').fadeIn(500);
	$('.large-text3').animate({'font-size' : emScaler + 'em'}, 1000);
	$('.large-text3').delay(1000).fadeOut(500);
	$('.gameStartCountdown2').delay(2500).fadeIn(500);
	$('.large-text2').delay(2500).fadeIn(500);
	$('.large-text2').animate({'font-size' : emScaler + 'em'}, 1000);
	$('.large-text2').fadeOut(500);
	$('.gameStartCountdown1').delay(3800).fadeIn(500);
	$('.test').animate({'background-color' : 'rgba(200, 0, 0, .5)' }, 1000);
	$('.large-text1').delay(3800).fadeIn(500);
	$('.large-text1').animate({'font-size' : emScaler + 'em'}, 1000);
	$('.large-text1').fadeOut(500);
	$('.gameStartCountdown3').delay(1600).fadeOut(300);
	$('.gameStartCountdown2').delay(1600).fadeOut(300);
	$('.gameStartCountdown1').delay(1600).fadeOut(300);
	$('.board-cover-center').delay(5600).fadeOut(500);
	$('.test').animate({'background-color' : 'rgba(0, 0, 0, 0)' }, 500);
}
// game and halftime summary outcomes ----------------------------------->
function playerOneUp() {
	jQuery( document ).ready(function( $ ) {
		$('.fxScreen').delay(2000).animate({'background-color' : 'rgba(22, 120, 255, .5)' }, 1000);
		setTimeout(function(){
			$('.player1Lead, .player1Win').css({'text-shadow' : '3px 3px 3px rgba(22, 120, 255, 1)'})
			.css({'font-size' : flexFont});
			$('.fx-text').fadeOut(690);
			$('.decoration-bar').css({'border' : '2px solid rgba(22, 120, 255, .7)'}, 'fast');
			if(roundCount === 1){
				$('.player1Lead').delay(700).fadeIn(1000);
			}
			else {
				setTimeout(function(){
					$('.player1Win').fadeIn(1000);
				}, 2000);
			}
		}, 2500);
	});
}

function playerTwoUp() {
	jQuery( document ).ready(function( $ ) {
		$('.fxScreen').delay(2000).animate({'background-color' : 'rgba(111, 50, 177, .5)' }, 1000);
		setTimeout(function(){
			$('.player2Lead, .player2Win').css({'text-shadow' : '3px 3px 3px rgba(111, 50, 177, 1)'})
			.css({'font-size' : flexFont});
			$('.fx-text').fadeOut(690);
			$('.decoration-bar').css({'border' : '2px solid rgba(111, 50, 177, .7)'}, 'fast');
			if(roundCount === 1){
				$('.player2Lead').delay(700).fadeIn(1000);
			}
			else {
				setTimeout(function(){
					$('.player2Win').fadeIn(1000);
				}, 2000);
			}
		}, 2500);
	});
}

function playersAreTied() {
	jQuery( document ).ready(function( $ ) {
		$('.fx-text').fadeOut(690);
		$('.playersTied').delay(2200).fadeIn(1000)
		.css({'font-size' : flexFont });
	});
}
// ----------------------------------------------------------------
function endRoundTransition() {
	jQuery( document ).ready(function( $ ) {
		if(roundCount === 1) {
			$('.fx-text').fadeIn(1500)
			.css({'font-size' : flexFont});
			$('.fxScreen').animate({'background-color':'rgba(0, 20, 0, .5)'}, 1000);
			$('.decoration-bar').delay(2000).css({'box-shadow' : '0px 30px 20px 0px rgba(0,0,0,0.8)'});
		}
		else {
			$('.endScreen').css({'font-size' : flexFont });
			$('.wave2Start').css({'display' : 'none'});
			$('.fire-bar').css({'display' : 'none'});
			$('.fxScreen').fadeIn(500);
			$('.endScreen').fadeIn(500);
			$('.fxScreen').animate({'background-color' : 'rgba(200, 0, 0, .5)' }, 1000);
			$('.decoration-bar').fadeIn(1000);
			$('.endScreen').delay(2500).fadeOut(1000);
		}
	});
}
// end of half and end of game screen change effects and text --------->
function specialFX(fx){
	fxCall = fx;
	multiplier = 1.7;
	jQuery( document ).ready(function( $ ) {
		if (windowWidth < 801) {
			multiplier *= 1.3;
		}
		$('.decoration-bar').css({'height' : flexFont * multiplier});
		endRoundTransition();
			if(leader === 1){
				playerOneUp();
			}
			else if (leader === 2) {
				playerTwoUp();
			}
			else {
				playersAreTied();
			}
			if(roundCount === 1){
				setTimeout(function(){
					secondHalfStart();
				}, 3000);
			}
	});
}
	// jQuery fx flow functions ------------------------------------------------<

	function secondHalfStart() {
		jQuery( document ).ready(function( $ ) {
			if (windowWidth > 800) {
				$('.fire-bar').css({'height' : flexFont * multiplier});
			}
			else {
				$('.fire-bar').css({'height' : flexFont * (multiplier - 0.2) });
			}
			$('.fxScreen').delay(2000).animate({'background-color' : 'rgba(200, 0, 0, .5)' }, 500);
			setTimeout(function(){
				
				$('.decoration-bar').css({'border' : '2px solid rgba(200, 0, 0, .5)'}, 500);
				$('.decoration-bar').css({'background-color' : 'rgba(0,0,0,.4)'});
				$('.player1Lead, .player2Lead, .playersTied').delay(1000).fadeOut(500);
				$('.fire-bar').delay(1500).fadeIn(1000);
				$('.wave2Start').delay(1500).fadeIn(1000);
				$('.wave2Start').css({'font-size' : flexFont });
				$('.fxScreen').delay(4000).fadeOut(1500);
				$('#main-timer').animate({"opacity" : '0.01'},1000);
				$('.test').fadeOut(1000);
				setTimeout(function(){
					boxColorChange();
					clearBoard();
					$('.board-cover-center').css({'background-color' : 'rgba(0,0,0,0.7)'});
					$('.board-cover-center').css({'display' : 'block'});
					setTimeout(function(){
						roundTwoCountdown();
					},2500);
				}, 2000);
			}, 2500);
		});
	}
	roundTwoCountdown();
	function boxColorChange() {
		$('.test').css({
			'border' : '2px solid rgba(255, 0, 0, 1)',
			'boxShadow' : 'inset -7px 7px 15px 0 rgba(255,0,0,0.55)'
		});
		$('#main-timer').css({
			'border' : '2px solid rgba(255, 0, 0, 1)',
			'boxShadow' : 'inset -7px 7px 15px 0 rgba(255,0,0,0.55)'
		});
		$('.test').fadeIn(1500);
		$('#main-timer').animate({'opacity' : '1'}, 1500);
	}
	function fontScaler() {
		jQuery( document ).ready(function( $ ) {
			$('.markers').css({'font-size' : markerSize });
		});
	}
// end of jQuery section. Life gets boring from here --------------------->




// .css({'font-size' : flexFont })).done(function(){ secondHalfStart();});