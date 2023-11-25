var GAME = {
	speed: 0.33, //0.33
	scale: 3, //3
	ratio: 8, //8
	world: {},
	keydown: [],
	mouse: {
		x: 0,
		y: 0,
		down: false
	},
}

const ENTITY = {
	player: {
		colour: 'white',
		w: 2,
		h: 2,
		speed: 1/5,
	},
	bullet: {
		colour: 'orange',
		w: 1,
		h: 2,
		speed: 2,
	},
	orb: {
		shape: 'circle',
		colour: 'white',
		w: 0.5,
		speed: 1,
	},
	confetti: {
		shape: 'square',
		colour: 'white',
		w: 0.75,
		h: 1.5,
		speed: 1,
	},
	upgrade: {
		shape: 'circle',
		colour: 'magenta',
		w: 2,
		h: 2,
	},
	bluey: {
		shape: 'circle',
		colour: 'turquoise',
		w: 2,
		speed: 1/2,
		maxHp: 3,
	},
	reddy: {
		colour: 'red',
		w: 1.75,
		h: 3,
		speed: 1/1.75,
		maxHp: 2,
	},
	pinky: {
		colour: 'magenta',
		w: 1.5,
		h: 1,
		speed: 1/1.5,
		maxHp: 1,
	},
}

class World {
	constructor() {
		this.width = 1280/GAME.ratio;
		this.height = 720/GAME.ratio;

		this.enemies = [];
		this.bullets = [];
		this.orbs = [];
		this.floor = [];
		this.confetti = [];

		this.player = [];
		this.player.push(new Mover(ENTITY.player,{
			name: 'player',
			x: this.width/2 - ENTITY.player.w*GAME.scale/2,
			y: this.height/2 - ENTITY.player.h*GAME.scale/2,
		}));

		this.spawnRate = 25;

		for (let i = 0; i < 9; i++) {
			this.addEnemy();
		}
	}
	addEnemy() {
		let x;
		let y;
		if (Math.random() < 0.5) { //Top and Bottom
			x = randInt(0, this.width);
			if (Math.random() < 0.5) { //Top
				y = 0;
			} else { //Bottom
				y = this.height;
			}
		} else { //Left and Right
			y = randInt(0, this.height);
			if (Math.random() < 0.5) { //Left
				x = 0;
			} else { //Right
				x = this.width;
			}
		}

		const couldspawn = [ENTITY.reddy, ENTITY.bluey, ENTITY.pinky];
		const shapes = ['circle','square'];
		this.enemies.push(new Mover(rand(couldspawn), {
			colour: getRandomMainColor(),
			shape: rand(shapes),
			x: x,
			y: y,
		}));
	}
	spawnEnemies() {
		if (!this.player[0].hasState('spawnGap')) {
			this.player[0].state('spawnGap', this.spawnRate);
			this.addEnemy();
		}
	}
	playerShoot() {
		const player = this.player[0];

		if (player.ammo <= 0 && !player.hasState('reloading')) {
			player.ammo = player.mag;
		}

		if (
			//!GAME.mouse.down ||
			player.hasState('bulletGap') || 
			player.hasState('reloading')
		) return;

		player.ammo--;

		player.state('bulletGap', player.attackSpeed);

		if (player.ammo <= 0) {
			player.state('reloading', player.reloadSpeed);
		}

		if (player.reloadDuration > 0) return;

		let angle = player.currentAngle; //(Math.random()-0.5)/2

		const vx = player.speed*3 * Math.cos(angle);
		const vy = player.speed*3 * Math.sin(angle);

		this.bullets.push(new Mover(ENTITY.bullet, {
			x: GAME.world.player[0].x,
			y: GAME.world.player[0].y,
			vx: vx,
			vy: vy,
			angle: angle,
		}));

		this.bullets[GAME.world.bullets.length-1].angle = angle - Math.PI/2;
	}
	confettiCanon(centerX, centerY, radius, numElements, defaultAngle, accuracy, speed, lifespan, colours) {
		const angleIncrement = (2 * Math.PI) / numElements;
		
		for (let i = 0; i < numElements; i++) {
			const angle = i * angleIncrement;
			const elementX = centerX + radius * Math.cos(angle);
			const elementY = centerY + radius * Math.sin(angle);
			let maxAdjustment = (2 * Math.PI) * (1 - accuracy);
			let adjustment = Math.random() * maxAdjustment;

			let chosenColour;
			if (colours.length > 0) {
				chosenColour = rand(colours);
			} else {
				chosenColour = getRandomMainColor();
			}

			this.confetti.push(new Mover(ENTITY.confetti, {
				colour: chosenColour,
				x: elementX,
				y: elementY,
				vx: Math.cos(defaultAngle + adjustment) * speed*Math.random(),
				vy: Math.sin(defaultAngle + adjustment) * speed*Math.random(),
				angle: 2*Math.PI*Math.random(),
				states: [
					{
						name: 'alive',
						time: lifespan+Math.random()*lifespan/3,
					},
					{
						name: 'noPhysics',
						time: 300,
					}
				]
			}));
		}
	}
	update(dt) {
		//Confetti
		this.confetti.forEach((item, i) => {
			if (
				item.withinDistanceToPlayer(GAME.world.player[0].range) &&
				!item.hasState('noPhysics')
			) {
				item.directToPlayer();
				item.angle = item.angle-Math.PI;
				item.velocityTowardsDirection();
			}

			item.lerpCurrentAngle();
			item.updateStates(dt);

			item.move(dt);
			item.moveByPlayer(dt);
			item.decelerate(dt);

			if (!item.hasState('alive')) {
				this.confetti.splice(i, 1);
				i--;
			}
		});

		//Enemies
		this.enemies.forEach((item, i) => {
			item.updateStates(dt);
			item.directToPlayer();
			item.velocityTowardsDirection();
			item.jumpToCurrentAngle();
			item.move(dt);
			item.moveByPlayer(dt);
			item.checkCollision(this.enemies);

			if (item.collidingWith(this.bullets)) {
				item.takeDamage(1);
			}

			if (item.collidingWith(this.player) && this.player[0].hasState('dashing')) {
				item.takeDamage(1);
			}

			if (item.hp <= 0) {
				//EXP
				let expValue = item.maxHp*item.speed;
				this.orbs.push(new Mover(ENTITY.orb, {
					x: item.x,
					y: item.y,
					vx: -item.vx/2,
					vy: -item.vy/2,
					w: ENTITY.orb.w+expValue/10,
					exp: expValue,
				}));

				//Splatter
				this.confettiCanon(
					item.x, //centerX
					item.y, //centerY
					0, //radius
					Math.round(item.w*2), //numElements
					item.angle-Math.PI, //defaultAngle
					0.75, //accuracy
					1/2, //speed
					900, //lifespan
					[item.colour] //colour
				);

				this.enemies.splice(i, 1);
				i--;
			}
		});

		//Bullets
		this.bullets.forEach((item, i) => {
			if (!item.isVisible() || item.collidingWith(this.enemies)) {
				this.bullets.splice(i, 1);
				i--;
			}
			
			item.jumpToCurrentAngle();
			item.move(dt);
			item.moveByPlayer(dt);
		});

		//Orbs
		this.orbs.forEach((item, i) => {
			if (item.withinDistanceToPlayer(GAME.world.player[0].range)) {
				item.directToPlayer();
				item.velocityTowardsDirection();
			}

			item.move(dt);
			item.moveByPlayer(dt);
			item.decelerate(dt);

			if (item.collidingWith(this.player)) {
				let player = this.player[0];
				player.exp += item.exp;
				player.state('showExp', 50);

				if (player.exp >= player.maxExp) {
					player.exp = 0;
					player.level++;
					player.maxExp = player.baseExp * Math.pow(player.expMulti, player.level);

					GAME.upgrades.toggleUpgradeWorld();
				}

				this.orbs.splice(i, 1);
				i--;
			}
		});

		//Floor
		this.floor.forEach((item, i) => {
			item.moveByPlayer(dt);

			if (item.collidingWith(this.player)) {
				GAME.upgrades.addUpgrade(item.upgrade);
				GAME.upgrades.unlockNewUpgrades(item.upgrade);
				GAME.upgrades.toggleUpgradeWorld();
			}
		});

		//Player takes damage
		if (this.player[0].collidingWith(this.enemies) && !this.player[0].hasState('dashInv')) {
			this.player[0].takeDamage(1/100);
		}

		this.player[0].lerpCurrentAngle();
		this.player[0].lerpHp();
		this.player[0].lerpExp();

		//Update states
		this.player[0].updateStates(dt);

		//Player
		this.player[0].directToClosest(this.enemies);
		if (GAME.upgrades.inUpgradeWorld) this.player[0].directToClosest(this.floor);
	}
	render(ctx) {
		ctx.save();

		this.confetti.forEach((item, i) => {
			item.render(ctx);
		});

		this.orbs.forEach((item, i) => {
			item.render(ctx);
		});

		this.enemies.forEach((item, i) => {
			item.render(ctx);
		});

		this.bullets.forEach((item, i) => {
			item.render(ctx);
		});

		this.floor.forEach((item, i) => {
			item.render(ctx);
		});

		this.player[0].render(ctx);

		ctx.restore();
	}
	renderPlayerHealth(ctx) {
		let player = this.player[0];

		let hpProgress = Math.abs(player.hp/player.maxHp-1);
		let currentHpProgress = Math.abs(player.currentHp/player.maxHp-1);
		
		let dashReloadTime = 0;
		let dashMaximumTime = 50;
		if (player.hasState('dashReload')) dashReloadTime = player.getStateTime('dashReload');
		let dashProgress = Math.abs(dashReloadTime/dashMaximumTime-1);
		
		ctx.save();

		ctx.translate(
			canvas.width/2 + Math.cos(player.currentAngle),
			canvas.height/2 + Math.sin(player.currentAngle),
		);

		//Health
		if (player.hasState('showHp')) {
			ctx.lineWidth = GAME.scale*4;

			ctx.strokeStyle = 'yellow';
			ctx.beginPath();
			ctx.arc(
				canvas.width/2 - GAME.scale*3,
				canvas.height/2 - GAME.scale*3,
				GAME.scale*2,
				-Math.PI/2+currentHpProgress*2*Math.PI,
				-Math.PI/2+2*Math.PI
			);
			ctx.stroke();
	
			ctx.strokeStyle = 'red';
			ctx.beginPath();
			ctx.arc(
				canvas.width/2 - GAME.scale*3,
				canvas.height/2 - GAME.scale*3,
				GAME.scale*2,
				-Math.PI/2+hpProgress*2*Math.PI,
				-Math.PI/2+2*Math.PI
			);
			ctx.stroke();
		}

		//Dash cooldown
		ctx.lineWidth = GAME.scale*2;

		ctx.strokeStyle = 'white';
		ctx.beginPath();
		ctx.arc(
			-canvas.width/2 + GAME.scale*3,
			canvas.height/2 - GAME.scale*3,
			GAME.scale,
			-Math.PI/2+dashProgress*2*Math.PI,
			-Math.PI/2+2*Math.PI
		);
		ctx.stroke();

		ctx.restore();
	}
	renderPlayerUI(ctx) {
		let player = this.player[0];

		let expProgress = Math.abs(player.exp/player.maxExp-1);
		let currentExpProgress = Math.abs(player.currentExp/player.maxExp-1);
		
		ctx.save();

		ctx.translate(
			player.x + player.w/2 + Math.cos(player.currentAngle),
			player.y + player.h/2 + Math.sin(player.currentAngle),
		);

		//Pickup range
		ctx.fillStyle = 'blue';
		ctx.beginPath();
		ctx.arc(
			0,
			0,
			player.range,
			0,
			2*Math.PI
		);
		ctx.fill();

		//Exp bar
		if (player.hasState('showExp')) {
			ctx.lineWidth = 2;

			ctx.strokeStyle = 'limegreen';
			ctx.beginPath();
			ctx.arc(
				0,
				0,
				player.range + GAME.scale,
				-Math.PI/2+expProgress*2*Math.PI,
				-Math.PI/2+2*Math.PI
			);
			ctx.stroke();
	
			ctx.strokeStyle = 'blue';
			ctx.beginPath();
			ctx.arc(
				0,
				0,
				player.range + GAME.scale,
				-Math.PI/2+currentExpProgress*2*Math.PI,
				-Math.PI/2+2*Math.PI
			);
			ctx.stroke();
		}

		ctx.restore();
	}
	renderPauseScreen(ctx) {
		ctx.font = '30px Arial';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
		ctx.fillText("PAUSED", canvas.width/2, canvas.height/2 + 10);
	}
	renderLoseScreen(ctx) {
		ctx.fillStyle = 'black';
		ctx.fillRect(0, canvas.height/4, canvas.width, canvas.height/2);
		ctx.font = 'bold 20px Arial';
		ctx.fillStyle = 'red';
		ctx.textAlign = 'center';
		ctx.fillText("YOU DIED", canvas.width/2, canvas.height/2 + 6);
	}
}

class Mover {
	constructor(attr, props) {
		this.w = 1;
		this.h = 1;
		this.x = 10;
		this.y = 10;
		this.vx = 0;
		this.vy = 0;
		this.angle = 0;
		this.currentAngle = 0;
		this.speed = 0;
		this.colour = 'orangered';

		this.mag = 6;
		this.ammo = 6;
		this.reloadSpeed = 50;
		this.attackSpeed = 5;
		
		this.states = [];

		this.maxHp = 1;
		this.hp = 1;
		this.currentHp = 1;

		this.level = 0;
		this.baseExp = 5;
		this.expMulti = 1.5;
		this.maxExp = 5;
		this.exp = 0;
		this.currentExp = 0;

		this.range = 8;

		this.closestToPlayer = false;

		//Update default values from dictionary
		const attrArr = Object.keys(attr);
		for (let i = 0; i < attrArr.length; i++) {
			this[attrArr[i]] = attr[attrArr[i]];
		}

		//Extra changes
		if (props != undefined) {
			const propsArr = Object.keys(props);
			for (let i = 0; i < propsArr.length; i++) {
				this[propsArr[i]] = props[propsArr[i]];
			}
		}

		//Cleanup
		this.w = this.w*GAME.scale;
		this.h = this.h*GAME.scale;
		this.speed = this.speed*GAME.speed;
		this.currentAngle = this.angle;
		this.range = this.range*GAME.scale;
		this.hp = this.maxHp;
		this.ammo = this.mag;
	}
	takeDamage(damage) {
		this.hp -= damage;

		this.state('damage', 25);
		this.state('showHp', 50);

		if (this.hp <= 0) this.hp = 0;
	}
	state(name, time) {
		this.states.push({
			name: name,
			time: time,
		});
	}
	hasState(searchString) {
		return this.states.some(obj => obj.name === searchString);
	}
	getStateTime(searchString) {
		let element = this.states.find(obj => obj.name === searchString) || null;
		if (element != null) {
			return element.time;
		} else {
			return element;
		}
	}
	updateStates(dt) {
		//Update states
		for (let i = 0; i < this.states.length; i++) {
			this.states[i].time -= this.speed*dt;
			if (this.states[i].time <= 0) {
				this.states.splice(i, 1);
				i--;
			}
		}
	}
	withinDistanceToPlayer(dist) {
		let distance = calculateDistance(this, GAME.world.player[0]);
		if (distance < dist) {
			return true;
		}
		return false;
	}
	directToPlayer() {
		const dx = (GAME.world.player[0].x + GAME.world.player[0].w/2) - this.x;
		const dy = (GAME.world.player[0].y + GAME.world.player[0].h/2) - this.y;

		this.angle = Math.atan2(dy, dx);
	}
	velocityTowardsDirection() {
		this.vx = this.speed * Math.cos(this.angle);
		this.vy = this.speed * Math.sin(this.angle);
	}
	stopMoving() {
		this.vx = 0;
		this.vy = 0;
	}
	directToMouse() {
		const dx = GAME.mouse.x - $(document).width()/2;
		const dy =  GAME.mouse.y - $(document).height()/2;

		this.angle = Math.atan2(dy, dx);
	}
	directToClosest(otherMovers) {
		if (otherMovers.length == 0) return;

		// Calculate the distance for the first element in otherMovers
		let singleElement = { x: this.x, y: this.y };
		let closestElement = otherMovers[0];
		closestElement.closestToPlayer = false;
		let minDistance = calculateDistance(singleElement, closestElement);
	
		// Iterate through the rest of otherMovers to find the closest element
		for (let i = 1; i < otherMovers.length; i++) {
			const currentElement = otherMovers[i];
			currentElement.closestToPlayer = false;
			const currentDistance = calculateDistance(singleElement, currentElement);
	
			// Update closestElement if the current distance is smaller
			if (currentDistance < minDistance) {
				minDistance = currentDistance;
				closestElement = currentElement;
			}
		}

		closestElement.closestToPlayer = true;

		const dx = closestElement.x - this.x;
		const dy = closestElement.y - this.y;

		this.angle = Math.atan2(dy, dx);

		if (!this.hasState('dashing')) {
			this.vx = -Math.cos(this.currentAngle);
			this.vy = -Math.sin(this.currentAngle);
		}
	}
	jumpToCurrentAngle() {
		this.currentAngle = this.angle;
	}
	lerpCurrentAngle() {
		this.currentAngle = lerp(this.currentAngle, this.angle, this.speed/5*dt);
	}
	lerpHp() {
		this.currentHp = lerp(this.currentHp, this.hp, this.speed/10*dt);
	}
	lerpExp() {
		this.currentExp = lerp(this.currentExp, this.exp, this.speed/10*dt);
	}
	collidingWith(otherMovers) {
		for (const other of otherMovers) {
			if (other !== this) {
				if (
					this.x < other.x + other.w &&
					this.x + this.w > other.x &&
					this.y < other.y + other.h &&
					this.y + this.h > other.y
				) {
					return true;
				}
			}
		}
		return false;
	}
	checkCollision(otherMovers) {
		for (const other of otherMovers) {
			if (other !== this) {
				if (
					this.x < other.x + other.w &&
					this.x + this.w > other.x &&
					this.y < other.y + other.h &&
					this.y + this.h > other.y
				) {
					const distToTop = Math.abs(this.y + this.h - other.y);
					const distToLeft = Math.abs(this.x + this.w - other.x);
					const distToBottom = Math.abs(this.y - other.y - other.h);
					const distToRight = Math.abs(this.x - other.x - other.w);

					const shortestDistance = Math.min(distToTop, distToLeft, distToBottom, distToRight);

					if (shortestDistance === distToTop) {
						this.y = other.y - this.h;
					} else if (shortestDistance === distToLeft) {
						this.x = other.x - this.w;
					} else if (shortestDistance === distToBottom) {
						this.y = other.y + other.h;
					} else {
						this.x = other.x + other.w;
					}
				}
			}
		}
	}
	moveByPlayer(dt) {
		if (!GAME.world.player[0].hasState('dashing')) {
			if (GAME.keydown.indexOf(87) >= 0 || GAME.keydown.indexOf(38) >= 0) this.y += GAME.world.player[0].speed * dt; //W
			if (GAME.keydown.indexOf(65) >= 0 || GAME.keydown.indexOf(37) >= 0) this.x += GAME.world.player[0].speed * dt; //A
			if (GAME.keydown.indexOf(83) >= 0 || GAME.keydown.indexOf(40) >= 0) this.y -= GAME.world.player[0].speed * dt; //S
			if (GAME.keydown.indexOf(68) >= 0 || GAME.keydown.indexOf(39) >= 0) this.x -= GAME.world.player[0].speed * dt; //D
		}

		this.dashByPlayer(dt);
	}
	dashByPlayer(dt) {
		if (GAME.keydown.indexOf(32) >= 0 && !GAME.world.player[0].hasState('dashReload')) { //Spacebar
			GAME.world.player[0].state('dashing', 15);
			GAME.world.player[0].state('dashInv', 15*2);
			GAME.world.player[0].state('dashReload', 50);
		}

		if (GAME.world.player[0].hasState('dashing')) {
			this.x += GAME.world.player[0].vx * GAME.world.player[0].speed * dt * 4;
			this.y += GAME.world.player[0].vy * GAME.world.player[0].speed * dt * 4;
		}
	}
	move(dt) {
		this.x += this.vx * this.speed * dt;
		this.y += this.vy * this.speed * dt;
	}
	decelerate(dt) {
		this.vx = lerp(this.vx, 0, this.speed/50 * dt);
		this.vy = lerp(this.vy, 0, this.speed/50 * dt);
	}
	isVisible() {
		if (
			this.x < 0 ||
			this.x > GAME.world.width ||
			this.y < 0 ||
			this.y > GAME.world.height
		) {
			return false;
		}
		return true;
	}
	render(ctx) {
		ctx.save();

		ctx.translate(this.x+this.w/2, this.y+this.h/2);

		ctx.rotate(this.currentAngle);

		ctx.fillStyle = this.colour;

		if (this.hasState('damage')) {
			ctx.fillStyle = 'white';
		}

		//Override
		if (this.name == 'player') {
			if (this.hasState('damage')) ctx.fillStyle = 'red';
			if (this.hasState('dashInv')) ctx.fillStyle = 'aqua';
			if (this.hasState('dashing')) ctx.fillStyle = 'orange';
		}

		let s = this.w/2;
		switch (this.shape) {
			case 'circle':
				ctx.beginPath();
				ctx.arc(0, 0, this.w, 0, Math.PI * 2);
				ctx.fill();
				break;
			case 'bullet':
				ctx.translate(-s*1.5, -s*1.5);
				ctx.beginPath();
				ctx.rect(0, 0, s*3, s);
				ctx.rect(s, s, s*2, s);
				ctx.rect(s*2, s*2, s, s);
				ctx.fill();
				ctx.translate(s*1.5, s*1.5);
				break;
			case 'pulse':
				ctx.translate(-s*1.5, -s*1.5);
				ctx.beginPath();
				ctx.rect(s, 0, s, s*3);
				ctx.rect(0, s, s*3, s);
				ctx.fill();
				ctx.translate(s*1.5, s*1.5);
				break;
			case 'dash':
				ctx.translate(-s*1.5, -s*1.5);
				ctx.beginPath();
				ctx.rect(s*2, 0, s, s);
				ctx.rect(s, s, s, s);
				ctx.rect(0, s*2, s, s);
				ctx.fill();
				ctx.translate(s*1.5, s*1.5);
				break;
			case 'poison':
				ctx.translate(-s*1.5, -s*1.5);
				ctx.beginPath();
				ctx.rect(0, 0, s*3, s);
				ctx.rect(s, s, s, s);
				ctx.rect(0, s*2, s, s);
				ctx.rect(s*2, s*2, s, s);
				ctx.fill();
				ctx.translate(s*1.5, s*1.5);
				break;
			default:
				ctx.beginPath();
				ctx.rect(-this.w/2, -this.h/2, this.w, this.h);
				ctx.fill();
		}

		ctx.strokeStyle = 'white';

		if (this.closestToPlayer) {
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.arc(0, 0, this.w*1.25, 0, 2 * Math.PI);
			ctx.stroke();

			if (this.upgrade) {
				let upgrade = GAME.upgrades.list[this.upgrade];
				ctx.font = '10px Arial';
				ctx.textAlign = 'center';
				ctx.fillStyle = this.colour;
				ctx.fillText(upgrade.title, 0, -this.w*2);
				ctx.fillStyle = 'white';
				if (upgrade.description != undefined) {
					ctx.fillText(upgrade.description, 0, this.w*3);
				}
			}
		}
		
		//Angle arrow
		if (this.name == 'player') {
			const s = GAME.scale/1.5;
			ctx.fillStyle = 'white';
			ctx.beginPath();
			ctx.translate(s*5, 0);
			ctx.rotate(-45 * Math.PI / 180);
			ctx.rotate(180 * Math.PI / 180);
			ctx.rect(0, 0, s*3, s);
			ctx.rect(0, 0, s, s*3);
			ctx.fill();
		}

		ctx.restore();
	}
}