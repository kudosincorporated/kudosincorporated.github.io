


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
	speed: 800
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
	grass: ['grass_1','grass_2','herb_3','ground','ground','ground'],
	forest: ['tree_1','tree_2','tree_3','rocks_1','rocks_2'],
	trees: ['tree_1','tree_2','tree_3','tree_4'],
	rocks: ['rocks_1','rocks_2','cave_clsd']
}

var TILE = {
	tree_1:		{ sx: 0, sy: 0, block: true, colour: 'green', drops: [{n:'timber',c:1,mi:1,ma:2},{n:'acorns',c:1,mi:1,ma:2}], change: 'stump' },
	tree_2:		{ sx: 1, sy: 0, block: true, colour: 'green', drops: [{n:'timber',c:1,mi:1,ma:1},{n:'acorns',c:1,mi:1,ma:2}], change: 'stump' },
	tree_3:		{ sx: 2, sy: 0, block: true, colour: 'green', drops: [{n:'timber',c:1,mi:1,ma:3},{n:'acorns',c:1,mi:1,ma:2}], change: 'stump' },
	tree_4:		{ sx: 3, sy: 0, block: true, colour: 'green', drops: [{n:'timber',c:1,mi:1,ma:3},{n:'acorns',c:1,mi:1,ma:2}], change: 'stump' },
	stump:		{ sx: 3, sy: 5, block: true, colour: 'green', drops: [], change: 'ground' },
	cave:		{ sx: 0, sy: 3, block: false, colour: 'desert' },
	cave_clsd: 	{ sx: 0, sy: 6, block: true, colour: 'desert' },
	rocks_1: 	{ sx: 4, sy: 0, block: true, colour: 'desert', drops: [{n:'rock',c:1,mi:2,ma:3}], change: 'rocks_2' },
	rocks_2: 	{ sx: 7, sy: 0, block: true, colour: 'desert', drops: [{n:'rock',c:1,mi:1,ma:2}], change: 'ground' },
	bush: 		{ sx: 6, sy: 0, block: true, colour: 'green' },
	ground:		{ sx: 6, sy: 7, block: false },
	herb_1: 	{ sx: 0, sy: 2, block: false, colour: 'green' },
	herb_2: 	{ sx: 1, sy: 2, block: false, colour: 'green' },
	herb_3: 	{ sx: 2, sy: 2, block: false, colour: 'green', drops: [{n:'jute',c:1,mi:1,ma:1}], change: 'ground' },
	herb_4: 	{ sx: 3, sy: 2, block: false, colour: 'green' },
	flowers_1: 	{ sx: 6, sy: 3, block: false, colour: 'flowers' },
	flowers_2: 	{ sx: 7, sy: 3, block: false, colour: 'flowers' },
	grass_1: 	{ sx: 1, sy: 6, block: false, colour: 'green', drops: [{n:'seeds',c:1,mi:1,ma:2}], change: 'ground' },
	grass_2: 	{ sx: 2, sy: 6, block: false, colour: 'green', drops: [{n:'seeds',c:1,mi:1,ma:2}], change: 'ground' },
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
	river: 		{ sx: 3, sy: 6, block: true, colour: 'blue', drops: [], change: 'ground' },
	bridge: 	{ sx: 5, sy: 6, block: false, colour: 'desert', drops: [{n:'timber',c:1,mi:1,ma:1}], change: 'ground' },
	crate: 		{ sx: 4, sy: 6, block: true, colour: 'desert' },
	grave_1: 	{ sx: 4, sy: 3, block: true, colour: 'grey' },
	grave_2: 	{ sx: 5, sy: 3, block: true, colour: 'grey' },
	npc_1: 		{ sx: 4, sy: 2, block: true, colour: 'grey' },
	portal: 	{ sx: 2, sy: 3, block: false, colour: 'blue' },
	ocean: 		{ sx: 2, sy: 7, block: false, colour: 'blue' },
	sand: 		{ sx: 3, sy: 7, block: false, colour: 'sand' },
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
	crop: 		{ sx: 2, sy: 2, block: false, colour: 'flowers', drops: [{n:'crop',c:1,mi:1,ma:1}], change: 'sow' }
}

var spritesheet = new Image();
	spritesheet.src = 'tiles_outline.png'; //tiles.png

$(window).on('load', function() {

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");

	var hw = GAME.canv.size*GAME.canv.h + GAME.canv.pixel*(GAME.canv.h-1);

	canvas.width = canvas.height = hw*3;

	console.log(canvas.width);

	$('#game').css({
		'height':(hw+GAME.canv.pixel*2)+'px',
		'width':(hw+GAME.canv.pixel*2)+'px'
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
		/*collect() {
			var item = GAME.map[GAME.player.x][GAME.player.y].name;
			if (TILE[item].collect == true) {
				addItem(item, 1);
				GAME.map[GAME.player.x][GAME.player.y] = new Tile('ground');
			}
			render(GAME.map, 'mid');
		}*/
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

	/*function addItem(name, amt) {
		if (GAME.inv[name] == undefined) { //if the item has not been picked up
			GAME.inv[name] = new Item(name, amt);
			var string = getNumberString(GAME.inv[name].amt);
			$('#inv').append('<div class="item"><span class="img '+name+'"></span><span class="num '+numToWord(string.charAt(0))+'"></span><span class="num '+numToWord(string.charAt(1))+'"></span><span class="name">'+name+'</span></div>');
		} else {
			GAME.inv[name].amt += amt;
			var string = getNumberString(GAME.inv[name].amt);
			$('#inv .item .name:contains('+name+')').parent().replaceWith('<div class="item"><span class="img '+name+'"></span><span class="num '+numToWord(string.charAt(0))+'"></span><span class="num '+numToWord(string.charAt(1))+'"></span><span class="name">'+name+'</span></div>');
		}
	}*/

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
		for (var x = 0; x < GAME.canv.h; x++) {
			nMap.arr.push([]);
			nMap.elevation.push([]);
			nMap.vision.push([]);

			for (var y = 0; y < GAME.canv.h; y++) {

				var evalue = noise.perlin2(x / 8, y / 4);
				var et = (evalue+1)/2;

				//making a circle
					var t = 0;
					var distanceX = (Math.floor(GAME.canv.h/2) - x) * (Math.floor(GAME.canv.h/2) - x);
					var distanceY = (Math.floor(GAME.canv.h/2) - y) * (Math.floor(GAME.canv.h/2) - y);
					var distanceToCenter = Math.sqrt(distanceX + distanceY);
					distanceToCenter = distanceToCenter / (GAME.canv.h/2);
					t += distanceToCenter;
					///////////////////////
					nMap.vision[x].push(t*3.5); //3.5 a good value for nightt1me
					///////////////////////
					t = Math.abs(t-1);

				et += t; //add multiplication?
				nMap.elevation[x].push(et);

				if (et > 1.3) {
					nMap.arr[x][y] = new Tile(rand(TILESET.grass));
				} else if (et > 0.7) {
					var gvalue = noise.perlin2(x / 6, y / 6);
					var gt = (gvalue+1)/2;

					if (gt < 0.5) {
						nMap.arr[x].push(new Tile('ground'));
					} else {
						nMap.arr[x][y] = new Tile(rand(TILESET.grass));
					}

					var tvalue = noise.perlin2(x / 8, y / 4);
					var tt = (tvalue+1)/2;

					if (tt < 0.5) {
						//nothing
					} else {
						nMap.arr[x][y] = new Tile(rand(TILESET.forest));
					}
				} else if (et > 0.6) {
					nMap.arr[x][y] = new Tile(rand(TILESET.grass));
				} else {
					/*if (y > GAME.canv.h/1.5) {
						GAME.map[x][y] = new Tile(rand(TILESET.forest));
					} else {
						GAME.map[x][y] = new Tile('ground');
					}*/
					
					//GAME.map[x][y] = new Tile('ground');

					nMap.arr[x][y] = new Tile(rand(TILESET.forest));
				}
			}
		}

		//spawning river !!!
		ry = 0;

		while (ry < GAME.canv.h) {
			var dirs = ['left','right','down','down'];
			var dir = rand(dirs);
			var len = randInt(1,3);
			while (len > 0) {
				nMap.arr[GAME.rx][ry] = new Tile('river');

				var way = [-1,1];
				var nway = rand(way);
				if (GAME.rx + nway > 2 && GAME.rx + nway < GAME.canv.h-2) {
					nMap.arr[GAME.rx + rand(way)][ry] = new Tile('river');
				}

				if (dir == 'left' && GAME.rx > 1) {
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
		for (let i = 0; i < GAME.canv.h; i++) {
			nMap.arr[Math.floor(GAME.canv.h/2)][i] = new Tile(rand(TILESET.grass));
			//nMap.arr[i][Math.floor(GAME.canv.h/2)] = new Tile(rand(TILESET.grass));
		}
		
		/*
		//house
		for (let x = Math.floor(GAME.canv.h/2)-1; x < Math.floor(GAME.canv.h/2)+2; x++) {
			for (let y = 1; y < 4; y++) {
				GAME.map[x][y] = new Tile('ground');
			}
		}

		//market
		for (let x = Math.floor(GAME.canv.h/2)-1; x < Math.floor(GAME.canv.h/2)+2; x++) {
			for (let y = GAME.canv.h-4; y < GAME.canv.h-1; y++) {
				GAME.map[x][y] = new Tile('ground');
			}
		}

		GAME.map[Math.floor(GAME.canv.h/2)][2] = new Tile('house');

		GAME.map[Math.floor(GAME.canv.h/2)][GAME.canv.h-3] = new Tile('market');
		//GAME.map[Math.floor(GAME.canv.h/2)][GAME.canv.h-2] = new Tile('shopkeep');
		*/

		/*
		for (let i = 0; i < GAME.canv.h; i++) {
			nMap.arr[0][i] = new Tile(rand(TILESET.forest));
			nMap.arr[GAME.canv.h-1][i] = new Tile(rand(TILESET.forest));
			nMap.arr[i][0] = new Tile(rand(TILESET.forest));
			nMap.arr[i][GAME.canv.h-1] = new Tile(rand(TILESET.forest));
		}
		*/

		nMap.arr[Math.floor(GAME.canv.h/2)][0] = new Tile('ground');
		nMap.arr[Math.floor(GAME.canv.h/2)][GAME.canv.h-1] = new Tile('ground');

		/*GAME.map[0][Math.floor(GAME.canv.h/2)] = new Tile('cave_clsd');
		GAME.map[Math.floor(GAME.canv.h/2)][0] = new Tile('cave');
		GAME.map[GAME.canv.h-1][Math.floor(GAME.canv.h/2)] = new Tile('cave_clsd');
		GAME.map[Math.floor(GAME.canv.h/2)][GAME.canv.h-1] = new Tile('cave');*/

		/*GAME.map[2][2] = new Tile('house');
		GAME.map[GAME.canv.h-3][2] = new Tile('house');
		GAME.map[2][GAME.canv.h-3] = new Tile('house');
		GAME.map[GAME.canv.h-3][GAME.canv.h-3] = new Tile('house');*/



		return nMap;
	}

	function render(mapToRender, dir) {
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
							ctx.beginPath();
							ctx.rect(xsize+2, ysize+2, GAME.canv.size-4, GAME.canv.size-4);
							ctx.strokeStyle = "white";
							ctx.lineWidth = 4;
							ctx.stroke();
						}
					} else {
						if (x == GAME.player.x && y == GAME.player.y) {
							ctx.beginPath();
							ctx.rect(xsize+2, ysize+2, GAME.canv.size-4, GAME.canv.size-4);
							ctx.strokeStyle = "white";
							ctx.lineWidth = 4;
							ctx.stroke();
						}
					}
				}
			}
		}

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

		/*
		for (let x = 0; x < GAME.map.arr[0].length; x++) {
			for (let y = 0; y < GAME.map.arr.length; y++) {
				var xsize = x*GAME.canv.size + x*GAME.canv.pixel;
				var ysize = y*GAME.canv.size + y*GAME.canv.pixel;

				if (TILE[GAME.map.arr[x][y].name].collect) {
					ctx.beginPath();
					ctx.rect(xsize, ysize, GAME.canv.size, GAME.canv.size);
					ctx.strokeStyle = '#fff';
					ctx.stroke();
				}
			}
		}
		*/

		/*
		for (let x = 0; x < GAME.map.arr[0].length; x++) {
			for (let y = 0; y < GAME.map.arr.length; y++) {
				var xsize = x*GAME.canv.size + x*GAME.canv.pixel;
				var ysize = y*GAME.canv.size + y*GAME.canv.pixel;

				ctx.beginPath();
				ctx.rect(xsize, ysize, GAME.canv.size, GAME.canv.size);
				if (TILE[GAME.map.arr[x][y].name].block) {
					ctx.strokeStyle = 'white';
				} else {
					ctx.strokeStyle = 'black';
				}
				ctx.stroke();

				ctx.beginPath();
				ctx.rect(xsize, ysize+GAME.canv.size*3/4, GAME.canv.size, GAME.canv.size/4);
				ctx.fillStyle = 'black';
				ctx.fill();

				ctx.font = "10px monospace";
				ctx.fillStyle = 'white';
				ctx.fillText(GAME.elevation[x][y].toFixed(2), xsize, ysize);
			}
		}
		*/

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

					/*ctx.font = "10px monospace";
					ctx.fillStyle = 'white';
					ctx.fillText(GAME.vision[x][y].toFixed(2), mapx*GAME.canv.size, mapy*GAME.canv.size);*/
				}
			}
		}


		/*ctx.strokeStyle = "red";
		ctx.lineWidth = 10;

		for (let HA = 0; HA < 3; HA++) {
			for (let HE = 0; HE < 3; HE++) {
							ctx.beginPath();
							ctx.rect(HA*canvas.width/3, HE*canvas.width/3, canvas.width/3, canvas.width/3);
							ctx.stroke();
			}
		}*/




	}

	$('body').on('keydown', function(e) {
		GAME.showDir = true;

		getKeyAndMove(e);

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
				case 88: //Z key
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

	//Pathfinding!

	/////////////////////////////////
	var easystar = new EasyStar.js();
	/////////////////////////////////

		easystar.setAcceptableTiles([0]);

	var walking; //walking interval

	var dblclick = false;
	$('#game').on('dblclick', function() {
		dblclick = true;
		$('#click').addClass('dbl');
	});

	$('#game').on('click', function(e) {
		GAME.showDir = false;

		clearInterval(walking);

		easystar.setGrid(GAME.grid);

		var x = e.pageX - $('#canvas').offset().left;
		var y = e.pageY - $('#canvas').offset().top;

		x = x/(GAME.canv.size+GAME.canv.pixel); //40
		y = y/(GAME.canv.size+GAME.canv.pixel); //40

		var coords = [Math.floor(x), Math.floor(y)];

		var peth = {
			current: [],
			old: [],
			new: []
		}

		easystar.findPath(GAME.player.x, GAME.player.y, coords[0], coords[1], function( path ) {
			if (path === null || path.length == 0) {
				clearInterval(walking);
				$('#click').hide();
				console.log("Path was not found.");

				//if clicked tile is a certain object//
				//-----------------------------------//
				  tryToCollect(coords[0], coords[1]);
				//-----------------------------------//

			} else {
		    	for (let i = 0; i < path.length; i++) {
		    		peth.new.push({
		    			x: path[i].x,
		    			y: path[i].y
		    		});

		    		peth.current = peth.new;
		    	}
			}
		});

		easystar.calculate();

		walking = setInterval(function() {
			GAME.player.x = peth.current[0].x;
			GAME.player.y = peth.current[0].y;
			peth.current.shift();
			walk('IDK TEXT HAS TO BE HERE?');
			if (peth.current.length == 0) {
				clearInterval(walking);
				$('#click').hide();
				if (dblclick) {
					tryToCollect(GAME.player.x, GAME.player.y);
					dblclick = false;
					$('#click').removeClass('dbl');
				}
			}
		}, 100);

	});

	function tryToCollect(cx, cy) {
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
				GAME.nighttime = !GAME.nighttime;

				//day.night cycle
				var cycleTime = 4000;

				$('#canvas, #player').addClass('fade');
				$('#zzz').fadeIn(cycleTime/4);

				$('#game').addClass('disabled');

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

					$('#game').removeClass('disabled');
				}, cycleTime);

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
			clr = [randInt(0, 50), randInt(20, 100), randInt(40, 60)];
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