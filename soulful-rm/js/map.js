class Map {
	constructor() {
		this.arr = [];
		this.grid = [];
		this.enemies = [];
		this.collect = [];

		this.pos = [0,0];
		this.dir = [0,1];
		this.progress = 0;
	}
	update(dt) {
		//Animation
		this.progress = linear(this.progress, 0, dt/SPEED*0.05);
	}
	create() {
		noise.seed(Math.random());

		this.arr = [];
		for (let a = 0; a < HEIGHT; a++) {
			this.arr.push([]);
			for (let b = 0; b < HEIGHT; b++) {
				let t = noise.perlin2(a / 8, b / 8);
					t = (t + 1) / 2;
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
							let item = rand(TILESET.collectables);
							this.collect.push(new Mover(item, a, b));
							chosen = 'ground';
						}

						//Add an enemy for good measure
						if (Math.random() < CHANCE.spawn.enemy) {
							let enemy = 'smarg';
							this.enemies.push(new Mover(enemy, a, b));
						}

					} else {
						chosen = rand(TILESET.light);
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

				if (a >= 0 && a < TILESET.collectables.length && b == 3) {
					this.collect.push(new Mover(TILESET.collectables[a], a, b));
					chosen = 'ground';
				}

				this.arr[a][b] = new Tile(chosen);
			}
		}
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
	}
	deleteDeadEnemies() {
		for (let i = 0; i < this.enemies.length; i++) {
			if (this.enemies[i].hp <= 0) {
				this.enemies.splice(i, 1);
				i--;
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

		//Collect
		for (let i = 0; i < this.collect.length; i++) {
			this.collect[i].render(ctx);
		}

		//Enemies
		for (let i = 0; i < this.enemies.length; i++) {
			this.enemies[i].render(ctx);
			this.enemies[i].renderHealth(ctx);
		}

		ctx.translate(-horz, -vert);
	}

	////////////////////////////////
	//                            //
	//         Generation         //
	//                            //
	////////////////////////////////

	addRiver() {
		var ry = 0;
		var rx = Math.round(HEIGHT/2);
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

			let t = noise.perlin2(rx / 8, ry / 8);
				t = (t + 1) / 2;
			let change = Math.round(t*333) % 3 - 1;
			rx += change;
			if (rx < 5) rx = 5;
			if (rx > HEIGHT-6) rx = HEIGHT-6;

			ry++;
		}
	}

}