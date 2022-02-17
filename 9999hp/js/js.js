var GAME = {
	a: {
		begun: false,
		paused: true,
		showDebug: false,
		maxZombies: 99,
		maxEntities: 199,
		quoteChance: 0.33,
		randomQuoteChance: 0.1,
		quoteTiming: 5000
	},
	g: {
		character: 'player',
		t: 0, //tick
		s: 20, //swap/switch player skin
		b: 128, //border used for spawning pickups
		d: [], //decoration
		e: [], //enemies
		c: [], //pickups
		bl: [],
		p: {}, //player
		sliderMoving: true,
		slider: 0,
		sliderMax: 1000,
		increment: 1,
		goingRight: true,
		phase: 'battle', //'battle', 'carousel'
		level: 0,
		totalSummons: 20,
		summons: 20,
		wheelMoving: false,
		wheel: 0
	},
	c: { //canvas
		h: 12, //height
		w: 18, //width
		h2: 2.5, //slider/canvas2 height
		s: 64, //size
		r: 64, //spritesheet ratio,
		ss: 64, //general spritesize
	},
	p: { //default values
		h: 64, //height
		w: 64, //width
		x: 0, //start x
		y: 0 //start y
	},
	b: {
		damage: {
			buff: 0,
			quote: 'Hmm. Well done. Your monsters now deal 1.2x damage.'
		},
		health: {
			buff: 0,
			quote: 'Ah, congratulations. Your monsters now have 1.2x the HP.'
		},
		execution: {
			buff: 0,
			quote: 'Nice one... very effective... the knight will be executed at a lower threshold of HP.'
		},
		plague: {
			buff: 0,
			quote: 'Diabolical...! The knight is infected, lowering his maximum HP.'
		}
	},
	q: {
		startingQuotes: [
		"HEY! WAKE UP!",
		"A filthy knight has made their way into the cursed library!",
		"*YOUR* cursed library!",
		"If left alone, they could end up wrecking all your books!",
		"I have an idea...",
		"Why don't you put 'Monster Summoning for Dummies' to good use?",
		"Quickly, summon a dragon!",
		"...",
		".....",
		"Wait... is that just a rat? Did you even read the book?"
		],
		rat: [
		"Really? This is the best you can come up with?",
		"Well. That's not really going to make a dent.",
		"A rat? Really?",
		"A tad weak, don't you think?",
		"You realise you could've summoned a dragon right?",
		"Well, it's better than a mouse. I think.",
		"You realise, of course, knights are much bigger than rats?",
		"I have heard rats don't do too well with armour.",
		"SAY HELLO TO MY LITTLE FREN.",
		"Do you want to be turned into a rabbit? LESS RATS, MORE DRAGONS.",
		"Wow, you made a rat. Big deal. Rats can do that.",
		"Digusting little creatures, rats. Please dont' make another.",
		"Maybe it's not so bad. Maybe the knight is ratphobic.",
		"Well that's beyond useless.",
		"Okay, that's your last chance. No more rats.",
		"You're better than this. I know you are."
		],
		slime: [
		"A slime. How classic.",
		"What's this going to do? Slime him to death?",
		"It's better than a rat I suppose.",
		"Did someone sneeze?",
		"How... slimey.",
		"That thing moves fast for something made of gelatin.",
		"Aww! How cute! (I'm kidding).",
		"Kind of disgusting, but if it get's the job done..."
		],
		chickrich: [
		"What in God's name have you created?",
		"I wonder what this thing tastes like? Chicken... or ostrich?",
		"Give that knight a Kentucy Fried Kick to the Face!",
		"Part chicken... part ostrich... all terror.",
		"Does it lay eggs y'reckon?",
		"Terrifying... and probably tasty.",
		"Y'know, if you weren't a summoner, you could've been a half-decent farmer.",
		"Summoning is art. But what you've created here... this is not art."
		],
		dragon: [
		"NOW THIS IS A SUMMONING!",
		"Yes! Go beast, go!",
		"I think the knight just peed their pants.",
		"Dragons are really cool. Especially red ones.",
		"Dragons have historically done quite well against knights. I think.",
		"YESS!!! AN HUGE DRAGONNN!!!! Ahem. Nice one.",
		"Burn, knight, burn!",
		"Fire breath CAN melt steel armour.",
		"This'll wipe that smug look of that knight's face.",
		"SUMMONING SUCCESS!!",
		"Never say I didn't believe in you!",
		"I NEVER DOUBTED YOU COULD DO IT!!",
		"Beautiful... and I'm not just saying that since I'm dragosexual.",
		"A marvelous drake. Congratulations, summoner.",
		"You ever summon a dragon and forget why?",
		"Wow. I didn't think you could do it. Nice job."
		],
		random: [
		"Summoning is all about the summon. Never forget that.",
		"Summoning is best on a rainy autumn afternoon. Sigh.",
		"Do you ever think about what you'd do if you weren't summoning?",
		"Nothing like the smell of summons in the morning.",
		"Who said summoning wasn't fun?",
		"Dragons, slimes, rats... a bit derivative, no?",
		"Where's cthulhu? Can someone wake him up?",
		"If you make it through Summoning for Dummies, I'll let you peek at the Necromicon.",
		"Where did I leave my scepticism potion... Oh, it's in my hand. Or is it?",
		"Never talk to wizards... they're a desperate bunch.",
		"I miss when witches and warlocks were friends. You never know it's the good times, eh?",
		"Tounge of newt... Eye of gopher... What creepy dude even made this recipe?",
		"My mother always wanted me to be a summoner. But... I love ballet...",
		"Summoning feels great, doesn't it?",
		"Summoning really is an artform.",
		"Never put off for tomorrow what you can summon today."
		]
	}
}

var sec = 0;
var min = 0;
var interval;

var BEING = {
	player: {
		sx: 0,
		sy: 0,
		dx: 1,
		dy: 1,
		h: GAME.p.h,
		w: GAME.p.w,
		maxhp: 9999,
		dmg: 1,
		s: 2, //speed
		f: 10, //friction multiplier
		a: 2, //acceleration
		d: 1, //deceleration
		sl: 0.25, //overall slow effect. 0 = 0% speed, 1 = 100% speed
		ma: 50 //max acceleration
	},
	dead_player: {
		sx: 4,
		sy: 0,
		dx: 1,
		dy: 1,
		h: GAME.p.h,
		w: GAME.p.w,
		maxhp: 99,
		dmg: 1,
		s: 2, //speed
		f: 10, //friction multiplier
		a: 2, //acceleration
		d: 1, //deceleration
		sl: 0.25, //overall slow effect. 0 = 0% speed, 1 = 100% speed
		ma: 50 //max acceleration
	},
	rat: {
		sx: 0,
		sy: 8,
		dx: 1,
		dy: 1,
		h: GAME.c.ss,
		w: GAME.c.ss,
		maxhp: 25,
		dmg: 1,
		s: 0, //speed
		f: 1, //friction multiplier
		a: 5, //acceleration
		d: 1, //deceleration
		sl: 0.01, //overall slow effect. 0 = 0% speed, 1 = 100% speed
		ma: 500 //max acceleration
	},
	slime: {
		sx: 8,
		sy: 8,
		dx: 1,
		dy: 1,
		h: GAME.c.ss,
		w: GAME.c.ss,
		maxhp: 100,
		dmg: 1,
		s: 0, //speed
		f: 1, //friction multiplier
		a: 5, //acceleration
		d: 1, //deceleration
		sl: 0.005, //overall slow effect. 0 = 0% speed, 1 = 100% speed
		ma: 500 //max acceleration
	},
	chickrich: {
		sx: 0,
		sy: 16,
		dx: 1,
		dy: 2,
		h: GAME.c.ss,
		w: GAME.c.ss,
		maxhp: 200,
		dmg: 2,
		s: 0, //speed
		f: 1, //friction multiplier
		a: 5, //acceleration
		d: 1, //deceleration
		sl: 0.005, //overall slow effect. 0 = 0% speed, 1 = 100% speed
		ma: 250 //max acceleration
	},
	dragon: {
		sx: 4,
		sy: 16,
		dx: 3,
		dy: 3,
		h: GAME.c.ss,
		w: GAME.c.ss,
		maxhp: 500,
		dmg: 5,
		s: 0, //speed
		f: 1, //friction multiplier
		a: 5, //acceleration
		d: 1, //deceleration
		sl: 0.01, //overall slow effect. 0 = 0% speed, 1 = 100% speed
		ma: 100 //max acceleration
	}
}

var rd = 8; //displacement

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


	brick_1: { sx: rd+0, sy: 2, h: GAME.c.ss, w: GAME.c.ss },
	books_1: { sx: rd+0, sy: 3, h: GAME.c.ss, w: GAME.c.ss },
	books_2: { sx: rd+1, sy: 3, h: GAME.c.ss, w: GAME.c.ss },
	books_3: { sx: rd+0, sy: 4, h: GAME.c.ss, w: GAME.c.ss },
	books_4: { sx: rd+1, sy: 4, h: GAME.c.ss, w: GAME.c.ss },
	light_1: { sx: rd+2, sy: 3, h: GAME.c.ss, w: GAME.c.ss },
	light_2: { sx: rd+2, sy: 4, h: GAME.c.ss, w: GAME.c.ss },
	stand_1: { sx: rd+3, sy: 4, h: GAME.c.ss, w: GAME.c.ss },

	tree_1_0:{ sx: rd+4, sy: 2, h: GAME.c.ss, w: GAME.c.ss },
	tree_1_1:{ sx: rd+4, sy: 3, h: GAME.c.ss, w: GAME.c.ss },
	tree_1_2:{ sx: rd+4, sy: 4, h: GAME.c.ss, w: GAME.c.ss },
	tree_2_0:{ sx: rd+5, sy: 2, h: GAME.c.ss, w: GAME.c.ss },
	tree_2_1:{ sx: rd+5, sy: 3, h: GAME.c.ss, w: GAME.c.ss },
	tree_2_2:{ sx: rd+5, sy: 4, h: GAME.c.ss, w: GAME.c.ss },
	tree_3_0:{ sx: rd+6, sy: 2, h: GAME.c.ss, w: GAME.c.ss },
	tree_3_1:{ sx: rd+6, sy: 3, h: GAME.c.ss, w: GAME.c.ss },
	tree_3_2:{ sx: rd+6, sy: 4, h: GAME.c.ss, w: GAME.c.ss },
	tree_4_0:{ sx: rd+7, sy: 2, h: GAME.c.ss, w: GAME.c.ss },
	tree_4_1:{ sx: rd+7, sy: 3, h: GAME.c.ss, w: GAME.c.ss },
	tree_4_2:{ sx: rd+7, sy: 4, h: GAME.c.ss, w: GAME.c.ss },

	grass_1: { sx: rd+4, sy: 5, h: GAME.c.ss, w: GAME.c.ss },
	grass_2: { sx: rd+5, sy: 5, h: GAME.c.ss, w: GAME.c.ss },
	grass_3: { sx: rd+6, sy: 5, h: GAME.c.ss, w: GAME.c.ss },
	grass_4: { sx: rd+7, sy: 5, h: GAME.c.ss, w: GAME.c.ss },

	shrub_1: { sx: rd+4, sy: 6, h: GAME.c.ss, w: GAME.c.ss },
	shrub_2: { sx: rd+5, sy: 6, h: GAME.c.ss, w: GAME.c.ss },

	cacti_1_0:{ sx: rd+0, sy: 5, h: GAME.c.ss, w: GAME.c.ss },
	cacti_1_1:{ sx: rd+0, sy: 6, h: GAME.c.ss, w: GAME.c.ss },
	cacti_2_0:{ sx: rd+1, sy: 5, h: GAME.c.ss, w: GAME.c.ss },
	cacti_2_1:{ sx: rd+1, sy: 6, h: GAME.c.ss, w: GAME.c.ss },
	cacti_3_0:{ sx: rd+2, sy: 5, h: GAME.c.ss, w: GAME.c.ss },
	cacti_3_1:{ sx: rd+2, sy: 6, h: GAME.c.ss, w: GAME.c.ss },
	cacti_4_0:{ sx: rd+3, sy: 5, h: GAME.c.ss, w: GAME.c.ss },
	cacti_4_1:{ sx: rd+3, sy: 6, h: GAME.c.ss, w: GAME.c.ss },

	sand_1:{ sx: rd+4, sy: 7, h: GAME.c.ss, w: GAME.c.ss },
	sand_2:{ sx: rd+5, sy: 7, h: GAME.c.ss, w: GAME.c.ss },
	sand_3:{ sx: rd+6, sy: 7, h: GAME.c.ss, w: GAME.c.ss },
	sand_4:{ sx: rd+7, sy: 7, h: GAME.c.ss, w: GAME.c.ss },

	stars_1:{ sx: rd+0, sy: 7, h: GAME.c.ss, w: GAME.c.ss },
	stars_2:{ sx: rd+1, sy: 7, h: GAME.c.ss, w: GAME.c.ss },
	stars_3:{ sx: rd+2, sy: 7, h: GAME.c.ss, w: GAME.c.ss },
	stars_4:{ sx: rd+3, sy: 7, h: GAME.c.ss, w: GAME.c.ss }
}

$(function() {

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");

	var canvas2 = document.getElementById("canvas2"),
		ctx2 = canvas2.getContext("2d");

	canvas.height = GAME.c.h*GAME.c.s;
	canvas.width = GAME.c.w*GAME.c.s;

	canvas2.height = GAME.c.h2*GAME.c.s;
	canvas2.width = GAME.c.w*GAME.c.s;

	GAME.p.x = Math.floor(canvas.width/2);
	GAME.p.y = Math.floor(canvas.height/2);

	var spritesheet = new Image();
		spritesheet.src = 'moving_dude.png';





	//Howler.volume(1);

	var move = new Howl({ src: ['sounds/move.wav'] });
	var coin = new Howl({ src: ['sounds/coin.wav'] });
	var note = new Howl({ src: ['sounds/note.wav'] });
	var chop = new Howl({ src: ['sounds/chop.wav'] });
	var door = new Howl({ src: ['sounds/door.wav'] });
	var bossmove = new Howl({ src: ['sounds/bossmove.wav'] });
	var click = new Howl({ src: ['sounds/click.wav'] });








	class Mover {
		constructor(type, name, x, y) {
			this.type = type;
			this.name = name;
			this.hp = BEING[this.name].maxhp;
			this.maxhp = BEING[this.name].maxhp;
			this.dmg = BEING[this.name].dmg; //damage

			if (type == 'player') {
				this.hp = this.hp - 1000*GAME.b.plague.buff;
			} else if (type == 'enemy') {
				this.hp = this.hp*Math.pow(1.2, GAME.b.health.buff);
				this.maxhp = this.maxhp*Math.pow(1.2, GAME.b.health.buff);
			}

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
					BEING[this.name].sx*GAME.c.r + 4*GAME.c.r + (Math.floor(Math.abs(this.state.rolling.val-this.rl)/this.rl*6) % 6)*GAME.c.r,
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
					ctx.drawImage(
						spritesheet,
						this.skin*GAME.c.r*BEING[this.name].dx + BEING[this.name].sx*GAME.c.r + crouchDisp,
						this.facing*GAME.c.r*BEING[this.name].dy + BEING[this.name].sy*GAME.c.r,
						GAME.c.r*BEING[this.name].dx,
						GAME.c.r*BEING[this.name].dy,
						this.x,
						this.y,
						this.h*BEING[this.name].dx,
						this.w*BEING[this.name].dy
					);
				} else {
					ctx.drawImage(
						spritesheet,
						0 + BEING[this.name].sx*GAME.c.r + crouchDisp,
						this.facing*GAME.c.r*BEING[this.name].dy + BEING[this.name].sy*GAME.c.r,
						GAME.c.r*BEING[this.name].dx,
						GAME.c.r*BEING[this.name].dy,
						this.x,
						this.y,
						this.h*BEING[this.name].dx,
						this.w*BEING[this.name].dy
					);
				}
			}

			ctx.restore();
		}
		placeHp() {
			//health bar!
			var progress = this.hp/this.maxhp;
			var barwidth = this.w/2;
			var barheight = 6;

			if (progress >= 0) {
				ctx.save();
				ctx.fillStyle = '#111';
				ctx.fillRect(
					this.x + barwidth/2 + this.w*Math.floor(BEING[this.name].dx/2),
					this.y + this.h*BEING[this.name].dy,
					barwidth,
					barheight
				);
				ctx.fillStyle = '#ff3333';
				ctx.fillRect(
					this.x + barwidth/2 + barwidth*Math.abs(progress-1)/2 + this.w*Math.floor(BEING[this.name].dx/2),
					this.y + this.h*BEING[this.name].dy,
					barwidth*progress,
					barheight);
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

								//ragemode
								if (GAME.g.p.state.ragemode.bool) {
									GAME.g.e.splice(i, 1);
									GAME.g.d.push( new Entity('zlood_'+randInt(1, 8), this.x, this.y) );

									GAME.s.kills++;
									GAME.s.totals.kills++;
									$('.kills').text(GAME.s.kills);
								} else {
									//damage buff
									this.hp -= e.dmg*Math.pow(1.2, GAME.b.damage.buff);
									//execution buff
									if (this.hp < GAME.b.execution.buff*1000) this.hp = 0;

									if (this.hp < 0) this.hp = 0;

									$('.knighthp').html(this.hp);

									if (this.hp <= 0) {
										//player dies
										GAME.g.p.sl = 0;
										GAME.a.paused = true;

										$('#modal_bg').show();
										$('#level_modal').show();

										if (GAME.g.level == 1) {
											GAME.q.startingQuotes.push("Oh, the knight is dead? Great.");
											GAME.q.startingQuotes.push("I'm impressed. Is that what you want me to say?");
											GAME.q.startingQuotes.push("Oh. You're waiting for your prize.");
											GAME.q.startingQuotes.push("Here you go.");
										} else if (GAME.g.level == 2) {
											GAME.q.startingQuotes.push("Again? Well now I actually am impressed.");
											GAME.q.startingQuotes.push("Here's another prize, summoner.");
										} else if (GAME.g.level == 3) {
											GAME.q.startingQuotes.push("Okay. Amazing.");
											GAME.q.startingQuotes.push("Here's your final prize.");
										}
									}

									iterator++;
								}
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
			/*for (let i = 0; i < GAME.g.c.length; i++) {
				var c = GAME.g.c[i];

				var pointX = this.x + this.w/2;
				var pointY = this.y + this.h/2;
				var rectX = c.x;
				var rectY = c.y;
				var rectWidth = c.w;
				var rectHeight = c.h;

				if (pointX > rectX && pointX < rectX + rectWidth) {
					if (pointY > rectY && pointY < rectY + rectHeight) {
						if (c.name == 'example') {
							//code here
							GAME.g.c.splice(i, 1);
						}
					}
				}
			}*/
		}
		touchingPlayerCheck(i) {
			var iterator = 0;

			var e = GAME.g.p;

			var pointX = this.x + this.w/2;
			var pointY = this.y + this.h/2;
			var rectX = e.x;
			var rectY = e.y;
			var rectWidth = e.w;
			var rectHeight = e.h;

			//if (GAME.g.t % 100 == 0) console.log(pointX+" "+pointY+" "+rectX+" "+rectY+" "+rectWidth+" "+rectHeight);

			if (pointX > rectX && pointX < rectX + rectWidth) {
				if (pointY > rectY && pointY < rectY + rectHeight) {
					//bloodsplat
					if (this.hp > 0) {
						var ri = randInt(1, 8);
						if (GAME.g.t % 10 == 0) GAME.g.d.push( new Entity('zlood_'+ri, this.x, this.y) );
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

					//take damage
					if (GAME.g.p.hp > 0) {
						this.hp -= GAME.g.p.dmg;

						iterator++;
					}
				}
			}

			if (iterator > 0 && this.hp > 0) {
				this.state.touching.bool = true;
			} else {
				this.state.touching.bool = false;
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
				case 32: //spacebar

				if (GAME.q.startingQuotes.length > 0) {
					saySomethingSpecific(GAME.q.startingQuotes[0]);
					GAME.q.startingQuotes.shift();

					if (GAME.q.startingQuotes == 0 && !GAME.a.begun) {
						$('#modal_bg').hide();
						$('.modal').hide();

						startGame();

						GAME.a.begun = true;
					}

				} else if (GAME.g.phase == 'battle') {

					if (GAME.g.p.hp <= 0) {

						if (GAME.g.level < 4) {
							GAME.g.phase = 'carousel';

							//$('#modal_bg').hide();
							$('.modal').hide();

							//$('#modal_bg').show();
							$('#wheel_modal').show();

							GAME.g.wheelMoving = true;
						} else {
							$('.modal').hide();
							$('#modal_bg').hide();

							advanceLevel();
							initaliseGame();
							startGame();

							GAME.g.phase = 'battle';

							GAME.q.startingQuotes.push("Ah, finally.");
							GAME.q.startingQuotes.push("One dead knight.");
							GAME.q.startingQuotes.push("It was a good idea to leave the knight is outer space, floating, for eternity.");
							GAME.q.startingQuotes.push("A suitable punishment for coming into your library.");
							GAME.q.startingQuotes.push("...");
							GAME.q.startingQuotes.push(".....");
							GAME.q.startingQuotes.push("Wait...");
							GAME.q.startingQuotes.push("You did ask if they just wanted to borrow a book right?");
							GAME.q.startingQuotes.push("Boy, that would be embarassing if all the knight wanted to do was read.");
							GAME.q.startingQuotes.push("Well, it's too late now.");
							GAME.q.startingQuotes.push("Good job running the library! Keep up the good work.");
						}

					} else if (!GAME.a.paused) {

						if (GAME.g.summons > 0 && GAME.g.sliderMoving) {

							var value = GAME.g.slider/GAME.g.sliderMax;
							value = Math.abs(value-0.5)*2;
							value = Math.abs(value-1);

							var x = 0;
							var y = 0;

							var r = Math.random();
							if (r < 0.25) {
								x = randInt(0, canvas.width);
								y = 0;
							} else if (r < 0.5) {
								x = canvas.width;
								y = randInt(0, canvas.height);
							} else if (r < 0.75) {
								x = randInt(0, canvas.width);
								y = canvas.height;
							} else {
								x = 0;
								y = randInt(0, canvas.height);
							}

							var enemyToSpawn = 'rat';

							if (value < 0.03) {
								enemyToSpawn = 'dragon';
								bossmove.play();
							} else if (value < 0.07) {
								enemyToSpawn = 'chickrich';
								note.play();
							} else if (value < 0.61) {
								enemyToSpawn = 'rat';
								chop.play();
							} else if (value < 0.82) {
								enemyToSpawn = 'slime';
								door.play();
							} else if (value < 0.98) {
								enemyToSpawn = 'chickrich';
								note.play();
							} else if (value <= 1) {
								enemyToSpawn = 'dragon';
								bossmove.play();
							}

							GAME.g.e.push( new Mover('enemy', enemyToSpawn, x, y) );

							if (Math.random() < GAME.a.quoteChance) {
								if (Math.random() < GAME.a.randomQuoteChance) {
									saySomething();
								} else {
									saySomething(enemyToSpawn);
								}
							}

							if (GAME.g.e.length > GAME.a.maxZombies) {
								GAME.g.e.shift();
							}

							GAME.g.sliderMoving = false;
							window.setTimeout(function() {
								GAME.g.sliderMoving = true;
							}, 500);

							GAME.g.summons--;
							$('.summons').html(GAME.g.summons);

						}

					}

				} else if (GAME.g.phase == 'carousel') {

					if (GAME.g.wheelMoving == true) {

						var w = GAME.g.wheel;
						var prize = 'damage';

						if (w < 12.5) {
							prize = 'damage';
						} else if (w < 25) {
							prize = 'health';
						} else if (w < 37.5) {
							prize = 'execution';
						} else if (w < 50) {
							prize = 'plague';
						} else if (w < 62.5) {
							prize = 'damage';
						} else if (w < 75) {
							prize = 'health';
						} else if (w < 87.5) {
							prize = 'execution';
						} else if (w <= 100) {
							prize = 'plague';
						}

						GAME.b[prize].buff++;
						GAME.q.startingQuotes.push(GAME.b[prize].quote);

						GAME.g.wheelMoving = false;

						coin.play();

					} else {

						$('.modal').hide();
						$('#modal_bg').hide();

						advanceLevel();
						initaliseGame();
						startGame();

						GAME.g.phase = 'battle';

						if (GAME.g.level == 2) {
							GAME.q.startingQuotes.push("Hey! This knight isn't dead!");
							GAME.q.startingQuotes.push("...just fleeing through the forest.");
							GAME.q.startingQuotes.push("Well, what are you waitng for? Make this kight pay.");
							GAME.q.startingQuotes.push("(By the way, as we move further from the library your power weakens.)");
							GAME.q.startingQuotes.push("(You'll only have 15 summons to work with this time.)");
						} else if (GAME.g.level == 3) {
							GAME.q.startingQuotes.push("Can you kill this knight already?");
							GAME.q.startingQuotes.push("We've been chasing him for days.");
							GAME.q.startingQuotes.push("DAYS. I've missed TV shows for this. Kill them already.");
						} else if (GAME.g.level == 4) {
							GAME.q.startingQuotes.push("THAT DAMNED KNIGHT!!");
							GAME.q.startingQuotes.push("WE'VE CHASED HIM ALL THE WAY INTO OUTER SPACE.");
							GAME.q.startingQuotes.push("CAN.");
							GAME.q.startingQuotes.push("YOU.");
							GAME.q.startingQuotes.push("PLEEEEEEEASE.");
							GAME.q.startingQuotes.push("KILL THEM!!!!!!!");
							GAME.q.startingQuotes.push("...Ahem.");
						}

					}

				}

				break;

				case 13:
				//saySomething();
				break;
			}
		}
	});

	$('body').on('keyup', function(e) {
		getKeyAndMove(e);

		function getKeyAndMove(e) {
			var key_code = e.which || e.keyCode;
			switch (key_code) {
				case 32: //spacebar
					break;
			}
		}
	});

	var times = [];
	var fps;

	var moves = ['up','right','down','left'];
	var currentMove =  moves[0];
	var timeUntilNextMove = 0;

	function draw() {
		GAME.g.t++;

		if (timeUntilNextMove > 0) {
			timeUntilNextMove--;
		} else {
			currentMove = rand(moves);

			timeUntilNextMove = randInt(3,30);
			
			for (let i=0;i<moves.length;i++) {
				GAME.g.p[moves[i]].bool = false;
			}
			GAME.g.p.lastpressed = currentMove;
			GAME.g.p[currentMove].bool = true;
		}

		render();

		function render() {
			ctx.font = '12px monospace';

			//drawing
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.fillStyle = '#564064';
			ctx.fillRect(4, 4, canvas.width-4*2, canvas.height-4*2 + 4);

			//rendering decoration (floor layer)
			for (let i = 0; i < GAME.g.d.length; i++) {
				if (GAME.g.d[i].layer == 0) {
					GAME.g.d[i].place();
				}
			}

			//rendering pickups (floor+1 layer)
			for (let i = 0; i < GAME.g.c.length; i++) {
				GAME.g.c[i].swapSkin();
				GAME.g.c[i].place();
			}

			//rendering movers
			if (!GAME.a.paused) GAME.g.p.swapSkin();
			if (!GAME.a.paused) GAME.g.p.move();
			GAME.g.p.blockCheck();
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

				if (!GAME.a.paused) GAME.g.e[i].swapSkin();
				if (!GAME.a.paused) GAME.g.e[i].move();
				GAME.g.e[i].blockCheck();
				GAME.g.e[i].place();
				GAME.g.e[i].touchingPlayerCheck(i);
				GAME.g.e[i].placeHp();

				//ctx.fillStyle = 'gold';
				//ctx.fillText(e.name + " " + e.x.toFixed(0) + " " + e.y.toFixed(0), 20, 120+(20*i));



				//kill enemies here, to avoid bugs...?
				if (GAME.g.e[i].hp < 0) {
					GAME.g.e.splice(i, 1);
				}
			}
			
			//rendering decoration (tree layer)
			for (let i = 0; i < GAME.g.d.length; i++) {
				if (GAME.g.d[i].layer == 1) {
					GAME.g.d[i].place();
				}
			}

			if (!GAME.a.paused) GAME.g.p.placeHp();

			if (GAME.a.showDebug) {
				for (let i = 0; i < GAME.g.bl.length; i++) {
					var bl = GAME.g.bl[i];

					ctx.strokeRect(bl.x, bl.y, bl.w, bl.h);

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
				ctx.fillText(GAME.g.p.lastpressed, 220, 40);
				ctx.fillText(GAME.g.p.state.crouching.bool, 220, 60);
				ctx.fillText(GAME.g.p.state.rolling.val, 220, 80);
			}
		}

		renderSlider();

		function renderSlider() {
			ctx2.fillStyle = 'white';
			ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

			ctx2.fillStyle = '#8e478c';
			ctx2.fillRect(4, 4, canvas2.width-4*2, canvas2.height-4*2);

			//slider
			ctx2.drawImage(
				spritesheet,
				0*GAME.c.r,
				40*GAME.c.r,
				16*GAME.c.r,
				3*GAME.c.r,
				canvas2.width/2 - 16*GAME.c.r/2,
				0,
				16*GAME.c.r,
				3*GAME.c.r
			);

			//pointer
			ctx2.drawImage(
				spritesheet,
				0,
				43*GAME.c.r,
				GAME.c.r,
				GAME.c.r,
				12*GAME.c.r*GAME.g.slider/GAME.g.sliderMax - GAME.c.r/2 + (canvas2.width/2 - 12*GAME.c.r/2),
				canvas2.height-GAME.c.r-18 + GAME.g.increment*2,
				GAME.c.r,
				GAME.c.r
			);


			GAME.g.increment = Math.abs(GAME.g.slider/GAME.g.sliderMax - 0.5) * 2;
			GAME.g.increment = GAME.g.increment*2;
			GAME.g.increment = Math.abs(GAME.g.increment-1);
			GAME.g.increment = GAME.g.increment+0.1;
			GAME.g.increment = GAME.g.increment*5;


			if (GAME.g.sliderMoving && !GAME.a.paused) {
				if (GAME.g.goingRight) {
					GAME.g.slider += GAME.g.increment;
				} else {
					GAME.g.slider -= GAME.g.increment;
				}
			}

			if (GAME.g.slider > GAME.g.sliderMax || GAME.g.slider < 0) {
				GAME.g.goingRight = !GAME.g.goingRight;
			}
		}






		//the wheel!
		if (GAME.g.wheelMoving) {
			GAME.g.wheel++;
			if (GAME.g.wheel % 10 == 0) {
				move.play();
			}
			if (GAME.g.wheel > 100) {
				GAME.g.wheel = 0;
			}

			$('#wheel').css({
				'transform':'rotate(-'+GAME.g.wheel*3.6+'deg)'
			});
		}










		//end conditions
		if (GAME.g.level >= 5) {
			winGame();
		} else {
			if (GAME.g.e.length == 0 && GAME.g.summons == 0) {
				loseGame();
			}
		}





		//frames per second
		const now = performance.now();
		while (times.length > 0 && times[0] <= now - 1000) {
			times.shift();
		}
		times.push(now);
		fps = times.length;
		ctx.fillStyle = 'white';
		ctx.fillText(fps, 10, 20);

		window.requestAnimationFrame(draw);
	}

	function initaliseGame() {
		GAME.g.d = []; //reset decorations
		GAME.g.bl = []; //reset collision blocks

		GAME.g.p = new Mover('player', GAME.g.character, GAME.p.x - GAME.p.w/2, GAME.p.y - GAME.p.h*2); //set player

		var DECOR = {
			books(x, y) {
				var lmao1 = [1,2];
				var lmao2 = [3,4];

				GAME.g.d.push( new Entity('books_'+rand(lmao1), x, y) );
				GAME.g.d.push( new Entity('books_'+rand(lmao2), x, y+GAME.c.ss) );
			},
			light(x, y) {
				GAME.g.d.push( new Entity('light_1', x, y) );
				GAME.g.d.push( new Entity('light_2', x, y+GAME.c.ss) );
			},
			stand(x, y) {
				GAME.g.d.push( new Entity('stand_1', x, y) );
			},
			brick(x, y) {
				GAME.g.d.push( new Entity('brick_1', x, y) );
			},
			tree(x, y) {
				var r = randInt(1,4);
				GAME.g.d.push( new Entity('tree_'+r+'_0', x, y, 1) );
				GAME.g.d.push( new Entity('tree_'+r+'_1', x, y+GAME.c.ss, 1) );
				GAME.g.d.push( new Entity('tree_'+r+'_2', x, y+GAME.c.ss) );
			},
			grass(x, y) {
				var r = randInt(1,4);
				GAME.g.d.push( new Entity('grass_'+r, x, y) );
			},
			shrub(x, y) {
				var r = randInt(1,2);
				GAME.g.d.push( new Entity('shrub_'+r, x, y) );
			},
			cacti(x, y) {
				var r = randInt(1,4);
				GAME.g.d.push( new Entity('cacti_'+r+'_0', x, y) );
				GAME.g.d.push( new Entity('cacti_'+r+'_1', x, y+GAME.c.ss) );
			},
			stars(x, y) {
				var r = randInt(1,4);
				GAME.g.d.push( new Entity('stars_'+r, x, y) );
			},
			sand(x, y) {
				var r = randInt(1,4);
				GAME.g.d.push( new Entity('sand_'+r, x, y) );
			}
		}

		for (let i = 0; i < 20; i++) {
			var x = randInt(0, canvas.width);
			var y = randInt(0, canvas.height);

			x = Math.ceil(x/GAME.c.ss) * GAME.c.ss;
			y = Math.ceil(y/GAME.c.ss) * GAME.c.ss;

			if (GAME.g.level == 2) {
				DECOR.grass(x,y);
			} else if (GAME.g.level == 3) {
				DECOR.sand(x,y);
			} else if (GAME.g.level == 4) {
				DECOR.stars(x,y);
			} else {
				DECOR.brick(x,y);
			}
		}

		for (let i = 0; i < 4; i++) { //4 levels of bookshelves
			for (let j = 0; j < 2; j++) { //2 bookshelves per level
				var x = randInt(0, canvas.width);
				var y = i*canvas.height/4 + GAME.c.ss/2;

				x = Math.ceil(x/GAME.c.ss) * GAME.c.ss;

				var r = randInt(2,6);

				if (GAME.g.level == 2) {
					for (let a=0;a<r;a++) {
						var natx = randInt(-GAME.c.ss,GAME.c.ss);
						var naty = randInt(-GAME.c.ss,GAME.c.ss);

						DECOR.tree(x+natx, y+naty);

						GAME.g.bl.push({
							x: x + GAME.c.ss/4 + natx,
							y: y + GAME.c.ss + naty,
							h: GAME.c.ss,
							w: GAME.c.ss/2
						});
					}
				} else if (GAME.g.level == 3) {
					r = 1;

					for (let a=0;a<r;a++) {
						var natx = randInt(-GAME.c.ss*2,GAME.c.ss*2);
						var naty = randInt(-GAME.c.ss*2,GAME.c.ss*2);

						DECOR.cacti(x+natx, y+naty);

						GAME.g.bl.push({
							x: x + GAME.c.ss/4 + natx,
							y: y + GAME.c.ss + naty,
							h: GAME.c.ss,
							w: GAME.c.ss/2
						});
					}
				} else if (GAME.g.level == 4) {
					//nothing
				} else {
					for (let a=0;a<r;a++) {
						var na = Math.abs(a - Math.floor(r/2));

						if (a < Math.floor(r/2)) {
							DECOR.books(x - GAME.c.ss*na,y);
						} else if (a == Math.floor(r/2)) {
							DECOR.books(x,y);
						} else {
							DECOR.books(x + GAME.c.ss*na,y);
						}
					}

					GAME.g.bl.push({
						x: x - Math.floor(r/2)*GAME.c.ss,
						y: y,
						h: GAME.c.ss*2,
						w: r*GAME.c.ss
					});
				}
			}
		}		


		for (let i = 0; i < 4; i++) {
			var x = randInt(0, canvas.width);
			var y = randInt(0, canvas.height);

			x = Math.ceil(x/GAME.c.ss) * GAME.c.ss;
			y = Math.ceil(y/GAME.c.ss) * GAME.c.ss;

			if (GAME.g.level == 2) {
				DECOR.shrub(x,y);
			} else if (GAME.g.level == 3) {
				DECOR.shrub(x,y);
			} else if (GAME.g.level == 4) {
				//nothing
			} else {
				if (Math.random() < 0.25) {
					DECOR.light(x,y);
				} else {
					DECOR.stand(x,y);
				}
			}
		}

		$('.level').html(GAME.g.level);
		$('.summons').html(GAME.g.summons);
		$('.knighthp').html(GAME.g.p.hp);
	}

	function advanceLevel() {
		GAME.g.level++;

		GAME.g.summons = GAME.g.totalSummons - (GAME.g.level-1)*5;
	}

	function winGame() {
		GAME.a.paused = true;
		GAME.g.slider = GAME.g.sliderMax/2;

		$('#modal_bg').show();
		$('#win_modal').show();
	}

	function loseGame() {
		GAME.g.sliderMoving = false;

		$('#modal_bg').show();
		$('#death_modal').show();
	}

	function startGame() {
		GAME.a.paused = false;

		GAME.g.e = []; //reset enemies
		GAME.g.c = []; //reset pickups

		if (GAME.g.level >= 5) {
			GAME.g.character = 'dead_player';
			$('#topMiddle').hide();
		}

		GAME.g.p = new Mover('player', GAME.g.character, GAME.p.x - GAME.p.w/2, GAME.p.y - GAME.p.h*2);

		//GAME.g.c.push( new Entity('health', randInt(GAME.g.b, canvas.width-GAME.g.b), randInt(GAME.g.b, canvas.height-GAME.g.b)) );
		//GAME.g.c.push( new Entity('score', randInt(GAME.g.b, canvas.width-GAME.g.b), randInt(GAME.g.b, canvas.height-GAME.g.b)) );
	}

	var quoteTimeout;

	function saySomething(type) {
		clearInterval(quoteTimeout);

		var type = type ? type : 'random';

		$('.bubble').html(rand(GAME.q[type]));

		$('.bubble').addClass('visible');

		click.play();

		quoteTimeout = setTimeout(function() {
			$('.bubble').removeClass('visible');
		}, GAME.a.quoteTiming);
	}

	function saySomethingSpecific(text) {
		clearInterval(quoteTimeout);

		$('.bubble').html(text);

		$('.bubble').addClass('visible');

		click.play();

		quoteTimeout = setTimeout(function() {
			$('.bubble').removeClass('visible');
		}, GAME.a.quoteTiming);
	}

	//startscreen
	$('#start_modal').show();
	$('.start-button').on('click', function() {
		$('.modal').hide();
		$('#modal_bg').hide();

		startGame();
	});

	advanceLevel();
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