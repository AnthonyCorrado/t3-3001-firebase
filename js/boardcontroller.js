var windowWidth = $(window).width();
var windowHeight = $(window).height();
var windowRatio = (windowWidth / windowHeight);
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
var runShot;
var stopShotClock = false;
var scoreGap = 0;

$(function() {
   $('body').scrollTop(0);
});

$(window).ready(function() {
	fontScaler();
	fontScaler2();
	borderScaler();
});

// resize core elements on device orientation flip or window resize ----->
$( window ).resize(function() {
	windowWidth = $(window).width();
	emScaler = windowWidth * 0.024;
	markerSize = windowWidth * 0.035;
	fontScaler();
	fontScaler2();
	borderScaler();
});
// -------------------------------------------------------------

$(function() {
    FastClick.attach(document.body);
});

app.controller('boardController', ['$scope', '$interval', function ($scope, $interval) {
	$scope.boxrows = [[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null]];

	$scope.timer = 0;
	$scope.markerFX = 'X';
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
		$scope.shotclock1 = 0;
    $scope.shotclock2 = 0;
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
			$('.board-cover-center').delay(1000).css({'background-color' : 'rgba(0,0,0,0.7)'});
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
	// alternating player shot clocks ---------------------------------->
	function shotClockStart() {
		if (stopShotClock === false) {
			$interval.cancel(runShot);
			if(turnNum % 2 === 0){
				$scope.shotclock1 = 5;
				$scope.shotclock2 = 0;
			}
			else if (turnNum % 2 !== 0){
				$scope.shotclock1 = 0;
				$scope.shotclock2 = 5;
			}
			// sets function to start the round clock
			$scope.countdown = function() {
				runShot = $interval(function() {
					// counts until reaches zero
					if ($scope.shotclock1 > 0) {
						$scope.shotclock1 = $scope.shotclock1 - 1;
						if ($scope.shotclock1 < 3) {
						$('.danger1').css({
							'color': '#F00',
							'text-shadow' : '2px 2px 2px rgba(255, 0, 0, .7)'});
						}
						else {
							$('.danger1').css({
							'color': 'rgba(255, 255, 255, .8)',
							'text-shadow' : '2px 2px 2px rgba(22, 120, 255, 1)'});
						}
					}
					else if ($scope.shotclock2 > 0) {
						$scope.shotclock2 = $scope.shotclock2 - 1;
						if ($scope.shotclock2 < 3) {
						$('.danger2').css({
							'color': '#F00',
							'text-shadow' : '2px 2px 2px rgba(255, 0, 0, .7)'});
						}
						else {
							$('.danger2').css({
							'color': 'rgba(255, 255, 255, .8)',
							'text-shadow' : '2px 2px 2px rgba(111, 50, 177, 1)'});
						}
					}
					else if ($scope.shotclock1 === 0){
						altTurn();
					}
					else if ($scope.shotclock2 === 0){
						altTurn();
					}
				}, 1000);
			};
			$scope.countdown();
		}
	}


	altTurn = function () {
		if (turnNum % 2 === 0) {
			mark = "O";
			$scope.markerFX = 'O';
		}
		else {
			mark = "X";
			$scope.markerFX = 'X';
		}
		$('.danger1, .danger2').css({
			'color': 'rgba(255, 255, 255, .8)',
			'text-shadow' : '2px 2px 2px rgba(111, 50, 177, 1)'});
		turnNum += 1;
		nextUpFX();
		shotClockStart();
		};

	$scope.makeMove = function(r, c) {
		cell = $scope.boxrows[r][c];
		if (!cell) {
			shotClockStart();
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
		var r = 0; var c = 0;
		if(roundCount === 1) {
			p1Index = 100;
			p2Index = -100;
		}
		else {
			p1Index = 1100;
			p2Index = -1100;
		}
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
	};

	var verticalScoreCheck = function(mark) {
		var r = 0; var c = 0;
		if (roundCount === 1) {
			p1Index = 200;
			p2Index = -200;
		}
		else {
			p1Index = 1200;
			p2Index = -1200;
		}
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
	};

	var diagonalScoreCheck = function(mark) {
		var r = 0; var c = 0;
		if (roundCount === 1) {
			p1Index = 300;
			p2Index = -300;
		}
		else {
			p1Index = 1300;
			p2Index = -1300;
		}
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
		if (roundCount === 1) {
      p1Index = 350; p2Index = -350;
		}
		else {
			p1Index = 1350; p2Index = -1350;
		}
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
	};

	var isScoreIndexUnique = function(index) {
		if (index > 0) {
			x = p1ScoreIds;
			y = 1;
		}
		else if (index < 0) {
			x = p2ScoreIds;
			y = 2;
		}
		duplicate = false;
		for (i = 0; i < x.length; i++) {
			if (index == x[i]) {
				duplicate = true;
				break;
			}
		}
		if (!duplicate) {
			if (y === 1){
				playerOneScoreFX();
			}
			else {
				playerTwoScoreFX();
			}
			x.push(index);
			scoreTally();
		}
	};
	var scoreTally = function() {
		p1Score = p1ScoreIds.length - 1;
		p2Score = p2ScoreIds.length - 1;
		momentumBar();
	};


	function summary() {
		// summary = Function("");
		setTimeout(function(){
			$scope.halftimeShow = true;
			$scope.shotclock1 = 0;
      $scope.shotclock2 = 0;
			stopShotClock = true;
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
        stopShotClock = false;
        shotClockStart();
        showUpNext();
			}, 6000);
		}
		// sets function to start the round clock
		$scope.clock = function(){
			shotClockStart();
			run = $interval(function(){
				if (($scope.timer === 0 || boxesFull === true) && clockBreak ) {
					hideUpNext();
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
		if(roundCount === 1) {
			$('.playersTied').delay(2200).fadeIn(1000)
			.css({'font-size' : flexFont });
		}
		else {
			setTimeout(function(){
				$('.tieGame').fadeIn(1000)
				.css({'font-size' : flexFont })
				.css({ 'text-shadow' : '3px 3px 1px rgba(255, 0, 0, .7)'});
			}, 4000);
		}
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
		$('.white').css({'background-color' : 'rgba(255, 0, 0, 0.3)'});
	}
	function fontScaler() {
		jQuery( document ).ready(function( $ ) {
			if(windowRatio > 1.4 && windowWidth < 680) {
				$('.markers').css({'font-size' : markerSize * 0.7 });
			}
			else {
				$('.markers').css({'font-size' : markerSize });
			}
		});
	}
	function fontScaler2() {
		jQuery( document ).ready(function( $ ) {
      $('.font-helper').css({'font-size' : emScaler * 0.7 });
			$('.player1Scored, .player2Scored').css({'font-size' : emScaler * 0.55 });
			if (windowWidth >= 1200){
				$('#title-text').css({'font-size' : emScaler * 1.1 });
				$('.timer-font-scale').css({'font-size' : windowWidth * 0.03 });
			}
			else if (windowWidth > 680) {
				$('.playersMarker').css({'font-size' : emScaler * 4 });
			}
			else if (windowWidth <= 680) {
				$('.playersMarker').css({'font-size' : emScaler * 3.3 });
			}
			$('.custom-button').css({'font-size' : emScaler * 1 });
			if (windowWidth > 800 && windowWidth < 1200) {
				$('.sub-font-scale').css({'font-size' : windowWidth * 0.024 });
				$('#title-text').css({'font-size' : emScaler });
				$('.timer-font-scale').css({'font-size' : windowWidth * 0.0275 });
				$('.timer-text').css({'font-size' : windowWidth * 0.02 });
				$('.white').css({'font-size' : windowWidth * 0.012 });
				$('.scaling-font').css({'font-size' : windowWidth * 0.015 });
			}
			else if (windowWidth < 801)	{
				$('#title-text').css({'font-size' : emScaler });
				$('.sub-font-scale').css({'font-size' : windowWidth * 0.035 });
				$('.timer-font-scale').css({'font-size' : windowWidth * 0.035 });
				$('.timer-text').css({'font-size' : windowWidth * 0.02 });
				$('.scaling-font').css({'font-size' : windowWidth * 0.018 });
				$('.white').css({'font-size' : windowWidth * 0.015 });
			}
			if (windowWidth < 400){
				$('.font-helper').css({'font-size' : emScaler });
			}
			if (windowRatio > 1.4 && windowWidth <= 680){
				$('.board-container').css({'margin-top' : '2.5%'});
			}
    });
  }

  function borderScaler() {
		jQuery( document ).ready(function( $ ) {
			$('.top-scoreboard').css({'height' : emScaler * 0.9});
			$('.bottom-scoreboard').css({'height' : emScaler * 1.5});
			$('#p1-timer-name').css({'height' : windowWidth * 0.02 });
			$('#p2-timer-name').css({'height' : windowWidth * 0.02 });
			$('#timer-name').css({'height' : windowWidth * 0.02 });
			$('#p1-timer').css({'height' : windowWidth * 0.033 });
			$('#p2-timer').css({'height' : windowWidth * 0.033 });
			$('#timer-count').css({'height' : windowWidth * 0.033 });
			$('.custom-button').css({'height' : windowWidth * 0.05 });
			if (windowWidth <= 650) {
				$('#p1-scorebox').css({'border' : '2px solid rgba(22, 120, 255, 1)'});
				$('#p2-scorebox').css({'border' : '2px solid rgba(111, 50, 177, 1)'});
				if (roundCount === 1) {
					$('.test').css({'border' : '2px solid rgba(0, 255, 0, 1)'});
				}
			}
			else if (windowWidth > 650 && windowWidth < 1024) {
				$('#p1-scorebox').css({'border' : '3px solid rgba(22, 120, 255, 1)'});
				$('#p2-scorebox').css({'border' : '3px solid rgba(111, 50, 177, 1)'});
				if (roundCount === 1) {
					$('.test').css({'border' : '4px solid rgba(0, 255, 0, 1)'});
				}
			}
			else {
				$('#p1-scorebox').css({'border' : '4px solid rgba(22, 120, 255, 1)'});
				$('#p2-scorebox').css({'border' : '4px solid rgba(111, 50, 177, 1)'});

				if (roundCount === 1) {
					$('.test').css({'border' : '5px solid rgba(0, 255, 0, 1)'});
				}
			}
		});
  }

	function nextUpFX() {
		jQuery( document ).ready(function( $ ) {
			if (turnNum % 2 !== 0) {
				if(windowWidth > 1024) {
					$('.playersMarker').css({'text-shadow' : '5px 5px 8px rgba(111, 50, 177, 1)'});
				}
				else {
					$('.playersMarker').css({'text-shadow' : '3px 3px 6px rgba(111, 50, 177, 1)'});
				}
				$('.playersTurn2').fadeIn(350);
				$('.playersTurn1').css({'display' : 'none'});
			}
			else {
				if(windowWidth > 1024) {
					$('.playersMarker').css({'text-shadow' : '5px 5px 8px rgba(22, 120, 255, 1)'});
				}
				else {
					$('.playersMarker').css({'text-shadow' : '3px 3px 6px rgba(22, 120, 255, 1)'});
				}
				$('.playersTurn2').css({'display' : 'none'});
				$('.playersTurn1').fadeIn(350);
			}
		});
	}
	function hideUpNext() {
		jQuery( document ).ready(function( $ ) {
			$('.playersTurn1, .playersTurn2').css({'opacity' : '0'});
		});
	}
	function showUpNext() {
		jQuery( document ).ready(function( $ ) {
			$('.playersTurn1, .playersTurn2').css({'opacity' : '1'});
		});
	}

	function playerOneScoreFX() {
		jQuery( document ).ready(function( $ ) {
			$('.player1Scored').css({'margin-top' : '10%'});
			$('.player1Scored').fadeIn('fast');
			blink();
			$('#p1-scorebox').css({'background-color' : 'rgba(22, 120, 255, 1)'});
			$('.test').css({'background-color' : 'rgba(22, 120, 255, 0.7)'});
			if (windowWidth < 760) {
				$('.board-cover-left').animate({'background-color' : 'rgba(22, 120, 255, 0.7)'});
				$('.board-cover-right').animate({'background-color' : 'rgba(22, 120, 255, 0.7)'});
				$('body').animate({'background-color' : 'rgba(22, 120, 255, 0.7)'});
			}
			//return to default state
			setTimeout(function(){
				$('.player1Scored').animate({'margin-top' : '1.5%'}, 1500, 'easeOutCirc');
				$('.player1Scored').fadeOut(200);
				$('#p1-scorebox').animate({'background-color' : '#000'}, 100);
				$('.test').css({'background-color' : '#000'}, 100);
				$('.board-cover-left').animate({'background-color' : 'rgba(0, 0, 0, 0.7)'});
				$('.board-cover-right').animate({'background-color' : 'rgba(0, 0, 0, 0.7)'});
				$('body').animate({'background-color' : '#000'});
			},200);
		});
	}
	function playerTwoScoreFX() {
		jQuery( document ).ready(function( $ ) {
			$('.player2Scored').css({'margin-top' : '10%'});
			$('.player2Scored').fadeIn('fast');
			blink();
			$('#p2-scorebox').animate({'background-color' : 'rgba(111, 50, 177, 1)'}, 100);
			$('.test').css({'background-color' : 'rgba(111, 50, 177, 0.7)'});
			if (windowWidth < 760) {
				$('.board-cover-left').animate({'background-color' : 'rgba(111, 50, 177, 0.7)'});
				$('.board-cover-right').animate({'background-color' : 'rgba(111, 50, 177, 0.7)'});
				$('body').animate({'background-color' : 'rgba(111, 50, 177, 0.7)'});
			}
			//return to default state
			setTimeout(function(){
				$('.player2Scored').animate({'margin-top' : '1.5%'}, 1500, 'easeOutCirc');
				$('.player2Scored').fadeOut(200);
				$('#p2-scorebox').animate({'background-color' : '#000'}, 100);
				$('.test').css({'background-color' : '#000'}, 100);
				$('.board-cover-left').animate({'background-color' : 'rgba(0, 0, 0, 0.7)'});
				$('.board-cover-right').animate({'background-color' : 'rgba(0, 0, 0, 0.7)'});
				$('body').animate({'background-color' : '#000'});
			}, 200);
		});
	}

	function momentumBar() {
		jQuery( document ).ready(function( $ ) {
			scoreGap = (p1Score - p2Score) * 20;
			console.log(scoreGap);
			if (scoreGap > 0) {
				$('.scoring-bar1').animate({'width' : scoreGap + "%"}, 500);
				$('.scoring-bar2').animate({'width' : (scoreGap * -1) + "%"}, 500);
			}
			else if (scoreGap < 0) {
				$('.scoring-bar2').animate({'width' : (scoreGap * -1) + "%"}, 500);
			}
			else {
				$('.scoring-bar1').animate({'width' : "0"}, 500);
				$('.scoring-bar2').animate({'width' : "0"}, 500);
			}
		});
	}
// hover effect that resizes along with window resize
jQuery( document ).ready(function( $ ) {
	$(".test").mouseenter(function() {
			$(this).css({'border' : '2px solid rgba(255, 0, 0, 1)'});
		}).mouseleave(function() {
			if (windowWidth <= 650 && roundCount === 1) {
				$(this).css({'border' : '2px solid rgba(0, 255, 0, 1)'});
			}
			else if (windowWidth > 650 && windowWidth < 1024 && roundCount === 1) {
				$(this).css({'border' : '4px solid rgba(0, 255, 0, 1)'});
			}
			else if (windowWidth >= 1024 && roundCount === 1) {
				$(this).css({'border' : '5px solid rgba(0, 255, 0, 1)'});
			}
		});
	});

function blink() {
	var blinkAmount1 = 0;
	var blinkAmount2 = 0;

	function blinker() {
    jQuery( document ).ready(function( $ ) {
      if (turnNum % 2 !== 0) {
        if (blinkAmount1 < 2) {
          // $('.p1ScoreText').delay(250).animate({'font-size' : emScaler * 0.9 }, 1500, 'linear');
					$('.player1Scored').css({'opacity' : '0'});
					setTimeout(function(){
						$('.player1Scored').css({'opacity' : '1'});
					},200);
				}
				blinkAmount1++;
				blinkAmount2++;
      }
      else {
				if (blinkAmount2 < 4) {
					$('.player2Scored').css({'opacity' : '0'});
					setTimeout(function(){
						$('.player2Scored').css({'opacity' : '1'});
					},150);
				}
      }
		});
	}
	setInterval(blinker, 400);
}
// end of jQuery section. Life gets boring from here --------------------->




// .css({'font-size' : flexFont })).done(function(){ secondHalfStart();});