var FPS = 60;
var interval;
var PAUSED = false;

var FISHEYEBASE = -1;

var SPEED = 1;

var DIRS = ['up','left','down','right'];

var GAME = {
	p: [],
	e: [],
	c: { 		//canvas
		h: 9, 	//height
		w: 16, 	//width
		s: 96 	//size
	}
}

var BODY = {
	h: GAME.c.s/2, 	//height
	w: GAME.c.s/2, 	//width
	s: 5, 			//speed
	f: 10, 			//friction multiplier
	a: 2, 			//acceleration
	d: 1, 			//deceleration
	ma: 10 		//max acceleration
}

class Mover {
	constructor(src, h, w, x, y) {
		this.src = src;

		this.x = x;
		this.y = y;

		this.h = h;
		this.w = w;
		this.s = BODY.s;
		this.f = BODY.f;
		this.a = BODY.a;
		this.d = BODY.d;
		this.ma = BODY.ma;

		this.key = {
			left: { bool: false, val: 0 },
			right: { bool: false, val: 0 },
			up: { bool: false, val: 0 },
			down: { bool: false, val: 0 }
		}

		this.state = {
			touching: { bool: false }
		}
	}
	adjust() {
		if (this.key.left.val > 0) this.key.left.val -= this.d;
		if (this.key.right.val > 0) this.key.right.val -= this.d;
		if (this.key.up.val > 0) this.key.up.val -= this.d;
		if (this.key.down.val > 0) this.key.down.val -= this.d;

		if (this.key.left.bool && this.key.left.val < this.ma) 		this.key.left.val += this.a;
		if (this.key.right.bool && this.key.right.val < this.ma) 	this.key.right.val += this.a;
		if (this.key.up.bool && this.key.up.val < this.ma) 			this.key.up.val += this.a;
		if (this.key.down.bool && this.key.down.val < this.ma) 		this.key.down.val += this.a;
	}
	move() {
		this.x -= this.key.left.val/this.f*SPEED;
		this.x += this.key.right.val/this.f*SPEED;
		this.y -= this.key.up.val/this.f*SPEED;
		this.y += this.key.down.val/this.f*SPEED;

		if (this.key.left.bool) 	this.x -= this.s*SPEED;
		if (this.key.right.bool) 	this.x += this.s*SPEED;
		if (this.key.up.bool) 		this.y -= this.s*SPEED;
		if (this.key.down.bool) 	this.y += this.s*SPEED;
	}
	worldMove() {
		this.x += GAME.p[0].key.left.val/GAME.p[0].f*SPEED;
		this.x -= GAME.p[0].key.right.val/GAME.p[0].f*SPEED;
		this.y += GAME.p[0].key.up.val/GAME.p[0].f*SPEED;
		this.y -= GAME.p[0].key.down.val/GAME.p[0].f*SPEED;

		if (GAME.p[0].key.left.bool) 	this.x += GAME.p[0].s*SPEED;
		if (GAME.p[0].key.right.bool) 	this.x -= GAME.p[0].s*SPEED;
		if (GAME.p[0].key.up.bool) 		this.y += GAME.p[0].s*SPEED;
		if (GAME.p[0].key.down.bool) 	this.y -= GAME.p[0].s*SPEED;
	}
	edgeTeleport() {
		if (this.x < 0-this.w) this.x = canvas.width-1;
		if (this.x > canvas.width) this.x = 0-this.w+1;
		if (this.y < 0-this.h) this.y = canvas.height-1;
		if (this.y > canvas.height) this.y = 0-this.h+1;
	}
	paste(ctx) {
		//ctx.fillStyle = 'red';
		//ctx.fillRect(this.x, this.y, this.w, this.h);


		var a = -9;
		var b = 0;
		var path = new Path2D();
		path.moveTo(this.x+b,this.y+b);
		path.lineTo(this.x+this.w/2,this.y-a);
		path.lineTo(this.x+this.w-b,this.y+b);
		path.lineTo(this.x+this.w+a,this.y+this.h/2);
		path.lineTo(this.x+this.w-b,this.y+this.h-b);
		path.lineTo(this.x+this.w/2,this.y+this.h+a);
		path.lineTo(this.x+b,this.y+this.h-b);
		path.lineTo(this.x-a,this.y+this.h/2);
		path.lineTo(this.x+b,this.y+b);
		ctx.fillStyle = '#fff';
		ctx.fill(path);


	}
}

$(function() {

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");
	var display = document.getElementById("display");

	canvas.height = GAME.c.h*GAME.c.s;
	canvas.width = GAME.c.w*GAME.c.s;

	display.height = GAME.c.h*GAME.c.s;
	display.width = GAME.c.w*GAME.c.s;

	//Fisheye.js
	var fisheye = new Fisheye(display);

	GAME.p.push( new Mover('player', 'player', canvas.width/2, canvas.height/2) );

	for (let i = 0; i < 99; i++) {
		setTimeout(function() {
			var size = randInt(2,16);
			GAME.e.push(new Mover('TODO', size, size, randInt(0,canvas.width), randInt(0,canvas.height)));
		}, i*randInt(100,200));
	}

	$('body').on('keydown', function(e) {
		getKeyAndMove(e);

		function getKeyAndMove(e) {
			var key_code = e.which || e.keyCode;
			switch (key_code) {
				case 87: //W
					GAME.p[0].key.up.bool = true;
					break;
				case 65: //A
					GAME.p[0].key.left.bool = true;
					break;
				case 83: //S
					GAME.p[0].key.down.bool = true;
					break;
				case 68: //D
					GAME.p[0].key.right.bool = true;
					break;

				case 27:
					PAUSE();
					break;
				case 13:
					UNPAUSE();
					break;
			}
		}
	});

	$('body').on('keyup', function(e) {
		getKeyAndMove(e);

		function getKeyAndMove(e) {
			var key_code = e.which || e.keyCode;
			switch (key_code) {
				case 87: //up arrow key
					GAME.p[0].key.up.bool = false;
					break;
				case 65: //left arrow key
					GAME.p[0].key.left.bool = false;
					break;
				case 83: //down arrow key
					GAME.p[0].key.down.bool = false;
					break;
				case 68: //right arrow key
					GAME.p[0].key.right.bool = false;
					break;
			}
		}
	});

	function draw() {
		window.clearTimeout(interval);
		window.cancelAnimationFrame(draw);

		interval = setTimeout(function() {
			if (!PAUSED) requestAnimationFrame(draw);
			render();

			var barrel = FISHEYEBASE;
			var red = barrel;
			var green = barrel;
			var blue = barrel;

			fisheye.setViewport(canvas.width, canvas.height);
			fisheye.setDistortion(red, green, blue);
			fisheye.clear();
			fisheye.draw(canvas);


		}, 1000 / FPS);

		function render() {

			//drawing
			ctx.fillStyle = '#000';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.save();
			for (let i = 0; i < 24; i++) {
				ctx.beginPath();
				ctx.fillStyle = '#ccccff';
				ctx.globalAlpha = i*0.001;
				ctx.ellipse(canvas.width/2, canvas.height/2, canvas.height/3*i/4, canvas.height/8*i/4, 0, 0, 2 * Math.PI);
				ctx.fill();
			}
			ctx.restore();

			ctx.save();
			ctx.fillStyle = '#000';
			ctx.globalAlpha = 0.6;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.restore();

			//enemy
			for (let i = 0; i < GAME.e.length; i++) {
				var e = GAME.e[i];

				e.adjust();
				e.move();
				e.worldMove();
				e.edgeTeleport();
				e.paste(ctx);
			}

			ctx.fillStyle = 'white';
			ctx.font = '50px monospace';
			//ctx.fillText(GAME.p[0].state.hurting.val, canvas.width/2 - 15, canvas.height/2 - 50);

		}
	}

	window.requestAnimationFrame(draw);

	function PAUSE() {
		PAUSED = true;
		window.clearTimeout(interval);
	}

	function UNPAUSE() {
		PAUSED = false;
		draw();
	}

});



function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

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