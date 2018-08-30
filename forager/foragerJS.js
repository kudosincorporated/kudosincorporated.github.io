var Game = {
	player: {
		health: 100,
		thirst: 100,
		energy: 100,
		weight: 0,
		totalweight: 20,

			plantlvl: 0,
			plantxp: 0,
			nextlvlplant: 100,

			craftlvl: 0,
			craftxp: 0,
			nextlvlcraft: 100,

			fightlvl: 0,
			fightxp: 0,
			nextlvlfight: 100
	},
	world: {
		distance: 0,
		weapon: "fists",
		damage: 1
	},
	enemy: {
		name: "skunk",
		desc: "An animal.",
		response: 0.2,
		damage: 0.1,
		health: 15
	},
	places: {
		theCliff: true,
		theClearing: false,
		theWaterhole: false,
		theVillage: false
	},

	complete: 1,
	clickdmg: 25
}

var used = [];
var map = [];

//map zones

var Icons = {
	tree: '<i class="fa fa-tree" aria-hidden="true"></i><span class="id">tree</span>',
	mine: '<i class="fa fa-diamond" aria-hidden="true"></i><span class="id">mine</span>',
	house: '<i class="fa fa-home" aria-hidden="true"></i><span class="id">house</span>',
	water: '<i class="fa fa-tint" aria-hidden="true"></i><span class="id">water</span>',
	binoculars: '<i class="fa fa-binoculars" aria-hidden="true"></i>',
	signs: '<i class="fa fa-map-signs" aria-hidden="true"></i>'
}

var Zones = {
	zone1: [
		Icons.signs, Icons.tree, Icons.tree, Icons.tree, Icons.binoculars,
		Icons.tree, Icons.tree, Icons.tree, Icons.tree, Icons.water,
		Icons.tree, Icons.tree, Icons.tree, Icons.tree, Icons.house,
		Icons.tree, Icons.tree, Icons.tree, Icons.tree, Icons.tree,
		Icons.tree, Icons.tree, Icons.tree, Icons.tree, Icons.tree,
	]
};

var orearray = [
	'dark berries',
	'red berries',
	'blue berries'
];

var mine = ['','','','','','','','',''];
var items = [];
var base = [];

function update() {
	updateValues();
	updateMine();
	updateItems();
	updateBase();
	imageItems();
	buttonChecker();
}

function mineInit() {
	//fast travel init
	$("#theCliff").on('click', function() {
		if (Game.world.distance != 0 && Game.places.theCliff != false) {
			Game.world.distance = 0;
			worldUpdate();
			loadMap();
			$('#log').prepend("<li>You are back at the Cliff.</li>");
		}
	})
	$("#theClearing").on('click', function() {
		if (Game.world.distance != 10 && Game.places.theClearing != false) {
			Game.world.distance = 10;
			worldUpdate();
			loadMap();
			$('#log').prepend("<li>You travel to the Clearing to hunt animals.</li>");
		}
	})
	$("#theWaterhole").on('click', function() {
		if (Game.world.distance != 20 && Game.places.theWaterhole != false) {
			Game.world.distance = 20;
			worldUpdate();
			loadMap();
			$('#log').prepend("<li>You travel to the Waterhole to go fishing.</li>");
		}
	})
	$("#theVillage").on('click', function() {
		if (Game.world.distance != 30 && Game.places.theVillage != false) {
			Game.world.distance = 30;
			worldUpdate();
			loadMap();
			$('#log').prepend("<li>You travel to the Village.</li>");
		}
	})


	$("#mine").on('click', 'li', function () {
		var index = $("#mine li").index(this);

		switch (this.innerHTML) {
			case 'dark berries':
				clickedItem("dark berries", "they look... menacing.", 1, index);
				break;
			case 'red berries':
				clickedItem("red berries", "they look... tasty.", 1, index);
				break;
			case 'blue berries':
				clickedItem("blue berries", "they look... bland.", 1, index);
				break;
			case 'leaves':
				clickedItem("leaves", "thick, green leaves from an unknown tree. used for flask and pouch crafting.", 4, index);
				break;
			case 'twigs':
				clickedItem("twigs", "a small bundle of sticks. used for firepit and flask making.", 3, index);
				break;
			case 'tree sap':
				clickedItem("tree sap", "a slightly sweet, sticky substance. used to make ointment.", 2, index);
				break;
			case 'marigold':
				clickedItem("marigold", "helpful for treating wounds used to make ointment..", 2, index);
				break;
			case 'milkcap':
				clickedItem("milkcap", "tasty if prepared in a firepit.", 2, index);
				break;
			case 'cornflower':
				clickedItem("cornflower", "an ancient remedy for tired eyes when mixed with water.", 2, index);
				break;
			case 'opium poppy':
				clickedItem("opium poppy", "now this looks interesting...", 2, index);
				break;
			case 'sharp rock':
				clickedItem("sharp rock", "now this could be useful. can be used as a weapon or to craft opium.", 3, index);
				break;
			case 'tree bark':
				clickedItem("tree bark", "a strong piece of bark. used for pouch and firepit crafting.", 3, index);
				break;
			default:
				console.log("clicked an empty square.");
		}
	});
}

///////////////////////////
//        saving         //
///////////////////////////

setInterval(function() {
	saveGame();
}, 10000);

function saveGame() {
	var save = {
		health: Game.player.health,
		thirst: Game.player.thirst,
		energy: Game.player.energy,
		weight: Game.player.weight,
		totalweight: Game.player.totalweight,

			plantlvl: Game.player.plantlvl,
			plantxp: Game.player.plantxp,
			nextlvlplant: Game.player.nextlvlplant,

			craftlvl: Game.player.craftlvl,
			craftxp: Game.player.craftxp,
			nextlvlcraft: Game.player.nextlvlcraft,

			fightlvl: Game.player.fightlvl,
			fightxp: Game.player.fightxp,
			nextlvlfight: Game.player.nextlvlfight,

		distance: Game.world.distance,

		theCliff: Game.places.theCliff,
		theClearing: Game.places.theClearing,
		theWaterhole: Game.places.theWaterhole,
		theVillage: Game.places.theVillage
	};
	localStorage.setItem("save", JSON.stringify(save));
	localStorage.setItem("mine", JSON.stringify(mine));
	localStorage.setItem("items", JSON.stringify(items));
	localStorage.setItem("base", JSON.stringify(base));
}

function loadGame() {
	update();
	mineInit();
	makeMap();

	if (localStorage.getItem("save") != undefined) {
		var savegame = JSON.parse(localStorage.getItem("save"));
		var savemine = JSON.parse(localStorage.getItem("mine"));
		var saveitems = JSON.parse(localStorage.getItem("items"));
		var savebase = JSON.parse(localStorage.getItem("base"));

		if (savemine != "") mine = savemine;
		if (saveitems != "") items = saveitems;
		if (savebase != "") base = savebase;

		if (typeof savegame.health !== "undefined") Game.player.health = savegame.health;
		if (typeof savegame.thirst !== "undefined") Game.player.thirst = savegame.thirst;
		if (typeof savegame.energy !== "undefined") Game.player.energy = savegame.energy;
		if (typeof savegame.weight !== "undefined") Game.player.weight = savegame.weight;
		if (typeof savegame.totalweight !== "undefined") Game.player.totalweight = savegame.totalweight;

			if (typeof savegame.plantlvl !== "undefined") Game.player.plantlvl = savegame.plantlvl;
			if (typeof savegame.plantxp !== "undefined") Game.player.plantxp = savegame.plantxp;
			if (typeof savegame.nextlvlplant !== "undefined") Game.player.nextlvlplant = savegame.nextlvlplant;

			if (typeof savegame.craftlvl !== "undefined") Game.player.craftlvl = savegame.craftlvl;
			if (typeof savegame.craftxp !== "undefined") Game.player.craftxp = savegame.craftxp;
			if (typeof savegame.nextlvlcraft !== "undefined") Game.player.nextlvlcraft = savegame.nextlvlcraft;

			if (typeof savegame.fightlvl !== "undefined") Game.player.fightlvl = savegame.fightlvl;
			if (typeof savegame.fightxp !== "undefined") Game.player.fightxp = savegame.fightxp;
			if (typeof savegame.nextlvlfight !== "undefined") Game.player.nextlvlfight = savegame.nextlvlfight;

		if (typeof savegame.distance !== "undefined") Game.world.distance = savegame.distance;

		if (typeof savegame.theCliff !== "undefined") Game.places.theCliff = savegame.theCliff;
		if (typeof savegame.theClearing !== "undefined") Game.places.theClearing = savegame.theClearing;
		if (typeof savegame.theWaterhole !== "undefined") Game.places.theWaterhole = savegame.theWaterhole;
		if (typeof savegame.theVillage !== "undefined") Game.places.theVillage = savegame.theVillage;

		update();
		worldUpdate();
		loadMap();
	}
}

function delGame() {
	alert("You could not survive the forest!");
	localStorage.removeItem("save");
	localStorage.removeItem("mine");
	localStorage.removeItem("items");
	localStorage.removeItem("base");
	location.reload();
}

///////////////////////////
//       end saving      //
///////////////////////////

function clickedItem(name, info, weight, index) {
	if (Game.player.weight + weight <= Game.player.totalweight) {
		newitem(name, info, weight);
		spliceitem(index);
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

function spliceitem(index) {
	mine.splice(index, 1, '');
	updateMine();
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
		}
		else {
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

		//lose energy
		var forageint = setInterval(function() {
			Game.player.energy -= 0.1;
			updateValues();
		}, 50);
		setTimeout(function() {
			clearInterval(forageint);
		}, 500);

		Game.player.plantxp += 10;
		levelCheck();
		updateValues();
	}, 5000);
}

function newore() {
	var position = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	var point = position[Math.floor(Math.random() * position.length)];

	var ore = orearray[Math.floor(Math.random() * orearray.length)];

	if (mine[point] == "") {
		mine.splice(point, 1, ore);
		updateMine();
	}
	else {
		var full = 0;
		for (var i = 0; i < 9; i++) {	
			if (mine[i] != "") {
				full++;
			}
		}
		if (full >= 9) {
			console.log("The mine is full!");
		}
		else {
			newore();
		}
	}
}

function dropall() {
	mine = ['','','','','','','','',''];
	updateMine();
}

function updateMine() {
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
	imageItems();
}

function delmark(i) {
	items.splice(i, 1);
	updateItems();
}

function updateItems() {
	sort();

	$("#items").html("");
	var i;
	for (var i = 0; i < items.length; i++) {
		$("#items").append(
			  "<div class='box'>"
			+ "<span class='no'></span>"
			+ "<span class='delmark' onclick='delmark(" + i + ")'>&#x00D7;</span>"
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
	imageItems();
}

function sort() {
	items = items.sort(function (a, b) {
		return a["name"].localeCompare(b["name"]);
	});
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
	if (Game.player.health <= 0) Game.player.health = 0;
	if (Game.player.thirst <= 0) Game.player.thirst = 0;
	if (Game.player.energy <= 0) Game.player.energy = 0;

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

	$('#plantlvl').html(prettify(Game.player.plantlvl));
	$('#plantxp').html(prettify(Game.player.plantxp));
	$('#nextlvlplant').html(prettify(Game.player.nextlvlplant));

	$('#craftlvl').html(prettify(Game.player.craftlvl));
	$('#craftxp').html(prettify(Game.player.craftxp));
	$('#nextlvlcraft').html(prettify(Game.player.nextlvlcraft));

	$('#fightlvl').html(prettify(Game.player.fightlvl));
	$('#fightxp').html(prettify(Game.player.fightxp));
	$('#nextlvlfight').html(prettify(Game.player.nextlvlfight));


	//thirst and energy levels at zero

	if (Game.player.thirst <= 0) {
		//you are a thirsty boi. nothing happens if you get too thirsty yet.
	}

	if (Game.player.energy <= 0) {
		$('#forwards').addClass("hidden");
	}
	else {
		$('#forwards').removeClass("hidden");
	}
}

function levelCheck() {
	if (Game.player.plantxp >= Game.player.nextlvlplant) {
		Game.player.plantxp = 0;
		Game.player.nextlvlplant += 20;
		Game.player.plantlvl++;
		updateValues();
		$('#log').prepend("<li class='green'>Your skills in foraging increase, allowing you to collect new things.</li>");
	}

	if (Game.player.craftxp >= Game.player.nextlvlcraft) {
		Game.player.craftxp = 0;
		Game.player.nextlvlcraft += 20;
		Game.player.craftlvl++;
		updateValues();
		$('#log').prepend("<li class='green'>Your crafting skill increases.</li>");
	}

	if (Game.player.fightxp >= Game.player.nextlvlfight) {
		Game.player.fightxp = 0;
		Game.player.nextlvlfight += 20;
		Game.player.fightlvl++;
		updateValues();
		$('#log').prepend("<li class='green'>Your fighting skill increases.</li>");
	}

	//fighting xp/levelling not yet implemented

	if (Game.player.plantlvl == 0) {
		orearray = [
			'dark berries',
			'red berries',
			'blue berries'
		];
	}
	if (Game.player.plantlvl == 1) {
		orearray = [
			'dark berries',
			'red berries',
			'blue berries',
			'leaves',
			'twigs',
			'tree bark'
		];
	}
	if (Game.player.plantlvl >= 2) {
		orearray = [
			'dark berries',
			'red berries',
			'blue berries',
			'leaves',
			'twigs',
			'tree bark',
			'tree sap',
			'marigold',
			'milkcap',
			'cornflower',
			'opium poppy',
			'sharp rock'
		];
	}
}

function buttonChecker() {
	$('.actionbtn').hide();

	itemCheck = {
		//forage items
			darkBerries: 0,
			redBerries: 0,
			blueBerries: 0,
			twigs: 0,
			leaves: 0,
			treeSap: 0,
			marigold: 0,
			milkcap: 0,
			cornflower: 0,
			opiumPoppy: 0,
			sharpRock: 0,
			treeBark: 0,
			water: 0,

		//crafted
			coffeeBrew: 0,
			roastMilkcap: 0,
			ointment: 0,
			opium: 0
	}

	//init stacker
	$('.box').removeClass("stacked");

	for (var i = 0; i < items.length; i++) {
		//foraged items
		itemInc("dark berries", "darkBerries", i);
		itemInc("red berries", "redBerries", i);
		itemInc("blue berries", "blueBerries", i);
		itemInc("twigs", "twigs", i);
		itemInc("leaves", "leaves", i);
		itemInc("tree sap", "treeSap", i);
		itemInc("marigold", "marigold", i);
		itemInc("milkcap", "milkcap", i);
		itemInc("cornflower", "cornflower", i);
		itemInc("opium poppy", "opiumPoppy", i);
		itemInc("sharp rock", "sharpRock", i);
		itemInc("tree bark", "treeBark", i);
		itemInc("water", "water", i);

		//crafted
		itemInc("coffee brew", "coffeeBrew", i);
		itemInc("roasted shroom", "roastMilkcap", i);
		itemInc("ointment", "ointment", i);
		itemInc("opium", "opium", i);
	}

	var haveFlask = false;
	var haveFirepit = false;

	for (var i = 0; i < base.length; i++) {
		if (base[i].name == "flask") {
			haveFlask = true;
		}
		if (base[i].name == "firepit") {
			haveFirepit = true;
		}
	}

	$('#actions').html("");

	if (itemCheck.darkBerries >= 1) { //dark berries
		$('#actions').append('<button id="eatDarkBerries" onclick="eatDarkBerries()">Eat dark berries.</button>');
	}

	if (itemCheck.redBerries >= 1) { //red berries
		$('#actions').append('<button id="eatRedBerries" onclick="eatRedBerries()">Eat red berries.</button>');
	}

	if (itemCheck.blueBerries >= 1) { //blue berries
		$('#actions').append('<button id="eatBlueBerries" onclick="eatBlueBerries()">Eat blue berries.</button>');
	}

	if (itemCheck.milkcap >= 1) { //eat milkcap
		$('#actions').append('<button id="eatMilkcap" onclick="eatMilkcap()">Eat milkcap.</button>');
	}

	if (itemCheck.opiumPoppy >= 1 && itemCheck.sharpRock >= 1 && Game.player.craftlvl >= 1) { //(craft level 2 is required to do this)
		$('#actions').append('<button id="extractOpium" onclick="extractOpium()">Extract opium.</button>');
	}

	if (itemCheck.roastMilkcap >= 1) { //eat roast shroom
		$('#actions').append('<button id="eatRoastMilkcap" onclick="eatRoastMilkcap()">Eat roasted shroom.</button>');
	}

	if (itemCheck.treeSap >= 1 && itemCheck.marigold >= 1) { //make ointment
		$('#actions').append('<button id="makeOintment" onclick="makeOintment()">Make ointment.</button>');
	}

	if (itemCheck.ointment >= 1) { //use ointment
		$('#actions').append('<button id="useOintment" onclick="useOintment()">Use ointment.</button>');
	}

	//other resources

	if (haveFirepit == true && itemCheck.milkcap >= 1) { //roast milkcap
		$('#actions').append('<button id="roastMilkcap" onclick="roastMilkcap()">Roast milkcap.</button>');
	}

	if (haveFirepit == true && itemCheck.cornflower >= 1 && itemCheck.water >= 1) { //make coffee brew
		$('#actions').append('<button id="brewcornflower" onclick="brewcornflower()">Brew cornflower.</button>');
	}

	if (itemCheck.coffeeBrew >= 1) { //drink coffee brew
		$('#actions').append('<button id="drinkCoffeeBrew" onclick="drinkCoffeeBrew()">Drink coffee brew.</button>');
	}

	//the coreitems crafting

	if (haveFlask == true) { //collect water
		$('#actions').append('<button class="green" id="collectwater" onclick="collectwater()">Collect water.</button>');
	}

	if (itemCheck.leaves >= 1 && itemCheck.twigs >= 1 && haveFlask != true) { //crafing flask
		$('#actions').append('<button class="green" id="craftFlask" onclick="craftFlask()">Craft flask.</button>');
	}

	if (itemCheck.twigs >= 1 && itemCheck.treeBark >= 1 && haveFirepit != true) { //crafing firepit
		$('#actions').append('<button class="green" id="craftFirepit" onclick="craftFirepit()">Make firepit.</button>');
	}

	if (itemCheck.leaves >= 1 && itemCheck.treeBark >= 1) { //crafing pouch
		$('#actions').append('<button class="green" id="craftPouch" onclick="craftPouch()">Craft pouch.</button>');
	}


	//weaponcheck

	if (itemCheck.sharpRock >= 1) {
		Game.world.weapon = "sharp rock";
		Game.world.damage = 5;
	}
	else {
		Game.world.weapon = "fists";
		Game.world.damage = 1;
	}
	var totaldamage = Game.world.damage + Game.player.fightlvl;
	$('#weapon').html(Game.world.weapon + " (" + totaldamage + " dmg)");
}

function itemInc(item, id, i) {
	if (items[i].name == item) {
		itemCheck[id]++;
	}
	
	stacker(item, id);
}



function stacker(item, id) {
	for (var i = 0; i < items.length; i++) {
		if (items[i].name == item) {
			var index = i;
			break;
		}
	}

	for (var i = 0; i < itemCheck[id] - 1; i++) {
		$('#items .box').eq(index + i + 1).addClass("stacked");
	}

	$('#items .box .no').eq(index).html(itemCheck[id]);
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
	$('#log').prepend("<li class='red'>The dark berries cause you to convulse and hallucinate. Don't eat scary berries!</li>");
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
	$('#log').prepend("<li class='red'>The red berries parch your throat and weaken you.</li>");
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

function eatBlueBerries() {
	$('#log').prepend("<li>The berries are slightly sour, but tasty.</li>");
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

function eatMilkcap() {
	$('#log').prepend("<li>The milkcap tastes like... nothing.</li>");
	removeItem("milkcap");

	var eatint = setInterval(function() {
		Game.player.health += 0.1;
		Game.player.thirst += 0.1;
		updateValues();
	}, 50);
	setTimeout(function() {
		clearInterval(eatint);
	}, 1000);
}

function craftFlask() {
	removeItem("twigs");
	removeItem("leaves");

	base.push({
		name: "flask",
		info: "a small flask for water carrying."
	});
	updateBase();
	imageItems();

	$('#log').prepend("<li>You construct a makeshift flask for water carrying.</li>");

	Game.player.craftxp += 10;
	updateValues();
	levelCheck();
}

function craftPouch() {
	removeItem("leaves");
	removeItem("tree bark");

	base.push({
		name: "pouch",
		info: "a pouch so you can carry more."
	});
	updateBase();
	imageItems();

	$('#log').prepend("<li>You craft a pouch to carry more supplies after foraging.</li>");

	Game.player.totalweight += 10;
	updateValues();

	Game.player.craftxp += 10;
	updateValues();
	levelCheck();
}

function craftFirepit() {
	removeItem("twigs");
	removeItem("tree bark");

	base.push({
		name: "firepit",
		info: "a warm fire."
	});
	updateBase();
	imageItems();

	$('#log').prepend("<li>You make a firepit for warmth... and the ability to brew concoctions.</li>");

	Game.player.craftxp += 10;
	updateValues();
	levelCheck();
}

function extractOpium() {
	removeItem("opium poppy");
	removeItem("sharp rock");

	newitem("opium", "poppy tears to melt your fears.", 1);
	$('#log').prepend("<li>You cut open the opium poppy, revealing a dried latex.</li>");

	Game.player.craftxp += 10;
	updateValues();
	levelCheck();
}

function makeOintment() {
	removeItem("tree sap");
	removeItem("marigold");

	newitem("ointment", "a smooth, oily substance for healing wounds.", 1);
	$('#log').prepend("<li>You mix the sap and marigold, making a helpful ointment.</li>");

	Game.player.craftxp += 10;
	updateValues();
	levelCheck();
}

function brewcornflower() {
	removeItem("cornflower");
	removeItem("water");

	newitem("coffee brew", "a small decoction for tired eyes. replenishes energy.", 1);
	$('#log').prepend("<li>You brew the cornflower in some water.</li>");

	Game.player.craftxp += 10;
	updateValues();
	levelCheck();
}

function roastMilkcap() {
	removeItem("milkcap");

	newitem("roasted shroom", "much better for you. eating this will heal you.", 1);
	$('#log').prepend("<li>You roast the milkcap over the firepit.</li>");

	Game.player.craftxp += 10;
	updateValues();
	levelCheck();
}

function eatRoastMilkcap() {
	$('#log').prepend("<li>You eat the roasted shroom, filling you with vitality.</li>");
	removeItem("roasted shroom");

	var roastInt = setInterval(function() {
		Game.player.health += 0.5;
		Game.player.energy += 0.1;
		updateValues();
	}, 50);
	setTimeout(function() {
		clearInterval(roastInt);
	}, 1500);
}

function useOintment() {
	$('#log').prepend("<li>You use the ointment, healing your wounds.</li>");
	removeItem("ointment");

	var ointInt = setInterval(function() {
		Game.player.health += 1;
		Game.player.energy += 0.1;
		updateValues();
	}, 50);
	setTimeout(function() {
		clearInterval(ointInt);
	}, 1500);
}

function drinkCoffeeBrew() {
	$('#log').prepend("<li>You drink the coffee-like brew, energising you instantly.</li>");
	removeItem("coffee brew");

	var drinkCoffee = setInterval(function() {
		Game.player.thirst += 0.2;
		Game.player.energy += 0.8;
		updateValues();
	}, 50);
	setTimeout(function() {
		clearInterval(drinkCoffee);
	}, 1000);
}

///////////////////////////
//      end buttons      //
///////////////////////////

function updateBase() {
	buttonChecker();

	if (base.length > 0) {
		$("#base").html("");
		var i;
		for (var i = 0; i < base.length; i++) {
			$("#base").append(
				  "<div class='box box-sm'>"
				+ base[i].name
				+ "</div><div class='info'>"
				+ "<i>"
				+ base[i].info
				+ "</i></div>"
			);
		}
	}
	else {
		$('#base').html("");
	}
}

function collectwater() {
	document.getElementById("collectwater").disabled = true;

	setTimeout(function() {
		document.getElementById("collectwater").disabled = false;

		newitem("water", "clear water taken from a nearby stream. used for brewing.", 2);

		$('#log').prepend("<li>You come back with some clear water.</li>");
	}, 2000);
}

function deathCheck() {
	if (Game.player.health <= 0) {
		delGame();
	}
}








function imageItems() {
	$("#base div:contains('flask')").css({
		"background-image" : "url(images/flask.png)"
	});
	$("#base div:contains('firepit')").css({
		"background-image" : "url(images/firepit.png)"
	});
	$("#base div:contains('pouch')").css({
		"background-image" : "url(images/pouch.png)"
	});

	$("#items div:contains('opium'), #mine li:contains('opium')").css({
		"background-image" : "url(images/opium.png)"
	});

	$("#items div:contains('dark berries'), #mine li:contains('dark berries')").css({
		"background-image" : "url(images/dark_berries.png)"
	});
	$("#items div:contains('red berries'), #mine li:contains('red berries')").css({
		"background-image" : "url(images/red_berries.png)"
	});
	$("#items div:contains('blue berries'), #mine li:contains('blue berries')").css({
		"background-image" : "url(images/blue_berries.png)"
	});
	$("#items div:contains('cornflower'), #mine li:contains('cornflower')").css({
		"background-image" : "url(images/cornflower.png)"
	});
	$("#items div:contains('tree sap'), #mine li:contains('tree sap')").css({
		"background-image" : "url(images/tree_sap.png)"
	});
	$("#items div:contains('leaves'), #mine li:contains('leaves')").css({
		"background-image" : "url(images/leaves.png)"
	});
	$("#items div:contains('marigold'), #mine li:contains('marigold')").css({
		"background-image" : "url(images/marigold.png)"
	});
	$("#items div:contains('milkcap'), #mine li:contains('milkcap')").css({
		"background-image" : "url(images/milkcap.png)"
	});
	$("#items div:contains('opium poppy'), #mine li:contains('opium poppy')").css({
		"background-image" : "url(images/opium_poppy.png)"
	});
	$("#items div:contains('sharp rock'), #mine li:contains('sharp rock')").css({
		"background-image" : "url(images/sharp_rock.png)"
	});
	$("#items div:contains('tree bark'), #mine li:contains('tree bark')").css({
		"background-image" : "url(images/tree_bark.png)"
	});
	$("#items div:contains('twigs'), #mine li:contains('twigs')").css({
		"background-image" : "url(images/twigs.png)"
	});
	$("#items div:contains('water'), #mine li:contains('water')").css({
		"background-image" : "url(images/water.png)"
	});

	$("#items div:contains('roasted shroom'), #mine li:contains('roasted shroom')").css({
		"background-image" : "url(images/roasted_shroom.png)"
	});
	$("#items div:contains('coffee brew'), #mine li:contains('coffee brew')").css({
		"background-image" : "url(images/coffee_brew.png)"
	});
	$("#items div:contains('ointment'), #mine li:contains('ointment')").css({
		"background-image" : "url(images/ointment.png)"
	});
}








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

	worldUpdate();
}

function loretab() {
	$('.tab').hide();
	$('#tabmenu li a').removeClass('active');

	$('#loretab').show();
	$('#lt').addClass('active');
}


















//THE WORLD TAB --->> HERE BE A NEW MECHANIC

function worldUpdate() {
	$('#distance').html(prettify(Game.world.distance));

	$('.event').hide();

	if (Game.world.distance == 0) {
		$('#theCliff__event').show();
	}
	if (Game.world.distance == 10) {
		$('#theClearing__event').show();
	}
	if (Game.world.distance == 20) {
		$('#theWaterhole__event').show();
	}
	if (Game.world.distance == 30) {
		$('#theVillage__event').show();
	}

	if (Game.world.distance >= 0) {
		Game.places.theCliff = true;
	}
	if (Game.world.distance >= 10) {
		Game.places.theClearing = true;
	}
	if (Game.world.distance >= 20) {
		Game.places.theWaterhole = true;
	}
	if (Game.world.distance >= 30) {
		Game.places.theVillage = true;
	}

	placeTest();

	//enemy

	$('#enemyHealth').html(prettify(Game.enemy.health));

	var enemyHealthBar = document.getElementById("enemyHealthBar");
	enemyHealthBar.style.width = Game.enemy.health + '%';

	if (Game.enemy.health >= 100) Game.enemy.health = 100;

	if (Game.enemy.health <= 0) {
		enemyHealthBar.style.width = '0%';
		endFight();
	}
}

function placeTest() {
	$('.place').addClass("hidden");

	if (Game.places.theCliff == true) {
		$("#theCliff").removeClass("hidden");
	}
	if (Game.places.theClearing == true) {
		$("#theClearing").removeClass("hidden");
	}
	if (Game.places.theWaterhole == true) {
		$("#theWaterhole").removeClass("hidden");
	}
	if (Game.places.theVillage == true) {
		$("#theVillage").removeClass("hidden");
	}
}

function forwards() {
	document.getElementById('forwards').disabled = true;
	document.getElementById('forwards').innerHTML = "Walking deeper...";

		var elem = document.getElementById("walkBar");
		var width = 100;
		var id = setInterval(frame, 10);
		function frame() {
			if (width <= 0) {
				clearInterval(id);
			}
			else {
				width--;
				elem.style.width = width + '%';
			}
		}

		setTimeout(function() {
			clearInterval(id)
			width = 100;
			elem.style.width = width + '%';
		}, 1000);

	//map
	explore(Game.clickdmg);

	setTimeout(function() {
		document.getElementById('forwards').disabled = false;
		document.getElementById('forwards').innerHTML = 'Venture into the forest. <i class="fa fa-arrow-up" aria-hidden="true"></i>';

		Game.world.distance += 0.5;
		worldUpdate();

		var walkint = setInterval(function() {
			Game.player.energy -= 0.1;
			updateValues();
		}, 50);
		setTimeout(function() {
			clearInterval(walkint);
		}, 500);

		$('#log').prepend("<li>You move deeper into the forest.</li>");
	}, 1000);
}

/*function backwards() {
	if (Game.world.distance >= 0.5) {
		document.getElementById('backwards').disabled = true;
		document.getElementById('backwards').innerHTML = "Backtracking steps...";

		setTimeout(function() {
			document.getElementById('backwards').disabled = false;
			document.getElementById('backwards').innerHTML = 'Backtrack your steps. <i class="fa fa-arrow-down" aria-hidden="true"></i>';

			Game.world.distance -= 0.5;
			worldUpdate();

			Game.player.energy -= 0.5;
			updateValues();

			$('#log').prepend("<li>You walk backwards.</li>");
		}, 1000);
	}
	else {
		alert("There is no way but forwards. Behind you is a sheer cliff.");
	}
}*/





function hunt() {
	if (Math.random() * 100 <= 10) {
		$('#hunt').hide();
		$('#battle').show();

		$('.place').addClass("hidden");
		$('#forwards').addClass("hidden");
		$('#backwards').addClass("hidden");

		var array = ["rabbit", "bear", "deer", "racoon", "skunk"];
		var chosen = array[Math.floor(Math.random() * array.length)];

		if (chosen == "rabbit") {
			Game.enemy.name = "rabbit";
			Game.enemy.desc = "This rabbit's eyes are bloodred. It looks just about ready to kill.";
			animalStats(0.2, 0.1, 15);
		}
		if (chosen == "bear") {
			Game.enemy.name = "bear";
			Game.enemy.desc = "A large brown bear appears from out of the shadows. It does not look friendly.";
			animalStats(0.1, 1, 100);
		}
		if (chosen == "deer") {
			Game.enemy.name = "deer";
			Game.enemy.desc = "You find a frantically braying deer. Lucky for you, it looks wounded.";
			animalStats(0.1, 0.1, 50);
		}
		if (chosen == "racoon") {
			Game.enemy.name = "racoon";
			Game.enemy.desc = "The racoon picks up a small twig to duel you with. It looks fast.";
			animalStats(0.5, 0.05, 25);
		}
		if (chosen == "skunk") {
			Game.enemy.name = "skunk";
			Game.enemy.desc = "A skunk runs towards you. The morning light shines off its black claws.";
			animalStats(0.1, 0.5, 20);
		}

		$('#log').prepend("<li class='red'>A " + Game.enemy.name + " appears suddenly.</li>");

		$('#e_name').html(Game.enemy.name);
		$('#e_desc').html(Game.enemy.desc);
		worldUpdate();
	}
}

function animalStats(response, damage, health) {
	Game.enemy.response = response;
	Game.enemy.damage = damage;
	Game.enemy.health = health;
}


function attack() {
	//player attacks

		var totaldamage = Game.world.damage + Game.player.fightlvl;
		Game.enemy.health -= totaldamage;
		worldUpdate();

		$('#log').prepend("<li>You attack the " + Game.enemy.name + " with your " + Game.world.weapon + ".</li>");

		Game.player.fightxp += 5;
		updateValues();
		levelCheck();

	//enemy responds

	if (Math.random() <= Game.enemy.response) {
		$('#log').prepend("<li class='red'>The " + Game.enemy.name + " attacks back.</li>");

		var enemyAtk = setInterval(function() {
			Game.player.health -= Game.enemy.damage;
			updateValues();
		}, 50);
		setTimeout(function() {
			clearInterval(enemyAtk);
		}, 1500);
	}
}

function endFight() {
	Game.enemy.health = 99;

	$('#hunt').show();
	$('#battle').hide();

	$('.place').removeClass("hidden");
	$('#forwards').removeClass("hidden");
	$('#backwards').removeClass("hidden");

	$('#log').prepend("<li class='green'>You win the fight.</li>");

	//possible item

	if (Math.random() * 100 <= 50) {
		newore();
		$('#log').prepend("<li class='green'>You forage for something near the animal's body.</li>");
	}

	placeTest();
}

function leaveForest() {
	var end = confirm("You have reached the end of the game -- thank you so much for playing it! Leaving the forest will reset the game, with no reward. Are you sure?");
	if (end == true) {
		localStorage.removeItem("save");
		localStorage.removeItem("mine");
		localStorage.removeItem("items");
		localStorage.removeItem("base");
		location.reload();
	}
	else {
		//keep playing :)
	}
}





function plantlevel2() {
	Game.player.plantlvl = 2;
	levelCheck();
	updateValues();
}

function stacktoggle() {
	$('body').toggleClass("stacktoggle");
}




















/////////////////////////////////////////////
/////              the map              /////
/////////////////////////////////////////////

function switchTab(tab, id) {
	$('.world .worldpage').hide();
	$('.world .menu li a').removeClass('menu_active');

	$(tab).show();
	$(id).addClass('menu_active');
}

function makeMap() {
	Game.complete = 1;
	$('#complete').html(Game.complete - 1);

	//create map
	$('#map').html("");
	used = [];
	map = [];

	for (var i = 0; i < 25; i++) {
		if (Zones.zone1[i] != undefined) {
			map.push(Zones.zone1[i]);
		}
		else {
			map.push('_');
		}
	}
	for (var i = 0; i < 25; i++) {
		if (map[i] != undefined) {
			$('#map').append('<div class="tile">' + map[i] + '<div class="fillbar"></div></div>');
		}
		else {
			$('#map').append('<div class="tile">' + '0' + '<div class="fillbar"></div></div>');
		}
		used.push({
			width: 0
		});
	}

	//coloring
	for (var i = 0; i < 25; i++) {
		$('#map .tile:not(:contains("tree"))').css({
			"color" : "#f7783c"
		});
		$('#map .tile:contains("tree")').css({
			"color" : "rgba(0,0,0,0.6)",
			"text-shadow" : "none"
		});
	}
}

function loadMap() {
	makeMap();
	
	var clicks = Game.world.distance * 2;
	for (var i = 0; i < clicks; i++) {
		explore(Game.clickdmg);
	}
}

function explore(value) {
	for (var i = Game.complete - 1; i < Game.complete; i++) {
		if (used[i] != undefined) {
			if (used[i].width <= 99) {
				used[i].width += value;
				$("#map .tile:eq(" + i + ") .fillbar").css({
					"width" : used[i].width + "%"
				});
			}
			else {
				Game.complete++;
				$('#complete').html(Game.complete - 1);
			}
		}
	}
}