var GAME = {
	a: {
		showDebug: false,
		started: false
	},
	g: {
		t: 0, //tick
		s: 20, //swap/switch player skin
		b: 128, //border used for spawning pickups
		d: [], //decoration
		e: [], //enemies
		c: [], //pickups
		p: {} //player
	},
	c: { //canvas
		h: 9, //height
		w: 16, //width
		s: 120, //size
		r: 128, //spritesheet ratio,
		ss: 64, //general spritesize
	},
	p: { //default values
		h: 64, //height
		w: 64, //width
		x: 960, //start x
		y: 540 //start y
	},
	s: { //stats
		kills: 0,
		pickups: {
			health: 0,
			score: 0
		}
	},
	keydown: {
		angles: ['┘', '┴', '└', '├', '┌', '┬', '┐', '┤']
	}
}

var BEING = {
	player: {
		sx: 0,
		sy: 8,
		h: GAME.p.h,
		w: GAME.p.w,
		maxhp: 100,
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
		h: GAME.c.ss,
		w: GAME.c.ss,
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
		h: GAME.c.ss,
		w: GAME.c.ss,
		maxhp: 1,
		s: 2, //speed
		f: 1, //friction multiplier
		a: 5, //acceleration
		d: 1, //deceleration
		sl: 0.001, //overall slow effect. 0 = 0% speed, 1 = 100% speed.
		ma: 500 //max acceleration
	}
}

var ENTITY = {
	blood_1: { sx: 8+0, sy: 0, h: GAME.c.ss, w: GAME.c.ss },
	blood_2: { sx: 8+1, sy: 0, h: GAME.c.ss, w: GAME.c.ss },
	blood_3: { sx: 8+2, sy: 0, h: GAME.c.ss, w: GAME.c.ss },
	blood_4: { sx: 8+3, sy: 0, h: GAME.c.ss, w: GAME.c.ss },
	blood_5: { sx: 8+4, sy: 0, h: GAME.c.ss, w: GAME.c.ss },
	blood_6: { sx: 8+5, sy: 0, h: GAME.c.ss, w: GAME.c.ss },
	blood_7: { sx: 8+6, sy: 0, h: GAME.c.ss, w: GAME.c.ss },
	blood_8: { sx: 8+7, sy: 0, h: GAME.c.ss, w: GAME.c.ss },

	zlood_1: { sx: 8+0, sy: 1, h: GAME.c.ss, w: GAME.c.ss },
	zlood_2: { sx: 8+1, sy: 1, h: GAME.c.ss, w: GAME.c.ss },
	zlood_3: { sx: 8+2, sy: 1, h: GAME.c.ss, w: GAME.c.ss },
	zlood_4: { sx: 8+3, sy: 1, h: GAME.c.ss, w: GAME.c.ss },
	zlood_5: { sx: 8+4, sy: 1, h: GAME.c.ss, w: GAME.c.ss },
	zlood_6: { sx: 8+5, sy: 1, h: GAME.c.ss, w: GAME.c.ss },
	zlood_7: { sx: 8+6, sy: 1, h: GAME.c.ss, w: GAME.c.ss },
	zlood_8: { sx: 8+7, sy: 1, h: GAME.c.ss, w: GAME.c.ss },

	brick_1: { sx: 8+0, sy: 2, h: GAME.c.ss, w: GAME.c.ss },
	brick_2: { sx: 8+1, sy: 2, h: GAME.c.ss, w: GAME.c.ss },
	brick_3: { sx: 8+2, sy: 2, h: GAME.c.ss, w: GAME.c.ss },
	brick_4: { sx: 8+3, sy: 2, h: GAME.c.ss, w: GAME.c.ss },

	health:  { sx: 8+0, sy: 4, h: GAME.c.ss, w: GAME.c.ss },
	score:   { sx: 8+4, sy: 4, h: GAME.c.ss, w: GAME.c.ss }
}

$(function() {

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");

	canvas.height = GAME.c.h*GAME.c.s;
	canvas.width = GAME.c.w*GAME.c.s;

	var spritesheet = new Image();
		spritesheet.src = 'moving_dude.png';

	class Mover {
		constructor(type, name, x, y) {
			this.type = type;
			this.name = name;
			this.hp = BEING[this.name].maxhp;
			this.maxhp = BEING[this.name].maxhp;

			this.facing = 0;
			this.skin = 1;
			this.h = BEING[this.name].h; //height
			this.w = BEING[this.name].w; //width
			this.s = BEING[this.name].s; //speed
			this.f = BEING[this.name].f; //friction multiplier
			this.a = BEING[this.name].a; //acceleration
			this.d = BEING[this.name].d; //deceleration
			this.sl = BEING[this.name].sl; //overall slow effect. 0 = 0% speed, 1 = 100% speed.
			this.ma = BEING[this.name].ma; //max acceleration
			this.x = x; //start x
			this.y = y; //start y

			this.state = {
				touching: {
					bool: false
				},
				ragemode: {
					bool: false
				}
			}

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
			
			ctx.save();
			if (this.state.touching.bool) {
				ctx.filter = 'brightness(100)';
			}
			if (this.state.ragemode.bool) {
				ctx.filter = 'saturate(500%)';
			}

			if (this.left.bool || this.right.bool || this.up.bool || this.down.bool) {
				ctx.drawImage(spritesheet, this.skin*GAME.c.r + BEING[this.name].sx*GAME.c.r, this.facing*GAME.c.r + BEING[this.name].sy*GAME.c.r, GAME.c.r, GAME.c.r, this.x, this.y, this.h, this.w);
			} else {
				ctx.drawImage(spritesheet, 0 + BEING[this.name].sx*GAME.c.r, this.facing*GAME.c.r + BEING[this.name].sy*GAME.c.r, GAME.c.r, GAME.c.r, this.x, this.y, this.h, this.w);
			}
			ctx.restore();
		}
		placeHp() {
			//health bar!
			var progress = this.hp/this.maxhp;
			var barwidth = this.w/2;
			var barheight = 6;

			if (progress > 0) {
				ctx.fillStyle = '#111';
				ctx.fillRect(this.x + barwidth/2, this.y + this.h, barwidth, barheight);
				ctx.fillStyle = '#ff3333';
				ctx.fillRect(this.x + barwidth/2 + barwidth*Math.abs(progress-1)/2, this.y + this.h, barwidth*progress, barheight);
			}
		}
		colCheck() {
			var iterator = 0;

			for (let i = 0; i < GAME.g.e.length; i++) {
				var e = GAME.g.e[i];

				var pointX = this.x + this.w/2;
				var pointY = this.y + this.h/2;
				var rectX = e.x;
				var rectY = e.y;
				var rectWidth = e.w;
				var rectHeight = e.h;

				//if (GAME.g.t % 100 == 0) console.log(pointX+" "+pointY+" "+rectX+" "+rectY+" "+rectWidth+" "+rectHeight);

				if (pointX > rectX && pointX < rectX + rectWidth) {
					if (pointY > rectY && pointY < rectY + rectHeight) {
						if (e.type == 'enemy') {
							//bloodsplat
							if (this.hp > 0) {
								var ri = randInt(1, 8);
								if (GAME.g.t % 10 == 0) GAME.g.d.push( new Entity('blood_'+ri, this.x, this.y) );
								if (GAME.g.d.length > 99) {
									GAME.g.d.shift();
								}
							}

							if (GAME.g.p.state.ragemode.bool) {
								GAME.g.e.splice(i, 1);
								GAME.g.d.push( new Entity('zlood_'+randInt(1, 8), this.x, this.y) );

								GAME.s.kills++;
								$('.kills').text(GAME.s.kills);
							} else {
								this.hp--;
								if (this.hp < 0) {
									//player dies
									GAME.g.p.sl = 0;

									$('#modal_bg').show();
									$('#death_modal').show();
								}

								iterator++;
							}
						}
					}
				}
			}

			if (iterator > 0 && this.hp > 0) {
				this.state.touching.bool = true;
			} else {
				this.state.touching.bool = false;
			}

			//pickups!
			for (let i = 0; i < GAME.g.c.length; i++) {
				var c = GAME.g.c[i];

				var pointX = this.x + this.w/2;
				var pointY = this.y + this.h/2;
				var rectX = c.x;
				var rectY = c.y;
				var rectWidth = c.w;
				var rectHeight = c.h;

				if (pointX > rectX && pointX < rectX + rectWidth) {
					if (pointY > rectY && pointY < rectY + rectHeight) {
						if (c.name == 'health') {
							this.hp += 10;
							if (this.hp > this.maxhp) this.hp = this.maxhp; //cant overheal
							GAME.g.c.splice(i, 1);
							GAME.g.c.push( new Entity('health', randInt(GAME.g.b, canvas.width-GAME.g.b), randInt(GAME.g.b, canvas.height-GAME.g.b)) );

							GAME.s.pickups.health++;
							$('.num_of_health').text(GAME.s.pickups.health);
						} else if (c.name == 'score') {
							GAME.g.p.sl = BEING.player.sl*2;
							GAME.g.p.state.ragemode.bool = true;
							window.setTimeout(function() {
								GAME.g.p.sl = BEING.player.sl;
								GAME.g.p.state.ragemode.bool = false;
							}, 1000);
							GAME.g.c.splice(i, 1);
							GAME.g.c.push( new Entity('score', randInt(GAME.g.b, canvas.width-GAME.g.b), randInt(GAME.g.b, canvas.height-GAME.g.b)) );

							GAME.s.pickups.score++;
							$('.num_of_score').text(GAME.s.pickups.score);
						}
					}
				}
			}
		}
	}

	class Entity {
		constructor(name, x, y, attr) {
			this.name = name;
			this.x = x; 
			this.y = y;
			this.h = ENTITY[this.name].h;
			this.w = ENTITY[this.name].w;

			this.skin = 0;

			this.attr = attr ? attr : {};
		}
		place() {
			ctx.drawImage(spritesheet, ENTITY[this.name].sx*GAME.c.r + this.skin*GAME.c.r, ENTITY[this.name].sy*GAME.c.r, GAME.c.r, GAME.c.r, this.x, this.y, this.h, this.w);
		}
		swapSkin() {
			if (GAME.g.t % GAME.g.s == 0) {
				if (this.skin < 3) {
					this.skin++;
				} else {
					this.skin = 0;
				}
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
				case 65: //left arrow key
					GAME.g.p.lastpressed = 'left';
					GAME.g.p.left.bool = true;
					break;
				case 68: //right arrow key
					GAME.g.p.lastpressed = 'right';
					GAME.g.p.right.bool = true;
					break;
				case 87: //up arrow key
					GAME.g.p.lastpressed = 'up';
					GAME.g.p.up.bool = true;
					break;
				case 83: //down arrow key
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
				case 65: //left arrow key
					GAME.g.p.left.bool = false;
					break;
				case 68: //right arrow key
					GAME.g.p.right.bool = false;
					break;
				case 87: //up arrow key
					GAME.g.p.up.bool = false;
					break;
				case 83: //down arrow key
					GAME.g.p.down.bool = false;
					break;
			}
		}
	});

	$('#acceleration').on('click', function() {
		if ($(this).is(':checked')) {
			GAME.a.showDebug = true;
		} else {
			GAME.a.showDebug = false;
		}
	});

	function draw() {
		//spawning enemies
		if (GAME.g.t % 30 == 0 && GAME.a.started) {
			var r = Math.random();
			if (r < 0.25) {
				GAME.g.e.push( new Mover('enemy', 'runner', randInt(0, canvas.width), 0) );
			} else if (r < 0.5) {
				GAME.g.e.push( new Mover('enemy', 'walker', canvas.width, randInt(0, canvas.height)) );
			} else if (r < 0.75) {
				GAME.g.e.push( new Mover('enemy', 'walker', randInt(0, canvas.width), canvas.height) );
			} else {
				GAME.g.e.push( new Mover('enemy', 'walker', 0, randInt(0, canvas.height)) );
			}

			if (GAME.g.e.length > 99) {
				GAME.g.e.shift();
			}

			//make it harder
			if (GAME.g.p.hp > 0) {
				BEING.runner.sl = BEING.runner.sl*1.0025;
				BEING.walker.sl = BEING.walker.sl*1.001;
			}
		}

		GAME.g.t++;

		render();
		function render() {
			ctx.font = '20px monospace';

			//drawing
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.fillStyle = '#222034';
			ctx.fillRect(1, 1, canvas.width-1*2, canvas.height-1*2);

			//rendering decoration (floor layer)
			for (let i = 0; i < GAME.g.d.length; i++) {
				GAME.g.d[i].place();
			}

			//rendering pickups (floor+1 layer)
			for (let i = 0; i < GAME.g.c.length; i++) {
				GAME.g.c[i].swapSkin();
				GAME.g.c[i].place();
			}

			//rendering movers
			GAME.g.p.swapSkin();
			if (GAME.a.started) GAME.g.p.move();
			GAME.g.p.place();
			GAME.g.p.colCheck();

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
			
			if (GAME.a.started) GAME.g.p.placeHp();

			if (GAME.a.showDebug) {
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
		}

		window.requestAnimationFrame(draw);
	}

	GAME.g.p = new Mover('player', 'player', 960 - GAME.p.w/2, 540 - GAME.p.h*2);

	GAME.g.c.push( new Entity('health', randInt(GAME.g.b, canvas.width-GAME.g.b), randInt(GAME.g.b, canvas.height-GAME.g.b)) );
	GAME.g.c.push( new Entity('score', randInt(GAME.g.b, canvas.width-GAME.g.b), randInt(GAME.g.b, canvas.height-GAME.g.b)) );

	for (let i=0;i<10;i++) {
		var ri = randInt(1,4);
		GAME.g.d.push( new Entity('brick_'+ri, randInt(0, canvas.width), randInt(0, canvas.height)) );
	}

	//startscreen
	$('#start_modal').show();
	$('#start_button').on('click', function() {
		$('#start_modal').hide();
		$('#modal_bg').hide();

		GAME.a.started = true;

		window.setInterval(function() {
			if (!document.hidden) {
				timerCycle();
			}
		}, 1000);
	});
	
	//stopwatch

	var sec = 0;
	var min = 0;

	function timerCycle() {
		sec = parseInt(sec);
		min = parseInt(min);
		
		sec = sec + 1;

		if (sec == 60) {
			min = min + 1;
			sec = 0;
		}

		if (sec < 10 || sec == 0) {
			sec = '0' + sec;
		}
		if (min < 10 || min == 0) {
			min = '0' + min;
		}

		if (GAME.g.p.hp > 0) $('.timer').text(min+":"+sec);
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