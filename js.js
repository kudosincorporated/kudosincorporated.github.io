var auto; //setInterval function
var movegame; //tile movement

var tickspeed = 1000;
var map = [];
var emptyrand = 0.05;
var treerand = 0.1;
var coinrand = 0.1;

var points = 0;

var lines = [
	[1, 0, 0, 0],
	[2, 1, 0, 0],
	[1, 3, 1, 0],
	[3, 1, 2, 1],
	[0, 1, 1, 3],
	[0, 0, 2, 1],
	[0, 0, 0, 1],
	[1, 0, 0, 1],
	[0, 1, 3, 0]
];
var emptyLine = [4, 0, 0, 0, 0, 4];
var fullLine = [6, 4, 4, 4, 4, 6];

/*
	Tile IDs:

	0	water
	1	logs1
	2	logs2
	3	logs3
	4	rocks1
	5	rocks2
	6	rocks3
	7	tree1
	8	tree2
	9	tree3
	10	coin1
	11	coin2
	12	coin3
*/

/*function convertLine(line) {
	var new_line = [];
	for (v in line) {
		switch (line[v]) {
			case 0:
				new_line.push({
					id: "water"
				});
				break;
			case 1:
				new_line.push({
					id: "logs"
				});
				break;
			case 2:
				new_line.push({
					id: "rocks"
				});
				break;
		}
	}

	return new_line;
}*/

var tilesize = 50;
var x = 3*tilesize;
var y = 8*tilesize;

var direction = "up";

var px = 3;
var py = 7;

var gameover = false;

$(document).ready(function() {

	init();

});

function init() {

	//initialising the map
	for (i = 0; i <= 10; i++) {
		if (i < 7) {
			addLine();
		}
		else {
			map.push(fullLine);
		}
	}

	//inital update
	updateTiles();
	updatePlayer();

	//check for movement
	document.onkeydown = function(e) {

		if (gameover == false) {
			switch (e.keyCode) {
				case 37:
					direction = "left";
					if (!collision(direction, 1)) {
						clearClasses();
						$('.player').addClass('playerLeft');
						playerJump();
						x -= tilesize;
						px--;
					}
					break;
				case 38:
					direction = "up";
					if (!collision(direction, 1)) {
						clearClasses();
						$('.player').addClass('playerUp');
						playerJump();
						y -= tilesize;
						py--;
					}
					break;
				case 39:
					direction = "right";
					if (!collision(direction, 1)) {
						clearClasses();
						$('.player').addClass('playerRight');
						playerJump();
						x += tilesize;
						px++;
					}
					break;
				case 40:
					direction = "down";
					if (!collision(direction, 1)) {
						clearClasses();
						$('.player').addClass('playerDown');
						playerJump();
						y += tilesize;
						py++;
					}
					break;
				case 32:
					if (!collision(direction, 2)) {
						playerDash(direction);
					}
					break;
			}
		}

		updatePlayer();

	};

}

function newGame() {

	location.reload();

}

function collision(dir, distance) {

	var detected = false;

		switch (dir) {
			case "left":
				var pos = map[py][px-distance];
				if (pos == 7 || pos == undefined) {
					detected = true;
				}
			break;
			case "up":
				var pos = map[py-distance][px];
				if (pos == 7 || pos == undefined) {
					detected = true;
				}
				break;
			case "right":
				var pos = map[py][px+distance];
				if (pos == 7 || pos == undefined) {
					detected = true;
				}
				break;
			case "down":
				var pos = map[py+distance][px];
				if (pos == 7 || pos == undefined) {
					detected = true;
				}
				break;
		}

		if (detected == true) {
			return true;
		} else {
			return false;
		}

}

function clearClasses() {
	$('.player').removeClass('playerLeft');
	$('.player').removeClass('playerUp');
	$('.player').removeClass('playerRight');
	$('.player').removeClass('playerDown');
}

function playerDash(dir) {

		switch (dir) {
			case "left":
				playerJump();
				x -= tilesize*2;
				px -= 2;
				break;
			case "up":
				playerJump();
				y -= tilesize*2;
				py -= 2;
				break;
			case "right":
				playerJump();
				x += tilesize*2;
				px += 2;
				break;
			case "down":
				playerJump();
				y += tilesize*2;
				py += 2;
				break;
		}

}

function playerJump() {
	var $player = $('.player').clone();
	$('.player_cover').html($player);
	$('.player').addClass('jump');
}

var movetiles;
var movement = -tilesize;
var movement_p = -tilesize;

function pause() {
	clearInterval(movegame);
	clearInterval(movetiles);
}

function gameStart() {

	$('.startBtn').hide();

	clearInterval(movegame);
	window.movegame = setInterval(function() {

		addLine();
		movement -= tilesize;
		points++;
		$('.points').html(points);

		//pushes player down. YYYYESSSSSSS
		py++;

		map.splice(map.length-1, 1);

		updateTiles();

		$('.tile').removeClass('arise');
		$('.tiles div:first-of-type .tile').addClass('arise');

		$('.tile').removeClass('descend');
		$('.tiles div:last-of-type .tile').addClass('descend');

	}, tickspeed);

	clearInterval(movetiles);
	window.movetiles = setInterval(function() {

		movement++;
		movement_p++;

		$('.tiles').css({
			"margin-top" : movement + "px"
		})

		$('.player_cover').css({
			"margin-top" : movement_p + "px"
		})

		updatePlayer();

		//test if gameover
		if (map[py][px] == 0 || py > 9) {

			gameover = true;

			$('.player').addClass('descend');

			setTimeout(function() {
				pause();
				$('.gameover').show();
			}, 300);

		}

	}, tickspeed/tilesize);

}

function updateTiles() {

	$('.tiles').html("");
	for (i = 0; i < map.length; i++) {
		var $newdiv = $('<div>');
		for (j = 0; j < map[i].length; j++) {
			$($newdiv).append('<span class="tile ' + findClassname(map[i][j]) + '"></span>');
		}
		$('.tiles').append($newdiv);
	}

	var $coin = $('.coin').clone();
	$('.tiles .tile').eq(y * map[0].length + x).html($coin);

}

function updatePlayer() {

	setTimeout(function(){
		$('.player').css({
			"top" : y + "px",
			"left" : x + "px"
		})
	},1);

}

function findClassname(number) {

	switch (number) {
		case 0:
			return "water";
			break;
		case 1:
			return "logs logs1";
			break;
		case 2:
			return "logs logs2";
			break;
		case 3:
			return "logs logs3";
			break;
		case 4:
			return "rocks rocks1";
			break;
		case 5:
			return "rocks rocks2";
			break;
		case 6:
			return "rocks rocks3";
			break;
		case 7:
			return "tree tree1";
			break;
		case 8:
			return "tree tree2";
			break;
		case 9:
			return "tree tree3";
			break;
		case 10:
			return "coin coin1";
			break;
		case 12:
			return "coin coin2";
			break;
		case 12:
			return "coin coin3";
			break;
	}

}

function addLine() {

	var chosen = rand(lines).slice();
	chosen.splice(0, 0, makeTree());
	chosen.splice(chosen.length, 0, makeTree());

	if (Math.random() <= emptyrand) {
		map.splice(0, 0, emptyLine);
	}
	else {
		/*if (Math.random() <= coinrand) {
			var coinpos = randInt(1, 4);
			chosen.splice(coinpos, 1, 4);
		}*/
		map.splice(0, 0, chosen);
	}

}

function makeTree() {
	if (Math.random() <= treerand) {
		return 7;
	}
	else {
		return 4;
	}

}












function rand(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function findTile(x, y, array) {
	return array[y * width + x];
}

function randInt(bottom, top) {
	return Math.floor(Math.random() * (top - bottom + 1)) + bottom;
}

/*function update() {
	$('.inventory').html(Game.inventory.map(getItem));
}

function getItem(array) {
	var fullItem = "<div><span class='item-name'>"+array.name+"</span> <span class='item-value'>"+array.value+"</span></div>";
	return fullItem;
}*/