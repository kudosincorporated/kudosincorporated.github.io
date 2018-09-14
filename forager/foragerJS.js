var Game = {
	player: {
		name: "Wanderer",
		title: "the Nobody",
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
		encounter: 25,
		distance: 0,
		weapon: "fists",
		damage: 1,
		armour: "plain clothes",
		defence: 0,
		money: 0,
		walkcost: {
			energy: 2,
			water: 1
		}
	},
	enemy: {
		name: "",
		desc: "",
		response: 0,
		damage: 0,
		health: 10,
		totalhealth: 10,
		fleechance: 0,
		type: 'beast',
		reward: ""
	},
	unlocked: {
		village: false
	},
	core: {
		cart: 5000,
		walk: 1000,
		foxTick: 20000,
		x_damage: 0
	},
	recipie: {
		bought: 0,
		cost: 1,
		total: $('.recipieTable tr').length - 1
	},

	complete: 1,
	zone: 1,
	clickdmg: 25
}

var used = [];
var map = [];

//map zones

var Icons = {
	tree:		'<span class="id">tree</span><i class="fa fa-tree" aria-hidden="true"></i>',
	house:		'<span class="id">house</span><i class="fa fa-home" aria-hidden="true"></i>',
	mine:		'<span class="id">mine</span><i class="fa fa-diamond" aria-hidden="true"></i>',
	water:		'<span class="id">water</span><i class="fa fa-tint" aria-hidden="true"></i>',
	binoculars:	'<span class="id">binoculars</span><i class="fa fa-binoculars" aria-hidden="true"></i>',
	signs:		'<span class="id">signs</span><i class="fa fa-map-signs" aria-hidden="true"></i>',
	cubes:		'<span class="id">cubes</span><i class="fa fa-cubes" aria-hidden="true"></i>',
	gift:		'<span class="id">gift</span><i class="fa fa-gift" aria-hidden="true"></i>',
	flag:		'<span class="id">flag</span><i class="fa fa-flag" aria-hidden="true"></i>',
	mark:		'<span class="id">mark</span><i class="fa fa-exclamation" aria-hidden="true"></i>',
	person:		'<span class="id">person</span><i class="fa fa-user" aria-hidden="true"></i>'
}

var Zones = {
	zone1: [
		Icons.tree, Icons.tree, Icons.tree, Icons.tree, Icons.house
	],
	current: []
};

var orearray = [
	'dark berries',
	'red berries',
	'blue berries'
];

var weights = [
	1,		//dark berries
	1,		//red berries
	1,		//blue berries
	4,		//leaves
	3,		//twigs
	3,		//tree bark
	2,		//tree sap
	2,		//marigold
	2,		//milkcap
	2,		//cornflower
	2,		//opium poppy
	3		//sharp rock
];


var mine = [];
for (var i = 0; i < 9; i++) {
	mine[i] = {
		ore: "",
		weight: ""
	}
}

var items = [];
var base = [];

//the RUNE UPDATE

var equipped = [];
var accessories = [];


function update() {
	updateValues();
	updateMine();
	updateItems();
	updateBase();
	imageItems();
	buttonChecker();
	playerUpdate();
	updateVillage();
}

function mineInit() {
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
			case 'deerskin':
				clickedItem("deerskin", "the raw hide of a deer.", 3, index);
				break;
			case 'green berries':
				clickedItem("green berries", "A racoon's favorite treat.", 1, index);
				break;
			case 'rabbit meat':
				clickedItem("rabbit meat", "The raw meat of a fallen rabbit.", 2, index);
				break;
			case 'bear tooth':
				clickedItem("bear tooth", "A large fang ripped from the mouth of a bear.", 1, index);
				break;
			default:
				console.log("clicked an empty square.");
		}
	});
}

function accInit() {
	buffCheck();

	//initialise accessories
	$("#equipped").on('click', 'div', function () {
		var index = $("#equipped div").index(this);
		accessories.splice(0, 0, {
			name: equipped[index].name,
			info: equipped[index].info
		});
		equipped.splice(index, 1);
		makeArrays();
		buffCheck();
	});

	$("#accessories").on('click', 'div', function () {
		if (equipped.length < 3) {
			var index = $("#accessories div").index(this);
			equipped.splice(equipped.length, 0, {
				name: accessories[index].name,
				info: accessories[index].info
			});
			accessories.splice(index, 1);
			makeArrays();
			buffCheck();
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
		name: Game.player.name,
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
		money: Game.world.money,
		bought: Game.recipie.bought,

		//storyline
		village: Game.unlocked.village
	};
	localStorage.setItem("save", JSON.stringify(save));
	localStorage.setItem("mine", JSON.stringify(mine));
	localStorage.setItem("items", JSON.stringify(items));
	localStorage.setItem("base", JSON.stringify(base));
	localStorage.setItem("equipped", JSON.stringify(equipped));
	localStorage.setItem("accessories", JSON.stringify(accessories));

	//the map
	localStorage.setItem("map", JSON.stringify(map));
}

function loadGame() {
	update();
	mineInit();
	accInit();

	$('.recipieTable tr').hide();
	$('.shoptab').hide();

	if (localStorage.getItem("save") != undefined) {
		var savegame = JSON.parse(localStorage.getItem("save"));
		var savemine = JSON.parse(localStorage.getItem("mine"));
		var saveitems = JSON.parse(localStorage.getItem("items"));
		var savebase = JSON.parse(localStorage.getItem("base"));
		var savemap = JSON.parse(localStorage.getItem("map"));
		var saveequipped = JSON.parse(localStorage.getItem("equipped"));
		var saveaccessories = JSON.parse(localStorage.getItem("accessories"));

		if (savemine != "") mine = savemine;
		if (saveitems != "") items = saveitems;
		if (savebase != "") base = savebase;
		if (saveequipped != "") equipped = saveequipped;
		if (saveaccessories != "") accessories = saveaccessories;

		//the map
		if (savemap != "") map = savemap;
		constructMap();

		if (typeof savegame.name !== "undefined") Game.player.name = savegame.name;
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
		if (typeof savegame.money !== "undefined") Game.world.money = savegame.money;
		if (typeof savegame.bought !== "undefined") Game.recipie.bought = savegame.bought;

		//storyline
		if (typeof savegame.village !== "undefined") Game.unlocked.village = savegame.village;
		unlockTest();
		buffCheck();
		initBook();

		update();
		worldUpdate();
		loadMap();
	}
	else {
		//makes a new map for first time users!
		genNewMap();
		constructMap();
	}
}

function delGame() {
	alert("You could not survive the forest!");
	localStorage.removeItem("save");
	localStorage.removeItem("mine");
	localStorage.removeItem("items");
	localStorage.removeItem("base");
	localStorage.removeItem("equipped");
	localStorage.removeItem("accessories");
	localStorage.removeItem("map");
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
	mine.splice(index, 1, {
		ore: "",
		weight: ""
	});
	updateMine();
	$(this).remove();
}

function sendcart() {
	document.getElementById("sendcart").disabled = true;

	var elem = document.getElementById("myBar");
	var width = 100;
	var carttime = Game.core.cart / 100;
	var id = setInterval(frame, carttime);
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
		Game.player.energy -= 1;
		updateValues();

		Game.player.plantxp += 10;
		levelCheck();
		updateValues();
	}, Game.core.cart);
}

function newore() {
	var position = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	var point = position[Math.floor(Math.random() * position.length)];

	var number = Math.floor(Math.random() * orearray.length);

	var ore = orearray[number];
	var weight = weights[number];

	if (mine[point].ore == "") {
		mine.splice(point, 1, {
			ore: ore,
			weight, weight
		});
		updateMine();
	}
	else {
		var full = 0;
		for (var i = 0; i < 9; i++) {
			if (mine[i].ore != "") {
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

function newDrop(ore, weight) {
	for (var i = 0; i < 9; i++) {
		if (mine[i].ore == "") {
			mine.splice(i, 1, {
				ore: ore,
				weight, weight
			});
			updateMine();
			break;
		}
	}
}

function dropall() {
	for (var i = 0; i < 9; i++) {
		mine[i] = {
			ore: "",
			weight: ""
		}
	}

	updateMine();
}

function updateMine() {
	document.getElementById("mine").innerHTML = "";
	for (var i = 0; i < mine.length; i++) {
		mineupdate = "<li>" + mine[i].ore + "</li><span class='info'>" + mine[i].weight + "</span>";
		document.getElementById("mine").innerHTML += mineupdate;

		if (mine[i].ore != "") {
			$('#mine li:nth-of-type(' + (i + 1) + ')').addClass('collect');
		}
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

function sortBase() {
	base = base.sort(function (a, b) {
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
	else if (Game.enemy.name == "") {
		$('#forwards').removeClass("hidden");
	}

	//xp bar fills
	barfill("plantxp", "nextlvlplant", "#plantbar", "#planttxt");
	barfill("craftxp", "nextlvlcraft", "#craftbar", "#crafttxt");
	barfill("fightxp", "nextlvlfight", "#fightbar", "#fighttxt");
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
			opium: 0,

		//crafted
			deerskin: 0,
			bearTooth: 0,
			greenBerries: 0,
			rabbitMeat: 0,
			leather: 0,
			spear: 0,
			cookedRabbit: 0
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

		//battle rewards
		itemInc("deerskin", "deerskin", i);
		itemInc("bear tooth", "bearTooth", i);
		itemInc("green berries", "greenBerries", i);
		itemInc("rabbit meat", "rabbitMeat", i);
		itemInc("leather", "leather", i);
		itemInc("spear", "spear", i);
		itemInc("cooked rabbit", "cookedRabbit", i);
	}

	var haveFlask = false;
	var haveFirepit = false;
	var havePouch = false;
	var haveSmallBag = false;

	for (var i = 0; i < base.length; i++) {
		if (base[i].name == "flask") {
			haveFlask = true;
		}
		if (base[i].name == "firepit") {
			haveFirepit = true;
		}
		if (base[i].name == "pouch") {
			havePouch = true;
		}
		if (base[i].name == "small bag") {
			haveSmallBag = true;
		}
	}

	$('#use').html("");
	$('#craft').html("");
	$('#misc').html("");

	//use resources

	if (itemCheck.darkBerries >= 1) { //dark berries
		$('#use').append('<button id="eatDarkBerries" onclick="eatDarkBerries()">Eat dark berries.</button>');
	}

	if (itemCheck.redBerries >= 1) { //red berries
		$('#use').append('<button id="eatRedBerries" onclick="eatRedBerries()">Eat red berries.</button>');
	}

	if (itemCheck.blueBerries >= 1) { //blue berries
		$('#use').append('<button id="eatBlueBerries" onclick="eatBlueBerries()">Eat blue berries.</button>');
	}

	if (itemCheck.greenBerries >= 1) { //green berries
		$('#use').append('<button id="eatGreenBerries" onclick="eatGreenBerries()">Eat green berries.</button>');
	}

	if (itemCheck.milkcap >= 1) { //eat milkcap
		$('#use').append('<button id="eatMilkcap" onclick="eatMilkcap()">Eat milkcap.</button>');
	}

	if (itemCheck.opiumPoppy >= 1 && itemCheck.sharpRock >= 1 && Game.player.craftlvl >= 1) { //(craft level 2 is required to do this)
		$('#craft').append('<button id="extractOpium" onclick="extractOpium()">Extract opium.</button>');
	}

	if (itemCheck.roastMilkcap >= 1) { //eat roast shroom
		$('#use').append('<button id="eatRoastMilkcap" onclick="eatRoastMilkcap()">Eat roasted shroom.</button>');
	}

	if (itemCheck.treeSap >= 1 && itemCheck.marigold >= 1) { //make ointment
		$('#craft').append('<button id="makeOintment" onclick="makeOintment()">Make ointment.</button>');
	}

	if (itemCheck.ointment >= 1) { //use ointment
		$('#use').append('<button id="useOintment" onclick="useOintment()">Use ointment.</button>');
	}

	if (itemCheck.coffeeBrew >= 1) { //drink coffee brew
		$('#use').append('<button id="drinkCoffeeBrew" onclick="drinkCoffeeBrew()">Drink coffee brew.</button>');
	}

	if (itemCheck.water >= 1) { //drink water
		$('#use').append('<button id="drinkWater" onclick="drinkWater()">Drink water.</button>');
	}

	if (itemCheck.cookedRabbit >= 1) { //eat rabbit
		$('#use').append('<button id="eatCookedRabbit" onclick="eatCookedRabbit()">Eat cooked rabbit.</button>');
	}

	//craft resources

	if (itemCheck.leaves >= 1 && itemCheck.twigs >= 1 && haveFlask != true) { //crafing flask
		$('#craft').append('<button id="craftFlask" onclick="craftFlask()">Craft flask.</button>');
	}

	if (itemCheck.twigs >= 1 && itemCheck.treeBark >= 1 && haveFirepit != true) { //crafing firepit
		$('#craft').append('<button id="craftFirepit" onclick="craftFirepit()">Make firepit.</button>');
	}

	if (itemCheck.leaves >= 1 && itemCheck.treeBark >= 1 && havePouch != true) { //crafing pouch
		$('#craft').append('<button id="craftPouch" onclick="craftPouch()">Craft pouch.</button>');
	}

	if (itemCheck.leather >= 1 && itemCheck.treeSap >= 1 && haveSmallBag != true && Game.player.craftlvl >= 1) { //crafting small bag (craft lvl 2)
		$('#craft').append('<button id="craftSmallBag" onclick="craftSmallBag()">Craft small bag.</button>');
	}

	if (haveFirepit == true && itemCheck.milkcap >= 1) { //roast milkcap
		$('#craft').append('<button id="roastMilkcap" onclick="roastMilkcap()">Roast milkcap.</button>');
	}

	if (haveFirepit == true && itemCheck.cornflower >= 1 && itemCheck.water >= 1) { //make coffee brew
		$('#craft').append('<button id="brewcornflower" onclick="brewcornflower()">Brew cornflower.</button>');
	}

	if (haveFirepit == true && itemCheck.deerskin >= 1) { //make leather
		$('#craft').append('<button id="makeLeather" onclick="makeLeather()">Make leather.</button>');
	}

	if (itemCheck.bearTooth >= 1 && itemCheck.twigs >= 1 && Game.player.craftlvl >= 1) { //craft spear (craft lvl 2)
		$('#craft').append('<button id="craftSpear" onclick="craftSpear()">Craft spear.</button>');
	}

	if (haveFirepit == true && itemCheck.rabbitMeat >= 1 && Game.player.craftlvl >= 1) { //make leather (craft lvl 2)
		$('#craft').append('<button id="cookRabbit" onclick="cookRabbit()">Cook rabbit meat.</button>');
	}

	//misc resources

	if (haveFlask == true) { //collect water
		$('#misc').append('<button id="collectwater" onclick="collectwater()">Collect water.</button>');
	}

	//weaponcheck

	if (itemCheck.spear >= 1) {
		Game.world.weapon = "spear";
		Game.world.damage = 6;
	}
	else if (itemCheck.sharpRock >= 1) {
		Game.world.weapon = "sharp rock";
		Game.world.damage = 3;
	}
	else {
		Game.world.weapon = "fists";
		Game.world.damage = 1;
	}

	var totaldamage = Game.world.damage + Game.player.fightlvl + Game.core.x_damage;
	$('.weapon').html(Game.world.weapon + " (" + totaldamage + " damage)");

	//armourcheck (placement temporaray)
	var totaldefence = Game.world.defence;
	$('.armour').html(Game.world.armour + " (" + totaldefence + " defence)");
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

	Game.player.health -= 10;
	Game.player.thirst -= 5;
	updateValues();
}

function eatRedBerries() {
	$('#log').prepend("<li class='red'>The red berries parch your throat and weaken you.</li>");
	removeItem("red berries");

	Game.player.thirst -= 10;
	Game.player.energy -= 5;
	updateValues();
}

function eatBlueBerries() {
	$('#log').prepend("<li>The berries are slightly sour, but tasty.</li>");
	removeItem("blue berries");

	Game.player.health += 5;
	Game.player.thirst += 3;
	Game.player.energy += 2;
	updateValues();
}

function eatMilkcap() {
	$('#log').prepend("<li>The milkcap tastes like... nothing.</li>");
	removeItem("milkcap");

	Game.player.health += 5;
	Game.player.energy += 5;
	updateValues();
}

function drinkWater() {
	$('#log').prepend("<li>You drink some of your water.</li>");
	removeItem("water");

	Game.player.thirst += 20;
	updateValues();
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
	Game.player.craftxp += 10;
	updateValues();
	levelCheck();
}

function craftSmallBag() {
	removeItem("leather");
	removeItem("tree sap");

	base.push({
		name: "small bag",
		info: "a leather bag to carry more items."
	});
	updateBase();
	imageItems();

	$('#log').prepend("<li>You craft a small bag from leather to carry more supplies.</li>");

	Game.player.totalweight += 20;
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

	Game.player.health += 20;
	Game.player.energy += 30;
	updateValues();
}

function useOintment() {
	$('#log').prepend("<li>You use the ointment, healing your wounds.</li>");
	removeItem("ointment");

	Game.player.health += 45;
	updateValues();
}

function drinkCoffeeBrew() {
	$('#log').prepend("<li>You drink the coffee-like brew, energising you instantly.</li>");
	removeItem("coffee brew");

	Game.player.thirst += 15;
	Game.player.energy += 30;
	updateValues();
}

function eatGreenBerries() {
	$('#log').prepend("<li>The green berries are sweet and juicy.</li>");
	removeItem("green berries");

	Game.player.health += 15;
	Game.player.thirst += 15;
	updateValues();
}

function makeLeather() {
	removeItem("deerskin");

	newitem("leather", "a strong, versatile material.", 1);
	$('#log').prepend("<li>You tan the deer hide into leather.</li>");

	Game.player.craftxp += 10;
	updateValues();
	levelCheck();
}

function craftSpear() {
	removeItem("bear tooth");
	removeItem("twigs");

	newitem("spear", "finally, you can poke something from a distance.", 1);
	$('#log').prepend("<li>You craft a rudimentary spear.</li>");

	Game.player.craftxp += 10;
	updateValues();
	levelCheck();
}

function cookRabbit() {
	removeItem("rabbitMeat");

	newitem("cooked rabbit", "the cooked rabbit smells much better.", 1);
	$('#log').prepend("<li>You cook the rabbit meat over an open flame.</li>");

	Game.player.craftxp += 10;
	updateValues();
	levelCheck();
}

function eatCookedRabbit() {
	$('#log').prepend("<li>You eat the cooked rabbit meat.</li>");
	removeItem("cooked rabbit");

	Game.player.health += 50;
	Game.player.energy += 30;
	updateValues();
}


///////////////////////////
//      end buttons      //
///////////////////////////

function updateBase() {
	buttonChecker();

	sortBase();

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






	$(".acc:contains('bone necklace')").css({
		"background-image" : "url(images/bone_necklace.png)"
	});
	$(".acc:contains('saphire amulet')").css({
		"background-image" : "url(images/saphire_amulet.png)"
	});
	$(`.acc:contains("wanderer's shoes")`).css({
		"background-image" : "url(images/wanderer's_shoes.png)"
	});
	$(".acc:contains('ruby ring')").css({
		"background-image" : "url(images/ruby_ring.png)"
	});
	$(".acc:contains('german shepherd')").css({
		"background-image" : "url(images/dog_german.png)"
	});
	$(".acc:contains('foxhound')").css({
		"background-image" : "url(images/dog_fox.png)"
	});
}








function carttab() {
	cleartabs();
	$('#carttab').show();
	$('#ct').addClass('active');
}

function battletab() {
	cleartabs();
	$('#battletab').show();
	$('#bt').addClass('active');

	worldUpdate();
}

function loretab() {
	cleartabs();
	$('#loretab').show();
	$('#lt').addClass('active');
}

function cleartabs() {
	$('.tab').hide();
	$('#tabmenu li a').removeClass('active');
}















//THE WORLD TAB --->> HERE BE A NEW MECHANIC

function worldUpdate() {
	$('#distance').html(prettify(Game.world.distance));
	$('#zone').html(Game.zone);

	//enemy
	$('#enemyHealth').html(prettify(Game.enemy.health));

	var enemyHealthBar = document.getElementById("enemyHealthBar");
	var hp = (Game.enemy.health / Game.enemy.totalhealth) * 100;
	enemyHealthBar.style.width = hp + '%';

	if (Game.enemy.health >= Game.enemy.totalhealth) Game.enemy.health = Game.enemy.totalhealth;

	if (Game.enemy.health <= 0) {
		enemyHealthBar.style.width = '0%';
		endFight();
	}
}

function forwards() {
	document.getElementById('forwards').disabled = true;
	document.getElementById('forwards').innerHTML = "Walking deeper...";

		$('.fillbar').css({
			"transition" : Game.core.walk + "ms linear"
		})

		var elem = document.getElementById("walkBar");
		var width = 100;
		var walktime = Game.core.walk / 100;
		var id = setInterval(frame, walktime);
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
		}, Game.core.walk);

	//map
	explore(Game.clickdmg);

	setTimeout(function() {
		document.getElementById('forwards').disabled = false;
		document.getElementById('forwards').innerHTML = 'Venture into the forest. <i class="fa fa-arrow-up" aria-hidden="true"></i>';

		Game.world.distance += 0.5;
		worldUpdate();

		Game.player.energy -= Game.world.walkcost.energy;
		Game.player.thirst -= Game.world.walkcost.water;
		updateValues();

		$('#log').prepend("<li>You move deeper into the forest.</li>");

		if (placechecker() == true) {
			eventChecker();
		}
		else {
			hunt();
		}
		
	}, Game.core.walk);
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

	//newEnemy (spawn enemy) function
	if (Math.random() * 100 <= Game.world.encounter) {
		var array = ["rabbit", "bear", "deer", "racoon", "skunk"];
		var chosen = array[Math.floor(Math.random() * array.length)];

		if (chosen == "rabbit") {
			Game.enemy.name = "rabbit";
			Game.enemy.desc = "This rabbit's eyes are bloodred. It looks just about ready to kill.";
			animalStats(0.2, 3, 15, 15, 0.5);
		}
		if (chosen == "bear") {
			Game.enemy.name = "bear";
			Game.enemy.desc = "A large brown bear appears from out of the shadows. It does not look friendly.";
			animalStats(0.1, 30, 100, 100, 0.2);
		}
		if (chosen == "deer") {
			Game.enemy.name = "deer";
			Game.enemy.desc = "You find a frantically braying deer. Lucky for you, it looks wounded.";
			animalStats(0.1, 5, 50, 50, 1);
		}
		if (chosen == "racoon") {
			Game.enemy.name = "racoon";
			Game.enemy.desc = "The racoon picks up a small twig to duel you with. It looks fast.";
			animalStats(0.5, 3, 25, 25, 0.2);
		}
		if (chosen == "skunk") {
			Game.enemy.name = "skunk";
			Game.enemy.desc = "A skunk runs towards you. The morning light shines off its black claws.";
			animalStats(0.1, 15, 20, 20, 0.3);
		}

		$('#log').prepend("<li class='red'>A " + Game.enemy.name + " appears suddenly.</li>");

		//change enemy type
		Game.enemy.type = 'beast';

		$('#e_name').html(Game.enemy.name);
		$('#e_desc').html(Game.enemy.desc);
		worldUpdate();

		//show the modal
		showModal();
		$('#battle').show();
	}
}

function animalStats(response, damage, health, totalhealth, fleechance) {
	Game.enemy.response = response;
	Game.enemy.damage = damage;
	Game.enemy.health = health;
	Game.enemy.totalhealth = totalhealth;
	Game.enemy.fleechance = fleechance;
	$('#fleechance').html(Math.round(Game.enemy.fleechance * 100));
}


function attack() {
	//player attacks

		var totaldamage = Game.world.damage + Game.player.fightlvl + Game.core.x_damage;
		Game.enemy.health -= totaldamage;
		worldUpdate();

		if (Game.enemy.name != "") {
			$('#log').prepend("<li>You attack the " + Game.enemy.name + " with your " + Game.world.weapon + ", dealing " + totaldamage + " damage.</li>");
		}

		Game.player.fightxp += 1;
		updateValues();
		levelCheck();

	//enemy responds

	if (Math.random() <= Game.enemy.response) {
		enemyAttack();
	}
}

function enemyAttack() {
		if (Game.enemy.name != "") {
			$('#log').prepend("<li class='red'>The " + Game.enemy.name + " attacks you for " + Game.enemy.damage + " damage.</li>");
		}

	Game.player.health -= Game.enemy.damage;
	updateValues();
}

function bait() {
	if (itemCheck.redBerries >= 1) {
		Game.enemy.fleechance = Game.enemy.fleechance * 1.5;
		$('#fleechance').html(Math.round(Game.enemy.fleechance * 100));
		removeItem("red berries");
		$('#log').prepend("<li>You throw some berries towards the " + Game.enemy.name + " as a distaction.</li>");
	}
}

function flee() {
	if (Math.random() <= Game.enemy.fleechance) {
		$('#log').prepend("<li class='green'>You flee from the fight.</li>");
		removeFight();
	}
	else {
		$('#log').prepend("<li>Your escape attempt fails.</li>");
		enemyAttack();
	}
}

function endFight() {
	$('#log').prepend("<li class='green'>You win the fight.</li>");

	//possible item
	if (Game.enemy.type == 'beast') {
		if (Math.random() * 100 <= 80) {
			if (Game.enemy.name == 'deer') {
				newDrop("deerskin", 3);
				$('#log').prepend("<li class='green'>You strip the deer of its hide.</li>");
			}
			if (Game.enemy.name == 'bear') {
				newDrop("bear tooth", 1);
				$('#log').prepend("<li class='green'>You take a tooth from the mighty bear as a prize.</li>");
			}
			if (Game.enemy.name == 'racoon') {
				newDrop("green berries", 1);
				$('#log').prepend("<li class='green'>The racoon holds some green berries in its tiny paws.</li>");
			}
			if (Game.enemy.name == 'rabbit') {
				newDrop("rabbit meat", 2);
				$('#log').prepend("<li class='green'>You skin the rabbit and take it's meat.</li>");
			}
		}
		hideModal();
	}
	else if (Game.enemy.type == 'quest') {
		if (Game.enemy.reward == 'brute') {
			$('.questInfo').html(
				"Finally, the brute is vanquished. As a reward, the village gives you 10 gold pieces."
			);

			$('.questButton').html(
				"<button onclick='collect(10)'>Collect reward.</button>"
			);

			showModal();
			$('#questEvent').show();
		}
		else if (Game.enemy.reward == 'theif') {
			$('.questInfo').html(
				"Defeated, the theif surrenders her own wealth. You gain 2 gold pieces."
			);

			$('.questButton').html(
				"<button onclick='collect(2)'>Collect reward.</button>"
			);

			showModal();
			$('#questEvent').show();
		}
		else if (Game.enemy.reward == 'wizard') {
			$('.questInfo').html(
				"The wizard laughs maniacally and vanishes in a puff of smoke. He leaves behind 3 gold pieces."
			);

			$('.questButton').html(
				"<button onclick='collect(3)'>Collect reward.</button>"
			);

			showModal();
			$('#questEvent').show();
		}
	}

	removeFight();
}

function getMoney() {

}

function removeFight() {
	Game.enemy.health = 1;
	Game.enemy.name = "";

	if (Game.enemy.type == 'beast') {
		hideModal();
	}
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
	$('#items').toggleClass("stacktoggle");
}

function changelog() {
	$('#changelog').toggle();
}

function info() {
	if (Game.enemy.name == "") {
		showModal();
		$('#info').show();
	}
}














/////////////////////////////////////////////
/////              the map              /////
/////////////////////////////////////////////

function makeMap() {
	if (map == "") {
		genNewMap();
	}

	constructMap();
}

function genNewMap() {
	//random generation
	var tilearray = ["mine", "signs", "cubes"];
	var done = 0;

	for (var i = 0; i < 25; i++) {
		if (Zones.zone1[i] != undefined && Game.zone == 1) {
			map.push(Zones.zone1[i]);
		}
		else {
			if (Math.random() * 100 <= 50) {
				map.push(Icons["tree"]);
			}
			else {
				if (done <= 2) {
					var chosentile = tilearray[Math.floor(Math.random() * tilearray.length)];
					map.push(Icons[tilearray[done]]);
					done++;
				}
				else {
					var chosentile = tilearray[Math.floor(Math.random() * tilearray.length)];
					map.push(Icons[chosentile]);
				}
			}
		}
	}
}

function constructMap() {
	Game.complete = 1;
	$('#complete').html(Game.complete);

	//create map
	$('#map').html("");
	used = [];

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

				if (used[i].width >= 100) {
					nextZone();
				}
			}
			else {
				Game.complete++;
				$('#complete').html(Game.complete);
			}
		}
	}
}


function nextZone() {
	if (Game.complete == 25) {
		Game.zone += 1;
		$('#zone').html(Game.zone);

		constructMap();

		$('#log').prepend("<li class='green'>You advance to the next zone of the forest.</li>");
	}
}






//player tab

function playerUpdate() {
	$('.playername').html(Game.player.name);
	$('.playertitle').html(Game.player.title);
}

function changename() {
	var person = prompt("What's your name?", Game.player.name);
	if (person != null && person != "") {
		Game.player.name = person;
	}
	playerUpdate();
}









//collapsible

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
	acc[i].addEventListener("click", function() {
		/* Toggle between adding and removing the "active" class,
		to highlight the button that controls the panel */
		this.classList.toggle("active");

		/* Toggle between hiding and showing the active panel */
		var panel = this.nextElementSibling;
		if (panel.style.display === "none") {
			panel.style.display = "block";
		}
		else {
			panel.style.display = "none";
		}

	$(".accordion").html('<i class="fa fa-chevron-up" aria-hidden="true"></i>');
	$(".accordion.active").html('<i class="fa fa-chevron-down" aria-hidden="true"></i>');
	});
}











function eventChecker() {
	switch ($('#map .tile').eq(Game.complete - 1).text()) {
		case 'house':
			villageEvent();
			break;
		case 'signs':
			questEvent();
			break;
		case 'mine':
			mineEvent();
			break;
		case 'cubes':
			cubesEvent();
			break;
		default:
			//none
	}
}

function placechecker() {
	var position = (Game.world.distance - ((Game.zone - 1) * 50)) / 2;

	switch ($('#map .tile').eq(position - 1).text()) {
		case "":
			return false; //checks if not on edge of square
			break;
		case "tree":
			return false; //checks if on edge of tree square
			break;
		default:
			return true; //otherwise, you got urself an event!
	}
}


function showModal() {
	$('.event_modal').hide();
	$('.modal_bg').fadeIn(300);
	$('.modal_bg').removeClass("hide");
	$('.modal_bg').css({
		"display" : "inline-flex"
	});
}

function hideModal() {
	$('.modal_bg').fadeOut(300);
	$('.modal_bg').addClass("hide");
	$('.event_modal').hide();
}

function questEvent() {
	var array = [
		"A timid man approaches you, wringing his hands. He tells you that his village is being terrorised by a masked brute, and offers you gold in exchange for your help in ridding the village of his evil shadow.",
		"A cloaked figure appears from behind a tree, demanding money. She holds a handmade dagger, but looks injured. You could probably outrun her.",
		"A crazed wizard blocks your path. He demands you fight him to prove your worth."
	];

	var enemyArray = [
		"brute",
		"theif",
		"wizard"
	];

	var number = Math.floor(Math.random() * array.length);
	$('.questInfo').html(array[number]);

	$('.questButton').html(
		"<button onclick='beginQuest(`" + enemyArray[number] + "`, `" + array[number] + "`)'>Begin quest.</button>"
	);

	showModal();
	$('#questEvent').show();
}

function beginQuest(enemy, desc) {
		if (enemy == "brute") {
			Game.enemy.name = "burly brute";
			Game.enemy.desc = "<div class='grey marginb'>" + desc + "</div><div>The masked villan stands before you, holding a bag of stolen goods. The village watches with bated breath.";
			animalStats(0.1, 20, 80, 80, 0);
		}
		if (enemy == "theif") {
			Game.enemy.name = "spindly theif";
			Game.enemy.desc = "<div class='grey marginb'>" + desc + "</div><div>The theif makes a jab with her dagger, and you are forced to respond.</div>";
			animalStats(0.4, 6, 30, 30, 0);
		}
		if (enemy == "wizard") {
			Game.enemy.name = "wicked wizard";
			Game.enemy.desc = "<div class='grey marginb'>" + desc + "</div><div>The wizard waves his staff at you, spitting in your direction. His long beard waves in the morning wind.</div>";
			animalStats(0.3, 15, 50, 50, 0);
		}

		$('#log').prepend("<li class='red'>A " + Game.enemy.name + " appears.</li>");

		//change enemy type
		Game.enemy.type = 'quest';
		Game.enemy.reward = enemy;

		$('#e_name').html(Game.enemy.name);
		$('#e_desc').html(Game.enemy.desc);
		worldUpdate();

		//show the modal
		showModal();
		$('#battle').show();
}

function mineEvent() {
	var array = [
		"A gold piece sticks out of the grass. Someone must have dropped it.",
		"You find a small bag of money, hidden under a rock. Inside is a few dirty gold pieces.",
		"Buried in the dirt is a small ruby. Probably worth a bit of money.",
		"You spot a rare kind of flower poking out from a tree stump. It's worth a nice amount of gold."
	];

	var moneyArray = [
		1,
		3,
		6,
		10
	];

	var number = Math.floor(Math.random() * array.length);
	$('.mineInfo').html(array[number]);

	$('.mineButton').html(
		"<button onclick='collect(" + moneyArray[number] + ")'>Collect " + moneyArray[number] + " gold pieces.</button>"
	);

	showModal();
	$('#mineEvent').show();
}

function collect(number) {
	Game.world.money += number;
	$('.money').html(Game.world.money);

	hideModal();
}

function cubesEvent() {
	for (var i = 0; i < 9; i++) {
		newore();
	}

	var array = [
		"You look up and find yourself in a small clearing. It's covered in flora, and you fill your pockets with supplies.",
		"Next to an abandoned camp you find a small satchel filled with various forest supplies.",
		"You pass a wizened wanderer, who gives you a small bag filled with flora picked from the forest. He leaves before you can thank him."
	];

	var number = Math.floor(Math.random() * array.length);
	$('.cubesInfo').html(array[number]);

	showModal();
	$('#cubesEvent').show();
}

function villageEvent() {
	showModal();
	$('#villageEvent').show();

	//admin
	Game.unlocked.village = true;
	$('#lt').removeClass('locked');
}



function unlockTest() {
	if (Game.unlocked.village == true) {
		$('#lt').removeClass('locked');
	}
}





//THE RUNE UPDATE

function updateVillage() {
	makeArrays();

	$('.money').html(Game.world.money);
}

function makeArrays() {
	if (accessories.length > 0) {
		$("#accessories").html("");

		for (var i = 0; i < accessories.length; i++) {
			$("#accessories").append(
				  "<div class='box box-sm acc'>"
				+ accessories[i].name
				+ "</div><span class='info'>"
				+ accessories[i].info
				+ "</span>"
			);
		}
	}
	else {
		$('#accessories').html("");
	}

	if (equipped.length > 0) {
		$("#equipped").html("");

		for (var i = 0; i < equipped.length; i++) {
			$("#equipped").append(
				  "<div class='box box-sm acc'>"
				+ equipped[i].name
				+ "</div><span class='info'>"
				+ equipped[i].info
				+ "</span>"
			);
		}
	}
	else {
		$('#equipped').html("");
	}

	imageItems();
}

function buyAccessory(name, info, price, id) {
	if (Game.world.money >= price) {
		Game.world.money -= price;
		accessories.push({
			name: name,
			info: info
		});
		$(id).addClass('bought');
	}
	else {
		alert("You don't have enough money to buy the " + name + ". It costs " + price + " gold and you have " + Game.world.money + " gold.");
	}

	updateVillage();
}


var auto;

function autofox() {
	var int = 0;
	var final = Game.core.foxTick / 1000;

	auto = setInterval(function() {
		int++;
		if (int >= final) {
			newore();
			$('#log').prepend("<li class='green'>Your foxhound forages and finds something.</li>");
			int = 0;
		}
	}, 1000);
}

function buffCheck() {
	for (var i = 0; i < equipped.length; i++) {
		if (equipped[i].name == "bone necklace") {
			Game.world.encounter = 10;
			$('#s_bn').addClass('bought');
		}
		if (equipped[i].name == "wanderer's shoes") {
			Game.world.walkcost.energy = 0;
			Game.world.walkcost.water = 0;
			$('#s_ws').addClass('bought');
		}
		if (equipped[i].name == "ruby ring") {
			Game.core.walk = 600;
			$('#s_rr').addClass('bought');
		}
		if (equipped[i].name == "foxhound") {
			clearInterval(auto);
			autofox();
			$('#s_fh').addClass('bought');
		}
		if (equipped[i].name == "saphire amulet") {
			Game.core.x_damage = 2;
			$('#s_sa').addClass('bought');
		}
		if (equipped[i].name == "german shepherd") {
			Game.core.cart = 2000;
			$('#s_gs').addClass('bought');
		}
	}

	for (var i = 0; i < accessories.length; i++) {
		if (accessories[i].name == "bone necklace") {
			Game.world.encounter = 25;
			$('#s_bn').addClass('bought');
		}
		if (accessories[i].name == "wanderer's shoes") {
			Game.world.walkcost.energy = 2;
			Game.world.walkcost.water = 1;
			$('#s_ws').addClass('bought');
		}
		if (accessories[i].name == "ruby ring") {
			Game.core.walk = 1000;
			$('#s_rr').addClass('bought');
		}
		if (accessories[i].name == "saphire amulet") {
			Game.core.x_damage = 0;
			$('#s_sa').addClass('bought');
		}
		if (accessories[i].name == "german shepherd") {
			Game.core.cart = 5000;
			$('#s_gs').addClass('bought');
		}
		if (accessories[i].name == "foxhound") {
			clearInterval(auto);
			$('#s_fh').addClass('bought');
		}
	}

	var totaldamage = Game.world.damage + Game.player.fightlvl + Game.core.x_damage;
	$('.weapon').html(Game.world.weapon + " (" + totaldamage + " damage)");
}



function showBook() {
	showModal();
	$('#book').show();
}

function buyRecipie() {
	if (Game.recipie.bought <= Game.recipie.total) {
		if (Game.world.money >= Game.recipie.cost) {
			Game.world.money -= Game.recipie.cost;
			$('.money').html(Game.world.money);

			$('.recipieTable tr').eq(Game.recipie.bought).show();
			Game.recipie.bought++;
		}
		else {
			alert("You cannot buy this. It costs " + Game.recipie.cost + " gold and you have " + Game.world.money + " gold.");
		}
	}
	else {
		alert("You have bought all the recipies!");
	}

	updateBought();
}

function initBook() {
	for (var i = 0; i < Game.recipie.bought; i++) {
		$('.recipieTable tr').eq(i).show();
	}

	updateBought();
}

function updateBought() {
	$('.r_bought').html(Game.recipie.bought);
	$('.r_total').html(Game.recipie.total + 1);
}





function newTab(id) {
	$('.shoptab').hide();
	$(id).show();
}

function freewalk() {
	Game.world.encounter = 0;
	Game.core.walk = 10;
	Game.world.walkcost.energy = 0;
	Game.world.walkcost.water = 0;
}

function barfill(_xp, nextlvl_, id, txt) {
	if (Game.player[_xp] >= Game.player[nextlvl_]) {
		Game.player[_xp] = Game.player[nextlvl_];
	}

	var percentage = (Game.player[_xp] / Game.player[nextlvl_]) * 100;
	$(txt).html(percentage.toFixed(0) + "%")

	var fill = (Game.player[_xp] / Game.player[nextlvl_]) * 100;
	$(id).css({
		"width" : fill + "%"
	});
}