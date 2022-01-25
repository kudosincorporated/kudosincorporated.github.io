var GAME = {
	g: {
		t: 0, //tick
		s: 20, //swap/switch player skin
		d: [], //decoration
		e: [], //enemies
		p: {} //player
	},
	c: { //canvas
		h: 9, //height
		w: 16, //width
		s: 120, //size
		r: 128 //spritesheet ratio
	},
	p: { //default values
		h: 64, //height
		w: 64, //width
		x: 960, //start x
		y: 540 //start y
	},
	keydown: {
		angles: ['┘', '┴', '└', '├', '┌', '┬', '┐', '┤']
	}
}

var BEING = {
	player: {
		sx: 0,
		sy: 0,
		maxhp: 10,
		s: 2, //speed
		f: 10, //friction multiplier
		a: 2, //acceleration
		d: 1, //deceleration
		sl: 0.25, //overall slow effect. 0 = 0% speed, 1 = 100% speed.
		ma: 50 //max acceleration
	},
	walker: {
		sx: 4,
		sy: 0,
		maxhp: 1,
		s: 0, //speed
		f: 1, //friction multiplier
		a: 5, //acceleration
		d: 1, //deceleration
		sl: 0.001, //overall slow effect. 0 = 0% speed, 1 = 100% speed.
		ma: 500 //max acceleration
	},
	runner: {
		sx: 4,
		sy: 8,
		maxhp: 1,
		s: 2, //speed
		f: 1, //friction multiplier
		a: 5, //acceleration
		d: 1, //deceleration
		sl: 0.001, //overall slow effect. 0 = 0% speed, 1 = 100% speed.
		ma: 500 //max acceleration
	}
}

$(function() {

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");

	canvas.height = GAME.c.h*GAME.c.s;
	canvas.width = GAME.c.w*GAME.c.s;

	var spritesheet = new Image();
		spritesheet.src = 'moving_dude.png';

	class Mover {
		constructor(name, x, y) {
			this.name = name;
			this.maxhp = BEING[this.name].maxhp;
			this.hp = BEING[this.name].maxhp;

			this.facing = 0;
			this.skin = 1;
			this.h = GAME.p.h; //height
			this.w = GAME.p.w; //width
			this.s = BEING[this.name].s; //speed
			this.f = BEING[this.name].f; //friction multiplier
			this.a = BEING[this.name].a; //acceleration
			this.d = BEING[this.name].d; //deceleration
			this.sl = BEING[this.name].sl; //overall slow effect. 0 = 0% speed, 1 = 100% speed.
			this.ma = BEING[this.name].ma; //max acceleration
			this.x = x; //start x
			this.y = y; //start y

			this.left = {
				bool: false,
				val: 0
			}
			this.right = {
				bool: false,
				val: 0
			}
			this.up = {
				bool: false,
				val: 0
			}
			this.down = {
				bool: false,
				val: 0
			}

			this.lastpressed = '';
		}
		sx() {
			return BEING[this.name].sx*GAME.c.r;
		}
		sy() {
			return BEING[this.name].sy*GAME.c.r;
		}
		swapSkin() {
			if (GAME.g.t % GAME.g.s == 0) {
				if (this.skin < 3) {
					this.skin++;
				} else {
					this.skin = 1;
				}
			}
		}
		move() {
			if (this.left.val > 0) this.left.val -= this.d;
			if (this.right.val > 0) this.right.val -= this.d;
			if (this.up.val > 0) this.up.val -= this.d;
			if (this.down.val > 0) this.down.val -= this.d;

			this.x -= this.left.val/this.f*this.sl;
			this.x += this.right.val/this.f*this.sl;
			this.y -= this.up.val/this.f*this.sl;
			this.y += this.down.val/this.f*this.sl;

			if (this.left.bool) {
				this.x -= this.s*this.sl;
				if (this.left.val < this.ma) this.left.val += this.a;
			}
			if (this.right.bool) {
				this.x += this.s*this.sl;
				if (this.right.val < this.ma) this.right.val += this.a;
			}
			if (this.up.bool) {
				this.y -= this.s*this.sl;
				if (this.up.val < this.ma) this.up.val += this.a;
			}
			if (this.down.bool) {
				this.y += this.s*this.sl;
				if (this.down.val < this.ma) this.down.val += this.a;
			}

			if (this.x < 0) this.x = 0;
			if (this.x > canvas.width-this.w) this.x = canvas.width-this.w;
			if (this.y < 0) this.y = 0;
			if (this.y > canvas.height-this.h) this.y = canvas.height-this.h;
		}
		place() {
			//find direction
			switch (this.lastpressed) {
				case 'left': //left arrow key
					var first = this.up.val;
					var second = this.down.val;
					if (first > second) {
						this.facing = 0;
					} else if (first < second) {
						this.facing = 6;
					} else {
						this.facing = 7;
					}
					break;
				case 'right': //right arrow key
					var first = this.up.val;
					var second = this.down.val;
					if (first > second) {
						this.facing = 2;
					} else if (first < second) {
						this.facing = 4;
					} else {
						this.facing = 3;
					}
					break;
				case 'up': //up arrow key
					var first = this.left.val;
					var second = this.right.val;
					if (first > second) {
						this.facing = 0;
					} else if (first < second) {
						this.facing = 2;
					} else {
						this.facing = 1;
					}
					break;
				case 'down': //down arrow key
					var first = this.left.val;
					var second = this.right.val;
					if (first > second) {
						this.facing = 6;
					} else if (first < second) {
						this.facing = 4;
					} else {
						this.facing = 5;
					}
					break;
			}
			
			if (this.left.bool || this.right.bool || this.up.bool || this.down.bool) {
				ctx.drawImage(spritesheet, this.skin*GAME.c.r + BEING[this.name].sx*GAME.c.r, this.facing*GAME.c.r + BEING[this.name].sy*GAME.c.r, GAME.c.r, GAME.c.r, this.x, this.y, this.h, this.w);
			} else {
				ctx.drawImage(spritesheet, 0 + BEING[this.name].sx*GAME.c.r, this.facing*GAME.c.r + BEING[this.name].sy*GAME.c.r, GAME.c.r, GAME.c.r, this.x, this.y, this.h, this.w);
			}
		}
	}

	$('body').on('keydown', function(e) {
		getKeyAndMove(e);

		function getKeyAndMove(e) {
			var key_code = e.which || e.keyCode;
			switch (key_code) {
				case 37: //left arrow key
					GAME.g.p.lastpressed = 'left';
					GAME.g.p.left.bool = true;
					break;
				case 39: //right arrow key
					GAME.g.p.lastpressed = 'right';
					GAME.g.p.right.bool = true;
					break;
				case 38: //up arrow key
					GAME.g.p.lastpressed = 'up';
					GAME.g.p.up.bool = true;
					break;
				case 40: //down arrow key
					GAME.g.p.lastpressed = 'down';
					GAME.g.p.down.bool = true;
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
					GAME.g.p.left.bool = false;
					break;
				case 39: //right arrow key
					GAME.g.p.right.bool = false;
					break;
				case 38: //up arrow key
					GAME.g.p.up.bool = false;
					break;
				case 40: //down arrow key
					GAME.g.p.down.bool = false;
					break;
			}
		}
	});

	$('#acceleration').on('click', function() {
		if ($(this).is(':checked')) {
			
		} else {

		}
	});

	function draw() {
		GAME.g.t++;

		if (GAME.g.t % 30 == 0) {
			var r = Math.random();
			if (r < 0.25) {
				GAME.g.e.push( new Mover('runner', randInt(0, canvas.width), 0) );
			} else if (r < 0.5) {
				GAME.g.e.push( new Mover('walker', canvas.width, randInt(0, canvas.height)) );
			} else if (r < 0.75) {
				GAME.g.e.push( new Mover('walker', randInt(0, canvas.width), canvas.height) );
			} else {
				GAME.g.e.push( new Mover('walker', 0, randInt(0, canvas.height)) );
			}

			if (GAME.g.e.length > 99) {
				GAME.g.e.shift();
			}
		}

		render();
		function render() {
			ctx.font = '20px monospace';

			//drawing
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.fillStyle = '#222034';
			ctx.fillRect(1, 1, canvas.width-1*2, canvas.height-1*2);

			//rendering movers
			GAME.g.p.swapSkin();
			GAME.g.p.move();
			GAME.g.p.place();

			for (let i = 0; i < GAME.g.e.length; i++) {
				var e = GAME.g.e[i];

				//move towards player
				var run = GAME.g.p.x - e.x;
				var rise = GAME.g.p.y - e.y;
				var length = Math.sqrt((rise*rise) + (run*run)); //pseudocode
				var unitX = run / length;
				var unitY = rise / length;

				if (unitX > 0) e.lastpressed = 'right';
				if (unitX < 0) e.lastpressed = 'left';
				if (unitY > 0) e.lastpressed = 'down';
				if (unitY < 0) e.lastpressed = 'up';

				if (unitX > 0) e.right.bool = true; else e.right.bool = false;
				if (unitX < 0) e.left.bool = true; else e.left.bool = false;
				if (unitY > 0) e.down.bool = true; else e.down.bool = false;
				if (unitY < 0) e.up.bool = true; else e.up.bool = false;

				GAME.g.e[i].swapSkin();
				GAME.g.e[i].move();
				GAME.g.e[i].place();

				//ctx.fillStyle = 'gold';
				//ctx.fillText(e.name + " " + e.x.toFixed(0) + " " + e.y.toFixed(0), 20, 120+(20*i));
			}

			ctx.fillStyle = 'white';
			ctx.fillText('player', 20, 20);
			ctx.fillText('x '+GAME.g.p.x.toFixed(0), 20, 40);
			ctx.fillText('y '+GAME.g.p.y.toFixed(0), 20, 60);
			ctx.fillText(GAME.g.p.left.val, 100, 60);
			ctx.fillText(GAME.g.p.right.val, 180, 60);
			ctx.fillText(GAME.g.p.up.val, 140, 40);
			ctx.fillText(GAME.g.p.down.val, 140, 80);
			ctx.fillText(GAME.keydown.angles[GAME.g.p.facing], 140, 60);
			ctx.fillText(GAME.g.p.lastpressed, 220, 40);
		}

		window.requestAnimationFrame(draw);
	}

	GAME.g.p = new Mover('player', 400, 400);

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