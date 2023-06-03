var FPS = 60;
var interval;
var PAUSED = false;

var FISHEYEBASE = -1;

var SPEED = 1;

var SCORE = 0;

var DIRS = ['up','left','down','right'];

var GAME = {
	p: [],
	w: [],
	e: [],
	b: [],
	x: [],
	c: { 		//canvas
		h: 9, 	//height
		w: 16, 	//width
		s: 120 	//size-
	},
	a: {
		h: 9,
		w: 16
	}
}

var ENEMY_BODIES = ['mono','quad','nexus'];
var ENEMY_SHOOT = ['slow','med','fast'];

var BODIES = {
	player: {
		r: 'x',			//shape
		score: 0,		//score (only applicable for enemies)
		h: GAME.c.s/2, 	//height
		w: GAME.c.s/2, 	//width
		s: 5, 			//speed
		f: 10, 			//friction multiplier
		a: 2, 			//acceleration
		d: 1, 			//deceleration
		ma: 10, 		//max acceleration
		hp: 1
	},
	world: {
		r: 's',
		score: 0,
		h: GAME.a.h*GAME.c.s*2,
		w: GAME.a.w*GAME.c.s*2,
		s: 0,
		f: 0,
		a: 0,
		d: 0,
		ma: 0,
		hp: 99999
	},
	bullet: {
		r: 'c',
		score: 0,
		h: GAME.c.s/4,
		w: GAME.c.s/4,
		s: 2,
		f: 10,
		a: 2,
		d: 1,
		ma: 50,
		hp: 1
	},
	experience: {
		r: 't',
		score: 0,
		h: GAME.c.s/4,
		w: GAME.c.s/6,
		s: 5,
		f: 5,
		a: 2,
		d: 1,
		ma: 10
	},
	mono: {
		r: 't',
		score: 3,
		h: GAME.c.s/2,
		w: GAME.c.s/2,
		s: 2,
		f: 10,
		a: 2,
		d: 1,
		ma: 50,
		hp: 1
	},
	quad: {
		r: 's',
		score: 6,
		h: GAME.c.s/2,
		w: GAME.c.s/2,
		s: 2,
		f: 10,
		a: 2,
		d: 1,
		ma: 50,
		hp: 1
	},
	nexus: {
		r: 'c',
		score: 9,
		h: GAME.c.s/2,
		w: GAME.c.s/2,
		s: 2,
		f: 10,
		a: 2,
		d: 1,
		ma: 50,
		hp: 1
	}
}

var SHOOT = {
	player: {
		c: '#ccccff',
		score: 0,
		dmg: 3, //tear damage
		fir: 25, //fire rate
		prj: 1, //projectiles
		kbk: 5, //knockback
		ran: 0.01, //range
		shs: GAME.c.s*2.5 //shot speed
	},
	UNARMED: {
		c: '#ffcc66',
		score: 0,
		dmg: 0, //tear damage
		fir: 99999, //fire rate
		prj: 0, //projectiles
		kbk: 0, //knockback
		ran: 0, //range
		shs: 0 //shot speed
	},
	slow: {
		c: '#ff3333',
		score: 2,
		dmg: 1, //tear damage
		fir: 150*2, //fire rate
		prj: 1, //projectiles
		kbk: 5, //knockback
		ran: 1, //range
		shs: GAME.c.s*1 //shot speed
	},
	med: {
		c: '#ff33cc',
		score: 3,
		dmg: 1, //tear damage
		fir: 100*2, //fire rate
		prj: 1, //projectiles
		kbk: 5, //knockback
		ran: 1, //range
		shs: GAME.c.s*0.75 //shot speed
	},
	fast: {
		c: '#00ccff',
		score: 4,
		dmg: 1, //tear damage
		fir: 50*2, //fire rate
		prj: 1, //projectiles
		kbk: 5, //knockback
		ran: 1, //range
		shs: GAME.c.s*0.5 //shot speed
	}
}


//Howler.js
/*Howler.volume(0);

var HOWLER = {
	move: new Howl({ src: ['sounds/move.wav'] }),
	coin: new Howl({ src: ['sounds/coin.wav'] }),
	click: new Howl({ src: ['sounds/click.wav'] }),
	fail: new Howl({ src: ['sounds/fail.wav'], volume: 0.25 })
}*/

class Mover {
	constructor(body, shoot, x, y) {
		this.body = body;
		this.shoot = shoot;

		this.source = {
			body: body,
			shoot: shoot
		};

		this.x = x;
		this.y = y;
		this.c = SHOOT[shoot].c;
		this.r = BODIES[body].r;
		this.h = BODIES[body].h;
		this.w = BODIES[body].w;
		this.s = BODIES[body].s;
		this.f = BODIES[body].f;
		this.a = BODIES[body].a;
		this.d = BODIES[body].d;
		this.ma = BODIES[body].ma;

		this.cntrl = [];
		this.dmg = SHOOT[shoot].dmg;
		this.base_fir = SHOOT[shoot].fir;
		this.fir = SHOOT[shoot].fir;
		this.dly = 0;
		this.prj = SHOOT[shoot].prj;
		this.kbk = SHOOT[shoot].kbk;
		this.ran = SHOOT[shoot].ran;
		this.shs = SHOOT[shoot].shs;

		this.hp = BODIES[body].hp;
		this.mhp = BODIES[body].hp; //currently unused

		this.bu = 1; //bullet modifier
		this.mu = 1; //movement modifier

		this.key = {
			left: { bool: false, val: 0 },
			right: { bool: false, val: 0 },
			up: { bool: false, val: 0 },
			down: { bool: false, val: 0 }
		}

		this.state = {
			touching: { bool: false },
			spawning: { val: 0 },
			spinning: { bool: false, val: 0 },
			hurting: { val: 0 }
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

		if (this.state.spawning.val > 0) {
			this.state.spawning.val--;
		}

		if (this.state.spinning.val > 0) {
			this.state.spinning.val--;
		} else {
			if (this.state.spinning.bool) {
				this.state.spinning.val = 50;
			}
		}

		if (this.state.hurting.val > 0) {
			this.state.hurting.val = Math.pow(this.state.hurting.val, 0.99)-0.1;
			SPEED = 1 - this.state.hurting.val/100;
		}
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
		this.x += GAME.p[0].key.left.val/GAME.p[0].f*SPEED*(1 + GAME.p[0].mu/100);
		this.x -= GAME.p[0].key.right.val/GAME.p[0].f*SPEED*(1 + GAME.p[0].mu/100);
		this.y += GAME.p[0].key.up.val/GAME.p[0].f*SPEED*(1 + GAME.p[0].mu/100);
		this.y -= GAME.p[0].key.down.val/GAME.p[0].f*SPEED*(1 + GAME.p[0].mu/100);

		if (GAME.p[0].key.left.bool) 	this.x += GAME.p[0].s*SPEED*(1 + GAME.p[0].mu/100);
		if (GAME.p[0].key.right.bool) 	this.x -= GAME.p[0].s*SPEED*(1 + GAME.p[0].mu/100);
		if (GAME.p[0].key.up.bool) 		this.y += GAME.p[0].s*SPEED*(1 + GAME.p[0].mu/100);
		if (GAME.p[0].key.down.bool) 	this.y -= GAME.p[0].s*SPEED*(1 + GAME.p[0].mu/100);
	}
	edgeTeleport() {
		if (this.x < 0-this.w) this.x = canvas.width-1;
		if (this.x > canvas.width) this.x = 0-this.w+1;
		if (this.y < 0-this.h) this.y = canvas.height-1;
		if (this.y > canvas.height) this.y = 0-this.h+1;
	}
	fire(b_arr, body) {

		this.fir = this.base_fir/(1 + this.bu/25);

		if (this.cntrl.length > 0) {
			if (this.dly >= this.fir) {
				for (let i = 0; i < this.prj; i++) {
					var w = BODIES[body].w;
					var h = BODIES[body].h;

					w = w*(1 + this.bu/100);
					h = h*(1 + this.bu/100);

					b_arr.push(new Mover('bullet', 'UNARMED', this.x+this.w/2-w/2, this.y+this.h/2-h/2));
					b_arr[b_arr.length-1].source = this.source;
					b_arr[b_arr.length-1].c = this.c;
					b_arr[b_arr.length-1].r = this.r;

					b_arr[b_arr.length-1].w = w;
					b_arr[b_arr.length-1].h = h;

					if (i < this.cntrl.length-1) {
						b_arr[b_arr.length-1].key[this.cntrl[i]].val = this.shs*(1 + this.bu/300);
					} else {
						b_arr[b_arr.length-1].key[this.cntrl[this.cntrl.length-1]].val = this.shs*(1 + this.bu/300);
					}

					//if (this.body == 'player') HOWLER.move.play();
				}

				if (this.body == 'quad') {
					this.cntrl = [rand(DIRS)];
				}

				this.dly = 0;
			}
		}

		if (this.dly <= this.fir) {
			this.dly++;
		}

	}
	paste(ctx) {
		//ctx.fillStyle = this.c;
		//ctx.fillRect(this.x, this.y, this.w, this.h);
		
		ctx.strokeStyle = this.c;
		ctx.lineWidth = 3;

		if (this.state.spawning.val > 0) {
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = this.c;
			ctx.globalAlpha = 0.25;
			ctx.arc(this.x+this.w/2, this.y+this.w/2, this.state.spawning.val+GAME.c.s/4, 0, 2 * Math.PI);
			ctx.fill();
			ctx.restore();

			ctx.fillStyle = '#fff';
		} else {
			ctx.fillStyle = this.c;
		}

		switch (this.r) {
			case 'x':
				var a = -12*(this.state.hurting.val/100);
				var b = 4;
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
				if (this.body == 'bullet') {
					ctx.stroke(path);
				} else {
					ctx.fill(path);
					if (this.state.hurting.val > 0) {
						ctx.save();
						ctx.fillStyle = '#ff0000';
						ctx.globalAlpha = this.state.hurting.val/100;
						ctx.fill(path);
						ctx.restore();
					}
				}
				break;
			case 's':
				if (this.body == 'bullet') {
					ctx.strokeRect(this.x, this.y, this.w, this.h);
				} else {
					ctx.fillRect(this.x, this.y, this.w, this.h);
				}
				break;
			case 't':
				ctx.save();

				//https://stackoverflow.com/questions/32788694/drawing-a-triangle-on-canvas
				var path = new Path2D();

				var disp = 1 - Math.cos((Math.abs(this.state.spinning.val/50 - 0.5) * Math.PI) / 2);
				disp = disp*50;
				if (!this.state.spinning.bool) disp = 0;

				var perc = Math.abs(this.state.spinning.val/50 - 0.5)*2;

				var bord = 10;

				var x = this.x+this.w/2;
				var y = this.y+this.h/2;

				if (this.cntrl.length > 0) {

					ctx.translate(x, y);
					switch (this.cntrl[this.cntrl.length-1]) {
						case 'up':
							ctx.rotate(0 * Math.PI / 180);
							break;
						case 'left':
							ctx.rotate(270 * Math.PI / 180);
							break;
						case 'down':
							ctx.rotate(180 * Math.PI / 180);
							break;
						case 'right':
							ctx.rotate(90 * Math.PI / 180);
							break;
					}
					ctx.translate(-x, -y);

					path.moveTo(this.x+this.w/2-this.w/4,this.y+disp); //TOP POINT
					path.moveTo(this.x+this.w/2+this.w/4,this.y+disp); //TOP POINT 2
					path.lineTo(this.x+this.w,this.y+disp+this.h/2+this.h/4); //RIGHT POINT
					path.lineTo(this.x+this.w/2+this.w/8,this.y+disp+this.h); //BOTTOM POINT
					path.lineTo(this.x+this.w/2-this.w/8,this.y+disp+this.h); //BOTTOM POINT 2
					path.lineTo(this.x,this.y+disp+this.h/2+this.h/4); //LEFT POINT
					path.lineTo(this.x+this.w/2-this.w/4,this.y+disp); //COMPLETE

				} else {

					path.moveTo(this.x+this.w/2,this.y+disp); //TOP POINT
					path.lineTo(this.x+this.w,this.y+disp+this.h/2); //RIGHT POINT
					path.lineTo(this.x+this.w/2,this.y+disp+this.h); //BOTTOM POINT
					path.lineTo(this.x,this.y+disp+this.h/2); //LEFT POINT
					path.lineTo(this.x+this.w/2,this.y+disp); //COMPLETE

				}

				if (this.body == 'bullet') {
					ctx.stroke(path);
				} else {
					if (this.body == 'experience') {
						/*ctx.save();
						ctx.beginPath();
						ctx.fillStyle = SHOOT[this.source.shoot].c;
						ctx.globalAlpha = 0.25;
						ctx.arc(this.x+this.w/2, this.y+this.h*1.5, this.w/2+(1 - disp/50)*10, 0, 2 * Math.PI);
						ctx.fill();
						ctx.restore();*/

						//ctx.strokeStyle = SHOOT[this.source.shoot].c;
						var border = new Path2D();
						border.moveTo(this.x+this.w/2,this.y+disp-bord); //TOP POINT
						border.lineTo(this.x+this.w/2+(this.w/2+bord)*perc,this.y+disp+this.h/2); //RIGHT POINT
						border.lineTo(this.x+this.w/2,this.y+disp+this.h+bord); //BOTTOM POINT
						border.lineTo(this.x+this.w/2-(this.w/2+bord)*perc,this.y+disp+this.h/2); //LEFT POINT
						border.lineTo(this.x+this.w/2,this.y+disp-bord); //COMPLETE
						ctx.stroke(border);
						

						//ctx.fillStyle = SHOOT[this.source.shoot].c;
					}
				
					ctx.fill(path);
				}
				ctx.restore();
				break;
			case 'c':
				ctx.beginPath();
				ctx.arc(this.x+this.w/2, this.y+this.w/2, this.w/2, 0, 2 * Math.PI);
				if (this.body == 'bullet') {
					ctx.stroke();
				} else {
					ctx.fill();
				}
				break;
			default:
				ctx.fillRect(this.x, this.y, this.w, this.h);
		}

		/*if (this.state.touching.bool) {
			ctx.strokeStyle = 'red';
			ctx.strokeRect(this.x, this.y, this.w, this.h);
		}*/
	}
	paste_reload(ctx, r) {
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = this.c;
		ctx.globalAlpha = 0.25;
		ctx.arc(this.x+this.w/2, this.y+this.h/2, r, 0 + 1.5*Math.PI, (this.dly/this.fir)*2*Math.PI + 1.5*Math.PI);
		ctx.stroke();
		ctx.restore();
	}
	paste_health(ctx, r, mx, my) {

		for (let i = 0; i < this.hp; i++) {

			var x = mx + r * Math.cos(2*i*Math.PI/this.hp + 1.5*Math.PI);
			var y = my + r/2 * Math.sin(2*i*Math.PI/this.hp + 1.5*Math.PI);

			ctx.save();

			//ctx.translate(x, y);
			//ctx.rotate((this.dly/this.fir*360) * Math.PI / 180);
			//ctx.translate(-x, -y);

			ctx.globalAlpha = 0.75;

			var hs = 20;

			ctx.fillStyle = SHOOT.slow.c;
			//ctx.strokeStyle = this.c;

			/*ctx.fillRect(x, y, hs, hs);
			ctx.beginPath();
			ctx.arc(x+hs/2, y, hs/2, 0, 2 * Math.PI);
			ctx.arc(x, y+hs/2, hs/2, 0, 2 * Math.PI);
			ctx.fill();*/

			/*ctx.beginPath();
			ctx.arc(x, y, hs, 0 + 1.5*Math.PI, 2 * Math.PI + 1.5*Math.PI);
			ctx.stroke();*/

			if (this.body == 'player') {
				x = x-this.w/6;
				y = y-this.h/6;
			} else {
				x = x+this.w/3;
				y = y+this.h/3;
			}

			var path = new Path2D();
			path.moveTo(	x+hs/2,		y+hs/6 	); //TOP POINT
			path.lineTo(	x+hs-hs/6,		y 		); //RIGHT POINT
			path.lineTo(	x+hs+hs/6,	y+hs/4 	); //RIGHT POINT
			path.lineTo(	x+hs,		y+hs/2 	); //RIGHT POINT
			path.lineTo(	x+hs/2,		y+hs 	); //BOTTOM POINT
			path.lineTo(	x,			y+hs/2 	); //LEFT POINT
			path.lineTo(	x-hs/6,			y+hs/4 	); //LEFT POINT
			path.lineTo(	x+hs/6,			y 		); //LEFT POINT
			path.lineTo(	x+hs/2,		y+hs/6 	); //COMPLETE
			ctx.fill(path);

			ctx.restore();

		}

	}
	aimTowardsPlayer() {
		var run = GAME.p[0].x+GAME.p[0].w/2 - this.x-this.w/2;
		var rise = GAME.p[0].y+GAME.p[0].h/2 - this.y-this.h/2;
		var length = Math.sqrt((rise*rise) + (run*run)); //pseudocode
		var unitX = run / length;
		var unitY = rise / length;

		if (unitX > 0) this.key.right.bool = true; else this.key.right.bool = false;
		if (unitX < 0) this.key.left.bool = true; else this.key.left.bool = false;
		if (unitY > 0) this.key.down.bool = true; else this.key.down.bool = false;
		if (unitY < 0) this.key.up.bool = true; else this.key.up.bool = false;
	}
	colCheck(arr) {
		var iterator = 0;

		for (let i = 0; i < arr.length; i++) {
			var e = arr[i];

			var pointX = this.x;
			var pointY = this.y;
			var pointWidth = this.w;
			var pointHeight = this.h;
			var rectX = e.x;
			var rectY = e.y;
			var rectWidth = e.w;
			var rectHeight = e.h;

			if (
				pointX + pointWidth > rectX &&
				pointX < rectX + rectWidth &&
				pointY + pointHeight > rectY &&
				pointY < rectY + rectHeight
			) {
				iterator++;
				break; //THIS COULD CAUSE WEIRD INTERACTION IN THE FUTURE!!
			}
		}

		if (iterator > 0) {

			//ITERATOR IS ABOVE ZERO, SO TOUCHING
			this.state.touching.bool = true;

			//BULLET
			if (this.body == 'bullet') {

				//HITS AN ENEMY
				if (ENEMY_BODIES.indexOf(e.body) != -1) {

					e.key.up.val = this.key.up.val/SHOOT[this.source.shoot].kbk;
					e.key.left.val = this.key.left.val/SHOOT[this.source.shoot].kbk;
					e.key.down.val = this.key.down.val/SHOOT[this.source.shoot].kbk;
					e.key.right.val = this.key.right.val/SHOOT[this.source.shoot].kbk;

					//SHOT BY A PLAYER
					if (this.source.body == 'player') {

						this.key.up.val = 0;
						this.key.left.val = 0;
						this.key.down.val = 0;
						this.key.right.val = 0;

						e.hp -= SHOOT[this.source.shoot].dmg;

						//Scoring system.
						//Multiples the value of an enemies' colour and shape together.
						//Lowest possible scoring enemy is worth 6 (3*2, diamond-blue), highest is 36 (9*4, circle-red).
						//To min-max this game you should aim to kill red or circular enemies.

						//Hello future me!
						//Changing the scoring system so soon?

						var add = BODIES[e.body].score*SHOOT[e.shoot].score;
						SCORE += add;

					}

					//SHOT BY AN ENEMY
					if (ENEMY_BODIES.indexOf(this.source.body) != -1) {

						this.state.touching.bool = false;

					}

				}

				//HITS THE PLAYER
				if (e.body == 'player') {

					//SHOT BY A PLAYER
					if (this.source.body == 'player') {

						this.state.touching.bool = false;

					}

					//SHOT BY AN ENEMY
					if (ENEMY_BODIES.indexOf(this.source.body) != -1) {

						if (e.hp > 0) {
							this.key.up.val = 0;
							this.key.left.val = 0;
							this.key.down.val = 0;
							this.key.right.val = 0;

							e.state.hurting.val += 100;

							e.hp -= SHOOT[this.source.shoot].dmg;

							if (e.hp <= 0) {

								//GAME OVER
								GAME.p[0].s = 0;
								GAME.p[0].a = 0;

								for (let i=0;i<GAME.e.length;i++) { GAME.e[i].c = '#fff'; }

								$('#score').html('');
								$('#endscreen').show();
								for (let i = 0; i < SCORE.toString().length; i++) {
									setTimeout(function() {
										$('#score').append(SCORE.toString().charAt(i));
									}, i*300);
								}

							}

							//HOWLER.fail.play();
						}

					}

				}

			}

			//EXPERIENCE
			if (this.body == 'experience') {

				if (e.body == 'player') {

					this.hp = 0;

				}

			}

		} else {

			//ITERATOR IS EQUAL ZERO, SO NOT TOUCHING
			this.state.touching.bool = false;

		}
	}
	blockCheck(arr, ind) {
		if (ind == undefined) var ind = -1;

		for (let i = 0; i < arr.length; i++) {
			if (i != ind) {
				var bl = arr[i];

				var pointX = this.x;
				var pointY = this.y;
				var pointWidth = this.w;
				var pointHeight = this.h;
				var rectX = bl.x;
				var rectY = bl.y;
				var rectWidth = bl.w;
				var rectHeight = bl.h;

				if (
					pointX + pointWidth > rectX &&
					pointX < rectX + rectWidth &&
					pointY + pointHeight > rectY &&
					pointY < rectY + rectHeight
				) {
					var distances = [
						{ id: 'up', 	val: Math.abs(rectY - pointY-pointHeight) },
						{ id: 'down', 	val: Math.abs(rectY+rectHeight - pointY) },
						{ id: 'left', 	val: Math.abs(rectX - pointX-pointWidth) },
						{ id: 'right', 	val: Math.abs(rectX+rectWidth - pointX) }
					];

					var lowest = distances.reduce(function(prev, curr) {
						return prev.val < curr.val ? prev : curr;
					});

					switch (lowest.id) {
						case 'up':
							this.y = rectY-pointHeight;
							break;
						case 'down':
							this.y = rectY+rectHeight;
							break;
						case 'left':
							this.x = rectX-pointWidth;
							break;
						case 'right':
							this.x = rectX+rectWidth;
							break;
					}
				}
			}
		}
	}
	checkDeath(arr, i) {
		if (this.hp <= 0) {
			//ENEMY DYING
			if (ENEMY_BODIES.indexOf(this.body) != -1) {

				var chance = 1;
				var random = Math.random();

				if (this.shoot == 'slow') chance = 0.25;

				if (random < chance) {
					GAME.x.push(new Mover('experience', 'UNARMED', this.x+this.w/2, this.y+this.h/2));
					GAME.x[GAME.x.length-1].source = this.source;
					GAME.x[GAME.x.length-1].c = this.c;
					GAME.x[GAME.x.length-1].state.spinning.bool = true;
				}

				newRandomEnemy(randInt(0,canvas.width), randInt(0,canvas.height));
				newRandomEnemy(randInt(0,canvas.width), randInt(0,canvas.height));

				//HOWLER.click.play();

			}

			//EXPERIENCE DYING
			if (this.body == 'experience') {
				
				switch (this.source.shoot) {
					case 'fast':
						GAME.p[0].su++;
						break;
					case 'med':
						GAME.p[0].bu++;
						break;
					case 'slow':
						GAME.p[0].hp++;
						break;
				}

				//HOWLER.coin.play();

			}

			arr.splice(i, 1);
			i--;
		}
	}
}

function newRandomEnemy(x, y) {
	var cb = rand(ENEMY_BODIES);
	var cs = rand(ENEMY_SHOOT);

	GAME.e.push(new Mover(cb, cs, x, y));

	GAME.e[GAME.e.length-1].cntrl = ['up'];

	GAME.e[GAME.e.length-1].state.spawning.val = 99;

	if (cb == 'mono') {
		GAME.e[GAME.e.length-1].cntrl = [rand(DIRS)];
	}

	if (cb == 'nexus') {
		GAME.e[GAME.e.length-1].prj = 4;
		GAME.e[GAME.e.length-1].cntrl = DIRS;
	}
}

$(function() {

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");
	var display = document.getElementById("display");

	//Initalise canvas/display.
	canvas.height = display.height = GAME.c.h*GAME.c.s;
	canvas.width = display.width = GAME.c.w*GAME.c.s;

	//canvas.height = display.height = $(window).height();
	//canvas.width = display.width = $(window).width();

	//Change playing bounds on window resize.
	//Definitely could lead to some sort of exploit.
	//Works with zoom changes as well, which changes the position of enemies. This is unintended.
	/*$(window).on('resize', function() {
		canvas.height = display.height = $(window).height();
		canvas.width = display.width = $(window).width();
	});*/

	//Fisheye.js
	var fisheye = new Fisheye(display);

	GAME.p.push( new Mover('player', 'player', canvas.width/2, canvas.height/2) );

	//GAME.w.push( new Mover('world', 'UNARMED', -GAME.a.w*GAME.c.s/2, -GAME.a.h*GAME.c.s/2) );
	//GAME.w[0].state.spawning.val = 0;

	for (let i = 0; i < 1; i++) {
		setTimeout(function() {
			newRandomEnemy(randInt(0,canvas.width), randInt(0,canvas.height));
		}, i*randInt(10,100))
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

				case 38: //UP-ARROW
					GAME.p[0].cntrl.push('up');
					break;
				case 37: //LEFT-ARROW
					GAME.p[0].cntrl.push('left');
					break;
				case 40: //DOWN-ARROW
					GAME.p[0].cntrl.push('down');
					break;
				case 39: //RIGHT-ARROW
					GAME.p[0].cntrl.push('right');
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
				case 38: //UP-ARROW
					GAME.p[0].cntrl = GAME.p[0].cntrl.filter(e => e !== 'up');
					break;
				case 37: //LEFT-ARROW
					GAME.p[0].cntrl = GAME.p[0].cntrl.filter(e => e !== 'left');
					break;
				case 40: //DOWN-ARROW
					GAME.p[0].cntrl = GAME.p[0].cntrl.filter(e => e !== 'down');
					break;
				case 39: //RIGHT-ARROW
					GAME.p[0].cntrl = GAME.p[0].cntrl.filter(e => e !== 'right');
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

			var barrel = FISHEYEBASE - GAME.p[0].state.hurting.val/100;
			var red = barrel*0.9;
			var green = barrel;
			var blue = barrel*1.1;

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
			ctx.beginPath();
			ctx.fillStyle = SHOOT.player.c;
			ctx.globalAlpha = 0.03;
			ctx.arc(canvas.width/2, canvas.height/2, GAME.c.s*5, 0, 2 * Math.PI);
			ctx.fill();
			ctx.beginPath();
			ctx.fillStyle = SHOOT.player.c;
			ctx.globalAlpha = 0.03;
			ctx.arc(canvas.width/2, canvas.height/2, GAME.c.s*2, 0, 2 * Math.PI);
			ctx.fill();
			ctx.restore();

			//world
			/*GAME.w[0].adjust();
			GAME.w[0].worldMove();
			GAME.w[0].paste(ctx);*/

			//enemy
			for (let i = 0; i < GAME.e.length; i++) {
				var e = GAME.e[i];

				e.adjust();
				e.move();
				e.worldMove();
				e.edgeTeleport();
				if (e.state.spawning.val == 0) e.fire(GAME.b, 'bullet');
				e.paste(ctx);
				if (e.state.spawning.val == 0) e.paste_reload(ctx, GAME.c.s/2);
				//e.paste_health(ctx, GAME.c.s/2, e.x, e.y);
				e.checkDeath(GAME.e, i);
			}

			//enemy blockcheck
			for (let i = 0; i < GAME.e.length; i++) {
				GAME.e[i].blockCheck(GAME.e, i);
			}

			//player
			GAME.p[0].adjust();
			GAME.p[0].x = canvas.width/2 - GAME.p[0].w/2 - GAME.p[0].key.left.val + GAME.p[0].key.right.val;
			GAME.p[0].y = canvas.height/2 - GAME.p[0].h/2 - GAME.p[0].key.up.val + GAME.p[0].key.down.val;

			if (GAME.p[0].hp > 0) {

				GAME.p[0].fire(GAME.b, 'bullet');
				//GAME.p[0].colCheck(GAME.e);
				GAME.p[0].paste(ctx);
				GAME.p[0].paste_reload(ctx, GAME.c.s/2);
				GAME.p[0].paste_health(ctx, GAME.c.s/2, canvas.width/2, GAME.c.s/2);

			}

			//collect
			for (let i = 0; i < GAME.x.length; i++) {
				var x = GAME.x[i];

				var run = GAME.p[0].x - x.x;
				var rise = GAME.p[0].y - x.y;
				var length = Math.sqrt((rise*rise) + (run*run)); //pseudocode
				if (length < GAME.c.s*2) {
					x.aimTowardsPlayer();
				}

				x.adjust();
				x.move();
				x.worldMove();
				x.edgeTeleport();
				x.colCheck(GAME.p);
				x.paste(ctx);
				x.checkDeath(GAME.x, i);
			}

			//bullet
			for (let i = 0; i < GAME.b.length; i++) {
				var b = GAME.b[i];

				b.adjust();
				b.move();
				b.worldMove();
				b.colCheck(GAME.p);
				b.colCheck(GAME.e);
				b.paste(ctx);

				if (b.key.up.val/SHOOT[b.source.shoot].shs < (1-SHOOT[b.source.shoot].ran)) b.key.up.val = b.key.up.val*0.95;
				if (b.key.left.val/SHOOT[b.source.shoot].shs < (1-SHOOT[b.source.shoot].ran)) b.key.left.val = b.key.left.val*0.95;
				if (b.key.down.val/SHOOT[b.source.shoot].shs < (1-SHOOT[b.source.shoot].ran)) b.key.down.val = b.key.down.val*0.95;
				if (b.key.right.val/SHOOT[b.source.shoot].shs < (1-SHOOT[b.source.shoot].ran)) b.key.right.val = b.key.right.val*0.95;

				if (
					b.key.up.val/SHOOT[b.source.shoot].shs < 0.05 &&
					b.key.left.val/SHOOT[b.source.shoot].shs < 0.05 &&
					b.key.down.val/SHOOT[b.source.shoot].shs < 0.05 &&
					b.key.right.val/SHOOT[b.source.shoot].shs < 0.05
				) {
					GAME.b.splice(i, 1);
					i--;
				}
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