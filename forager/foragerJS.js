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
		complete: 1,
		zone: 1,
		clickdmg: 25,
		walkcost: {
			energy: 2,
			water: 1
		},
	},
	enemy: {
		name: "",
		desc: "",
		response: 0,
		damage: 0,
		health: 10,
		totalhealth: 10,
		fleechance: 0,
		type: "",
		reward: ""
	},
	journey: {
		health: 10,
		totalhealth: 10,
		damage: 2
	},
	unlocked: {
		village: false
	},
	core: {
		unlocked: 2,
		cart: 5000,
		walk: 1000,
		foxTick: 20000,
		x_damage: 0
	},
	recipie: {
		total: $('.recipieTable tr').length,
		notbought: [],
		bought: [],
		cost: 1
	}
}

for (var i = 0; i < Game.recipie.total; i++) {
	Game.recipie.notbought.push(i);
}

var used = [];
var map = [];

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

var drops = {
	main: [
		{
			name: 'dark berries',
			info: 'they look... menacing.',
			weight: 1
		},{
			name: 'red berries',
			info: 'they look... tasty.',
			weight: 1
		},{
			name: 'blue berries',
			info: 'they look... bland.',
			weight: 1
		},{
			name: 'leaves',
			info: 'thick, green leaves from an unknown tree.',
			weight: 4
		},{
			name: 'twigs',
			info: 'a small bundle of sticks.',
			weight: 3
		},{
			name: 'tree sap',
			info: 'a slightly sweet, sticky substance.',
			weight: 2
		},{
			name: 'marigold',
			info: 'helpful for treating wounds used to make ointment.',
			weight: 2
		},{
			name: 'milkcap',
			info: 'tasty if prepared in a firepit.',
			weight: 2
		},{
			name: 'cornflower',
			info: 'an ancient remedy for tired eyes when mixed with water.',
			weight: 2
		},{
			name: 'opium poppy',
			info: 'now this looks interesting...',
			weight: 2
		},{
			name: 'sharp rock',
			info: "it's sharp enough to be used as a weapon.",
			weight: 1
		},{
			name: 'tree bark',
			info: 'a strong piece of bark.',
			weight: 3
		}
	],
	world: [
		{
			name: 'deerskin',//0
			info: 'the raw hide of a deer.',
			weight: 3
		},{
			name: 'green berries',//1
			info: "a racoon's favorite treat.",
			weight: 1
		},{
			name: 'rabbit meat',//2
			info: "the raw meat of a fallen rabbit.",
			weight: 2
		},{
			name: 'bear tooth',//3
			info: 'a large fang ripped from the mouth of a bear.',
			weight: 3
		},{
			name: 'vitality potion',//4
			info: "heals your up.",
			weight: 1
		},{
			name: 'quench potion',//5
			info: "sates your thirst.",
			weight: 1
		},{
			name: 'zeal potion',//6
			info: "gives you energy.",
			weight: 1
		}
	]
}

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
	worldUpdate();
}

function mineInit() {
	$("#mine").on('click', 'li', function () {
		var index = $("#mine li").index(this);
		
		var name = mine[index].ore;
		var info = mine[index].info;
		var weight = mine[index].weight;

		if (name != "") {
			clickedItem(name, info, weight, index);
		}
		else {
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

		distance: Game.world.distance,
		money: Game.world.money,
		bought: Game.recipie.bought,
		notbought: Game.recipie.notbought,
		zone: Game.world.zone,

		//storyline
		village: Game.unlocked.village,

		//arrays
		mine: mine,
		items: items,
		base: base,
		equipped: equipped,
		accessories: accessories,
		map: map
	};
	var main = {
		plantlvl: Game.player.plantlvl,
		plantxp: Game.player.plantxp,
		nextlvlplant: Game.player.nextlvlplant,
		craftlvl: Game.player.craftlvl,
		craftxp: Game.player.craftxp,
		nextlvlcraft: Game.player.nextlvlcraft,
		fightlvl: Game.player.fightlvl,
		fightxp: Game.player.fightxp,
		nextlvlfight: Game.player.nextlvlfight,
	}
	localStorage.setItem("save", JSON.stringify(save));
	localStorage.setItem("main", JSON.stringify(main));
}

function loadGame() {
	update(); //general update of values
	mineInit(); //allows clicking of foraged items
	accInit(); //allows clicking of accessories

	$('.recipieTable tr').hide();
	$('.shoptab').hide();

	if (localStorage.getItem("main") != undefined) {
		var savegame = JSON.parse(localStorage.getItem("main"));

		//experience
			if (typeof savegame.plantlvl !== "undefined") Game.player.plantlvl = savegame.plantlvl;
			if (typeof savegame.plantxp !== "undefined") Game.player.plantxp = savegame.plantxp;
			if (typeof savegame.nextlvlplant !== "undefined") Game.player.nextlvlplant = savegame.nextlvlplant;
			if (typeof savegame.craftlvl !== "undefined") Game.player.craftlvl = savegame.craftlvl;
			if (typeof savegame.craftxp !== "undefined") Game.player.craftxp = savegame.craftxp;
			if (typeof savegame.nextlvlcraft !== "undefined") Game.player.nextlvlcraft = savegame.nextlvlcraft;
			if (typeof savegame.fightlvl !== "undefined") Game.player.fightlvl = savegame.fightlvl;
			if (typeof savegame.fightxp !== "undefined") Game.player.fightxp = savegame.fightxp;
			if (typeof savegame.nextlvlfight !== "undefined") Game.player.nextlvlfight = savegame.nextlvlfight;
	}

	if (localStorage.getItem("save") != undefined) {
		var savegame = JSON.parse(localStorage.getItem("save"));

	//arrays --------------------------------------------------------------
		if (typeof savegame.mine !== "undefined") mine = savegame.mine;
		if (typeof savegame.items !== "undefined") items = savegame.items;
		if (typeof savegame.base !== "undefined") base = savegame.base;
		if (typeof savegame.equipped !== "undefined") equipped = savegame.equipped;
		if (typeof savegame.accessories !== "undefined") accessories = savegame.accessories;
		if (typeof savegame.map !== "undefined") map = savegame.map;

	//values --------------------------------------------------------------
		if (typeof savegame.name !== "undefined") Game.player.name = savegame.name;
		if (typeof savegame.health !== "undefined") Game.player.health = savegame.health;
		if (typeof savegame.thirst !== "undefined") Game.player.thirst = savegame.thirst;
		if (typeof savegame.energy !== "undefined") Game.player.energy = savegame.energy;
		if (typeof savegame.weight !== "undefined") Game.player.weight = savegame.weight;
		if (typeof savegame.totalweight !== "undefined") Game.player.totalweight = savegame.totalweight;

	//world values --------------------------------------------------------------
		if (typeof savegame.distance !== "undefined") Game.world.distance = savegame.distance;
		if (typeof savegame.money !== "undefined") Game.world.money = savegame.money;
		if (typeof savegame.bought !== "undefined") Game.recipie.bought = savegame.bought;
		if (typeof savegame.notbought !== "undefined") Game.recipie.notbought = savegame.notbought;
		if (typeof savegame.zone !== "undefined") Game.world.zone = savegame.zone;
		

			//storyline
				if (typeof savegame.village !== "undefined") Game.unlocked.village = savegame.village;


		constructMap(); //create map from save
		loadMap(); //fill map with green
		unlockTest(); //unlocks storyline components
		buffCheck(); //checks for accessory buffs
		updateBought(); //loads your saved recipies
	}
	else { //makes a new map for first time users!
		genNewMap();
		constructMap();
	}

	update(); //final update of new values
}

function delGame() {
	var end = confirm("Are you sure you want to reset the game? This will delete your save.");
	if (end == true) {
		localStorage.removeItem("save");
		localStorage.removeItem("main");
		location.reload();
	}
	else {
		//keep playing
	}
}

function softreset() {
	alert("You black out. Awakening, you find your supplies have been lost.");
	localStorage.removeItem("save");
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

	var number = getRandom(0, Game.core.unlocked);
	var ore = drops.main[number].name;
	var info = drops.main[number].info;
	var weight = drops.main[number].weight;

	if (mine[point].ore == "") {
		mine.splice(point, 1, {
			ore: ore,
			info: info,
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

function newDrop(index) {
	for (var i = 0; i < 9; i++) {
		if (mine[i].ore == "") {
			var ore = drops.world[index].name;
			var info = drops.world[index].info;
			var weight = drops.world[index].weight;

			mine.splice(i, 1, {
				ore: ore,
				info: info,
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
	else {
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
		Game.core.unlocked = 2;
	}
	if (Game.player.plantlvl == 1) {
		Game.core.unlocked = 4;

	}
	if (Game.player.plantlvl >= 2) {
		Game.core.unlocked = 11;
	}
}

function buttonChecker() {
	$('.actionbtn').hide();

	itemCheck = {
		//forage items
			darkberries: 0,
			redberries: 0,
			blueberries: 0,
			twigs: 0,
			leaves: 0,
			treesap: 0,
			marigold: 0,
			milkcap: 0,
			cornflower: 0,
			opiumpoppy: 0,
			sharprock: 0,
			treebark: 0,
			water: 0,

		//crafted
			coffeebrew: 0,
			roastedshroom: 0,
			ointment: 0,
			opium: 0,

		//crafted
			deerskin: 0,
			beartooth: 0,
			greenberries: 0,
			rabbitmeat: 0,
			leather: 0,
			spear: 0,
			cookedrabbit: 0,

		//potions
			vitalitypotion: 0,
			quenchpotion: 0,
			zealpotion: 0,
	}

	//init stacker
	$('.box').removeClass("stacked");

	for (var i = 0; i < items.length; i++) {
		//foraged items
		var name = items[i].name;
		var id = name.split(' ').join('');
		itemInc(name, id, i);
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

	if (itemCheck.darkberries >= 1) { //dark berries
		$('#use').append('<button id="eatDarkBerries" onclick="eatDarkBerries()">Eat dark berries.</button>');
	}

	if (itemCheck.redberries >= 1) { //red berries
		$('#use').append('<button id="eatRedBerries" onclick="eatRedBerries()">Eat red berries.</button>');
	}

	if (itemCheck.blueberries >= 1) { //blue berries
		$('#use').append('<button id="eatBlueBerries" onclick="eatBlueBerries()">Eat blue berries.</button>');
	}

	if (itemCheck.greenberries >= 1) { //green berries
		$('#use').append('<button id="eatGreenBerries" onclick="eatGreenBerries()">Eat green berries.</button>');
	}

	if (itemCheck.milkcap >= 1) { //eat milkcap
		$('#use').append('<button id="eatMilkcap" onclick="eatMilkcap()">Eat milkcap.</button>');
	}

	if (itemCheck.opiumpoppy >= 1 && itemCheck.sharprock >= 1 && Game.player.craftlvl >= 1) { //(craft level 2 is required to do this)
		$('#craft').append('<button id="extractOpium" onclick="extractOpium()">Extract opium.</button>');
	}

	if (itemCheck.roastedshroom >= 1) { //eat roast shroom
		$('#use').append('<button id="eatRoastMilkcap" onclick="eatRoastMilkcap()">Eat roasted shroom.</button>');
	}

	if (itemCheck.treesap >= 1 && itemCheck.marigold >= 1) { //make ointment
		$('#craft').append('<button id="makeOintment" onclick="makeOintment()">Make ointment.</button>');
	}

	if (itemCheck.ointment >= 1) { //use ointment
		$('#use').append('<button id="useOintment" onclick="useOintment()">Use ointment.</button>');
	}

	if (itemCheck.coffeebrew >= 1) { //drink coffee brew
		$('#use').append('<button id="drinkCoffeeBrew" onclick="drinkCoffeeBrew()">Drink coffee brew.</button>');
	}

	if (itemCheck.water >= 1) { //drink water
		$('#use').append('<button id="drinkWater" onclick="drinkWater()">Drink water.</button>');
	}

	if (itemCheck.cookedrabbit >= 1) { //eat cooked rabbit
		$('#use').append('<button id="eatCookedRabbit" onclick="eatCookedRabbit()">Eat cooked rabbit.</button>');
	}

	if (itemCheck.rabbitmeat >= 1) { //eat RAW rabbit
		$('#use').append('<button id="eatRawRabbit" onclick="eatRawRabbit()">Eat raw rabbit meat.</button>');
	}

	if (itemCheck.vitalitypotion >= 1) {
		$('#use').append('<button id="vitalityPotion" onclick="vitalityPotion()">Drink vitality potion.</button>');
	}

	if (itemCheck.quenchpotion >= 1) {
		$('#use').append('<button id="quenchPotion" onclick="quenchPotion()">Drink quench potion.</button>');
	}

	if (itemCheck.zealpotion >= 1) {
		$('#use').append('<button id="zealPotion" onclick="zealPotion()">Drink zeal potion.</button>');
	}

	//craft resources

	if (itemCheck.leaves >= 1 && itemCheck.twigs >= 1 && haveFlask != true) { //crafing flask
		$('#craft').append('<button id="craftFlask" onclick="craftFlask()">Craft flask.</button>');
	}

	if (itemCheck.twigs >= 1 && itemCheck.treebark >= 1 && haveFirepit != true) { //crafing firepit
		$('#craft').append('<button id="craftFirepit" onclick="craftFirepit()">Make firepit.</button>');
	}

	if (itemCheck.leaves >= 1 && itemCheck.treebark >= 1) { //crafing pouch
		$('#craft').append('<button id="craftPouch" onclick="craftPouch()">Craft pouch.</button>');
	}

	if (itemCheck.leather >= 1 && itemCheck.treesap >= 1 && Game.player.craftlvl >= 1) { //crafting small bag (craft lvl 2)
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

	if (itemCheck.beartooth >= 1 && itemCheck.twigs >= 1 && Game.player.craftlvl >= 1) { //craft spear (craft lvl 2)
		$('#craft').append('<button id="craftSpear" onclick="craftSpear()">Craft spear.</button>');
	}

	if (haveFirepit == true && itemCheck.rabbitmeat >= 1) { //cook rabbit
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
	else if (itemCheck.sharprock >= 1) {
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

function eatRawRabbit() {
	$('#log').prepend("<li class='red'>You bite into the raw meat. It does not taste good.</li>");
	removeItem("rabbit meat");

	Game.player.health += 5;
	Game.player.energy -= 20;
	updateValues();
}

function vitalityPotion() {
	$('#log').prepend("<li>You drink the vitality potion, feeling stronger with each glug.</li>");
	removeItem("vitality potion");

	Game.player.health += 50;
	updateValues();
}

function quenchPotion() {
	$('#log').prepend("<li>You drink the quench potion, feeling fuller with each glug;.</li>");
	removeItem("quench potion");

	Game.player.thirst += 50;
	updateValues();
}

function zealPotion() {
	$('#log').prepend("<li>You drink the zeal potion, feeling fitter with each glug.</li>");
	removeItem("zeal potion");

	Game.player.energy += 50;
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
	removeItem("rabbit meat");

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
		softreset();
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
	$("#base div:contains('small bag')").css({
		"background-image" : "url(images/small_bag.png)"
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

	$("#items div:contains('deerskin'), #mine li:contains('deerskin')").css({
		"background-image" : "url(images/deerskin.png)"
	});
	$("#items div:contains('rabbit meat'), #mine li:contains('rabbit meat')").css({
		"background-image" : "url(images/rabbit_meat.png)"
	});
	$("#items div:contains('leather'), #mine li:contains('leather')").css({
		"background-image" : "url(images/leather.png)"
	});
	$("#items div:contains('spear'), #mine li:contains('spear')").css({
		"background-image" : "url(images/spear.png)"
	});
	$("#items div:contains('bear tooth'), #mine li:contains('bear tooth')").css({
		"background-image" : "url(images/bear_tooth.png)"
	});
	$("#items div:contains('cooked rabbit'), #mine li:contains('cooked rabbit')").css({
		"background-image" : "url(images/cooked_rabbit.png)"
	});
	$("#items div:contains('green berries'), #mine li:contains('green berries')").css({
		"background-image" : "url(images/green_berries.png)"
	});

	$("#items div:contains('vitality potion'), #mine li:contains('vitality potion')").css({
		"background-image" : "url(images/potion_red.png)"
	});
	$("#items div:contains('quench potion'), #mine li:contains('quench potion')").css({
		"background-image" : "url(images/potion_blue.png)"
	});
	$("#items div:contains('zeal potion'), #mine li:contains('zeal potion')").css({
		"background-image" : "url(images/potion_yellow.png)"
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
	$('#zone').html(Game.world.zone);

	//enemy
	$('#enemyHealth').html(prettify(Game.enemy.health));

	var enemyHealthBar = document.getElementById("enemyHealthBar");
	var hp = (Game.enemy.health / Game.enemy.totalhealth) * 100;
	enemyHealthBar.style.width = hp + '%';

	if (Game.enemy.health >= Game.enemy.totalhealth) {
		Game.enemy.health = Game.enemy.totalhealth;
	}

	if (Game.enemy.health <= 0) {
		enemyHealthBar.style.width = '0%';
		endFight();
	}

	//journey (walkquest)
	$('#journeyHealth').html(prettify(Game.journey.health));

	var journeyBar = document.getElementById("journeyBar");
	var hp = (Game.journey.health / Game.journey.totalhealth) * 100;
	journeyBar.style.width = hp + '%';

	if (Game.journey.health >= Game.journey.totalhealth) {
		Game.journey.health = Game.journey.totalhealth;
	}

	if (Game.journey.health <= 0) {
		journeyBar.style.width = '0%';
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
	explore(Game.world.clickdmg);

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
	if (itemCheck.redberries >= 1) {
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
				newDrop(0);
				$('#log').prepend("<li class='green'>You strip the deer of its hide.</li>");
			}
			if (Game.enemy.name == 'racoon') {
				newDrop(1);
				$('#log').prepend("<li class='green'>The racoon holds some green berries in its tiny paws.</li>");
			}
			if (Game.enemy.name == 'rabbit') {
				newDrop(2);
				$('#log').prepend("<li class='green'>You skin the rabbit and take it's meat.</li>");
			}
			if (Game.enemy.name == 'bear') {
				newDrop(3);
				$('#log').prepend("<li class='green'>You take a tooth from the mighty bear as a prize.</li>");
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
				"<button onclick='collect(10)'>Collect 10 gold.</button>"
			);

			showModal();
			$('#questEvent').show();
		}
		else if (Game.enemy.reward == 'theif') {
			$('.questInfo').html(
				"Defeated, the theif surrenders her own wealth. You gain 2 gold pieces."
			);

			$('.questButton').html(
				"<button onclick='collect(2)'>Collect 2 gold.</button>"
			);

			showModal();
			$('#questEvent').show();
		}
		else if (Game.enemy.reward == 'wizard') {
			$('.questInfo').html(
				"The wizard laughs maniacally and vanishes in a puff of smoke. He leaves behind 3 gold pieces."
			);

			$('.questButton').html(
				"<button onclick='collect(3)'>Collect 3 gold.</button>"
			);

			showModal();
			$('#questEvent').show();
		}
		else if (Game.enemy.reward == 'house') {
			$('.questInfo').html(
				"The house is delapidated, but you find a small bag of gold coins hidden away in a cupboard."
			);

			$('.questButton').html(
				"<button onclick='collect(10)'>Collect 10 gold.</button>"
			);

			showModal();
			$('#questEvent').show();
		}
		else if (Game.enemy.reward == 'boy') {
			$('.questInfo').html(
				"An old man greets you, hastily taking the package from your arms. He rummages around his cloak and brings out 6 gold pieces for you."
			);

			$('.questButton').html(
				"<button onclick='collect(6)'>Collect 6 gold.</button>"
			);

			showModal();
			$('#questEvent').show();
		}
		else if (Game.enemy.reward == 'camp') {
			$('.questInfo').html(
				"The camp is abandoned, the previous owners leaving only a tiny silver locket half-buried in the ground. It'd be worth a bit of money."
			);

			$('.questButton').html(
				"<button onclick='collect(3)'>Collect 3 gold.</button>"
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
	if (Game.enemy.type == 'beast') {
		hideModal();
	}

	Game.enemy.health = 1;
	Game.journey.health = 1;
	Game.enemy.type = "";
}

function leaveForest() { //unused
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
		if (Math.random() * 100 <= 50) {
			map.push(Icons["tree"]);
			console.log("tree");
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

	for (var i = 0; i < Zones.zone1.length; i++) {
		if (Game.world.zone == 1) {
			if (Zones.zone1[i] != undefined) {
				map.splice(i, 1, Zones.zone1[i]);
				console.log("zone1");
			}
		}
	}
}

function constructMap() {
	Game.world.complete = 1;
	$('#complete').html(Game.world.complete);

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
	var clicks = Game.world.distance - (Game.world.zone - 1) * 50;
	var updated = clicks * 2;

	for (var i = 0; i < updated; i++) {
		fill(Game.world.clickdmg);
	}
}

function fill(value) {
	for (var i = Game.world.complete - 1; i < Game.world.complete; i++) {
		if (used[i] != undefined) {
			if (used[i].width <= 99) {
				used[i].width += value;
				$("#map .tile:eq(" + i + ") .fillbar").css({
					"width" : used[i].width + "%"
				});

				if (used[i].width >= 100) {
					//do NOT go to the next zone, Lol
					//BTW:
					//fill() is exactly the same as explore(), except it doesn't proc nextZone()
				}
			}
			else {
				Game.world.complete++;
				$('#complete').html(Game.world.complete);
			}
		}
	}
}

function explore(value) {
	for (var i = Game.world.complete - 1; i < Game.world.complete; i++) {
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
				Game.world.complete++;
				$('#complete').html(Game.world.complete);
			}
		}
	}
}


function nextZone() {
	if (Game.world.complete == 25) {
		Game.world.zone += 1;
		$('#zone').html(Game.world.zone);

		map = [];
		genNewMap();
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
		if (person.length <= 20) {
			Game.player.name = person;
		}
		else {
			alert("That name is too long.");
		}
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
	});
}











function eventChecker() {
	switch ($('#map .tile').eq(Game.world.complete - 1).text()) {
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
	var position = (Game.world.distance - ((Game.world.zone - 1) * 50)) / 2;

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
	var whichQuest = getRandom(1, 2);
	if (whichQuest == 1) {
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
	else if (whichQuest == 2) {
		var array = [
			"In the distance is a small house. It looks abandoned.",
			"A young boy approaches you, asking if you could deliver a small package for him. He says there will be a reward.",
			"Smoke billows out from behind a hillock a short distance away. Could be some sort of camp."
		];

		var walkArray = [
			"house",
			"boy",
			"camp"
		];
		var number = Math.floor(Math.random() * array.length);

		$('.questInfo').html(array[number]);
		$('.questButton').html(
			"<button onclick='walkQuest(`" + walkArray[number] + "`, `" + array[number] + "`)'>Begin quest.</button>"
		);

		showModal();
		$('#questEvent').show();
	}
	/*else if (whichQuest == 3) {
		//there are only two types of quests rn
	}*/
}

function walkQuest(type, desc) {
		switch (type) {
			case 'house':
				Game.journey.totalhealth = 100;
				break;
			case 'boy':
				Game.journey.totalhealth = 60;
				break;
			case 'camp':
				Game.journey.totalhealth = 30;
				break;
		}
		Game.journey.health = Game.journey.totalhealth;

		$('#log').prepend("<li>You begin a journey quest.</li>");
		$('#j_desc').html(desc);

		//change enemy type
		Game.enemy.type = 'quest';
		Game.enemy.reward = type;

		worldUpdate();

		//show the modal
		showModal();
		$('#walk').show();
}

function walkAction() {
		Game.journey.health -= Game.journey.damage;
		worldUpdate();

		Game.player.thirst -= Game.world.walkcost.water;
		Game.player.energy -= Game.world.walkcost.energy;
		updateValues();

		if (Math.random() * 100 <= 50) {
			$('#log').prepend("<li>You keep walking towards your destination.</li>");
		}
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

	updateBought(); //added this because bought items weren't updating
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
	if (Game.recipie.notbought.length > 0 && Game.world.money >= Game.recipie.cost) {
		Game.world.money -= Game.recipie.cost; //minus cost
		$('.money').html(Game.world.money); //updates money

		var number = Game.recipie.notbought[Math.floor(Math.random() * Game.recipie.notbought.length)]; //gets random number from notbought
		var index = Game.recipie.notbought.indexOf(number); //finds index of this number
		Game.recipie.notbought.splice(index, 1); //removes this number

		Game.recipie.bought.push(number); //adds the number to the bought array
	}
	updateBought(); //calls the update function
}

function updateBought() {
	$('.recipieTable tr').hide(); //hides all recipies
	for (var i = 0; i < Game.recipie.bought.length; i++) {
		$('.recipieTable tr').eq(Game.recipie.bought[i]).show(); //shows recipies that have been bought
	}
	$('.r_bought').html(Game.recipie.bought.length); //updates number of bought recipies
	$('.r_total').html(Game.recipie.total); //updates total number of recipies
}

function getRandom(bottom, top) {
	return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
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


function buyPotion(type, cost) {
	if (cost <= Game.world.money) {
		Game.world.money -= cost;
		switch (type) {
			case 'health':
				newDrop(4);
				break;
			case 'thirst':
				newDrop(5);
				break;
			case 'energy':
				newDrop(6);
				break;
		}
	}
	else {
		alert("You cannot buy this. It costs " + cost + " gold and you have " + Game.world.money + " gold.");
	}
}