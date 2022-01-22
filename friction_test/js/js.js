var GAME = {
	c: { //canvas
		h: 9, //height
		w: 16, //width
		s: 120 //size
	},
	p: { //player
		h: 20, //height
		w: 20, //width
		s: 2, //speed
		f: 10, //friction multiplier
		a: 2, //acceleration
		d: 1, //deceleration
		ma: 100, //max acceleration
		x: 960, //start x
		y: 540 //start y
	},
	keydown: {
		left: {
			bool: false,
			val: 0
		},
		right: {
			bool: false,
			val: 0
		},
		up: {
			bool: false,
			val: 0
		},
		down: {
			bool: false,
			val: 0
		}
	},
	g: { //game
		enemies: []
	}
}

$(function() {

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");

	canvas.height = GAME.c.h*GAME.c.s;
	canvas.width = GAME.c.w*GAME.c.s;

	class Enemy {
		constructor(x, y, size, speed) {
			this.x = x;
			this.y = y;
			this.size = size;
			this.speed = speed;
		}
	}

	$('body').on('keydown', function(e) {
		getKeyAndMove(e);

		function getKeyAndMove(e) {
			var key_code = e.which || e.keyCode;
			switch (key_code) {
				case 37: //left arrow key
					GAME.keydown.left.bool = true;
					break;
				case 39: //right arrow key
					GAME.keydown.right.bool = true;
					break;
				case 38: //up arrow key
					GAME.keydown.up.bool = true;
					break;
				case 40: //down arrow key
					GAME.keydown.down.bool = true;
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
					GAME.keydown.left.bool = false;
					break;
				case 39: //right arrow key
					GAME.keydown.right.bool = false;
					break;
				case 38: //up arrow key
					GAME.keydown.up.bool = false;
					break;
				case 40: //down arrow key
					GAME.keydown.down.bool = false;
					break;
			}
		}
	});

	$('#acceleration').on('click', function() {
		if ($(this).is(':checked')) {
			GAME.p.a = 2;
			GAME.p.d = 1;
		} else {
			GAME.p.a = 0;
			GAME.p.d = 0;
		}
	});

	function draw() {
		render();

		function render() {
			//player
			if (GAME.keydown.left.val > 0) GAME.keydown.left.val -= GAME.p.d;
			if (GAME.keydown.right.val > 0) GAME.keydown.right.val -= GAME.p.d;
			if (GAME.keydown.up.val > 0) GAME.keydown.up.val -= GAME.p.d;
			if (GAME.keydown.down.val > 0) GAME.keydown.down.val -= GAME.p.d;

			GAME.p.x -= GAME.keydown.left.val/GAME.p.f;
			GAME.p.x += GAME.keydown.right.val/GAME.p.f;
			GAME.p.y -= GAME.keydown.up.val/GAME.p.f;
			GAME.p.y += GAME.keydown.down.val/GAME.p.f;

			if (GAME.keydown.left.bool) {
				GAME.p.x -= GAME.p.s;
				if (GAME.keydown.left.val < GAME.p.ma) GAME.keydown.left.val += GAME.p.a;
			}
			if (GAME.keydown.right.bool) {
				GAME.p.x += GAME.p.s;
				if (GAME.keydown.right.val < GAME.p.ma) GAME.keydown.right.val += GAME.p.a;
			}
			if (GAME.keydown.up.bool) {
				GAME.p.y -= GAME.p.s;
				if (GAME.keydown.up.val < GAME.p.ma) GAME.keydown.up.val += GAME.p.a;
			}
			if (GAME.keydown.down.bool) {
				GAME.p.y += GAME.p.s;
				if (GAME.keydown.down.val < GAME.p.ma) GAME.keydown.down.val += GAME.p.a;
			}

			if (GAME.p.x < 0) GAME.p.x = 0;
			if (GAME.p.x > canvas.width-GAME.p.w) GAME.p.x = canvas.width-GAME.p.w;
			if (GAME.p.y < 0) GAME.p.y = 0;
			if (GAME.p.y > canvas.height-GAME.p.h) GAME.p.y = canvas.height-GAME.p.h;

			//drawing
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.fillStyle = 'black';
			ctx.fillRect(1, 1, canvas.width-1*2, canvas.height-1*2);

			ctx.fillStyle = 'white';
			ctx.fillRect(GAME.p.x, GAME.p.y, GAME.p.w, GAME.p.h);

			//enemies
			for (let i=0; i < GAME.g.enemies.length; i++) {
				ctx.fillStyle = 'red';
				ctx.fillRect(GAME.g.enemies.x, GAME.g.enemies.y, GAME.g.enemies.w, GAME.g.enemies.h);
			}

			ctx.fillStyle = 'white';
			ctx.font = '20px monospace';
			ctx.fillText('x '+GAME.p.x.toFixed(0), 20, 20);
			ctx.fillText('y '+GAME.p.y.toFixed(0), 20, 40);
			ctx.fillText(GAME.keydown.left.val, 100, 40);
			ctx.fillText(GAME.keydown.right.val, 180, 40);
			ctx.fillText(GAME.keydown.up.val, 140, 20);
			ctx.fillText(GAME.keydown.down.val, 140, 60);
		}

		window.requestAnimationFrame(draw);
	}

	window.requestAnimationFrame(draw);

});







function prettify(input) {
	var output = Math.round(input * 1000000)/1000000;
	return output;
}

function rand(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function findTile(x, y, array) {
	return array[y * width + x];
}

function randInt(bottom, top) {
	return Math.floor(Math.random() * (top - bottom + 1)) + bottom;
}