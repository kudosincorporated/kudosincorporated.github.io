

function colorise() {
	window.$(document).ready(function(){
		$("li:contains(Broken), li:contains(Weak), li:contains(Dull), li:contains(Shoddy), li:contains(Awkward)")
		.css({
			"color" : "gray",
			"fontWeight" : "normal"
		});
	});

	window.$(document).ready(function(){
		$("li:contains(Large), li:contains(Dangerous), li:contains(Savage), li:contains(Sharp), li:contains(Tiny), li:contains(Bulky), li:contains(Heavy), li:contains(Light), li:contains(Rapid), li:contains(Hasty), li:contains(Intimidating), li:contains(Powerful), li:contains(Strong), li:contains(Intense), li:contains(Furious), li:contains(Quick)")
		.css({
			"color" : "limegreen"
		});
	});

	window.$(document).ready(function(){
		$("li:contains(Keen), li:contains(Superior), li:contains(Forceful), li:contains(Deadly), li:contains(Agile), li:contains(Nimble), li:contains(Adept)")
		.css({
			"color" : "turquoise"
		});
	});

	window.$(document).ready(function(){
		$("li:contains(Murderous), li:contains(Manic), li:contains(Sighted), li:contains(Unpleasant), li:contains(Mystic), li:contains(Ruthless)")
		.css({
			"color" : "dodgerblue"
		});
	});

	window.$(document).ready(function(){
		$("li:contains(Arcane), li:contains(Frenzying), li:contains(Masterful), li:contains(Demonic), li:contains(Unreal)")
		.css({
			"color" : "coral"
		});
	});

	window.$(document).ready(function(){
		$("li:contains(Legendary), li:contains(Celestial), li:contains(Mythical)")
		.css({
			"color" : "orchid",
			"fontStyle" : "italic"
		});
	});

	window.$(document).ready(function(){
		$("li:contains(Godly)")
		.css({
			"color" : "gold",
			"fontWeight" : "bold",
			"textDecoration" : "underline"
		});
	});
}

	function dispClicker() {
		document.getElementById("clicker").style.display = "block";
		document.getElementById("inventory").style.display = "none";
		document.getElementById("tabClicker").style.fontWeight = "bold";
		document.getElementById("tabInventory").style.fontWeight = "normal";
	}

	function dispInventory() {
		document.getElementById("clicker").style.display = "none";
		document.getElementById("inventory").style.display = "block";
		document.getElementById("tabClicker").style.fontWeight = "normal";
		document.getElementById("tabInventory").style.fontWeight = "bold";
	}

	var clicks = 0;
	var coins = 0;
	var shops = 0;
	var shopCost = 15;
	var knights = 0;
	var knightCost = 100;

	function add() {
		clicks++;
		document.getElementById("inc").innerHTML = clicks;
	}

	function randCoin() {
		if (Math.random() * 100 <= 10) {
		var coinArray = [1, 2, 3, 4, 5];
		var coinCount = coinArray[Math.floor(Math.random() * coinArray.length)];
			coins = coins + coinCount;
			document.getElementById("coins").innerHTML = coins;
			var ul = document.getElementById("log");
			var li = document.createElement("li");
			li.appendChild(document.createTextNode("You gain "));
			li.appendChild(document.createTextNode(coinCount));
			li.appendChild(document.createTextNode(" coins."));
			li.style.color = "orangered";
			ul.appendChild(li);
		}
	}

	function buyShop() {
		if (clicks >= shopCost) {
			shops++;
			clicks = clicks - shopCost;
			shopCost = Math.floor(15 * Math.pow(1.05,shops));
			document.getElementById("inc").innerHTML = clicks;
			document.getElementById("shops").innerHTML = shops;
			document.getElementById("shopCost").innerHTML = shopCost;
		}
	}

	function shop() {
		if (shops >= 1) {
			clicks = clicks + shops;
			document.getElementById("inc").innerHTML = clicks;
		}
	}

	window.setInterval(function(){
		shop();
	}, 10000);
	
	function buyKnight() {
		if (clicks >= knightCost) {
			knights++;
			clicks = clicks - knightCost;
			knightCost = Math.floor(100 * Math.pow(1.05,knights));
			document.getElementById("inc").innerHTML = clicks;
			document.getElementById("knights").innerHTML = knights;
			document.getElementById("knightCost").innerHTML = knightCost;
		}
	}

	function knight() {
		if (knights >= 1) {
			clicks = clicks + knights;
			document.getElementById("inc").innerHTML = clicks;
		}
	}

	window.setInterval(function(){
		knight();
	}, 2000);

	function walk() {
	var rand = Math.floor(Math.random() * 100);
	if (rand <= 5) {
		genItem();
	}
	else {
		var ul = document.getElementById("log");
		var li = document.createElement("li");
		var myArray = ["You wander a bit further.", "You move to the next room.", "The fight is over.", "Your hands are bloodstained.", "The next door beckons.", "You fight with vigour.", "Your armour is battle-worn.", "You fight endlessly.", "You smell battle.", "You walk down a hallway.", "The door slams behind you.", "You smell treasure.", "All is quiet, finally."];
		var char1 = myArray[Math.floor(Math.random() * myArray.length)];
		li.appendChild(document.createTextNode(char1));
		ul.appendChild(li);
	}
	}

	function clearLog() {
	var ul = document.getElementById("log");
	var li = document.createElement("li");
	ul.innerHTML = "";
	li.appendChild(document.createTextNode("Log cleared."));
	ul.appendChild(li);
	}

	function seeBarracks() {
		if (clicks >= 10 || shops >= 1) {
			document.getElementById("barracks").style.display = "block";
		}
	}

	window.setInterval(function(){
		seeBarracks();
	}, 10);

	function seeMarket() {
		if (coins >= 1) {
			document.getElementById("market").style.display = "block";
		}
	}

	window.setInterval(function(){
		seeMarket();
	}, 10);
	
	function seeKnights() {
		if (clicks >= 50 || shops >= 1) {
			document.getElementById("knightCover").style.display = "block";
		}
	}

	window.setInterval(function(){
		seeKnights();
	}, 10);

	function total(){
		var total = ((0.1 * shops) + (0.5 * knights)).toFixed(1);
		document.getElementById("total").innerHTML = total;
	};

	window.setInterval(function(){
		total();
	}, 10);

	//saving
	// loading

	window.onload = setTimeout( function() {
		setInterval( function() {
			save();
		}, 1000);
	}, 1000);

	function save() {
	var save = {
		clicks: clicks,
		coins: coins,
		shops: shops,
		shopCost: shopCost,
		knights: knights,
		knightCost: knightCost
		};
		localStorage.setItem("save",JSON.stringify(save));

			//the list

		var items = document.querySelectorAll("#list li");
		var array = Array.prototype.map.call(items, function(item) {
			return item.textContent;
		});
		localStorage.setItem("list", JSON.stringify(array));
	}

	function load() {
		var savegame = JSON.parse(localStorage.getItem("save"));

		if (typeof savegame.clicks !== "undefined") clicks = savegame.clicks;
		if (typeof savegame.coins !== "undefined") coins = savegame.coins;
		if (typeof savegame.shops !== "undefined") shops = savegame.shops;
		if (typeof savegame.shopCost !== "undefined") shopCost = savegame.shopCost;
		if (typeof savegame.knights !== "undefined") knights = savegame.knights;
		if (typeof savegame.knightCost !== "undefined") knightCost = savegame.knightCost;

		document.getElementById("inc").innerHTML = clicks;
		document.getElementById("coins").innerHTML = coins;
		document.getElementById("shops").innerHTML = shops;
		document.getElementById("shopCost").innerHTML = shopCost;
		document.getElementById("knights").innerHTML = knights;
		document.getElementById("knightCost").innerHTML = knightCost;

		//the list

		var saved = JSON.parse(localStorage.getItem("list")) || [];
		saved.forEach(addLi);
	}

	function addLi(text) {
		var ul = document.getElementById("list");
		var li = document.createElement("li");
		li.appendChild(document.createTextNode(text));
		ul.appendChild(li);
	}

	function del() {
		localStorage.removeItem("save");
		location.reload();
	}

	//items
	
	function genItem() {
		var ulList = document.getElementById("list");
		var liList = document.createElement("li");
	
		var adjArray = [
"Broken",
"Weak",
"Dull",
"Shoddy",
"Awkward",

"Large",
"Dangerous",
"Savage",
"Sharp",
"Tiny",
"Bulky",
"Heavy",
"Light",
"Rapid",
"Hasty",
"Intimidating",
"Powerful",
"Strong",
"Intense",
"Furious",
"Quick",

"Keen",
"Superior",
"Forceful",
"Deadly",
"Agile",
"Nimble",
"Murderous",
"Manic",
"Sighted",
"Unpleasant",
"Arcane",
"Adept",

"Mystic",
"Ruthless",
"Frenzying",
"Masterful",
"Demonic",
"Celestial",
"Legendary",
"Unreal",
"Mythical",

"Godly"
		];
		var adj = adjArray[Math.floor(Math.random() * adjArray.length)];
		
		var itemArray = [
"Bola",
"Boomerang",
"Bow",
"Crossbow",
"Longbow",
"Slingshot",
"Dagger",
"Tomahawk",

"Spear",
"Club",
"Halberd",
"Lance",
"Sabre",
"Sword",
"Longsword",
"Sheild",

"Spellbook",
"Runestone",
"Gemstone",
"Orbstone",
"Staff",
"Wand",
"Scepter",
"Robes"
		];
		var item = itemArray[Math.floor(Math.random() * itemArray.length)];

		liList.appendChild(document.createTextNode(adj + " " + item));

		if (
adj == "Broken" ||
adj == "Weak" ||
adj == "Dull" ||
adj == "Shoddy" ||
adj == "Awkward"
		) {
			liList.style.color = "gray";
			liList.style.fontWeight = "normal";
		}
		if (
adj == "Large" ||
adj == "Dangerous" ||
adj == "Savage" ||
adj == "Sharp" ||
adj == "Tiny" ||
adj == "Bulky" ||
adj == "Heavy" ||
adj == "Light" ||
adj == "Hurtful" ||
adj == "Rapid" ||
adj == "Hasty" ||
adj == "Intimidating" ||
adj == "Powerful" ||
adj == "Strong" ||
adj == "Intense" ||
adj == "Furious" ||
adj == "Quick"
		) {
			liList.style.color = "limegreen";
		}
		if (
adj == "Keen" ||
adj == "Superior" ||
adj == "Forceful" ||
adj == "Deadly" ||
adj == "Agile" ||
adj == "Nimble" ||
adj == "Adept"
		) {
			liList.style.color = "turquoise";
		}
		if (
adj == "Murderous" ||
adj == "Manic" ||
adj == "Sighted" ||
adj == "Unpleasant" ||
adj == "Arcane" ||
adj == "Mystic" ||
adj == "Ruthless"
		) {
			liList.style.color = "dodgerblue";
		}
		if (
adj == "Frenzying" ||
adj == "Masterful" ||
adj == "Demonic" ||
adj == "Unreal"
		) {
			liList.style.color = "coral";
		}
		if (
adj == "Legendary" ||
adj == "Celestial" ||
adj == "Mythical"
		) {
			liList.style.color = "orchid";
			liList.style.fontStyle = "italic";
		}
		if (
adj == "Godly"
		) {
			liList.style.color = "gold";
			liList.style.fontStyle = "italic";
			liList.style.textDecoration = "underline";
		}

			ulList.appendChild(liList);

			var ul = document.getElementById("log");
			var li = document.createElement("li");

			li.appendChild(document.createTextNode("You loot a "));
			li.appendChild(document.createTextNode(liList.innerHTML));
			li.appendChild(document.createTextNode("."));
			li.style.color = "orange";
			li.style.textShadow = "0px 0px 2px gold";

			ul.appendChild(li);
	}
