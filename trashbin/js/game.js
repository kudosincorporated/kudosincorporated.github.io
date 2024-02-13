var WIDTH = 1280;
var HEIGHT = 720;
var SIZE = 96;
var RATIO = 64;
var BASE_SPEED = 2/3;

var SHOW_HITBOXES = false;

class Mover {
	constructor(props = {}) {
		this.type = "";
		this.colour = "black";
		this.sx = -1;
		this.sy = -1;
		this.w = SIZE;
		this.h = SIZE;
		this.x = 0;
		this.y = 0;
		this.vx = 0;
		this.vy = 0;
		this.angle = 0;
		this.SPEED = BASE_SPEED;
		this.range = 0;
		this.toBeDeleted = false;
		this.holding = [];
		this.states = [];
		this.frame = 0;
		this.abilityRechargeTime = 5000;

		let propsArr = Object.keys(props);
		for (let i = 0; i < propsArr.length; i++) {
			this[propsArr[i]] = props[propsArr[i]];
		}
	}

	animationController() {
		if (!this.hasState("nextFrame")) {
			this.addState("nextFrame", 100);
			this.frame++;
			if (this.frame > 3) this.frame = 0;
		}
	}

	moveFromKeyboard(dt) {
		if (
			pressed.indexOf(87) !== -1 || 	// W
			pressed.indexOf(38) !== -1 		// Up
		) {
			this.y += players[0].SPEED * dt;
		}
		if (
			pressed.indexOf(65) !== -1 || 	// A
			pressed.indexOf(37) !== -1 		// Left
		) {
			this.x += players[0].SPEED * dt;
			players[0].vx = lerp(players[0].vx, -this.SPEED*25, this.SPEED/9999 * dt);
		}
		if (
			pressed.indexOf(83) !== -1 || 	// S
			pressed.indexOf(40) !== -1	 	// Down
		) {
			this.y -= players[0].SPEED * dt;
		}
		if (
			pressed.indexOf(68) !== -1 || 	// D
			pressed.indexOf(39) !== -1 		// Right
		) {
			this.x -= players[0].SPEED * dt;
			players[0].vx = lerp(players[0].vx, this.SPEED*25, this.SPEED/9999 * dt);
		}
	}

	sortStack() {
		if (pressed.indexOf(32) !== -1) {
			if (!this.hasState("recharging")) {
				this.addState("recharging", this.abilityRechargeTime);

				let numberOfPaper = [];
	
				while (this.holding.length > 0) {
					let found = false;
					for (let i = 0; i < numberOfPaper.length; i++) {
						if (numberOfPaper[i].props.colour === this.holding[0].colour) {
							numberOfPaper[i].amount++;
							found = true;
							break;
						}
					}
					if (!found) {
						numberOfPaper.push({
							props: this.holding[0],
							amount: 1
						});
					}
					this.holding.shift();
				}
				
				while (numberOfPaper.length > 0) {
					let i = randInt(0, numberOfPaper.length-1);
	
					for (let j = 0; j < numberOfPaper[i].amount; j++) {
						this.holding.push(numberOfPaper[i].props);
					}
	
					numberOfPaper.splice(i, 1);
				}	
			}
		}
	}

	decelerate(dt) {
		this.vx = lerp(this.vx, 0, this.SPEED/50 * dt);
		this.vy = lerp(this.vy, 0, this.SPEED/50 * dt);
	}

	addState(name, value = 1000) {
		this.states.push({
			name: name,
			value: value
		});
	}

	hasState(name) {
		for (let i = 0; i < this.states.length; i++) {
			if (this.states[i].name === name) {
				return this.states[i];
			}
		}
		return false;
	}

	updateStates(dt) {
		// States
		for (let i = 0; i < this.states.length; i++) {
			this.states[i].value -= 1 * dt;
			if (this.states[i].value <= 0) {
				this.states.splice(i, 1);
				i--;
			}
		}
	}

	update(dt) {
		// Position
		this.x += this.vx * dt;
		this.y += this.vy * dt;

		// Fade out
		if (!this.hasState("fade")) {
			this.toBeDeleted = true;
		}
	}
	
	pullOrPush(array) {
		for (let i = 0; i < array.length; i++) {
			let e = array[i];
			if (this.withinDistanceToObject(this.range, e)) {
				if (this.type === "player") {
					if (e.colour === "white") {
						e.directToObject(this);
						e.angle = e.angle-Math.PI;
						e.velocityTowardsDirection();
					} else if (this.hasState("intangible")) {
						e.directToObject(this);
						e.velocityTowardsDirection();
					}
				} else if (this.type === "bin") {
					if (this.colour === e.colour) {
						e.directToObject(this);
						e.velocityTowardsDirection();
					} else {
						e.directToObject(this);
						e.angle = e.angle-Math.PI;
						e.velocityTowardsDirection();
					}
				}
			}
		}
	}

	pushAway(array) {
		for (let i = 0; i < array.length; i++) {
			if (this.withinDistanceToObject(this.range, array[i])) {
				array[i].directToObject(this);
				array[i].angle = array[i].angle-Math.PI;
				array[i].velocityTowardsDirection();
			}
		}
	}

	pullTowards(array) {
		for (let i = 0; i < array.length; i++) {
			if (this.withinDistanceToObject(this.range, array[i])) {
				array[i].directToObject(this);
				array[i].velocityTowardsDirection();
			}
		}
	}

	withinDistanceToObject(dist, obj) {
		let distance = calculateDistance(this.x+this.w/2, this.y+this.h/2, obj.x+obj.w/2, obj.y+obj.h/2);
		if (distance < dist) {
			return true;
		}
		return false;
	}

	directToObject(obj) {
		const dx = obj.x - this.x;
		const dy = obj.y - this.y;
		this.angle = Math.atan2(dy, dx);
	}

	velocityTowardsDirection() {
		this.vx = this.SPEED * Math.cos(this.angle);
		this.vy = this.SPEED * Math.sin(this.angle);
	}

	stopOnBorder(border) {
		if (this.x < border.x) this.x = border.x;
		if (this.x+this.w > border.x+border.w) this.x = border.x+border.w-this.w;
		if (this.y < border.y) this.y = border.y;
		if (this.y+this.h > border.y+border.h) this.y = border.y+border.h-this.h;
	}

	bounceOnBorder(border) {
		if (this.x < border.x) {
			this.x = border.x;
			this.vx = -this.vx;
		}
		if (this.x+this.w > border.x+border.w) {
			this.x = border.x+border.w-this.w;
			this.vx = -this.vx;
		}
		if (this.y < border.y) {
			this.y = border.y;
			this.vy = -this.vy;
		}
		if (this.y+this.h > border.y+border.h) {
			this.y = border.y+border.h-this.h;
			this.vy = -this.vy;
		}
	}

	teleportOnBorder(border) {
		if (this.x < border.x) this.x = border.x+border.w-this.w;
		if (this.x+this.w > border.x+border.w) this.x = border.x;
		if (this.y < border.y) this.y = border.y+border.h-this.h;
		if (this.y+this.h > border.y+border.h) this.y = border.y;
	}

	moveRandomly() {
		if (!this.hasState("moveRandom")) {
			this.addState("moveRandom");
			this.angle = Math.random()*2*Math.PI;
			this.velocityTowardsDirection();
		}
	}

	spawnPaper() {
		if (!this.hasState("print")) {
			this.addState("print");
			let r = randInt(0,3);
			let speed = BASE_SPEED * randInt(2,5);
			let angle = Math.random()*2*Math.PI;
			if (Math.random() < 0.25) { // Chance of coloured paper
				paperwork.push(new Mover({
					type: "paperwork",
					colour: colours[r],
					sx: 8,
					sy: r+1,
					w: SIZE*0.4,
					h: SIZE*0.5,
					x: this.x+this.w/2,
					y: this.y+this.h/2,
					vx: speed * Math.cos(angle),
					vy: speed * Math.sin(angle),
					angle: angle,
					states: [{
						name: "fade",
						value: 9999
					}]
				}));
			} else {
				paperwork.push(new Mover({
					type: "paperwork",
					colour: "white",
					sx: 8,
					sy: 0,
					w: SIZE*0.4,
					h: SIZE*0.5,
					x: this.x+this.w/2,
					y: this.y+this.h/2,
					vx: speed * Math.cos(angle),
					vy: speed * Math.sin(angle),
					angle: angle,
					states: [{
						name: "fade",
						value: 9999
					}]
				}));
			}
		}
	}

	checkContact(array) {
		for (let i = 0; i < array.length; i++) {
			let rect1 = this;
			let rect2 = array[i];
			if (
				rect1.x < rect2.x + rect2.w &&
				rect1.x + rect1.w > rect2.x &&
				rect1.y < rect2.y + rect2.h &&
				rect1.y + rect1.h > rect2.y
			) {
				//console.log(rect1.type + " has contacted " + rect2.type);

				// Bins pick up paperwork
				if (rect1.type === "bin" && rect2.type === "paperwork") {
					if (rect1.colour === rect2.colour) {
						rect2.toBeDeleted = true;
					}
				}

				// Player picks up paperwork
				if (rect1.type === "player" && rect2.type === "paperwork") {
					if (rect2.colour !== "white" && !rect2.hasState("intangible")) {
						rect1.holding.push({
							colour: rect2.colour,
							sx: rect2.sx,
							sy: rect2.sy
						});
						this.recalculateSpeed();
						rect2.toBeDeleted = true;
					}
				}

				// Player hits enemy
				if (rect1.type === "player" && rect2.type === "enemy") {
					while (rect1.holding.length > 0) {
						let speed = BASE_SPEED*5;
						let angle = Math.random() * Math.PI * 2;
						paperwork.push(new Mover({
							type: "paperwork",
							colour: rect1.holding[0].colour,
							sx: rect1.holding[0].sx,
							sy: rect1.holding[0].sy,
							w: SIZE*0.4,
							h: SIZE*0.5,
							x: WIDTH/2 - rect1.w/2,
							y: HEIGHT/2 - rect1.h/2,
							vx: speed * Math.cos(angle),
							vy: speed * Math.sin(angle),
							angle: angle,
							states: [{
								name: "fade",
								value: 9999
							},
							{
								name: "intangible",
								value: 250
							}]
						}));

						rect1.holding.shift();
					}
					rect1.recalculateSpeed();
				}
			}
		}
	}

	recalculateSpeed() {
		this.SPEED = BASE_SPEED; // Math.pow(BASE_SPEED, 1-this.holding.length/25)
		if (this.SPEED < 0) this.SPEED = 0;
	}
	
	drawColour(ctx) {
		ctx.fillStyle = this.colour;
		ctx.fillRect(
			this.x,
			this.y,
			this.w,
			this.h
		);
	}

	draw(ctx) {
		ctx.save();

		let sx = this.sx*RATIO + this.frame*RATIO;
		let sy = this.sy*RATIO;
		let angle = 0;

		if (this.type === "paperwork") angle = this.angle;

		if (this.type === "player" && this.holding.length > 0) sy += 5*RATIO;

		ctx.translate(this.x+this.w/2, this.y+this.h/2);

		if (this.vx > 0) ctx.scale(-1, 1);
		
		ctx.rotate(angle);

		let x = -this.w/2;
		let y = -this.h/2;
		let w = this.w;
		let h = this.h;

		// Reduced hitboxes on enemies
		if (this.type === "player" || this.type === "enemy") {
			x = x*2;
			y = y*2;
			w = w*2;
			h = h*2;
		}

		ctx.drawImage(
			spritesheet,
			sx+1,
			sy+1,
			w/SIZE*RATIO-2,
			h/SIZE*RATIO-2,
			x,
			y,
			w,
			h
		);

		ctx.restore();

		if (SHOW_HITBOXES) {
			ctx.strokeRect(
				this.x,
				this.y,
				this.w,
				this.h
			);
			this.drawRange(ctx);
		}
	}

	drawHolding(ctx) {
		ctx.save();
		ctx.translate(this.x, this.y-SIZE*0.55);
		this.holding.forEach((held, i) => {
			ctx.fillStyle = held.colour;
			ctx.rotate(-this.vx/999);
			ctx.fillRect(
				0,
				-i*SIZE/6,
				SIZE/2,
				SIZE*0.75/2
			);
		});
		ctx.restore();
	}

	drawRange(ctx) {
		ctx.beginPath();
		ctx.arc(this.x+this.w/2, this.y+this.h/2, this.range, 0, 2 * Math.PI);
		ctx.stroke();
	}

	drawMarker(ctx) {
		ctx.save();

		let w = SIZE/2;
		let x = this.x+this.w/2-w/2;
		let y = this.y+this.h/2-w/2;
		if (x < 0) x = 0;
		if (x+w > WIDTH) x = WIDTH-w;
		if (y < 0) y = 0;
		if (y+w > HEIGHT) y = HEIGHT-w;

		if (
			x > 0 &&
			x+w < WIDTH &&
			y > 0 &&
			y+w < HEIGHT
		) {
			return;
		}

		let sx = this.sx*RATIO + this.frame*RATIO;
		let sy = this.sy*RATIO;
		ctx.globalAlpha = 0.5;
		ctx.drawImage(
			spritesheet,
			sx,
			sy,
			RATIO,
			RATIO,
			x,
			y,
			w,
			w
		);

		ctx.restore();
	}
}

const calculateDistance = (x1, y1, x2, y2) => {
	return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}