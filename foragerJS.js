var Game = {
	player: {
		health: 100,
		thirst: 100,
		energy: 100,
		weight: 0,
		totalweight: 20
	}
}

var mine = ['','','','','','','','',''];
var items = [];

///////////////////////////
//        saving         //
///////////////////////////

setInterval(function() {
	saveGame();
}, 10000);

function saveGame() {
	var save = {
		playerHealth: Game.player.health,
		playerThirst: Game.player.thirst,
		playerEnergy: Game.player.energy
	};
	localStorage.setItem("save", JSON.stringify(save));
	localStorage.setItem("mine", JSON.stringify(mine));
	localStorage.setItem("items", JSON.stringify(items));
	localStorage.setItem("coreitems", JSON.stringify(coreitems));
}

function loadGame() {
	if (localStorage.getItem("save") != undefined) {
		var savegame = JSON.parse(localStorage.getItem("save"));
		var savemine = JSON.parse(localStorage.getItem("mine"));
		var saveitems = JSON.parse(localStorage.getItem("items"));
		var savecoreitems = JSON.parse(localStorage.getItem("coreitems"));

		if (savemine != "") mine = savemine;
		if (saveitems != "") items = saveitems;
		if (savecoreitems != "") coreitems = savecoreitems;

		if (typeof savegame.playerHealth !== "undefined") Game.player.health = savegame.playerHealth;
		if (typeof savegame.playerThirst !== "undefined") Game.player.thirst = savegame.playerThirst;
		if (typeof savegame.playerEnergy !== "undefined") Game.player.energy = savegame.playerEnergy;

		updateValues();
		updatemine();
		updateItems();
		updateCoreitems();
	}
}

function delGame() {
	localStorage.removeItem("save");
	localStorage.removeItem("mine");
	localStorage.removeItem("items");
	localStorage.removeItem("coreitems");
	location.reload();
}

///////////////////////////
//       end saving      //
///////////////////////////


function carttab() {
	$('.tab').hide();
	$('#tabmenu li a').removeClass('active');

	$('#carttab').show();
	$('#ct').addClass('active');
}

function battletab() {
	$('.tab').hide();
	$('#tabmenu li a').removeClass('active');

	$('#battletab').show();
	$('#bt').addClass('active');
}

function loretab() {
	$('.tab').hide();
	$('#tabmenu li a').removeClass('active');

	$('#loretab').show();
	$('#lt').addClass('active');
}

$(document).ready(function() {
	updateValues();
	updatemine();
	updateItems();
	updateCoreitems();

	$("#mine").on('click', 'li', function () {
		var index = $("#mine li").index(this);

				if (this.innerHTML == 'dark berries') {
					if (Game.player.weight + 1 <= Game.player.totalweight) {
						newitem("dark berries", "they look... menacing.", 1);
						spliceitem(index);
					}
				}
				else if (this.innerHTML == 'red berries') {
					if (Game.player.weight + 1 <= Game.player.totalweight) {
						newitem("red berries", "they look... tasty.", 1);
						spliceitem(index);
					}
				}
				else if (this.innerHTML == 'blue berries') {
					if (Game.player.weight + 1 <= Game.player.totalweight) {
						newitem("blue berries", "they look... bland.", 1);
						spliceitem(index);
					}
				}
				else if (this.innerHTML == 'leaves') {
					if (Game.player.weight + 4 <= Game.player.totalweight) {
						newitem("leaves", "thick, green leaves from an unknown tree.", 4);
						spliceitem(index);
					}
				}
				else if (this.innerHTML == 'twigs') {
					if (Game.player.weight + 3 <= Game.player.totalweight) {
						newitem("twigs", "a small bundle of sticks.", 3);
						spliceitem(index);
					}
				}
				else if (this.innerHTML == 'ginger') {
					if (Game.player.weight + 2 <= Game.player.totalweight) {
						newitem("ginger", "an ancient remedy for nausea.", 2);
						spliceitem(index);
					}
				}
				else if (this.innerHTML == 'marigold') {
					if (Game.player.weight + 2 <= Game.player.totalweight) {
						newitem("marigold", "helpful for treating wounds.", 2);
						spliceitem(index);
					}
				}
				else if (this.innerHTML == 'cornflower') {
					if (Game.player.weight + 2 <= Game.player.totalweight) {
						newitem("cornflower", "used as a wash for tired eyes.", 2);
						spliceitem(index);
					}
				}
				else if (this.innerHTML == 'opium poppy') {
					if (Game.player.weight + 2 <= Game.player.totalweight) {
						newitem("opium poppy", "now this looks interesting...", 2);
						spliceitem(index);
					}
				}
				else if (this.innerHTML == 'sharp rock') {
					if (Game.player.weight + 3 <= Game.player.totalweight) {
						newitem("sharp rock", "now this could be useful.", 3);
						spliceitem(index);
					}
				}
				else if (this.innerHTML == 'tree bark') {
					if (Game.player.weight + 3 <= Game.player.totalweight) {
						newitem("tree bark", "a strong piece of bark", 3);
						spliceitem(index);
					}
				}
				else {
					console.log("clicked an empty square.");
				}

	});
});

function spliceitem(index) {
	mine.splice(index, 1, '');
	updatemine();
	$(this).remove();
}

function sendcart() {
	document.getElementById("sendcart").disabled = true;

    var elem = document.getElementById("myBar");
    var width = 100;
    var id = setInterval(frame, 50);
    function frame() {
        if (width <= 0) {
            clearInterval(id);
        } else {
            width--;
            elem.style.width = width + '%';
        }
    }

	setTimeout(function() {
		document.getElementById("sendcart").disabled = false;

		clearInterval(id);
		width = 100;
		elem.style.width = width + '%';

		var array = [1, 2, 3];
		var number = array[Math.floor(Math.random() * array.length)];
		for (var i = 0; i < number; i++) {
			newore();
		}

		$('#log').prepend("<li>You finish looking, and find some supplies.</li>");

		Game.player.energy--;
		updateValues();
	}, 5000);
}

function newore() {
	var position = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	var point = position[Math.floor(Math.random() * position.length)];

	var orearray = [
		'dark berries',
		'red berries',
		'blue berries',
		'leaves',
		'twigs',
		'ginger',
		'marigold',
		'cornflower',
		'opium poppy',
		'sharp rock',
		'tree bark'
	];
	var ore = orearray[Math.floor(Math.random() * orearray.length)];

	if (mine[point] == "") {
		mine.splice(point, 1, ore);
		updatemine();
	}
	else {
		newore();
	}
}

function dropall() {
	mine = ['','','','','','','','',''];
	updatemine();
}

function updatemine() {
	document.getElementById("mine").innerHTML = "";
	for (var i = 0; i < mine.length; i++) {
		mineupdate = "<li>" + mine[i] + "</li>";
		document.getElementById("mine").innerHTML += mineupdate;

		if (mine[i].length != 0) {
			$('#mine li:nth-child(' + (i + 1) + ')').addClass('collect');
		}
		$("#mine li:contains('new lore')").css({
			"background-color" : "#fefde7"
		});
	}
}

function newitem(name, info, weight) {
	if (Game.player.weight + weight <= Game.player.totalweight) {
		items.push({
			name: name,
			info: info,
			weight: weight
		});
		updateItems();
	}
}

function delmark(i) {
	items.splice(i, 1);
	updateItems();
}

function updateItems() {
	$("#items").html("");
	var i;
	for (var i = 0; i < items.length; i++) {
		$("#items").append(

			  "<div class='box'><span class='delmark' onclick='delmark(" + i + ")'>&#x00D7;</span>"
			+ items[i].name
			+ "</div><div class='info'>"
			+ "<i>"
			+ items[i].info
			+ "</i>"
			+ "<br>"
			+ "Weight: "
			+ items[i].weight
			+ "</div>"

		);
	}

	Game.player.weight = 0;
	for (var i = 0; i < items.length; i++) {
		Game.player.weight += items[i].weight;
	}

	updateValues();
}

function prettify(input) {
	var output = Math.round(input * 1000000)/1000000;
	return output;
}

function updateValues() {
	deathCheck();
	buttonChecker();

	if (Game.player.health >= 100) Game.player.health = 100;
	if (Game.player.thirst >= 100) Game.player.thirst = 100;
	if (Game.player.energy >= 100) Game.player.energy = 100;

	$('#playerHealth').html(prettify(Game.player.health));
	$('#playerThirst').html(prettify(Game.player.thirst));
	$('#playerEnergy').html(prettify(Game.player.energy));
	$('#playerWeight').html(Game.player.weight);
	$('#playerTotalWeight').html(Game.player.totalweight);

	var healthBar = document.getElementById("healthBar");
	healthBar.style.width = Game.player.health + '%';
	var thirstBar = document.getElementById("thirstBar");
	thirstBar.style.width = Game.player.thirst + '%';
	var energyBar = document.getElementById("energyBar");
	energyBar.style.width = Game.player.energy + '%';

	if (Game.player.health <= 0) {
		healthBar.style.width = '0%';
	}
	if (Game.player.thirst <= 0) {
		thirstBar.style.width = '0%';
	}
	if (Game.player.energy <= 0) {
		energyBar.style.width = '0%';
	}
}

var itemCheck = {
	darkBerries: false,
	redBerries: false,
	blueBerries: false,
	twigs: false,
	leaves: false,
	ginger: false,
	marigold: false,
	opiumPoppy: false
}

function buttonChecker() {
	$('.actionbtn').hide();

	itemCheck = {
		darkBerries: false,
		redBerries: false,
		blueBerries: false,
		twigs: false,
		leaves: false,
		ginger: false,
		marigold: false,
		opiumPoppy: false,
		sharpRock: false,
		treeBark: false,
		water: false,
		coffeebrew: false
	}
	for (var i = 0; i < items.length; i++) {
		if (items[i].name == "dark berries") {
			itemCheck.darkBerries = true;
		}
		if (items[i].name == "red berries") {
			itemCheck.redBerries = true;
		}
		if (items[i].name == "blue berries") {
			itemCheck.blueBerries = true;
		}
		if (items[i].name == "twigs") {
			itemCheck.twigs = true;
		}
		if (items[i].name == "leaves") {
			itemCheck.leaves = true;
		}
		if (items[i].name == "ginger") {
			itemCheck.ginger = true;
		}
		if (items[i].name == "marigold") {
			itemCheck.marigold = true;
		}
		if (items[i].name == "cornflower") {
			itemCheck.cornflower = true;
		}
		if (items[i].name == "opium poppy") {
			itemCheck.opiumPoppy = true;
		}
		if (items[i].name == "sharp rock") {
			itemCheck.sharpRock = true;
		}
		if (items[i].name == "tree bark") {
			itemCheck.treeBark = true;
		}
		if (items[i].name == "water") {
			itemCheck.water = true;
		}
		if (items[i].name == "coffee brew") {
			itemCheck.coffeeBrew = true;
		}
	}

	if (itemCheck.darkBerries == true) { //dark berries
		$('#eatDarkBerries').show();
	}
	else {
		$('#eatDarkBerries').hide();
	}

	if (itemCheck.redBerries == true) { //red berries
		$('#eatRedBerries').show();
	}
	else {
		$('#eatRedBerries').hide();
	}

	if (itemCheck.blueBerries == true) { //blue berries
		$('#eatBlueBerries').show();
	}
	else {
		$('#eatBlueBerries').hide();
	}

	if (itemCheck.leaves == true && itemCheck.twigs == true) { //crafing flask
		$('#craftFlask').show();
	}
	else {
		$('#craftFlask').hide();
	}

	if (itemCheck.twigs == true && itemCheck.treeBark == true) { //crafing firepit
		$('#craftFirepit').show();
	}
	else {
		$('#craftFirepit').hide();
	}


	//other resources (crafted coreitems)

	if (coreitems.indexOf("flask") != -1) {
		$('#collectwater').show();
	}
	else {
		$('#collectwater').hide();
	}

	if (coreitems.indexOf("firepit") != -1 && itemCheck.cornflower == true && itemCheck.water == true) {
		$('#brewcornflower').show();
	}
	else {
		$('#brewcornflower').hide();
	}

	if (itemCheck.coffeeBrew == true) {
		$('#drinkCoffeeBrew').show();
	}
	else {
		$('#drinkCoffeeBrew').hide();
	}
}

///////////////////////////
//     button actions    //
///////////////////////////

function removeItem(item) {
	for (var i = 0; i < items.length; i++) {
		if (items[i].name == item) {
			items.splice(i, 1);
			updateItems();
			break;
		}
	}
}

function eatDarkBerries() {
	removeItem("dark berries");

	var berryint = setInterval(function() {
		Game.player.health -= 1;
		Game.player.thirst -= 0.1;
		updateValues();
	}, 50);
	setTimeout(function() {
		clearInterval(berryint);
	}, 1500);
}

function eatRedBerries() {
	removeItem("red berries");

	var berryint = setInterval(function() {
		Game.player.thirst -= 1;
		Game.player.energy -= 0.1;
		updateValues();
	}, 50);
	setTimeout(function() {
		clearInterval(berryint);
	}, 1500);
}

function drinkCoffeeBrew() {
	removeItem("coffee brew");

	var coffeeint = setInterval(function() {
		Game.player.thirst += 0.2;
		Game.player.energy += 0.5;
		updateValues();
	}, 50);
	setTimeout(function() {
		clearInterval(coffeeint);
	}, 1000);
}

function eatBlueBerries() {
	removeItem("blue berries");

	var berryint = setInterval(function() {
		Game.player.health += 0.3;
		Game.player.thirst += 0.2;
		Game.player.energy += 0.1;
		updateValues();
	}, 50);
	setTimeout(function() {
		clearInterval(berryint);
	}, 1000);
}

var coreitems = [];

function craftFlask() {
	removeItem("twigs");
	removeItem("leaves");

	coreitems.push("flask");
	updateCoreitems();
	$('#log').prepend("<li>You construct a makeshift flask for water carrying.</li>");
}

function craftFirepit() {
	removeItem("twigs");
	removeItem("bark");

	coreitems.push("firepit");
	updateCoreitems();
	$('#log').prepend("<li>You make a firepit for warmth... and the ability of brewing.</li>");
}

function brewcornflower() {
	removeItem("cornflower");
	removeItem("water");

	newitem("coffee brew", "a small decoction for tired eyes.", 1);
	$('#log').prepend("<li>You brew the cornflower in some water.</li>");
}

function updateCoreitems() {
	if (coreitems.length > 0) {
		$('#coreitems').html("<b>Items:</b><br>" + coreitems.join("<br>"));
	}
	else {
		$('#coreitems').html("");
	}
	buttonChecker();
}

///////////////////////////
//      end buttons      //
///////////////////////////

function collectwater() {
	newitem("water", "clear water taken from a nearby stream", 2);
}

function deathCheck() {
	if (Game.player.health <= 0) {
		delGame();
	}
}