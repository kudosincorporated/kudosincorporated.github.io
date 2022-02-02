var GAME = {
	a: {
		showDebug: false,
		started: false,
		begin: false,
		maxZombies: 99,
		maxEntities: 199
	},
	g: {
		character: 'shank',
		t: 0, //tick
		s: 20, //swap/switch player skin
		b: 128, //border used for spawning pickups
		d: [], //decoration
		e: [], //enemies
		c: [], //pickups
		bl: [],
		p: {} //player,
	},
	c: { //canvas
		h: 9, //height
		w: 16, //width
		s: 120, //size
		r: 64, //spritesheet ratio,
		ss: 64, //general spritesize
	},
	p: { //default values
		h: 64, //height
		w: 64, //width
		x: 960, //start x
		y: 540, //start y
		unlocked: {
			shank: true,
			akiko: false,
			toddy: false,
			rr375: false
		}
	},
	s: { //stats
		kills: 0,
		pickups: {
			health: 0,
			score: 0
		},
		totals: {
			kills: 0,
			health: 0,
			score: 0
		}
	},
	keydown: {
		angles: ['┘', '┴', '└', '├', '┌', '┬', '┐', '┤']
	}
}

var sec = 0;
var min = 0;
var interval;

var BEING = {
	shank: {
		sx: 0,
		sy: 16,
		h: GAME.p.h,
		w: GAME.p.w,
		maxhp: 100,
		s: 2, //speed
		f: 10, //friction multiplier
		a: 2, //acceleration
		d: 1, //deceleration
		sl: 0.25, //overall slow effect. 0 = 0% speed, 1 = 100% speed.
		ma: 50, //max acceleration
		rs: 2, //roll strength
		cs: 2, //crouch strength
		rl: 50, //roll length
		hr: 0 //health regen
	},
	akiko: {
		sx: 0,
		sy: 0,
		h: GAME.p.h,
		w: GAME.p.w,
		maxhp: 100,
		s: 2, //speed
		f: 10, //friction multiplier
		a: 2, //acceleration
		d: 1, //deceleration
		sl: 0.25, //overall slow effect. 0 = 0% speed, 1 = 100% speed.
		ma: 50, //max acceleration
		rs: 2, //roll strength
		cs: 2, //crouch strength
		rl: 50, //roll length
		hr: 0 //health regen
	},
	toddy: {
		sx: 0,
		sy: 24,
		h: GAME.p.h,
		w: GAME.p.w,
		maxhp: 100,
		s: 2, //speed
		f: 10, //friction multiplier
		a: 2, //acceleration
		d: 1, //deceleration
		sl: 0.25, //overall slow effect. 0 = 0% speed, 1 = 100% speed.
		ma: 50, //max acceleration
		rs: 2, //roll strength
		cs: 2, //crouch strength
		rl: 50, //roll length
		hr: 0 //health regen
	},
	rr375: {
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
		ma: 50, //max acceleration
		rs: 2, //roll strength
		cs: 2, //crouch strength
		rl: 50, //roll length
		hr: 1 //health regen
	},
	walker: {
		sx: 16,
		sy: 0,
		h: GAME.c.ss,
		w: GAME.c.ss,
		maxhp: 1,
		s: 0, //speed
		f: 1, //friction multiplier
		a: 5, //acceleration
		d: 1, //deceleration
		sl: 0.001, //overall slow effect. 0 = 0% speed, 1 = 100% speed.
		ma: 500, //max acceleration
		rs: 3, //roll strength
		cs: 2, //crouch strength
		rl: 50, //roll length
		hr: 0 //health regen
	},
	runner: {
		sx: 16,
		sy: 8,
		h: GAME.c.ss,
		w: GAME.c.ss,
		maxhp: 1,
		s: 2, //speed
		f: 1, //friction multiplier
		a: 5, //acceleration
		d: 1, //deceleration
		sl: 0.001, //overall slow effect. 0 = 0% speed, 1 = 100% speed.
		ma: 500, //max acceleration
		rs: 3, //roll strength
		cs: 2, //crouch strength
		rl: 50, //roll length
		hr: 0 //health regen
	}
}

var rd = 24; //displacement

var ENTITY = {
	blood_1: { sx: rd+0, sy: 0, h: GAME.c.ss, w: GAME.c.ss },
	blood_2: { sx: rd+1, sy: 0, h: GAME.c.ss, w: GAME.c.ss },
	blood_3: { sx: rd+2, sy: 0, h: GAME.c.ss, w: GAME.c.ss },
	blood_4: { sx: rd+3, sy: 0, h: GAME.c.ss, w: GAME.c.ss },
	blood_5: { sx: rd+4, sy: 0, h: GAME.c.ss, w: GAME.c.ss },
	blood_6: { sx: rd+5, sy: 0, h: GAME.c.ss, w: GAME.c.ss },
	blood_7: { sx: rd+6, sy: 0, h: GAME.c.ss, w: GAME.c.ss },
	blood_8: { sx: rd+7, sy: 0, h: GAME.c.ss, w: GAME.c.ss },

	zlood_1: { sx: rd+0, sy: 1, h: GAME.c.ss, w: GAME.c.ss },
	zlood_2: { sx: rd+1, sy: 1, h: GAME.c.ss, w: GAME.c.ss },
	zlood_3: { sx: rd+2, sy: 1, h: GAME.c.ss, w: GAME.c.ss },
	zlood_4: { sx: rd+3, sy: 1, h: GAME.c.ss, w: GAME.c.ss },
	zlood_5: { sx: rd+4, sy: 1, h: GAME.c.ss, w: GAME.c.ss },
	zlood_6: { sx: rd+5, sy: 1, h: GAME.c.ss, w: GAME.c.ss },
	zlood_7: { sx: rd+6, sy: 1, h: GAME.c.ss, w: GAME.c.ss },
	zlood_8: { sx: rd+7, sy: 1, h: GAME.c.ss, w: GAME.c.ss },

	decor_1: { sx: rd+0, sy: 2, h: GAME.c.ss, w: GAME.c.ss },
	decor_2: { sx: rd+1, sy: 2, h: GAME.c.ss, w: GAME.c.ss },
	decor_3: { sx: rd+2, sy: 2, h: GAME.c.ss, w: GAME.c.ss },
	decor_4: { sx: rd+3, sy: 2, h: GAME.c.ss, w: GAME.c.ss },
	decor_5: { sx: rd+4, sy: 2, h: GAME.c.ss, w: GAME.c.ss },
	decor_6: { sx: rd+5, sy: 2, h: GAME.c.ss, w: GAME.c.ss },
	decor_7: { sx: rd+6, sy: 2, h: GAME.c.ss, w: GAME.c.ss },
	decor_8: { sx: rd+7, sy: 2, h: GAME.c.ss, w: GAME.c.ss },

	health:  { sx: rd+0, sy: 4, h: GAME.c.ss, w: GAME.c.ss },
	score:   { sx: rd+4, sy: 4, h: GAME.c.ss, w: GAME.c.ss },

	tree_1_0:{ sx: rd+0, sy: 5, h: GAME.c.ss, w: GAME.c.ss },
	tree_1_1:{ sx: rd+0, sy: 6, h: GAME.c.ss, w: GAME.c.ss },
	tree_1_2:{ sx: rd+0, sy: 7, h: GAME.c.ss, w: GAME.c.ss },
	tree_2_0:{ sx: rd+1, sy: 5, h: GAME.c.ss, w: GAME.c.ss },
	tree_2_1:{ sx: rd+1, sy: 6, h: GAME.c.ss, w: GAME.c.ss },
	tree_2_2:{ sx: rd+1, sy: 7, h: GAME.c.ss, w: GAME.c.ss },
	tree_3_0:{ sx: rd+2, sy: 5, h: GAME.c.ss, w: GAME.c.ss },
	tree_3_1:{ sx: rd+2, sy: 6, h: GAME.c.ss, w: GAME.c.ss },
	tree_3_2:{ sx: rd+2, sy: 7, h: GAME.c.ss, w: GAME.c.ss },
	tree_4_0:{ sx: rd+3, sy: 5, h: GAME.c.ss, w: GAME.c.ss },
	tree_4_1:{ sx: rd+3, sy: 6, h: GAME.c.ss, w: GAME.c.ss },
	tree_4_2:{ sx: rd+3, sy: 7, h: GAME.c.ss, w: GAME.c.ss }
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
			this.rs = BEING[this.name].rs; //roll strength
			this.cs = BEING[this.name].cs; //crouch strength
			this.rl = BEING[this.name].rl; //crouch strength
			this.hr = BEING[this.name].hr; //health regen
			this.x = x; //start x
			this.y = y; //start y

			this.state = {
				touching: {
					bool: false
				},
				ragemode: {
					bool: false
				},
				crouching: {
					bool: false
				},
				rolling: {
					bool: false,
					val: 0
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
			//deceleration
			if (!this.state.rolling.bool) {
				if (this.left.val > 0) this.left.val -= this.d;
				if (this.right.val > 0) this.right.val -= this.d;
				if (this.up.val > 0) this.up.val -= this.d;
				if (this.down.val > 0) this.down.val -= this.d;
			}

			//acceleration
			if (!this.state.crouching.bool) this.x -= this.left.val/this.f*this.sl;
			if (!this.state.crouching.bool) this.x += this.right.val/this.f*this.sl;
			if (!this.state.crouching.bool) this.y -= this.up.val/this.f*this.sl;
			if (!this.state.crouching.bool) this.y += this.down.val/this.f*this.sl;

			//dodge roll
			if (this.state.rolling.bool) {
				this.x -= this.left.val/this.f*this.sl*this.rs*this.state.rolling.val/this.rl;
				this.x += this.right.val/this.f*this.sl*this.rs*this.state.rolling.val/this.rl;
				this.y -= this.up.val/this.f*this.sl*this.rs*this.state.rolling.val/this.rl;
				this.y += this.down.val/this.f*this.sl*this.rs*this.state.rolling.val/this.rl;
			}

			//calculate movement speed
			var movespeed = this.s;
			if (this.state.crouching.bool) movespeed = this.s*this.cs;

			//normal movement
			if (!this.state.rolling.bool) {
				if (this.left.bool) {
					this.x -= movespeed*this.sl; //add speed
					if (this.left.val < this.ma) this.left.val += this.a; //add acceleration
				}
				if (this.right.bool) {
					this.x += movespeed*this.sl;
					if (this.right.val < this.ma) this.right.val += this.a;
				}
				if (this.up.bool) {
					this.y -= movespeed*this.sl;
					if (this.up.val < this.ma) this.up.val += this.a;
				}
				if (this.down.bool) {
					this.y += movespeed*this.sl;
					if (this.down.val < this.ma) this.down.val += this.a;
				}
			}

			//don't go out of bounds
			if (this.x < 0) this.x = 0;
			if (this.x > canvas.width-this.w) this.x = canvas.width-this.w;
			if (this.y < 0) this.y = 0;
			if (this.y > canvas.height-this.h) this.y = canvas.height-this.h;

			if (this.state.rolling.val > 0) {
				this.state.rolling.val--;
			} else {
				this.state.rolling.bool = false;
			}
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

			//shadow
			ctx.drawImage(spritesheet, 32*GAME.c.r, 3*GAME.c.r, GAME.c.r, GAME.c.r, this.x, this.y, this.h, this.w);

			var crouchDisp = 0;

			if (this.state.touching.bool) {
				ctx.filter = 'brightness(100)';
			}
			if (this.state.ragemode.bool) {
				ctx.filter = 'saturate(500%)';
			}
			if (this.state.crouching.bool) {
				crouchDisp += GAME.c.r*4;
			}

			if (this.state.rolling.val > 0) {
				ctx.drawImage(
					spritesheet,
					BEING[this.name].sx*GAME.c.r + 8*GAME.c.r + (Math.floor(Math.abs(this.state.rolling.val-this.rl)/this.rl*6) % 6)*GAME.c.r,
					this.facing*GAME.c.r + BEING[this.name].sy*GAME.c.r,
					GAME.c.r,
					GAME.c.r,
					this.x,
					this.y,
					this.h,
					this.w
				);
			} else {
				if (this.left.bool || this.right.bool || this.up.bool || this.down.bool) {
					ctx.drawImage(spritesheet, this.skin*GAME.c.r + BEING[this.name].sx*GAME.c.r + crouchDisp, this.facing*GAME.c.r + BEING[this.name].sy*GAME.c.r, GAME.c.r, GAME.c.r, this.x, this.y, this.h, this.w);
				} else {
					ctx.drawImage(spritesheet, 0 + BEING[this.name].sx*GAME.c.r + crouchDisp, this.facing*GAME.c.r + BEING[this.name].sy*GAME.c.r, GAME.c.r, GAME.c.r, this.x, this.y, this.h, this.w);
				}
			}

			ctx.restore();
		}
		placeHp() {
			//health bar!
			var progress = this.hp/this.maxhp;
			var barwidth = this.w/2;
			var barheight = 6;

			if (progress > 0) {
				ctx.save();
				ctx.fillStyle = '#111';
				ctx.fillRect(this.x + barwidth/2, this.y + this.h, barwidth, barheight);
				ctx.fillStyle = '#ff3333';
				ctx.fillRect(this.x + barwidth/2 + barwidth*Math.abs(progress-1)/2, this.y + this.h, barwidth*progress, barheight);
				ctx.restore();
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
								if (GAME.g.d.length > GAME.a.maxEntities) {
									var len = 0;
									while (len < GAME.g.d.length-1) {
										var str = GAME.g.d[len].name.substring(1,5);
										if (str == 'lood') { //so stupid lol
											GAME.g.d.splice(len, 1);
											break;
										}

										len++;
									}
								}
							}

							if (GAME.g.p.state.ragemode.bool) {
								GAME.g.e.splice(i, 1);
								GAME.g.d.push( new Entity('zlood_'+randInt(1, 8), this.x, this.y) );

								GAME.s.kills++;
								GAME.s.totals.kills++;
								$('.kills').text(GAME.s.kills);
							} else {
								this.hp--;
								if (this.hp < 0) {
									//player dies
									GAME.g.p.sl = 0;

									if (GAME.a.started) {
										$('#modal_bg').show();
										$('#death_modal').show();
									}

									GAME.a.started = false;
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
							this.hp += 10 + (GAME.s.pickups.health*5);
							if (this.hp > this.maxhp) this.hp = this.maxhp; //cant overheal
							GAME.g.c.splice(i, 1);
							GAME.g.c.push( new Entity('health', randInt(GAME.g.b, canvas.width-GAME.g.b), randInt(GAME.g.b, canvas.height-GAME.g.b)) );

							GAME.s.pickups.health++;
							GAME.s.totals.health++;
							$('.num_of_health').text(GAME.s.pickups.health);
						} else if (c.name == 'score') {
							GAME.g.p.sl = BEING[GAME.g.character].sl*2;
							GAME.g.p.state.ragemode.bool = true;
							window.setTimeout(function() {
								GAME.g.p.sl = BEING[GAME.g.character].sl;
								GAME.g.p.state.ragemode.bool = false;
							}, 1000);
							GAME.g.c.splice(i, 1);
							GAME.g.c.push( new Entity('score', randInt(GAME.g.b, canvas.width-GAME.g.b), randInt(GAME.g.b, canvas.height-GAME.g.b)) );

							GAME.s.pickups.score++;
							GAME.s.totals.score++;
							$('.num_of_score').text(GAME.s.pickups.score);
						}
					}
				}
			}
		}
		blockCheck() {
			for (let i = 0; i < GAME.g.bl.length; i++) {
				var bl = GAME.g.bl[i];

				var pointX = this.x + this.w/2;
				var pointY = this.y + this.h/2;
				var rectX = bl.x;
				var rectY = bl.y;
				var rectWidth = bl.w;
				var rectHeight = bl.h;

				if (pointX > rectX && pointX < rectX + rectWidth) {
					if (pointY > rectY && pointY < rectY + rectHeight) {
						var distances = [
							{ id: 'up', val: Math.abs(rectY - pointY) },
							{ id: 'down', val: Math.abs(rectY+rectHeight - pointY) },
							{ id: 'left', val: Math.abs(rectX - pointX) },
							{ id: 'right', val: Math.abs(rectX+rectWidth - pointX) }
						];

						//https://stackoverflow.com/questions/8864430/compare-javascript-array-of-objects-to-get-min-max
						var lowest = distances.reduce(function(prev, curr) {
							return prev.val < curr.val ? prev : curr;
						});

						switch (lowest.id) {
							case 'up':
								this.y = rectY - this.h/2;
								break;
							case 'down':
								this.y = rectY+rectHeight - this.h/2;
								break;
							case 'left':
								this.x = rectX - this.w/2;
								break;
							case 'right':
								this.x = rectX+rectWidth - this.w/2;
								break;
						}
					}
				}
			}
		}
	}

	class Entity {
		constructor(name, x, y, layer) {
			this.name = name;
			this.x = x; 
			this.y = y;
			this.h = ENTITY[this.name].h;
			this.w = ENTITY[this.name].w;

			this.skin = 0;

			this.layer = layer ? layer : 0;
		}
		place() {
			//shadow
			if (this.name == 'health' || this.name == 'score') {
				ctx.drawImage(spritesheet, 32*GAME.c.r, 3*GAME.c.r, GAME.c.r, GAME.c.r, this.x, this.y, this.h, this.w);
			}
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
				case 90:
					if (!GAME.g.p.state.rolling.bool) {
						GAME.g.p.state.rolling.val = GAME.g.p.rl;
					}
					GAME.g.p.state.rolling.bool = true;
					break;
				case 88:
					GAME.g.p.state.crouching.bool = true;
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
				case 88:
					GAME.g.p.state.crouching.bool = false;
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

	var times = [];
	var fps;

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

			if (GAME.g.e.length > GAME.a.maxZombies) {
				GAME.g.e.shift();
			}

			//make it harder
			if (GAME.g.p.hp > 0) {
				BEING.runner.sl = BEING.runner.sl*1.0025;
				BEING.walker.sl = BEING.walker.sl*1.001;
			}

			//regen hp!
			if (GAME.g.p.hp < GAME.g.p.maxhp) {
				GAME.g.p.hp += GAME.g.p.hr;
			}
		}

		GAME.g.t++;

		render();
		function render() {
			ctx.font = '20px monospace';

			//drawing
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.fillStyle = '#222340';
			ctx.fillRect(1, 1, canvas.width-1*2, canvas.height-1*2);

			//rendering decoration (floor layer)
			for (let i = 0; i < GAME.g.d.length; i++) {
				if (GAME.g.d[i].layer == 0) {
					GAME.g.d[i].place();
				}
			}

			//rendering pickups (floor+1 layer)
			for (let i = 0; i < GAME.g.c.length; i++) {
				GAME.g.c[i].swapSkin();
				if (GAME.a.started) GAME.g.c[i].place();
			}

			//rendering movers
			GAME.g.p.swapSkin();
			if (GAME.a.started) GAME.g.p.move();
			GAME.g.p.blockCheck();
			if (GAME.a.started) GAME.g.p.place();
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
				GAME.g.e[i].blockCheck();
				GAME.g.e[i].place();

				//ctx.fillStyle = 'gold';
				//ctx.fillText(e.name + " " + e.x.toFixed(0) + " " + e.y.toFixed(0), 20, 120+(20*i));
			}
			
			//rendering decoration (tree layer)
			for (let i = 0; i < GAME.g.d.length; i++) {
				if (GAME.g.d[i].layer == 1) {
					GAME.g.d[i].place();
				}
			}

			if (GAME.a.started) GAME.g.p.placeHp();

			if (GAME.a.showDebug) {
				for (let i = 0; i < GAME.g.bl.length; i++) {
					var bl = GAME.g.bl[i];

					ctx.fillStyle = 'black';
					ctx.fillRect(bl.x, bl.y, bl.w, bl.h);

					ctx.fillStyle = 'white';
					var guys = "x:"+bl.x+" y:"+bl.y;
					var gals = "h:"+bl.h+" w:"+bl.w;
					var duds = "x+w:"+(bl.x+bl.w)+" y+h:"+(bl.y+bl.h);
					ctx.fillText(guys, bl.x, bl.y+20);
					ctx.fillText(gals, bl.x, bl.y+40);
					ctx.fillText(duds, bl.x, bl.y+60);
				}

				ctx.fillStyle = 'white';
				ctx.fillText('x '+GAME.g.p.x.toFixed(0), 20, 40);
				ctx.fillText('y '+GAME.g.p.y.toFixed(0), 20, 60);
				ctx.fillText(GAME.g.p.left.val, 100, 60);
				ctx.fillText(GAME.g.p.right.val, 180, 60);
				ctx.fillText(GAME.g.p.up.val, 140, 40);
				ctx.fillText(GAME.g.p.down.val, 140, 80);
				ctx.fillText(GAME.keydown.angles[GAME.g.p.facing], 140, 60);
				ctx.fillText(GAME.g.p.lastpressed, 220, 40);
				ctx.fillText(GAME.g.p.state.crouching.bool, 220, 60);
				ctx.fillText(GAME.g.p.state.rolling.val, 220, 80);
			}
		}


		const now = performance.now();
		while (times.length > 0 && times[0] <= now - 1000) {
			times.shift();
		}
		times.push(now);
		fps = times.length;

		ctx.fillStyle = 'white';
		ctx.fillText(fps, 20, 20);

		window.requestAnimationFrame(draw);
	}

	function initaliseGame(gameMode) {
		var gm = gameMode ? gameMode : '';

		GAME.g.d = [];
		GAME.g.e = [];
		GAME.g.bl = [];

		GAME.g.p = new Mover('player', GAME.g.character, 960 - GAME.p.w/2, 540 - GAME.p.h*2);

		for (let i=0;i<20;i++) {
			var ri = randInt(1,8);
			GAME.g.d.push( new Entity('decor_'+ri, randInt(0, canvas.width), randInt(0, canvas.height)) );
		}

		if (gm == 'classic') {

		} else {
			for (let i=0;i<20;i++) {
				var ri = randInt(1,4);
				var rx = randInt(0, canvas.width);
				var ry = randInt(0, canvas.height);
				GAME.g.d.push( new Entity('tree_'+ri+'_0', rx, ry, 1) );
				GAME.g.d.push( new Entity('tree_'+ri+'_1', rx, ry+GAME.c.ss, 1) );
				GAME.g.d.push( new Entity('tree_'+ri+'_2', rx, ry+GAME.c.ss, 0) );

				GAME.g.bl.push({
					x: rx+GAME.c.ss/4,
					y: ry+GAME.c.ss,
					h: GAME.c.ss,
					w: GAME.c.ss/2
				})
			}
		}
	}

	function startGame() {
		GAME.g.e = [];
		
		GAME.g.p = new Mover('player', GAME.g.character, 960 - GAME.p.w/2, 540 - GAME.p.h*2);

		GAME.g.c = [];
		if (GAME.g.character != 'toddy') { //no health if you're toddy...
			GAME.g.c.push( new Entity('health', randInt(GAME.g.b, canvas.width-GAME.g.b), randInt(GAME.g.b, canvas.height-GAME.g.b)) );
		}
		GAME.g.c.push( new Entity('score', randInt(GAME.g.b, canvas.width-GAME.g.b), randInt(GAME.g.b, canvas.height-GAME.g.b)) );
		if (GAME.g.character == 'toddy') { //extra one if you're toddy
			GAME.g.c.push( new Entity('score', randInt(GAME.g.b, canvas.width-GAME.g.b), randInt(GAME.g.b, canvas.height-GAME.g.b)) );
		}
	}

	//startscreen
	$('#start_modal').show();
	$('.start-button').on('click', function() {
		$('.modal').hide();
		$('#modal_bg').hide();

		initaliseGame();
		startGame();

		GAME.a.started = true;

		sec = 0;
		min = 0;
		clearInterval(interval);
		interval = setInterval(function() {
			timerCycle();
		}, 1000);
	});

	$('#newGame').on('click', function() {
		$('.modal').hide();
		$('#start_modal').show();
		$('#modal_bg').show();

		GAME.a.started = false;
	});

	$('#classic_button').on('click', function() {
		$('.modal').hide();
		$('#modal_bg').hide();

		GAME.g.character = 'shank';

		initaliseGame('classic');
		startGame();

		GAME.a.started = true;

		sec = 0;
		min = 0;
		clearInterval(interval);
		interval = setInterval(function() {
			timerCycle();
		}, 1000);
	});

	//menu
	$('#characters_button').on('click', function() {
		$('#start_modal .upper').css('top','-100%');
		$('#start_modal .lower').css('top','0');

		//calculate if the characters are unlocked
		if (GAME.s.totals.kills >= 1000) {
			GAME.p.unlocked.rr375 = true;
			$('#rr375').addClass('unlocked');
		}

		if (GAME.s.totals.health >= 25) {
			GAME.p.unlocked.akiko = true;
			$('#akiko').addClass('unlocked');
		}

		if (GAME.s.totals.score >= 50) {
			GAME.p.unlocked.toddy = true;
			$('#toddy').addClass('unlocked');
		}
	});
	$('#up_button').on('click', function() {
		$('#start_modal .upper').css('top','0');
		$('#start_modal .lower').css('top','100%');
	});

	$('.character').on('click', function() {
		var id = $(this).attr('id');
		
		if (GAME.p.unlocked[id]) {
			GAME.g.character = id;
			$('.character').removeClass('selected');
			$(this).addClass('selected');
		}
	});

	
	//stopwatch
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

	initaliseGame();
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