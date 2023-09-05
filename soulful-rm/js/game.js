var GAMEFN = {
	updateFrameAnimation: function() {
		//Increase tick
		ANIM.tick++;

		//Reset to zero after reaching max ticks
		if (ANIM.tick > ANIM.maxTick) ANIM.tick = 0;

		//Update frame box (prev. states)
		for (let a = 0; a < ANIM.frame.length; a++) {
			for (let b = 0; b < ANIM.frame[0].length; b++) {

				if  (ANIM.tick % ANIM.speeds[a] == 0) {
					ANIM.frame[a][b]++;
					if (ANIM.frame[a][b] >= ANIM.sprite[b]) ANIM.frame[a][b] = 0;
				}

			}
		}
	},
	lerpAllMovement: function() {
		//Player
		GAME.player.lerpMovement(dt);

		//Scythe
		GAME.scythe.linearMovement(dt);

		//Enemies
		for (let i = 0; i < GAME.map.enemies.length; i++) {
			GAME.map.enemies[i].lerpMovement(dt);
		}

		//Collect
		for (let i = 0; i < GAME.map.collect.length; i++) {
			GAME.map.collect[i].lerpMovement(dt);
		}

		//Replacing spin scythe with stationary scythe
		if (GAME.scythe.rx == GAME.scythe.x && GAME.scythe.ry == GAME.scythe.y && GAME.scythe.name == 'scythe_spin') {
			GAME.scythe = new Mover('scythe', GAME.scythe.x, GAME.scythe.y);
			for (let i = 0; i < GAME.map.enemies.length; i++) {
				if (GAME.map.enemies[i].hitByScythe) {
					GAME.map.enemies[i].hitByScythe = false;
					GAME.map.enemies[i].takeDamage(GAME.player.power);
				}
			}
		}

		//Inventory
		GAME.inventory.lerpMovement(dt);
	},
	slideWorld: function(dir) {
		GAME.two = GAME.map;
		GAME.map = new Map();
		GAME.map.create();
		GAME.map.addRiver();
		GAME.map.updateAndSetGrid();

		GAME.two.pos = [-dir[0], -dir[1]];
		GAME.two.dir = [-dir[0], -dir[1]];
		GAME.map.pos = [0, 0];
		GAME.map.dir = [-dir[0], -dir[1]];

		GAME.player.x -= GAME.player.dir[0]*(HEIGHT-1);
		GAME.player.y -= GAME.player.dir[1]*(HEIGHT-1);
		if (GAME.player.x < 0) GAME.player.x = 0;
		if (GAME.player.x > HEIGHT-1) GAME.player.x = HEIGHT-1;
		if (GAME.player.y < 0) GAME.player.y = 0;
		if (GAME.player.y > HEIGHT-1) GAME.player.y = HEIGHT-1;
		GAME.player.rx = GAME.player.x-GAME.player.dir[0];
		GAME.player.ry = GAME.player.y-GAME.player.dir[1];
		
		if (GAME.player.weapon == '') {
			GAME.scythe.x = GAME.player.x;
			GAME.scythe.y = GAME.player.y;
		}
		GAME.scythe.rx = GAME.player.rx;
		GAME.scythe.ry = GAME.player.ry;

		GAME.two.progress = 1;
		GAME.map.progress = 1;

		GAME.player.checkPickup(); //To pick up scythe if dropped
	},
	renderPlayerHealth(ctx) {
		//Max HP
		for (let i = 0; i < GAME.player.maxhp; i++) {
			ctx.save();

			let n = Math.floor(i/2);
			let x = n % 4;
			let y = Math.floor(n / 4);

			if (i <= GAME.player.hp) {
				if (i < GAME.player.hp) {
					drawHeart(x*SIZE, y*SIZE, 0, 2);
					drawHeart(x*SIZE, y*SIZE, 1, 2);
				} else {
					drawHeart(x*SIZE, y*SIZE, 0, 2);
					drawHeart(x*SIZE, y*SIZE, 3, 2);
				}
			} else {
				drawHeart(x*SIZE, y*SIZE, 2, 2);
				drawHeart(x*SIZE, y*SIZE, 3, 2);
			}

			ctx.restore();
		}

		function drawHeart(x, y, sx, sy) {
			ctx.drawImage(
				spritesheet,
				sx*RATIO,
				sy*RATIO,
				RATIO,
				RATIO,
				x,
				y,
				SIZE,
				SIZE
			);
		}
	},
	renderMoney(ctx) {
		//Coin
		ctx.drawImage(
			spritesheet,
			19*RATIO,
			12*RATIO,
			RATIO,
			RATIO,
			0,
			(HEIGHT-1)*SIZE,
			SIZE,
			SIZE
		);

		//Numbers
		drawNumber(ctx, GAME.player.money, SIZE, (HEIGHT-1)*SIZE);
	},
	renderTopRightUI(ctx) {
		ctx.save();

		ctx.translate((HEIGHT+6)*SIZE, 0);

		//Arrow keys
		ctx.drawImage(spritesheet, 0*RATIO, 3*RATIO, RATIO, RATIO, 1*SIZE, 0, SIZE, SIZE);
		ctx.drawImage(spritesheet, 1*RATIO, 3*RATIO, RATIO, RATIO, 0, 1*SIZE, SIZE, SIZE);
		ctx.drawImage(spritesheet, 2*RATIO, 3*RATIO, RATIO, RATIO, 1*SIZE, 1*SIZE, SIZE, SIZE);
		ctx.drawImage(spritesheet, 3*RATIO, 3*RATIO, RATIO, RATIO, 2*SIZE, 1*SIZE, SIZE, SIZE);
		//WASD
		ctx.translate(0, SIZE*3);
		ctx.drawImage(spritesheet, 4*RATIO, 3*RATIO, RATIO, RATIO, 1*SIZE, 0, SIZE, SIZE);
		ctx.drawImage(spritesheet, 5*RATIO, 3*RATIO, RATIO, RATIO, 0, 1*SIZE, SIZE, SIZE);
		ctx.drawImage(spritesheet, 6*RATIO, 3*RATIO, RATIO, RATIO, 1*SIZE, 1*SIZE, SIZE, SIZE);
		ctx.drawImage(spritesheet, 7*RATIO, 3*RATIO, RATIO, RATIO, 2*SIZE, 1*SIZE, SIZE, SIZE);

		ctx.translate(0, SIZE*3);

		//Z Key
		ctx.drawImage(spritesheet, 4*RATIO, 4*RATIO, RATIO, RATIO, 0, 0, SIZE, SIZE);
		//Hitbox
		ctx.drawImage(spritesheet, 2*RATIO, 0*RATIO, RATIO, RATIO, 1*SIZE, 0, SIZE, SIZE);

		
		if (GAME.player.weapon == 'scythe') {
			//C Key
			ctx.drawImage(spritesheet, 6*RATIO, 4*RATIO, RATIO, RATIO, 0, 1*SIZE, SIZE, SIZE);
			//Scythe
			if (GAME.player.weapon == 'scythe') ctx.drawImage(spritesheet, 22*RATIO, 0*RATIO, RATIO, RATIO, 1*SIZE, 1*SIZE, SIZE, SIZE);
		}

		ctx.restore();
	},
	renderInventory(ctx) {
		ctx.save();

		ctx.translate((HEIGHT+7)*SIZE, (HEIGHT-6)*SIZE);

		for (let i = 0; i < GAME.player.inventory.length; i++) {

			if (i < GAME.player.slot-2 || i >= GAME.player.slot+5-2) continue;

			let tile = GAME.player.inventory[i].tile;

			let x = 0;
			let y = i*SIZE + GAME.inventory.ry*SIZE + 2*SIZE;
			
			//Fill
			ctx.fillStyle = tile.color;
			ctx.fillRect(x, y, SIZE, SIZE);
			ctx.drawImage(
				spritesheet,
				1+TILE[tile.type].sx*RATIO,
				1+TILE[tile.type].sy*RATIO,
				RATIO-2,
				RATIO-2,
				x,
				y,
				SIZE,
				SIZE
			);

			//Amount
			drawNumber(ctx, GAME.player.inventory[i].amount, x+SIZE, y);

		}

		//Q
		if (GAME.player.inventory.length > 1) ctx.drawImage(spritesheet, 4*RATIO, 5*RATIO, RATIO, RATIO, 0, -1*SIZE, SIZE, SIZE);
		//E
		if (GAME.player.inventory.length > 1) ctx.drawImage(spritesheet, 5*RATIO, 5*RATIO, RATIO, RATIO, 0, 5*SIZE, SIZE, SIZE);
		//Arrow
		if (GAME.player.inventory.length > 0)ctx.drawImage(spritesheet, 6*RATIO, 5*RATIO, RATIO, RATIO, -1*SIZE, 2*SIZE, SIZE, SIZE);

		ctx.restore();
	}
}

function drawNumber(ctx, number, x, y) {
	var numString = number.toString();
	for (let i = 0; i < numString.length; i++) {
		let num = parseInt(numString[i]);
		ctx.drawImage(
			spritesheet,
			(14+num)*RATIO,
			31*RATIO,
			RATIO,
			RATIO,
			x + i*SIZE/2,
			y,
			SIZE,
			SIZE
		);
	}
}

class Tile {
	constructor(type) {
		this.type = type;
		this.variant = randInt(0,3);
		this.color = getColor(TILE[type].color);
	}
	render(ctx, a, b) {
		let tile = TILE[this.type];

		let animDisplacement = 0;
		if (tile.anim != undefined) {
			animDisplacement = returnVariantFrame(
				tile.anim[0],
				tile.anim[1],
				this.variant
			);
			animDisplacement = animDisplacement*RATIO;
		}

		ctx.fillStyle = this.color;
		ctx.fillRect(
			a*SIZE,
			b*SIZE,
			SIZE,
			SIZE
		);

		ctx.drawImage(
			spritesheet,
			1+tile.sx*RATIO,
			1+tile.sy*RATIO + animDisplacement,
			RATIO-2,
			RATIO-2,
			a*SIZE,
			b*SIZE,
			SIZE,
			SIZE
		);

		if (tile.overlay != undefined) {
			ctx.drawImage(
				spritesheet,
				tile.overlay[0]*RATIO,
				tile.overlay[1]*RATIO + animDisplacement,
				RATIO-2,
				RATIO-2,
				a*SIZE,
				b*SIZE,
				SIZE,
				SIZE
			);
		}

		/*ctx.font = "16px serif";
		ctx.fillStyle = "black";
		ctx.fillText(this.grid[a][b], a*SIZE, b*SIZE+SIZE);*/
	}
}

class Mover {
	constructor(name, x, y) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.rx = x; //Rnder x
		this.ry = y; //Rnder y, for lerping

		this.sx = ENTITY[name].sx;
		this.sy = ENTITY[name].sy;

		this.dir = [0,1];
		this.color = ENTITY[name].color;

		this.animation = 'walking'; //List of animations: walking, hurt, throw
		this.progress = 0; //maximum 1

		this.hp = 1;
		this.maxhp = 1;
		this.power = 1;

		this.inventory = [];
		this.slot = 0;
		this.change = 0;

		this.money = 0;
		this.weapon = '';
		this.hitByScythe = false;
	}
	lerpMovement(dt) {
		//Animation
		this.progress = linear(this.progress, 0, dt/SPEED*0.1);

		//Visual
		let diffX = this.rx-this.x;
		let diffY = this.ry-this.y;
		this.rx = linear(this.rx, this.x, dt/SPEED*0.1) - diffX*0.1;
		this.ry = linear(this.ry, this.y, dt/SPEED*0.1) - diffY*0.1;
	}
	linearMovement(dt) {
		//Animation
		this.progress = linear(this.progress, 0, dt/SPEED*0.1);

		this.rx = linear(this.rx, this.x, dt/SPEED*0.5);
		this.ry = linear(this.ry, this.y, dt/SPEED*0.5);
	}
	render(ctx) {
		ctx.save();

		let entity = ENTITY[this.name];
		let image = 	spritesheet;
		let sx = 		1+this.sx*RATIO;
		let sy = 		1+this.sy*RATIO;
		let sWidth = 	RATIO-2;
		let sHeight = 	RATIO-2;
		let dx = 		-SIZE/2;
		let dy = 		-SIZE/2;
		let dWidth = 	SIZE;
		let dHeight = 	SIZE;

		//Natural animations
		if (entity.anim != undefined) {
			let animDisplacement = 0;

			animDisplacement = returnVariantFrame(
				entity.anim[0],
				entity.anim[1],
				0
			);
			animDisplacement = animDisplacement*RATIO;

			sy += animDisplacement;
		}

		//Hover effect
		if (
			/*TILESET.collectables.indexOf(this.name) >= 0 ||
			TILESET.coins.indexOf(this.name) >= 0 ||
			this.name == 'scythe'*/
			false
		) {
			let hoverEffect = 0;

			hoverEffect = returnVariantFrame(2,0,0)/ANIM.sprite[0];
			hoverEffect = Math.abs(hoverEffect-0.5);
			hoverEffect = hoverEffect*4 % 2;
			hoverEffect = hoverEffect*SIZE/8;
			
			dy += hoverEffect;
		}

		//Special animations
		if (this.animation == 'walking' || this.animation == 'hurt') {
			sy += Math.ceil(this.progress*RATIO*3 / RATIO) * RATIO;
		}

		if (this.animation == 'hurt' && this.progress > 0) {
			GAME.player.renderHurt(ctx);
			sx += RATIO;
		}

		//transform
		ctx.translate(
			this.rx*SIZE + SIZE/2,
			this.ry*SIZE + SIZE/2
		);

		//Little rotation
		let rotation = this.progress;
		rotation = 0.5 * Math.sin(2*Math.PI * rotation);
		ctx.rotate((rotation*15 * Math.PI) / 180);

		//direction
		if (this.dir[0] > 0) {
			ctx.scale(-1,1);
			rotation = -rotation;
		}

		//entity
		ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

		//reset transform
		ctx.translate(
			-(this.rx*SIZE + SIZE/2),
			-(this.ry*SIZE + SIZE/2)
		);

		ctx.restore();
	}
	renderHealth(ctx) {
		ctx.fillStyle = '#252525';
		ctx.fillRect(
			this.rx*SIZE,
			(this.ry+1)*SIZE,
			SIZE,
			SIZE/8*3
		);
		ctx.fillStyle = '#ff5050';
		ctx.fillRect(
			this.rx*SIZE,
			(this.ry+1)*SIZE + SIZE/8,
			SIZE*(this.hp/this.maxhp),
			SIZE/8
		);
	}
	renderHitbox(ctx) {
		var lx = this.x+this.dir[0];
		var ly = this.y+this.dir[1];
		var indicator = 2; //2: arrow, 3: slash

		if (lx > 0 && lx < HEIGHT-1 && ly > 0 && ly < HEIGHT-1) {
			if (TILE[GAME.map.arr[lx][ly].type].destroy) {
				indicator = 3;
			}
		}

		//Swipe
		for (let i = 0; i < GAME.map.enemies.length; i++) {
			let e = GAME.map.enemies[i];
			if (e.x == lx && e.y == ly) {
				indicator = 3;
				break;
			}
		}

		//Indicator
		ctx.drawImage(
			spritesheet,
			1+indicator*RATIO,
			1+0*RATIO,
			RATIO-2,
			RATIO-2,
			this.rx*SIZE + this.dir[0]*SIZE,
			this.ry*SIZE + this.dir[1]*SIZE,
			SIZE,
			SIZE
		);
	}
	renderHurt(ctx) {

		for (let a = 0; a < HEIGHT; a++) {
			for (let b = 0; b < HEIGHT; b++) {
				//Don't bother if out of bounds
				if (a < 0 || a > HEIGHT-1 || b < 0 || b > HEIGHT-1) break;

				let d = calculateDistance(a, b, this.x, this.y);
				if (
					d > Math.abs(this.progress-1)*HEIGHT/8 - 0.25 &&
					d < Math.abs(this.progress-1)*HEIGHT/8 + 0.25
				) {
					ctx.fillStyle = '#ff5050';
					ctx.fillRect(a*SIZE, b*SIZE, SIZE, SIZE);
					let tileType = GAME.map.arr[a][b].type;
					ctx.drawImage(
						spritesheet,
						1+TILE[tileType].sx*RATIO,
						1+TILE[tileType].sy*RATIO,
						RATIO-2,
						RATIO-2,
						a*SIZE,
						b*SIZE,
						SIZE,
						SIZE
					);
				} else {
					ctx.fillStyle = '#252525';
					ctx.fillRect(a*SIZE, b*SIZE, SIZE, SIZE);
				}
			}
		}

	}
	move(x, y) {
		if (x == 0 && y < 0) this.look(0,-1);
		if (x == 0 && y > 0) this.look(0,1);
		if (y == 0 && x < 0) this.look(-1,0);
		if (y == 0 && x > 0) this.look(1,0);

		if (this.x+x < 0 || this.x+x > HEIGHT-1 || this.y+y < 0 || this.y+y > HEIGHT-1) {
			GAMEFN.slideWorld(this.dir);
		} else {
			if (GAME.map.grid[this.y+y][this.x+x] == 0) {
				this.x += x;
				this.y += y;

				this.animation = 'walking';
				this.progress = 1;

				this.checkPickup();

				enemysTurn();
			}
		}

		//Scythe calculations
		if (this.weapon == 'scythe') {
			GAME.scythe.x = GAME.player.x;
			GAME.scythe.y = GAME.player.y;
		}
	}
	throwScythe() {
		if (this.weapon == '') return;

		this.weapon = '';
		let sy = this.y;
		let sx = this.x;
		let dir = this.dir;
		while (sx > 0 && sx < HEIGHT-1 && sy > 0 && sy < HEIGHT-1) {
			sx += dir[0];
			sy += dir[1];
			let i = enemyOnThisTile(sx, sy);
			if (TILE[GAME.map.arr[sx][sy].type].block || i >= 0) {
				if (i >= 0) {
					GAME.map.enemies[i].hitByScythe = true;
				}
				sx -= dir[0];
				sy -= dir[1];
				break;
			}
		}
		GAME.scythe = new Mover('scythe_spin', GAME.scythe.x, GAME.scythe.y);
		GAME.scythe.x = sx;
		GAME.scythe.y = sy;

		this.animation = 'throw';
		this.progress = 1;
	}
	look(dir1, dir2) {
		if (this.dir[0] == dir1 && this.dir[1] == dir2) {

		} else {
			this.dir = [dir1, dir2];
			enemysTurn();
		}
	}
	mine() {
		var lx = this.x+this.dir[0];
		var ly = this.y+this.dir[1];

		if (lx < 0 || lx > HEIGHT-1 || ly < 0 || ly > HEIGHT-1) return;

		if (TILE[GAME.map.arr[lx][ly].type].destroy != undefined) {
			//Add to inventory
			this.addItem(new Tile(GAME.map.arr[lx][ly].type), 1);

			//Spawn coins if chest
			if (TILESET.loot.indexOf(GAME.map.arr[lx][ly].type) >= 0) {
				spawnFrom(TILESET.coins, lx, ly);
			}

			//Spawn collectables if burrow
			if (TILESET.burrows.indexOf(GAME.map.arr[lx][ly].type) >= 0) {
				spawnFrom(TILESET.collectables, lx, ly, 1);
			}

			//Change tile on map
			GAME.map.arr[lx][ly] = new Tile(TILE[GAME.map.arr[lx][ly].type].destroy);
		}

		this.animation = 'mine';
		this.progress = 1;
	}
	place() {
		var lx = this.x+this.dir[0];
		var ly = this.y+this.dir[1];

		if (GAME.map.arr[lx][ly].type == 'ground') {
			let t = this.inventory[this.slot].tile;
			GAME.map.arr[lx][ly] = new Tile(t.type);
			GAME.map.updateAndSetGrid();
			this.removeItem(t, 1);
		}
	}
	displace(dir) {
		this.rx = this.x-dir[0];
		this.ry = this.y-dir[1];
	}
	addItem(tile, amount) {
		let length = this.inventory.length;
		let count = 0;
		for (let i = 0; i < length; i++) {
			if (this.inventory[i].tile.type == tile.type) {
				this.inventory[i].amount += amount;
				return;
			} else {
				count++;
			}
		}

		if (count == length) {
			this.inventory.unshift({
				tile: tile,
				amount: amount
			});
		}
	}
	removeItem(tile, amount) {
		for (let i = 0; i < this.inventory.length; i++) {
			if (this.inventory[i].tile.type == tile.type) {
				this.inventory[i].amount -= amount;

				if (this.inventory[i].amount <= 0) {
					this.inventory.splice(i, 1);
					this.adjustSlot(0);
				}

				return;
			}
		}
	}
	takeDamage(damage) {
		this.hp -= damage;

		//Place grave
		if (this.hp <= 0) {
			if (ENTITY[this.name].destroy != undefined) GAME.map.arr[this.x][this.y] = new Tile(ENTITY[this.name].destroy);
			GAME.map.updateAndSetGrid();
		}

		this.x += GAME.player.dir[0];
		this.y += GAME.player.dir[1];

		GAME.map.deleteDeadEnemies();
	}
	attack() {
		var lx = this.x+this.dir[0];
		var ly = this.y+this.dir[1];

		let i = enemyOnThisTile(lx, ly);
		if (i >= 0) {
			GAME.map.enemies[i].takeDamage(this.power);
		}
	}
	checkPickup() {
		//Floor items
		for (let i = 0; i < GAME.map.collect.length; i++) {
			let c = GAME.map.collect[i];
			if (this.x == c.x && this.y == c.y) {
				//Mover is in same position as a floor item
				
				//Floor item is a coin
				if (TILESET.coins.indexOf(c.name) >= 0) {
					let valueOfCoin = c.name.charAt(c.name.length-1);
					this.money += parseInt(valueOfCoin);
				}

				//Remove floor item
				GAME.map.collect.splice(i, 1);
				i--;
			}
		}

		//Scythe
		if (this.x == GAME.scythe.x && this.y == GAME.scythe.y) {
			this.weapon = 'scythe';
		}
	}
	checkCollision() {
		for (let i = 0; i < GAME.map.enemies.length; i++) {
			let e = GAME.map.enemies[i];
			if (this.x == e.x && this.y == e.y) {
				this.hp -= e.power; //TODO add dying
				e.takeDamage(this.power);
				this.animation = 'hurt';
				this.progress = 1;
			}
		}
	}
	adjustSlot(num) {

		if (this.slot+num < 0 || this.slot+num > this.inventory.length-1) return;

		this.slot += num;
		if (this.slot < 0) {
			this.slot = 0;
			GAME.inventory.y += num;
		}
		if (this.slot > this.inventory.length-1) {
			this.slot = this.inventory.length-1;
			GAME.inventory.y += num;
		}
		GAME.inventory.y -= num;
	}
}

function spawnFrom(array, lx, ly, num) { //If num is undefined, choose a random number
	let dirsArr = DIRS.slice(0); //Clone
	dirsArr = dirsArr.sort(() => Math.random() - 0.5); //Shuffle
	for (let i = 0; i < dirsArr.length; i++) { //Loop
		if (lx+dirsArr[i][0] < 0 || lx+dirsArr[i][0] > HEIGHT-1 || ly+dirsArr[i][1] < 0 || ly+dirsArr[i][1] > HEIGHT-1) continue;

		if (TILE[GAME.map.arr[lx+dirsArr[i][0]][ly+dirsArr[i][1]].type].block) { //Check if selected is blocked
			dirsArr.splice(i, 1); //Remove
			i--; //Fix loop
		}
	}
	let n = randInt(1,dirsArr.length);
	if (num != undefined) n = num;
	while (n > 0) {
		let item = rand(array);
		spawn(item, dirsArr[n-1]); //Minus 1 to get the array position
		n--;
	}

	function spawn(item, dir) {
		GAME.map.collect.push(new Mover(item, lx+dir[0], ly+dir[1]));
		GAME.map.collect[GAME.map.collect.length-1].displace(dir);
	}
}

function enemyOnThisTile(x, y) {
	for (let i = 0; i < GAME.map.enemies.length; i++) {
		if (x == GAME.map.enemies[i].x && y == GAME.map.enemies[i].y) {
			return i;
		}
	}
	return -1;
}

function enemysTurn() {
	const walkFunctions = {
		statue: function(i) { //Stand still
			//Do nothing
		},
		random: function(i) { //Walk towards a random point
			enemyWalkTowardsPoint(i, randInt(0,HEIGHT-1), randInt(0,HEIGHT-1));
		},
		player: function(i) { //Walk towards the player
			enemyWalkTowardsPoint(i, GAME.player.x, GAME.player.y);
		}
	}

	function enemyWalkTowardsPoint(i, x, y) {
		let e = GAME.map.enemies[i];
		easystar.findPath(e.x, e.y, x, y, function( path ) {
			if (path === null) {
				//console.log('No path found.');
			} else {
				if (path.length > 0) {
					e.x = path[1].x;
					e.y = path[1].y;
					let displacement_x = path[1].x - path[0].x;
					let displacement_y = path[1].y - path[0].y;
					e.dir = [displacement_x, displacement_y];
					e.animation = 'walking';
					e.progress = 1;
				}
			}
		});
	}

	for (let i = 0; i < GAME.map.enemies.length; i++) {
		let nameOfEnemy = GAME.map.enemies[i].name;
		let playerStandingOn = GAME.map.arr[GAME.player.x][GAME.player.y].type;
		let enemyWalkArr = ENTITY[nameOfEnemy].walk;

		if (TILESET.ocean.indexOf(playerStandingOn) >= 0) {
			walkFunctions[enemyWalkArr[0]](i);
		} else if (playerStandingOn == 'ground') {
			walkFunctions[enemyWalkArr[1]](i);
		} else {
			walkFunctions[enemyWalkArr[2]](i);
		}
	}

	easystar.calculate();

	GAME.player.checkCollision();
}