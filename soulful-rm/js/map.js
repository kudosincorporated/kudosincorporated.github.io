class Map {
	constructor(name) {
		this.name = name ? name : '';
		this.arr = [];
			//Populate array
			this.clear();
		this.rooms = [];
		this.grid = [];
		this.enemies = [];
		this.collect = [];

		this.pos = [0,0];
		this.dir = [0,1];
		this.progress = 0;

		//Explosion animation!
		this.zap = 0;
		this.explosion = {
			x: MIDDLE,
			y: MIDDLE,
			color: '#ff5050',
			size: 0.25,
			weight: 0.25,
		};

		this.enterX = MIDDLE;
		this.enterY = MIDDLE;
	}
	update(dt) {
		//Animation
		this.progress = linear(this.progress, 0, dt/SPEED*0.05);

		this.zap = linear(this.zap, 0, dt/SPEED*0.05); //Should be same as player's (for the hurt animation)!
	}
	updateAndSetGrid() {
		this.grid = [];
		for (let a = 0; a < HEIGHT; a++) {
			this.grid.push([]);
			for (let b = 0; b < HEIGHT; b++) {
				if (TILE[this.arr[b][a].type].block) { //Swapped a and b here because ?
					this.grid[a][b] = 1;
				} else {
					this.grid[a][b] = 0;
				}
			}
		}

		//EASYSTAR
		easystar.setGrid(this.grid);
		easystar.setAcceptableTiles([0]);
		easystar.enableSync();
		easystar.setIterationsPerCalculation(1000);
	}
	checkCollisions() { //This is run every frame!
		let p = GAME.player;

		this.enemies.forEach(function(e) {
			if (e.x == p.x && e.y == p.y) {
				e.getHit(p.power);
				e.getHit(0); //Knockback
				p.takeDamage(1);
				p.animation = 'hurt';
				p.progress = 1;
			}
		});
	}
	deleteDeadEnemies() {
		for (let i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i].hp <= 0) {
				if (this.enemies[i].name == 'gungenthor') {
					NIGHTTIME = false;
					GAME.map.enemies = [];
				}
				this.enemies.splice(i, 1);
				i--;
			}
		}
	}
	checkForAlchemy() {
		//Summoning a health up
		let summoningPositionX = 9;
		let summoningPositionY = 7;

		let ingredients = [];
		for (let a = summoningPositionX; a < summoningPositionX+3; a++) {
			for (let b = summoningPositionY; b < summoningPositionY+3; b++) {
				let t = this.arr[a][b].type;
				if (t != 'ground') {
					ingredients.push(t);
				}
			}
		}

		let total = TILESET.collectables.slice(0);
		
		for (let i = 0; i < ingredients.length; i++) {
			let ind = total.indexOf(ingredients[i]);
			total.splice(ind, 1);
		}

		if (total.length == 0) {
			for (let a = summoningPositionX; a < summoningPositionX+3; a++) {
				for (let b = summoningPositionY; b < summoningPositionY+3; b++) {
					this.arr[a][b] = new Tile('ground');
					this.collect.push(new Mover('heart_up', summoningPositionX+5, summoningPositionY+1));
					zapAtPoint(summoningPositionX+5, summoningPositionY+1, EXPLODE.spark);
				}
			}
		}

		//Exchanging an item
		let exchangePositionX = 9;
		let exchangePositionY = 13;

		let exchangeT = this.arr[exchangePositionX][exchangePositionY].type;
		if (exchangeT != 'ground') {
			this.arr[exchangePositionX][exchangePositionY] = new Tile('ground');
			if (Math.random() > CHANCE.alchemy.exchangeFail) {
				let collects = TILESET.collectables.slice(0);
				for (let i = 0; i < collects.length; i++) {
					if (exchangeT == collects[i]) {
						collects.splice(i, 1);
						break;
					}
				}
				this.arr[exchangePositionX][exchangePositionY+2] = new Tile( rand(collects) );
				zapAtPoint(exchangePositionX, exchangePositionY+2, EXPLODE.spark);
			} else {
				zapAtPoint(exchangePositionX, exchangePositionY+2, EXPLODE.fail);
			}
		}

		//Duplicating an item
		let duplicatePositionX = 15;
		let duplicatePositionY = 13;

		let duplicateT = this.arr[duplicatePositionX][duplicatePositionY].type;
		if (duplicateT != 'ground') {
			this.arr[duplicatePositionX][duplicatePositionY] = new Tile('ground');
			if (Math.random() > CHANCE.alchemy.duplicateFail) {
				this.arr[duplicatePositionX-1][duplicatePositionY+2] = new Tile( duplicateT );
				this.arr[duplicatePositionX+1][duplicatePositionY+2] = new Tile( duplicateT );
				zapAtPoint(duplicatePositionX, duplicatePositionY+2, EXPLODE.spark);
			} else {
				zapAtPoint(duplicatePositionX, duplicatePositionY+2, EXPLODE.fail);
			}
		}
	}
	renderDetails(ctx) {
		switch (this.name) {
			case 'setDomer':
				drawDetail(ctx, MIDDLE-6, MIDDLE-1, 'bazzar');
				drawDetail(ctx, MIDDLE-5, MIDDLE-5, 'carpet');
				drawDetail(ctx, MIDDLE-1, MIDDLE-6, 'bazzar');
				drawDetail(ctx, MIDDLE+3, MIDDLE-5, 'carpet');
				drawDetail(ctx, MIDDLE+4, MIDDLE-1, 'bazzar');

				if (GAME.player.upgrades.indexOf('greedy_upgrade') == -1) {
					drawDetail(ctx, MIDDLE-13, MIDDLE, 'coin_4');
					drawNumber(ctx, SHOP['greedy_upgrade'].cost, (MIDDLE-12)*SIZE, (MIDDLE)*SIZE);
					drawDetail(ctx, MIDDLE-13, MIDDLE-2, 'upgradetext');
					drawDetail(ctx, MIDDLE-13, MIDDLE-1, 'explaingreedy');
				}

				if (GAME.player.upgrades.indexOf('power_upgrade') == -1) {
					drawDetail(ctx, MIDDLE-2, MIDDLE-9, 'coin_4');
					drawNumber(ctx, SHOP['power_upgrade'].cost, (MIDDLE-1)*SIZE, (MIDDLE-9)*SIZE);
					drawDetail(ctx, MIDDLE-2, MIDDLE-11, 'upgradetext');
					drawDetail(ctx, MIDDLE-2, MIDDLE-10, 'explainpower');
				}

				if (GAME.player.upgrades.indexOf('explode_upgrade') == -1) {
					drawDetail(ctx, MIDDLE+9, MIDDLE, 'coin_4');
					drawNumber(ctx, SHOP['explode_upgrade'].cost, (MIDDLE+10)*SIZE, (MIDDLE)*SIZE);
					drawDetail(ctx, MIDDLE+9, MIDDLE-2, 'upgradetext');
					drawDetail(ctx, MIDDLE+9, MIDDLE-1, 'explainexplode');
				}
				
				break;
			case 'setSpire':
				for (let a = 0; a < 3; a++) {
					for (let b = 0; b < 3; b++) {
						if (a == 0 && b == 0) continue;
						drawDetail(ctx, MIDDLE-3+a, MIDDLE-5+b, 'circle');
					}
				}
				drawDetail(ctx, MIDDLE, MIDDLE-5, 'summoning');

				drawDetail(ctx, MIDDLE-3, MIDDLE, 'arrow');
				drawDetail(ctx, MIDDLE-3, MIDDLE+1, 'box');
				drawDetail(ctx, MIDDLE-4, MIDDLE+2, 'transmute');
				
				drawDetail(ctx, MIDDLE+3, MIDDLE, 'arrow');
				drawDetail(ctx, MIDDLE+3, MIDDLE+1, 'box');
				drawDetail(ctx, MIDDLE+1, MIDDLE+2, 'blackjack');

				drawDetail(ctx, MIDDLE-2, MIDDLE-11, 'howtosummon');
				drawDetail(ctx, MIDDLE-9, MIDDLE+1, 'howtomagic');
				drawDetail(ctx, MIDDLE+9, MIDDLE+1, 'howtogamble');
				break;
			default:
				//
		}

		function drawDetail(ctx, dx, dy, name) {
			let w = ENTITY[name].w ? ENTITY[name].w : 1;
			let h = ENTITY[name].h ? ENTITY[name].h : 1;
			ctx.drawImage(
				spritesheet,
				ENTITY[name].sx*RATIO,
				ENTITY[name].sy*RATIO,
				w*RATIO,
				h*RATIO,
				dx*SIZE,
				dy*SIZE,
				w*SIZE,
				h*SIZE,
			);
		}
	}
	renderZap(ctx) {
		//Don't do anything if zap is zero
		if (this.zap == 0) return;

		let x = this.explosion.x ? this.explosion.x : MIDDLE;
		let y = this.explosion.y ? this.explosion.y : MIDDLE;
		let size = this.explosion.size;
		let weight = this.explosion.weight;

		//Otherwise, zap (draw an explosion)!
		for (let a = 0; a < HEIGHT; a++) {
			for (let b = 0; b < HEIGHT; b++) {
				let color = getColor(this.explosion.color);

				let d = calculateDistance(a, b, x, y);
				let p = Math.abs(this.zap-1);
				if (
					d > p*HEIGHT*size - weight &&
					d < p*HEIGHT*size + weight
				) {
					ctx.fillStyle = color;
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
	render(ctx) {
		let canv = HEIGHT*SIZE;
		let horz = this.pos[0]*canv - this.dir[0]*canv*this.progress;
		let vert = this.pos[1]*canv - this.dir[1]*canv*this.progress;

		ctx.translate(horz, vert);

		//Tiles
		for (let a = 0; a < HEIGHT; a++) {
			for (let b = 0; b < HEIGHT; b++) {
				this.arr[a][b].render(ctx, a, b);
			}
		}

		//Details
		this.renderDetails(ctx);

		//Collect
		this.collect.forEach((c) => c.render(ctx));

		//Enemies
		this.enemies.forEach((e) => e.render(ctx));

		//Enemies HP
		this.enemies.forEach((e) => e.renderHealth(ctx));

		if (WORLDPOS < 25 && this.name == '') GAME.river_door.render(ctx);

		//Zap!
		this.renderZap(ctx);

		ctx.translate(-horz, -vert);
	}

	////////////////////////////////
	//                            //
	//         Generation         //
	//                            //
	////////////////////////////////

	clear() {
		this.arr = [];
		this.enemies = [];
		for (let a = 0; a < HEIGHT; a++) {
			this.arr.push([]);
			for (let b = 0; b < HEIGHT; b++) {
				this.arr[a][b] = new Tile('ground');
			}
		}
	}
	fillWorld() {
		//Decide what to put here!

		//Set
		if (WORLDPOS == 13) {
			this.setOcean();
		} else if (WORLDPOS >= 14 && WORLDPOS <= 22) {
			this.setTundra();
		} else {
			this.setForest();
		}

		//Before river
		if (WORLDPOS == 12) this.addBeach();
		if (WORLDPOS == 14) this.addShore();

		//River
		this.addRiver(true);

		//Add
		if (WORLDPOS == 0 || WORLDPOS == 25) this.addWaterfall();
		if (WORLDPOS == 1) this.addScary();
		if (WORLDPOS == 11) this.addClearing();
		if (WORLDPOS == 23) this.addTundra(); //half n half
		if (WORLDPOS == 24) { //final boss
			this.enemies = [];
			this.enemies.push(new Mover('gungenthor', MIDDLE, MIDDLE+6));
		}

		/*this.putTower(0, 9);
		this.putDomer(5, 9);
		this.putSpire(8, 8);
		this.putCave(11, 10);
		this.putSmall(14, 11);
		this.putStump(17, 11);*/

		//Rooms!
		/*if (ROOM != '') { //You're in a room!
			this.clear();
			switch (ROOM) {
				case 'tower':
					this.setTower();
					NIGHTTIME = true;
					break;
				case 'domer':
					this.setDomer();
					break;
				case 'spire':
					this.setSpire();
					break;
				case 'cave':
					this.setCave();
					NIGHTTIME = true;
					break;
				case 'small':
					this.setSmall();
					NIGHTTIME = true;
					break;
				case 'stump':
					this.setStump();
					NIGHTTIME = true;
					break;
				default:
					//
			}
		}*/

		//Update grid!
		this.updateAndSetGrid();
	}
	setOcean() {
		for (let a = 0; a < HEIGHT; a++) {
			for (let b = 0; b < HEIGHT; b++) {
				if (Math.random() < 0.025) {
					this.arr[a][b] = new Tile('ocean_anim');
				} else {
					this.arr[a][b] = new Tile(rand(TILESET.ocean));
				}
			}
		}
	}
	setForest() {
		for (let a = 0; a < HEIGHT; a++) {
			for (let b = 0; b < HEIGHT; b++) {
				let t = noiseAtPoint(a, b, PERLIN);
				let v = circlePoint(a, b, HEIGHT);
				let tv = t*v;

				let chosen = 'ground';

				//The map is generated from the inside out
				if (tv < 0.1) { //middle
					chosen = 'ground';
				} else if (tv < 0.3) { //inner
					if (t > 0.5) {
						chosen = rand(TILESET.trees);
					} else if (t > 0.4) {
						chosen = rand(TILESET.dense);

						//Try to spawn a burrow
						if (Math.random() < CHANCE.spawn.burrow) {
							chosen = rand(TILESET.burrows);
						}

						//Write over the burrow if loot spawns
						if (Math.random() < CHANCE.spawn.loot) {
							chosen = rand(TILESET.loot);
						}

						//Add a forageable over the tile
						if (Math.random() < CHANCE.spawn.forage) {
							chosen = rand(TILESET.collectables);
						}

						//Enemy
						if (Math.random() < CHANCE.spawn.enemy) {
							let enemy = rand(TILESET.enemy_forest_dense);
							this.enemies.push(new Mover(enemy, a, b));
						}

					} else {
						chosen = rand(TILESET.light);

						//Enemy
						if (Math.random() < CHANCE.spawn.enemy) {
							let enemy = rand(TILESET.enemy_forest_dense);
							this.enemies.push(new Mover(enemy, a, b));
						}
					}
				} else { //outer (rest)
					if (t > 0.5) {
						chosen = rand(TILESET.trees);
					} else {
						if (t > 0.45) {
							chosen = rand(TILESET.rocks);
						} else {
							chosen = rand(TILESET.cliff);
						}
					}
				}

				/*if (a >= 0 && a < TILESET.collectables.length && b == 3) {
					chosen = TILESET.collectables[a];
				}*/

				this.arr[a][b] = new Tile(chosen);
			}
		}

		/*let m = Math.round(HEIGHT/2) - 3;
		this.enemies.push(new Mover('creepa', m-3, m));
		this.enemies.push(new Mover('odango', m-2, m));
		this.enemies.push(new Mover('moonman', m-1, m));
		this.enemies.push(new Mover('pointa', m, m));
		this.enemies.push(new Mover('xapmat',  m+1, m));
		this.enemies.push(new Mover('modnoc', m+2, m));
		this.enemies.push(new Mover('mozzie', m+3, m));
		this.enemies.push(new Mover('dingo', m+4, m));*/
	}
	setTundra() {
		for (let a = 0; a < HEIGHT; a++) {
			for (let b = 0; b < HEIGHT; b++) {
				let t = noiseAtPoint(a, b, PERLIN);
				let v = circlePoint(a, b, HEIGHT);
				let tv = t*v;
				let chosen = 'ground';
				if (tv < 0.1) {
					chosen = 'ground';
				} else if (tv < 0.3) {
					if (t > 0.5) {
						chosen = rand(TILESET.talltrees);
					} else if (t > 0.4) {
						chosen = rand(TILESET.falldense);

						//Try to spawn a burrow
						if (Math.random() < CHANCE.spawn.burrow) {
							chosen = rand(TILESET.burrows);
						}

						//Add a forageable over the tile
						if (Math.random() < CHANCE.spawn.forage) {
							chosen = rand(TILESET.collectables);
						}

						//Enemy
						if (Math.random() < CHANCE.spawn.enemy) {
							let enemy = rand(TILESET.enemy_tundra_dense);
							this.enemies.push(new Mover(enemy, a, b));
						}

					} else {
						chosen = rand(TILESET.falllight);

						//Write over the burrow if loot spawns
						if (Math.random() < CHANCE.spawn.loot) {
							chosen = rand(TILESET.loot);
						}

						//Enemy
						if (Math.random() < CHANCE.spawn.enemy) {
							let enemy = rand(TILESET.enemy_tundra_light);
							this.enemies.push(new Mover(enemy, a, b));
						}

					}
				} else {
					if (t > 0.5) {
						chosen = rand(TILESET.talltrees);
					} else {
						if (t > 0.45) {
							chosen = rand(TILESET.bigrocks);
						} else {
							chosen = rand(TILESET.boulder);
						}
					}
				}
				this.arr[a][b] = new Tile(chosen);
			}
		}
	}
	setTower() {
		for (var x = 0; x < HEIGHT; x++) {
			for (var y = 0; y < HEIGHT; y++) {
				let e = noiseAtPoint(x, y, PERLIN);
				let t = circlePoint(x, y, HEIGHT);
				let et_t = e*t;

				if (et_t > 0.3 && t < 0.7) {
					if (Math.random() < 0.75) {
						this.arr[x][y] = new Tile(rand(TILESET.weeds));
					} else {
						this.arr[x][y] = new Tile('ground');
					}
				} else if (t < 0.5 && t > 0.32) {
					this.arr[x][y] = new Tile('river');
				} else if (t < 0.7) {
					this.arr[x][y] = new Tile('ground');
				}
				
				if (t < 0.45 && t > 0.4 && y != 5) {
					this.arr[x][y] = new Tile('towerwall');
				}
			}
		}
		
		for (let a = 0; a < 3; a++) {
			var rms = 6;
			for (let b = 0; b < HEIGHT; b++) {
				let t = circlePoint(b, (a*rms)+rms, HEIGHT);
				if (t < 0.7 && t > 0.45) {
					if (t < 0.6 && t > 0.55) {
						this.arr[b][(a*rms)+rms] = new Tile('door');
					} else {
						this.arr[b][(a*rms)+rms] = new Tile('wall_vert');
					}
				}
			}
		}

		for (let a = 0; a < 2; a++) {
			var rmn = 8;
			for (let b=0; b < HEIGHT; b++) {
				let t = circlePoint((a*rmn)+rmn, b, HEIGHT);
				if (t < 0.7 && t > 0.45) {
					if (t < 0.6 && t > 0.55) {
						this.arr[(a*rmn)+rmn][b] = new Tile('door');
					} else {
						this.arr[(a*rmn)+rmn][b] = new Tile('wall_horz');
					}
				}
			}
		}

		for (let i = 0; i < HEIGHT; i++) {
			var hex = Math.abs(i-Math.floor((HEIGHT-1)/2));
			if (hex < 2) hex = 2;
			if (i > 3 && i < HEIGHT-4) this.arr[i][1] = new Tile('towerwall');
			if (i > 1 && i < HEIGHT-1) this.arr[Math.floor(hex/2)-1][i] = new Tile('towerwall');
			if (i > 3 && i < HEIGHT-4) this.arr[i][HEIGHT-1-1] = new Tile('towerwall');
			if (i > 1 && i < HEIGHT-1) this.arr[HEIGHT-1-Math.floor(hex/2)+1][i] = new Tile('towerwall');
		}

		for (let a = 0; a < 7; a++) {
			for (let b = 0; b < 7; b++) {
				if (Math.random() < 0.5) {
					this.arr[Math.round(HEIGHT/2)-4+a][Math.round(HEIGHT/2)-4+b] = new Tile(rand(TILESET.rocks));
				}
			}
		}

		this.arr[MIDDLE][HEIGHT-2] = new Tile( 'exitdoor' );
	}
	setDomer() {
		for (let i=0; i < HEIGHT; i++) {
			var hex = Math.abs(i-Math.floor((HEIGHT-1)/2));
			if (hex < 2) hex = 2;
			if (i > 6 && i < HEIGHT-7) this.arr[i][5] = new Tile( 'domerwall' );
			if (i > 4 && i < HEIGHT-6) this.arr[Math.floor(hex/2)+4][i] = new Tile( 'domerwall' );
			if (i > 6 && i < HEIGHT-7) this.arr[i][HEIGHT-1-5] = new Tile( 'domerwall' );
			if (i > 4 && i < HEIGHT-6) this.arr[HEIGHT-1-Math.floor(hex/2)-4][i] = new Tile( 'domerwall' );

			if (i > 6 && i < HEIGHT-7 && i % 2 == 0 && i != 12) this.arr[i][6] = new Tile( rand(TILESET.domer) );
			if (i > 6 && i < HEIGHT-7 && i % 2 == 0 && i != 12) this.arr[i][HEIGHT-1-6] = new Tile( rand(TILESET.domer) );
		}

		this.arr[hex][19] = new Tile( 'exitdoor' );

		if (GAME.player.upgrades.indexOf('greedy_upgrade') == -1) this.collect.push(new Mover('greedy_upgrade', MIDDLE-5, MIDDLE));
		if (GAME.player.upgrades.indexOf('power_upgrade') == -1) this.collect.push(new Mover('power_upgrade', MIDDLE, MIDDLE-5));
		if (GAME.player.upgrades.indexOf('explode_upgrade') == -1) this.collect.push(new Mover('explode_upgrade', MIDDLE+5, MIDDLE));
	}
	setSpire() {
		for (let i = 0; i < HEIGHT; i++) {
			var hex = Math.abs(i-Math.floor((HEIGHT-1)/2));
			if (hex < 2) hex = 2;
			if (i > 6 && i < HEIGHT-7) this.arr[i][5] = new Tile( 'spirewall' );
			if (i > 4 && i < HEIGHT-6) this.arr[Math.floor(hex/2)+4][i] = new Tile( 'spirewall' );
			if (i > 6 && i < HEIGHT-7) this.arr[i][HEIGHT-1-5] = new Tile( 'spirewall' );
			if (i > 4 && i < HEIGHT-6) this.arr[HEIGHT-1-Math.floor(hex/2)-4][i] = new Tile( 'spirewall' );

			if (i > 4 && i < HEIGHT-6 && i % 3 == 0 && i != 12) this.arr[Math.floor(hex/2)+5][i] = new Tile( rand(TILESET.spire) );
			if (i > 4 && i < HEIGHT-6 && i % 3 == 0 && i != 12) this.arr[HEIGHT-1-Math.floor(hex/2)-5][i] = new Tile( rand(TILESET.spire) );
		}

		this.arr[MIDDLE][19] = new Tile( 'exitdoor' );
	}
	setCave() {
		for (var x = 0; x < HEIGHT; x++) {
			for (var y = 0; y < HEIGHT; y++) {
				let e = noiseAtPoint(x, y, PERLIN);
				let t = circlePoint(x, y, HEIGHT);
				let et_t = e*t;

				if (et_t < 0.1) {
					this.arr[x][y] = new Tile('river');
				} else if (et_t < 0.2+Math.random()/20) {
					if (Math.random() < 0.3) {
						this.arr[x][y] = new Tile(rand(TILESET.cave));
					} else {
						this.arr[x][y] = new Tile('ground');
					}
				} else {
					this.arr[x][y] = new Tile(rand(TILESET.cliff));
				}
			}
		}

		for (let i=0; i < HEIGHT; i++) {
			this.arr[i][0] = new Tile(rand(TILESET.cliff));
			this.arr[0][i] = new Tile(rand(TILESET.cliff));
			this.arr[i][HEIGHT-1] = new Tile(rand(TILESET.cliff));
			this.arr[HEIGHT-1][i] = new Tile(rand(TILESET.cliff));
		}

		for (let i=Math.floor(HEIGHT/2); i < HEIGHT-2; i++) {
			this.arr[Math.floor(HEIGHT/2)][i] = new Tile('river');
		}

		this.arr[MIDDLE][HEIGHT-2] = new Tile( 'exitdoor' );
	}
	setSmall() {
		for (let i=0; i < HEIGHT; i++) {
			var hex = Math.abs(i-Math.floor((HEIGHT-1)/2));
			if (hex < 2) hex = 2;
			if (i > 6 && i < HEIGHT-7) this.arr[i][5] = new Tile( 'towerwall' );
			if (i > 4 && i < HEIGHT-6) this.arr[Math.floor(hex/2)+4][i] = new Tile( 'towerwall' );
			if (i > 6 && i < HEIGHT-7) this.arr[i][HEIGHT-1-5] = new Tile( 'towerwall' );
			if (i > 4 && i < HEIGHT-6) this.arr[HEIGHT-1-Math.floor(hex/2)-4][i] = new Tile( 'towerwall' );
		}

		for (var x = 0; x < HEIGHT; x++) {
			for (var y = 0; y < HEIGHT; y++) {
				let e = noiseAtPoint(x, y, PERLIN);
				let t = circlePoint(x, y, HEIGHT);

				if (t > 0.17 && t < 0.4 && e > 0.5) {
					this.arr[x][y] = new Tile(rand(TILESET.weeds));
				}

				if (t < 0.22 && t > 0.12) {
					if (t > 0.17) {
						this.arr[x][y] = new Tile( 'towerwall' );
					} else {
						this.arr[x][y] = new Tile( 'river' );
					}
				}

			}
		}

		this.arr[15][12] = new Tile( 'door' );
		this.arr[9][12] = new Tile( 'door' );
		this.arr[12][9] = new Tile( 'door_open' );
		this.arr[12][15] = new Tile( 'door' );

		this.arr[MIDDLE][19] = new Tile( 'exitdoor' );
	}
	setStump() {
		for (var x = 0; x < HEIGHT; x++) {
			for (var y = 0; y < HEIGHT; y++) {
				let e = noiseAtPoint(x, y, PERLIN);
				let t = circlePoint(x, y, HEIGHT);
				var et_t = e*t;

				var jag = 0.15+Math.random()/20;

				if (et_t < jag) {
					if (e < 0.3) {
						this.arr[x][y] = new Tile( 'river' );
					} else if (e < 0.4) {
						this.arr[x][y] = new Tile( rand(TILESET.leaves) );
					} else if (e < 0.5) {
						this.arr[x][y] = new Tile( rand(TILESET.weeds) );
					} else {
						this.arr[x][y] = new Tile( 'ground' );
					}
				} else if (et_t < jag+0.1) {
					this.arr[x][y] = new Tile( rand(TILESET.treewall) );
				} else {
					this.arr[x][y] = new Tile( 'ground' );
				}
			}
		}

		this.arr[MIDDLE][MIDDLE+2] = new Tile( rand(TILESET.treewall) );
		this.arr[MIDDLE-1][MIDDLE+1] = new Tile( rand(TILESET.treewall) );
		this.arr[MIDDLE][MIDDLE+1] = new Tile( 'exitdoor' );
		this.arr[MIDDLE+1][MIDDLE+1] = new Tile( rand(TILESET.treewall) );
	}
	addTundra() {
		let x = 0;
		let y = 0;
		while (x < HEIGHT) {
			let t = noiseAtPoint(x, y, PERLIN);
				t = Math.round(t*HEIGHT);

			while (t >= 0) {
				let type = this.arr[x][y+t].type;

				if (TILESET.trees.indexOf(type) >= 0) {
					this.arr[x][y+t] = new Tile(rand(TILESET.talltrees));
				} else if (TILESET.rocks.indexOf(type) >= 0) {
					this.arr[x][y+t] = new Tile(rand(TILESET.bigrocks));
				} else if (TILESET.cliff.indexOf(type) >= 0) {
					this.arr[x][y+t] = new Tile(rand(TILESET.boulder));
				} else if (TILESET.dense.indexOf(type) >= 0) {
					this.arr[x][y+t] = new Tile(rand(TILESET.falldense));
				}

				t--;
			}

			x++;
		}
	}
	addRiver() {
		let ry = 0;
		let rx = RIVER_DOOR;
		while (ry < HEIGHT) {
			this.arr[rx][ry] = new Tile('river');
			this.arr[rx-1][ry] = new Tile('river');
			this.arr[rx+1][ry] = new Tile('river');

			let r = Math.random();
			if (r < 0.25) {
				r = r*10;
				if (r < 0.33) {
					this.arr[rx][ry] = new Tile('river_anim');
				} else if (r < 0.66) {
					this.arr[rx-1][ry] = new Tile('river_anim');
				} else {
					this.arr[rx+1][ry] = new Tile('river_anim');
				}
			}

			let t = noiseAtPoint(rx, ry, PERLIN);
			let change = Math.round(t*333) % 3 - 1;
			rx += change;
			if (rx < 5) rx = 5;
			if (rx > HEIGHT-6) rx = HEIGHT-6;

			//Enemy (rixen)
			if (Math.random() < CHANCE.spawn.enemy) {
				let enemy = rand(TILESET.enemy_river);
				this.enemies.push(new Mover(enemy, rx, ry));
			}
			
			ry++;
		}
		RIVER_DOOR = rx;
		GAME.river_door.x = RIVER_DOOR;
	}
	addWaterfall() {
		this.enemies = [];
		var rx = 0;
		var ry = Math.round(HEIGHT/4);
		while (rx < HEIGHT) {
			let t = noiseAtPoint(rx, ry, PERLIN);
			let change = Math.round(t*222) % 2 - 1;

			let tileType = this.arr[rx][ry].type.substr(0,5);

			if (tileType == 'river') {
				for (let i = 1; i < 4; i++) {
					this.arr[rx][ry+i+change] = new Tile('waterfall');
				}
				this.arr[rx][ry+4+change] = new Tile('w_fall_end');
				this.arr[rx][ry+5+change] = new Tile('river_anim');
			} else {
				for (let i = 0; i < 5; i++) {
					this.arr[rx][ry+i+change] = new Tile(rand(TILESET.cliff));
				}
			}

			rx++;
		}
	}
	addBeach() {
		this.enemies = [];
		let rx = 0;
		while (rx < HEIGHT) {
			let ry = Math.round(HEIGHT/2);
			let t = noiseAtPoint(rx, ry, PERLIN);
			let change = Math.round(t*5);
				ry -= 3;
				ry += change;
			let step = 0;

			while (ry < HEIGHT) {
				if (step <= 0) {
					this.arr[rx][ry] = new Tile(rand(TILESET.rocks));
				} else if (step <= 2) {
					this.arr[rx][ry] = new Tile(rand(TILESET.bigrocks));
				} else if (step <= 3) {
					if (Math.random() < 0.5) {
						this.arr[rx][ry] = new Tile('o_shore');
					} else {
						this.arr[rx][ry] = new Tile(rand(TILESET.ocean));
					}
				} else {
					this.arr[rx][ry] = new Tile(rand(TILESET.ocean));
				}

				step++;
				ry++;
			}

			rx++;
		}
	}
	addShore() {
		this.enemies = [];
		let rx = 0;
		while (rx < HEIGHT) {
			let ry = Math.round(HEIGHT/2);
			let t = noiseAtPoint(rx, ry, PERLIN);
			let change = Math.round(t*5);
				ry -= 3;
				ry += change;
			let step = 0;

			while (ry >= 0) {
				if (step <= 3) {
					this.arr[rx][ry] = new Tile(rand(TILESET.sand));
				} else if (step <= 4) {
					this.arr[rx][ry] = new Tile(rand(TILESET.boulder));
				} else if (step <= 5) {
					if (Math.random() < 0.5) {
						this.arr[rx][ry] = new Tile('o_shore');
					} else {
						this.arr[rx][ry] = new Tile(rand(TILESET.ocean));
					}
				} else {
					this.arr[rx][ry] = new Tile(rand(TILESET.ocean));
				}

				step++;
				ry--;
			}

			rx++;
		}
	}
	addScary() {
		this.enemies = [];
		for (let x = 0; x < HEIGHT; x++) {
			for (let y = 0; y < HEIGHT; y++) {
				let et = noiseAtPoint(x, y, PERLIN);
				var t = circlePoint(x, y, HEIGHT);
				var et_t = et*t;
				var et_t_t = et*(Math.pow(t, 5));

				if (et_t_t < 0.075/10) {
					this.arr[x][y] = new Tile('ground');
					if (et < 0.4) {
						if (Math.random() > 0.5) {
							this.arr[x][y] = new Tile(rand(TILESET.bones));
						}
					}
				} else if (et_t_t < 0.1/10) {
					this.arr[x][y] = new Tile('pebbles');
				} else if (et_t_t < 0.15/10) {
					this.arr[x][y] = new Tile(rand(TILESET.light));
				} else if (et_t_t < 0.2/10) {
					this.arr[x][y] = new Tile(rand(TILESET.rocks));
				} else if (et_t_t < 0.25/10) {
					this.arr[x][y] = new Tile(rand(TILESET.dense));
				} else if (et_t_t < 0.3/10) {
					this.arr[x][y] = new Tile(rand(TILESET.cliff));
				}
			}
		}

		var a = Math.floor(HEIGHT/2);
		var b = Math.floor(HEIGHT/2);

		this.arr[a+6][b] = new Tile('rock_4');
		this.arr[a-6][b] = new Tile('rock_4');
	}
	addClearing() {
		this.enemies = [];
		for (let x = 0; x < HEIGHT; x++) {
			for (let y = 0; y < HEIGHT; y++) {
				let et = noiseAtPoint(x, y, PERLIN);
				var t = circlePoint(x, y, HEIGHT);
				var et_t = et*t;

				if (t < 0.5) {
					this.arr[x][y] = new Tile('ground');
					if (Math.random() < 0.1) {
						this.arr[x][y] = new Tile(rand(TILESET.clearing));
					}
				} else if (t < 0.6) {
					this.arr[x][y] = new Tile(rand(TILESET.dense));
				} else if (t < 0.633) {
					this.arr[x][y] = new Tile(rand(TILESET.rocks));
				} else if (t < 0.666) {
					this.arr[x][y] = new Tile('river');
				} else if (t < 0.7) {
					this.arr[x][y] = new Tile(rand(TILESET.cliff));
				}
			}
		}

		this.enemies.push(new Mover('kong', MIDDLE-6, MIDDLE));
		this.enemies.push(new Mover('gyn', MIDDLE, MIDDLE+6));
		this.enemies.push(new Mover('xrrow', MIDDLE+6, MIDDLE));
	}
	putTower(x, y) {
		for (let a = 0; a < 5; a++) { //width
			for (let b = 0; b < 4; b++) { //height
				this.arr[x+a][y+b] = new Tile('tower_'+a+b);
			}
		}
		this.createRoom(x+2, y+3, 'setTower');
	}
	putDomer(x, y) {
		for (let a = 0; a < 3; a++) { //width
			for (let b = 0; b < 4; b++) { //height
				this.arr[x+a][y+b] = new Tile('domer_'+a+b);
			}
		}
		this.createRoom(x+1, y+3, 'setDomer');
	}
	putSpire(x, y) {
		for (let a = 0; a < 3; a++) { //width
			for (let b = 0; b < 5; b++) { //height
				let str = a.toString()+b.toString();
				if (str == '00' || str == '20') continue;
				this.arr[x+a][y+b] = new Tile('spire_'+str);
			}
		}
		this.createRoom(x+1, y+4, 'setSpire');
	}
	putCave(x, y) {
		this.arr[x+0][y+0] = new Tile('cave_tl');
		this.arr[x+1][y+0] = new Tile(rand(TILESET.cliff));
		this.arr[x+2][y+0] = new Tile('cave_tr');
		this.arr[x+0][y+1] = new Tile(rand(TILESET.cliff));
		this.arr[x+1][y+1] = new Tile('cave_bm');
		this.arr[x+2][y+1] = new Tile(rand(TILESET.cliff));
		this.createRoom(x+1, y+1, 'setCave');
	}
	putSmall(x, y) {
		for (let a = 0; a < 3; a++) { //width
			for (let b = 0; b < 2; b++) { //height
				this.arr[x+a][y+b] = new Tile('small_'+a+b);
			}
		}
		this.createRoom(x+1, y+1, 'setSmall');
	}
	putStump(x, y) {
		for (let a = 0; a < 3; a++) { //width
			for (let b = 0; b < 2; b++) { //height
				this.arr[x+a][y+b] = new Tile('stump_'+a+b);
			}
		}
		this.createRoom(x+1, y+1, 'setStump');
	}
	createRoom(enterX, enterY, setRoom) {
		this.rooms.push(new Map());
		let room = this.rooms[this.rooms.length-1];
		room.clear();
		room[setRoom](); //room.setSpire(); == room['setSpire']();
		room.enterX = enterX;
		room.enterY = enterY;
		room.name = setRoom;
	}
}

function noiseAtPoint(x, y, p) {
	let t = noise.perlin2(x / p, (y+HEIGHT*WORLDPOS) / p);
		t = (t + 1) / 2;
	return t;
}