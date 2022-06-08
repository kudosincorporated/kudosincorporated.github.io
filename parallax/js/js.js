
const fps = 8;

var frame = 0;
var MOVING = {
	left: {
		bool: false,
	},
	right: {
		bool: false
	}
}
var distance = 0;
var pavement_move = 0;

var spritesheet = new Image();
	spritesheet.src = 'me.png';

$(function() {

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");

	canvas.width = 32*8;
	canvas.height = 64*8;

	$('body').on('keydown', function(e) {
		getKeyAndMove(e);

		function getKeyAndMove(e) {
			var key_code = e.which || e.keyCode;
			switch (key_code) {
				case 37: //left arrow key
					MOVING.left.bool = true;
					break;
				case 38: //up arrow key
					break;
				case 39: //right arrow key
					MOVING.right.bool = true;

					break;
				case 40: //down arrow key
					break;
			}
		}
	});

	$('body').on('keyup', function(e) {
		getKeyAndMove(e);

		function getKeyAndMove(e) {
			var key_code = e.which || e.keyCode;
			switch (key_code) {
				case 37: //left arrow key
					MOVING.left.bool = false;
					break;
				case 38: //up arrow key
					break;
				case 39: //right arrow key
					MOVING.right.bool = false;
					break;
				case 40: //down arrow key
					break;
			}
		}
	});

	function draw() {
		setTimeout(function() {
			requestAnimationFrame(draw);
			render();
		}, 1000 / fps);

		function render() {
			ctx.clearRect(0, 0, canvas.width, canvas.height/2 + 64*8/2);

			var pos = 0;
			var flip = 0;
			if (MOVING.left.bool || MOVING.right.bool) {
				pos = frame;

				distance++;
				if (distance < 0) {
					distance = 0;
				}

				if (MOVING.left.bool) {
					flip = 64*8;
					distance -= 2;
				}

				for (let i = 0; i < $('.backdrop').length; i++) {
					$('.backdrop').eq(i).css({
						'margin-left':((i-1)*$(window).width() + distance*-32)+'px'
					});
				}

				for (let i = 0; i < $('.block').length; i++) {
					$('.block').eq(i).css({
						'margin-left':(distance*-64)+'px'
					});
				}

				for (let i = 0; i < $('.pavement').length; i++) {
					$('.pavement').eq(i).css({
						'margin-left':((i-1)*$(window).width() + distance*-128)+'px'
					});
				}
			}

			ctx.drawImage(
				spritesheet,
				0 + pos*32*8,
				0 + flip,
				32*8,
				64*8,
				0,
				0,
				32*8,
				64*8
			);

			frame++;

			if (frame > 8) {
				frame = 0;
			}
		}
	}

	//blocks
	for (let i = 0; i < $('.block').length; i++) {
		$('.block').eq(i).css({
			'left':(i+0.75)*$(window).width()+'px'
		});
	}

	for (let i = 0; i < $('.pavement').length; i++) {
		$('.pavement').eq(i).css({
			'margin-left':((i-1)*$(window).width() + distance*-32)+'px'
		});
	}

	for (let i = 0; i < $('.backdrop').length; i++) {
		$('.backdrop').eq(i).css({
			'margin-left':((i-1)*$(window).width() + distance*-32)+'px'
		});
	}

	setTimeout(function() { $('.slide').css('transition','125ms linear'); }, 0);

	//start
	window.requestAnimationFrame(draw);

});




function rand(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function randInt(bottom, top) {
	return Math.floor(Math.random() * (top - bottom + 1)) + bottom;
}