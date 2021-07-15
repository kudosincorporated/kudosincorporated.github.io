

var renderDebugMode = false;
var disableInput = false;

var GAME = {
	canv: {
		size: 32,
		pixel: 0,
		h: 23
	},
	map: [],
	nextSpot: [],
	grid: [],
	inv: [],
	selected: 'none',
	player: {
		x: 1,
		y: 1,
		dir: [0,1],
		targetFar: true
	},
	day: 0,
	showDir: false,
	nighttime: false,
	rx: 11,
	speed: 800,
	enemies: [],
	kills: 0
}

var DISP = {
	mid: { //use 'mid' for no displacement
		x: 1, y: 1
	}, up: {
		x: 1, y: 0
	}, down: {
		x: 1, y: 2
	}, left: {
		x: 0, y: 1
	}, right: {
		x: 2, y: 1
	}
}

var TILESET = {
	grass: ['grass_1','grass_2','herb_3'],
	ocean: ['river'],
	barren: ['ground'],

	trees: ['tree_1','tree_2','tree_3','tree_4','tree_5','tree_6','tree_7'],
	rocks: ['rocks_1','rocks_2','rocks_3','rocks_4'],

	trees_all: ['tree_1','tree_2','tree_3','tree_4','tree_5'],
	trees_rocks: ['tree_1','tree_2','tree_3','tree_4','tree_5','rocks_1','rocks_2','rocks_3','rocks_4'], //5:4 (all included)
	rocks_all: ['rocks_1','rocks_2','rocks_3','rocks_4'],

	grassy: ['grass_1','grass_2','herb_3','ground','ground','ground'], //1:1
	rocky: ['rocks_1','rocks_2','ground','ground'], //1:1
	treey: ['tree_1','tree_2','tree_3','ground'], //3:1
	herbs: ['herb_1','herb_2','herb_3','herb_4','rocks_2'],

	ground: ['grass_1','grass_2','herb_3','ground','ground','ground','ground','ground','ground','ground','ground'],
	graveyard: ['grave_1','grave_2','herb_1','ground','ground','ground','ground','ground','ground','ground','ground','ground','ground'],
	flowerfield: ['flowers_1','flowers_2','grass_1','ground','ground','ground','ground'],
	cratezone: ['crate','bridge','ground','ground','ground','ground','ground','ground','ground','ground','ground','ground'],
	alchemistheaven: ['herb_1','herb_2','herb_3','herb_4','flowers_1','flowers_2','river','ground','ground','ground','ground'],
	ruins: ['bridge','path_cent','path_horz','path_vert','crate','sand_1','ground','ground','ground','ground']
}

var BIOMES = {
	outer: ['trees_all','trees_rocks','rocks_all'],
	inner: ['grass','rocky','treey','herbs'],
	middle: ['ground'/*,'graveyard','flowerfield','cratezone','alchemistheaven','ruins'*/]
}

var TILE = {
	tree_1:		{ sx: 0, sy: 0, block: true, colour: 'green', name: 'pine tree', drops: [{n:'timber',c:1,mi:1,ma:2},{n:'acorns',c:1,mi:1,ma:2}], change: 'stump', },
	tree_2:		{ sx: 1, sy: 0, block: true, colour: 'green', name: 'willow tree', drops: [{n:'timber',c:1,mi:1,ma:1},{n:'acorns',c:1,mi:1,ma:2}], change: 'stump', },
	tree_3:		{ sx: 2, sy: 0, block: true, colour: 'green', name: 'oak tree', drops: [{n:'timber',c:1,mi:1,ma:3},{n:'acorns',c:1,mi:1,ma:2}], change: 'stump', },
	tree_4:		{ sx: 3, sy: 0, block: true, colour: 'green', name: 'palm tree', drops: [{n:'timber',c:1,mi:1,ma:3},{n:'acorns',c:1,mi:1,ma:2}], change: 'stump', },
	tree_5:		{ sx: 1, sy: 11, block: true, colour: 'green', name: 'maple tree', drops: [{n:'timber',c:1,mi:1,ma:3},{n:'acorns',c:1,mi:1,ma:2}], change: 'stump', },
	tree_6:		{ sx: 2, sy: 11, block: true, colour: 'green', name: 'spruce tree', drops: [{n:'timber',c:1,mi:1,ma:3},{n:'acorns',c:1,mi:1,ma:2}], change: 'stump', },
	tree_7:		{ sx: 3, sy: 11, block: true, colour: 'green', name: 'eucalyptus', drops: [{n:'timber',c:1,mi:1,ma:3},{n:'acorns',c:1,mi:1,ma:2}], change: 'stump', },
	stump:		{ sx: 3, sy: 5, block: true, colour: 'green', name: 'tree stump', drops: [], change: 'ground' },
	cave:		{ sx: 0, sy: 3, block: false, colour: 'desert' },
	cave_clsd: 	{ sx: 0, sy: 6, block: true, colour: 'desert' },
	rocks_1: 	{ sx: 4, sy: 0, block: true, colour: 'desert', name: 'boulder', drops: [{n:'rock',c:1,mi:2,ma:3}], change: 'rocks_2' },
	rocks_2: 	{ sx: 7, sy: 0, block: true, colour: 'desert', name: 'gibber', drops: [{n:'rock',c:1,mi:1,ma:2}], change: 'pebbles' },
	rocks_3: 	{ sx: 6, sy: 9, block: true, colour: 'desert', name: 'rocks', drops: [{n:'rock',c:1,mi:2,ma:3}], change: 'pebbles' },
	rocks_4: 	{ sx: 7, sy: 9, block: true, colour: 'desert', name: 'stones', drops: [{n:'rock',c:1,mi:1,ma:2}], change: 'pebbles' },
	pebbles: 	{ sx: 0, sy: 11, block: false, colour: 'desert', name: 'pebbles', drops: [{n:'rock',c:0.5,mi:1,ma:1}], change: 'ground' },
	bush: 		{ sx: 6, sy: 0, block: true, colour: 'green' },
	ground:		{ sx: 6, sy: 7, block: false, name: 'ground',
				  desc: "Careful! Enemies can sense you here." },
	herb_1: 	{ sx: 0, sy: 2, block: false, colour: 'green', name: 'dandelion' },
	herb_2: 	{ sx: 1, sy: 2, block: false, colour: 'green', name: 'cornflower' },
	herb_3: 	{ sx: 2, sy: 2, block: false, colour: 'green', name: 'bloomflower', drops: [{n:'jute',c:1,mi:1,ma:1}], change: 'ground' },
	herb_4: 	{ sx: 3, sy: 2, block: false, colour: 'green', name: 'jute' },
	flowers_1: 	{ sx: 6, sy: 3, block: false, colour: 'flowers' },
	flowers_2: 	{ sx: 7, sy: 3, block: false, colour: 'flowers' },
	weeds_1: 	{ sx: 6, sy: 3, block: false, colour: 'green' },
	weeds_2: 	{ sx: 7, sy: 3, block: false, colour: 'green' },
	grass_1: 	{ sx: 1, sy: 6, block: false, colour: 'green', name: 'grass', drops: [{n:'seeds',c:1,mi:1,ma:2}], change: 'ground' },
	grass_2: 	{ sx: 2, sy: 6, block: false, colour: 'green', name: 'grass', drops: [{n:'seeds',c:1,mi:1,ma:2}], change: 'ground' },
	path_vert: 	{ sx: 4, sy: 1, block: false, colour: 'desert' },
	path_horz: 	{ sx: 5, sy: 1, block: false, colour: 'desert' },
	path_cent: 	{ sx: 6, sy: 1, block: false, colour: 'desert' },
	twig: 		{ sx: 0, sy: 5, block: false, colour: 'shiny', collect: true },
	bark: 		{ sx: 1, sy: 5, block: false, colour: 'shiny', collect: true },
	leaf: 		{ sx: 2, sy: 5, block: false, colour: 'shiny', collect: true },
	stone: 		{ sx: 3, sy: 5, block: false, colour: 'shiny', collect: true },
	daffodil: 	{ sx: 4, sy: 5, block: false, colour: 'shiny', collect: true },
	cornflower: { sx: 5, sy: 5, block: false, colour: 'shiny', collect: true },
	berries: 	{ sx: 6, sy: 5, block: false, colour: 'shiny', collect: true },
	branch: 	{ sx: 7, sy: 5, block: false, colour: 'shiny', collect: true },
	river: 		{ sx: 3, sy: 6, block: false, colour: 'blue', name: 'river', drops: [], change: 'ground' },
	bridge: 	{ sx: 5, sy: 6, block: false, colour: 'desert', drops: [{n:'timber',c:1,mi:1,ma:1}], change: 'ground' },
	crate: 		{ sx: 4, sy: 6, block: true, colour: 'desert' },
	grave_1: 	{ sx: 4, sy: 3, block: true, colour: 'grey' },
	grave_2: 	{ sx: 5, sy: 3, block: true, colour: 'grey' },
	bloodgrave: { sx: 5, sy: 3, block: true, colour: 'bloody', name: 'bloody grave',
				  desc: "The grave of a dead monster." },
	npc_1: 		{ sx: 4, sy: 2, block: true, colour: 'grey' },
	portal: 	{ sx: 2, sy: 3, block: false, colour: 'blue' },
	ocean: 		{ sx: 2, sy: 7, block: false, colour: 'blue' },
	sand_1: 	{ sx: 3, sy: 7, block: false, colour: 'sand' },
	sand_2: 	{ sx: 5, sy: 10, block: false, colour: 'sand' },
	forcefield: { sx: 1, sy: 7, block: false, colour: 'blue' },
	house: 		{ sx: 1, sy: 3, block: true, colour: 'shiny' },
	scythe: 	{ sx: 3, sy: 4, block: false, colour: 'shiny', drops: [{n:'scythe',c:1,mi:1,ma:1}], change: 'ground' },
	market: 	{ sx: 3, sy: 3, block: true, colour: 'shiny' },
	shopkeep: 	{ sx: 4, sy: 2, block: false, colour: 'white' },
	farmer: 	{ sx: 5, sy: 2, block: false, colour: 'white' },
	goalie: 	{ sx: 6, sy: 2, block: false, colour: 'white' },
	kiddo: 		{ sx: 7, sy: 2, block: false, colour: 'white' },
	sow: 		{ sx: 1, sy: 7, block: false, colour: 'desert', drops: [{n:'seeds',c:1,mi:0,ma:1}], change: 'ground'  },
	hole: 		{ sx: 2, sy: 3, block: true, colour: 'desert', drops: [{n:'rock',c:1,mi:-1,ma:-1}], change: 'ground' },
	crop: 		{ sx: 2, sy: 2, block: false, colour: 'flowers', drops: [{n:'crop',c:1,mi:1,ma:1}], change: 'sow' },
	torchpole: 	{ sx: 4, sy: 11, block: true, colour: 'grey' },
	wall: 		{ sx: 3, sy: 10, block: true, colour: 'grey' },
	carcass: 	{ sx: 5, sy: 11, block: false, colour: 'bloody' }
}

var spritesheet = new Image();
	spritesheet.src = 'tiles_outline-export.png'; //tiles.png

var numbers = new Image();
	numbers.src = 'numbers.png'; //numbers.png

$(window).on('load', function() {

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");

	var hw = GAME.canv.size*GAME.canv.h + GAME.canv.pixel*(GAME.canv.h-1);

	canvas.width = canvas.height = hw*3;

	console.log(canvas.width);

	$('#game').css({
		'height':(hw)+'px',
		'width':(hw)+'px'
	});

	$('#player, #click').css({
		'height':GAME.canv.size+'px',
		'width':GAME.canv.size+'px'
	});

	$('#canvas').css({
		'top':'-100%',
		'left':'-100%'
	});

	GAME.player.x = Math.floor(GAME.canv.h/2);
	GAME.player.y = Math.floor(GAME.canv.h/2);

	class Tile {
		constructor(name) {
			this.name = name;
			this.colour = getColor(TILE[this.name].colour);
		}
		sx() {
			return TILE[this.name].sx*64;
		}
		sy() {
			return TILE[this.name].sy*64;
		}
		colDetect() {
			if (TILE[this.name] != undefined) {
				return !TILE[this.name].block;
			} else {
				return false;
			}
		}
	}

	class Item {
		constructor(name, amt) {
			this.name = name;
			this.amt = amt;
		}
		read() {
			console.log(this);
		}
	}

	function addItem(name, amt) {
		if (GAME.inv[name] == undefined) { //if the item has not been picked up
			GAME.inv[name] = new Item(name, amt);
		} else {
			GAME.inv[name].amt += amt;
		}
		updateInv();
	}

	function removeItem(name, amt) {
		if (GAME.inv[name] == undefined) {
			//nothing to remove
		} else {
			GAME.inv[name].amt -= amt;
			if (GAME.inv[name].amt <= 0) {
				delete GAME.inv[name];
				GAME.selected = 'none';
			}
		}
		updateInv();
	}

	function hasItem(name) {
		if (GAME.inv[name] == undefined) {
			return false;
		} else {
			return true;
		}
	}



	//Adding enemies

	class Enemy {
		constructor(type, x, y) {
			this.type = type;
			this.x = x;
			this.y = y;
			this.path = [];
		}
	}

	function addEnemy(type, x, y) {
		GAME.enemies.push(new Enemy(type, x, y));
	}



	//testing
	/*addItem('timber',1);
	addItem('rock',1);
	addItem('jute',1);
	addItem('seeds',1);
	addItem('acorns',1);
	addItem('crop',1);*/

	updateInv();

	function updateInv() {
		$('#inv').html('');

		var x, y;
		var inv = GAME.inv;
		var oc = 0;
		for (x in inv) {
			var test = inv[x];
			var c = 0;
			$('#inv').append('<div class="item"></div>');
			for (y in test) {
				if (c == 0) {
					$('#inv .item').eq(oc).append('<span class="img '+test[y]+'"></span>');
					if (GAME.selected == test[y]) {
						$('#inv .item').eq(oc).addClass('selected');
					}
				} else if (c == 1) {
					var string = getNumberString(test[y]);
					$('#inv .item').eq(oc).append('<span class="num '+numToWord(string.charAt(0))+'"></span><span class="num '+numToWord(string.charAt(1))+'"></span>');
				}
				c++;
			}
			oc++;
		}

		$('#inv').prepend('<div class="item"><span class="img none"></span></div>');
		if (GAME.selected == 'none') {
			$('#inv .item .img.none').parent().addClass('selected');
		}
	}




	function create() {
		var nMap = {
			arr: [],
			elevation: [],
			vision: []
		}

		noise.seed(Math.random());

		//MAKE ALL GROUND
		function farVal() { //findFarthestDist
			var distanceX = (Math.floor(GAME.canv.h/2) - 0) * (Math.floor(GAME.canv.h/2) - 0);
			var distanceY = (Math.floor(GAME.canv.h/2) - 0) * (Math.floor(GAME.canv.h/2) - 0);
			var distanceToCenter = Math.sqrt(distanceX + distanceY);
			return distanceToCenter = distanceToCenter / (GAME.canv.h/2);
		}

		function generateBiome() {
			var biome = {};

			biome.outer = {
				trees: [],
				rocks: []
			};
			var trees_arr = TILESET.trees.slice();
			var rocks_arr = TILESET.rocks.slice();

			let ratioNum = randInt(3,7);
			let numOfAdds = [ratioNum, 10-ratioNum]; //IDK why I used let here

			for (let i=0; i < numOfAdds[0]; i++) {
				var newtile = rand(trees_arr);
				trees_arr.splice(trees_arr.indexOf(newtile), 1);
				if (trees_arr.length == 0) {
					trees_arr = TILESET.trees.slice();
				}
				biome.outer.trees.push(newtile);
			}
			for (let i=0; i < numOfAdds[1]; i++) {
				var newtile = rand(rocks_arr);
				rocks_arr.splice(rocks_arr.indexOf(newtile), 1);
				if (rocks_arr.length == 0) {
					rocks_arr = TILESET.rocks.slice();
				}
				biome.outer.rocks.push(newtile);
			}

			biome.inner = {
				dense: ['herb_3','pebbles','weeds_1','weeds_2'],
				light: ['grass_1','grass_2','ground','ground']
			};

			biome.middle = ['ground'];

			return biome;
		}

		var biome = generateBiome();

		console.log(
			'outer: trees: '+biome.outer.trees+'\n'+
			'       rocks: '+biome.outer.rocks+'\n'+
			'inner: dense: '+biome.inner.dense+'\n'+
			'       light: '+biome.inner.light+'\n'+
			'middle: '+biome.middle
		);

		for (var x = 0; x < GAME.canv.h; x++) {
			nMap.arr.push([]);
			nMap.elevation.push([]);
			nMap.vision.push([]);

			for (var y = 0; y < GAME.canv.h; y++) {

				var et = noise.perlin2(x / 8, y / 8);
				et = (et+1)/2; //normalise an array of -1/1 to 0/1;

					//making a circle
					var t = 0;
					var distanceX = (Math.floor(GAME.canv.h/2) - x) * (Math.floor(GAME.canv.h/2) - x);
					var distanceY = (Math.floor(GAME.canv.h/2) - y) * (Math.floor(GAME.canv.h/2) - y);
					var distanceToCenter = Math.sqrt(distanceX + distanceY);
					distanceToCenter = distanceToCenter / (GAME.canv.h/2);
					t += distanceToCenter;
					//https://stats.stackexchange.com/questions/70801/how-to-normalize-data-to-0-1-range
					t = (t + farVal()) / (farVal() + 0);
					t = t-1;
					/////////////////////////
					nMap.vision[x].push(t*3.5); //3.5 a good value for nightt1me
					/////////////////////////

				var et_t = et*t;

				nMap.elevation[x].push(et_t);

				//The map is generated from the inside out
				if (et_t < 0.1) { //middle

					nMap.arr[x].push(new Tile( rand(biome.middle) ));

				} else if (et_t < 0.3) { //inner

					if (et > 0.5) {
						nMap.arr[x].push(new Tile( rand(biome.outer.trees) ));
					} else if (et > 0.4) {
						nMap.arr[x].push(new Tile( rand(biome.inner.dense) ));

						if (Math.random() < 0.01) { //1 in 100 chance?
							addEnemy('smurg', x, y);
						}

					} else {
						nMap.arr[x].push(new Tile( rand(biome.inner.light) ));
					}

				} else { //outer (rest)

					if (et > 0.5) {
						nMap.arr[x].push(new Tile( rand(biome.outer.trees) ));
					} else {
						nMap.arr[x].push(new Tile( rand(biome.outer.rocks) ));
					}

				}
			}
		}

		//spawning river !!!
		ry = 0;

		while (ry < GAME.canv.h) {
			var dirs = ['left','right','down','down'];
			var dir = rand(dirs);
			var len = 1; //used to be random 1-3, but this is better
			while (len > 0) {
				nMap.arr[GAME.rx][ry] = new Tile('river');

				var way = [-1,1];
				var nway = rand(way);
				if (GAME.rx + nway > 2 && GAME.rx + nway < GAME.canv.h-2) {
					nMap.arr[GAME.rx + rand(way)][ry] = new Tile('river');
				}

				if (dir == 'left' && GAME.rx > 0) {
					GAME.rx--;
				} else if (dir == 'right' && GAME.rx < GAME.canv.h-1) {
					GAME.rx++;
				} else {
					ry++;
				}

				len--;
			}
		}

		//pathways
		/*for (let i = 0; i < GAME.canv.h; i++) {
			nMap.arr[Math.floor(GAME.canv.h/2)][i] = new Tile('ground');
			nMap.arr[i][Math.floor(GAME.canv.h/2)] = new Tile('ground');
		}*/

		return nMap;
	}

	function render(mapToRender, dir) {
		function setupGrid() {
			//set up the grid for pathfinding
			GAME.grid = [];

			for (let i = 0; i < GAME.map.arr[0].length; i++) {
				GAME.grid.push([]);
				for (let j = 0; j < GAME.map.arr.length; j++) {
					if (TILE[GAME.map.arr[j][i].name].block == true) {
						GAME.grid[i].push(1);
					} else {
						GAME.grid[i].push(0);
					}
				}
			}
		}

		setupGrid();

		for (var x = 0; x < GAME.canv.h; x++) {
			for (var y = 0; y < GAME.canv.h; y++) {
				var xsize = x*GAME.canv.size + x*GAME.canv.pixel;
				var ysize = y*GAME.canv.size + y*GAME.canv.pixel;

					xsize += GAME.canv.h*GAME.canv.size*DISP[dir].x;
					ysize += GAME.canv.h*GAME.canv.size*DISP[dir].y;

				//if (x == 0 && y == 0) console.log(xsize+" "+ysize);

				ctx.beginPath();
				ctx.rect(xsize, ysize, GAME.canv.size, GAME.canv.size);
				ctx.fillStyle = mapToRender.arr[x][y].colour;
				ctx.fill();

				ctx.drawImage(spritesheet, mapToRender.arr[x][y].sx(), mapToRender.arr[x][y].sy(), 64, 64, xsize, ysize, GAME.canv.size, GAME.canv.size);

				if (GAME.showDir) {
					if (GAME.player.targetFar) {
						if (x == GAME.player.x+GAME.player.dir[0] && y == GAME.player.y+GAME.player.dir[1]) {
							switch (GAME.player.dir.toString()) {
								case "1,0":
									ctx.drawImage(numbers, 64, 96, 32, 32, xsize, ysize, GAME.canv.size, GAME.canv.size);
									//ctx.drawImage(numbers, 0+128, 224, 32, 32, xsize, ysize, GAME.canv.size, GAME.canv.size);
									break;
								case "0,-1":
									ctx.drawImage(numbers, 64, 96, 32, 32, xsize, ysize, GAME.canv.size, GAME.canv.size);
									//ctx.drawImage(numbers, 32+128, 224, 32, 32, xsize, ysize, GAME.canv.size, GAME.canv.size);
									break;
								case "0,1":
									ctx.drawImage(numbers, 64, 96, 32, 32, xsize, ysize, GAME.canv.size, GAME.canv.size);
									//ctx.drawImage(numbers, 64+128, 224, 32, 32, xsize, ysize, GAME.canv.size, GAME.canv.size);
									break;
								case "-1,0":
									ctx.drawImage(numbers, 64, 96, 32, 32, xsize, ysize, GAME.canv.size, GAME.canv.size);
									//ctx.drawImage(numbers, 96+128, 224, 32, 32, xsize, ysize, GAME.canv.size, GAME.canv.size);
									break;
								default:
									ctx.drawImage(numbers, 0, 0, 32, 32, xsize, ysize, GAME.canv.size, GAME.canv.size);
							}
						}
					} else {
						if (x == GAME.player.x && y == GAME.player.y) {
							ctx.drawImage(numbers, 64, 96, 32, 32, xsize, ysize, GAME.canv.size, GAME.canv.size);
						}
					}
				}
			}
		}

		//render the smurgs!
		for (let i = 0; i < GAME.enemies.length; i++) {
			var x = GAME.enemies[i].x;
			var y = GAME.enemies[i].y;

			var xsize = x*GAME.canv.size + x*GAME.canv.pixel;
			var ysize = y*GAME.canv.size + y*GAME.canv.pixel;

				xsize += GAME.canv.h*GAME.canv.size*DISP[dir].x;
				ysize += GAME.canv.h*GAME.canv.size*DISP[dir].y;

			ctx.beginPath();
			ctx.rect(xsize+8, ysize, GAME.canv.size-16, GAME.canv.size-20);
			ctx.fillStyle = '#252525';
			ctx.fill();

			ctx.drawImage(numbers, 0, 256, 32, 32, xsize, ysize, GAME.canv.size, GAME.canv.size);
		}


		//Change the negative 32 values to add a drawing of where the character is on render(), as opposed to the renderPlayer() DOM solution used.
		ctx.save();
		ctx.globalAlpha = 0;
		ctx.drawImage(numbers, 96, 96, 32, 32, GAME.player.x*GAME.canv.size + canvas.width/3, GAME.player.y*GAME.canv.size + canvas.width/3, GAME.canv.size, GAME.canv.size);
		ctx.restore();

		//Fog of war!
		if (GAME.nighttime) {
			for (var x = 0; x < GAME.canv.h; x++) {
				for (var y = 0; y < GAME.canv.h; y++) {
					var xsize = x*GAME.canv.size + x*GAME.canv.pixel;
					var ysize = y*GAME.canv.size + y*GAME.canv.pixel;

						xsize += GAME.canv.h*GAME.canv.size*DISP[dir].x;
						ysize += GAME.canv.h*GAME.canv.size*DISP[dir].y;

					var mapx = x - (GAME.player.x - Math.floor(GAME.canv.h/2));
					var mapy = y - (GAME.player.y - Math.floor(GAME.canv.h/2));

					if (GAME.map.vision[mapx] != undefined) {
						if (GAME.map.vision[mapx][mapy] != undefined) {
							ctx.globalAlpha = GAME.map.vision[mapx][mapy];
						} else {
						ctx.globalAlpha = 1;
						}
					} else {
						ctx.globalAlpha = 1;
					}

					ctx.beginPath();
					ctx.rect(xsize, ysize, GAME.canv.size, GAME.canv.size);
					ctx.fillStyle = "#252525";
					ctx.fill();

					ctx.globalAlpha = 1;

					if (renderDebugMode) {
						ctx.font = "10px monospace";
						ctx.fillStyle = 'white';
						ctx.fillText(GAME.vision[x][y].toFixed(2), mapx*GAME.canv.size, mapy*GAME.canv.size);
					}

				}
			}
		}

		if (renderDebugMode) {
			ctx.beginPath();
			ctx.rect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'black';
			ctx.fill();

			for (let x = 0; x < GAME.map.arr[0].length; x++) {
				for (let y = 0; y < GAME.map.arr.length; y++) {
					var xsize = x*GAME.canv.size + x*GAME.canv.pixel + canvas.width/3;
					var ysize = y*GAME.canv.size + y*GAME.canv.pixel + canvas.width/3;

					ctx.save();

					ctx.beginPath();
					//ctx.globalAlpha = GAME.map.elevation[x][y]; //Used to visualise the elevation, unused now because highest values arent near 1.
					if (TILE[GAME.map.arr[x][y].name].block) {
						ctx.fillStyle = 'tomato';
					} else {
						if (GAME.map.arr[x][y].name != 'ground') {
							ctx.fillStyle = 'seagreen';
						} else {
							ctx.fillStyle = 'black';
						}
					}
					ctx.rect(xsize, ysize, GAME.canv.size, GAME.canv.size);
					ctx.fill();

					ctx.restore();

					ctx.beginPath();
					ctx.rect(xsize, ysize + (GAME.canv.size - GAME.canv.size/2), GAME.canv.size, GAME.canv.size/2);
					ctx.fillStyle = 'black';
					ctx.fill();

					ctx.font = "10px monospace";
					ctx.fillStyle = 'white';
					ctx.fillText(GAME.map.elevation[x][y].toFixed(2), xsize, ysize + GAME.canv.size);

					if (GAME.map.arr[x][y].name != 'ground') ctx.fillText(GAME.map.arr[x][y].name, xsize, ysize + GAME.canv.size - GAME.canv.size/4);
				}
			}
		}


		//write a tile info/desc panel ? should this go here ?
		var cx = GAME.player.x+GAME.player.dir[0];
		var cy = GAME.player.y+GAME.player.dir[1];
		if (!GAME.player.targetFar) {
			cx = GAME.player.x;
			cy = GAME.player.y;
		}

		if (cx >= 0 && cx <= GAME.canv.h-1) {
			if (cy >= 0 && cy <= GAME.canv.h-1) {

				var tile = GAME.map.arr[cx][cy].name;

				$('#values *').html('');
				$('.panel .tile_name').html(TILE[tile].name);
				$('.panel .isBlock').html(convBlck(tile));
				$('.panel .tile_drops').html(convDrps(tile));
				$('.panel .breaksInto').html(convChnge(tile));
				$('.panel .tile_desc').html(convDesc(tile));

			}
		}

		function convDesc(tileName) {
			var t = TILE[tileName].desc;
			var f = '';
			if (t == undefined) {
				f += '';
			} else {
				f += t;
			}
			return f;
		}

		function convChnge(tileName) {
			if (TILE[tileName].change != undefined) {
				var chnge = 'breaks into? ';
				chnge += '<span class="drop">'+TILE[TILE[tileName].change].name+'</span>';
				return chnge;
			}
		}

		function convDrps(tileName) {
			if (TILE[tileName].drops != undefined) {
				var final = 'drops? ';
				for (let i=0; i < TILE[tileName].drops.length; i++) {
					var drop = TILE[tileName].drops[i];
					final += '<span class="drop">';
					var drop_chance = drop.c*100;
					var drop_list = drop.mi+'-'+drop.ma;
					if (drop.mi == drop.ma) drop_list = drop.mi;
					final += drop_chance+'% for '+drop_list+' '+drop.n+'</span>';
				}
				if (TILE[tileName].drops.length == 0) final = '';
				return final;
			}
		}

		function convBlck(tileName) {
			bool = TILE[tileName].block;
			var end = 'block? ';
			if (bool) {
				end += '<span class="green">Y</span>';
			} else {
				end += '<span class="red">N</span>';
			}
			return end;
		}


	}

	$('body').on('keydown', function(e) {
		GAME.showDir = true;

		if (!disableInput) {
			getKeyAndMove(e);
		}

		function getKeyAndMove(e){
			var key_code=e.which||e.keyCode;
			switch(key_code){
				case 37: //left arrow key
					walk('left');
					break;
				case 38: //Up arrow key
					if (GAME.player.y <= 0) {
						GAME.player.y = GAME.canv.h-1;
						slideWorld('up');
						renderPlayer(GAME.speed);
					} else {
						walk('up');
					}
					break;
				case 39: //right arrow key
					walk('right');
					break;
				case 40: //down arrow key
					if (GAME.player.y >= GAME.canv.h-1) {
						GAME.player.y = 0;
						slideWorld('down');
						renderPlayer(GAME.speed);
					} else {
						walk('down');
					}
					break;

				case 87: //W key
					GAME.player.dir = [0,-1];
					render(GAME.map, 'mid');
					break;
				case 65: //A key
					GAME.player.dir = [-1,0];
					render(GAME.map, 'mid');
					break;
				case 83: //S key
					GAME.player.dir = [0,1];
					render(GAME.map, 'mid');
					break;
				case 68: //D key
					GAME.player.dir = [1,0];
					render(GAME.map, 'mid');
					break;

				case 88: //X key
					GAME.player.targetFar = !GAME.player.targetFar;
					render(GAME.map, 'mid');
					break;
				case 90: //Z key
					if (GAME.player.targetFar) {
						tryToCollect(GAME.player.x+GAME.player.dir[0], GAME.player.y+GAME.player.dir[1]);
					} else {
						tryToCollect(GAME.player.x, GAME.player.y);
					}
					break;

				case 67: //C key
					goToSleep();
					break;

				case 49:
					selectItem(1);
					break;
				case 50:
					selectItem(2);
					break;
				case 51:
					selectItem(3);
					break;
				case 52:
					selectItem(4);
					break;
				case 53:
					selectItem(5);
					break;
				case 54:
					selectItem(6);
					break;
				case 55:
					selectItem(7);
					break;
				case 56:
					selectItem(8);
					break;
				case 57:
					selectItem(9);
					break;
			}

			function selectItem(pos) {
				if (pos > $('#inv .item').length) {
					//nothing
				} else {
					$('.item').removeClass('selected');
					$('.item').eq(pos-1).addClass('selected');
					var clas = $('.item').eq(pos-1).find('.img').attr('class').replace('img ','');
					GAME.selected = clas;
				}
			}
		}
	});

	//////////////// EASYSTAR ////////////////

		var easystar = new EasyStar.js();
		easystar.setAcceptableTiles([0]);
		easystar.setGrid(GAME.grid);

	//////////////////////////////////////////

	function walk(choice) {
		var dirs = ['up', 'down', 'left', 'right'];

		var d;
		if (choice == undefined) {
			d = rand(dirs);
		} else {
			d = choice;
		}

		switch (d) {
			case 'up':
				if (GAME.map.arr[GAME.player.x][GAME.player.y-1].colDetect()) {
					GAME.player.y--;
				} //else { walk(); }
				GAME.player.dir = [0,-1];
				break;
			case 'down':
				if (GAME.map.arr[GAME.player.x][GAME.player.y+1].colDetect()) {
					GAME.player.y++;
				} //else { walk(); }
				GAME.player.dir = [0,1];
				break;
			case 'left':
				if (GAME.map.arr[GAME.player.x-1][GAME.player.y].colDetect()) {
					GAME.player.x--;
				} //else { walk(); }
				GAME.player.dir = [-1,0];
				break;
			case 'right':
				if (GAME.map.arr[GAME.player.x+1][GAME.player.y].colDetect()) {
					GAME.player.x++;
				} //else { walk(); }
				GAME.player.dir = [1,0];
				break;
			default:
				//default
		}

		//make enemies move

			easystar.setGrid(GAME.grid);
			easystar.enableSync();
			easystar.setIterationsPerCalculation(1000);

		///////////////////

		if (GAME.map.arr[GAME.player.x][GAME.player.y].name == "ground") {

			easystar.stopAvoidingAllAdditionalPoints();

			for (let i = 0; i < GAME.enemies.length; i++) {

				easystar.findPath(GAME.enemies[i].x, GAME.enemies[i].y, GAME.player.x, GAME.player.y, function( path ) {
					if (path === null) {
						//GAME.enemies.splice(i, 1);
					} else {
						if (path.length >= 1) {
							GAME.enemies[i].x = path[1].x;
							GAME.enemies[i].y = path[1].y;
							easystar.avoidAdditionalPoint(path[1].x, path[1].y);
						}
					}
				});

			}

			easystar.calculate();

		}


		//Enemies dissapear when they walk into you. (and the player dies)
		for (let b = 0; b < GAME.enemies.length; b++) {
			if (GAME.enemies[b].x == GAME.player.x && GAME.enemies[b].y == GAME.player.y) {
				GAME.enemies.splice(b, 1);
				$('#player').hide();
				GAME.showDir = false;
				GAME.map.arr[GAME.player.x][GAME.player.y] = new Tile('grave_1');
				render(GAME.map, 'mid');
				disableInput = true;
				setTimeout(function() {
					alert('You died!');
				}, 100);
			}
		}


		//things to do
		//GAME.map.arr[GAME.player.x][GAME.player.y].collect();

		//render the map (so that the white box appears!)
		render(GAME.map, 'mid');

		//move the player
		renderPlayer();
	}

	function renderPlayer(val) {
		var ts = val ? val : 100;

		var vy = GAME.player.y*GAME.canv.size + GAME.player.y*GAME.canv.pixel - canvas.height/3/2;
		var vx = GAME.player.x*GAME.canv.size + GAME.player.x*GAME.canv.pixel - canvas.width/3/2;

		$('#player').css('transition',ts+'ms linear');

		$('#player').css({
			'top':'calc(50% + '+vy+'px)',
			'left':'calc(50% + '+vx+'px)'
		});
	}

	GAME.map = create();
	render(GAME.map, 'mid');

	function updKills() {
		var killsString = getNumberString(GAME.kills);
		$('#kills').html('');
		$('#kills').append('<div class="num '+numToWord(killsString.charAt(0))+'"></div>');
		$('#kills').append('<div class="num '+numToWord(killsString.charAt(1))+'"></div>');
	}

	updKills();

	//sleepy time sleeping player sleep etc

	function goToSleep() {
		disableInput = true;

		GAME.nighttime = !GAME.nighttime;

		//day.night cycle
		var cycleTime = 4000;

		$('#canvas, #player').addClass('fade');
		$('#zzz').fadeIn(cycleTime/4);

		$('#zzz').html('');

		setTimeout(function() {
			$('#zzz').append('<div class="num z"></div>');
			setTimeout(function() {
				$('#zzz').append('<div class="num z"></div>');
					setTimeout(function() {
						$('#zzz').append('<div class="num z"></div>');
					}, cycleTime/8);
			}, cycleTime/8);
		}, cycleTime/4);

		//ENEMIES MOVING
		for (let i=0; i < 4; i++) {
			setTimeout(function() {
				walk('THE ENEMIES ARE COMING HOLY SHIT RUN RUN OH GOD HE HAS AIRPODS IN OH FUCK');
				render(GAME.map, 'mid');
			}, cycleTime/i);
		}
		////////////////


		setTimeout(function() {
			GAME.day++;
			var numtext = getNumberString(GAME.day);
			$('#time').html('');
			$('#time').append('<div class="num '+numToWord(numtext.charAt(0))+'"></div>');
			$('#time').append('<div class="num '+numToWord(numtext.charAt(1))+'"></div>');

			//changing tiles
			for (var x = 0; x < GAME.canv.h; x++) {
				for (var y = 0; y < GAME.canv.h; y++) {
					var tname = GAME.map.arr[x][y].name;
					if (tname == 'ground') {
						if (Math.random() <= 0.05) {
							GAME.map.arr[x][y] = new Tile(rand(TILESET.grass));
						}
					} else if (tname == 'hole') {
						GAME.map.arr[x][y] = new Tile('river');
					} else if (tname == 'stump') {
						GAME.map.arr[x][y] = new Tile(rand(TILESET.trees));
					} else if (tname == 'sow') {
						GAME.map.arr[x][y] = new Tile('crop');
					}
				}
			}
			render(GAME.map, 'mid');
			$('#zzz').fadeOut(cycleTime/4);
		}, cycleTime/2);

		setTimeout(function() {
			$('#canvas, #player').removeClass('fade');
			disableInput = false;
		}, cycleTime);
	}

	function tryToCollect(cx, cy) {

		//firstly, try to kill the enemy
		for (let i=0; i < GAME.enemies.length; i++) {
			if (GAME.enemies[i].x == cx && GAME.enemies[i].y == cy) {
				GAME.map.arr[GAME.enemies[i].x][GAME.enemies[i].y] = new Tile( 'bloodgrave' );
				GAME.enemies.splice(i, 1);
				GAME.kills++;

				render(GAME.map, 'mid');
				updKills();
			}
		}

		var tname = GAME.map.arr[cx][cy].name;

		if (GAME.player.x < cx-1 || GAME.player.x > cx+1 || GAME.player.y < cy-1 || GAME.player.y > cy+1) {
			//false
		} else {
			if (TILE[tname].drops != undefined) { //first check for drops
				for (let i = 0; i < TILE[tname].drops.length; i++) {
					var drops = TILE[tname].drops[i];
					if (Math.random() <= drops.c) {
						addItem(drops.n, randInt(drops.mi, drops.ma));
					}
				}

				GAME.map.arr[cx][cy] = new Tile(TILE[tname].change);
				render(GAME.map, 'mid');
				playerAction();
			} else if (tname == 'house') {

				goToSleep();

			} else if (tname == 'market') {
				
				if (hasItem('crop')) {
					removeItem('crop', 1);
					addItem('coin', 1);
				}

			} else { //tile has no drops; i.e. its ground usually
				switch (GAME.selected) {
					case 'rock':
						addItem('rock',1);
						GAME.map.arr[cx][cy] = new Tile('hole');
						break;
					case 'timber':
						if (hasItem('timber')) {
							removeItem('timber',1);
							GAME.map.arr[cx][cy] = new Tile('bridge');
						}
						break;
					case 'seeds':
						if (hasItem('seeds')) {
							removeItem('seeds',1);
							GAME.map.arr[cx][cy] = new Tile('sow');
						}
						break;
					case 'acorns':
						if (hasItem('acorns')) {
							removeItem('acorns',1);
							GAME.map.arr[cx][cy] = new Tile('stump');
						}
						break;
					default: //there is no item selected
				}
				render(GAME.map, 'mid');
				playerAction();
			}
		}
	}

	function playerAction() {
		$('#player').addClass('animate');
		setTimeout(function() {
			$('#player').removeClass('animate');
		}, 300);
	}

	$('#game').on('click', function(e) {
		$('#click').show();

		var x = e.pageX - $('#game').offset().left;
		var y = e.pageY - $('#game').offset().top;

		$('#click').css({
			'top':y-GAME.canv.size/2+'px',
			'left':x-GAME.canv.size/2+'px'
		})

		$('#click').addClass('animate');
		setTimeout(function() {
			$('#click').removeClass('animate');
		}, 300)
	});

	

	/*$('.button').on('click', function() {
		$('.button').removeClass('pressed');
		$(this).addClass('pressed');
	});*/

	$('body').on('click', '.item', function() {
		$('.item').removeClass('selected');
		$(this).addClass('selected');
		var clas = $(this).find('.img').attr('class').replace('img ','');
		GAME.selected = clas;
	});


	//action text for hovering, decided not to do, think mobile first
	/*
	$('body').on('mousemove', '#game', function(e) {
		var x = e.pageX;
		var y = e.pageY;

		var offset = [$('#canvas').offset().left, $('#canvas').offset().top];

		var nx = x - offset[0],
			ny = y - offset[1]

			nx = Math.floor((nx/GAME.canv.size));
			ny = Math.floor((ny/GAME.canv.size));

		$('#stats').html(nx+"<br>"+ny+"<br>"+GAME.map[nx][ny].name);

		$('#info').css({
			'top':y+'px',
			'left':x+'px'
		});
	});

	$('#game').on('mouseenter', function() {
		$('#info').show();
	});

	$('#game').on('mouseleave', function() {
		$('#info').hide();
	});
	*/

	/*
	$('body').on('mousedown', '.btn', function() {
		$(this).addClass('pressed');
	});

	$('body').on('mouseup', '.btn', function() {
		$('.btn').removeClass('pressed');
	});
	*/

	function slideWorld(dir) {
		disableInput = true;

		//should probably remove all enemies
		GAME.enemies = [];

		GAME.nextSpot = create();
		render(GAME.nextSpot, dir);

		$('#canvas').css({
			'top':-1*DISP[dir].y*100+'%',
			'left':-1*DISP[dir].x*100+'%'
		});

		GAME.map = GAME.nextSpot;

		setTimeout(function() {
			$('#canvas').css('transition','0ms');

			render(GAME.map, 'mid');

			$('#canvas').css({
				'top':'-100%',
				'left':'-100%'
			});

			disableInput = false;
		}, GAME.speed);

		$('#canvas').css('transition',GAME.speed+'ms linear');
	}























	//last minute inits
	renderPlayer();

}); //end of on.load














function getColor(colour) {
	var clr;
	switch (colour) {
		case 'green':
			clr = [randInt(80, 140), randInt(20, 100), randInt(20, 80)];
			break;
		case 'desert':
			clr = [randInt(10, 50), randInt(20, 100), randInt(40, 60)];
			break;
		case 'flowers':
			clr = [randInt(180, 330), randInt(50, 100), randInt(60, 80)];
			break;
		case 'shiny':
			clr = [randInt(45, 65), randInt(90, 100), randInt(50, 60)];
			break;
		case 'blue':
			clr = [randInt(180, 200), randInt(20, 100), randInt(40, 60)];
			break;
		case 'grey':
			clr = [randInt(200, 250), randInt(5, 15), randInt(40, 60)];
			break;
		case 'sand':
			clr = [randInt(30, 50), randInt(25, 75), randInt(60, 80)];
			break;
		case 'white':
			clr = [0, 0, 100];
			break;
		case 'bloody':
			clr = [randInt(0, 10), randInt(75, 100), randInt(45, 55)];
			break;
		default:
			clr = clr = [0, 0, 0];
	}
	return 'hsl('+clr[0]+','+clr[1]+'%,'+clr[2]+'%)';
}

function rand(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function randInt(bottom, top) {
	return Math.floor(Math.random() * (top - bottom + 1)) + bottom;
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

function getNumberString(num) {
	var amount = '';
	if (num <= 9) {
		amount += '0';
	}
	amount += num;

	return amount;
}

function numToWord(num) {
	switch (num) {
		case "1":
			return 'one';
			break;
		case "2":
			return 'two';
			break;
		case "3":
			return 'three';
			break;
		case "4":
			return 'four';
			break;
		case "5":
			return 'five';
			break;
		case "6":
			return 'six';
			break;
		case "7":
			return 'seven';
			break;
		case "8":
			return 'eight';
			break;
		case "9":
			return 'nine';
			break;
		case "0":
			return 'zero';
			break;
		default:
			return 'dash';
	}
}








function FizzBuzz() {
	var print;
	for (let i = 1; i < 101; i++) {
		print = '';
		if (i % 3 == 0) {
			print += 'Fizz';
		}
		if (i % 5 == 0) {
			print += 'Buzz';
		}
		if (print == '') {
			print += i;
		}
		console.log(print);
	}

}