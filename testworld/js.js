


var map = [];

var height = 9;
var width = 9;

var sx = Math.floor(width/2);
var sy = Math.floor(height/2);

var Room = {
	empty: {
		name: 'empty',
		id: 0
	},
	spawn: {
		name: 'spawn',
		id: 1
	},
	passage: {
		name: 'passage',
		id: 2
	}
}

$(document).ready(function() {

	redo();

	document.onkeydown = function(e) {
		switch (e.keyCode) {
			case 37:
				if (map[sy][sx-1].name != 'empty') sx--;
				break;
			case 38:
				if (map[sy-1][sx].name != 'empty') sy--;
				break;
			case 39:
				if (map[sy][sx+1].name != 'empty') sx++;
				break;
			case 40:
				if (map[sy+1][sx].name != 'empty') sy++;
				break;
		}
		drawMap();
	};

	$('.map').bind('mousemove', function(e){
		$('.desc-cards').css({
			left:  e.pageX + 20,
			top:   e.pageY - 10
		});
		var mx = Math.floor(e.pageX/80);
		var my = Math.floor(e.pageY/80);
		$('.sx').html(mx);
		$('.sy').html(my);
	});

	$('.map').on('mouseover', function(e){
		$('.desc-cards').show();
	});

	$('.map').on('mouseleave', function(e){
		$('.desc-cards').hide();
	});

	$('.desc-cards .card').hide();
	$('.desc-cards').show(); //html sets this to display: none;

	$('.map').on('mouseover', '.tile', function(e) {
		var biome =
			e.target.className
				.replace(/\s/g, '')
				.replace('player','')
				.replace('tile','');
		var biome_name = '.desc-cards .' + biome;
		$('.desc-cards .card').hide();
		$(biome_name).show();
	});

});

function createMap() {
	map = [];
	for (i = 0; i < height; i++) {
		map.push([]);
		for (k = 0; k < height; k++) {
			map[i].push(Room.empty);
		}
	}
}

function formMap() {
	var paths = 5;
	while (paths > 0) {
		drawPath(sx, sy);
		paths--;
	}

	map[sy][sx] = Room.spawn;
}

function drawPath(x, y) {
	var tx = x;
	var ty = y;

	var amo = 3;
	for (i = 0; i < amo; i++) {
		var len = randInt(2,3);
		var dirs = [0,1,2,3];
		var dir = rand(dirs);
		for (k = 0; k < len; k++) {
			switch (dir) {
				case 0:
					if (ty > 0) ty--;
					break;
				case 1:
					if (ty < height-1) ty++;
					break;
				case 2:
					if (tx > 0) tx--;
					break;
				case 3:
					if (tx < width-1) tx++;
					break;
			}
			var index = dirs.indexOf(dir);
			dirs.splice(index, 1);
			map[ty][tx] = Room.passage;
		}
	}
}

function drawMap() {
	$('.map').html('');
	for (i = 0; i < map.length; i++) {
		$('.map').append('<div class="layer"></div>');
		for (k = 0; k < map[0].length; k++) {
			$('.map').find('.layer').eq(i).append('<span class="tile '+map[i][k].name+'"></span>');
			$('.map_cover .player').css({
				left:  sx*80,
				top:   sy*80
			});
		}
	}
}

function redo() {
	createMap();
	formMap();
	drawMap();
}





function rand(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function tile(x, y, array) {
	return array[y * width + x];
}

function randInt(bottom, top) {
	return Math.floor(Math.random() * (top - bottom + 1)) + bottom;
}