
/* ok bb. lets begin. */

/* FORAGER 3 PROTOTYPE by u/KudosInc. Uploaded 29/7/19 */
/* darkmode update 14/8/19 */

var Game = {
	mode: "darkmode",
	mine: ["", "", "", "", "", "", "", "", ""],
	inv: [],
	craftbox: [],
	output: [],
	craft_array: [],
	craft_possibles: [],
	weight: 0,
	base_weight: 20,
	total_weight: 20,
	currentTile: 'forest1',
	walkinc: 1,
	base_cart: 3500, //3500
	total_cart: 3500,
	base_explore: 2000, //2000
	total_explore: 2000,
	maxores: 3,
	log_repeat: 1,
	health: {
		current: 100,
		base: 100,
		max: 100
	},
	thirst: {
		current: 100,
		base: 100,
		max: 100
	},
	energy: {
		current: 100,
		base: 100,
		max: 100
	},
	base_damage: 1,
	total_damage: 1,
	base_defence: 0,
	total_defence: 0,
	forage_cost: 1,
	explore_cost: 1,
	enemy: {},
	exp:  {
		level: 0,
		current: 0,
		max: 100,
		herbology_inc: 10,
		craftsmanship_inc: 20,
		fortitude_inc: 1,
		explore_inc: 5
	}
}

var Interact = {
	eatBlueBerries: function() {
		log(Item.blue_berries.interact.use);
		removeItem("blue_berries", 1);

		Game.health.current += Item.blue_berries.interact.health;
		Game.thirst.current += Item.blue_berries.interact.thirst;
		Game.energy.current += Item.blue_berries.interact.energy;
		updateStats();
	},
	eatDarkBerries: function() {
		log(Item.dark_berries.interact.use, "red");
		removeItem("dark_berries", 1);

		Game.health.current += Item.dark_berries.interact.health;
		Game.thirst.current += Item.dark_berries.interact.thirst;
		updateStats();
	},
	eatRedBerries: function() {
		log(Item.red_berries.interact.use, "red");
		removeItem("red_berries", 1);

		Game.thirst.current += Item.red_berries.interact.thirst;
		Game.energy.current += Item.red_berries.interact.energy;
		updateStats();
	},
	drinkCoffeeBrew: function() {
		log(Item.coffee_brew.interact.use);
		removeItem("coffee_brew", 1);

		Game.thirst.current += Item.coffee_brew.interact.thirst;
		Game.energy.current += Item.coffee_brew.interact.energy;
		updateStats();
	},
	eatRoastedMilkcap: function() {
		log(Item.roasted_milkcap.interact.use);
		removeItem("roasted_milkcap", 1);

		Game.health.current += Item.roasted_milkcap.interact.health;
		Game.energy.current += Item.roasted_milkcap.interact.energy;
		updateStats();
	},
	eatGreenBerries: function() {
		log(Item.green_berries.interact.use);
		removeItem("green_berries", 1);

		Game.health.current += Item.green_berries.interact.health;
		Game.thirst.current += Item.green_berries.interact.thirst;
		Game.energy.current += Item.green_berries.interact.energy;
		updateStats();
	},
	eatCookedRabbit: function() {
		log(Item.cooked_rabbit.interact.use);
		removeItem("cooked_rabbit", 1);

		Game.health.current += Item.cooked_rabbit.interact.health;
		Game.energy.current += Item.cooked_rabbit.interact.energy;
		updateStats();
	},
	useOintment: function() {
		log(Item.ointment.interact.use);
		removeItem("ointment", 1);

		Game.health.current += Item.ointment.interact.health;
		updateStats();
	},
	drinkPearSoup: function() {
		log(Item.pear_soup.interact.use);
		removeItem("pear_soup", 1);

		Game.thirst.current += Item.pear_soup.interact.thirst;
		updateStats();
	},
	eatOpium: function() {
		log(Item.opium.interact.use, "red");
		removeItem("opium", 1);

		Game.health.current += Item.opium.interact.health;
		Game.thirst.current += Item.opium.interact.thirst;
		Game.energy.current += Item.opium.interact.energy;
		updateStats();
	},
	eatOrangeBerries: function() {
		log(Item.orange_berries.interact.use);
		removeItem("orange_berries", 1);

		var int = randInt(0,2);
		if (int == 0) {
			Game.health.current += Item.orange_berries.interact.health;
		}
		else if (int == 1) {
			Game.thirst.current += Item.orange_berries.interact.thirst;
		}
		else if (int == 2) {
			Game.energy.current += Item.orange_berries.interact.energy;
		}

		updateStats();
	},
	drinkMoss_soup: function() {
		log(Item.moss_soup.interact.use);
		removeItem("moss_soup", 1);

		Game.energy.current += Item.moss_soup.interact.energy;
		updateStats();
	},
	drinkTriple_tea: function() {
		log(Item.triple_tea.interact.use);
		removeItem("triple_tea", 1);

		Game.health.current += Item.triple_tea.interact.health;
		Game.thirst.current += Item.triple_tea.interact.thirst;
		Game.energy.current += Item.triple_tea.interact.energy;
		updateStats();
	},
	eatSteak: function() {
		log(Item.steak.interact.use);
		removeItem("steak", 1);

		Game.health.current += Item.steak.interact.health;
		Game.energy.current += Item.steak.interact.energy;
		updateStats();
	},
	eatLightBerries: function() {
		log(Item.light_berries.interact.use);
		removeItem("light_berries", 1);
	},
	eatCooked_hare: function() {
		log(Item.cooked_hare.interact.use);
		removeItem("cooked_hare", 1);

		Game.health.current += Item.cooked_hare.interact.health;
		Game.energy.current += Item.cooked_hare.interact.energy;
		updateStats();
	},
	eatBread: function() {
		log(Item.bread.interact.use);
		removeItem("bread", 1);

		Game.health.current += Item.bread.interact.health;
		updateStats();
	},
	drinkClearWater: function() {
		log(Item.clear_water.interact.use);
		removeItem("clear_water", 1);

		Game.thirst.current += Item.clear_water.interact.thirst;
		updateStats();
	},
	useHay: function() {
		log(Item.hay.interact.use);
		removeItem("hay", 1);

		Game.energy.current += Item.hay.interact.energy;
		updateStats();
	},
	eatPurpleBerries: function() {
		log(Item.purple_berries.interact.use);
		removeItem("purple_berries", 1);

		Game.health.current += Item.purple_berries.interact.health;
		Game.thirst.current += Item.purple_berries.interact.thirst;
		Game.energy.current += Item.purple_berries.interact.energy;
		updateStats();
	}
}

var Item = {
	blue_berries: {
		id: 'blue_berries',
		name: 'blue berries',
		desc: 'they look... bland.<br><button class="btn btn-i" onclick="Interact.eatBlueBerries();">Eat</button>',
		weight: 1,
		found: false,
		interact: {
			use: "The berries are slightly sour, but tasty.",
			health: 5,
			thirst: 3,
			energy: 2
		},
		class: "food"
	},
	dark_berries: {
		id: 'dark_berries',
		name: 'dark berries',
		desc: 'they look... menacing.<br><button class="btn btn-i" onclick="Interact.eatDarkBerries();">Eat</button>',
		weight: 1,
		found: false,
		interact: {
			use: "The dark berries cause you to convulse and hallucinate. Don't eat scary berries!",
			health: -10,
			thirst: -5
		},
		class: "food"
	},
	red_berries: {
		id: 'red_berries',
		name: 'red berries',
		desc: 'they look... tasty.<br><button class="btn btn-i" onclick="Interact.eatRedBerries();">Eat</button>',
		weight: 1,
		found: false,
		interact: {
			use: "The red berries parch your throat and weaken you.",
			thirst: -10,
			energy: -5
		},
		class: "food"
	},
	leaves: {
		id: 'leaves',
		name: 'leaves',
		desc: 'thick, green leaves from an unknown tree.',
		weight: 4,
		found: false,
		class: "craftable"
	},
	twigs: {
		id: 'twigs',
		name: 'twigs',
		desc: 'a small bundle of sticks.',
		weight: 3,
		found: false,
		class: "craftable"
	},
	tree_bark: {
		id: 'tree_bark',
		name: 'tree bark',
		desc: 'a strong piece of bark.',
		weight: 3,
		found: false,
		class: "craftable"
	},
	flask: {
		id: 'flask',
		name: 'flask',
		desc: 'a small flask, filled with water.',
		weight: 0,
		found: false,
		class: "craftable"
	},
	firepit: {
		id: 'firepit',
		name: 'firepit',
		desc: 'warms the hands, cooks the meat.',
		weight: 0,
		found: false,
		class: "craftable"
	},
	pouch: {
		id: 'pouch',
		name: 'pouch',
		desc: 'more space to carry things.<br><span class="extra core-bg">Adds +20 carry space.</span>',
		weight: 0,
		found: false,
		interact: {
			weight: 20
		},
		class: "core"
	},
	cornflower: {
		id: "cornflower",
		name: "cornflower",
		desc: "an ancient remedy for tired eyes when mixed with water.",
		weight: 2,
		found: false,
		class: "craftable"
	},
	milkcap: {
		id: "milkcap",
		name: "milkcap",
		desc: "tasty if prepared in a firepit.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	sharp_rock: {
		id: "sharp_rock",
		name: "sharp rock",
		desc: "it's sharp enough to be used as a weapon.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	coffee_brew: {
		id: "coffee_brew",
		name: "coffee brew",
		desc: "sure to replenish energy.<br><button class='btn btn-i' onclick='Interact.drinkCoffeeBrew();'>Drink</button>",
		weight: 2,
		found: false,
		interact: {
			use: "The coffee brew works instantly, replenishing your energy levels.",
			thirst: 10,
			energy: 20
		},
		class: "food"
	},
	roasted_milkcap: {
		id: "roasted_milkcap",
		name: "roasted milkcap",
		desc: "much healthier.<br><button class='btn btn-i' onclick='Interact.eatRoastedMilkcap();'>Eat</button>",
		weight: 1,
		found: false,
		interact: {
			use: "The roasted shroom tastes much better than it's raw counterpart.",
			health: 20,
			energy: 5
		},
		class: "food"
	},
	rabbit_meat: {
		id: "rabbit_meat",
		name: "rabbit meat",
		desc: "the raw meat of a fallen rabbit.",
		weight: 2,
		found: false,
		class: "craftable"
	},
	green_berries: {
		id: "green_berries",
		name: "green berries",
		desc: "a racoon's favorite treat.<br><button class='btn btn-i' onclick='Interact.eatGreenBerries();'>Eat</button>",
		weight: 1,
		found: false,
		interact: {
			use: "They taste like stealing from a little racoon. Pretty good.",
			health: 6,
			thirst: 5,
			energy: 4
		},
		class: "food"
	},
	cooked_rabbit: {
		id: "cooked_rabbit",
		name: "cooked rabbit",
		desc: "the cooked rabbit smells much better.<br><button class='btn btn-i' onclick='Interact.eatCookedRabbit();'>Eat</button>",
		weight: 2,
		found: false,
		interact: {
			use: "The cooked rabbit is the best food you've had in a long time.",
			health: 30,
			energy: 5
		},
		class: "food"
	},
	marigold: {
		id: "marigold",
		name: "marigold",
		desc: "helpful for treating wounds used to make ointment.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	tree_sap: {
		id: "tree_sap",
		name: "tree sap",
		desc: "a slightly sweet, sticky substance.",
		weight: 2,
		found: false,
		class: "craftable"
	},
	branch: {
		id: "branch",
		name: "branch",
		desc: "long and sturdy; like a better stick.",
		weight: 3,
		found: false,
		class: "craftable"
	},
	ointment: {
		id: "ointment",
		name: "ointment",
		desc: "a smooth, oily substance for healing wounds.<br><button class='btn btn-i' onclick='Interact.useOintment();'>Use</button>",
		weight: 2,
		found: false,
		interact: {
			use: "The ointment heals your wounds incredibly well.",
			health: 40
		},
		class: "food"
	},
	spear: {
		id: "spear",
		name: "spear",
		desc: "finally, you can poke something from a distance.<br><span class='extra core-bg'>Adds +1 damage.</span>",
		weight: 0,
		found: false,
		interact: {
			damage: 1
		},
		class: "core"
	},
	deerskin: {
		id: "deerskin",
		name: "deerskin",
		desc: "the raw hide of a deer.",
		weight: 2,
		found: false,
		class: "craftable"
	},
	bear_tooth: {
		id: "bear_tooth",
		name: "bear tooth",
		desc: "a large fang ripped from the mouth of a bear.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	leather: {
		id: "leather",
		name: "leather",
		desc: "a strong, versatile material.",
		weight: 2,
		found: false,
		class: "craftable"
	},
	leather_bag: {
		id: "leather_bag",
		name: "leather bag",
		desc: "a leather bag to carry more.<br><span class='extra core-bg'>Adds +20 carry space.</span>",
		weight: 0,
		found: false,
		interact: {
			weight: 20
		},
		class: "core"
	},
	dandelion: {
		id: "dandelion",
		name: "dandelion",
		desc: "the prettiest weed.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	prickly_pear: {
		id: "prickly_pear",
		name: "prickly pear",
		desc: "as juicy as it is prickly.",
		weight: 2,
		found: false,
		class: "craftable"
	},
	poppy: {
		id: "poppy",
		name: "poppy",
		desc: "looks pretty crushable.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	pear_soup: {
		id: "pear_soup",
		name: "pear soup",
		desc: "easily quenches your thirst for pear.<br><button class='btn btn-i' onclick='Interact.drinkPearSoup();'>Drink</button>",
		weight: 2,
		found: false,
		interact: {
			use: "The soup has a distinct taste of pear. Can't really taste the dandelion.",
			thirst: 30
		},
		class: "food"
	},
	opium: {
		id: "opium",
		name: "opium",
		desc: "nature's painkiller.<br><button class='btn btn-i' onclick='Interact.eatOpium();'>Eat</button>",
		weight: 1,
		found: false,
		interact: {
			use: "Eating raw opium is never a good idea.",
			health: -10,
			thirst: -10,
			energy: -10
		},
		class: "food"
	},
	dry_grass: {
		id: "dry_grass",
		name: "dry grass",
		desc: "dry, but can still be woven.",
		weight: 2,
		found: false,
		class: "craftable"
	},
	flint: {
		id: "flint",
		name: "flint",
		desc: "sharp and hard. perfect for whittling.",
		weight: 2,
		found: false,
		class: "craftable"
	},
	gold_shard: {
		id: "gold_shard",
		name: "gold shard",
		desc: "useful only aesthetically.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	bracelet: {
		id: "bracelet",
		name: "bracelet",
		desc: "wearing the bracelet makes you peculiarly hydrated.<br><span class='extra core-bg'>Adds +50 max hydration.</span>",
		weight: 0,
		found: false,
		interact: {
			thirst: 50
		},
		class: "core"
	},
	bone_sword: {
		id: "bone_sword",
		name: "bone sword",
		desc: "a fine sword carved from the bones of the desert.<br><span class='extra core-bg'>Adds +2 damage.</span>",
		weight: 0,
		found: false,
		interact: {
			damage: 2
		},
		class: "core"
	},
	snake_belt: {
		id: "snake_belt",
		name: "snake belt",
		desc: "this belt makes you feel like you could walk forever.<br><span class='extra core-bg'>Adds +50 max energy.</span>",
		weight: 0,
		found: false,
		interact: {
			energy: 50
		},
		class: "core"
	},
	shell: {
		id: "shell",
		name: "shell",
		desc: "hard shell of the armordillo.",
		weight: 3,
		found: false,
		class: "craftable"
	},
	boarskin: {
		id: "boarskin",
		name: "boarskin",
		desc: "hide of the ferocious boar.",
		weight: 3,
		found: false,
		class: "craftable"
	},
	boar_armour: {
		id: "boar_armour",
		name: "boar armour",
		desc: "sturdy armour made from the hide of a boar.<br><span class='extra core-bg'>Adds +2 defence.</span>",
		weight: 0,
		found: false,
		interact: {
			defence: 2
		},
		class: "core"
	},
	bones: {
		id: "bones",
		name: "bones",
		desc: "dried bones from an unidentifiable animal.",
		weight: 3,
		found: false,
		class: "craftable"
	},
	palm_leaf: {
		id: "palm_leaf",
		name: "palm leaf",
		desc: "looks good for writing on, weirdly enough.",
		weight: 2,
		found: false,
		class: "craftable"
	},
	orange_berries: {
		id: "orange_berries",
		name: "orange berries",
		desc: "much more orange than the other berries.<br><button class='btn btn-i' onclick='Interact.eatOrangeBerries();'>Eat</button>",
		weight: 1,
		found: false,
		interact: {
			use: "The orange berries taste warm... and random.",
			health: 15,
			thirst: 15,
			energy: 15
		},
		class: "food"
	},
	crude_map: {
		id: "crude_map",
		name: "crude map",
		desc: "you make an impressive cartographer.<br><span class='extra core-bg'>You can explore faster.</span>",
		weight: 0,
		found: false,
		interact: {
			explore: -500
		},
		class: "core"
	},
	snakeskin: {
		id: "snakeskin",
		name: "snakeskin",
		desc: "it's slippery and smooth.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	stinger: {
		id: "stinger",
		name: "stinger",
		desc: "the plump stinger of a deadly scorpion.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	pine_cone: {
		id: "pine_cone",
		name: "pine cone",
		desc: "basic pine cone. you've seen many.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	charcoal: {
		id: "charcoal",
		name: "charcoal",
		desc: "a chunk of the charred remains of a tree.",
		weight: 2,
		found: false,
		class: "craftable"
	},
	daylily: {
		id: "daylily",
		name: "daylily",
		desc: "the prettiest red flower you've ever seen.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	lucky_trinket: {
		id: "lucky_trinket",
		name: "lucky trinket",
		desc: "seems totally useless, but you know its lucky.<br><span class='extra core-bg'>You can forage faster.</span>",
		weight: 0,
		found: false,
		interact: {
			cart: -2000
		},
		class: "core"
	},
	cougarskin: {
		id: "cougarskin",
		name: "cougarskin",
		desc: "the furry skin stripped from a cougar.",
		weight: 3,
		found: false,
		class: "craftable"
	},
	lemming_tooth: {
		id: "lemming_tooth",
		name: "lemming tooth",
		desc: "it was already loose.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	cougar_pouch: {
		id: "cougar_pouch",
		name: "cougar pouch",
		desc: "the new and improved pouch. holds much more.<br><span class='extra core-bg'>Adds +20 carry space.</span>",
		weight: 0,
		found: false,
		interact: {
			weight: 20
		},
		class: "core"
	},
	power_horn: {
		id: "power_horn",
		name: "power horn",
		desc: "the sound of the yak's horn scares away most creatures.<br><span class='extra core-bg'>Decreases chance to encounter enemies.</span>",
		weight: 0,
		found: false,
		interact: {
			enc_chance: -0.1
		},
		class: "core"
	},
	amber: {
		id: "amber",
		name: "amber",
		desc: "theres a little mosquito inside of it.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	wood_moss: {
		id: "wood_moss",
		name: "wood moss",
		desc: "it's cool to the touch.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	purple_berries: {
		id: "purple_berries",
		name: "purple berries",
		desc: "they look... volatile.<br><button class='btn btn-i' onclick='Interact.eatPurpleBerries();'>Eat</button>",
		weight: 1,
		found: false,
		class: "food",
		interact: {
			use: "You feel weakened... but somehow stronger.",
			health: -10,
			thirst: 20,
			energy: 20
		}
	},
	amber_staff: {
		id: "amber_staff",
		name: "amber staff",
		desc: "the staff has an aura of strength and healing.<br><span class='extra core-bg'>Adds +50 max health.</span>",
		weight: 0,
		found: false,
		interact: {
			health: 50
		},
		class: "core"
	},
	moss_soup: {
		id: "moss_soup",
		name: "moss soup",
		desc: "why sleep when you can drink soup?<button class='btn btn-i' onclick='Interact.drinkMossSoup();'>Drink</button>",
		weight: 2,
		found: false,
		interact: {
			use: "The moss soup fills you with an extreme energy. Natures energy drink...?",
			energy: 40
		},
		class: "food"
	},
	wolfskin: {
		id: "wolfskin",
		name: "wolfskin",
		desc: "hide of the wolf. stronger and more dangerous.",
		weight: 3,
		found: false,
		class: "craftable"
	},
	yak_horn: {
		id: "yak_horn",
		name: "yak horn",
		desc: "horn of the yak... but it needs a tiny extra bit.",
		weight: 2,
		found: false,
		class: "craftable"
	},
	wolf_armour: {
		id: "wolf_armour",
		name: "wolf armour",
		desc: "strong and dangerous armour.<br><span class='extra core-bg'>Adds +3 defence.</span>",
		weight: 2,
		found: false,
		interact: {
			defence: 3
		},
		class: "core"
	},
	thistle: {
		id: "thistle",
		name: "thistle",
		desc: "prickly and purple.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	toadflax: {
		id: "toadflax",
		name: "toadflax",
		desc: "no relation to actual toads.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	roots: {
		id: "roots",
		name: "roots",
		desc: "they're really stretchy.",
		weight: 2,
		found: false,
		class: "craftable"
	},
	triple_tea: {
		id: "triple_tea",
		name: "triple tea",
		desc: "thitle and toadflax tea. tasty.<br><button class='btn btn-i' onclick='Interact.drinkTripleTea();'>Drink</button>",
		weight: 1,
		found: false,
		interact: {
			use: "The tasty tea replenishes all three!",
			health: 20,
			thirst: 20,
			energy: 20
		},
		class: "food"
	},
	slingshot: {
		id: "slingshot",
		name: "slingshot",
		desc: "attack foul beasts from a safe distance.<br><span class='extra core-bg'>Adds +4 damage.</span>",
		weight: 0,
		found: false,
		interact: {
			damage: 4
		},
		class: "core"
	},
	raw_meat: {
		id: "raw_meat",
		name: "raw meat",
		desc: "its raw, its meat. not much else is known.",
		weight: 4,
		found: false,
		class: "craftable"
	},
	fox_fur: {
		id: "fox_fur",
		name: "fox fur",
		desc: "a delicate and warm furry hide.",
		weight: 2,
		found: false,
		class: "craftable"
	},
	steak: {
		id: "steak",
		name: "steak",
		desc: "thick, juciy steak. it reeks of meat.<br><button class='btn btn-i' onclick='Interact.eatSteak();'>Eat</button>",
		weight: 3,
		found: false,
		interact: {
			use: "Nothing like a thick, juciy steak to assert your dominance over lesser creatures.",
			health: 50,
			energy: 15
		},
		class: "food"
	},
	hide_gloves: {
		id: "hide_gloves",
		name: "hide gloves",
		desc: "it's much easier to forage with these.<br><span class='extra core-bg'>Gather more items when you forage.</span>",
		weight: 0,
		found: false,
		interact: {
			maxores: 1
		},
		class: "core"
	},
	wooly_mullein: {
		id: "wooly_mullein",
		name: "wooly mullein",
		desc: "looks flammable.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	pebbles: {
		id: "pebbles",
		name: "pebbles",
		desc: "much better as ammo than they are for eating.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	light_berries: {
		id: "light_berries",
		name: "light berries",
		desc: "they look... impressive.<br><button class='btn btn-i' onclick='Interact.eatLightBerries();'>Eat</button>",
		weight: 1,
		found: false,
		interact: {
			use: "They taste like... destiny."
		},
		class: "food"
	},
	torch: {
		id: "torch",
		name: "torch",
		desc: "portable fire!<br><span class='extra core-bg'>Increases chance of fleeing from fights.</span>",
		weight: 0,
		found: false,
		interact: {
			flee_chance: 0.1
		},
		class: "core"
	},
	droppings: {
		id: "droppings",
		name: "droppings",
		desc: "they look really sticky.",
		weight: 1,
		found: false,
		class: "craftable"
	},
	hare_meat: {
		id: "hare_meat",
		name: "hare meat",
		desc: "the raw meat of a downed hare.",
		weight: 2,
		found: false,
		class: "craftable"
	},
	sticky_sap: {
		id: "sticky_sap",
		name: "sticky sap",
		desc: "now this is sticky. nobody wants to touch it.<br><span class='extra core-bg'>Decreases chance for enemy to attack.</span>",
		weight: 0,
		found: false,
		interact: {
			response: -0.1
		},
		class: "core"
	},
	cooked_hare: {
		id: "cooked_hare",
		name: "cooked hare",
		desc: "much better than the raw version.<br><button class='btn btn-i' onclick='Interact.eatCookedHare();'>Eat</button>",
		weight: 2,
		found: false,
		interact: {
			use: "The cooked hare tastes remarkably similar to the cooked rabbit.",
			health: 40,
			energy: 10
		},
		class: "food"
	},
	bread: {
		id: "bread",
		name: "bread",
		desc: "warm, hearty bread. hard to get hungry with this around.<br><button class='btn btn-i' onclick='Interact.eatBread();'>Eat</button>",
		weight: 2,
		found: false,
		interact: {
			use: "The bread is tasty and filling.",
			health: 75
		},
		class: "food"
	},
	clear_water: {
		id: "clear_water",
		name: "clear water",
		desc: "clean, crystal clear water.<br><button class='btn btn-i' onclick='Interact.drinkClearWater();'>Drink</button>",
		weight: 2,
		found: false,
		interact: {
			use: "You gulp down the clear, clean water.",
			thirst: 75
		},
		class: "food"
	},
	hay: {
		id: "hay",
		name: "hay",
		desc: "rest anywhere, anytime. hay is great.<br><button class='btn btn-i' onclick='Interact.useHay();'>Use</button>",
		weight: 2,
		found: false,
		interact: {
			use: "You feel much better after a long rest on the soft hay.",
			energy: 75
		},
		class: "food"
	}
}

var Recipe = [
	{
		comp: ['leaves','twigs'],
		output: 'flask'
	},
	{
		comp: ['tree_bark','twigs'],
		output: 'firepit'
	},
	{
		comp: ['leaves','tree_bark'],
		output: 'pouch'
	},
	{
		comp: ['cornflower','flask'],
		output: 'coffee_brew'
	},
	{
		comp: ['firepit','milkcap'],
		output: 'roasted_milkcap'
	},
	{
		comp: ['firepit','rabbit_meat'],
		output: 'cooked_rabbit'
	},
	{
		comp: ['marigold','tree_sap'],
		output: 'ointment'
	},
	{
		comp: ['bear_tooth','branch'],
		output: 'spear'
	},
	{
		comp: ['deerskin','firepit'],
		output: 'leather'
	},
	{
		comp: ['leather','tree_sap'],
		output: 'leather_bag'
	},
	{
		comp: ['dandelion','prickly_pear'],
		output: 'pear_soup'
	},
	{
		comp: ['poppy','sharp_rock'],
		output: 'opium'
	},
	{
		comp: ['dry_grass','stinger'],
		output: 'bracelet'
	},
	{
		comp: ['bones','flint'],
		output: 'bone_sword'
	},
	{
		comp: ['gold_shard','snakeskin'],
		output: 'snake_belt'
	},
	{
		comp: ['boarskin','shell'],
		output: 'boar_armour'
	},
	{
		comp: ['charcoal','palm_leaf'],
		output: 'crude_map'
	},
	{
		comp: ['boarskin','shell'],
		output: 'boar_armour'
	},
	{
		comp: ['daylily','pine_cone'],
		output: 'lucky_trinket'
	},
	{
		comp: ['cougarskin','pouch'],
		output: 'cougar_pouch'
	},
	{
		comp: ['lemming_tooth','yak_horn'],
		output: 'power_horn'
	},
	{
		comp: ['amber','branch'],
		output: 'amber_staff'
	},
	{
		comp: ['flask','wood_moss'],
		output: 'moss_soup'
	},
	{
		comp: ['boar_armour','wolfskin'],
		output: 'wolf_armour'
	},
	{
		comp: ['thistle','toadflax'],
		output: 'triple_tea'
	},
	{
		comp: ['pebbles','roots'],
		output: 'slingshot'
	},
	{
		comp: ['firepit','raw_meat'],
		output: 'steak'
	},
	{
		comp: ['fox_fur','leather'],
		output: 'hide_gloves'
	},
	{
		comp: ['firepit','wooly_mullein'],
		output: 'torch'
	},
	{
		comp: ['droppings','tree_sap'],
		output: 'sticky_sap'
	},
	{
		comp: ['firepit','hare_meat'],
		output: 'cooked_hare'
	}
]

var Enemy = {
	rabbit: {
		id: "rabbit",
		name: "rabbit",
		desc: "This rabbit's eyes are bloodred. It looks just about ready to kill.",
		drop_msg: "You skin the rabbit and take it's meat.",
		drops: "rabbit_meat",
		total_health: 15,
		health: 15,
		damage: 3,
		response: 0.2,
		flee_chance: 0.5,
		drop_chance: 0.5,
		found: false
	},
	racoon: {
		id: "racoon",
		name: "racoon",
		desc: "The racoon picks up a small twig to duel you with. It looks fast.",
		drop_msg: "The racoon holds some green berries in its tiny paws.",
		drops: "green_berries",
		total_health: 25,
		health: 25,
		damage: 3,
		response: 0.5,
		flee_chance: 0.2,
		drop_chance: 0.5,
		found: false
	},
	deer: {
		id: "deer",
		name: "deer",
		desc: "You find a frantically braying deer. Lucky for you, it looks wounded.",
		drop_msg: "You strip the deer of its hide.",
		drops: "deerskin",
		total_health: 50,
		health: 50,
		damage: 5,
		response: 0.1,
		flee_chance: 1,
		drop_chance: 0.5,
		found: false
	},
	bear: {
		id: "bear",
		name: "bear",
		desc: "A large brown bear appears from out of the shadows. It does not look friendly.",
		drop_msg: "You take a tooth from the mighty bear as a prize.",
		drops: "bear_tooth",
		total_health: 100,
		health: 100,
		damage: 20,
		response: 0.1,
		flee_chance: 0.2,
		drop_chance: 0.5,
		found: false
	},
	armadillo: {
		id: "armadillo",
		name: "armadillo",
		desc: "An armadillo lumbers towards you. It shell makes it impossibly strong.",
		drop_msg: "The armadillo's strong shell could prove useful.",
		drops: "shell",
		total_health: 100,
		health: 100,
		damage: 5,
		response: 0.1,
		flee_chance: 0.6,
		drop_chance: 0.5,
		found: false
	},
	boar: {
		id: "boar",
		name: "boar",
		desc: "A boar rears it's ugly head from across the desert. It's eyes stare intently.",
		drop_msg: "You strip the hide off the fallen boar.",
		drops: "boarskin",
		total_health: 50,
		health: 50,
		damage: 10,
		response: 0.2,
		flee_chance: 0.3,
		drop_chance: 0.5,
		found: false
	},
	rattlesnake: {
		id: "rattlesnake",
		name: "rattlesnake",
		desc: "A rattlesnake suddenly appears under your feet. It will be hard to escape.",
		drop_msg: "The rattlesnake's skin could make a good belt.",
		drops: "snakeskin",
		total_health: 15,
		health: 15,
		damage: 25,
		response: 0.2,
		flee_chance: 0.1,
		drop_chance: 0.5,
		found: false
	},
	scorpion: {
		id: "scorpion",
		name: "scorpion",
		desc: "A scorpion lunges at you. It's stinger looks plump and dangerous.",
		drop_msg: "You sever the stinger from the scorpion, now free from venom.",
		drops: "stinger",
		total_health: 20,
		health: 20,
		damage: 10,
		response: 0.3,
		flee_chance: 0.6,
		drop_chance: 0.5,
		found: false
	},
	cougar: {
		id: "cougar",
		name: "cougar",
		desc: "A sleek cougar steps out from a cave. Looks like you entered it's territory.",
		drop_msg: "The cougar's skin could make a good improvement to your pouch.",
		drops: "cougarskin",
		total_health: 60,
		health: 60,
		damage: 15,
		response: 0.4,
		flee_chance: 0.2,
		drop_chance: 0.5,
		found: false
	},
	lemming: {
		id: "lemming",
		name: "lemming",
		desc: "A lemming freezes at the edge of a cliff. It points its head inquisitively towards you.",
		drop_msg: "One of the lemmings two front teeth comes loose.",
		drops: "lemming_tooth",
		total_health: 5,
		health: 5,
		damage: 1,
		response: 0.9,
		flee_chance: 1,
		drop_chance: 0.5,
		found: false
	},
	wolf: {
		id: "wolf",
		name: "wolf",
		desc: "You hear a wolf snarling behind you. Turning around, you can see it prepare to pounce.",
		drop_msg: "You strip the wolf of it's powerful hide.",
		drops: "wolfskin",
		total_health: 40,
		health: 40,
		damage: 15,
		response: 0.4,
		flee_chance: 0.2,
		drop_chance: 0.5,
		found: false
	},
	yak: {
		id: "yak",
		name: "yak",
		desc: "A yak lumbers across the high outcrops of the mountain.",
		drop_msg: "The fallen yak has no use for it's horn anymore.",
		drops: "yak_horn",
		total_health: 75,
		health: 75,
		damage: 15,
		response: 0.2,
		flee_chance: 0.8,
		drop_chance: 0.5,
		found: false
	},
	vulture: {
		id: "vulture",
		name: "vulture",
		desc: "A vulture swoops at you. It probably thinks you're an easy meal.",
		drop_msg: "Near the fallen vulture is a huge hunk of raw meat.",
		drops: "raw_meat",
		total_health: 20,
		health: 20,
		damage: 20,
		response: 0.3,
		flee_chance: 0.5,
		drop_chance: 0.5,
		found: false
	},
	fox: {
		id: "fox",
		name: "fox",
		desc: "A fox comes out of its den, trying to protect it's territory.",
		drop_msg: "The fox's fur is impossibly silky and a vivid orange colour.",
		drops: "fox_fur",
		total_health: 25,
		health: 25,
		damage: 5,
		response: 0.6,
		flee_chance: 0.5,
		drop_chance: 0.5,
		found: false
	},
	mountain_goat: {
		id: "mountain_goat",
		name: "mountain goat",
		desc: "A mountain goat stands peacefully on a rock. Or is that dangerously?",
		drop_msg: "Goat's droppings are scattered around the area.",
		drops: "fox_fur",
		total_health: 40,
		health: 40,
		damage: 6,
		response: 0.4,
		flee_chance: 0.5,
		drop_chance: 0.5,
		found: false
	},
	hare: {
		id: "hare",
		name: "hare",
		desc: "A hare stands before you. It's muscles ripple under the setting sun. It's eyes, bloodshot, stare deep into your soul.",
		drop_msg: "The raw meat of the fallen hare will taste like victory.",
		drops: "hare_meat",
		total_health: 50,
		health: 50,
		damage: 15,
		response: 0.5,
		flee_chance: 0.3,
		drop_chance: 0.5,
		found: false
	},
	mouse: {
		id: "mouse",
		name: "mouse",
		desc: "A tiny mouse scampers near your feet.",
		drop_msg: "The mouse wasn't even doing anything...",
		drops: "light_berries",
		total_health: 5,
		health: 5,
		damage: 0,
		response: 0,
		flee_chance: 1,
		drop_chance: 0.5,
		found: false
	},
	bluejay: {
		id: "bluejay",
		name: "bluejay",
		desc: "A bluejay sings from the top of a tall tree.",
		drop_msg: "The song wasn't even that bad...",
		drops: "light_berries",
		total_health: 5,
		health: 5,
		damage: 0,
		response: 0,
		flee_chance: 1,
		drop_chance: 0.5,
		found: false
	}
}

var World = {
	tiles: [
	'forest1',
	'forest2',
	'forest3',
	'forest4',
	'desert1',
	'desert2',
	'desert3',
	'taiga1',
	'taiga2',
	'mountain1',
	'peak1',
	'plateau1'
	],
	forest1: {
		drops: [
		'blue_berries',
		'dark_berries',
		'red_berries'
		],
		progress: 0,
		total: 10,
		m_choices: [
		'forest2'
		],
		unlocked: true,
		enc_chance: 0,
		enemies: []
	},
	forest2: {
		drops: [
		'blue_berries',
		'dark_berries',
		'red_berries',
		'leaves',
		'twigs',
		'tree_bark'
		],
		progress: 0,
		total: 15,
		m_choices: [
		'forest1',
		'forest3'
		],
		unlocked: false,
		enc_chance: 0,
		enemies: []
	},
	forest3: {
		drops: [
		'blue_berries',
		'dark_berries',
		'red_berries',
		'leaves',
		'twigs',
		'tree_bark',
		'cornflower',
		'milkcap',
		'sharp_rock'
		],
		progress: 0,
		total: 20,
		m_choices: [
		'forest2',
		'forest4',
		'desert1'
		],
		unlocked: false,
		enc_chance: 0.25,
		enemies: [
			'rabbit',
			'racoon'
		]
	},
	forest4: {
		drops: [
		'blue_berries',
		'dark_berries',
		'red_berries',
		'leaves',
		'twigs',
		'tree_bark',
		'cornflower',
		'milkcap',
		'sharp_rock',
		'marigold',
		'tree_sap',
		'branch'
		],
		progress: 0,
		total: 25,
		m_choices: [
		'forest3',
		'desert2',
		'taiga1'
		],
		unlocked: false,
		enc_chance: 0.25,
		enemies: [
			'deer',
			'bear'
		]
	},
	desert1: {
		drops: [
		'dandelion',
		'prickly_pear',
		'poppy'
		],
		progress: 0,
		total: 30,
		m_choices: [
		'forest3',
		'desert2'
		],
		unlocked: false,
		enc_chance: 0.25,
		enemies: []
	},
	desert2: {
		drops: [
		'dandelion',
		'prickly_pear',
		'poppy',
		'dry_grass',
		'flint',
		'gold_shard'
		],
		progress: 0,
		total: 30,
		m_choices: [
		'forest4',
		'desert1',
		'desert3'
		],
		unlocked: false,
		enc_chance: 0.25,
		enemies: [
			'armadillo',
			'boar'
		]
	},
	desert3: {
		drops: [
		'dandelion',
		'prickly_pear',
		'poppy',
		'dry_grass',
		'flint',
		'gold_shard',
		'bones',
		'palm_leaf',
		'orange_berries'
		],
		progress: 0,
		total: 30,
		m_choices: [
		'desert2'
		],
		unlocked: false,
		enc_chance: 0.25,
		enemies: [
			'rattlesnake',
			'scorpion'
		]
	},
	taiga1: {
		drops: [
		'pine_cone',
		'charcoal',
		'daylily'
		],
		progress: 0,
		total: 30,
		m_choices: [
		'forest4',
		'taiga2'
		],
		unlocked: false,
		enc_chance: 0.25,
		enemies: [
			'cougar',
			'lemming'
		]
	},
	taiga2: {
		drops: [
		'pine_cone',
		'charcoal',
		'daylily',
		'amber',
		'wood_moss',
		'purple_berries'
		],
		progress: 0,
		total: 30,
		m_choices: [
		'taiga1',
		'mountain1'
		],
		unlocked: false,
		enc_chance: 0.25,
		enemies: [
			'wolf',
			'yak'
		]
	},
	mountain1: {
		drops: [
		'thistle',
		'toadflax',
		'roots'
		],
		progress: 0,
		total: 30,
		m_choices: [
		'taiga2',
		'peak1'
		],
		unlocked: false,
		enc_chance: 0.25,
		enemies: [
			'vulture',
			'fox'
		]
	},
	peak1: {
		drops: [
		'wooly_mullein',
		'pebbles',
		'light_berries'
		],
		progress: 0,
		total: 30,
		m_choices: [
		'mountain1',
		'plateau1'
		],
		unlocked: false,
		enc_chance: 0.25,
		enemies: [
			'mountain_goat',
			'hare'
		]
	},
	plateau1: {
		drops: [
		'bread',
		'clear_water',
		'hay'
		],
		progress: 0,
		total: 30,
		m_choices: [
		'peak1'
		],
		unlocked: false,
		enc_chance: 0.25,
		enemies: [
			'mouse',
			'bluejay'
		]
	}
}

function save() {
	var saveGame = Game;
	var saveItem = Item;
	var saveWorld = World;

	localStorage.setItem("saveGame",JSON.stringify(saveGame));
	localStorage.setItem("saveItem",JSON.stringify(saveItem));
	localStorage.setItem("saveWorld",JSON.stringify(saveWorld));
}

function load() {
	if (localStorage.getItem("saveGame") != undefined) {
		var loadedGame = JSON.parse(localStorage.getItem("saveGame"));
		if (typeof loadedGame !== "undefined") Game = loadedGame;
	}

	if (localStorage.getItem("saveItem") != undefined) {
		var loadedItem = JSON.parse(localStorage.getItem("saveItem"));
		if (typeof loadedItem !== "undefined") Item = loadedItem;
	}

	if (localStorage.getItem("saveWorld") != undefined) {
		var loadedWorld = JSON.parse(localStorage.getItem("saveWorld"));
		if (typeof loadedWorld !== "undefined") World = loadedWorld;
	}
}

function reset() {
	var end = confirm("Are you sure you want to reset the game? This will delete your save.");
	if (end == true) {
		localStorage.removeItem("saveGame");
		localStorage.removeItem("saveItem");
		localStorage.removeItem("saveWorld");
		location.reload();
	}
}

function update() {
	//use sparingly, haha.
	updateStats();
	updateMine();
	updateItems();
	updateMap();
	updateWeight();
	updateCraftbox();
	updateOutput();
	updateCurrentTile();
	updateUnlocked();
	checkPossibles();
	checkTotalFounds();
}

$(document).ready(function() {

	//loading game
	load();

	//mode
	updateMode();

	//big update time
	update();

	setInterval(function() {
		save();
	}, 10000);

	//begin
	log('You are stranded in a deep, dense forest.');

	//mine initialise
	$("body").on('click', '.foragebox .box', function() {
		var index = $('.foragebox .box').index(this);
		var item_id = Game.mine[index].id;

		if (item_id != undefined) {
			if (Game.weight + Item[item_id].weight <= Game.total_weight) { //this if statement has to be done twice (happens again in newItem)
				newItem(item_id);
				Game.mine.splice(index, 1, '');
				updateMine();
			}
		}
		else {
			console.log("Clicked an empty square.");
		}
	});

	//delmark initialise
	$("body").on('click', '.inv .box .delmark', function() {
		var index = $('.inv .box .delmark').index(this);
		Game.inv.splice(index, 1);

		updateItems();
	});

	$('.map-cover').bind('mousemove', function(e){
		$('.biome-cards').css({
			left:  e.pageX + 20,
			top:   e.pageY - 10
		});
	});

	$('.map-table').on('mouseover', function(e){
		$('.biome-cards').show();
	});

	$('.map-table').on('mouseleave', function(e){
		$('.biome-cards').hide();
	});

	//map click initialise
	$('.biome-cards .card').hide();
	$('.biome-cards').show(); //html sets this to display: none;

	$('.map-table').on('mouseover', '.tile', function(e) {
		var biome =
			e.target.className
				.replace(/\s/g, '')
				.replace('tile','')
				.replace('forest','')
				.replace('desert','')
				.replace('taiga','')
				.replace('mountain','')
				.replace('plateau','')
				.replace('player','');
		var biome_name = '.biome-cards .' + biome;
		$('.biome-cards .card').hide();
		$(biome_name).show();
	});

	//fast travel initialise
	$('.map-table').on('click', '.tile', function(e) {

		var biome =
			e.target.className
				.replace(/\s/g, '')
				.replace('tile','')
				.replace('forest','')
				.replace('desert','')
				.replace('taiga','')
				.replace('mountain','')
				.replace('plateau','')
				.replace('player','');

		if (Game.currentTile != biome && World[biome].unlocked == true) {
			//travel to new tile
			Game.currentTile = biome;
			//reset progress bar
			updateMap();
			//update current tile text
			updateCurrentTile();
			//log it!
			log("Fast travelled.", "blue");
		}
	})

	//craftbox initialise
	//craftbox addition method
	$("body").on('click', '.inv .box', function(e) {
		if (e.target == this) { //this checks if the box is clicked, not the delete mark
			var index = $('.inv .box').index(this);
			var item = Item[Game.inv[index].id];

			if (Game.craftbox.length < 2) {
				Game.craftbox.push(item);
				removeItem(item.id, 1);
				updateCraftbox();
				checkForCraft();
			}
		}
	});

	//craftbox removal method
	$("body").on('click', '.craftbox .ingredients-col .box', function() {
		var index = $('.craftbox .ingredients-col .box').index(this);

		if (Game.craftbox[index] != undefined) {
			var item = Item[Game.craftbox[index].id];
			Game.craftbox.splice(index, 1);
			newItem(item.id);
			updateCraftbox();
			checkForCraft();
			updateStats(); //for amber staff, snakeskin etc
		}
	});

	//craftbox output removal method
	$("body").on('click', '.craftbox .outcome-col .box', function() {

		if (Game.output[0] != undefined) {
			newItem(Game.output[0].id);
			Game.output = [];
			updateOutput();

			Game.craftbox = [];
			updateCraftbox();

			checkForCraft();
			checkPossibles();

			//adds craftsmanship
			Game.exp.current += Game.exp.craftsmanship_inc;
			updateStats();
		}
		else {
			console.log("Clicked output but nothing craftable!");
		}

	});

	//biome cards init
	for (i = 0; i < World.tiles.length; i++) {
		var world = World.tiles[i];

		//constructs drops
		World[world].drops.sort(); //sorts alphabetically
		var drops = World[world].drops;
		$('.card.'+world+' .flora').html(drops.map(getSpantab));

		//constructs enemies
		if (World[world].enemies.length != 0) {
			World[world].enemies.sort(); //sorts alphabetically
			var enemies = World[world].enemies;
			$('.card.'+world+' .fauna').html(enemies.map(getEnemySpantab));
		}
		else {
			$('.card.'+world+' .fauna').append('<div class="none">none.</div>');
		}
	}

	//biome cards
	$('.biome-cards .card .spantab').addClass('unknown'); //makes items unknown
	blurNames(); //blurs item names
	checkIfFound(); //checks if items have been found

	//var aaa = Object.keys(Item).sort();
	//$('.all-items').html(aaa.map(getSpantab));

	//devMode();
	//halfDevMode();
});

function resetMine() {
	if (Game.mine = []) {
		for (i = 0; i < 9; i++) {
			Game.mine[i] = '';
		}
	}
}

function checkForCraft() {
	Game.craft_array = [];
	if (Game.craftbox[0] != undefined) Game.craft_array.push(Game.craftbox[0].id);
	if (Game.craftbox[1] != undefined) Game.craft_array.push(Game.craftbox[1].id);
	Game.craft_array.sort();

	Game.output = [];

	for (i = 0; i < Recipe.length; i++) {
		if (Game.craft_array.toString() == Recipe[i].comp.toString()) { //.toString() is because equality check doesn't work with arrays
			Game.output.push(Item[Recipe[i].output]);
			break;
		}
	}

	updateOutput();
}

function updateOutput() {
	if (Game.output.toString() != '' && Game.output.length != 0) { //checks if undefined (e.g if the output isnt in Item var)
		$('.outcome-col .out').html(
			'<div class="box pointer '+Game.output[0].id+'"><span class="name">'+Game.output[0].name+'</span></div>'+
			'<div class="desc"><i>'+Game.output[0].desc+'</i><br>weight: '+Game.output[0].weight+'</div>'
		);
	}
	else {
		if (Game.craft_array.length == 2) {
			$('.outcome-col .out').html('<div class="box">dust</div>');
		}
		else {
			$('.outcome-col .out').html('<div class="box"></div>');
		}
	}
}

function tabClick(clicked) {
	var tab =
		$(clicked).attr('class')
			.replace(/\s/g, '')
			.replace('tab','')
			.replace('selected','');
	if (tab == 'forage-page') {
		$('.page.forage-page').css({'right':'0'});
		$('.page.explore-page').css({'right':'-80%'});
	}
	else if (tab == 'explore-page') {
		$('.page.forage-page').css({'right':'80%'});
		$('.page.explore-page').css({'right':'0'});
	}
	var tab_class = '.' + tab;
	$('.tabmenu .tab').removeClass('selected');
	$('.tabmenu').find(tab_class).addClass('selected');
}

function blurNames() {
	var cards = $('.biome-cards .card').length;
	for (i = 0; i < cards; i++) {
		var items_a = $('.biome-cards .card').eq(i).find('.item-name').length;
		for (k = 0; k < items_a; k++) {
			var name = $('.biome-cards .card').eq(i).find('.item-name').eq(k).text();
			var final = name.replace(" ", "+").replace(/[a-zA-Z]/g, "?").replace("+", " "); //wow I just dont know how to do this good haha
			var name = $('.biome-cards .card').eq(i).find('.item-name').eq(k).after("<span class='blurred'>"+final+"</span>");
		}
	}
}

function checkIfFound() {
	var cards = $('.biome-cards .card').length;
	for (i = 0; i < cards; i++) {
		var items_a = $('.biome-cards .card').eq(i).find('.item-name').length;
		for (k = 0; k < items_a; k++) {
			var name = $('.biome-cards .card').eq(i).find('.item-name').eq(k).text();
			var final = name.toLowerCase().replace(" ", "_");
			if (Item[final] != undefined) {
				if (Item[final].found == true) {
					$('.biome-cards .card').eq(i).find('.spantab').eq(k).removeClass("unknown");
				}
			}
			else if (Enemy[final] != undefined) {
				if (Enemy[final].found == true) {
					$('.biome-cards .card').eq(i).find('.spantab').eq(k).removeClass("unknown");
				}
			}
		}
	}
}

function newItem(item_id) {
	var newbie = Item[item_id];

	if (Game.weight + newbie.weight <= Game.total_weight) {
		for (i = 0; i < Game.inv.length; i++) {
			if (Game.inv[i].name == newbie.name) {
				Game.inv[i].amount++;
				break;
			}
		}
		
		Game.inv.push({
			id: newbie.id,
			name: newbie.name,
			desc: newbie.desc,
			weight: newbie.weight,
			class: newbie.class,
			amount: 1
		});

		Item[newbie.id].found = true;
		checkIfFound();

		updateItems();
	}
	else {
		console.log("Too heavy.");
	}
}

function sendcart() {
	Game.total_cart = Game.base_cart;
	if (checkForItem("lucky_trinket")) Game.total_cart += Item.lucky_trinket.interact.cart;

	if (Game.energy.current >= Game.forage_cost) {
		$('.forage-btn').prop('disabled', true);

		$('.main-bar .inner').css("transition-duration",Game.total_cart+"ms");
		$('.main-bar .inner').css("width","0%");

		setTimeout(function() {
			$('.forage-btn').prop('disabled', false);

			if (mineFullCheck()) {
				log("The forage box is full!");
			}
			else {
				log('You finish looking, and find some supplies.');
			}

			$('.main-bar .inner').css("transition-duration","0ms");
			$('.main-bar .inner').css("width","100%");

			var add_ores = 0;
			if (checkForItem("hide_gloves")) add_ores = Item.hide_gloves.interact.maxores;
			var total_ores = Game.maxores + add_ores;
			var number = randInt(1, total_ores);
			for (var i = 0; i < number; i++) {
				newore();
			}

			//update herbology
			Game.exp.current += Game.exp.herbology_inc;

			//update costs
			Game.energy.current -= Game.forage_cost;
			updateStats();
		}, Game.total_cart);
	}
	else {
		log("You have no energy to forage!", "blue");
	}
}

function newore() {
	var items = World[Game.currentTile].drops;
	var item = rand(items);

	var itemArray = Object.keys(Item);
	var size = itemArray.length;

	if (mineFullCheck()) {
		console.log('The mine is full!');
	}
	else { //do/while loop WOW!
		var point;
		do {
			point = randInt(0, Game.mine.length);
		}
		while (Game.mine[point] != '');

		if (Game.mine[point] == '') {
			Game.mine.splice(point, 1, {
				id: Item[item].id,
				name: Item[item].name,
				weight: Item[item].weight
			});
		}
	}

	updateMine();
}

function mineFullCheck() {
	var check;
	for (i = 0; i < Game.mine.length; i++) {
		if (Game.mine[i] == '') {
			check = false;
			break;
		}
	}
	if (check != false) {
		check = true;
	}
	return check;
}

function discardAll() {
	for (var i = 0; i < Game.mine.length; i++) {
		Game.mine[i] = '';
	}
	updateMine();
}

function updateMine() {
	//resets classes on box
	$('.foragebox .box-row .box').removeClass();
	$('.foragebox .box-row div').addClass('box');

	//resets classes on weight
	$('.foragebox .box-row .box .weight').removeClass('w-show');

	for (i = 0; i < Game.mine.length; i++) {
		if (Game.mine[i].name != undefined) {
			$('.foragebox .box .name').eq(i).text(Game.mine[i].name);
			$('.foragebox .box').eq(i).addClass(Game.mine[i].id);
			$('.foragebox .box').eq(i).addClass('pointer');
			$('.foragebox .box').eq(i).addClass('appear');

			$('.foragebox .box .weight').eq(i).text(Game.mine[i].weight);
			$('.foragebox .box .weight').eq(i).addClass('w-show');
		}
		else {
			$('.foragebox .box .name').eq(i).text('');
		}
	}
}

function updateWeight() {
	//calculates weight with multipliers
	Game.total_weight = Game.base_weight;
	//checkForItem wont work because the pouch might be accidentally placed in the craftbox
	if (Item.pouch.found == true) Game.total_weight += Item.pouch.interact.weight;
	if (Item.leather_bag.found == true) Game.total_weight += Item.leather_bag.interact.weight;
	if (Item.cougar_pouch.found == true) Game.total_weight += Item.cougar_pouch.interact.weight;

	$('.c_weight').html(Game.weight);
	$('.total_weight').html(Game.total_weight);
}

function updateStats() {
	//check for max hp/thirst/energy upgrades
	Game.health.max = Game.health.base;
	Game.thirst.max = Game.thirst.base;
	Game.energy.max = Game.energy.base;

	if (Item.amber_staff.found == true) Game.health.max += Item.amber_staff.interact.health;
	if (Item.bracelet.found == true) Game.thirst.max += Item.bracelet.interact.thirst;
	if (Item.snake_belt.found == true) Game.energy.max += Item.snake_belt.interact.energy;

	//clean up health stats
	if (Game.health.current < 0) Game.health.current = 0;
	if (Game.thirst.current < 0) Game.thirst.current = 0;
	if (Game.energy.current < 0) Game.energy.current = 0;
	if (Game.health.current > Game.health.max) Game.health.current = Game.health.max;
	if (Game.thirst.current > Game.thirst.max) Game.thirst.current = Game.health.max;
	if (Game.energy.current > Game.energy.max) Game.energy.current = Game.health.max;

	//deathcheck
	//triggers from health at zero or thirst + energy at zero
	if (Game.health.current == 0) {
		playerDeath();
	}
	if (Game.thirst.current == 0 && Game.energy.current == 0) {
		playerDeath();
	}

	var health = (Game.health.current/Game.health.max*100).toFixed(0);
	var thirst = (Game.thirst.current/Game.thirst.max*100).toFixed(0);
	var energy = (Game.energy.current/Game.energy.max*100).toFixed(0);

	$('.progress-bar.health .mid .value').html(Game.health.current.toFixed(0));
	$('.progress-bar.health .inner').css({
		"width" : health + "%"
	});

	$('.progress-bar.thirst .mid .value').html(Game.thirst.current.toFixed(0));
	$('.progress-bar.thirst .inner').css({
		"width" : thirst + "%"
	});

	$('.progress-bar.energy .mid .value').html(Game.energy.current.toFixed(0));
	$('.progress-bar.energy .inner').css({
		"width" : energy + "%"
	});

	//exp update
	if (Game.exp.current/Game.exp.max*100 >= 100) {
		Game.exp.level++;
		Game.exp.current = 0;
		Game.exp.max += 20;
		//log("You level up!", "blue");
	}

	var exp = (Game.exp.current/Game.exp.max*100).toFixed(0);

	$('.exp-level').html(Game.exp.level);
	$('.progress-bar.exp .inner').html(exp);
	$('.progress-bar.exp .inner').css({
		"width" : exp + "%"
	});
}

function playerDeath() {
	$('.overlay').fadeOut(300);

	//removes half of player's items !!
	for (i = 0; i < Game.inv.length; i+=2) { //i+=2 !!
		Game.inv.splice(i, 1);
	}
	Game.mine = [];
	resetMine();
	Game.craftbox = [];
	Game.output = [];

	Game.health.current = 60;
	Game.thirst.current = 60;
	Game.energy.current = 60;

	updateItems();
	updateMine();
	updateCraftbox();
	updateStats();

	//removes progress >:)
	World[Game.currentTile].progress = 0;

	log("You black out.", "red");
	log("You awaken feeling groggy, and find some of your supplies lost.", "blue");
}

/*function updateBars() {
	//redacted; see previous versions for copy paste
}*/

function updateItems() {
	sort(Game.inv);
	$('.inv').html(Game.inv.map(getItem));
	//getting amounts (annoying)
	for (i = 0; i < Game.inv.length; i++) {
		var new_id = '.inv .box.' + Game.inv[i].id + ' .no';
		var amount = $(new_id).length;
		$(new_id).html(amount);
	}
	stackItems();

	//calculating and updating weight
	var c_weight = 0;
	for (i = 0; i < Game.inv.length; i++) {
		c_weight += Game.inv[i].weight;
	}
	Game.weight = c_weight;

	updateWeight();

	//check crafting possibilies (more slop)
	checkPossibles();

	//updateFounds (slooooppppp)
	checkTotalFounds();
}

function checkTotalFounds() {
	var items_array = Object.keys(Item);
	var total_founds = items_array.length;
	var founds = 0;
	for (i = 0; i < total_founds; i++) {
		if (Item[items_array[i]].found == true) {
			founds++;
		}
	}
	$('.finds').html(founds+"/"+total_founds);
}

function updateCraftbox() {
	if (Game.craftbox[0] != undefined) {
		$('.ingredients-col .ing1').html('<div class="box pointer '+Game.craftbox[0].id+'"><span class="name">'+Game.craftbox[0].name+'</span></div>');
	}
	else {
		$('.ingredients-col .ing1').html('<div class="box"></div>');
	}

	if (Game.craftbox[1] != undefined) {
		$('.ingredients-col .ing2').html('<div class="box pointer '+Game.craftbox[1].id+'"><span class="name">'+Game.craftbox[1].name+'</span></div>');
	}
	else {
		$('.ingredients-col .ing2').html('<div class="box"></div>');
	}
}

function updateCurrentTile() {
	//this is gonna break with tiles that are two digits long. <3
	$('.currentTile').html(convertTileName(Game.currentTile)); //this just adds a space as the second last character
}

function convertTileName(name) {
	var changed = name.charAt(0).toUpperCase() + name.slice(1).replace(/.{1}$/,' $&');
	return changed;
}

function updateMap() {
	//checks if you're at the next zone
	//this variable is necessary for later in the function btw
	var prog = Math.floor(World[Game.currentTile].progress/World[Game.currentTile].total*100);
	if (prog >= 100) {
		unlockChoices();
	}

	//update actual map
	for (v in World.tiles) {
		var tile = World.tiles[v];
		var tile_prog = Math.floor(World[tile].progress/World[tile].total*100);
		$("."+tile+" .cover").css({
			"height" : tile_prog + "%"
		})
	}

	//updates progress numbers and bar
	$('.prog-c').html(World[Game.currentTile].progress);
	$('.prog-max').html(World[Game.currentTile].total);
	$('.tile-progress .inner').css({
		"width" : prog + "%"
	})

	//finally, changes where the player is
	$('.map-table .tile').removeClass('player');
	$('.map-table').find("."+Game.currentTile).addClass('player');
}

function unlockChoices() {
	var choices = World[Game.currentTile].m_choices;
	for (v in choices) {
		World[choices[v]].unlocked = true;
	}
	updateUnlocked();
}

function updateUnlocked() {
	var no = World.tiles.length;
	for (i = 0; i < no; i++) {
		var add;
		if (World[World.tiles[i]].unlocked == true) {
			add = "<span class='green-color'>unlocked</span>"
		}
		else {
			add = "<span class='red-color'>locked</span>"
		}
		$('.biome-cards .card').eq(i).find('.card-title .status').html(add);
	}
}

function getItem(array) {
	var full_item =
		'<div class="box '+array.id+' '+array.class+'">'+
		'<span class="no"></span><span class="delmark">×</span>'+
		'<div class="name">'+array.name+'</div>'+
		'</div>'+
		'<div class="desc">'+
		'<div><i>'+array.desc+'</i></div>'+
		'<div>weight: '+array.weight+'</div>'+
		'</div>';
	return full_item;
}

function sort(array) {
	array = array.sort(function (a, b) {
		return a["name"].localeCompare(b["name"]);
	});
}

function stackItems() {
	$('.inv .box').removeClass('stacked');
	for (i = 1; i < Game.inv.length; i++) {
		if (Game.inv[i].name == Game.inv[i-1].name) {
			$('.inv .box').eq(i).addClass('stacked');
		}
	}
}






/* exploring */





function explore() {
	Game.total_explore = Game.base_explore;
	if (checkForItem("crude_map")) Game.total_explore += Item.crude_map.interact.explore;

	if (Game.thirst.current >= Game.explore_cost) {
		$('.explore-btn').prop('disabled', true);

		$('.tile-progress .inner').css("transition-duration",Game.total_explore+"ms");

		//only progresses if you're below the total
		if (World[Game.currentTile].progress < World[Game.currentTile].total) {
			World[Game.currentTile].progress += Game.walkinc;
			updateMap();	
		}

		$('.explore-progress .inner').css("transition-duration",Game.total_explore+"ms");
		$('.explore-progress .inner').css("width","0%");

		setTimeout(function() {
			$('.explore-btn').prop('disabled', false);

			$('.explore-progress .inner').css("transition-duration","0ms");
			$('.explore-progress .inner').css("width","100%");

			//get exp
			Game.exp.current += Game.exp.explore_inc;

			//update costs
			Game.thirst.current -= Game.explore_cost;
			updateStats();

			enemyEncounter();
		}, Game.total_explore);
	}
	else {
		log("You are too dehydrated to explore!", "blue");
	}
}

function enemyEncounter() {
	var add_enc = 0;
	if (checkForItem("power_horn")) add_enc = Item.power_horn.interact.enc_chance;
	var total_enc = World[Game.currentTile].enc_chance + add_enc;
	if (total_enc >= Math.random()) {
		if (World[Game.currentTile].enemies != []) { //insurace, checks if there is an enemy array
			var chosen = rand(World[Game.currentTile].enemies);
			var enemy = Enemy[chosen];

			Game.enemy = JSON.parse(JSON.stringify(enemy)); //weird way of cloing object
			//"found" enemy
			Enemy[Game.enemy.id].found = true;
			updateEnemy();

			$('.overlay').fadeIn(300);
			$('.overlay').css({
				"display" : "inline-flex"
			});
			$('.fight-card .btn').prop('disabled', false);
			log(Game.enemy.desc);
		}
	}
}

function updateEnemy() {
	$('.enemy-name').html(Game.enemy.name);
	$('.enemy-desc').html(Game.enemy.desc);
	$('.fight-card .progress-bar .inner').html(Game.enemy.health);
	$('.fight-card .progress-bar .inner').css({
		"width" : (Game.enemy.health / Game.enemy.total_health * 100).toFixed(0) + "%"
	});
	var add_chance = 0;
	if (checkForItem("torch")) add_chance = Item.torch.interact.flee_chance;
	var total_chance = Game.enemy.flee_chance + add_chance;
	$('.fleechance').html((total_chance * 100).toFixed(0));

	//also calculates player damage
	Game.total_damage = Game.base_damage;
	if (checkForItem("spear")) Game.total_damage += Item.spear.interact.damage;
	if (checkForItem("bone_sword")) Game.total_damage += Item.bone_sword.interact.damage;
	if (checkForItem("slingshot")) Game.total_damage += Item.slingshot.interact.damage;
}

function attackEnemy() {
	//animating the icons
	clearTimeout(remove_p);
	$('.fight-card .player-thumb').addClass('player-attack');
	var remove_p = setTimeout(function() {
		$('.fight-card .player-thumb').removeClass('player-attack');
	}, 150);

	//fortitude gain
	Game.exp.current += Game.exp.fortitude_inc;
	updateStats();

	//enemy gets damaged
	Game.enemy.health -= Game.total_damage;
	updateEnemy();
	log("You attack the "+Game.enemy.name+" for "+Game.total_damage+" damage.");

	//enemy hurts you
	var add_dodge = 0;
	if (checkForItem("sticky_sap")) add_dodge = Item.sticky_sap.interact.response;
	var total_dodge = Game.enemy.response + add_dodge;
	if (total_dodge >= Math.random()) {
		enemyAttack();
	}

	if (Game.enemy.health <= 0) {
		log("You win the fight, and escape with whatever you can find.");
		closeFight();

		//drops
		if (Game.enemy.drop_chance >= Math.random()) {
			addOre(Game.enemy.drops);
			log(Game.enemy.drop_msg, "green");
		}
	}
}

function enemyAttack() {
	//animating the icons
	clearTimeout(remove_e);
	$('.fight-card .enemy-thumb').addClass('enemy-attack');
	var remove_e = setTimeout(function() {
		$('.fight-card .enemy-thumb').removeClass('enemy-attack');
	}, 300);

	//calculates defence
	Game.total_defence = Game.base_defence;
	if (checkForItem("boar_armour")) Game.total_defence += Item.boar_armour.interact.defence;
	if (checkForItem("wolf_armour")) Game.total_defence += Item.wolf_armour.interact.defence;
	var enemy_total_damage = Game.enemy.damage - Game.total_defence;
	if (enemy_total_damage <= 0) enemy_total_damage = 0;
	Game.health.current -= enemy_total_damage;
	log("The "+Game.enemy.name+" attacks you for "+enemy_total_damage+" damage.", "red");
	updateStats();
}

function bait() {
	if (checkForItem("red_berries")) { //returns true if you have red berries
		Game.enemy.flee_chance = Game.enemy.flee_chance * 1.5;
		updateEnemy();
		removeItem("red_berries", 1);
		log("You throw some berries towards the "+Game.enemy.name+" as a distaction.");
	}
}

function flee() {
	var add_chance = 0;
	if (checkForItem("torch")) add_chance = Item.torch.interact.flee_chance;
	var total_chance = Game.enemy.flee_chance + add_chance;
	if (total_chance >= Math.random()) {
		log("You flee from the fight. The "+Game.enemy.name+" leaves.", "green");
		closeFight();
	}
	else {
		log("Your escape attempt fails.");
		enemyAttack();
	}
}

function closeFight() {
	$('.fight-card .btn').prop('disabled', true); //to prevent log duplicates
	$('.overlay').fadeOut(300);
	checkIfFound();
}




/* crafting possibles */

function checkPossibles() {
	var inv_array = [];
	for (i = 0; i < Game.inv.length; i++) {
		inv_array.push(Game.inv[i].id);
	}
	for (i = 0; i < Game.craftbox.length; i++) { //also adds craftbox ;)
		inv_array.push(Game.craftbox[i].id);
	}

	Game.craft_possibles = [];
	for (i = 0; i < 31; i++) {
		var item_one = Recipe[i].comp[0];
		var item_two = Recipe[i].comp[1];
		if (inv_array.includes(item_one) && inv_array.includes(item_two)) {
			Game.craft_possibles.push(Recipe[i].output);
		}
	}
	updatePossibles();
}

function updatePossibles() {
	if (Game.craft_possibles.length != 0) {
		$('.craft-possibles').html(Game.craft_possibles.map(getSpantab));
	}
	else {
		$('.craft-possibles').html('<div>dust</div>');
	}
}

function getSpantab(x) {
	var full_item =
		'<div class="spantab">'+
		'<span class="thumb '+Item[x].id+'"></span> '+
		'<span class="item-name">'+Item[x].name+'</span>'+
		'</div>';
	return full_item;
}

//sloppy i know.

function getEnemySpantab(x) {
	var full_item =
		'<div class="spantab nothumb">'+
		'<span class="item-name">'+Enemy[x].name+'</span>'+
		'</div>';
	return full_item;
}









/* interaction      */

function addOre(item_name) {
	var avail = Game.mine.findIndex(check_avail);
	if (avail >= 0) {
		Game.mine.splice(avail, 1, Item[item_name]);
		updateMine();
	}
	else {
		log("You don't have enough space in your foragebox to find anything else!");
	}
}

function check_avail(check) {
	return check == "";
}

function removeItem(item_name, amount) {
	for (i = 0; i < Game.inv.length; i++) {
		if (Game.inv[i].id == item_name) {

			var item_amount = Game.inv[i].amount;

			if (amount < item_amount) { //just makes sure nothing more than the chosen item type is removed
				item_amount = amount;
			}

			Game.inv.splice(i, item_amount);

			break;

		}
	}
	updateItems();
}

function checkForItem(item_name) {
	var check;
	for (i = 0; i < Game.inv.length; i++) {
		if (Game.inv[i].id == item_name) {
			check = true;
			break;
		}
	}
	check = check ? check : false;
	return check;
}

function devMode() {
	//ah sneaky are ya? use this to unlock all fast travel and makes foraging+exploring instant.
	for (i = 0; i < World.tiles.length; i++) {
		World[World.tiles[i]].progress = World[World.tiles[i]].total;
	}
	updateMap();
	Game.base_cart = 0;
	Game.base_explore = 0;
}

function halfDevMode() {
	Game.base_cart = 0;
	Game.base_explore = 0;
}

function toggleMode() {
	if (Game.mode == "darkmode") {
		Game.mode = "lightmode";
	}
	else if (Game.mode == "lightmode") {
		Game.mode = "darkmode";
	}
	updateMode();
}

function updateMode() {
	if (Game.mode == "darkmode") {
		$('body').removeClass("lm");
		$('.mode-btn').text("Lights On");
	}
	else if (Game.mode == "lightmode") {
		$('body').addClass("lm");
		$('.mode-btn').text("Lights Off");
	}
}

function toggleOptions() {
	$('.options').animate({width:'toggle'},350);
}

function mapToggle() {
	$('body').toggleClass('iso');
}

function stackToggle() {
	$('body').toggleClass('no-stacks');
}

function clearLog() {
	$('.log').html('');
	log('Your mind clears.');
}

function log(text, color) {
	var chosen = '';
	switch(color) {
		case 'red':
			chosen = 'red-color';
			break;
		case 'blue':
			chosen = 'blue-color';
			break;
		case 'yellow':
			chosen = 'yellow-color';
			break;
		case 'green':
			chosen = 'green-color';
			break;
		default:
			chosen = '';
	}

	function calcTime(date) {
		var hours = date.getHours();
		var minutes = date.getMinutes();
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
		var strTime = '[' + hours + ':' + minutes + ']';
		return strTime;
	}

	var time = calcTime(new Date);

	if ($('.log .note:first-of-type .words').html() == text) {
		$('.log .note').first().remove();
		Game.log_repeat++;
		$('.log').prepend('<div class="note animate '+chosen+'"><div class="timestamp">'+time+'</div><div><span class="words">'+text+'</span> <span class="log_repeat">['+Game.log_repeat+']</span></div></div>');
	}
	else {
		$('.log').prepend('<div class="note animate '+chosen+'"><div class="timestamp">'+time+'</div><div><span class="words">'+text+'</span></div></div>');
		Game.log_repeat = 1;
	}

	if ($('.log .note').length > 10) {
		$('.log .note:last-of-type').remove();
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