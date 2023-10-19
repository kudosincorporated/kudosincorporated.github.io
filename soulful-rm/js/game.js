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

		//River door
		GAME.river_door.linearMovement(dt);

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
					GAME.map.enemies[i].getHit(GAME.player.power);
				}
			}

			//TODO Add explosion upgrade
		}

		//Inventory
		GAME.inventory.lerpMovement(dt);
	},
	slideWorld: function(dir) {
		SOUND.door.play();

		if (ROOM_NUMBER == -1) {
			if (dir[0] == 0 && dir[1] == 0) { //There is nothing more permanent than a working temporary solution
				GAME.map = GAME.two;
			} else {
				GAME.two = GAME.map;
				GAME.map = new Map();
				GAME.map.fillWorld();
			}
		} else {
			GAME.two = GAME.map;
			GAME.map = GAME.map.rooms[ROOM_NUMBER];
			GAME.map.updateAndSetGrid();
		}

		GAME.two.pos = [-dir[0], -dir[1]];
		GAME.two.dir = [-dir[0], -dir[1]];
		GAME.map.pos = [0, 0];
		GAME.map.dir = [-dir[0], -dir[1]];

		GAME.player.x -= dir[0]*(HEIGHT-1);
		GAME.player.y -= dir[1]*(HEIGHT-1);
		if (GAME.player.x < 0) GAME.player.x = 0;
		if (GAME.player.x > HEIGHT-1) GAME.player.x = HEIGHT-1;
		if (GAME.player.y < 0) GAME.player.y = 0;
		if (GAME.player.y > HEIGHT-1) GAME.player.y = HEIGHT-1;
		GAME.player.rx = GAME.player.x-dir[0];
		GAME.player.ry = GAME.player.y-dir[1];
		if (SCYTHE_GAME) {
			GAME.scythe.x = GAME.player.x;
			GAME.scythe.y = GAME.player.y;
			GAME.scythe.rx = GAME.player.x;
			GAME.scythe.ry = GAME.player.y;
		}
		
		//Disable softlocking if you forget to pick up the scythe
		if (GAME.player.weapon == '' && WORLDPOS >= 2 && SCYTHE_GAME) {
			GAME.scythe.x = GAME.player.x;
			GAME.scythe.y = GAME.player.y;
			GAME.scythe.rx = GAME.player.rx;
			GAME.scythe.ry = GAME.player.ry;
		}
		if (WORLDPOS == 2 && !SCYTHE_GAME) {
			GAME.scythe.y = -1;
			GAME.scythe.ry = GAME.scythe.y;
		}

		GAME.two.progress = 1;
		GAME.map.progress = 1;

		if (TILESET.darkRooms.indexOf(GAME.map.name) >= 0) {
			NIGHTTIME = true;
		} else {
			NIGHTTIME = false;
		}

		GAME.player.checkPickup(); //To pick up scythe if dropped
	},
	enterSwapRoom: function() {
		GAME.two = GAME.map;
		GAME.map = new Map();
		GAME.map.create();
		GAME.map.updateAndSetGrid();
	},
	renderPlayerHealth(ctx) {
		ctx.save();
		
		ctx.translate(0, (MIDDLE - Math.floor(GAME.player.maxhp/4/4))*SIZE);

		//Max HP
		for (let i = 0; i < GAME.player.maxhp; i++) {
			ctx.save();

			let n = Math.floor(i/2);
			let x = n % 4;
			let y = Math.floor(n / 4);

			if (i < GAME.player.hp) {
				if (i % 2 == 0) {
					drawHeart(x*SIZE, y*SIZE, 0, 2);
				} else {
					drawHeart(x*SIZE, y*SIZE, 1, 2);
				}
			} else {
				if (i % 2 == 0) {
					drawHeart(x*SIZE, y*SIZE, 2, 2);
				} else {
					drawHeart(x*SIZE, y*SIZE, 3, 2);
				}
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

		ctx.restore();
	},
	renderMoney(ctx) {
		ctx.save();

		ctx.translate((HEIGHT+6)*SIZE, MIDDLE*SIZE);

		//Coin
		ctx.drawImage(
			spritesheet,
			ENTITY.coin_4.sx*RATIO,
			ENTITY.coin_4.sy*RATIO,
			RATIO,
			RATIO,
			0,
			0,
			SIZE,
			SIZE
		);

		//Numbers
		drawNumber(ctx, GAME.player.money, SIZE, 0);

		ctx.restore();
	},
	renderControlUI(ctx) {
		let fadedOpacity = 0.15;
		ctx.save();

		//Logo
		/*ctx.drawImage(
			spritesheet,
			ENTITY.logo.sx*RATIO,
			ENTITY.logo.sy*RATIO,
			ENTITY.logo.w*RATIO,
			ENTITY.logo.h*RATIO,
			0,
			0,
			ENTITY.logo.w*SIZE, 
			ENTITY.logo.h*SIZE
		);*/

		ctx.translate(0, (HEIGHT-3)*SIZE);

		//Controls
		//Q
		drawKeycap(ctx, 'q', 81, 0, 0);
		//E
		drawKeycap(ctx, 'e', 69, SIZE*2, 0);
		//W
		drawKeycap(ctx, 'w', 87, SIZE, 0);
		//R
		drawKeycap(ctx, 'r', 82, SIZE*3, 0);

		ctx.translate(SIZE/2, SIZE);
		
		//A
		drawKeycap(ctx, 'a', 65, 0, 0);
		//S
		drawKeycap(ctx, 's', 83, SIZE, 0);
		//D
		drawKeycap(ctx, 'd', 68, SIZE*2, 0);
		//F
		drawKeycap(ctx, 'f', 70, SIZE*3, 0);
		
		ctx.translate(SIZE/2, SIZE);

		//Z
		drawKeycap(ctx, 'z', 90, 0, 0);
		//C
		drawKeycap(ctx, 'z', 67, SIZE*2, 0);

		ctx.translate(-SIZE, SIZE*2);
		ctx.translate((HEIGHT+7)*SIZE, -SIZE*4);

		//Arrow keys
		drawKeycap(ctx, 'ua', 38, SIZE, 0);
		ctx.translate(-SIZE/2, 0);
		drawKeycap(ctx, 'la', 37, 0, SIZE);
		drawKeycap(ctx, 'da', 40, SIZE, SIZE);
		drawKeycap(ctx, 'ra', 39, SIZE*2, SIZE);

		function drawKeycap(ctx, key, pressed, x, y) {
			//Pressed
			let minusFromHeight = 0;
			if (KEYDOWN.indexOf(pressed) >= 0) minusFromHeight = SIZE/8;

			//Opacity
			let faded = 0.15;
			if (!GAME.player.invIsOpen) {
				if (key == 'q' || key == 'e') {
					ctx.globalAlpha = faded;
				}
			}
			if (GAME.player.inventory.length == 0 || !GAME.player.invIsOpen) {
				if (key == 'f') {
					ctx.globalAlpha = faded;
				}
			}
			if (GAME.player.weapon == '') {
				if (key == 'c') {
					ctx.globalAlpha = faded;
				}
			}

			ctx.drawImage(
				spritesheet,
				ENTITY[key].sx*RATIO,
				ENTITY[key].sy*RATIO,
				RATIO,
				RATIO,
				x,
				y + minusFromHeight,
				SIZE,
				SIZE
			);

			ctx.globalAlpha = 1;
		}

		ctx.restore();
	},
	renderInventory(ctx) {
		let hotbarLen = 2;

		ctx.save();

		ctx.translate((GAME.player.rx+2)*SIZE, (GAME.player.ry-4)*SIZE);

		//UI
		ctx.drawImage(
			spritesheet,
			1+ENTITY.inventory.sx*RATIO,
			1+ENTITY.inventory.sy*RATIO,
			RATIO*7-2,
			RATIO*3-2,
			0,
			0,
			SIZE*7,
			SIZE*3
		);

		//Draw selected
		for (let i = -hotbarLen; i < hotbarLen+1; i++) {

			let slotToDraw = GAME.player.slot+i;
			if (slotToDraw < 0) 								slotToDraw += GAME.player.inventory.length;
			if (slotToDraw > GAME.player.inventory.length-1) 	slotToDraw -= GAME.player.inventory.length;

			if (slotToDraw < 0 || slotToDraw > GAME.player.inventory.length-1) continue; //Out of bounds of inventory

			let tile = GAME.player.inventory[slotToDraw].tile;
			tile.render(ctx, 3+i, 1);
			if (GAME.player.slot == slotToDraw) drawNumber(ctx, GAME.player.inventory[slotToDraw].amount, (3+i)*SIZE, 0);

		}

		ctx.drawImage(spritesheet, ENTITY.q.sx*RATIO, ENTITY.q.sy*RATIO, RATIO, RATIO, 0, SIZE, SIZE, SIZE);
		ctx.drawImage(spritesheet, ENTITY.e.sx*RATIO, ENTITY.e.sy*RATIO, RATIO, RATIO, SIZE*6, SIZE, SIZE, SIZE);
		ctx.drawImage(spritesheet, ENTITY.f.sx*RATIO, ENTITY.f.sy*RATIO, RATIO, RATIO, SIZE*3, SIZE*2, SIZE, SIZE);

		ctx.restore();
	}
}

function drawNumber(ctx, number, x, y) {
	var numString = number.toString();
	for (let i = 0; i < numString.length; i++) {
		let num = parseInt(numString[i]);
		ctx.drawImage(
			spritesheet,
			(0+num)*RATIO,
			3*RATIO,
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
		ctx.save();

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

		//Tundra snow
		if (WORLDPOS >= 15 && WORLDPOS <= 22) {
			if (tile.color == 'foliage' || tile.color == 'green' || tile.color == 'autumn') {
				ctx.fillStyle = 'rgba(255,255,255,0.5)';
				ctx.fillRect(a*SIZE, b*SIZE, SIZE, SIZE/4*this.variant);
			}
		}

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
				1+tile.overlay[0]*RATIO,
				1+tile.overlay[1]*RATIO + animDisplacement,
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
		
		ctx.restore();
	}
}

class Mover {
	constructor(name, x, y) {
		this.name = name;
		this.spawnx = x;
		this.spawny = y;
		this.x = x;
		this.y = y;
		this.rx = x; //Rnder x
		this.ry = y; //Rnder y, for lerping
		this.phase = 0;

		this.sx = ENTITY[name].sx;
		this.sy = ENTITY[name].sy;

		this.dir = [0,1];
		this.color = ENTITY[name].color;

		this.animation = 'walking'; //List of animations: walking, hurt, throw
		this.progress = 0; //maximum 1

		let health = ENTITY[name].hp !== undefined ? ENTITY[name].hp : 1;
		this.hp = health;
		this.maxhp = health;
		this.power = 1;

		this.inventory = [];
		this.invIsOpen = false;
		this.slot = 0;

		this.money = 0;
		this.weapon = '';
		this.hitByScythe = false;

		this.upgrades = [];
	}
	toggleInventory() {
		if (this.invIsOpen) {
			SOUND.click.play();
		} else {
			SOUND.note.play();
		}

		this.invIsOpen = !this.invIsOpen;
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

		//Scythe
		if (this.name == 'scythe' || this.name == 'scythe_spin') {
			//Don't show on first tile
			if (WORLDPOS == 0) return;

			//Type of scythe (upgrades are different colours)
			let lastPurchasedUpgrade = GAME.player.upgrades[GAME.player.upgrades.length-1];
			if (lastPurchasedUpgrade == 'power_upgrade') {
				sx += RATIO;
			} else if (lastPurchasedUpgrade == 'greedy_upgrade') {
				sx += RATIO*2;
			} else if (lastPurchasedUpgrade == 'explode_upgrade') {
				sx += RATIO*3;
			}
		}

		//River door
		if (this.name == 'river_door' && GAME.map.enemies.length > 0) {
			sx += RATIO;
		}

		//Phase (used for bosses)
		sy += (this.phase*2)*RATIO;

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
			this.name == 'river_door'
		) {
			let hoverEffect = 0;

			hoverEffect = returnVariantFrame(2,0,0)/ANIM.sprite[0];
			hoverEffect = Math.abs(hoverEffect-0.5);
			hoverEffect = hoverEffect*4 % 2;
			hoverEffect = hoverEffect*SIZE/8;
			
			dy -= hoverEffect;
		}

		//Special animations
		if (this.animation == 'walking' || this.animation == 'hurt') {
			sy += Math.ceil(this.progress*RATIO*3 / RATIO) * RATIO;
		}

		if (this.animation == 'hurt') {
			sx += RATIO;
		
			if (this.progress == 1) {
				KEYBOARDLOCK = true;
				zapAtPoint(this.x, this.y, EXPLODE.hurt);
			}
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
			if (this.name.includes('atk')) {
				//Don't rotate attacks
			} else {
				ctx.scale(-1,1);
				rotation = -rotation;
			}
		}

		//aura
		if (TILESET['can_hurt_you'].indexOf(this.name) >= 0) {
			//drawAura(dx, dy, 'aura');
		}

		//aura_2
		if (this.name.includes('atk')) {
			//drawAura(dx, dy, 'aura_2');
		}

		//entity
		ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

		//gungenthor eyes
		if (this.name == 'gungenthor') {
			//drawAura(dx-SIZE, dy, 'aura_2');
			//drawAura(dx+SIZE, dy, 'aura_2');
			ctx.drawImage(image, sx-RATIO, sy, sWidth, sHeight, dx-SIZE, dy, dWidth, dHeight);
			ctx.drawImage(image, sx+RATIO, sy, sWidth, sHeight, dx+SIZE, dy, dWidth, dHeight);
		}

		//reset transform
		ctx.translate(
			-(this.rx*SIZE + SIZE/2),
			-(this.ry*SIZE + SIZE/2)
		);

		ctx.restore();

		function drawAura(dx, dy, disp) {
			ctx.globalAlpha = 0.33;
			ctx.drawImage(
				image,
				1+ENTITY[disp].sx*RATIO,
				1+ENTITY[disp].sy*RATIO,
				2*RATIO-2,
				2*RATIO-2,
				dx-SIZE/2,
				dy-SIZE/2,
				2*SIZE,
				2*SIZE
			)
			ctx.globalAlpha = 1;
		}
	}
	renderHealth(ctx) {
		if (this.name.includes('atk')) return;

		let h = SIZE/8;
		let w = SIZE*(this.hp/this.maxhp);
			w = Math.round(w / 4) * 4;
		let x = this.rx*SIZE;
		let y = (this.ry+1)*SIZE;

		ctx.fillStyle = '#252525';
		ctx.fillRect(x, y, w, h*3);
		ctx.fillStyle = '#ff5050';
		ctx.fillRect(x, y+SIZE/8, w, h);
	}
	renderHitbox(ctx) {
		var lx = this.x+this.dir[0];
		var ly = this.y+this.dir[1];
		var indicator = 2; //2: arrow, 3: slash

		//Swipe
		for (let i = 0; i < GAME.map.enemies.length; i++) {
			let e = GAME.map.enemies[i];
			if (e.x == lx && e.y == ly) {
				indicator = 3;
				break;
			}
		}

		if (lx > 0 && lx < HEIGHT-1 && ly > 0 && ly < HEIGHT-1) {
			if (TILE[GAME.map.arr[lx][ly].type].destroy) {
				indicator = 4;
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
	renderShadow(ctx) {
		ctx.save();
		for (let a = 0; a < HEIGHT; a++) {
			for (let b = 0; b < HEIGHT; b++) {
				//Don't bother if out of bounds
				if (a < 0 || a > HEIGHT-1 || b < 0 || b > HEIGHT-1) break;

				let d = calculateDistance(a, b, GAME.player.x, GAME.player.y);
				if (d < HEIGHT/4) {
					ctx.globalAlpha = d/HEIGHT*4;
				} else {
					ctx.globalAlpha = 1;
				}

				ctx.fillStyle = '#252525';
				ctx.fillRect(a*SIZE, b*SIZE, SIZE, SIZE);
			}
		}

		ctx.restore();
	}
	move(x, y) {
		SOUND.move.play();

		if (x == 0 && y < 0) this.dir = [0,-1];
		if (x == 0 && y > 0) this.dir = [0,1];
		if (y == 0 && x < 0) this.dir = [-1,0];
		if (y == 0 && x > 0) this.dir = [1,0];

		//Don't interact with any wall except bottom
		if (this.x+x < 0 || this.x+x > HEIGHT-1 || this.y+y < 0) return;

		//Slide world down if bottom touched (teehee)
		if (this.y+y > HEIGHT-1) {
			if (this.x == RIVER_DOOR && GAME.map.enemies.length == 0) {
				WORLDPOS++;
				GAMEFN.slideWorld(this.dir);
			}
		} else { //Otherwise, just move
			if (GAME.map.grid[this.y+y][this.x+x] == 0) {
				this.x += x;
				this.y += y;

				this.animation = 'walking';
				this.progress = 1;

				this.checkPickup();

				//If entering a room
				let type = GAME.map.arr[this.x][this.y].type;
				if (TILE[type].door) {

					if (ROOM_NUMBER == -1) { //You are outside
						GAME.map.rooms.forEach(function(e, i) {
							if (GAME.player.x == e.enterX && GAME.player.y == e.enterY) {
								ROOM_NUMBER = i;
								if (TILE[type].teleport != undefined) {
									GAME.player.x = TILE[type].teleport[0];
									GAME.player.y = TILE[type].teleport[1];
								}
							}
						});
					} else { //You are inside
						GAME.player.x = GAME.two.rooms[ROOM_NUMBER].enterX;
						GAME.player.y = GAME.two.rooms[ROOM_NUMBER].enterY+1;
						ROOM_NUMBER = -1; //Default
					}
					
					GAMEFN.slideWorld([0,0]);

					/*let nameFromDoor = extractBeforeUnderscore(type);
					if (nameFromDoor == 'exitdoor') nameFromDoor = '';
					ROOM = nameFromDoor;

					if (ROOM != '') { //You are walking into a room
						GAME.player.spawnx = GAME.player.x - GAME.player.dir[0];
						GAME.player.spawny = GAME.player.y - GAME.player.dir[1];
						if (TILE[type].teleport != undefined) {
							GAME.player.x = TILE[type].teleport[0];
							GAME.player.y = TILE[type].teleport[1];
						}
					} else { //You are walking out of a room
						GAME.player.x = GAME.player.spawnx;
						GAME.player.y = GAME.player.spawny;
					}
					GAME.player.rx = GAME.player.x;
					GAME.player.ry = GAME.player.y;

					GAMEFN.slideWorld([0,0]);

					function extractBeforeUnderscore(inputString) {
						const parts = inputString.split('_');
						if (parts.length > 1) {
							return parts[0];
						} else {
							return inputString;
						}
					}*/

				} else {
					enemysTurn();
				}
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

		SOUND.scythe.play();

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

		this.checkPickup();
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
			if (GAME.map.arr[lx][ly].type.includes('door')) {
				SOUND.door.play();
			} else if (TILESET.burrows.indexOf(GAME.map.arr[lx][ly].type) >= 0) {
				SOUND.open.play();
			} else {
				SOUND.chop.play();
			}

			//Add to inventory
			if (
				//Don't pick up a chest for infinite gold :|
				TILESET.loot.indexOf(GAME.map.arr[lx][ly].type) == -1 &&
				TILESET.burrows.indexOf(GAME.map.arr[lx][ly].type) == -1
			) {
				this.addItem(new Tile(GAME.map.arr[lx][ly].type), 1);
			}

			//Spawn coins if chest
			if (TILESET.loot.indexOf(GAME.map.arr[lx][ly].type) >= 0) {
				spawnFrom(TILESET.coins, lx, ly);
			}

			//Spawn collectables if burrow
			if (TILESET.burrows.indexOf(GAME.map.arr[lx][ly].type) >= 0) {
				GAME.map.arr[lx][ly] = new Tile(rand(TILESET.collectables));
			} else {
				//Change tile on map
				GAME.map.arr[lx][ly] = new Tile(TILE[GAME.map.arr[lx][ly].type].destroy);
			}
		}

		this.animation = 'mine';
		this.progress = 1;
		
		GAME.map.updateAndSetGrid();
	}
	place() {
		var lx = this.x+this.dir[0];
		var ly = this.y+this.dir[1];

		if (GAME.map.arr[lx][ly].type == 'ground' && this.inventory.length > 0) {
			SOUND.open.play();

			let t = this.inventory[this.slot].tile;
			GAME.map.arr[lx][ly] = new Tile(t.type);
			GAME.map.updateAndSetGrid();
			this.removeItem(t, 1);
		}

		if (GAME.map.name == 'setSpire') {
			GAME.map.checkForAlchemy();
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
			this.inventory.push({
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
				}

				if (this.slot < 0) this.slot = 0;
				if (this.slot > this.inventory.length-1) this.slot = this.inventory.length-1;

				return;
			}
		}
	}
	getHit(damage) {
		this.takeDamage(damage);

		this.x += GAME.player.dir[0];
		this.y += GAME.player.dir[1];

		//Looting hits!
		if (GAME.player.upgrades.indexOf('greedy_upgrade') >= 0) {
			if (Math.random() < CHANCE.greed.loot) {
				if (Math.random() < CHANCE.greed.heart) {
					//TODO Add health up spawn
				} else {
					spawnFrom(TILESET.coins, this.x, this.y, 1);
				}
			}
		}

		//Place grave
		if (this.name == 'player') return;
		if (this.hp <= 0) {
			spawnFrom(TILESET.coins, this.x, this.y); //They spawn coins! <3
		}
	}
	takeDamage(damage) {
		this.hp -= damage;

		if (!this.name.includes('atk')) {
			if (this.name == 'player' && this.hp > 0) {
				SOUND.damage.play();
			}
	
			if (this.name != 'player') {
				SOUND.attack.play();
			}
		}

		//Place graves
		if (this.hp <= 0) {
			if (this.name == 'player') {
				//SOUND TODO

				KEYBOARDLOCK = true;
				zapAtPoint(GAME.player.x, GAME.player.y, EXPLODE.boss, 500);
				GAME.map.arr[GAME.player.x][GAME.player.y] = new Tile('headstone');
				GAME.map.collect = [];
				GAME.map.enemies = [];
			} else {
				//Add grave
				if (ENTITY[this.name].destroy != undefined) GAME.map.arr[this.x][this.y] = new Tile(ENTITY[this.name].destroy);
				
				//Specific interactions for enemies
				if (this.name == 'blood_dude_atk') GAME.map.enemies.push(new Mover('blood_dude', this.x, this.y));
				if (this.name == 'water_dude_atk') GAME.map.enemies.push(new Mover('water_dude', this.x, this.y));

				if (this.name == 'gungenthor') {
					zapAtPoint(this.x, this.y, EXPLODE.boss, 100);
				}

				GAME.map.updateAndSetGrid();
			}
		}

		//Phase calculations
		if (this.name == 'gungenthor') {
			let phase = Math.round(Math.abs(this.hp/this.maxhp-1)*2);
			if (this.phase != phase) {
				let xvalues = [4, HEIGHT-4];
				let yvalues = [4, HEIGHT-4];
				let randomx = rand(xvalues);
				let randomy = rand(yvalues);
				//I don't care
				GAME.player.x = randomx;
				GAME.player.y = randomy;
				if (GAME.player.weapon == 'scythe') {
					GAME.scythe.x = randomx;
					GAME.scythe.y = randomy;
					GAME.scythe.rx = randomx;
					GAME.scythe.ry = randomy;
				}
			}
			if (this.phase != phase && phase != 2) {
				SOUND.boss.play();
			}
			this.phase = phase;

			if (this.phase == 2) {
				SOUND.ominous.play();

				NIGHTTIME = true;
			}
		}
	}
	attack() {
		var lx = this.x+this.dir[0];
		var ly = this.y+this.dir[1];

		let i = enemyOnThisTile(lx, ly);
		if (i >= 0) {
			GAME.map.enemies[i].getHit(this.power);
		}
	}
	checkPickup() {
		//Floor items
		for (let i = 0; i < GAME.map.collect.length; i++) {
			let c = GAME.map.collect[i];
			//Mover is in same position as a floor item
			if (this.x == c.x && this.y == c.y) {
				
				//Floor item is a coin
				if (TILESET.coins.indexOf(c.name) >= 0) {
					SOUND.coin.play();

					let valueOfCoin = c.name.charAt(c.name.length-1);
					this.money += parseInt(valueOfCoin);

					GAME.map.collect.splice(i, 1);
					i--;
				}

				//Floor is an upgrade (THE SHOP/DOMER)
				if (c.name.includes('upgrade')) {
					if (GAME.player.money > SHOP[c.name].cost) {
						SOUND.click.play();

						GAME.player.money -= SHOP[c.name].cost;

						GAME.player.upgrades.push(c.name);
						zapAtPoint(c.x, c.y, EXPLODE[c.name]);

						//Active upgrades
						if (c.name == 'power_upgrade') {
							GAME.player.power = 2; //Default power is 1
						}

						GAME.map.collect.splice(i, 1);
						i--;
					} else {
						SOUND.fail.play();
					}
				}

			}
		}

		//Scythe
		if (WORLDPOS != 0) {
			if (this.x == GAME.scythe.x && this.y == GAME.scythe.y) {
				SOUND.coin.play();

				if (!SCYTHE_GAME) SCYTHE_GAME = true;
				this.weapon = 'scythe';
			}
		}
	}
	adjustSlot(num) {
		SOUND.click.play();

		this.slot += num;
		if (this.slot < 0) this.slot = this.inventory.length-1;
		if (this.slot > this.inventory.length-1) this.slot = 0;

		GAME.inventory.dir = [num, 0];
		GAME.inventory.progress = 1;
	}
}

function zapAtPoint(x, y, props, speed) {
	SPEED = speed ? speed : DEFAULT_SPEED;
	GAME.map.explosion = props;
	GAME.map.explosion.x = x;
	GAME.map.explosion.y = y;
	GAME.map.zap = 1;
}

function spawnFrom(array, lx, ly, num) { //If num is undefined, choose a random number
	SOUND.open.play();

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
			enemyWalkTowardsPoint(i, GAME.map.enemies[i].x, GAME.map.enemies[i].y);
		},
		random: function(i) { //Walk towards a random point
			enemyWalkTowardsPoint(i, randInt(0,HEIGHT-1), randInt(0,HEIGHT-1));
		},
		player: function(i) { //Walk towards the player
			enemyWalkTowardsPoint(i, GAME.player.x, GAME.player.y);
		},
		retreat: function(i) { //Walk towards the player
			enemyWalkTowardsPoint(i, GAME.map.enemies[i].spawnx, GAME.map.enemies[i].spawny);
		},
		course: function(i) { //Move in direction
			let e = GAME.map.enemies[i];
			e.x += e.dir[0];
			e.y += e.dir[1];
		},
		random: function(i) { //Move randomly
			enemyWalkTowardsPoint(i, randInt(0,HEIGHT-1), randInt(0,HEIGHT-1));
		}
	}

	function enemyWalkTowardsPoint(i, x, y) {
		let e = GAME.map.enemies[i];

		if (e.x < 0) e.x = 0;
		if (e.y < 0) e.y = 0;
		if (e.x > HEIGHT-1) e.x = HEIGHT-1;
		if (e.y > HEIGHT-1) e.y = HEIGHT-1;

		if (x < 0) x = 0;
		if (y < 0) y = 0;
		if (x > HEIGHT-1) x = HEIGHT-1;
		if (y > HEIGHT-1) y = HEIGHT-1;

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
					//e.animation = 'walking';
					e.progress = 1;
					easystar.avoidAdditionalPoint(path[1].x, path[1].y);
				}
			}
		});
	}

	easystar.stopAvoidingAllAdditionalPoints();

	for (let i = 0; i < GAME.map.enemies.length; i++) {
		let e = GAME.map.enemies[i];
		let playerStandingOn = GAME.map.arr[GAME.player.x][GAME.player.y].type;
		let enemyWalkArr = ENTITY[e.name].walk;

		//Attacks
		switch (e.name) {
			case 'xrrow':
				if (TURN % 4 != 0) break;
					GAME.map.enemies.push(new Mover('xrrow_atk', e.x, e.y));
					GAME.map.enemies[GAME.map.enemies.length-1].dir = e.dir;
				break;
			case 'kong':
				if (TURN % 2 != 0) break;
					GAME.map.enemies.push(new Mover('kong_atk', e.x, e.y));
				break;
			case 'gungenthor':
				
				if (e.phase >= 0) { //tears
					if (TURN % 4 != 0) break;
					let tears = ['blood_tear_atk', 'water_tear_atk'];
					if (Math.random() < CHANCE.tear_to_enemy) tears = ['blood_dude_atk', 'water_dude_atk'];
					const pos = Math.random() < 0.5 ? -1 : 1;
					GAME.map.enemies.push(new Mover(rand(tears), e.x+pos, e.y));
				}

				if (e.phase >= 1) { //hands, feet
					if (TURN % 6 != 0) break;
					const side = ['left', 'right'];
					const parts = ['hand', 'foot'];
					let final = rand(side)+'_'+rand(parts)+'_atk_';

					let x, y, dir;
					if (Math.random() < 0) {
						// Randomly choose between top and bottom
						x = GAME.player.x;
						if (Math.random() < 0.5) {
							y = 0;
							dir = [0,1];
						} else {
							y = HEIGHT;
							dir = [0,-1];
						}
					} else {
						// Randomly choose between left and right
						if (Math.random() < 1) {
							x = 0;
							dir = [1,0];
						} else {
							x = HEIGHT;
							dir = [-1,0];
						}
						y = GAME.player.y;
					}

					for (let n=0;n<=1;n++) {
						for (let m=0;m<=1;m++) {
							GAME.map.enemies.push(new Mover(final+n+m, x+n, y+m));
							GAME.map.enemies[GAME.map.enemies.length-1].dir = dir;
						}
					}
				}

				break;
			default:
				//Nothing
		}

		//Projectile decay
		if (e.name.includes('atk')) {
			e.takeDamage(1);
		}

		//Movement
		if (e.name == 'gungenthor') {
			if (TURN % 4 == 0) {
				SOUND.bossmove.play();
			} else {
				continue;
			}
		}

		if (TILESET.river.indexOf(playerStandingOn) >= 0) {
			walkFunctions[enemyWalkArr[0]](i);
		} else if (playerStandingOn == 'ground') {
			walkFunctions[enemyWalkArr[1]](i);
		} else {
			walkFunctions[enemyWalkArr[2]](i);
		}
	}

	easystar.calculate();
	GAME.map.deleteDeadEnemies();
}