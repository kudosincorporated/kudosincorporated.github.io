

var renderDebugMode = false;
var disableInput = false;
var firstZone = true;
var seedDisplacement = 0;


var GAME = {
	canv: {
		size: 32,
		pixel: 0,
		h: 25
	},
	map: [],
	nextSpot: [],
	RAMmap: [],
	grid: [],
	inv: [],
	selected: 'none',
	player: {
		x: 1,
		y: 1,
		dir: [0,1],
		targetFar: true,
		facing: 'down',
		RAMx: 0,
		RAMy: 0
	},
	day: 0,
	showDir: false,
	nighttime: false,
	rx: 11,
	speed: 800,
	kills: 0,
	money: 0,
	lives: 1,
	chanceOf: {
		monsterSpawn: 0.02,
		lootSpawn: 0.05
	},
	weapon: 'fists',
	weaponMatrix: [],
	inRoom: false,
	roomNumber: 0
}

var DISP = {
	dirs: ['up', 'down', 'left', 'right'],
	mid: { //use 'mid' for no displacement
		x: 1, y: 1
	}, up: {
		//r is rotations for weapon rendering
		x: 1, y: 0, r: 1
	}, down: {
		x: 1, y: 2, r: 3
	}, left: {
		x: 0, y: 1, r: 2
	}, right: {
		x: 2, y: 1, r: 4
	}
}

var TILESET = {
	grass: ['grass_1','grass_2','herb_3'],
	ocean: ['river'],
	barren: ['ground'],
	lootBoxes: ['crate_1','vase_1','barrel_1','chest_1'],
	sand: ['sand_1','sand_2','pebbles'],
	cliff: ['cliff_1','cliff_2'],

	trees: ['tree_1','tree_2','tree_3','tree_4','tree_5','tree_6','tree_7'],
	rocks: ['rocks_1','rocks_2','rocks_3','rocks_4'],

	house: ['table','nightstand','bed','bookshelf','clothes','rug_1','rug_2'],

	treasure: ['coin_1','coin_2','coin_3','coin_4','coin_5','coin_6','coin_7','coin_8']
}

var BUILD = {
	shop: {
		arr: [
			['shop_vert','shopkeep','shop_vert'],
			['shop_llc','shop_horz','shop_lrc'],
			['ground','ground','ground']
		]
	}
}

var TILE = {
	test: 		{ sx: 4, sy: 6, block: false, colour: 'logcabin' },
	test_2: 	{ sx: 5, sy: 7, block: false, colour: 'grey' },
	blank: 		{ sx: 5, sy: 7, block: false },
	invisidoor: { sx: 6, sy: 7, block: false, isDoor: true },
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
	pebbles: 	{ sx: 0, sy: 11, block: false, colour: 'sand', name: 'pebbles', drops: [{n:'rock',c:0.5,mi:1,ma:1}], change: 'ground' },
	bush: 		{ sx: 6, sy: 0, block: true, colour: 'green' },
	ground:		{ sx: 6, sy: 7, block: false, name: 'ground' },
	herb_1: 	{ sx: 0, sy: 2, block: false, colour: 'green', name: 'dandelion' },
	herb_2: 	{ sx: 1, sy: 2, block: false, colour: 'green', name: 'cornflower' },
	herb_3: 	{ sx: 2, sy: 2, block: false, colour: 'green', name: 'bloomflower', drops: [{n:'jute',c:1,mi:1,ma:1}], change: 'ground' },
	herb_4: 	{ sx: 3, sy: 2, block: false, colour: 'green', name: 'jute' },
	flowers_1: 	{ sx: 6, sy: 3, block: false, colour: 'flowers' },
	flowers_2: 	{ sx: 7, sy: 3, block: false, colour: 'flowers' },
	weeds_1: 	{ sx: 6, sy: 3, block: false, colour: 'green', drops: [], change: 'ground' },
	weeds_2: 	{ sx: 7, sy: 3, block: false, colour: 'green', drops: [], change: 'ground' },
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
	river: 		{ sx: 3, sy: 6, block: false, colour: 'blue', name: 'river',
				  desc: "Most enemies cannot detect you in water." },
	river_vert: { sx: 0, sy: 14, block: true, colour: 'blue', },
	spray: 		{ sx: 1, sy: 14, block: false, colour: 'white', },
	bridge: 	{ sx: 5, sy: 6, block: false, colour: 'desert', drops: [{n:'timber',c:1,mi:1,ma:1}], change: 'ground' },
	crate_1: 	{ sx: 0, sy: 12, block: true, colour: 'shiny', name: 'crate', drops: [], change: 'crate_2', isLoot: true,
				  desc: "Open it!" },
	crate_2: 	{ sx: 1, sy: 12, block: false, colour: 'grey', name: 'empty crate', drops: [], change: 'ground' },
	vase_1: 	{ sx: 2, sy: 12, block: true, colour: 'shiny', name: 'vase', drops: [], change: 'vase_2', isLoot: true,
				  desc: "Open it!" },
	vase_2: 	{ sx: 3, sy: 12, block: false, colour: 'grey', name: 'empty vase', drops: [], change: 'ground' },
	barrel_1: 	{ sx: 4, sy: 12, block: true, colour: 'shiny', name: 'barrel', drops: [], change: 'barrel_2', isLoot: true,
				  desc: "Open it!" },
	barrel_2: 	{ sx: 5, sy: 12, block: false, colour: 'grey', name: 'empty barrel', drops: [], change: 'ground' },
	chest_1: 	{ sx: 6, sy: 12, block: true, colour: 'shiny', name: 'chest', drops: [], change: 'chest_2', isLoot: true,
				  desc: "Open it!" },
	chest_2: 	{ sx: 7, sy: 12, block: false, colour: 'grey', name: 'empty chest', drops: [], change: 'ground' },
	grave_1: 	{ sx: 4, sy: 3, block: true, colour: 'grey' },
	grave_2: 	{ sx: 5, sy: 3, block: true, colour: 'grey' },
	bloodgrave: { sx: 5, sy: 3, block: true, colour: 'bloody', name: 'bloody grave', drops: [{n:'bloodgrave',c:1,mi:1,ma:1}], change: 'pebbles',
				  desc: "The gory grave of a dead monster." },
	watergrave: { sx: 5, sy: 3, block: true, colour: 'blue', name: 'watery grave', drops: [{n:'watergrave',c:1,mi:1,ma:1}], change: 'river',
				  desc: "The watery grave of a dead monster." },
	npc_1: 		{ sx: 4, sy: 2, block: true, colour: 'grey' },
	portal: 	{ sx: 2, sy: 3, block: false, colour: 'blue' },
	ocean: 		{ sx: 2, sy: 7, block: false, colour: 'blue' },
	sand_1: 	{ sx: 3, sy: 7, block: false, colour: 'sand' },
	sand_2: 	{ sx: 5, sy: 10, block: false, colour: 'sand' },
	forcefield: { sx: 1, sy: 7, block: false, colour: 'blue' },
	house: 		{ sx: 1, sy: 3, block: true, colour: 'shiny' },
	scythe: 	{ sx: 3, sy: 4, block: false, colour: 'shiny', drops: [{n:'scythe',c:1,mi:1,ma:1}], change: 'ground' },
	market: 	{ sx: 3, sy: 3, block: true, colour: 'shiny' },
	shopkeep: 	{ sx: 4, sy: 2, block: false, colour: 'white', isSecret: true },
	farmer: 	{ sx: 5, sy: 2, block: false, colour: 'white' },
	goalie: 	{ sx: 6, sy: 2, block: false, colour: 'white' },
	kiddo: 		{ sx: 7, sy: 2, block: false, colour: 'white' },
	sow: 		{ sx: 1, sy: 7, block: false, colour: 'desert', drops: [{n:'seeds',c:1,mi:0,ma:1}], change: 'ground'  },
	hole: 		{ sx: 2, sy: 3, block: true, colour: 'desert', drops: [{n:'rock',c:1,mi:-1,ma:-1}], change: 'ground' },
	crop: 		{ sx: 2, sy: 2, block: false, colour: 'flowers', drops: [{n:'crop',c:1,mi:1,ma:1}], change: 'sow' },
	torchpole: 	{ sx: 4, sy: 11, block: true, colour: 'grey' },
	wall: 		{ sx: 3, sy: 10, block: true, colour: 'grey' },
	carcass: 	{ sx: 5, sy: 11, block: false, colour: 'bloody' },
	shop_vert: 	{ sx: 0, sy: 13, block: true, colour: 'grey' },
	shop_llc: 	{ sx: 1, sy: 13, block: true, colour: 'grey' },
	shop_horz: 	{ sx: 2, sy: 13, block: true, colour: 'grey' },
	shop_lrc: 	{ sx: 3, sy: 13, block: true, colour: 'grey' },
	shop_ulc: 	{ sx: 4, sy: 13, block: true, colour: 'grey' },
	shop_urc: 	{ sx: 5, sy: 13, block: true, colour: 'grey' },
	rubble_1: 	{ sx: 0, sy: 15, block: true, colour: 'desert' },
	rubble_2: 	{ sx: 1, sy: 15, block: true, colour: 'desert' },
	rubble_3: 	{ sx: 2, sy: 15, block: true, colour: 'desert' },
	rubble_4: 	{ sx: 3, sy: 15, block: true, colour: 'desert' },
	rubble_5: 	{ sx: 3, sy: 14, block: true, colour: 'green' },
	cliff_1: 	{ sx: 2, sy: 14, block: true, colour: 'logcabin' },
	cliff_2: 	{ sx: 3, sy: 14, block: true, colour: 'logcabin' },
	house_ul: 	{ sx: 8, sy: 0, block: true, colour: 'logcabin' },
	house_ur: 	{ sx: 9, sy: 0, block: true, colour: 'logcabin' },
	house_ll: 	{ sx: 8, sy: 1, block: true, colour: 'logcabin' },
	house_lr: 	{ sx: 9, sy: 1, block: false, colour: 'logcabin', isDoor: true },
	hut_ul: 	{ sx: 8, sy: 2, block: true, colour: 'sand' },
	hut_ur: 	{ sx: 9, sy: 2, block: true, colour: 'sand' },
	hut_ll: 	{ sx: 8, sy: 3, block: true, colour: 'sand' },
	hut_lr: 	{ sx: 9, sy: 3, block: true, colour: 'sand' },
	door: 		{ sx: 0, sy: 16, block: false, colour: 'desert', isDoor: true },
	wall_2: 	{ sx: 1, sy: 16, block: true, colour: 'logcabin' },
	wall_3: 	{ sx: 2, sy: 16, block: true, colour: 'logcabin' },

	table: 		{ sx: 3, sy: 16, block: true, colour: 'logcabin' },
	nightstand: { sx: 4, sy: 16, block: true, colour: 'logcabin' },
	bed: 		{ sx: 5, sy: 16, block: true, colour: 'bloody' },
	bookshelf: 	{ sx: 4, sy: 17, block: true, colour: 'logcabin' },
	clothes: 	{ sx: 5, sy: 17, block: true, colour: 'bloody' },
	rug_1: 		{ sx: 6, sy: 17, block: false, colour: 'flowers' },
	rug_2: 		{ sx: 7, sy: 17, block: false, colour: 'flowers' }
}

var ENTITY = {
	detail: {
		spray: 		{ sx: 4, sy: 10 },
		grasstop: 	{ sx: 4, sy: 11 },
		doorglow: 	{ sx: 2, sy: 11 }
	},
	enemy: {
		smurg: 			{ sx: 0, sy: 8 },
		riversprite: 	{ sx: 1, sy: 8 }
	},
	treasure: {
		coin_1: { sx: 0, sy: 9 },
		coin_2: { sx: 1, sy: 9 },
		coin_3: { sx: 2, sy: 9 },
		coin_4: { sx: 3, sy: 9 },
		coin_5: { sx: 4, sy: 9 },
		coin_6: { sx: 5, sy: 9 },
		coin_7: { sx: 6, sy: 9 },
		coin_8: { sx: 7, sy: 9 }
	}
}

var WEAPON = {
	fists: {
		arr: [
			[0,0,0],
			[0,0,0],
			[0,1,0]
		]
	},
	dagger: {
		arr: [
			[0,0,0],
			[0,0,0],
			[1,0,1]
		]
	},
	mace: {
		arr: [
			[0,0,0],
			[0,0,0],
			[2,1,2]
		]
	},
	sword: {
		arr: [
			[0,0,0],
			[1,0,1],
			[0,1,0]
		]
	},
	flail: {
		arr: [
			[0,1,0],
			[2,0,2],
			[1,0,1]
		]
	},
	staff: {
		arr: [
			[0,1,0],
			[1,0,1],
			[0,1,0]
		]
	},
	whip: {
		arr: [
			[1,0,1],
			[0,0,0],
			[1,0,1]
		]
	},
	scythe: {
		arr: [
			[0,0,0],
			[1,0,1],
			[2,1,2]
		]
	}
}

var spritesheet = new Image();
	spritesheet.src = 'tiles_outline-export.png'; //tiles.png

var numbers = new Image();
	numbers.src = 'numbers-export.png'; //numbers.png

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

			var hasSecret = false;
			if (TILE[this.name].isSecret != undefined) hasSecret = TILE[this.name].isSecret;
			this.hasSecret = hasSecret;

			var isLoot = false;
			if (TILE[this.name].isLoot != undefined) isLoot = TILE[this.name].isLoot;
			this.isLoot = isLoot;

			var isDoor = false;
			if (TILE[this.name].isDoor != undefined) isDoor = TILE[this.name].isDoor;
			this.isDoor = isDoor;
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
		collect() {
			//collect treasure
			for (let b = 0; b < GAME.map.entities.length; b++) {
				if (GAME.map.entities[b].x == GAME.player.x && GAME.map.entities[b].y == GAME.player.y) {

					if (GAME.map.entities[b].whatIsIt == 'treasure') {
						GAME.money += GAME.map.entities[b].attr.value;
						updCoins();
						GAME.map.entities.splice(b, 1);
						render(GAME.map, 'mid');
					}

				}
			}

			//enter doorways
			if (GAME.map.arr[GAME.player.x][GAME.player.y].isDoor) {
				if (!GAME.inRoom) {
					for (let i=0; i < GAME.map.rooms.length; i++) {
						if (GAME.player.x == GAME.map.rooms[i].x && GAME.player.y == GAME.map.rooms[i].y) {
							GAME.roomNumber = i;
						}
					}

					GAME.player.RAMx = GAME.player.x;
					GAME.player.RAMy = GAME.player.y;

					GAME.player.x = GAME.map.rooms[GAME.roomNumber].a+Math.floor(GAME.map.rooms[GAME.roomNumber].w/2);
					GAME.player.y = GAME.map.rooms[GAME.roomNumber].b+GAME.map.rooms[GAME.roomNumber].h;

					GAME.RAMmap = GAME.map;
					GAME.map = GAME.map.rooms[GAME.roomNumber];
				} else {
					GAME.map.rooms[GAME.roomNumber] = GAME.map;
					GAME.map = GAME.RAMmap;

					GAME.player.x = GAME.player.RAMx;
					GAME.player.y = GAME.player.RAMy;
				}

				GAME.inRoom = !GAME.inRoom;
			}
		}
	}

	function updCoins() {
		$('#coins').html(getNumberDOM(GAME.money));
	}

	updCoins();

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

	//adding mobs/coins/details
	class Entity {
		constructor(whatIsIt, x, y, attr) { //sx and sy are spritesheet coordinates
			this.whatIsIt = whatIsIt;
			this.x = x;
			this.y = y;
			this.attr = attr;
		}
		sx() {
			return ENTITY[this.whatIsIt][this.attr.name].sx*32;
		}
		sy() {
			return ENTITY[this.whatIsIt][this.attr.name].sy*32;
		}
	}



	class Map {
		constructor() {
			this.arr = [];
			this.elevation = [];
			this.vision = [];
			this.entities = [];
			this.enemies = [];
			this.rooms = [];
		}
		addEntity(whatIsIt, x, y, attr) {
			if (firstZone && whatIsIt == 'enemy') {
				//
			} else {
				this.entities.push(new Entity(whatIsIt, x, y, attr));
			}
		}
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
					$('#inv .item').eq(oc).append(getNumberDOM(test[y]));
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

	//cool thing to activate
	/*setInterval(function() {
		seedDisplacement += 1;
		GAME.map = create();
		render(GAME.map, 'mid');
	}, 100);*/

	noise.seed(Math.random());

	function create() {
		var nMap = new Map();

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

		//generate forest biome
		var biome = generateBiome();

		/*console.log(
			'outer: trees: '+biome.outer.trees+'\n'+
			'       rocks: '+biome.outer.rocks+'\n'+
			'inner: dense: '+biome.inner.dense+'\n'+
			'       light: '+biome.inner.light+'\n'+
			'middle: '+biome.middle
		);*/

		//generate structures list UNUSED !!!
		var structs = [];

		for (var x = 0; x < GAME.canv.h; x++) {
			nMap.arr.push([]);
			nMap.elevation.push([]);
			nMap.vision.push([]);

			for (var y = 0; y < GAME.canv.h; y++) {

				var et = noise.perlin2(x / 8, (y+seedDisplacement) / 8);
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
					nMap.vision[x].push(t); //3.5 a good value for nightt1me
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

						if (Math.random() < GAME.chanceOf.monsterSpawn) { //1 in 100 chance?
							nMap.addEntity('enemy', x, y, {
								name: 'smurg',
								grave: 'bloodgrave',
								path: []
							});
						}

						if (Math.random() < GAME.chanceOf.lootSpawn) { //1 in 100 chance
							nMap.arr[x][y] = new Tile( rand(TILESET.lootBoxes) );
						}

					} else {
						nMap.arr[x].push(new Tile( rand(biome.inner.light) ));
					}

				} else { //outer (rest)

					if (et > 0.5) {
						nMap.arr[x].push(new Tile(	rand(biome.outer.trees) ));
					} else {
						nMap.arr[x].push(new Tile( rand(biome.outer.rocks) ));
					}

				}
			}
		}


		//spawning river !!!
		var ry = 0;

		while (ry < GAME.canv.h) {
			var dirs = ['left','right','down','down'];
			var dir = rand(dirs);
			var len = 1; //used to be random 1-3, but this is better
			while (len > 0) {
				nMap.arr[GAME.rx][ry] = new Tile('river');

				//spawning riversprites?
				if (Math.random() < GAME.chanceOf.monsterSpawn) { //1 in 100 chance?
					nMap.addEntity('enemy', GAME.rx, ry, {
						name: 'riversprite',
						grave: 'watergrave',
						path: []
					});
				}

				var way = [-1,1];
				var nway = rand(way);
				if (GAME.rx + nway > 2 && GAME.rx + nway < GAME.canv.h-2) {
					nMap.arr[GAME.rx + rand(way)][ry] = new Tile('river');
				}

				if (dir == 'left' && GAME.rx > 3) { //river cant go into the wall
					GAME.rx--;
				} else if (dir == 'right' && GAME.rx < GAME.canv.h-4) { //river cant go into the wall
					GAME.rx++;
				} else {
					ry++;
				}

				len--;
			}
		}

		//spawning walls ??
		var wlkr = 0;

		while (wlkr < GAME.canv.h) {
			var lft = Math.round(nMap.elevation[0][wlkr]*5);
			var rgh = Math.round(nMap.elevation[GAME.canv.h-1][wlkr]*5);

			while (lft > 0) {
				nMap.arr[lft-1][wlkr] = new Tile( rand(TILESET.cliff) );
				if (!firstZone) {
					if (Math.random() < 0.2) {
						nMap.addEntity('detail', lft-1, wlkr, {
							name: 'grasstop'
						});
					}
				} else if (wlkr > 5) {
					if (Math.random() < 0.2) {
						nMap.addEntity('detail', lft-1, wlkr, {
							name: 'grasstop'
						});
					}
				}
				lft--;
			}

			while (rgh > 0) {
				nMap.arr[GAME.canv.h - rgh][wlkr] = new Tile( rand(TILESET.cliff) );
				if (!firstZone) {
					if (Math.random() < 0.2) {
						nMap.addEntity('detail', GAME.canv.h - rgh, wlkr, {
							name: 'grasstop'
						});
					}
				} else if (wlkr > 5) {
					if (Math.random() < 0.2) {
						nMap.addEntity('detail', GAME.canv.h - rgh, wlkr, {
							name: 'grasstop'
						});
					}
				}
				rgh--;
			}

			wlkr++;
		}

		//pathways
		/*for (let i = 0; i < GAME.canv.h; i++) {
			nMap.arr[0][i] = new Tile( rand(TILESET.cliff) );
			nMap.arr[GAME.canv.h-1][i] = new Tile( rand(TILESET.cliff) );
		}*/

		if (firstZone) {
			//spawning cliff ??
			var cs = 0;
			var dFt = 0; //distanceFromTop

			while (cs < GAME.canv.h) {
				var ychange = Math.round(nMap.elevation[cs][dFt]*10);
				var mu = dFt+ychange;
				
				var foundTile = nMap.arr[cs][mu].name;
				if (foundTile == 'river') {
					nMap.arr[cs][mu] = new Tile( 'river_vert' );
					nMap.arr[cs][mu+1] = new Tile( 'river_vert' );
					nMap.arr[cs][mu+2] = new Tile( 'river_vert' );
					nMap.arr[cs][mu+3] = new Tile( 'river_vert' );
					nMap.arr[cs][mu+4] = new Tile( 'river' );

					nMap.addEntity('detail', cs, mu+3, {
						name: 'spray'
					});
				} else {
					nMap.arr[cs][mu] = new Tile( rand(TILESET.cliff) );
					nMap.arr[cs][mu+1] = new Tile( rand(TILESET.cliff) );
					nMap.arr[cs][mu+2] = new Tile( rand(TILESET.cliff) );
					nMap.arr[cs][mu+3] = new Tile( rand(TILESET.cliff) );
					nMap.arr[cs][mu+4] = new Tile( rand(TILESET.cliff) );

					if (Math.random() > 0.5){
						nMap.addEntity('detail', cs, mu, {
							name: 'grasstop'
						});
					}
				}

				while (mu > 0) {
					var damn = nMap.arr[cs][mu-1].name;
					if (damn == 'river') {
						nMap.arr[cs][mu-1] = new Tile( 'river' );
					} else {
						nMap.arr[cs][mu-1] = new Tile( rand(biome.outer.trees) );
					}

					mu--;
				}
				cs++;
			}
		}


		//making a shop !
		/*
		structs.push({
			type: 'shop',
			x: 1,
			y: 1
		});
		*/


		for (let i=0; i < structs.length; i++) {
			var s = structs[i];
			createStructure(s.type, s.x, s.y, s.h, s.w);
		}

		function createStructure(type, x, y, height, width) {
			if (BUILD[type] != undefined) {
				for (let a=0; a < BUILD[type].arr[0].length; a++) {
					for (let b=0; b < BUILD[type].arr.length; b++) {
						if (x+a < GAME.canv.h && y+b < GAME.canv.h) {
							if (BUILD[type].arr[b][a] == '') {
								//do nothing
							} else {
								nMap.arr[x+a][y+b] = new Tile( BUILD[type].arr[b][a] );
							}
						}
					}
				}
			} else {
				for (let a=0; a < width; a++) {
					for (let b=0; b < height; b++) {
						if (x+a < GAME.canv.h && y+b < GAME.canv.h) {
							nMap.arr[x+a][y+b] = new Tile( 'flowers_1' );
						}
					}
				}
			}
		}



		//spawn cabins!
		var cabinSpawnTries = 1;
		while (cabinSpawnTries > 0) {
			var r = {
				x: randInt(2, GAME.canv.h-3),
				y: randInt(2, GAME.canv.h-3)
			}

			function isTreeTile(x,y) {
				if (TILESET.trees.indexOf(nMap.arr[x][y].name) != -1) {
					return true;
				} else {
					return false;
				}
			}

			if (!firstZone) {
				if (isTreeTile(r.x-1,r.y-1) && isTreeTile(r.x,r.y-1) && isTreeTile(r.x-1,r.y) && isTreeTile(r.x,r.y)) {
					nMap.arr[r.x-1][r.y-1] = new Tile( 'house_ul' );
					nMap.arr[r.x][r.y-1] = new Tile( 'house_ur' );
					nMap.arr[r.x-1][r.y] = new Tile( 'house_ll' );
					nMap.arr[r.x][r.y] = new Tile( 'house_lr' );

					nMap.addEntity('detail', r.x, r.y, {
						name: 'doorglow'
					});

					nMap.rooms.push( createRoom(r.x, r.y) );
				}
			}

			cabinSpawnTries--;
		}





		//nMap.arr[x+a][y+b] = new Tile( 'ground' );

		//console.log('BAD x+a: '+(x+a)+' y+b: '+(y+b)+' '+'max: '+(GAME.canv.h-1));

		firstZone = false;
		return nMap;
	}

	//create rooms
	function createRoom(x, y) {
		var nMap = new Map();

		var maxTreasure = 4;

		nMap.x = x;
		nMap.y = y;
		nMap.w = 6;
		nMap.h = 6;
		nMap.a = Math.floor(GAME.canv.h/2 - nMap.w/2);
		nMap.b = Math.floor(GAME.canv.h/2 - nMap.h/2);

		for (var x = 0; x < GAME.canv.h; x++) {
			nMap.arr.push([]);
			for (var y = 0; y < GAME.canv.h; y++) {
				if (x < nMap.a+nMap.w+1 && x >= nMap.a-1 && y < nMap.b+nMap.h+1 && y >= nMap.b-1) {
					if (x < nMap.a+nMap.w && x >= nMap.a && y < nMap.b+nMap.h && y >= nMap.b) {
						
						if (Math.random() > 0.3) {
							nMap.arr[x].push(new Tile( 'ground' ));
						} else {
							if (maxTreasure > 0) {
								nMap.arr[x].push(new Tile( rand(TILESET.lootBoxes) ));
								maxTreasure--;
							} else {
								nMap.arr[x].push(new Tile( rand(TILESET.house) ));
							}
						}

					} else {
						if (y == nMap.b-1 || y == nMap.b+nMap.h) {
							nMap.arr[x].push(new Tile( 'wall_2' ));
						} else {
							nMap.arr[x].push(new Tile( 'wall_3' ));
						}
					}
				} else {
					nMap.arr[x].push(new Tile( 'ground' ));
				}
			}
		}

		nMap.arr[nMap.a+Math.floor(nMap.w/2)][nMap.b+nMap.h-1] = new Tile( 'ground' );
		nMap.arr[nMap.a+Math.floor(nMap.w/2)][nMap.b+nMap.h] = new Tile( 'door' );
		nMap.arr[nMap.a+Math.floor(nMap.w/2)][nMap.b+nMap.h+1] = new Tile( 'invisidoor' );

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

		//draw tiles
		for (var x = 0; x < GAME.canv.h; x++) {
			for (var y = 0; y < GAME.canv.h; y++) {
				var pos = position(x, y, dir);

				ctx.beginPath();
				ctx.rect(pos.px, pos.py, GAME.canv.size, GAME.canv.size);
				ctx.fillStyle = mapToRender.arr[x][y].colour;
				ctx.fill();

				ctx.drawImage(spritesheet, mapToRender.arr[x][y].sx(), mapToRender.arr[x][y].sy(), 64, 64, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
			}
		}


		//render weapon!

		if (GAME.showDir) {
			if (GAME.player.targetFar) {
				for (let a=0; a < WEAPON[GAME.weapon].arr[0].length; a++) {
					for (let b=0; b < WEAPON[GAME.weapon].arr.length; b++) {

						var ww = WEAPON[GAME.weapon].arr[0].length;
						var wd = Math.floor(ww/2);

						var pos = position(GAME.player.x+a-wd, GAME.player.y+b-wd, dir);

						if (GAME.weaponMatrix.length > 0) { //just make sure it's defined
							if (GAME.weaponMatrix[a][b] == 1) {
								ctx.drawImage(numbers, 0*32, 3*32, 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
							} else if (GAME.weaponMatrix[a][b] == 2) {
								ctx.drawImage(numbers, 0*32, 3*32, 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size); //5*32, 10*32
							}
						}

					}
				}

				var pos = position(GAME.player.x+GAME.player.dir[0], GAME.player.y+GAME.player.dir[1], dir);
				ctx.drawImage(numbers, 2*32, 3*32, 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
			} else {
				var pos = position(GAME.player.x, GAME.player.y, dir);
				ctx.drawImage(numbers, 2*32, 3*32, 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
			}
		}

		//render entities !
		for (let i = 0; i < GAME.map.entities.length; i++) {
			let e = GAME.map.entities[i];

			var pos = position(e.x, e.y, dir);

			if (GAME.map.entities[i].whatIsIt == 'treasure') {
				ctx.save();
				ctx.beginPath();
				ctx.rect(pos.px+4, pos.py+4, GAME.canv.size-8, GAME.canv.size-8);
				ctx.fillStyle = "#252525";
				ctx.fill();
				ctx.restore();
			}

			ctx.drawImage(numbers, e.sx(), e.sy(), 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
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
					var pos = position(x, y, dir);

					var mapx = x - (GAME.player.x - Math.floor(GAME.canv.h/2));
					var mapy = y - (GAME.player.y - Math.floor(GAME.canv.h/2));

					if (GAME.map.vision[mapx] != undefined) {
						if (GAME.map.vision[mapx][mapy] != undefined) {
						;	ctx.globalAlpha = GAME.map.vision[mapx][mapy]*3.5; //3.5 a good value for nighttime
						} else {
						ctx.globalAlpha = 1;
						}
					} else {
						ctx.globalAlpha = 1;
					}

					ctx.beginPath();
					ctx.rect(pos.px, pos.py, GAME.canv.size, GAME.canv.size);
					ctx.fillStyle = "#252525";
					ctx.fill();

					ctx.globalAlpha = 1;
				}
			}
		}

		if (renderDebugMode) {
			for (let x = 0; x < GAME.map.arr[0].length; x++) {
				for (let y = 0; y < GAME.map.arr.length; y++) {
					var xsize = x*GAME.canv.size + x*GAME.canv.pixel + canvas.width/3;
					var ysize = y*GAME.canv.size + y*GAME.canv.pixel + canvas.width/3;

					ctx.save();

					ctx.beginPath();
					//ctx.globalAlpha = GAME.map.elevation[x][y]; //Used to visualise the elevation, unused now because highest values arent near 1.
					if (TILE[GAME.map.arr[x][y].name].block) {
						ctx.fillStyle = 'Coral';
					} else {
						if (GAME.map.arr[x][y].name != 'ground') {
							ctx.fillStyle = 'DarkSlateGrey';
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

	function playerTakesDamage() {
		disableInput = true;
		var cycle = 500;
		var iterations = Math.floor(GAME.canv.h/2);
		var ringSize = 5;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		$('#player').addClass('hit');

		for (let i=0; i < iterations; i++) {
			setTimeout(function() {
				var mapToRender = GAME.map;

				//Add this to make it a pulsing ring.
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				for (var x = 0; x < GAME.canv.h; x++) {
					for (var y = 0; y < GAME.canv.h; y++) {
						var nx = x + GAME.player.x - Math.floor(GAME.canv.h/2);
						var ny = y + GAME.player.y - Math.floor(GAME.canv.h/2);

						var pos = position(nx, ny, 'mid');

						if (GAME.map.vision[nx] != undefined) {
							if (GAME.map.vision[nx][ny] != undefined) {
								ctx.save();
								ctx.beginPath();
								ctx.rect(pos.px, pos.py, GAME.canv.size, GAME.canv.size);
								ctx.fillStyle = '#ff5050';

								var tile_vision = GAME.map.vision[x][y]*10 * 2.5; //the multiplication is the ratio of how much you can see
								if (tile_vision < i && tile_vision > i-ringSize) {
									if (tile_vision < iterations-ringSize-1) {
										ctx.fill();
										ctx.drawImage(spritesheet, mapToRender.arr[nx][ny].sx(), mapToRender.arr[nx][ny].sy(), 64, 64, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
									}
								}

								ctx.restore();
							}
						}
					}
				}
			}, (cycle/iterations)*i);
		}

		setTimeout(function() {
			disableInput = false;
			$('#player').removeClass('hit');
			render(GAME.map,'mid');
		}, cycle);
	}

	function sonarSense() {
		disableInput = true;
		var cycle = 500;
		var iterations = Math.floor(GAME.canv.h/2);
		var ringSize = 3;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (let i=0; i < iterations; i++) {
			setTimeout(function() {
				var mapToRender = GAME.map;

				//Add this to make it a pulsing ring.
				//ctx.clearRect(0, 0, canvas.width, canvas.height);

				for (var x = 0; x < GAME.canv.h; x++) {
					for (var y = 0; y < GAME.canv.h; y++) {
						var nx = x + GAME.player.x - Math.floor(GAME.canv.h/2);
						var ny = y + GAME.player.y - Math.floor(GAME.canv.h/2);

						var pos = position(nx, ny, 'mid');

						if (GAME.map.vision[nx] != undefined) {
							if (GAME.map.vision[nx][ny] != undefined) {
								ctx.save();
								ctx.beginPath();
								ctx.rect(pos.px, pos.py, GAME.canv.size, GAME.canv.size);

								if (GAME.map.arr[nx][ny].hasSecret) {
									ctx.fillStyle = 'FloralWhite';
								} else if (GAME.map.arr[nx][ny].isLoot) {
									ctx.fillStyle = 'Khaki';
								} else {
									if (GAME.map.arr[nx][ny].name == 'river') {
										ctx.fillStyle = 'mediumturquoise';
									} else {
										if (TILE[GAME.map.arr[nx][ny].name].block) {
											ctx.fillStyle = 'SeaGreen';
										} else {
											ctx.fillStyle = 'DarkSlateGrey';
										}
									}
								}

								var tile_vision = GAME.map.vision[x][y]*10 * 1; //the multiplication is the ratio of how much you can see
								if (tile_vision < i && tile_vision > i-ringSize) {
									if (tile_vision < iterations-ringSize-1) {
										ctx.fill();
										ctx.drawImage(spritesheet, mapToRender.arr[nx][ny].sx(), mapToRender.arr[nx][ny].sy(), 64, 64, pos.px, pos.py, GAME.canv.size, GAME.canv.size);

										for (let i=0; i < GAME.map.entities.length; i++) {
											if (nx == GAME.map.entities[i].x && ny == GAME.map.entities[i].y) {
												switch (GAME.map.entities[i].whatIsIt) {
													case 'enemy':
														ctx.drawImage(numbers, 2*32, 10*32, 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
														break;
													case 'treasure':
														ctx.drawImage(numbers, 3*32, 10*32, 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
														break;
													default:
														//dont draw
												}
											}
										}
									}
								}
								ctx.restore();
							}
						}
					}
				}
			}, (cycle/iterations)*i);
		}

		setTimeout(function() {
			disableInput = false;
		}, cycle);
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
					walk('up');
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
					changeDir('up');
					render(GAME.map, 'mid');
					break;
				case 65: //A key
					changeDir('left');
					render(GAME.map, 'mid');
					break;
				case 83: //S key
					changeDir('down');
					render(GAME.map, 'mid');
					break;
				case 68: //D key
					changeDir('right');
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

				case 86: //V key
					sonarSense();
					break;

				case 66: //B key
					//
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

	function changeDir(dir) {
		switch (dir) {
			case 'up':
				GAME.player.dir = [DISP.up.x-1,DISP.up.y-1];
				GAME.player.facing = 'up';
				break;
			case 'down':
				GAME.player.dir = [DISP.down.x-1,DISP.down.y-1];
				GAME.player.facing = 'down';
				break;
			case 'left':
				GAME.player.dir = [DISP.left.x-1,DISP.left.y-1];
				GAME.player.facing = 'left';
				break;
			case 'right':
				GAME.player.dir = [DISP.right.x-1,DISP.right.y-1];
				GAME.player.facing = 'right';
				break;
			default:
				//default
		}

		GAME.weaponMatrix = WEAPON[GAME.weapon].arr.slice(0);

		//https://code.likeagirl.io/rotate-an-2d-matrix-90-degree-clockwise-without-create-another-array-49209ea8b6e6
		function rotate(matrix) {          // function statement
		    const N = matrix.length - 1;   // use a constant
		    // use arrow functions and nested map;
		    const result = matrix.map((row, i) => 
		         row.map((val, j) => matrix[N - j][i])
		    );
		    matrix.length = 0;       // hold original array reference
		    matrix.push(...result);  // Spread operator
		    return matrix;
		}

		for (let i=0; i < DISP[GAME.player.facing].r; i++) {
			GAME.weaponMatrix = rotate(GAME.weaponMatrix);
		}

		GAME.showDir = true;

		//make enemies move (enemys turn; not in walk())
		enemysTurn();
	}

	function walk(choice) {
		var d;
		if (choice == undefined) {
			d = rand(DISP.dirs);
		} else {
			d = choice;
		}

		switch (d) {
			case 'up':
				if (GAME.map.arr[GAME.player.x][GAME.player.y-1].colDetect()) {
					GAME.player.y--;
				} //else { walk(); }
				changeDir('up');
				break;
			case 'down':
				if (GAME.map.arr[GAME.player.x][GAME.player.y+1].colDetect()) {
					GAME.player.y++;
				} //else { walk(); }
				changeDir('down');
				break;
			case 'left':
				if (GAME.map.arr[GAME.player.x-1][GAME.player.y].colDetect()) {
					GAME.player.x--;
				} //else { walk(); }
				changeDir('left');
				break;
			case 'right':
				if (GAME.map.arr[GAME.player.x+1][GAME.player.y].colDetect()) {
					GAME.player.x++;
				} //else { walk(); }
				changeDir('right');
				break;
			default:
				//default
		}

		//things to do
		GAME.map.arr[GAME.player.x][GAME.player.y].collect();

		//render the map (so that the white box appears!)
		render(GAME.map, 'mid');

		//move the player
		renderPlayer();
	}

	function enemysTurn() {
		///////////////////

			easystar.setGrid(GAME.grid);
			easystar.enableSync();
			easystar.setIterationsPerCalculation(1000);

		///////////////////

		easystar.stopAvoidingAllAdditionalPoints();

		function enemyWalkTowardsPlayer(i) {
			easystar.findPath(GAME.map.entities[i].x, GAME.map.entities[i].y, GAME.player.x, GAME.player.y, function( path ) {
				if (path === null) {
					//GAME.enemies.splice(i, 1);
				} else {
					if (path.length >= 1) {
						GAME.map.entities[i].x = path[1].x;
						GAME.map.entities[i].y = path[1].y;
						easystar.avoidAdditionalPoint(path[1].x, path[1].y);
					}
				}
			});
		}

		function enemyWalkRandomly(i) {
			easystar.findPath(GAME.map.entities[i].x, GAME.map.entities[i].y, randInt(0,GAME.canv.h-1), randInt(0,GAME.canv.h-1), function( path ) {
				if (path === null) {
					//GAME.enemies.splice(i, 1);
				} else {
					if (path.length >= 1) {
						GAME.map.entities[i].x = path[1].x;
						GAME.map.entities[i].y = path[1].y;
						easystar.avoidAdditionalPoint(path[1].x, path[1].y);
					}
				}
			});
		}

		for (let i = 0; i < GAME.map.entities.length; i++) {
			if (GAME.map.entities[i].whatIsIt == 'enemy') {
				if (GAME.map.entities[i].attr.name == 'smurg') {
					if (GAME.map.arr[GAME.player.x][GAME.player.y].name != 'river') {
						enemyWalkTowardsPlayer(i);
					}
				} else if (GAME.map.entities[i].attr.name == 'riversprite') {
					if (GAME.map.arr[GAME.player.x][GAME.player.y].name == 'river') {
						enemyWalkTowardsPlayer(i);
					} else {
						enemyWalkRandomly(i);
					}
				}
			}
		}

		easystar.calculate();

		for (let i = 0; i < GAME.map.entities.length; i++) {
			if (GAME.map.entities[i].x == GAME.player.x && GAME.map.entities[i].y == GAME.player.y) {
				if (GAME.map.entities[i].whatIsIt == 'enemy') {
					GAME.map.entities.splice(i, 1);

					GAME.lives--;

					if (GAME.lives < 0) {
						$('#canvas').addClass('death');
						GAME.nighttime = true;
						$('#player').hide();
						GAME.showDir = false;
						GAME.map.arr[GAME.player.x][GAME.player.y] = new Tile('grave_1');
						render(GAME.map, 'mid');
						disableInput = true;
						/*setTimeout(function() {
							alert('You died!');
						}, 100);*/
					} else {
						playerTakesDamage();
						playerAction();
					}

					updHealth();
				}
			}
		}
	}

	function updHealth() {
		$('#lives').html('');
		for (let i=0; i < GAME.lives; i++) {
			$('#lives').append('<div class="num heart"></div>');
		}
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

	function updKills() {
		$('#kills').html(getNumberDOM(GAME.kills));
	}

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

	function randomPlaceOneMoney(x, y) {
		var value = randInt(0,7);
		var coin = TILESET.treasure[value];
		var dirv = [0,1,2,3];

		var check = 4;
		while (check > 0) {
			var s = rand(dirv);
			var rng = DISP[DISP.dirs[s]];
			if (TILE[GAME.map.arr[x + rng.x - 1][y + rng.y - 1].name].block != true) {
				GAME.map.addEntity('treasure', x + rng.x - 1, y + rng.y - 1, {
					name: coin,
					value: value
				});
				check = 0;
			} else {
				dirv.splice(s, 1);
				check--;
			}
		}
	}

	function tryToCollect(cx, cy) {
		var areAttacking = false;

		//firstly, try to kill the enemy
		for (let i=0; i < GAME.map.entities.length; i++) {
			if (GAME.map.entities[i].whatIsIt == 'enemy') {
				if (GAME.map.entities[i].x == cx && GAME.map.entities[i].y == cy) {
					if (GAME.map.entities[i].attr.grave != undefined) {
						GAME.map.arr[GAME.map.entities[i].x][GAME.map.entities[i].y] = new Tile( GAME.map.entities[i].attr.grave );
					} else {
						GAME.map.arr[GAME.map.entities[i].x][GAME.map.entities[i].y] = new Tile( 'bloodgrave' );
					}

					//spawn money
					randomPlaceOneMoney(GAME.map.entities[i].x, GAME.map.entities[i].y);

					GAME.map.entities.splice(i, 1);
					GAME.kills++;
					render(GAME.map, 'mid');
					updKills();

					areAttacking = true;
				}
			}
		}

		var tname = GAME.map.arr[cx][cy].name;

		if (GAME.player.x < cx-1 || GAME.player.x > cx+1 || GAME.player.y < cy-1 || GAME.player.y > cy+1) {
			//false
		} else if (!areAttacking) {
			if (TILE[tname].change != undefined) { //first check for drops
				GAME.map.arr[cx][cy] = new Tile(TILE[tname].change);

				if (TILE[tname].drops != undefined) {
					for (let i = 0; i < TILE[tname].drops.length; i++) {
						var drops = TILE[tname].drops[i];
						if (Math.random() <= drops.c) {
							addItem(drops.n, randInt(drops.mi, drops.ma));
						}
					}
				}

				if (TILE[tname].isLoot == true) {
					randomPlaceOneMoney(cx, cy);
				}

				render(GAME.map, 'mid');
				playerAction();
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

		//render the mid just in case ;)
		render(GAME.map, 'mid');

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

		//this is for sliding the world down, which is the only one supported right now
		seedDisplacement += GAME.canv.h;
	}






	/*

	class Fuck {
		constructor() {
			this.hgjkwh = [];
		}
		test() {
			this.hgjkwh.push('test');
			console.log(this.hgjkwh);
		}
	}

	var tetje = [];

	tetje = new Fuck();

	tetje.test();

	*/















	//last minute inits
	GAME.map = create();
	render(GAME.map, 'mid');

	updKills();
	updHealth();

	changeDir('down');
	renderPlayer();

}); //end of on.load












function position(vx, vy, dir) { //value
	var x = GAME.canv.size * (vx + GAME.canv.h*DISP[dir].x);
	var y = GAME.canv.size * (vy + GAME.canv.h*DISP[dir].y);

	return {
		px: x,
		py: y
	}
}

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
		case 'logcabin':
			clr = [randInt(10, 20), randInt(30, 50), randInt(40, 50)];
			break;
		default:
			return 'transparent';
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

function getNumberDOM(num) {
	var final = '';
	var numS = num.toString();
	for (let i=0; i < numS.length; i++) {
		final += '<div class="num ';
		final += numToWord(numS.charAt(i));
		final += '"></div>';
	}
	return final;
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