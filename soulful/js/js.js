


//SOULFUL
//7.01.2022



var disableInput = false;
var seedDisplacement = 0;
var runePageOpen = false;
var runePageKeyDisable = false;
var startscreen = true;
var hellscape = false;
var creativeMode = false;

var SAVE = {
	haveWonOnce: false
}

var GAME = {
	canv: {
		size: 32,
		h: 25
	},
	map: [],
	nextSpot: [],
	RAMmap: [],
	grid: [],
	inv: [],
	selected: '',
	player: {
		x: 1,
		y: 1,
		dir: [0,1],
		targetFar: true,
		facing: 'down',
		RAMx: 0,
		RAMy: 0,
		damage: 1,
		strength: 1,
		hasGun: false,
		scythe: {
			hasReturn: false,
			hasPierce: false,
			hasFinder: false,
			skin: 0,
			internalTick: 9,
			internalMax: 10
		}
	},
	day: 0,
	showDir: false,
	nighttime: false,
	rx: 12,
	speed: 800,
	kills: 0,
	itemsCollected: 0,
	money: 0,
	lives: 0,
	maxLives: 0,
	chanceOf: {
		domerSpawn: 0, //by default resource stations cannot spawn in the first zone, or the zone directly after they just spawned
		spireSpawn: 0, // " "
		domerSpawnInc: 0.08, //8% increase in the chance of finding a resource station each zone
		spireSpawnInc: 0.08, // " "

		monsterSpawn: 0.01, //0.01
		lootSpawn: 0.05,
		enemyBalks: 0.05, //5% chance that the stronger enemies will pause for a turn, to elimate softlocks
		collectSpawn: 0.03,
		lootDropHeart: 0.01,
		enemyDropHeart: 0.05
	},
	power: '',
	weapon: 'fists',
	weaponMatrix: [],
	inRoom: false,
	roomNumber: 0,
	darkRooms: ['cave','stump','small','tower'],
	rune: {
		belt: [],
		bag: []
	},
	recipes: {
		used: [],
		holding: []
	},
	///////////////////////////////////////////////////////////////////
	zone: 0, //CHANGE ZONE HERE
	///////////////////////////////////////////////////////////////////
	tick: -1,
	difficulty: 'medi',
	bossPhase: 0,
	isBossDead: false,
	fightingBoss: false
}

var ROOM = {
	cave: {
		spawnLocation: 3
	},
	tower: {
		spawnLocation: 3
	},
	tower_level2: {
		spawnLocation: 3
	},
	domer: {
		spawnLocation: 7
	},
	spire: {
		spawnLocation: 7
	},
	small: {
		spawnLocation: 7
	},
	stump: {
		spawnLocation: 13
	}
}

var THE_RIVER = [					  //tower?  shops?  SHOPS.
/*0*/	riverTile(['cliffs'],			false,	false,	false, 	{light: [], dense: [], river: []}),
/*1*/	riverTile(['scary'],			false,	false,	false, 	{light: [], dense: [], river: []}),
/*2*/	riverTile([],					false,	true,	false, 	{light: ['smarg'], dense: ['derva','trull'], river: ['rixen']}),
/*3*/	riverTile([],					false,	true,	false, 	{light: ['smarg'], dense: ['derva','trull'], river: ['rixen']}),
/*4*/	riverTile([],					false,	true,	false, 	{light: ['smarg'], dense: ['derva','trull'], river: ['rixen']}),
/*5*/	riverTile([],					true,	true,	false, 	{light: ['smarg'], dense: ['derva','trull'], river: ['rixen']}),
/*6*/	riverTile([],					false,	true,	false, 	{light: ['smarg'], dense: ['derva','trull'], river: ['rixen']}),
/*7*/	riverTile([],					false,	true,	false, 	{light: ['smarg'], dense: ['derva','trull'], river: ['rixen']}),
/*8*/	riverTile([],					false,	true,	false, 	{light: ['smarg'], dense: ['derva','trull'], river: ['rixen']}),
/*9*/	riverTile([],					true,	true,	false, 	{light: ['smarg'], dense: ['derva','trull'], river: ['rixen']}),
/*10*/	riverTile([],					false,	true,	true, 	{light: ['smarg'], dense: ['derva','trull'], river: ['rixen']}),
/*11*/	riverTile(['clearing','boss'],	false,	false,	false, 	{light: [], dense: [], river: []}),
/*12*/	riverTile(['beach'],			false,	false,	false, 	{light: [], dense: [], river: []}),
/*13*/	riverTile(['ocean'],			false,	false,	false, 	{light: [], dense: [], river: []}),
/*14*/	riverTile(['tundra','shore'],	false,	false,	false, 	{light: [], dense: [], river: []}),
/*15*/	riverTile(['tundra'],			false,	true,	false, 	{light: ['psymo','psyko'], dense: ['ixtix','arko'], river: []}),
/*16*/	riverTile(['tundra'],			false,	true,	false, 	{light: ['psymo','psyko'], dense: ['ixtix','arko'], river: []}),
/*17*/	riverTile(['tundra'],			false,	true,	false, 	{light: ['psymo','psyko'], dense: ['ixtix','arko'], river: []}),
/*18*/	riverTile(['tundra'],			true,	true,	false, 	{light: ['psymo','psyko'], dense: ['ixtix','arko'], river: []}),
/*19*/	riverTile(['tundra'],			false,	true,	false, 	{light: ['psymo','psyko'], dense: ['ixtix','arko'], river: []}),
/*20*/	riverTile(['tundra'],			false,	true,	false, 	{light: ['psymo','psyko'], dense: ['ixtix','arko'], river: []}),
/*21*/	riverTile(['tundra'],			false,	true,	false, 	{light: ['psymo','psyko'], dense: ['ixtix','arko'], river: []}),
/*22*/	riverTile(['tundra'],			true,	true,	false, 	{light: ['psymo','psyko'], dense: ['ixtix','arko'], river: []}),
/*23*/	riverTile(['tundra'],			false,	true,	true, 	{light: ['psymo','psyko'], dense: ['ixtix','arko'], river: []}),
/*24*/	riverTile(['gungenthor','boss'],false,	false,	false, 	{light: [], dense: [], river: []}),
/*25*/	riverTile(['cliffs'],			false,	false,	false, 	{light: [], dense: [], river: []})
]

function riverTile(
	description,
	spawnTower,
	allowShops,
	forceShops,
	enemyArr
) {
	return {
		description: description,
		spawnTower: spawnTower,
		allowShops: allowShops,
		forceShops: forceShops,
		enemyArr: enemyArr
	}
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
	undergrowth: ['grass_1','grass_2','herb_3'],
	weeds: ['grass_1','grass_2','herb_3','weeds_1','weeds_2'],
	ocean: ['ocean_1','ocean_2','ocean_3'],
	barren: ['ground'],
	lootBoxes: ['crate_1','vase_1','barrel_1','chest_1'],
	sand: ['sand_1','sand_2','pebbles','ground'],
	cliff: ['cliff_1','cliff_2'],
	rubble: ['rubble_1','rubble_2','rubble_3','rubble_4'],
	cave: ['drip_1','drip_2','drip_3','grass_1','grass_2','herb_3'],
	drip: ['drip_1','drip_2','drip_3'],
	tower: ['pot_1','pot_2'],
	lava: ['lava_1','lava_2','rocks_3','rocks_4'],
	grass: ['grass_1','grass_2'],
	flowers: ['flowers_1','flowers_2'],
	rockwall: ['rockwall_1','rockwall_2'],
	leaves: ['leaves_1','leaves_2'],
	treewall: ['treewall_1', 'treewall_2'],
	stump: ['grass_1','grass_2','herb_3'],
	river: ['river'],

	//trees: ['treetest'],
	trees_and_rocks: ['tree_1','tree_2','tree_3','tree_4','tree_5','tree_6','tree_7','rocks_1','rocks_2','rocks_3','rocks_4'],
	trees: ['tree_1','tree_2','tree_3','tree_4','tree_5','tree_6','tree_7'],
	rocks: ['rocks_1','rocks_2','rocks_3','rocks_4'],
	dense: ['herb_3','pebbles','weeds_1','weeds_2'],
	light: ['grass_1','grass_2','ground','ground'],
	middle: ['ground'],

	talltrees: 	['trunk_3','trunk_2','crown_1','crown_2','crown_3','crown_4'],
	falltrees: 	['falltree_1','falltree_2','falltree_3','falltree_4'],
	bushes: 	['bush_1','bush_2','bush_3','bush_4'],
	falldense: 	['herb_3','pebbles','flowers_1','flowers_2'],
	falllight: 	['grass_1','grass_2','duff_1','duff_2','ground','ground','ground','ground'],
	boulder: ['boulder_1','boulder_2'],

	desert: [
		'cactus_1','cactus_2','sand_1','sand_2','bones_1','bones_2','bones_3','bones_4',
		'ground','ground','ground','ground','ground','ground','ground','ground',
		'ground','ground','ground','ground','ground','ground','ground','ground'
	],

	house: ['table','nightstand','bed','bookshelf','clothes','rug_1','rug_2'],

	domer: [ //50% chance of lootbox
		'crate_1','vase_1','barrel_1','chest_1',
		'crate_2','vase_2','barrel_2','chest_2'
	],
	spire: [ //40% chance of craftable
		'twig', 	'bark', 	'feather', 	'leaf', 	'dandelion', 	'cornflower', 	'berries', 	'branch',
		'pot_1', 	'pot_1', 	'pot_1', 	'pot_1', 	'pot_2', 		'pot_2', 		'pot_2', 	'pot_2',
		'pot_1', 	'pot_1', 	'pot_1', 	'pot_1'
	],

	clearing: ['rocks_1','rocks_2','grass_1','grass_2','tree_1','tree_2','tree_3','tree_4'],

	treasure: ['coin_1','coin_2','coin_3','coin_4','coin_5','coin_6','coin_7','coin_8'],
	enemies: ['smarg','rixen','derva','trull'],
	collectables: ['twig', 'bark', 'feather', 'leaf', 'dandelion', 'cornflower', 'berries', 'branch'],
	runes: ['agi','crt','hp','lck','pce','str','vit'],
	weapons: ['fists','dagger','mace','sword','flail','staff','whip','scythe'],
	dungeons: ['cave','stump','small'],

	bones: ['bones_1','bones_2','bones_3','bones_4'],
	people: ['farmer','goalie','kiddo'],
	heaven: ['herb_3','flowers_1','flowers_2','river'],

	peopleTalk: [
"<...>",
	],

	creativeItems: [
'tree_1',
'tree_2',
'tree_3',
'tree_4',
'tree_5',
'tree_6',
'tree_7',
'sapling',
'stump', 
'rocks_1',
'rocks_2',
'rocks_3',
'rocks_4',
'pebbles',
'bush',
'herb_1',
'herb_2',
'herb_3',
'herb_4',
'flowers',
'flowers_1',
'flowers_2',
'weeds_1',
'weeds_2',
'grass_1',
'grass_2',
'path_vert',
'path_horz',
'path_cent',
'twig',
'bark',
'feather',
'leaf',
'dandelion',
'cornflower',
'berries',
'branch',
'river',
'river_vert', 
'bridge',
'leaves_1',
'leaves_2',
'rockwall_1',
'rockwall_2',
'crate_1',
'vase_1',
'barrel_1',
'chest_1',
'grave_1',
'bloodgrave', 
'watergrave',
'greengrave',
'stonegrave',
'ocean_1',
'ocean_2',
'ocean_3',
'wave',
'house',
'market',
'shopkeep',
'farmer',
'goalie',
'kiddo',
'sow',
'hole',
'crop',
'torchpole',
'carcass',
'drip_1',
'drip_2',
'drip_3',
'crystal_1',
'crystal_2',
'crystal_3',
'door',
'wall_2',
'wall_3',
'towerwall',
'domerwall',
'spirewall',
'pot_1',
'pot_2',
'table',
'bed',
'rug_1',
'rug_2',
'lava_1',
'lava_2',
'firepit',
'sand_1',
'sand_2',
'mud',
'dust'
	]
}

var TILE = {
	test: 		{ sx: 4, sy: 6, block: false, colour: 'logcabin' },
	treetest: 	{ sx: 12, sy: 15, block: false, colour: 'green' },
	blank: 		{ sx: 5, sy: 7, block: false },
	barrier: 	{ sx: 0, sy: 0, block: true, colour: 'black' },
	invisidoor: { sx: 6, sy: 7, block: false, isDoor: true },
	tree_1:		{ sx: 0, sy: 0, block: true, colour: 'green', name: 'pine tree', drops: [{n:'leaves',c:1,mi:1,ma:2},{n:'acorn',c:1,mi:1,ma:2}], change: 'stump', },
	tree_2:		{ sx: 1, sy: 0, block: true, colour: 'green', name: 'willow tree', drops: [{n:'leaves',c:1,mi:1,ma:1},{n:'acorn',c:1,mi:1,ma:2}], change: 'stump', },
	tree_3:		{ sx: 2, sy: 0, block: true, colour: 'green', name: 'oak tree', drops: [{n:'leaves',c:1,mi:1,ma:3},{n:'acorn',c:1,mi:1,ma:2}], change: 'stump', },
	tree_4:		{ sx: 3, sy: 0, block: true, colour: 'green', name: 'palm tree', drops: [{n:'leaves',c:1,mi:1,ma:3},{n:'acorn',c:1,mi:1,ma:2}], change: 'stump', },
	tree_5:		{ sx: 1, sy: 11, block: true, colour: 'green', name: 'maple tree', drops: [{n:'leaves',c:1,mi:1,ma:3},{n:'acorn',c:1,mi:1,ma:2}], change: 'stump', },
	tree_6:		{ sx: 2, sy: 11, block: true, colour: 'green', name: 'spruce tree', drops: [{n:'leaves',c:1,mi:1,ma:3},{n:'acorn',c:1,mi:1,ma:2}], change: 'stump', },
	tree_7:		{ sx: 3, sy: 11, block: true, colour: 'green', name: 'eucalyptus', drops: [{n:'leaves',c:1,mi:1,ma:3},{n:'acorn',c:1,mi:1,ma:2}], change: 'stump', },
	acorn:		{ sx: 10, sy: 13, colour: 'logcabin' },
	sapling:	{ sx: 10, sy: 12, block: true, colour: 'green', name: 'sapling', drops: [{n:'acorn',c:0.5,mi:1,ma:1}], change: 'ground' },
	stump:		{ sx: 6, sy: 15, block: true, colour: 'green', name: 'tree stump', drops: [], change: 'ground' },
	cave:		{ sx: 0, sy: 3, block: false, colour: 'desert' },
	cave_clsd: 	{ sx: 0, sy: 6, block: true, colour: 'desert' },
	rocks_1: 	{ sx: 4, sy: 0, block: true, colour: 'desert', name: 'boulder', drops: [{n:'rockwall',c:1,mi:2,ma:3}], change: 'rocks_2' },
	rocks_2: 	{ sx: 7, sy: 0, block: true, colour: 'desert', name: 'gibber', drops: [{n:'rockwall',c:1,mi:1,ma:2}], change: 'pebbles' },
	rocks_3: 	{ sx: 6, sy: 9, block: true, colour: 'desert', name: 'rocks', drops: [{n:'rockwall',c:1,mi:2,ma:3}], change: 'pebbles' },
	rocks_4: 	{ sx: 7, sy: 9, block: true, colour: 'desert', name: 'stones', drops: [{n:'rockwall',c:1,mi:1,ma:2}], change: 'pebbles' },
	pebbles: 	{ sx: 0, sy: 11, block: false, colour: 'sand', name: 'pebbles', drops: [{n:'rockwall',c:0.5,mi:1,ma:1}], change: 'ground' },
	bush: 		{ sx: 6, sy: 0, block: true, colour: 'foliage' },
	ground:		{ sx: 6, sy: 7, block: false, name: 'ground' },
	herb_1: 	{ sx: 0, sy: 2, block: false, colour: 'foliage', name: 'dandelion', drops: [{n:'flowers',c:1,mi:1,ma:1}], change: 'ground' },
	herb_2: 	{ sx: 1, sy: 2, block: false, colour: 'foliage', name: 'cornflower', drops: [{n:'flowers',c:1,mi:1,ma:1}], change: 'ground' },
	herb_3: 	{ sx: 2, sy: 2, block: false, colour: 'foliage', name: 'bloomflower', drops: [{n:'flowers',c:1,mi:1,ma:1}], change: 'ground' },
	herb_4: 	{ sx: 3, sy: 2, block: false, colour: 'foliage', name: 'jute', drops: [{n:'flowers',c:1,mi:1,ma:1}], change: 'ground' },
	flowers: 	{ sx: 6, sy: 3, block: false, colour: 'flowers', drops: [], change: 'ground' },
	flowers_1: 	{ sx: 6, sy: 3, block: false, colour: 'flowers', drops: [], change: 'ground' },
	flowers_2: 	{ sx: 7, sy: 3, block: false, colour: 'flowers', drops: [], change: 'ground' },
	weeds_1: 	{ sx: 6, sy: 3, block: false, colour: 'foliage', drops: [], change: 'ground' },
	weeds_2: 	{ sx: 7, sy: 3, block: false, colour: 'foliage', drops: [], change: 'ground' },
	grass_1: 	{ sx: 1, sy: 6, block: false, colour: 'foliage', name: 'grass', drops: [{n:'grass_1',c:1,mi:1,ma:1}], change: 'ground' },
	grass_2: 	{ sx: 2, sy: 6, block: false, colour: 'foliage', name: 'grass', drops: [{n:'grass_1',c:1,mi:1,ma:1}], change: 'ground' },
	path_vert: 	{ sx: 4, sy: 1, block: false, colour: 'desert' },
	path_horz: 	{ sx: 5, sy: 1, block: false, colour: 'desert' },
	path_cent: 	{ sx: 6, sy: 1, block: false, colour: 'desert' },
	twig: 		{ sx: 0, sy: 5, block: false, colour: 'shiny' },
	bark: 		{ sx: 1, sy: 5, block: false, colour: 'shiny' },
	leaf: 		{ sx: 2, sy: 5, block: false, colour: 'shiny' },
	stone: 		{ sx: 3, sy: 5, block: false, colour: 'shiny' },
	daffodil: 	{ sx: 4, sy: 5, block: false, colour: 'shiny' },
	cornflower: { sx: 5, sy: 5, block: false, colour: 'shiny' },
	berries: 	{ sx: 6, sy: 5, block: false, colour: 'shiny' },
	branch: 	{ sx: 7, sy: 5, block: false, colour: 'shiny' },
	river: 		{ sx: 3, sy: 6, block: false, colour: 'blue', name: 'river',
				  desc: "Many enemies cannot detect you in water." },
	river_vert: { sx: 0, sy: 14, block: true, colour: 'blue', name: 'waterfall',
				  desc: "I wonder where the river goes...?" },
	bridge: 	{ sx: 5, sy: 6, block: false, colour: 'desert', drops: [{n:'bridge',c:1,mi:1,ma:1}], change: 'ground' },
	leaves: 	{ sx: 8, sy: 13, block: false, colour: 'foliage', drops: [{n:'leaves',c:1,mi:1,ma:1}], change: 'ground' },
	leaves_1: 	{ sx: 8, sy: 13, block: false, colour: 'foliage', drops: [{n:'leaves',c:1,mi:1,ma:1}], change: 'ground' },
	leaves_2: 	{ sx: 9, sy: 13, block: false, colour: 'foliage', drops: [{n:'leaves',c:1,mi:1,ma:1}], change: 'ground' },
	rockwall: 	{ sx: 2, sy: 14, block: true, colour: 'desert', drops: [{n:'rockwall',c:1,mi:1,ma:1}], change: 'ground' },
	rockwall_1: { sx: 2, sy: 14, block: true, colour: 'desert', drops: [{n:'rockwall',c:1,mi:1,ma:1}], change: 'ground' },
	rockwall_2: { sx: 3, sy: 14, block: true, colour: 'desert', drops: [{n:'rockwall',c:1,mi:1,ma:1}], change: 'ground' },
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
	bloodgrave: { sx: 5, sy: 3, block: true, colour: 'bloody', name: 'bloody grave', drops: [{n:'bloodgrave',c:1,mi:1,ma:1}], change: 'ground',
				  desc: "The gory grave of a dead monster." },
	watergrave: { sx: 5, sy: 3, block: true, colour: 'blue', name: 'watery grave', drops: [{n:'watergrave',c:1,mi:1,ma:1}], change: 'river',
				  desc: "The watery grave of a dead monster." },
	greengrave: { sx: 10, sy: 11, block: true, colour: 'green', name: 'greenish grave', drops: [{n:'greengrave',c:1,mi:1,ma:1}], change: 'grass_1',
				  desc: "The greenish grave of a dead monster." },
	stonegrave: { sx: 11, sy: 11, block: true, colour: 'sand', name: 'stone grave', drops: [{n:'stonegrave',c:1,mi:1,ma:1}], change: 'pebbles',
				  desc: "The stony grave of a dead monster." },
	npc_1: 		{ sx: 4, sy: 2, block: true, colour: 'grey' },
	portal: 	{ sx: 2, sy: 3, block: false, colour: 'blue' },
	ocean_1: 	{ sx: 8, sy: 8, block: true, colour: 'blue' },
	ocean_2: 	{ sx: 9, sy: 8, block: true, colour: 'blue' },
	ocean_3: 	{ sx: 10, sy: 8, block: true, colour: 'blue' },
	wave: 		{ sx: 11, sy: 8, block: false, colour: 'blue' },
	forcefield: { sx: 1, sy: 7, block: false, colour: 'blue' },
	house: 		{ sx: 1, sy: 3, block: true, colour: 'shiny' },
	scythe: 	{ sx: 3, sy: 4, block: false, colour: 'shiny' },
	market: 	{ sx: 3, sy: 3, block: true, colour: 'shiny' },
	shopkeep: 	{ sx: 4, sy: 2, block: true, colour: 'white', isSecret: true },
	farmer: 	{ sx: 5, sy: 2, block: true, colour: 'white', isSecret: true },
	goalie: 	{ sx: 6, sy: 2, block: true, colour: 'white', isSecret: true },
	kiddo: 		{ sx: 7, sy: 2, block: true, colour: 'white', isSecret: true },
	sow: 		{ sx: 1, sy: 7, block: false, colour: 'desert', drops: [], change: 'ground'  },
	hole: 		{ sx: 2, sy: 3, block: true, colour: 'desert', drops: [], change: 'ground' },
	crop: 		{ sx: 2, sy: 2, block: false, colour: 'flowers' },
	torchpole: 	{ sx: 4, sy: 11, block: true, colour: 'grey' },
	wall: 		{ sx: 3, sy: 10, block: true, colour: 'grey' },
	carcass: 	{ sx: 5, sy: 11, block: false, colour: 'bloody' },
	shop_vert: 	{ sx: 0, sy: 13, block: true, colour: 'shiny' },
	shop_llc: 	{ sx: 1, sy: 13, block: true, colour: 'shiny' },
	shop_horz: 	{ sx: 2, sy: 13, block: true, colour: 'shiny' },
	shop_lrc: 	{ sx: 3, sy: 13, block: true, colour: 'shiny' },
	shop_ulc: 	{ sx: 4, sy: 13, block: true, colour: 'shiny' },
	shop_urc: 	{ sx: 5, sy: 13, block: true, colour: 'shiny' },
	rubble_1: 	{ sx: 0, sy: 15, block: true, colour: 'logcabin' },
	rubble_2: 	{ sx: 1, sy: 15, block: true, colour: 'logcabin' },
	rubble_3: 	{ sx: 2, sy: 15, block: true, colour: 'logcabin' },
	rubble_4: 	{ sx: 3, sy: 15, block: true, colour: 'logcabin' },
	cliff_1: 	{ sx: 2, sy: 14, block: true, colour: 'logcabin' },
	cliff_2: 	{ sx: 3, sy: 14, block: true, colour: 'logcabin' },
	cliff_l: 	{ sx: 5, sy: 14, block: true, colour: 'logcabin' },
	cliff_r: 	{ sx: 6, sy: 14, block: true, colour: 'logcabin' },
	cliff_t: 	{ sx: 7, sy: 14, block: true, colour: 'logcabin' },
	cliff_door: { sx: 2, sy: 14, block: false, colour: 'logcabin', isDoor: true },
	ladder: 	{ sx: 4, sy: 15, block: false, colour: 'sand', isDoor: true },
	drip_1: 	{ sx: 13, sy: 9, block: true, colour: 'logcabin' },
	drip_2: 	{ sx: 14, sy: 9, block: true, colour: 'logcabin' },
	drip_3: 	{ sx: 15, sy: 9, block: true, colour: 'logcabin' },
	crystal_1: 	{ sx: 13, sy: 10, block: true, colour: 'flowers' },
	crystal_2: 	{ sx: 14, sy: 10, block: true, colour: 'flowers' },
	crystal_3: 	{ sx: 15, sy: 10, block: true, colour: 'flowers' },

	house_ul: 	{ sx: 8, sy: 0, block: true, colour: 'logcabin' },
	house_ur: 	{ sx: 9, sy: 0, block: true, colour: 'logcabin' },
	house_ll: 	{ sx: 8, sy: 1, block: true, colour: 'logcabin' },
	house_lr: 	{ sx: 9, sy: 1, block: false, colour: 'logcabin', isDoor: true, name: 'door',
				  desc: "Walk inside?" },

	house_2_ul: { sx: 12, sy: 0, block: true, colour: 'logcabin' },
	house_2_ur: { sx: 13, sy: 0, block: true, colour: 'logcabin' },
	house_2_ll: { sx: 12, sy: 1, block: true, colour: 'logcabin' },
	house_2_lr: { sx: 13, sy: 1, block: false, colour: 'logcabin', isDoor: true, name: 'door',
				  desc: "Walk inside?" },

	house_3_ul: { sx: 14, sy: 0, block: true, colour: 'logcabin' },
	house_3_ur: { sx: 15, sy: 0, block: true, colour: 'logcabin' },
	house_3_ll: { sx: 14, sy: 1, block: false, colour: 'logcabin', isDoor: true, name: 'door',
				  desc: "Walk inside?" },
	house_3_lr: { sx: 15, sy: 1, block: true, colour: 'logcabin' },

	hut_ul: 	{ sx: 8, sy: 2, block: true, colour: 'sand' },
	hut_ur: 	{ sx: 9, sy: 2, block: true, colour: 'sand' },
	hut_ll: 	{ sx: 8, sy: 3, block: true, colour: 'sand' },
	hut_lr: 	{ sx: 9, sy: 3, block: true, colour: 'sand' },

	tower_00: 	{ sx: 0+8, sy: 0+4, block: true, colour: 'sand' },
	tower_10: 	{ sx: 1+8, sy: 0+4, block: true, colour: 'sand' },
	tower_20: 	{ sx: 2+8, sy: 0+4, block: true, colour: 'sand' },
	tower_30: 	{ sx: 3+8, sy: 0+4, block: true, colour: 'sand' },
	tower_40: 	{ sx: 4+8, sy: 0+4, block: true, colour: 'sand' },
	tower_01: 	{ sx: 0+8, sy: 1+4, block: true, colour: 'sand' },
	tower_11: 	{ sx: 1+8, sy: 1+4, block: true, colour: 'sand' },
	tower_21: 	{ sx: 2+8, sy: 1+4, block: true, colour: 'sand' },
	tower_31: 	{ sx: 3+8, sy: 1+4, block: true, colour: 'sand' },
	tower_41: 	{ sx: 4+8, sy: 1+4, block: true, colour: 'sand' },
	tower_02: 	{ sx: 0+8, sy: 2+4, block: true, colour: 'sand' },
	tower_12: 	{ sx: 1+8, sy: 2+4, block: true, colour: 'sand' },
	tower_22: 	{ sx: 2+8, sy: 2+4, block: true, colour: 'sand' },
	tower_32: 	{ sx: 3+8, sy: 2+4, block: true, colour: 'sand' },
	tower_42: 	{ sx: 4+8, sy: 2+4, block: true, colour: 'sand' },
	tower_03: 	{ sx: 0+8, sy: 3+4, block: true, colour: 'sand' },
	tower_13: 	{ sx: 1+8, sy: 3+4, block: true, colour: 'sand' },
	tower_23: 	{ sx: 2+8, sy: 3+4, block: false, colour: 'sand', isDoor: true },
	tower_33: 	{ sx: 3+8, sy: 3+4, block: true, colour: 'sand' },
	tower_43: 	{ sx: 4+8, sy: 3+4, block: true, colour: 'sand' },

	domer_00: 	{ sx: 0+13, sy: 0+4, block: true, colour: 'pinky' },
	domer_10: 	{ sx: 1+13, sy: 0+4, block: true, colour: 'pinky' },
	domer_20: 	{ sx: 2+13, sy: 0+4, block: true, colour: 'pinky' },
	domer_01: 	{ sx: 0+13, sy: 1+4, block: true, colour: 'pinky' },
	domer_11: 	{ sx: 1+13, sy: 1+4, block: true, colour: 'pinky' },
	domer_21: 	{ sx: 2+13, sy: 1+4, block: true, colour: 'pinky' },
	domer_02: 	{ sx: 0+13, sy: 2+4, block: true, colour: 'pinky' },
	domer_12: 	{ sx: 1+13, sy: 2+4, block: true, colour: 'pinky' },
	domer_22: 	{ sx: 2+13, sy: 2+4, block: true, colour: 'pinky' },
	domer_03: 	{ sx: 0+13, sy: 3+4, block: true, colour: 'pinky' },
	domer_13: 	{ sx: 1+13, sy: 3+4, block: false, colour: 'pinky', isDoor: true },
	domer_23: 	{ sx: 2+13, sy: 3+4, block: true, colour: 'pinky' },

	spire_00: 	{ sx: 0+13, sy: 0+12, block: true, colour: 'blurple' },
	spire_10: 	{ sx: 1+13, sy: 0+12, block: true, colour: 'blurple' },
	spire_20: 	{ sx: 2+13, sy: 0+12, block: true, colour: 'blurple' },
	spire_01: 	{ sx: 0+13, sy: 1+12, block: true, colour: 'blurple' },
	spire_11: 	{ sx: 1+13, sy: 1+12, block: true, colour: 'blurple' },
	spire_21: 	{ sx: 2+13, sy: 1+12, block: true, colour: 'blurple' },
	spire_02: 	{ sx: 0+13, sy: 2+12, block: true, colour: 'blurple' },
	spire_12: 	{ sx: 1+13, sy: 2+12, block: true, colour: 'blurple' },
	spire_22: 	{ sx: 2+13, sy: 2+12, block: true, colour: 'blurple' },
	spire_03: 	{ sx: 0+13, sy: 3+12, block: true, colour: 'blurple' },
	spire_13: 	{ sx: 1+13, sy: 3+12, block: true, colour: 'blurple' },
	spire_23: 	{ sx: 2+13, sy: 3+12, block: true, colour: 'blurple' },
	spire_04: 	{ sx: 0+13, sy: 4+12, block: true, colour: 'blurple' },
	spire_14: 	{ sx: 1+13, sy: 4+12, block: false, colour: 'blurple', isDoor: true },
	spire_24: 	{ sx: 2+13, sy: 4+12, block: true, colour: 'blurple' },

	scary_00: 	{ sx: 0+13, sy: 0+17, block: true, colour: 'pinky' },
	scary_10: 	{ sx: 1+13, sy: 0+17, block: true, colour: 'pinky' },
	scary_20: 	{ sx: 2+13, sy: 0+17, block: true, colour: 'pinky' },
	scary_01: 	{ sx: 0+13, sy: 1+17, block: true, colour: 'pinky' },
	scary_11: 	{ sx: 1+13, sy: 1+17, block: false, colour: 'pinky', isDoor: true },
	scary_21: 	{ sx: 2+13, sy: 1+17, block: true, colour: 'pinky' },

	stump_00: 	{ sx: 0+13, sy: 0+2, block: true, colour: 'logcabin' },
	stump_10: 	{ sx: 1+13, sy: 0+2, block: true, colour: 'logcabin' },
	stump_20: 	{ sx: 2+13, sy: 0+2, block: true, colour: 'logcabin' },
	stump_01: 	{ sx: 0+13, sy: 1+2, block: true, colour: 'logcabin' },
	stump_11: 	{ sx: 1+13, sy: 1+2, block: false, colour: 'logcabin', isDoor: true },
	stump_21: 	{ sx: 2+13, sy: 1+2, block: true, colour: 'logcabin' },

	small_00: 	{ sx: 0+10, sy: 0+2, block: true, colour: 'sand' },
	small_10: 	{ sx: 1+10, sy: 0+2, block: true, colour: 'sand' },
	small_20: 	{ sx: 2+10, sy: 0+2, block: true, colour: 'sand' },
	small_01: 	{ sx: 0+10, sy: 1+2, block: true, colour: 'sand' },
	small_11: 	{ sx: 1+10, sy: 1+2, block: false, colour: 'sand', isDoor: true },
	small_21: 	{ sx: 2+10, sy: 1+2, block: true, colour: 'sand' },

	door: 		{ sx: 0, sy: 16, block: true, colour: 'orange', drops: [], change: 'door_open' },
	door_open: 	{ sx: 8, sy: 12, block: false, colour: 'orange', drops: [], change: 'door' },
	wall_2: 	{ sx: 1, sy: 16, block: true, colour: 'logcabin' },
	wall_3: 	{ sx: 2, sy: 16, block: true, colour: 'logcabin' },
	towerdoor: 	{ sx: 5, sy: 15, block: false, colour: 'orange', isDoor: true },
	towerwall:  { sx: 3, sy: 10, block: true, colour: 'sand' },
	domerwall:  { sx: 3, sy: 10, block: true, colour: 'pinky' },
	spirewall:  { sx: 3, sy: 10, block: true, colour: 'blurple' },
	pot_1: 		{ sx: 12, sy: 8, block: true, colour: 'grey' },
	pot_2: 		{ sx: 13, sy: 8, block: true, colour: 'grey' },
	table: 		{ sx: 3, sy: 16, block: true, colour: 'grey' },
	nightstand: { sx: 4, sy: 16, block: true, colour: 'grey' },
	bed: 		{ sx: 5, sy: 16, block: true, colour: 'grey' },
	bookshelf: 	{ sx: 4, sy: 17, block: true, colour: 'grey' },
	clothes: 	{ sx: 5, sy: 17, block: true, colour: 'bloody' },
	rug_1: 		{ sx: 6, sy: 17, block: false, colour: 'flowers' },
	rug_2: 		{ sx: 7, sy: 17, block: false, colour: 'flowers' },
	trapdoor: 	{ sx: 7, sy: 11, block: false, colour: 'grey', isDoor: true },
	spikes: 	{ sx: 15, sy: 11, block: false, colour: 'grey' },
	lava_1: 	{ sx: 3, sy: 7, block: true, colour: 'orange' },
	lava_2: 	{ sx: 5, sy: 10, block: true, colour: 'orange' },
	firepit: 	{ sx: 14, sy: 8, block: false, colour: 'orange' },
	birdhouse: 	{ sx: 12, sy: 12, block: true, colour: 'sand' },

	twig: 		{ sx: 0, sy: 5, block: false, colour: 'logcabin', isCollect: true, name: 'twig', drops: [{n:'twig',c:1,mi:1,ma:1}], change: 'ground' },
	bark: 		{ sx: 1, sy: 5, block: false, colour: 'sand', isCollect: true, name: 'bark', drops: [{n:'bark',c:1,mi:1,ma:1}], change: 'ground' },
	feather: 	{ sx: 2, sy: 5, block: false, colour: 'offwhite', isCollect: true, name: 'feather', drops: [{n:'feather',c:1,mi:1,ma:1}], change: 'ground' },
	leaf: 		{ sx: 3, sy: 5, block: false, colour: 'orange', isCollect: true, name: 'leaf', drops: [{n:'leaf',c:1,mi:1,ma:1}], change: 'ground' },
	dandelion: 	{ sx: 4, sy: 5, block: false, colour: 'blurple', isCollect: true, name: 'dandelion', drops: [{n:'dandelion',c:1,mi:1,ma:1}], change: 'ground' },
	cornflower: { sx: 5, sy: 5, block: false, colour: 'blue', isCollect: true, name: 'cornflower', drops: [{n:'cornflower',c:1,mi:1,ma:1}], change: 'ground' },
	berries: 	{ sx: 6, sy: 5, block: false, colour: 'pinky', isCollect: true, name: 'berries', drops: [{n:'berries',c:1,mi:1,ma:1}], change: 'ground' },
	branch: 	{ sx: 7, sy: 5, block: false, colour: 'desert', isCollect: true, name: 'branch', drops: [{n:'branch',c:1,mi:1,ma:1}], change: 'ground' },

	beaker: 	{ sx: 8, sy: 14, block: false, colour: 'blue', drops: [], change: 'ground' },
	flask: 		{ sx: 9, sy: 14, block: false, colour: 'blue', drops: [], change: 'ground' },

	treewall_1: { sx: 7, sy: 15, block: true, colour: 'logcabin' },
	treewall_2: { sx: 8, sy: 15, block: true, colour: 'logcabin' },
	cavedoor: 	{ sx: 9, sy: 15, block: false, colour: 'desert', isDoor: true },

	//the DESERT!
	sand_1: 	{ sx: 6, sy: 6, block: false, colour: 'sand' },
	sand_2: 	{ sx: 7, sy: 6, block: false, colour: 'sand' },
	sand_3: 	{ sx: 8, sy: 8, block: false, colour: 'sand' },
	sand_4: 	{ sx: 9, sy: 8, block: false, colour: 'sand' },
	mud: 		{ sx: 10, sy: 8, block: false, colour: 'desert' },

	dust: 		{ sx: 0, sy: 11, block: false, colour: 'grey', drops: [{n:'dust',c:1,mi:1,ma:1}], change: 'ground' },

	bones_1: 	{ sx: 0, sy: 18, block: false, colour: 'desert', drops: [{n:'dust',c:0.25,mi:1,ma:1}], change: 'ground' },
	bones_2: 	{ sx: 1, sy: 18, block: false, colour: 'desert', drops: [{n:'dust',c:0.25,mi:1,ma:1}], change: 'ground' },
	bones_3: 	{ sx: 2, sy: 18, block: false, colour: 'desert', drops: [{n:'dust',c:0.25,mi:1,ma:1}], change: 'ground' },
	bones_4: 	{ sx: 3, sy: 18, block: false, colour: 'desert', drops: [{n:'dust',c:0.25,mi:1,ma:1}], change: 'ground' },

	trunk_1: 	{ sx: 0, sy: 21, block: true, colour: 'logcabin', drops: [], change: 'deadstump' },
	trunk_2: 	{ sx: 1, sy: 21, block: true, colour: 'logcabin', drops: [], change: 'deadstump' },
	trunk_3: 	{ sx: 2, sy: 21, block: true, colour: 'logcabin', drops: [], change: 'deadstump' },
	trunk_4: 	{ sx: 3, sy: 21, block: true, colour: 'logcabin', drops: [], change: 'deadstump' },
	crown_1: 	{ sx: 0, sy: 20, block: true, colour: 'autumn', drops: [{n:'leaves',c:1,mi:1,ma:3},{n:'acorn',c:1,mi:1,ma:2}], change: 'stump' },
	crown_2: 	{ sx: 1, sy: 20, block: true, colour: 'autumn', drops: [{n:'leaves',c:1,mi:1,ma:3},{n:'acorn',c:1,mi:1,ma:2}], change: 'stump' },
	crown_3: 	{ sx: 2, sy: 20, block: true, colour: 'autumn', drops: [{n:'leaves',c:1,mi:1,ma:3},{n:'acorn',c:1,mi:1,ma:2}], change: 'stump' },
	crown_4: 	{ sx: 3, sy: 20, block: true, colour: 'autumn', drops: [{n:'leaves',c:1,mi:1,ma:3},{n:'acorn',c:1,mi:1,ma:2}], change: 'stump' },
	falltree_1: { sx: 0, sy: 19, block: true, colour: 'green', drops: [{n:'leaves',c:1,mi:1,ma:3},{n:'acorn',c:1,mi:1,ma:2}], change: 'stump' },
	falltree_2: { sx: 1, sy: 19, block: true, colour: 'green', drops: [{n:'leaves',c:1,mi:1,ma:3},{n:'acorn',c:1,mi:1,ma:2}], change: 'stump' },
	falltree_3: { sx: 2, sy: 19, block: true, colour: 'green', drops: [{n:'leaves',c:1,mi:1,ma:3},{n:'acorn',c:1,mi:1,ma:2}], change: 'stump' },
	falltree_4: { sx: 3, sy: 19, block: true, colour: 'green', drops: [{n:'leaves',c:1,mi:1,ma:3},{n:'acorn',c:1,mi:1,ma:2}], change: 'stump' },
	deadstump: 	{ sx: 5, sy: 18, block: true, colour: 'grey', drops: [], change: 'ground' },
	bush_1: 	{ sx: 4, sy: 19, block: true, colour: 'green', drops: [], change: 'grass_1' },
	bush_2: 	{ sx: 5, sy: 19, block: true, colour: 'green', drops: [], change: 'grass_2' },
	bush_3: 	{ sx: 6, sy: 19, block: true, colour: 'green', drops: [], change: 'stump' },
	bush_4: 	{ sx: 7, sy: 19, block: true, colour: 'green', drops: [], change: 'stump' },
	duff_1: 	{ sx: 6, sy: 6, block: false, colour: 'foliage', drops: [], change: 'ground' },
	duff_2: 	{ sx: 7, sy: 6, block: false, colour: 'foliage', drops: [], change: 'ground' },
	boulder_1: 	{ sx: 2, sy: 14, block: true, colour: 'grey' },
	boulder_2: 	{ sx: 3, sy: 14, block: true, colour: 'grey' },

	cactus_1: 	{ sx: 6, sy: 18, block: true, colour: 'green', drops: [{n:'flowers',c:0.75,mi:1,ma:2}], change: 'deadstump' },
	cactus_2: 	{ sx: 7, sy: 18, block: true, colour: 'green', drops: [{n:'flowers',c:0.75,mi:1,ma:2}], change: 'deadstump' },
}

const ENTITY = {
	large_detail: {
		roof: 		{ sx: 0, sy: 16, h: 2, w: 5 },
		domer_roof: { sx: 5, sy: 16, h: 2, w: 3 },
		spire_roof: { sx: 5, sy: 18, h: 3, w: 3 },
		summoning: 	{ sx: 0, sy: 18, h: 3, w: 3 },
		bazzar: 	{ sx: 0, sy: 21, h: 3, w: 3 },
		transmute: 	{ sx: 3, sy: 21, h: 3, w: 5 },
		alchemy: 	{ sx: 8, sy: 16, h: 3, w: 3 },
		stumptop: 	{ sx: 0, sy: 14, h: 1, w: 3 },
		carpet: 	{ sx: 11, sy: 16, h: 3, w: 3 },
		arrows: 	{ sx: 3, sy: 18, h: 3, w: 1 },
		scary_roof: { sx: 8, sy: 24, h: 2, w: 3 }
	},
	detail: {
		spray_0: 	{ sx: 8, sy: 31 },
		spray_1: 	{ sx: 9, sy: 31 },
		spray_2: 	{ sx: 10, sy: 31 },
		spray_3: 	{ sx: 11, sy: 31 },
		shimmer: 	{ sx: 3, sy: 14 }, //BLANK is 3, 14
		grasstop: 	{ sx: 1, sy: 12 },
		doorglow: 	{ sx: 2, sy: 12 },
		shark: 		{ sx: 3, sy: 12 },
		doortop: 	{ sx: 4, sy: 12 },
		domer_door: { sx: 5, sy: 12 },
		spire_door: { sx: 6, sy: 12 },
		g_arrow_r: 	{ sx: 0, sy: 13 },
		g_coins: 	{ sx: 4, sy: 13 },
		g_sword: 	{ sx: 5, sy: 13 },
		g_heart: 	{ sx: 6, sy: 13 },
		g_enemy: 	{ sx: 7, sy: 13 },
		g_bigcoin: 	{ sx: 4, sy: 14 },
		g_fairy: 	{ sx: 5, sy: 14 },
		s_downarr: 	{ sx: 0, sy: 28 },
		s_leftarr: 	{ sx: 1, sy: 28 },
		s_cross: 	{ sx: 2, sy: 28 },
		s_result: 	{ sx: 3, sy: 28 },
		s_cup: 		{ sx: 6, sy: 28 },
		foam_0: 	{ sx: 0, sy: 31 },
		foam_1: 	{ sx: 1, sy: 31 },
		foam_2: 	{ sx: 2, sy: 31 },
		foam_3: 	{ sx: 3, sy: 31 },
		foam_4: 	{ sx: 4, sy: 31 },
		foam_5: 	{ sx: 5, sy: 31 },
		arrow_d: 	{ sx: 5, sy: 30 },
		circle: 	{ sx: 4, sy: 28 },
		scythe: 	{ sx: 2, sy: 25 },
		sign: 		{ sx: 9, sy: 30 },

		dbl_zero: 	{ sx: 8, sy: 28 },
		zero: 		{ sx: 1, sy: 2 },
		one: 		{ sx: 0, sy: 0 },
		two: 		{ sx: 1, sy: 0 },
		three: 		{ sx: 2, sy: 0 },

		left_eye_0: 	{ sx: 8, sy: 23 },
		left_eye_1: 	{ sx: 8, sy: 26 },
		left_eye_2: 	{ sx: 8, sy: 27 },
		right_eye_0: 	{ sx: 10, sy: 23 },
		right_eye_1: 	{ sx: 10, sy: 26 },
		right_eye_2: 	{ sx: 10, sy: 27 },
		lips_0: 		{ sx: 9, sy: 23 },
		lips_1: 		{ sx: 9, sy: 26 },
		lips_2: 		{ sx: 9, sy: 27 }
	},
	enemy: {
		smarg: { sx: 0, sy: 8, attr: {
			name: 'smarg',
			grave: 'bloodgrave',
			maxhp: 1,
			hp: 1
		}},
		rixen: { sx: 1, sy: 8, attr: {
			name: 'rixen',
			grave: 'watergrave',
			maxhp: 1,
			hp: 1
		}},
		derva: { sx: 2, sy: 8, attr: {
			name: 'derva',
			grave: 'greengrave',
			maxhp: 2,
			hp: 2
		}},
		trull: { sx: 3, sy: 8, attr: {
			name: 'trull',
			grave: 'stonegrave',
			maxhp: 3,
			hp: 3
		}},
		xrrow: { sx: 4, sy: 8, attr: {
			name: 'xrrow',
			maxhp: 5,
			hp: 5
		}},
		gyn: { sx: 5, sy: 8, attr: {
			name: 'gyn',
			maxhp: 5,
			hp: 5
		}},
		kong: { sx: 6, sy: 8, attr: {
			name: 'kong',
			maxhp: 5,
			hp: 5
		}},
		rwck: { sx: 7, sy: 8, attr: {
			name: 'rwck',
			maxhp: 2,
			hp: 2
		}},
		pix: { sx: 0, sy: 26, attr: {
			name: 'pix',
			maxhp: 1,
			hp: 1
		}},
		shin: { sx: 1, sy: 26, attr: {
			name: 'shin',
			maxhp: 1,
			hp: 1
		}},
		fefe: { sx: 2, sy: 26, attr: {
			name: 'fefe',
			maxhp: 1,
			hp: 1
		}},
		mulb: { sx: 3, sy: 26, attr: {
			name: 'mulb',
			maxhp: 1,
			hp: 1
		}},
		psymo: { sx: 4, sy: 26, attr: {
			name: 'psymo',
			maxhp: 3,
			hp: 3
		}},
		psyko: { sx: 5, sy: 26, attr: {
			name: 'psyko',
			maxhp: 3,
			hp: 3
		}},
		ixtix: { sx: 6, sy: 26, attr: {
			name: 'ixtix',
			maxhp: 5,
			hp: 5,
			ax: 6,
			ay: 27
		}},
		arko: { sx: 7, sy: 26, attr: {
			name: 'arko',
			maxhp: 5,
			hp: 5,
			ax: 7,
			ay: 27
		}},
		fakerock: { sx: 5, sy: 27, attr: {
			name: 'fakerock',
			grave: 'rocks_4',
			maxhp: 1,
			hp: 1
		}},
		gungenthor: { sx: 9, sy: 23, attr: {
			name: 'gungenthor',
			grave: 'tree_4',
			maxhp: 1,
			hp: 1
		}},
		you: { sx: 7, sy: 29, attr: {
			name: 'you',
			maxhp: 999,
			hp: 999
		}}
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
	},
	heart: {
		full: 	{ sx: 0, sy: 11 },
		half: 	{ sx: 1, sy: 11 },
		more: 	{ sx: 5, sy: 11 }
	},
	item: {
		fists: 		{ sx: 0, sy: 24 },
		dagger: 	{ sx: 1, sy: 24 },
		mace: 		{ sx: 2, sy: 24 },
		sword: 		{ sx: 3, sy: 24 },
		flail: 		{ sx: 4, sy: 24 },
		staff: 		{ sx: 5, sy: 24 },
		whip: 		{ sx: 6, sy: 24 },
		scythe: 	{ sx: 7, sy: 24 },

		metal_detector: { sx: 0, sy: 25 },
		gunslinger: { sx: 3, sy: 14 },

		boomerang: { sx: 12, sy: 30 },
		canonball: { sx: 13, sy: 30 },
		pathmaker: { sx: 14, sy: 30 },

		extraLife: { sx: 5, sy: 11 }
	},
	note: {
		mark: 		{ sx: 7, sy: 28 },
		invis: 		{ sx: 8, sy: 0 }
	},
	trap: {
		spike: 			{ sx: 0, sy: 27 },
		spike_disarmed: { sx: 1, sy: 27 },
		xrrow_shot: 	{ sx: 3, sy: 27 },
		kong_trail: 	{ sx: 4, sy: 27 },
		gyn_fire: 		{ sx: 5, sy: 27 },
		psyko_trap: 	{ sx: 0, sy: 27 },
		psymo_shot: 	{ sx: 2, sy: 27 },

		left_hand_00: 	{ sx: 8, sy: 19 },
		left_hand_10: 	{ sx: 9, sy: 19 },
		left_hand_01: 	{ sx: 8, sy: 20 },
		left_hand_11: 	{ sx: 9, sy: 20 },

		left_foot_00: 	{ sx: 10, sy: 19 },
		left_foot_10: 	{ sx: 11, sy: 19 },
		left_foot_01: 	{ sx: 10, sy: 20 },
		left_foot_11: 	{ sx: 11, sy: 20 },

		right_foot_00: 	{ sx: 12, sy: 19 },
		right_foot_10: 	{ sx: 13, sy: 19 },
		right_foot_01: 	{ sx: 12, sy: 20 },
		right_foot_11: 	{ sx: 13, sy: 20 },

		right_hand_00: 	{ sx: 14, sy: 19 },
		right_hand_10: 	{ sx: 15, sy: 19 },
		right_hand_01: 	{ sx: 14, sy: 20 },
		right_hand_11: 	{ sx: 15, sy: 20 },

		tears: 			{ sx: 11, sy: 23 },
		bigtear: 		{ sx: 12, sy: 23 }
	},
	rune: {
		agi: { sx: 0, sy: 29, attr: {
			id: 0,
			name: 'agi',
			hslBase: 180,
			desc: 'enemies hesitate more'
		}},
		crt: { sx: 1, sy: 29, attr: {
			id: 1,
			name: 'crt',
			hslBase: 240,
			desc: 'increased crit chance'
		}},
		hp: { sx: 2, sy: 29, attr: {
			id: 2,
			name: 'hp',
			hslBase: 340,
			desc: 'higher maximum health'
		}},
		lck: { sx: 3, sy: 29, attr: {
			id: 3,
			name: 'lck',
			hslBase: 150,
			desc: 'you are luckier'
		}},
		pce: { sx: 4, sy: 29, attr: {
			id: 4,
			name: 'pce',
			hslBase: 90,
			desc: 'less enemies, more flowers'
		}},
		str: { sx: 5, sy: 29, attr: {
			id: 5,
			name: 'str',
			hslBase: 40,
			desc: 'push enemies further'
		}},
		vit: { sx: 6, sy: 29, attr: {
			id: 6,
			name: 'vit',
			hslBase: 20,
			desc: 'enemies drop hearts'
		}},
	},
	shopitem: {
		damageup: { sx: 0, sy: 30, attr: {
			cost: 0
		}},
		addrecipe: { sx: 1, sy: 30, attr: {
			cost: 0
		}}
	}
}

var WEAPON = {
	fists: {
		name: 'fists',
		cost: 0,
		arr: [
			[0,0,0],
			[0,0,0],
			[0,1,0]
		]
	},
	dagger: {
		name: 'dagger',
		cost: 200,
		arr: [
			[0,0,0],
			[0,0,0],
			[1,0,1]
		]
	},
	mace: {
		name: 'mace',
		cost: 200,
		arr: [
			[0,0,0],
			[0,0,0],
			[1,1,1]
		]
	},
	sword: {
		name: 'sword',
		cost: 200,
		arr: [
			[0,0,0],
			[1,0,1],
			[0,1,0]
		]
	},
	flail: {
		name: 'flail',
		cost: 200,
		arr: [
			[0,1,0],
			[1,0,1],
			[1,0,1]
		]
	},
	staff: {
		name: 'staff',
		cost: 200,
		arr: [
			[0,1,0],
			[1,0,1],
			[0,1,0]
		]
	},
	whip: {
		name: 'whip',
		cost: 200,
		arr: [
			[1,0,1],
			[0,0,0],
			[1,0,1]
		]
	},
	scythe: {
		name: 'scythe',
		cost: 200,
		arr: [
			[0,0,0],
			[1,0,1],
			[1,1,1]
		]
	}
}

	/*
		0, no combination
		1, agi
		2, crt
		3, hp
		4, lck
		5, pce
		6, str
		7, vit
	*/

var RECIPE = {
	grid: [
		[ 0, 3, 3, 3, 7, 7, 7, 5],
		[ 3, 0, 3, 1, 1, 7, 5, 6],
		[ 3, 3, 0, 1, 1, 5, 6, 6],
		[ 3, 1, 1, 0, 5, 4, 4, 6],
		[ 7, 1, 1, 5, 0, 4, 4, 2],
		[ 7, 7, 5, 4, 4, 0, 2, 2],
		[ 7, 5, 6, 4, 4, 2, 0, 2],
		[ 5, 6, 6, 6, 2, 2, 2, 0]
	]
}




var spritesheet = new Image();
	spritesheet.src = 'images/tiles_outline-export.png'; //tiles.png

var numbers = new Image();
	numbers.src = 'images/numbers-export.png'; //numbers.png

$(window).on('load', function() {

	if (localStorage.getItem('save') !== null) {
		var savegame = JSON.parse(localStorage.getItem("save"));
		SAVE.haveWonOnce = savegame.haveWonOnce;
	}

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");

	var entity_canvas = document.getElementById("entity_canvas"),
		e_ctx = entity_canvas.getContext("2d");

	var night_canvas = document.getElementById("night_canvas"),
		n_ctx = night_canvas.getContext("2d");

	var proj_canvas = document.getElementById("proj_canvas"),
		p_ctx = proj_canvas.getContext("2d");

	var hw = GAME.canv.size*GAME.canv.h;

	canvas.width = canvas.height = hw*3;
	entity_canvas.width = entity_canvas.height = hw*3;
	proj_canvas.width = proj_canvas.height = hw*3;
	night_canvas.width = night_canvas.height = hw*3;

	console.log('canvas size: '+hw+'x'+hw);

	$('#game').css({
		'height':hw+'px',
		'width':hw+'px'
	});

	$('.cnvs').css({
		'top':'-100%',
		'left':'-100%'
	});

	GAME.player.x = Math.floor(GAME.canv.h/2);
	GAME.player.y = Math.floor(GAME.canv.h/2);


	//Sounds via Howler.js
	Howler.volume(0.5);

	var move = new Howl({ src: ['sounds/move.wav'] });
	var coin = new Howl({ src: ['sounds/coin.wav'] });
	var damage = new Howl({ src: ['sounds/damage.wav'] });
	var attack = new Howl({ src: ['sounds/attack.wav'] });
	var note = new Howl({ src: ['sounds/note.wav'] });
	var boss = new Howl({ src: ['sounds/boss.wav'] });
	var fail = new Howl({ src: ['sounds/fail.wav'] });
	var success = new Howl({ src: ['sounds/success.wav'] });
	var open = new Howl({ src: ['sounds/open.wav'] });
	var chop = new Howl({ src: ['sounds/chop.wav'] });
	var door = new Howl({ src: ['sounds/door.wav'] });
	var scythe = new Howl({ src: ['sounds/scythe.wav'] });
	var ominous = new Howl({ src: ['sounds/ominous.wav'] });
	var bossmove = new Howl({ src: ['sounds/bossmove.wav'] });
	var click = new Howl({ src: ['sounds/click.wav'] });

	var music = new Howl({
		src: ['sounds/Komiku.mp3'],
		loop: true,
		volume: 0.5
	});










	class Tile {
		constructor(name, x, y) {
			this.name = name;
			this.colour = getColor(TILE[this.name].colour);
			this.block = TILE[this.name].block;

			this.isFrozenGround = false;

			var hasSecret = false;
			if (TILE[this.name].isSecret != undefined) hasSecret = TILE[this.name].isSecret;
			this.hasSecret = hasSecret;

			var isLoot = false;
			if (TILE[this.name].isLoot != undefined) isLoot = TILE[this.name].isLoot;
			this.isLoot = isLoot;

			var isDoor = false;
			if (TILE[this.name].isDoor != undefined) isDoor = TILE[this.name].isDoor;
			this.isDoor = isDoor;

			var isCollect = false;
			if (TILE[this.name].isCollect != undefined) isCollect = TILE[this.name].isCollect;
			this.isCollect = isCollect;
		}
		sx() {
			return TILE[this.name].sx*64;
		}
		sy() {
			return TILE[this.name].sy*64;
		}
		colDetect(x, y) {
			return !GAME.map.arr[x][y].block;
		}
		collect() {
			//collect entities
			for (let b = 0; b < GAME.map.entities.length; b++) {
				if (GAME.map.entities[b].x == GAME.player.x && GAME.map.entities[b].y == GAME.player.y) {

					if (GAME.map.entities[b].whatIsIt == 'treasure') {
						coin.play();

						GAME.money += GAME.map.entities[b].attr.value;
						updCoins();
						GAME.map.entities.splice(b, 1);
						render(GAME.map, 'mid');
					} else if (GAME.map.entities[b].whatIsIt == 'heart') {
						if (GAME.lives < GAME.maxLives) {
							coin.play();

							GAME.lives += GAME.map.entities[b].attr.value;
							updHealth();
							GAME.map.entities.splice(b, 1);
						}
						render(GAME.map, 'mid');
					} else if (GAME.map.entities[b].whatIsIt == 'item') {
						//buy things
						if (GAME.money >= GAME.map.entities[b].attr.cost) {
							GAME.money -= GAME.map.entities[b].attr.cost;
							
							if (GAME.map.entities[b].attr.name == 'gunslinger') { //if it is the gunslinger pickup
								click.play();
								
								GAME.power = 'gunslinger';
								p_ctx.clearRect(0,0,canvas.width,canvas.height);

								if (GAME.map.entities[b].attr.lifeCost != undefined) { //picking it up from the spire
									for (let a=0; a < GAME.map.entities.length; a++) {
										if (GAME.map.entities[a].attr.name == 'scythe') {
											GAME.map.entities.splice(a, 1);
											break;
										}
									}
									GAME.maxLives -= 2;
									GAME.lives -= 2;
									updHealth();

									GAME.player.hasGun = true;

									if (!GAME.inRoom) { //picking it up outside

										if (GAME.map.arr[GAME.player.x+8][GAME.player.y].name == 'rocks_4') {
											GAME.map.addEntity(
												'enemy',
												GAME.player.x+8,
												GAME.player.y,
												ENTITY.enemy.fakerock.attr
											);
											GAME.map.arr[GAME.player.x+8][GAME.player.y] = new Tile('ground');
										}

										if (GAME.map.arr[GAME.player.x-8][GAME.player.y].name == 'rocks_4') {
											GAME.map.addEntity(
												'enemy',
												GAME.player.x-8,
												GAME.player.y,
												ENTITY.enemy.fakerock.attr
											);
											GAME.map.arr[GAME.player.x-8][GAME.player.y] = new Tile('ground');
										}
									}
								}
							} else if (GAME.map.entities[b].attr.name == 'boomerang') {
								coin.play();

								GAME.player.scythe.hasReturn = true;
								GAME.player.scythe.skin = 1;
								renderEnemies(GAME.map, 'mid', 0, true);

							} else if (GAME.map.entities[b].attr.name == 'canonball') {
								coin.play();

								GAME.player.scythe.hasPierce = true;
								GAME.player.scythe.skin = 2;
								renderEnemies(GAME.map, 'mid', 0, true);

							} else if (GAME.map.entities[b].attr.name == 'pathmaker') {
								coin.play();

								GAME.player.scythe.hasFinder = true;
								GAME.player.scythe.skin = 3;
								renderEnemies(GAME.map, 'mid', 0, true);

							} else if (GAME.map.entities[b].attr.name == 'extraLife') {
								coin.play();

								GAME.maxLives += 2;
								GAME.lives += 2;
								updHealth();

								bigBoom(GAME.player.x, GAME.player.y, 1000, GAME.canv.h, 1, 8, true, 50, 100, 50);
							}

							GAME.map.entities.splice(b, 1);
							render(GAME.map, 'mid');
						}
					} else if (GAME.map.entities[b].whatIsIt == 'rune') {
						var runeName = GAME.map.entities[b].attr.name;
						newRune(ENTITY.rune[runeName].attr.id); //add the rune to the bag!
						GAME.map.entities.splice(b, 1); //remove the rune from the entities list
						render(GAME.map, 'mid'); //render no rune now :>)
					} else if (GAME.map.entities[b].whatIsIt == 'shopitem') {
						if (GAME.money >= GAME.map.entities[b].attr.cost) {
							GAME.money -= GAME.map.entities[b].attr.cost;

							if (GAME.map.entities[b].attr.name == 'damageup') {
								//increase damage TODO
							} else if (GAME.map.entities[b].attr.name == 'addrecipe') {
								
								if (GAME.recipes.used.length < RECIPE.grid.length*RECIPE.grid[0].length) {

									addRecipe();

									function addRecipe() {
										var r = randInt(0, RECIPE.grid.length*RECIPE.grid[0].length);

										var list = 0;

										for (let i=0; i < GAME.recipes.used.length; i++) {
											if (GAME.recipes.used[i] == r) {
												break;
											} else {
												list++;
											}
										}

										if (list == GAME.recipes.used.length) {
											GAME.recipes.used.push(r);
										} else {
											addRecipe();
										}

										//once it's all done, sort the list
										GAME.recipes.used.sort(function (a, b) { return a - b; });

										//also, render the recipes !
										updRecipes();

										function updRecipes() {
											$('#recipes').html('');

											for (let i=0; i < GAME.recipes.used.length; i++) {
												var ud = GAME.recipes.used[i];

												var x = ud % RECIPE.grid[0].length;
												var y = Math.round(ud / RECIPE.grid.length);

												var first = TILESET.collectables[x];
												var second = TILESET.collectables[y];

												var result = TILESET.runes[RECIPE.grid[x][y]];

												$('#recipes').append('<tr class="recipe"></tr>');
												$('#recipes .recipe:last-of-type').append('<td class="inp"></td>');
												$('#recipes .recipe:last-of-type').append('<td class="out"></td>');
												$('#recipes .recipe:last-of-type').append('<td class="result"></td>');

												for (let z=0; z < 3; z++) {
													$('#recipes .recipe:last-of-type .inp').append('<div class="img '+first+'"></div>');
													$('#recipes .recipe:last-of-type .inp .img').css({
														'background-color': getColor(TILE[first].colour, true),
														'background-position': TILE[first].sx*32*-1+'px '+TILE[first].sy*32*-1+'px'
													});

													$('#recipes .recipe:last-of-type .out').append('<div class="img '+second+'"></div>');
													$('#recipes .recipe:last-of-type .out .img').css({
														'background-color': getColor(TILE[second].colour, true),
														'background-position': TILE[second].sx*32*-1+'px '+TILE[second].sy*32*-1+'px'
													});
												}

												$('#recipes .recipe:last-of-type .result').append('<div class="num '+result+'_sml"></div>');

												//TODO
											}
										}

									}

								} else {
									console.log('You already have all the recipes!');
								}

								GAME.recipes.used.push

							}

						}
					}

				}
			}

			//enter doorways
			if (GAME.map.arr[GAME.player.x][GAME.player.y].isDoor) {
				door.play();

				if (!GAME.inRoom) { //walking INSIDE
					$('#riverarrow').hide();

					for (let i=0; i < GAME.map.rooms.length; i++) {
						if (GAME.player.x == GAME.map.rooms[i].px && GAME.player.y == GAME.map.rooms[i].py) {
							GAME.roomNumber = i;
						}
					}

					GAME.player.RAMx = GAME.player.x;
					GAME.player.RAMy = GAME.player.y;

					GAME.RAMmap = GAME.map;
					GAME.map = GAME.map.rooms[GAME.roomNumber];

					GAME.player.x = Math.floor(GAME.canv.h/2);
					GAME.player.y = GAME.canv.h-ROOM[GAME.map.roomType].spawnLocation;
				} else { //walking OUTSIDE
					$('#riverarrow').show();

					GAME.map.rooms[GAME.roomNumber] = GAME.map;
					GAME.map = GAME.RAMmap;

					GAME.player.x = GAME.player.RAMx;
					GAME.player.y = GAME.player.RAMy+1;
				}

				//swapping
				GAME.inRoom = !GAME.inRoom;

				//to eliminate soft-locking situations where the player throws their scythe through a doorway
				if (GAME.player.hasGun) {
					GAME.power = 'gunslinger';
					p_ctx.clearRect(0,0,canvas.width,canvas.height);
				}
			}
		}
	}

	function updCoins() {
		$('#coins').html(getTextDOM(GAME.money));
	}

	updCoins();

	class Item {
		constructor(name, amt) {
			this.name = name;
			this.amt = amt;
		}
		addValue(value) {
			this.amt += value;
		}
		deleteItem() {
			delete GAME.inv[this.name];
			GAME.selected = '';
		}
		chooseItem() {
			GAME.selected = this.name;
			$('.item').removeClass('selected');
			$('.img.'+this.name).parent().addClass('selected');
		}
	}

	function addItem(name, amt) {
		if (GAME.inv[name] == undefined) { //if the item has not been picked up

			GAME.inv[name] = new Item(name, amt);

		} else { //the item exists already

			GAME.inv[name].amt += amt;

		}
		updateInv();
	
		GAME.itemsCollected += amt;
		updIC();
	}

	function updIC() {
		$('#itemsCollected').html(getTextDOM(GAME.itemsCollected));
	}

	function removeItem(name, amt) {
		if (GAME.inv[name] == undefined) {
			//nothing to remove
		} else {
			if (amt == undefined) { //if not amount defined, remove it all
				GAME.inv[name].deleteItem();
			} else {
				GAME.inv[name].amt -= amt;
				if (GAME.inv[name].amt <= 0) {
					GAME.inv[name].deleteItem();
				}
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
			this.apx = x;
			this.apy = y;
			this.attr = attr;
		}
		sx() {
			return ENTITY[this.whatIsIt][this.attr.name].sx*32;
		}
		sy() {
			return ENTITY[this.whatIsIt][this.attr.name].sy*32;
		}
	}

	class Rune {
		constructor(id) {
			this.id = id;
			this.name = TILESET.runes[id];
		}
		moveTo(pos, fromArr, toArr) {
			toArr.push(fromArr[pos]);
			fromArr.splice(pos, 1);
		}
	}








	class Map {
		constructor() {
			this.arr = [];
			this.elevation = [];
			this.vision = [];
			this.entities = [];
			this.rooms = [];
		}
		form() {
			noise.seed(Math.random());

			for (var x = 0; x < GAME.canv.h; x++) {
				this.arr.push([]);
				this.elevation.push([]);
				this.vision.push([]);

				for (var y = 0; y < GAME.canv.h; y++) {
					var et = noise.perlin2(x / 8, y / 8);
					et = (et+1)/2; //normalise an array of -1/1 to 0/1;
					var t = circlePoint(x,y);

					this.arr[x].push(new Tile('ground'));
					this.elevation[x].push(et);
					this.vision[x].push(t);
				}
			}
		}
		addEntity(whatIsIt, x, y, attr) {
			if (whatIsIt == 'enemy' && y < 1) {
				//dont spawn an enemy right at the top of the map
			} else {
				this.entities.push(new Entity(whatIsIt, x, y, JSON.parse(JSON.stringify(attr))));
			}
		}
	}

	updateInv();

	function updateInv() {
		var arr = Object.keys(GAME.inv);

		$('#inv').html('');
		for (let i=0; i < arr.length; i++) {
			var item = GAME.inv[arr[i]]; 

			$('#inv').append('<div class="slot"></div>');

			$('#inv .slot').eq(i).addClass('item');
			$('#inv .slot').eq(i).append('<div class="img '+item.name+'"></div>');
			$('#inv .slot').eq(i).find('.img').css({
				'background-color': getColor(TILE[item.name].colour, true),
				'background-position': TILE[item.name].sx*32*-1+'px '+TILE[item.name].sy*32*-1+'px'
			});
			$('#inv .slot').eq(i).append('<div class="amt">'+getTextDOM(item.amt)+'</div>');
			
			if (TILESET.collectables.indexOf(item.name) != -1) {
				$('#inv .slot').eq(i).prepend('<div class="extra"><div class="num collected"></div></div>');
			}

			if (GAME.selected == item.name) {
				GAME.inv[item.name].chooseItem();
			}
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

		nMap.form();


		//hellscape
		if (THE_RIVER[GAME.zone].description == 'death') {hellscape = true;}


		function generateBiome(trees, rocks, dense, light, middle, cliff) {
			var biome = {};

			biome.outer = {
				trees: [],
				rocks: []
			};
			var trees_arr = trees.slice(0);
			var rocks_arr = rocks.slice(0);

			let ratioNum = randInt(3,7);
			let numOfAdds = [ratioNum, 10-ratioNum]; //IDK why I used let here

			for (let i=0; i < numOfAdds[0]; i++) {
				var newtile = rand(trees_arr);
				trees_arr.splice(trees_arr.indexOf(newtile), 1);
				if (trees_arr.length == 0) {
					trees_arr = trees.slice(0);
				}
				biome.outer.trees.push(newtile);
			}
			for (let i=0; i < numOfAdds[1]; i++) {
				var newtile = rand(rocks_arr);
				rocks_arr.splice(rocks_arr.indexOf(newtile), 1);
				if (rocks_arr.length == 0) {
					rocks_arr = rocks.slice(0);
				}
				biome.outer.rocks.push(newtile);
			}

			biome.inner = {
				dense: dense.slice(0),
				light: light.slice(0)
			};

			biome.middle = middle.slice(0);
			biome.cliff = cliff;

			return biome;
		}

		//generate forest biome
		var biome = generateBiome(TILESET.trees, TILESET.rocks, TILESET.dense, TILESET.light, TILESET.middle, TILESET.cliff);

		if (THE_RIVER[GAME.zone].description.indexOf('tundra') >= 0) {
			biome = generateBiome(TILESET.talltrees, TILESET.rockwall, TILESET.falldense, TILESET.falllight, TILESET.middle, TILESET.boulder);
		} else if (THE_RIVER[GAME.zone].description.indexOf('desert') >= 0) {
			biome = generateBiome(TILESET.middle, TILESET.rocks, TILESET.desert, TILESET.middle, TILESET.middle, TILESET.cliff);
		}

		/*console.log(
			'outer: trees: '+biome.outer.trees+'\n'+
			'       rocks: '+biome.outer.rocks+'\n'+
			'inner: dense: '+biome.inner.dense+'\n'+
			'       light: '+biome.inner.light+'\n'+
			'middle: '+biome.middle+'\n'+
			'cliff: '+biome.cliff
		);*/

		for (var x = 0; x < GAME.canv.h; x++) {
			for (var y = 0; y < GAME.canv.h; y++) {
				var et = nMap.elevation[x][y];
				var t = nMap.vision[x][y];
				var et_t = et*t;

				//The map is generated from the inside out
				if (et_t < 0.1) { //middle

					nMap.arr[x][y] = new Tile( rand(biome.middle) );

				} else if (et_t < 0.3) { //inner

					if (et > 0.5) {
						nMap.arr[x][y] = new Tile( rand(biome.outer.trees) );
					} else if (et > 0.4) {
						nMap.arr[x][y] = new Tile( rand(biome.inner.dense) );

						if (Math.random() < GAME.chanceOf.monsterSpawn) {
							if (THE_RIVER[GAME.zone].enemyArr.light.length != 0) {
								var chosenEnemy = rand(THE_RIVER[GAME.zone].enemyArr.light);
								nMap.addEntity('enemy', x, y, ENTITY.enemy[chosenEnemy].attr);
							}
						}

						if (Math.random() < GAME.chanceOf.lootSpawn) {
							nMap.arr[x][y] = new Tile( rand(TILESET.lootBoxes) );
						}

						if (Math.random() < GAME.chanceOf.collectSpawn) {
							nMap.arr[x][y] = new Tile( rand(TILESET.collectables) );
						}

					} else {
						nMap.arr[x][y] = new Tile( rand(biome.inner.light) );

						if (Math.random() < GAME.chanceOf.monsterSpawn) {
							if (THE_RIVER[GAME.zone].enemyArr.dense.length != 0) {
								var chosenEnemy = rand(THE_RIVER[GAME.zone].enemyArr.dense);
								nMap.addEntity('enemy', x, y, ENTITY.enemy[chosenEnemy].attr);
							}
						}
					}

				} else { //outer (rest)

					if (et > 0.5) {
						nMap.arr[x][y] = new Tile( rand(biome.outer.trees) );
					} else {
						if (et > 0.45) {
							nMap.arr[x][y] = new Tile( rand(biome.outer.rocks) );
						} else {
							nMap.arr[x][y] = new Tile( rand(biome.cliff) );
						}
					}

				}
			}
		}

	//a clearing
	if (THE_RIVER[GAME.zone].description.indexOf('clearing') >= 0) {

		for (let x=0; x < GAME.canv.h; x++) {
			for (let y=0; y < GAME.canv.h; y++) {
				var et = nMap.elevation[x][y];
				var t = nMap.vision[x][y];
				var et_t = et*t;

				if (t < 0.5) {
					nMap.arr[x][y] = new Tile('ground');
					if (Math.random() < 0.1) {
						nMap.arr[x][y] = new Tile(rand(TILESET.clearing));
					}
				} else if (t < 0.6) {
					nMap.arr[x][y] = new Tile(rand(TILESET.dense));
				} else if (t < 0.633) {
					nMap.arr[x][y] = new Tile(rand(TILESET.rocks));
				} else if (t < 0.666) {
					nMap.arr[x][y] = new Tile('river');
				} else if (t < 0.7) {
					nMap.arr[x][y] = new Tile(rand(TILESET.cliff));
				}
			}
		}

		nMap.addEntity(
			'enemy',
			Math.floor(GAME.canv.h/2)+8,
			Math.floor(GAME.canv.h/2)+4,
			ENTITY.enemy.xrrow.attr
		);

		nMap.addEntity(
			'enemy',
			Math.floor(GAME.canv.h/2),
			Math.floor(GAME.canv.h/2)+8,
			ENTITY.enemy.gyn.attr
		);

		nMap.addEntity(
			'enemy',
			Math.floor(GAME.canv.h/2)-8,
			Math.floor(GAME.canv.h/2)+4,
			ENTITY.enemy.kong.attr
		);

	}

	//the Beach?
	if (THE_RIVER[GAME.zone].description.indexOf('beach') >= 0) {

		//ocean
		var cs = 0;
		var dFt = Math.floor(GAME.canv.h/2);
		while (cs < GAME.canv.h) {
			var ychange = Math.round(nMap.elevation[cs][dFt]*10);
			var mu = dFt+ychange;

			nMap.arr[cs][mu-3] = new Tile(rand(TILESET.rocks));
			nMap.arr[cs][mu-2] = new Tile(rand(TILESET.rockwall));
			nMap.arr[cs][mu-1] = new Tile(rand(TILESET.cliff));

			if (Math.random() < 0.33) {
				nMap.addEntity('detail', cs, mu, {
					name: 'foam_0'
				});
			}

			while (mu < GAME.canv.h) {
				nMap.arr[cs][mu] = new Tile(rand(TILESET.ocean));

				mu++;
			}

			cs++;
		}

	}

	if (THE_RIVER[GAME.zone].description.indexOf('shore') >= 0) {
		var cs = GAME.canv.h-1;
		var dFt = Math.floor(GAME.canv.h/4);
		while (cs >= 0) {
			var ychange = Math.round(nMap.elevation[cs][dFt]*10);
			var mu = dFt+ychange;

			nMap.arr[cs][mu+6] = new Tile(rand(TILESET.dense));
			nMap.arr[cs][mu+5] = new Tile(rand(TILESET.light));
			nMap.arr[cs][mu+4] = new Tile(rand(TILESET.sand));
			nMap.arr[cs][mu+3] = new Tile(rand(TILESET.sand));
			nMap.arr[cs][mu+2] = new Tile(rand(TILESET.sand));
			nMap.arr[cs][mu+1] = new Tile(rand(TILESET.boulder));

			if (Math.random() < 0.33) {
				nMap.addEntity('detail', cs, mu, {
					name: 'foam_0'
				});
			}

			while (mu >= 0) {
				nMap.arr[cs][mu] = new Tile(rand(TILESET.ocean));
				mu--;
			}
			cs--;
		}
	}

	//in the ocean?
	if (THE_RIVER[GAME.zone].description.indexOf('ocean') >= 0) { //make the world ocean for the void map

		for (let x=0; x < GAME.canv.h; x++) {
			for (let y=0; y < GAME.canv.h; y++) {
				nMap.arr[x][y] = new Tile(rand(TILESET.ocean));
			}
		}

		/*var waves = 3;
		for (let i=0; i < waves; i++) {
			var cs = 0;
			var dFt = i*8;

			while (cs < GAME.canv.h) {
				var ychange = Math.round(nMap.elevation[cs][dFt]*5);
				var mu = dFt+ychange;

				nMap.arr[cs][mu] = new Tile('wave');

				cs++;
			}
		}*/

	}

	//inside the grotto?
	if (THE_RIVER[GAME.zone].description.indexOf('grotto') >= 0) {

		for (let x=0;x<GAME.canv.h;x++) {
			for (let y=0;y<GAME.canv.h;y++) {
				nMap.arr[x][y] = new Tile(rand(TILESET.cliff));
			}
		}

		var sx = sy = Math.floor(GAME.canv.h/2);
		var border = 3;
		var passages = [];

		//paths
		var paths = 5;
		while (paths > 0) {
			drawPath(sx, sy);

			sx = randInt(border, GAME.canv.h-border-1);
			sy = randInt(border, GAME.canv.h-border-1);

			paths--;
		}

		function drawPath(x, y) {
			var tx = x;
			var ty = y;

			var amo = 20;
			for (let i=0; i < amo; i++) {
				var len = randInt(2,3);
				var dirs = [0,1,2,3];
				var dir = rand(dirs);
				for (let k=0; k < len; k++) {
					switch (dir) {
						case 0:
							if (ty > border) ty--;
							break;
						case 1:
							if (ty < GAME.canv.h-border-1) ty++;
							break;
						case 2:
							if (tx > border) tx--;
							break;
						case 3:
							if (tx < GAME.canv.h-border-1) tx++;
							break;
					}
					var index = dirs.indexOf(dir);
					dirs.splice(index, 1);

					passages.push([tx, ty]);
					passages.push([tx, ty+1]);
				}
			}
		}

		for (let i=0; i < passages.length; i++) {
			passages[i].push(nMap.arr[passages[i][0]][passages[i][1]]);
		}

		for (let i=0; i < passages.length; i++) {
			nMap.arr[passages[i][0]][passages[i][1]] = new Tile('ground');
		}
	}









		//spawning river !!!
		if (GAME.zone == 0) {
			if (SAVE.haveWonOnce) {
				nMap.addEntity(
					'enemy',
					GAME.rx,
					1,
					ENTITY.enemy.you.attr
				);
			}
		}

		var ry = 0;

		while (ry < GAME.canv.h) {
			var dirs = ['left','right','down','down'];
			var dir = rand(dirs);
			var len = 1; //used to be random 1-3, but this is better
			while (len > 0) {
				nMap.arr[GAME.rx][ry] = new Tile('river');

				//spawning rixens
				if (THE_RIVER[GAME.zone].enemyArr.river.length != 0) {
					if (Math.random() < GAME.chanceOf.monsterSpawn) { //1 in 100 chance?
						nMap.addEntity('enemy', GAME.rx, ry, ENTITY.enemy.rixen.attr);
					}
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

		//death
		if (THE_RIVER[GAME.zone].description.indexOf('gungenthor') >= 0) {
			if (!GAME.isBossDead) {
				nMap.addEntity(
					'enemy',
					Math.floor(GAME.canv.h/2),
					Math.floor(GAME.canv.h/2)+1,
					ENTITY.enemy.gungenthor.attr
				);
			}
		}

		if (THE_RIVER[GAME.zone].description.indexOf('cliffs') >= 0) {
			//spawning cliff
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

					nMap.addEntity('detail', cs, mu, { name: 'shimmer', fallHeight: 0 });
					nMap.addEntity('detail', cs, mu+1, { name: 'shimmer', fallHeight: 1 });
					nMap.addEntity('detail', cs, mu+2, { name: 'shimmer', fallHeight: 2 });
					nMap.addEntity('detail', cs, mu+3, { name: 'shimmer', fallHeight: 3 });

					nMap.addEntity('detail', cs, mu+3, {
						name: 'spray_0'
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

		if (THE_RIVER[GAME.zone].description.indexOf('entrance') >= 0) {
			/*for (let x=0;x<GAME.canv.h;x++) {
				var multi = Math.abs(x - Math.floor(GAME.canv.h/2));
				console.log(multi);

				while (multi > 0) {
					nMap.arr[x][multi] = new Tile('flowers_1');
					multi--;
				}
			}*/

			for (let x=0;x<GAME.canv.h;x++) {
				var rx = GAME.rx;
				var distanceFrom = Math.abs(rx-x);

				var parabola = Math.pow(distanceFrom/2, 2);
				var sinewave = Math.sin(distanceFrom/GAME.canv.h)*GAME.canv.h/4;
				//if (parabola > GAME.canv.h-1) parabola = GAME.canv.h-1;

				distanceFrom = sinewave;

				for (let i=0;i<distanceFrom;i++) {
					nMap.arr[x][GAME.canv.h-i-1] = new Tile(rand(TILESET.cliff));
				}
			}
		}


		//spawn caves!
		if (THE_RIVER[GAME.zone].allowShops) {
			var caveSpawnTries = 2;
			while (caveSpawnTries > 0) {
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

				if (isTreeTile(r.x,r.y)) {
					var whatThing = rand(TILESET.dungeons);
					if (whatThing == 'cave') {

						nMap.arr[r.x][r.y-1] = new Tile( rand(TILESET.cliff) );
						nMap.arr[r.x][r.y] = new Tile( 'cliff_door' );
						nMap.arr[r.x+1][r.y] = new Tile( rand(TILESET.cliff) );
						nMap.arr[r.x-1][r.y] = new Tile( rand(TILESET.cliff) );
						nMap.arr[r.x-1][r.y-1] = new Tile( 'cliff_r' );
						nMap.arr[r.x+1][r.y-1] = new Tile( 'cliff_l' );

						nMap.addEntity('detail', r.x, r.y, {
							name: 'doorglow'
						});

						nMap.rooms.push( createRoom(r.x, r.y, 'cave') );

					} else if (whatThing == 'stump') {
						
						for (let z=0; z < 3; z++) { //width
							for (let x=0; x < 2; x++) { //height
								nMap.arr[z+r.x-1][x+r.y-2] = new Tile( 'stump_'+z+x );
							}
						}

						nMap.addEntity('detail', r.x, r.y-1, {
							name: 'doorglow'
						});

						nMap.rooms.push( createRoom(r.x, r.y-1, 'stump') );

					} else if (whatThing == 'small') {

						for (let z=0; z < 3; z++) { //width
							for (let x=0; x < 2; x++) { //height
								nMap.arr[z+r.x-1][x+r.y-2] = new Tile( 'small_'+z+x );
							}
						}

						nMap.addEntity('large_detail', r.x-1, r.y-2, {
							name: 'stumptop'
						});

						nMap.rooms.push( createRoom(r.x, r.y-1, 'small') );

					}
				}

				caveSpawnTries--;
			}
		}


		//spawning scary
		if (THE_RIVER[GAME.zone].description.indexOf('scary') >= 0) {
			/*var placex = Math.floor(GAME.canv.h/2);
			var placey = Math.floor(GAME.canv.h/3);

			placex += randInt(-2,2);
			placey += randInt(-2,2);

			for (let z=0; z < 3; z++) { //width
				for (let x=0; x < 2; x++) { //height
					nMap.arr[z+placex-2][x+placey-1] = new Tile( 'scary_'+z+x );
				}
			}

			nMap.addEntity('large_detail', placex-2, placey-2, {
				name: 'scary_roof'
			});

			nMap.rooms.push( createRoom(placex, placey, 'cave') );*/

			for (let x=0; x < GAME.canv.h; x++) {
				for (let y=0; y < GAME.canv.h; y++) {
					var et = nMap.elevation[x][y];
					var t = nMap.vision[x][y];
					var et_t = et*t;
					var et_t_t = et*(Math.pow(t, 5));

					//var isRiver = false;
					//if (nMap.arr[x][y].name == 'river') isRiver = true;

					if (et_t_t < 0.075/10) {
						nMap.arr[x][y] = new Tile('ground');
						if (et < 0.4) {
							if (Math.random() > 0.5) {
								nMap.arr[x][y] = new Tile(rand(TILESET.bones));
							}
						}
					} else if (et_t_t < 0.1/10) {
						nMap.arr[x][y] = new Tile('pebbles');
					} else if (et_t_t < 0.15/10) {
						nMap.arr[x][y] = new Tile(rand(TILESET.light));
					} else if (et_t_t < 0.2/10) {
						nMap.arr[x][y] = new Tile(rand(TILESET.rocks));
					} else if (et_t_t < 0.25/10) {
						nMap.arr[x][y] = new Tile(rand(TILESET.dense));
					} else if (et_t_t < 0.3/10) {
						nMap.arr[x][y] = new Tile(rand(TILESET.cliff));
					}
					
					//if (et_t_t < 0.075 && isRiver) {
					//	nMap.arr[x][y] = new Tile('flowers_1');
					//}
				}
			}

			var a = Math.floor(GAME.canv.h/2);
			var b = Math.floor(GAME.canv.h/2);

			nMap.addEntity('note', a, b, { name: 'invis',
				text: 'the scythe / cost: 1@ (max) / press c to use'
			});
			nMap.addEntity('item', a, b, { name: 'gunslinger',
				cost: 0,
				lifeCost: true
			});
			nMap.addEntity('detail', a, b, { name: 'scythe' });

			nMap.arr[a+8][b] = new Tile('rocks_4');
			nMap.arr[a-8][b] = new Tile('rocks_4');
		}




		//spawning the tower!
		if (THE_RIVER[GAME.zone].spawnTower) { //every 4th zone
			var placex = Math.floor(GAME.canv.h/2);
			var placey = Math.floor(GAME.canv.h/3);

			placex += randInt(-2,2);
			placey += randInt(-2,2);

			for (let z=0; z < 5; z++) {
				for (let x=0; x < 4; x++) {
					nMap.arr[z+placex-2][x+placey-3] = new Tile( 'tower_'+z+x );
				}
			}

			nMap.addEntity('large_detail', placex-2, placey-3, {
				name: 'roof'
			});

			nMap.addEntity('detail', placex-1, placey-2, { name: 'g_sword' });
			nMap.addEntity('detail', placex, placey-2, { name: 'g_enemy' });
			nMap.addEntity('detail', placex+1, placey-2, { name: 'g_heart' });
			nMap.addEntity('detail', placex, placey, { name: 'doortop' });

			nMap.rooms.push( createRoom(placex, placey, 'tower') );
		}

		//////////////////////////////

		if (THE_RIVER[GAME.zone].allowShops) {

			//DOMER
			if (Math.random() < GAME.chanceOf.domerSpawn || THE_RIVER[GAME.zone].forceShops) {
				GAME.chanceOf.domerSpawn = 0;

				var placex = Math.floor(GAME.canv.h/6);
				var placey = Math.floor(GAME.canv.h/1.5);

				placex += randInt(-1,1);
				placey += randInt(-1,1);

				for (let z=0; z < 3; z++) { //width
					for (let x=0; x < 4; x++) { //height
						nMap.arr[z+placex-1][x+placey-3] = new Tile( 'domer_'+z+x );
					}

					nMap.arr[placex-1+z][placey+1] = new Tile('ground');
				}

				nMap.addEntity('large_detail', placex-1, placey-3, {
					name: 'domer_roof'
				});

				nMap.addEntity('detail', placex, placey-1, { name: 'g_bigcoin' });
				nMap.addEntity('detail', placex, placey, { name: 'domer_door' });

				nMap.rooms.push( createRoom(placex, placey, 'domer') );
			} else { //increase chance of seeing it as you keep missing it
				GAME.chanceOf.domerSpawn += GAME.chanceOf.domerSpawnInc;
			}

			//SPIRE
			if (Math.random() < GAME.chanceOf.spireSpawn || THE_RIVER[GAME.zone].forceShops) {
				GAME.chanceOf.spireSpawn = 0;

				var placex = Math.floor(GAME.canv.h-GAME.canv.h/6);
				var placey = Math.floor(GAME.canv.h/1.5);

				placex += randInt(-1,1);
				placey += randInt(-1,1);

				for (let z=0; z < 3; z++) { //width
					for (let x=0; x < 5; x++) { //height
						if (x == 0) {
							if (z == 0 || z == 2) {
								//not placing the top left and right spots!
							} else {
								nMap.arr[z+placex-1][x+placey-4] = new Tile( 'spire_'+z+x );
							}
						} else {
							nMap.arr[z+placex-1][x+placey-4] = new Tile( 'spire_'+z+x );
						}
					}

					nMap.arr[placex-1+z][placey+1] = new Tile('ground');
				}

				nMap.addEntity('large_detail', placex-1, placey-4, {
					name: 'spire_roof'
				});

				nMap.addEntity('detail', placex, placey-1, { name: 'g_fairy' });
				nMap.addEntity('detail', placex, placey, { name: 'spire_door' });

				nMap.rooms.push( createRoom(placex, placey, 'spire') );

			} else { //increase chance of seeing it as you keep missing it
				GAME.chanceOf.spireSpawn += GAME.chanceOf.spireSpawnInc;
			}

		} // end of if (THE_RIVER[GAME.zone].allowShops)

		//////////////////////////////
		//end of create()

		if (THE_RIVER[GAME.zone].description.indexOf('boss') >= 0) { //can't go past unless deafeated
			GAME.fightingBoss = true;
			$('#riverarrow').hide();
		}

		$('#riverarrow').css({
			'left':GAME.rx*32+'px'
		});

		/*nMap.addEntity('note', 12, 14, { name: 'mark',
			text: 'informatttttionnn, damn'
		});*/

		/*
			r.x = 15;
			r.y = 15;

			for (let z=0; z < 3; z++) { //width
				for (let x=0; x < 2; x++) { //height
					nMap.arr[z+r.x-1][x+r.y-2] = new Tile( 'small_'+z+x );
				}
			}

			nMap.addEntity('large_detail', r.x-1, r.y-2, {
				name: 'stumptop'
			});

			nMap.rooms.push( createRoom(r.x, r.y-1, 'small') );
		*/


		/*nMap.addEntity('trap', 12, 14, {
			name: 'spike',
			movement: 'mid',
			armed: true,
			timer: 999
		});*/

		/*nMap.addEntity(
			'enemy',
			Math.floor(GAME.canv.h/2)-4,
			Math.floor(GAME.canv.h/2)+3,
			ENTITY.enemy.pix.attr
		);
		nMap.addEntity(
			'enemy',
			Math.floor(GAME.canv.h/2)-3,
			Math.floor(GAME.canv.h/2)+3,
			ENTITY.enemy.shin.attr
		);
		nMap.addEntity(
			'enemy',
			Math.floor(GAME.canv.h/2)-2,
			Math.floor(GAME.canv.h/2)+3,
			ENTITY.enemy.psymo.attr
		);
		nMap.addEntity(
			'enemy',
			Math.floor(GAME.canv.h/2)-1,
			Math.floor(GAME.canv.h/2)+3,
			ENTITY.enemy.psyko.attr
		);

		nMap.addEntity(
			'enemy',
			Math.floor(GAME.canv.h/2)+1,
			Math.floor(GAME.canv.h/2)+3,
			ENTITY.enemy.fefe.attr
		);
		nMap.addEntity(
			'enemy',
			Math.floor(GAME.canv.h/2)+2,
			Math.floor(GAME.canv.h/2)+3,
			ENTITY.enemy.mulb.attr
		);
		nMap.addEntity(
			'enemy',
			Math.floor(GAME.canv.h/2)+3,
			Math.floor(GAME.canv.h/2)+3,
			ENTITY.enemy.ixtix.attr
		);
		nMap.addEntity(
			'enemy',
			Math.floor(GAME.canv.h/2)+4,
			Math.floor(GAME.canv.h/2)+3,
			ENTITY.enemy.arko.attr
		);*/

		nMap.addEntity('detail', GAME.rx, GAME.canv.h-1, { name: 'arrow_d' });

		if (creativeMode) {
			for (let x=0; x < GAME.canv.h; x++) {
				for (let y=0; y < GAME.canv.h; y++) {
					nMap.arr[x][y] = new Tile('ground');
				}
			}

			nMap.entities = [];
		}

		function placeBirdhouse(x, y, text) {
			nMap.arr[x][y] = new Tile('birdhouse');
			nMap.addEntity('detail', x, y, { name: 'sign' });
			nMap.addEntity('note', x, y, { name: 'invis', sound: true,
				text: text
			});
		}

		if (GAME.zone == 0) {
			placeBirdhouse( GAME.rx, Math.floor(GAME.canv.h/2),
				"press z to interact with the world"
			);
		}

		if (GAME.zone == 2) {
			placeBirdhouse( GAME.rx-1, 2,
				"1> enemies' movement depends on the type of tile you're standing on"
			);
			placeBirdhouse( GAME.rx, 1,
				"2> for example:  ^  moves towards you only when you're in the river" //^ = rixen
			);
			placeBirdhouse( GAME.rx+1, 2,
				"3> but will move randomly when you're anywhere else"
			);
			nMap.arr[GAME.rx][2] = new Tile('ground');
		}

		if (GAME.zone == 4) {
			placeBirdhouse( GAME.rx, 2,
				"press x to highlight important objects"
			);
		}

		if (GAME.zone == 25) {
			placeBirdhouse( GAME.rx, Math.floor(GAME.canv.h/2),
				"hey! you can't be here!"
			);

			nMap.addEntity(
				'enemy',
				Math.floor(GAME.canv.h/2),
				Math.floor(GAME.canv.h/2),
				ENTITY.enemy.you.attr
			);

			$('#riverarrow').hide();
		}

		return nMap;
	}

	//create rooms
	function createRoom(px, py, roomType) {
		var nMap = new Map();
		nMap.form();
		nMap.px = px;
		nMap.py = py;

		nMap.roomType = roomType; //roomType shows up when you are in a room, and is undefined if you're in the 'world'

		switch (roomType) {
			case 'cave':
				/////////////////////////////////////////////////////////
				for (var x = 0; x < GAME.canv.h; x++) {
					for (var y = 0; y < GAME.canv.h; y++) {
						var et = nMap.elevation[x][y];
						var t = nMap.vision[x][y];
						var et_t = et*t;

						if (et_t < 0.1) {
							nMap.arr[x][y] = new Tile( 'river' );
						} else if (et_t < 0.2+Math.random()/20) {
							if (Math.random() < 0.3) {
								nMap.arr[x][y] = new Tile( rand(TILESET.cave) );
							} else {
								nMap.arr[x][y] = new Tile( 'ground' );
							}
						} else {
							nMap.arr[x][y] = new Tile( rand(TILESET.cliff) );
						}
					}
				}

				for (let i=0; i < GAME.canv.h; i++) {
					nMap.arr[i][0] = new Tile( rand(TILESET.cliff) );
					nMap.arr[0][i] = new Tile( rand(TILESET.cliff) );
					nMap.arr[i][GAME.canv.h-1] = new Tile( rand(TILESET.cliff) );
					nMap.arr[GAME.canv.h-1][i] = new Tile( rand(TILESET.cliff) );
				}

				for (let i=Math.floor(GAME.canv.h/2); i < GAME.canv.h-1; i++) {
					nMap.arr[Math.floor(GAME.canv.h/2)][i] = new Tile( 'river' );
				}

				nMap.arr[Math.floor(GAME.canv.h/2)][GAME.canv.h-2] = new Tile( 'cavedoor' );

				//spawn treasure!
				var lootSpawnTries = 4;
				while (lootSpawnTries > 0) {
					var r = {
						x: randInt(2, GAME.canv.h-3),
						y: randInt(2, GAME.canv.h-3)
					}

					nMap.arr[r.x][r.y] = new Tile( rand(TILESET.lootBoxes) );

					lootSpawnTries--;
				}

				//spawn the entity of the cave
				nMap.addEntity(
					'enemy',
					Math.floor(GAME.canv.h/2),
					Math.floor(GAME.canv.h/2),
					ENTITY.enemy.rwck.attr
				);

				/////////////////////////////////////////////////////////
				break;
			case 'tower':
				/////////////////////////////////////////////////////////
				for (var x = 0; x < GAME.canv.h; x++) {
					for (var y = 0; y < GAME.canv.h; y++) {
						var et = nMap.elevation[x][y];
						var t = nMap.vision[x][y];
						var et_t = et*t;

						if (et_t > 0.3 && t < 0.7) {
							if (Math.random() < 0.75) {
								nMap.arr[x][y] = new Tile( rand(TILESET.weeds) );
							} else {
								nMap.arr[x][y] = new Tile( 'ground' );
							}
						} else if (t < 0.5 && t > 0.32) {
							nMap.arr[x][y] = new Tile( 'river' );
						} else if (t < 0.7) {
							nMap.arr[x][y] = new Tile( 'ground' );
						}
						
						if (t < 0.45 && t > 0.4 && y != 5) {
							nMap.arr[x][y] = new Tile( 'towerwall' );
						}
					}
				}
				
				for (let a=0; a < 3; a++) {
					var rms = 6;
					for (let b=0; b < GAME.canv.h; b++) {
						var t = nMap.vision[b][(a*rms)+rms];
						if (t < 0.7 && t > 0.45) {
							if (t < 0.6 && t > 0.55) {
								nMap.arr[b][(a*rms)+rms] = new Tile( 'door' );
							} else {
								nMap.arr[b][(a*rms)+rms] = new Tile( 'wall_2' );
							}
						}
					}
				}

				for (let a=0; a < 2; a++) {
					var rmn = 8;
					for (let b=0; b < GAME.canv.h; b++) {
						var t = nMap.vision[(a*rmn)+rmn][b];
						if (t < 0.7 && t > 0.45) {
							if (t < 0.6 && t > 0.55) {
								nMap.arr[(a*rmn)+rmn][b] = new Tile( 'door' );
							} else {
								nMap.arr[(a*rmn)+rmn][b] = new Tile( 'wall_3' );
							}
						}
					}
				}

				for (let i=0; i < GAME.canv.h; i++) {
					var hex = Math.abs(i-Math.floor((GAME.canv.h-1)/2));
					if (hex < 2) hex = 2;
					if (i > 3 && i < GAME.canv.h-4) nMap.arr[i][1] = new Tile( 'towerwall' );
					if (i > 1 && i < GAME.canv.h-1) nMap.arr[Math.floor(hex/2)-1][i] = new Tile( 'towerwall' );
					if (i > 3 && i < GAME.canv.h-4) nMap.arr[i][GAME.canv.h-1-1] = new Tile( 'towerwall' );
					if (i > 1 && i < GAME.canv.h-1) nMap.arr[GAME.canv.h-1-Math.floor(hex/2)+1][i] = new Tile( 'towerwall' );
				}

				nMap.arr[Math.floor(GAME.canv.h/2)][GAME.canv.h-2] = new Tile( 'towerdoor' );

				//spawn spikes >:)
				var spikesSpawnTries = 20;
				while (spikesSpawnTries > 0) {
					var r = {
						x: randInt(8, GAME.canv.h-9),
						y: randInt(8, GAME.canv.h-9)
					}

					nMap.arr[r.x][r.y] = new Tile( rand(TILESET.rocks) );

					spikesSpawnTries--;
				}

				//spawn enemies
				for (var x = 0; x < GAME.canv.h; x++) {
					for (var y = 0; y < GAME.canv.h; y++) {
						var t = nMap.vision[x][y];

						if (x < 8 || x > 16) {
							if (t < 0.7 && t > 0.4) {
								if (nMap.arr[x][y].name != 'towerwall') {
									if (Math.random() < GAME.chanceOf.monsterSpawn*5) {
										nMap.addEntity('enemy', x, y, ENTITY.enemy[rand(TILESET.enemies)].attr);
									}
								}
							}
						}
					}
				}

				//THE BOSS!
				nMap.addEntity('enemy', Math.floor(GAME.canv.h/2), GAME.canv.h-9, ENTITY.enemy.kong.attr);

				nMap.addEntity('heart', Math.floor(GAME.canv.h/2), GAME.canv.h-7, {
					name: 'full',
					value: 2
				});

				/////////////////////////////////////////////////////////
				break;
			case 'tower_level2':
				/////////////////////////////////////////////////////////
				for (var x = 0; x < GAME.canv.h; x++) {
					for (var y = 0; y < GAME.canv.h; y++) {
						var et = nMap.elevation[x][y];
						var t = nMap.vision[x][y];
						var et_t = et*t;

						if (t < 0.38 && t > 0.26) {
							nMap.arr[x][y] = new Tile( 'river' );
						} else if (t < 0.7 && t > 0.26) {
							if (Math.random() < 0.1) {
								nMap.arr[x][y] = new Tile( rand(TILESET.rockwall) );
							} else if (et > 0.5) {
								if (Math.random() < 0.75) {
									nMap.arr[x][y] = new Tile( rand(TILESET.weeds) );
								} else {
									nMap.arr[x][y] = new Tile( 'ground' );
								}
							} else {
								nMap.arr[x][y] = new Tile( 'ground' );
							}
						} else if (t < 0.7) {
							nMap.arr[x][y] = new Tile( 'ground' );
						}
						
						if (t < 0.26 && t > 0.2) {
							nMap.arr[x][y] = new Tile( 'towerwall' );
						}
					}
				}

				//walls horizontal
				for (let a=0; a < 3; a++) {
					var rms = 12;
					for (let b=0; b < GAME.canv.h; b++) {
						var t = nMap.vision[b][(a*rms)+rms];
						if (t < 0.7 && t > 0.26) {
							if (t < 0.5 && t > 0.45) {
								nMap.arr[b][(a*rms)+rms] = new Tile( 'door' );
							} else {
								nMap.arr[b][(a*rms)+rms] = new Tile( 'wall_2' );
							}
						}
					}
				}

				//outer hex walls
				for (let i=0; i < GAME.canv.h; i++) {
					var hex = Math.abs(i-Math.floor((GAME.canv.h-1)/2));
					if (hex < 2) hex = 2;
					if (i > 3 && i < GAME.canv.h-4) nMap.arr[i][1] = new Tile( 'towerwall' );
					if (i > 1 && i < GAME.canv.h-1) nMap.arr[Math.floor(hex/2)-1][i] = new Tile( 'towerwall' );
					if (i > 3 && i < GAME.canv.h-4) nMap.arr[i][GAME.canv.h-1-1] = new Tile( 'towerwall' );
					if (i > 1 && i < GAME.canv.h-1) nMap.arr[GAME.canv.h-1-Math.floor(hex/2)+1][i] = new Tile( 'towerwall' );

					if (i > 1 && i < GAME.canv.h-2) {
						if (i < 10 || i > 14) {
							nMap.arr[Math.floor(hex/2)-1+15][i] = new Tile( 'wall_3' );
							if (i == 6 || i == GAME.canv.h-1-6) nMap.arr[Math.floor(hex/2)-1+15][i] = new Tile( 'door' );
						}
					}
					if (i > 1 && i < GAME.canv.h-2) {
						if (i < 10 || i > 14) {
							nMap.arr[GAME.canv.h-Math.floor(hex/2)-15][i] = new Tile( 'wall_3' );
							if (i == 6 || i == GAME.canv.h-1-6) nMap.arr[GAME.canv.h-Math.floor(hex/2)-15][i] = new Tile( 'door' );
						}
					}
				}

				nMap.arr[Math.floor(GAME.canv.h/2)][Math.floor(GAME.canv.h/2)-4] = new Tile( 'door' );

				//door
				nMap.arr[Math.floor(GAME.canv.h/2)][GAME.canv.h-2] = new Tile( 'towerdoor' );

				//spawn enemies
				for (var x = 0; x < GAME.canv.h; x++) {
					for (var y = 0; y < GAME.canv.h; y++) {
						var t = nMap.vision[x][y];

						if (x < 8 || x > 16) {
							if (t < 0.7 && t > 0.4) {
								if (nMap.arr[x][y].name != 'towerwall') {
									if (Math.random() < GAME.chanceOf.monsterSpawn*5) {
										nMap.addEntity('enemy', x, y, ENTITY.enemy[rand(TILESET.enemies)].attr);
									}
								}
							}
						}
					}
				}

				//THE BOSS!
				nMap.addEntity('enemy', Math.floor(GAME.canv.h/2), 3, ENTITY.enemy.kong.attr);

				//the reward
				nMap.addEntity('heart', Math.floor(GAME.canv.h/2), GAME.canv.h-10, {
					name: 'full',
					value: 2
				});

				/////////////////////////////////////////////////////////
				break;
			case 'domer':
				/////////////////////////////////////////////////////////

				for (let i=0; i < GAME.canv.h; i++) {
					var hex = Math.abs(i-Math.floor((GAME.canv.h-1)/2));
					if (hex < 2) hex = 2;
					if (i > 6 && i < GAME.canv.h-7) nMap.arr[i][5] = new Tile( 'domerwall' );
					if (i > 4 && i < GAME.canv.h-6) nMap.arr[Math.floor(hex/2)+4][i] = new Tile( 'domerwall' );
					if (i > 6 && i < GAME.canv.h-7) nMap.arr[i][GAME.canv.h-1-5] = new Tile( 'domerwall' );
					if (i > 4 && i < GAME.canv.h-6) nMap.arr[GAME.canv.h-1-Math.floor(hex/2)-4][i] = new Tile( 'domerwall' );

					if (i > 6 && i < GAME.canv.h-7 && i % 2 == 0 && i != 12) nMap.arr[i][6] = new Tile( rand(TILESET.domer) );
					if (i > 6 && i < GAME.canv.h-7 && i % 2 == 0 && i != 12) nMap.arr[i][GAME.canv.h-1-6] = new Tile( rand(TILESET.domer) );
				}

				if (GAME.player.hasGun) {
					for (let x=0;x<GAME.canv.h;x++) {
						for (let y=0;y<GAME.canv.h;y++) {
							var et = nMap.elevation[x][y];
							var t = nMap.vision[x][y];

							if (t<0.2) {
								if (Math.random() < 0.2) {
									nMap.arr[x][y] = new Tile(rand(TILESET.bones));
								}
							}
						}
					}

					for (let a = 0; a < 9; a++) {
						if (a == 0 || a == 4 || a == 8) {
							var d = { x: -4, y: -5 }

							if (a == 0 || a == 8) {
								d.y += 1;
							}

							/*var chosenWeapon = rand(TILESET.weapons); //randomly select weapons for sale

							nMap.addEntity('item', hex+a+d.x, hex+d.y, {
								name: WEAPON[chosenWeapon].name,
								cost: WEAPON[chosenWeapon].cost
							});*/

							if (a == 4) {
								nMap.addEntity('large_detail', hex+a-1+d.x, hex-1+d.y, { name: 'bazzar' });

								nMap.addEntity('item', hex+a+d.x, hex+d.y, { name: 'pathmaker',
									cost: 300
								});
								nMap.addEntity('note',hex+a+d.x,hex+d.y,{name:'invis',
									text:"power of the pathmaker"
								});
								nMap.addEntity('note',hex+a+d.x-1,hex+d.y-1,{name:'mark',
									text:"your scythe creates ghostly paths, allowing you to traverse the world with ease"
								});
								nMap.addEntity('detail',hex+a+d.x-1,hex+d.y-3,{name:'three'});
								nMap.addEntity('detail',hex+a+d.x,hex+d.y-3,{name:'dbl_zero'});
								nMap.addEntity('detail',hex+a+d.x+1,hex+d.y-3,{name:'g_bigcoin'});
							} else {
								nMap.addEntity('large_detail', hex+a-1+d.x, hex-1+d.y, { name: 'carpet' });
							}
						}
					}

					for (let a = 0; a < 11; a++) {
						if (a == 0 || a == 10) {
							var d = { x: -5, y: 0 }
							
							nMap.addEntity('large_detail', hex+a-1+d.x, hex-1+d.y, { name: 'bazzar' });

							if (a == 0) {
								nMap.addEntity('item', hex+a+d.x, hex+d.y, { name: 'canonball',
									cost: 200
								});
								nMap.addEntity('note',hex+a+d.x,hex+d.y,{name:'invis',
									text:"power of the harvest"
								});
								nMap.addEntity('note',hex+a+d.x-1,hex+d.y-1,{name:'mark',
									text:"your scythe deals double damage and steals life"
								});
								nMap.addEntity('detail',hex+a+d.x-1-4,hex+d.y,{name:'two'});
								nMap.addEntity('detail',hex+a+d.x-4,hex+d.y,{name:'dbl_zero'});
								nMap.addEntity('detail',hex+a+d.x+1-4,hex+d.y,{name:'g_bigcoin'});
							} else if (a == 10) {
								nMap.addEntity('item', hex+a+d.x, hex+d.y, { name: 'boomerang',
									cost: 200
								});
								nMap.addEntity('note',hex+a+d.x,hex+d.y,{name:'invis',
									text:"power of the boomerang"
								});
								nMap.addEntity('note',hex+a+d.x-1,hex+d.y-1,{name:'mark',
									text:"your scythe returns to you automatically"
								});
								nMap.addEntity('detail',hex+a+d.x-1+4,hex+d.y,{name:'two'});
								nMap.addEntity('detail',hex+a+d.x+4,hex+d.y,{name:'dbl_zero'});
								nMap.addEntity('detail',hex+a+d.x+1+4,hex+d.y,{name:'g_bigcoin'});
							}
						}
					}
				} else {
					for (let x=0;x<GAME.canv.h;x++) {
						for (let y=0;y<GAME.canv.h;y++) {
							var et = nMap.elevation[x][y];
							var t = nMap.vision[x][y];

							if (t<0.2) {
								nMap.arr[x][y] = new Tile(rand(TILESET.light));
							} else if (t<0.31) {
								if (Math.random() < 0.75) {
									nMap.arr[x][y] = new Tile(rand(TILESET.dense));
								} else {
									nMap.arr[x][y] = new Tile(rand(TILESET.collectables));
								}

								if (t>0.25) {
									if (Math.random() < 0.1) {
										nMap.arr[x][y] = new Tile(rand(TILESET.people));
										nMap.addEntity('note',x,y,{name:'invis',text:rand(TILESET.peopleTalk)});
									}
								}
							} else if (t<0.36) {
								nMap.arr[x][y] = new Tile('river');
							} else if (t<0.4) {
								nMap.arr[x][y] = new Tile(rand(TILESET.trees));
							} else if (t<0.45) {
								nMap.arr[x][y] = new Tile('domerwall');
							}

							//cave edges
							for (let z=0; z < 3; z++) { //width
								for (let x=0; x < 2; x++) { //height
									nMap.arr[Math.floor(GAME.canv.h/2)+z-1][Math.floor(GAME.canv.h/2)+x-5] = new Tile( 'stump_'+z+x );
								}
							}
							nMap.addEntity('large_detail', Math.floor(GAME.canv.h/2)-1, Math.floor(GAME.canv.h/2)-5, {
								name: 'stumptop'
							});

							//river
							var xdisp = 9;
							var wwidt = 6;
							if (x > xdisp && x < xdisp+wwidt && y > 0 && y < 6) {
								nMap.arr[x][y] = new Tile('river_vert');
								nMap.addEntity('detail', x, y, { name: 'shimmer', fallHeight: y });
								if (y == 5) {
									nMap.addEntity('detail', x, y, {
										name: 'spray_0'
									});
								}
							}
						}
					}

					nMap.arr[hex][hex-4] = new Tile('shopkeep');
					nMap.addEntity('note',hex,hex-4,{name:'invis',text:"<it takes immense fortitude to resist the pull of the scythe. i commend you.>"});
				}

				nMap.arr[Math.floor(GAME.canv.h/2)][GAME.canv.h-6] = new Tile( 'towerdoor' );

				/////////////////////////////////////////////////////////
				break;
			case 'spire':
				/////////////////////////////////////////////////////////

				for (let i=0; i < GAME.canv.h; i++) {
					var hex = Math.abs(i-Math.floor((GAME.canv.h-1)/2));
					if (hex < 2) hex = 2;
					if (i > 6 && i < GAME.canv.h-7) nMap.arr[i][5] = new Tile( 'spirewall' );
					if (i > 4 && i < GAME.canv.h-6) nMap.arr[Math.floor(hex/2)+4][i] = new Tile( 'spirewall' );
					if (i > 6 && i < GAME.canv.h-7) nMap.arr[i][GAME.canv.h-1-5] = new Tile( 'spirewall' );
					if (i > 4 && i < GAME.canv.h-6) nMap.arr[GAME.canv.h-1-Math.floor(hex/2)-4][i] = new Tile( 'spirewall' );

					if (i > 4 && i < GAME.canv.h-6 && i % 3 == 0 && i != 12) nMap.arr[Math.floor(hex/2)+5][i] = new Tile( rand(TILESET.spire) );
					if (i > 4 && i < GAME.canv.h-6 && i % 3 == 0 && i != 12) nMap.arr[GAME.canv.h-1-Math.floor(hex/2)-5][i] = new Tile( rand(TILESET.spire) );
				}

				/*nMap.addEntity('item', hex+0, hex+3, {
					name: 'fists',
					cost: 0
				});
				nMap.addEntity('item', hex+1, hex+1, {
					name: 'dagger',
					cost: 0
				});
				nMap.addEntity('item', hex+2, hex+1, {
					name: 'mace',
					cost: 0
				});
				nMap.addEntity('item', hex+3, hex+1, {
					name: 'sword',
					cost: 0
				});
				nMap.addEntity('item', hex+0, hex-1, {
					name: 'flail',
					cost: 0
				});
				nMap.addEntity('item', hex+1, hex-1, {
					name: 'staff',
					cost: 0
				});
				nMap.addEntity('item', hex+2, hex-1, {
					name: 'whip',
					cost: 0
				});
				nMap.addEntity('item', hex+3, hex-1, {
					name: 'scythe',
					cost: 0
				});*/

				hex -= 0;

				nMap.addEntity('detail', hex+2+1, hex, { name: 's_downarr' });
				nMap.addEntity('detail', hex+2+1, hex+1, { name: 's_cup' });
				nMap.addEntity('large_detail', hex+1, hex+2, { name: 'transmute' });

				nMap.addEntity('detail', hex+2-5, hex, { name: 's_downarr' });
				nMap.addEntity('detail', hex+2-5, hex+1, { name: 's_cup' });
				nMap.addEntity('large_detail', hex-4, hex+2, { name: 'alchemy' });

				hex -= 4;

				for (let a = 0; a < 3; a++) {
					for (let b = 0; b < 3; b++) {
						if (a == 0 && b == 0) {
							//top left corner
						} else {
							nMap.addEntity('detail', hex+a-5+6, hex+b, { name: 'circle' });
						}
					}
				}
				nMap.addEntity('large_detail', hex+4, hex, { name: 'arrows' });
				nMap.addEntity('large_detail', hex+5, hex, { name: 'summoning' });



				nMap.addEntity('note', 9, 8, { name: 'mark',
					text: 'assembling all the collectables grants max hp'
				});

				nMap.addEntity('note', 8, 13, { name: 'mark',
					text: 'sometimes exchanges collectables'
				});

				nMap.addEntity('note', 14, 13, { name: 'mark',
					text: 'sometimes doubles collectables'
				});

				nMap.arr[Math.floor(GAME.canv.h/2)][GAME.canv.h-6] = new Tile( 'towerdoor' );

				/////////////////////////////////////////////////////////
				break;
			case 'stump':
				/////////////////////////////////////////////////////////

				for (var x = 0; x < GAME.canv.h; x++) {
					for (var y = 0; y < GAME.canv.h; y++) {
						var et = nMap.elevation[x][y];
						var t = nMap.vision[x][y];
						var et_t = et*t;

						var jag = 0.15+Math.random()/20;

						if (et_t < jag) {
							if (et < 0.3) {
								nMap.arr[x][y] = new Tile( 'river' );
							} else if (et < 0.4) {
								nMap.arr[x][y] = new Tile( rand(TILESET.leaves) );
							} else if (et < 0.5) {
								nMap.arr[x][y] = new Tile( rand(TILESET.stump) );
							} else {
								nMap.arr[x][y] = new Tile( 'ground' );
							}
						} else if (et_t < jag+0.1) {
							nMap.arr[x][y] = new Tile( rand(TILESET.treewall) );
						} else {
							nMap.arr[x][y] = new Tile( 'ground' );
						}
					}
				}

				//spawn treasure!
				var lootSpawnTries = 4;
				while (lootSpawnTries > 0) {
					var r = {
						x: randInt(4, GAME.canv.h-5),
						y: randInt(4, GAME.canv.h-5)
					}

					nMap.arr[r.x][r.y] = new Tile( rand(TILESET.lootBoxes) );

					lootSpawnTries--;
				}

				nMap.arr[Math.floor(GAME.canv.h/2)][GAME.canv.h-12] = new Tile( 'cavedoor' );

				nMap.addEntity(
					'enemy',
					randInt(Math.floor(GAME.canv.h/2)-5, Math.floor(GAME.canv.h/2)+5),
					randInt(Math.floor(GAME.canv.h/2)-5, Math.floor(GAME.canv.h/2)+5),
					ENTITY.enemy.rwck.attr
				);

				/////////////////////////////////////////////////////////
				break;
			case 'small':
				/////////////////////////////////////////////////////////

				for (let i=0; i < GAME.canv.h; i++) {
					var hex = Math.abs(i-Math.floor((GAME.canv.h-1)/2));
					if (hex < 2) hex = 2;
					if (i > 6 && i < GAME.canv.h-7) nMap.arr[i][5] = new Tile( 'towerwall' );
					if (i > 4 && i < GAME.canv.h-6) nMap.arr[Math.floor(hex/2)+4][i] = new Tile( 'towerwall' );
					if (i > 6 && i < GAME.canv.h-7) nMap.arr[i][GAME.canv.h-1-5] = new Tile( 'towerwall' );
					if (i > 4 && i < GAME.canv.h-6) nMap.arr[GAME.canv.h-1-Math.floor(hex/2)-4][i] = new Tile( 'towerwall' );
				}

				nMap.arr[Math.floor(GAME.canv.h/2)][GAME.canv.h-6] = new Tile( 'towerdoor' );

				for (var x = 0; x < GAME.canv.h; x++) {
					for (var y = 0; y < GAME.canv.h; y++) {
						var et = nMap.elevation[x][y];
						var t = nMap.vision[x][y];
						var et_t = et*t;

						if (t > 0.17 && t < 0.4 && et > 0.5) {
							nMap.arr[x][y] = new Tile(rand(TILESET.weeds));
						}

						if (t < 0.22 && t > 0.12) {
							if (t > 0.17) {
								nMap.arr[x][y] = new Tile( 'towerwall' );
							} else {
								nMap.arr[x][y] = new Tile( 'river' );
							}
						}

					}
				}

				//spawn treasure!
				var lootSpawnTries = 4;
				while (lootSpawnTries > 0) {
					var r = {
						x: randInt(7, GAME.canv.h-8),
						y: randInt(7, GAME.canv.h-8)
					}

					nMap.arr[r.x][r.y] = new Tile( rand(TILESET.lootBoxes) );

					lootSpawnTries--;
				}

				nMap.arr[15][12] = new Tile( 'door' );
				nMap.arr[9][12] = new Tile( 'door' );
				nMap.arr[12][9] = new Tile( 'door_open' );
				nMap.arr[12][15] = new Tile( 'door' );

				//enemy!
				nMap.addEntity(
					'enemy',
					Math.floor(GAME.canv.h/2),
					Math.floor(GAME.canv.h/2),
					ENTITY.enemy.rwck.attr
				);

				/////////////////////////////////////////////////////////
				break;
			default:
		}

		return nMap;
	}





	function render(mapToRender, dir) {
		function setupGrid() {
			//set up the grid for pathfinding
			GAME.grid = [];

			for (let i = 0; i < mapToRender.arr[0].length; i++) {
				GAME.grid.push([]);
				for (let j = 0; j < mapToRender.arr.length; j++) {
					if (TILE[mapToRender.arr[j][i].name].block == true) {
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

				if (THE_RIVER[GAME.zone].description == 'tundra') {
					var clr = TILE[mapToRender.arr[x][y].name].colour;

					if (clr == 'autumn' || clr == 'foliage') {
					ctx.beginPath();
					ctx.rect(pos.px, pos.py, GAME.canv.size, 20);
					ctx.fillStyle = 'rgba(255,255,255,0.5)';
					ctx.fill();
					}
				}

				ctx.drawImage(spritesheet, mapToRender.arr[x][y].sx(), mapToRender.arr[x][y].sy(), 64, 64, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
			}
		}

		//details, treasure, etc. should be done right after bottom layer/tiles
		for (let i = 0; i < mapToRender.entities.length; i++) {
			let e = mapToRender.entities[i];

			var pos = position(e.x, e.y, dir);

			//treasure
			if (e.whatIsIt == 'treasure') {
				ctx.save();
				ctx.beginPath();
				ctx.rect(pos.px+4, pos.py+4, GAME.canv.size-8, GAME.canv.size-8);
				ctx.fillStyle = "#252525";
				ctx.fill();
				ctx.restore();
			}

			//large details
			if (e.whatIsIt == 'large_detail') {
				var m = ENTITY.large_detail[mapToRender.entities[i].attr.name];
				ctx.drawImage(numbers, e.sx(), e.sy(), GAME.canv.size*m.w, GAME.canv.size*m.h, pos.px, pos.py, GAME.canv.size*m.w, GAME.canv.size*m.h);
			} else if (e.whatIsIt != 'enemy' && e.whatIsIt != 'trap') {
				ctx.drawImage(numbers, e.sx(), e.sy(), 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
			}
		}

		//Fog of war!
		n_ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (GAME.nighttime || GAME.inRoom && GAME.darkRooms.indexOf(GAME.map.roomType) != -1) { //fog of war if the roomType is listed in the dark array
			for (var x = 0; x < GAME.canv.h; x++) {
				for (var y = 0; y < GAME.canv.h; y++) {
					var pos = position(x, y, dir);

					var mapx = x - (GAME.player.x - Math.floor(GAME.canv.h/2));
					var mapy = y - (GAME.player.y - Math.floor(GAME.canv.h/2));

					if (mapToRender.vision[mapx] != undefined) {
						if (mapToRender.vision[mapx][mapy] != undefined) {
							n_ctx.globalAlpha = mapToRender.vision[mapx][mapy]*3.5; //3.5 a good value for nighttime
						} else {
							n_ctx.globalAlpha = 1;
						}
					} else {
						n_ctx.globalAlpha = 1;
					}

					n_ctx.beginPath();
					n_ctx.rect(pos.px, pos.py, GAME.canv.size, GAME.canv.size);
					n_ctx.fillStyle = "#252525";
					n_ctx.fill();

					n_ctx.globalAlpha = 1;
				}
			}
		}

		//write a tile info/desc panel
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

		//write the note_panel
		$('#note_panel').removeClass('panelon');
		updateNotePanel();

		function updateNotePanel() {
			for (let i=0; i < GAME.map.entities.length; i++) {
				let e = GAME.map.entities[i];

				if (e.whatIsIt == 'note') {
					if (e.x == GAME.player.x+GAME.player.dir[0] || e.x == GAME.player.x) {
						if (e.y == GAME.player.y+GAME.player.dir[1] || e.y == GAME.player.y) {
							drawNotePanel(e);
						}
					}
				}
			}

			function drawNotePanel(e) {
				$('#note_panel').addClass('panelon');

				if (e.attr.sound) {
					setTimeout(function() { //so the sound plays when the note fully appears
						note.play();
					}, 150);
				}
				
				$('#note_inner').html(
					getTextDOM(e.attr.text)
				);
			}
		}





		//end of render
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

	function fireGun() {
		scythe.play();

		disableInput = true;

		GAME.player.scythe.internalTick = 0;
		renderEnemies(GAME.map, 'mid', 0, true);

		GAME.power = ''; //remove the scythe!
		var pos = position(GAME.player.x, GAME.player.y, 'mid');
		e_ctx.clearRect(pos.px, pos.py, 32, 32);

		var bulletPath = [];

		var start = [GAME.player.x, GAME.player.y];
		bulletPath.push(start);

		for (let i=0; i < GAME.canv.h; i++) {
			var next = [GAME.player.x+(GAME.player.dir[0]*i), GAME.player.y+(GAME.player.dir[1]*i)];

			if (next[0] < 0) break;
			if (next[0] > GAME.canv.h-1) break;
			if (next[1] < 0) break;
			if (next[1] > GAME.canv.h-1) break;

			var nextTileName = GAME.map.arr[next[0]][next[1]].name;

			//check for enemies
			var enemyFound = -1;
			for (let z=0; z < GAME.map.entities.length; z++) {
				if (GAME.map.entities[z].whatIsIt == 'enemy') {
					var enemyPos = [GAME.map.entities[z].x, GAME.map.entities[z].y];
					if (enemyPos[0] == next[0] && enemyPos[1] == next[1]) {
						enemyFound = z;
						break;
					}
				}
			}

			if (enemyFound != -1) {
				break;
			}

			if (TILE[nextTileName].block == true) {
				if(GAME.player.scythe.hasFinder) {
					//dont stop
				} else {
					break;
				}
			}

			bulletPath.push(next);
		}

		var gun_speed = 50;

		for (let i=0; i < bulletPath.length-1; i++) {
			setTimeout(function() {
				if (GAME.player.scythe.hasFinder) { //hasFinder
					GAME.map.arr[bulletPath[i][0]][bulletPath[i][1]].colour = '#ff0055';
					GAME.map.arr[bulletPath[i][0]][bulletPath[i][1]].block = false;
					GAME.map.arr[bulletPath[i][0]][bulletPath[i][1]].isFrozenGround = true;
					render(GAME.map, 'mid');
				}

				var pos = position(bulletPath[i][0], bulletPath[i][1], 'mid');
				var dir = [bulletPath[i+1][0]-bulletPath[i][0],bulletPath[i+1][1]-bulletPath[i][1]];

				for (let j=0; j < 100; j++) {
					setTimeout(function() {
						p_ctx.clearRect(0,0,canvas.width,canvas.height);
						p_ctx.drawImage(numbers, (12+(i % 4))*GAME.canv.size, (24+GAME.player.scythe.skin)*GAME.canv.size, 32, 32, pos.px+(j/100*GAME.canv.size)*dir[0], pos.py+(j/100*GAME.canv.size)*dir[1], GAME.canv.size, GAME.canv.size);
					},j*gun_speed/100);
				}

				if (i >= bulletPath.length-2) {

					if (GAME.player.scythe.hasFinder) { //hasFinder
						GAME.map.arr[bulletPath[i+1][0]][bulletPath[i+1][1]].colour = '#ff0055';
						GAME.map.arr[bulletPath[i+1][0]][bulletPath[i+1][1]].block = false;
						GAME.map.arr[bulletPath[i+1][0]][bulletPath[i+1][1]].isFrozenGround = true;
						render(GAME.map, 'mid');
					}

					if (enemyFound != -1) {
						if (GAME.player.scythe.hasPierce) {
							damageEnemy(enemyFound, GAME.player.damage*2);
							if (Math.random() < 0.5) {
								randomPlaceOneMoney(bulletPath[i+1][0], bulletPath[i+1][1]);
							} else {
								randomPlaceOneMoney(bulletPath[i+1][0], bulletPath[i+1][1], 'heart', 1);
							}
						} else {
							damageEnemy(enemyFound, GAME.player.damage);
						}
						renderEnemies(GAME.map, 'mid', 0, true); //for depleting HP
						render(GAME.map, 'mid'); //for showing grave

						enemyFound = -1;
					}

					if (GAME.player.scythe.hasReturn) {
						setTimeout(function() {
							p_ctx.clearRect(0,0,canvas.width,canvas.height);
						}, gun_speed);
					} else {
						GAME.map.addEntity('item', bulletPath[i+1][0], bulletPath[i+1][1], { name: 'gunslinger',
							cost: 0
						});
					}

					disableInput = false;
				}
			}, i*gun_speed);
		}
	}

	function magicBlade() {
		disableInput = true;
		var cycle = 1000;

		var coneMatrix = [
			[0,0,1,0,0],
			[0,1,1,1,0],
			[0,1,1,1,0],
			[1,1,1,1,1],
			[1,1,1,1,1]
		];

		var cone = coneMatrix.slice(0);

		for (let i=0; i < DISP[GAME.player.facing].r; i++) {
			cone = rotate(cone);
		}

		$('#player').addClass('magicblade');

		for (let i=0; i < cone.length; i++) {
			setTimeout(function() {

				for (let b=0; b < cone[0].length; b++) {
					if (cone[i][b] == 1) {
						var pos = position(
							GAME.player.x + i - 2 + GAME.player.dir[0]*3,
							GAME.player.y + b - 2 + GAME.player.dir[1]*3,
							'mid'
						);

						p_ctx.drawImage(numbers, 2*GAME.canv.size, 15*GAME.canv.size, 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
					}
				}

			}, (cycle-400)/cone.length*i);
		}

		setTimeout(function() {
			p_ctx.clearRect(0, 0, canvas.height, canvas.width);

			for (let a=0; a < cone.length; a++) {
				for (let b=0; b < cone[0].length; b++) {
					if (cone[a][b] == 1) {
						var pos = position(
							GAME.player.x + a - 2 + GAME.player.dir[0]*3,
							GAME.player.y + b - 2 + GAME.player.dir[1]*3,
							'mid'
						);

						p_ctx.drawImage(numbers, 3*GAME.canv.size, 15*GAME.canv.size, 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
					}
				}
			}
		}, cycle-100);

		setTimeout(function() {
			p_ctx.clearRect(0, 0, canvas.height, canvas.width);

			for (let a=0; a < cone.length; a++) {
				for (let b=0; b < cone[0].length; b++) {
					if (cone[a][b] == 1) {
						var pos = position(
							GAME.player.x + a - 2 + GAME.player.dir[0]*3,
							GAME.player.y + b - 2 + GAME.player.dir[1]*3,
							'mid'
						);

						p_ctx.drawImage(numbers, 4*GAME.canv.size, 15*GAME.canv.size, 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
					}
				}
			}
		}, cycle-50);

		setTimeout(function() {
			p_ctx.clearRect(0, 0, canvas.height, canvas.width);
			disableInput = false;

			$('#player').removeClass('magicblade');
		}, cycle);
	}

	function toggleBelt() {
		if (!runePageKeyDisable) {
			runePageKeyDisable = true;

			if (runePageOpen) { //close
				click.play();
				$('#inv .slot').hide();
				$('#runes_panel').removeClass('panelon');
				setTimeout(function() {
					$('#runes_panel').removeClass('gowide');
				}, 300);

				runePageOpen = false;
			} else { //open
				click.play();
				$('#inv .slot').hide();
				$('#runes_panel').addClass('panelon');
				setTimeout(function() {
					$('#runes_panel').addClass('gowide');
				}, 300);

				runePageOpen = true;
			}

			setTimeout(function() {
				runePageKeyDisable = false;
				$('#inv .slot').show();
			}, 900);
		}
	}

	function sonarSense() {
		disableInput = true;
		var cycle = 500;
		var iterations = Math.floor(GAME.canv.h/2);
		var ringSize = 3;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		e_ctx.clearRect(0, 0, canvas.width, canvas.height);

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
									ctx.fillStyle = 'white';
								} else if (GAME.map.arr[nx][ny].isDoor) {
									ctx.fillStyle = 'seagreen';
								} else if (GAME.map.arr[nx][ny].isLoot) {
									ctx.fillStyle = '#ffec27';
								} else if (GAME.map.arr[nx][ny].isCollect) {
									ctx.fillStyle = '#f972df';
								} else {
									if (GAME.map.arr[nx][ny].name == 'river' || GAME.map.arr[nx][ny].name == 'river_vert') {
										ctx.fillStyle = 'mediumturquoise';
									} else {
										if (TILE[GAME.map.arr[nx][ny].name].block) {
											ctx.fillStyle = 'seagreen';
										} else {
											ctx.fillStyle = '#1f603c';
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
														ctx.drawImage(numbers, 0*32, 10*32, 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
														break;
													case 'treasure':
														ctx.drawImage(numbers, 1*32, 10*32, 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
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



	function bigBoom(startx, starty, speed, howLarge, ringSize, visMulti, blackground, h, s, l) {
		disableInput = true;
		var cycle = speed;
		var iterations = howLarge;
		var ringSize = ringSize;

		if (blackground) {
			$('#entity_canvas').hide();
			$('#player').hide();
		}

		for (let i=0; i < iterations; i++) {
			setTimeout(function() {
				var mapToRender = GAME.map;

				if (blackground) {
					ctx.clearRect(0, 0, canvas.width, canvas.height);
				}

				for (var x = 0; x < GAME.canv.h; x++) {
					for (var y = 0; y < GAME.canv.h; y++) {
						var nx = x + startx - Math.floor(GAME.canv.h/2);
						var ny = y + starty - Math.floor(GAME.canv.h/2);

						var pos = position(nx, ny, 'mid');

						if (GAME.map.vision[nx] != undefined) {
							if (GAME.map.vision[nx][ny] != undefined) {
								ctx.save();
								ctx.beginPath();
								ctx.rect(pos.px, pos.py, GAME.canv.size, GAME.canv.size);
								ctx.fillStyle = 'hsl('+(h+randInt(-18,18))+', '+s+'%, '+l+'%)'

								var tile_vision = GAME.map.vision[x][y]*10 * visMulti; //the multiplication is the ratio of how much you can see
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
			$('#entity_canvas').show();
			$('#player').show();

			disableInput = false;
			render(GAME.map,'mid');
		}, cycle);
	}





	function magicalExplosion(startx, starty, fillHSLBase) {
		disableInput = true;
		var cycle = 500;
		var iterations = GAME.canv.h;
		var ringSize = 1;

		for (let i=0; i < iterations; i++) {
			setTimeout(function() {
				var mapToRender = GAME.map;

				for (var x = 0; x < GAME.canv.h; x++) {
					for (var y = 0; y < GAME.canv.h; y++) {
						var nx = x + startx - Math.floor(GAME.canv.h/2);
						var ny = y + starty - Math.floor(GAME.canv.h/2);

						var pos = position(nx, ny, 'mid');

						if (GAME.map.vision[nx] != undefined) {
							if (GAME.map.vision[nx][ny] != undefined) {
								ctx.save();
								ctx.beginPath();
								ctx.rect(pos.px, pos.py, GAME.canv.size, GAME.canv.size);
								ctx.fillStyle = getRandomHSL(fillHSLBase);

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
			render(GAME.map,'mid');
		}, cycle+500);
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
					changeDir('left');
					renderPlayer();
					enemysTurn();
					render(GAME.map, 'mid');
					renderEnemies(GAME.map, 'mid', 100, true);
					break;
				case 38: //Up arrow key
					walk('up');
					changeDir('up');
					renderPlayer();
					enemysTurn();
					render(GAME.map, 'mid');
					renderEnemies(GAME.map, 'mid', 100, true);
					break;
				case 39: //right arrow key
					walk('right');
					changeDir('right');
					renderPlayer();
					enemysTurn();
					render(GAME.map, 'mid');
					renderEnemies(GAME.map, 'mid', 100, true);
					break;
				case 40: //down arrow key
					if (GAME.player.y >= GAME.canv.h-1) {

						if (GAME.player.x == GAME.rx && !GAME.fightingBoss) {
							GAME.player.y = 0;

							//increases the zone
							GAME.zone++;
							updZone();

							slideWorld('down');
							renderPlayer(GAME.speed);
						}

					} else {
						walk('down');
						changeDir('down');
						renderPlayer();
						enemysTurn();
						render(GAME.map, 'mid');
						renderEnemies(GAME.map, 'mid', 100, true);
					}
					break;

				case 87: //W key
					if (GAME.player.facing != 'up') {
						enemysTurn();
						renderEnemies(GAME.map, 'mid', 100, true);
					} else {
						renderEnemies(GAME.map, 'mid', 100, false);
					}
					changeDir('up');
					break;
				case 65: //A key
					if (GAME.player.facing != 'left') {
						enemysTurn();
						renderEnemies(GAME.map, 'mid', 100, true);
					} else {
						renderEnemies(GAME.map, 'mid', 100, false);
					}
					changeDir('left');
					break;
				case 83: //S key
					if (GAME.player.facing != 'down') {
						enemysTurn();
						renderEnemies(GAME.map, 'mid', 100, true);
					} else {
						renderEnemies(GAME.map, 'mid', 100, false);
					}
					changeDir('down');
					break;
				case 68: //D key
					if (GAME.player.facing != 'right') {
						enemysTurn();
						renderEnemies(GAME.map, 'mid', 100, true);
					} else {
						renderEnemies(GAME.map, 'mid', 100, false);
					}
					changeDir('right');
					break;

				case 88: //X key
					fail.play();
					sonarSense();

					break;
				case 90: //Z key
					if (GAME.player.targetFar) {
						tryToCollect(GAME.player.x+GAME.player.dir[0], GAME.player.y+GAME.player.dir[1]);
					} else {
						tryToCollect(GAME.player.x, GAME.player.y);
					}
					break;

				case 67: //C key
					if (GAME.power == 'gunslinger') {
						fireGun();
					}

					//magicBlade();
					break;

				case 86: //V key
					//goToSleep();
					toggleBelt();

					break;

				case 66: //B key
					move.play();
					GAME.player.targetFar = !GAME.player.targetFar;
					renderEnemies(GAME.map, 'mid', 0, true);
					break;

				case 49:
					selectItem(0);
					break;
				case 50:
					selectItem(1);
					break;
				case 51:
					selectItem(2);
					break;
				case 52:
					selectItem(3);
					break;
				case 53:
					selectItem(4);
					break;
				case 54:
					selectItem(5);
					break;
				case 55:
					selectItem(6);
					break;
				case 56:
					selectItem(7);
					break;
				case 57:
					selectItem(8);
					break;
				case 48: //0 key
					selectItem(-1);
					break;
				case 27: //esc key
					selectItem(-1);
					break;

				case 13: //enter key
					if (startscreen) {
						GAME.maxLives = 4;
						GAME.lives = 4;
						updHealth();
						closeModal();
						GAME.difficulty = 'medi';
						startscreen = false;
					}
					break;
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

		for (let i=0; i < DISP[GAME.player.facing].r; i++) {
			GAME.weaponMatrix = rotate(GAME.weaponMatrix);
		}

		GAME.showDir = true;
	}

	function walk(choice) {
		move.play();

		var d;
		if (choice == undefined) {
			d = rand(DISP.dirs);
		} else {
			d = choice;
		}

		switch (d) {
			case 'up':
				if (GAME.player.y-1 >= 0) {
				if (GAME.map.arr[GAME.player.x][GAME.player.y-1].colDetect(GAME.player.x, GAME.player.y-1)) {
					GAME.player.y--;
				} //else { walk(); }
				changeDir('up');
				}
				break;
			case 'down':
				if (GAME.player.y+1 <= GAME.canv.h-1) {
				if (GAME.map.arr[GAME.player.x][GAME.player.y+1].colDetect(GAME.player.x, GAME.player.y+1)) {
					GAME.player.y++;
				} //else { walk(); }
				changeDir('down');
				}
				break;
			case 'left':
				if (GAME.player.x-1 >= 0) {
				if (GAME.map.arr[GAME.player.x-1][GAME.player.y].colDetect(GAME.player.x-1, GAME.player.y)) {
					GAME.player.x--;
				} //else { walk(); }
				changeDir('left');
				}
				break;
			case 'right':
				if (GAME.player.x+1 <= GAME.canv.h-1) {
				if (GAME.map.arr[GAME.player.x+1][GAME.player.y].colDetect(GAME.player.x+1, GAME.player.y)) {
					GAME.player.x++;
				} //else { walk(); }
				changeDir('right');
				}
				break;
			default:
				//default
		}

		//things to do
		GAME.map.arr[GAME.player.x][GAME.player.y].collect();

		GAME.tick++;

		if (GAME.player.scythe.hasReturn) {
			if (GAME.player.scythe.internalTick >= GAME.player.scythe.internalMax) {
				GAME.power = 'gunslinger';
			} else {
				GAME.player.scythe.internalTick++;
			}
		}

		if (GAME.tick > 625) {
			GAME.tick = -1;
		}
	}

	function enemysTurn() {
		///////////////////

			easystar.setGrid(GAME.grid);
			easystar.enableSync();
			easystar.setIterationsPerCalculation(1000);

		///////////////////

		easystar.stopAvoidingAllAdditionalPoints();

		function enemyWalkTowardsPlayer(i) {
			//console.log(GAME.map.entities[i].attr.name);
			//console.log("ex: "+GAME.map.entities[i].x+" ey: "+GAME.map.entities[i].y+" x: "+GAME.player.x+" y: "+GAME.player.y);
			easystar.findPath(GAME.map.entities[i].x, GAME.map.entities[i].y, GAME.player.x, GAME.player.y, function( path ) {
				if (path === null) {
					//this would require the player to be standing in a solid tile, but it can't hurt to have this here anyway
					enemyFrozen(i);
				} else {
					if (path.length >= 1) {
						GAME.map.entities[i].apx = GAME.map.entities[i].x;
						GAME.map.entities[i].apy = GAME.map.entities[i].y;
						GAME.map.entities[i].x = path[1].x;
						GAME.map.entities[i].y = path[1].y;
						easystar.avoidAdditionalPoint(path[1].x, path[1].y);
					}
				}
			});
		}

		function enemyWalkRandomly(i) {

			var x = GAME.map.entities[i].x;
			var y = GAME.map.entities[i].y;

			var dirv = [0,1,2,3];

			var check = 4;
			while (check > 0) {
				var s = rand(dirv);
				var rng = DISP[DISP.dirs[s]];

				var idkx = x + rng.x - 1;
				var idky = y + rng.y - 1;

				if (idkx < 0) idkx = 0;
				if (idkx > GAME.canv.h-1) idkx = GAME.canv.h-1;
				if (idky < 0) idky = 0;;
				if (idky > GAME.canv.h-1) idky = GAME.canv.h-1;

				if (TILE[GAME.map.arr[idkx][idky].name].block != true) {

					GAME.map.entities[i].apx = GAME.map.entities[i].x;
					GAME.map.entities[i].apy = GAME.map.entities[i].y;
					GAME.map.entities[i].x = idkx;
					GAME.map.entities[i].y = idky;
					easystar.avoidAdditionalPoint(idkx, idky);

					check = 0;
				} else {
					dirv.splice(s, 1);
					check--;
				}
			}


			/*var d = {
				x: randInt(1,GAME.canv.h-2),
				y: randInt(1,GAME.canv.h-2)
			}

			easystar.findPath(GAME.map.entities[i].x, GAME.map.entities[i].y, d.x, d.y, function( path ) {
				if (path === null) {
					enemyFrozen(i);
				} else {
					if (path.length >= 1) {
						GAME.map.entities[i].apx = GAME.map.entities[i].x;
						GAME.map.entities[i].apy = GAME.map.entities[i].y;
						GAME.map.entities[i].x = path[1].x;
						GAME.map.entities[i].y = path[1].y;
						easystar.avoidAdditionalPoint(path[1].x, path[1].y);
					}
				}
			});*/
		}

		function enemyWalkTowardsPoint(i, px, py) {
			easystar.findPath(GAME.map.entities[i].x, GAME.map.entities[i].y, px, py, function( path ) {
				if (path === null) {
					enemyFrozen(i);
				} else {
					if (path.length >= 1) {
						GAME.map.entities[i].apx = GAME.map.entities[i].x;
						GAME.map.entities[i].apy = GAME.map.entities[i].y;
						GAME.map.entities[i].x = path[1].x;
						GAME.map.entities[i].y = path[1].y;
						easystar.avoidAdditionalPoint(path[1].x, path[1].y);
					}
				}
			});
		}

		function enemyWalkInDirection(i, dir) {

			var new_dir = {
				x: DISP[dir].x-1,
				y: DISP[dir].y-1
			}

			var newx = GAME.map.entities[i].x + new_dir.x;
			var newy = GAME.map.entities[i].y + new_dir.y;

			var goodTooWalk = true;

			if (newx < 0) goodTooWalk = false;
			if (newx > GAME.canv.h-1) goodTooWalk = false;
			if (newy < 0) goodTooWalk = false;
			if (newy > GAME.canv.h-1) goodTooWalk = false;

			if (goodTooWalk) {
				GAME.map.entities[i].apx = GAME.map.entities[i].x;
				GAME.map.entities[i].apy = GAME.map.entities[i].y;
				GAME.map.entities[i].x = newx;
				GAME.map.entities[i].y = newy;
			}

		}

		function enemyFrozen(i) {
			if (GAME.map.entities[i] != undefined) {
				GAME.map.entities[i].apx = GAME.map.entities[i].x;
				GAME.map.entities[i].apy = GAME.map.entities[i].y;
			}
		}

		var trapsToRemove = [];

		for (let i = 0; i < GAME.map.entities.length; i++) {
			if (GAME.map.entities[i].whatIsIt == 'enemy') {
				
				var e = GAME.map.entities[i];
				var name = e.attr.name;
				var tile = GAME.map.arr[GAME.player.x][GAME.player.y].name;

				var balkChance = GAME.chanceOf.enemyBalks;
				if (GAME.map.arr[GAME.player.x][GAME.player.y].isFrozenGround) {
					balkChance = balkChance*10;
				}

				if (Math.random() > balkChance) {
					switch (name) {
						case 'smarg':
							if (tile != 'river') {
								enemyWalkTowardsPlayer(i);
							} else {
								enemyFrozen(i);
							}
							break;
						case 'rixen':
							if (tile == 'river') {
								enemyWalkTowardsPlayer(i);
							} else {
								enemyWalkRandomly(i);
							}
							break;
						case 'derva':
							if (tile != 'ground') {
								enemyWalkTowardsPlayer(i);
							} else {
								enemyFrozen(i);
							}
							break;
						case 'trull':
							if (tile != 'river') {
								enemyWalkTowardsPlayer(i);
							} else {
								enemyWalkRandomly(i);
							}
							break;
						case 'xrrow':
							if (tile != 'ground' && tile != 'river') {
								enemyWalkTowardsPlayer(i);
							} else {
								enemyWalkRandomly(i);
							}

							GAME.map.addEntity('trap', GAME.map.entities[i].x, GAME.map.entities[i].y, {
								name: 'xrrow_shot',
								movement: rand(DISP.dirs),
								armed: true,
								timer: 8
							});

							break;
						case 'gyn':
							if (tile == 'river') {
								enemyWalkTowardsPlayer(i);
							} else {
								enemyWalkRandomly(i);
							}

							break;
						case 'kong':
							if (tile == 'ground') {
								enemyWalkTowardsPlayer(i);
							} else {
								enemyWalkRandomly(i);
							}

							GAME.map.addEntity('trap', GAME.map.entities[i].x, GAME.map.entities[i].y, {
								name: 'kong_trail',
								movement: 'mid',
								armed: true,
								timer: 8
							});

							break;
						case 'rwck':
							if (tile != 'river') {
								enemyWalkTowardsPlayer(i);
							} else {
								enemyWalkRandomly(i);
							}
							break;
						case 'pix':
							if (tile == 'river') {
								enemyWalkRandomly(i);
							} else {
								enemyWalkTowardsPlayer(i);
							}
							break;
						case 'shin':
							if (tile == 'river') {
								enemyWalkRandomly(i);
							} else {
								enemyWalkTowardsPlayer(i);
							}
							break;
						case 'psymo':
							if (tile == 'river') {
								enemyWalkRandomly(i);
							} else if (tile == 'ground') {
								enemyWalkTowardsPlayer(i);
							} else {
								enemyFrozen(i);
							}

							if (GAME.tick % 4 == 0) {
								GAME.map.addEntity('trap', GAME.map.entities[i].x, GAME.map.entities[i].y, {
									name: 'psymo_shot',
									movement: rand(DISP.dirs),
									armed: true,
									timer: 8
								});
							}

							break;
						case 'psyko':
							if (tile == 'river') {
								enemyWalkRandomly(i);
							} else if (tile == 'ground') {
								enemyWalkTowardsPlayer(i);
							} else {
								enemyFrozen(i);
							}

							if (GAME.tick % 2 == 0) {
								GAME.map.addEntity('trap', GAME.map.entities[i].x+randInt(-2,2), GAME.map.entities[i].y+randInt(-2,2), {
									name: 'psyko_trap',
									movement: 'mid',
									armed: true,
									timer: 16
								});
							}

							break;
						case 'fefe':
							if (tile == 'river') {
								enemyWalkTowardsPlayer(i);
							} else if (tile == 'ground') {
								enemyFrozen(i);
							} else {
								enemyWalkRandomly(i);
							}
							break;
						case 'mulb':
							if (tile == 'river') {
								enemyWalkTowardsPlayer(i);
							} else if (tile == 'ground') {
								enemyFrozen(i);
							} else {
								enemyWalkRandomly(i);
							}
							break;
						case 'ixtix':
							if (tile == 'river') {
								enemyWalkRandomly(i);
							} else {
								enemyWalkTowardsPlayer(i);
							}
							break;
						case 'arko':
							if (tile == 'river') {
								enemyWalkRandomly(i);
							} else {
								enemyWalkTowardsPlayer(i);
							}
							break;
						case 'fakerock':
							enemyWalkTowardsPlayer(i);
							break;
						case 'gungenthor':
							if (GAME.tick % 4 == 0) {
								bossmove.play();

								enemyWalkTowardsPlayer(i);
							} else {
								if (GAME.bossPhase >= 2) {
									enemyWalkRandomly(i);
								} else {
									enemyFrozen(i);
								}
							}

							if (GAME.tick % 4 == 0) {

								if (GAME.bossPhase >= 0) {
									//tears attack
									var typeOfTear = 'tears';
									if (Math.random() < 0.05) typeOfTear = 'bigtear';

									if (Math.random() > 0.5) {
										GAME.map.addEntity('trap', GAME.map.entities[i].x+1, GAME.map.entities[i].y, {
											name: typeOfTear,
											movement: 'down',
											armed: true,
											timer: 8
										});
									} else {
										GAME.map.addEntity('trap', GAME.map.entities[i].x-1, GAME.map.entities[i].y, {
											name: typeOfTear,
											movement: 'down',
											armed: true,
											timer: 8
										});
									}
								}

								if (GAME.bossPhase >= 1) {
									//hands and feet attack
									var px = 0;
									var py = 0;

									if (Math.random() < 0.5) { //HAND
										if (Math.random() < 0.5) { //left to right
											py = randInt(0, GAME.canv.h-1);

											for (let a=0; a < 2; a++) { for (let b=0; b < 2; b++) {
												GAME.map.addEntity('trap', px+a, py+b, {
													name: 'left_hand_'+a+b,
													movement: 'right',
													armed: true,
													timer: 99
												});
											} }
										} else { //right to left
											px = GAME.canv.h-1;
											py = randInt(0, GAME.canv.h-1);

											for (let a=0; a < 2; a++) { for (let b=0; b < 2; b++) {
												GAME.map.addEntity('trap', px+a, py+b, {
													name: 'right_hand_'+a+b,
													movement: 'left',
													armed: true,
													timer: 99
												});
											} }
										}
									} else { //FEET
										if (Math.random() < 0.5) { //up to down
											px = randInt(0, GAME.canv.h-1);

											for (let a=0; a < 2; a++) { for (let b=0; b < 2; b++) {
												GAME.map.addEntity('trap', px+a, py+b, {
													name: 'left_foot_'+a+b,
													movement: 'down',
													armed: true,
													timer: 99
												});
											} }
										} else { //down to up
											px = randInt(0, GAME.canv.h-1);
											py = GAME.canv.h-1;

											for (let a=0; a < 2; a++) { for (let b=0; b < 2; b++) {
												GAME.map.addEntity('trap', px+a, py+b, {
													name: 'right_foot_'+a+b,
													movement: 'up',
													armed: true,
													timer: 99
												});
											} }
										}
									}
								}

							}

							break;
						case 'you':
							if (GAME.tick < 16) {
								enemyWalkRandomly(i);
							} else {
								enemyWalkTowardsPoint(i, GAME.rx, GAME.canv.h-1);
								if (GAME.map.entities[i].x == GAME.rx && GAME.map.entities[i].y == GAME.canv.h-1) {
									GAME.map.entities.splice(i, 1);
									disableInput = true;
									var score = calculateScore();
									$('#score').html(getTextDOM(score.toFixed(0)));
									$('#youwin').show();
									$('#playAgain').hide();
									openModal('deathscreen');

									SAVE.haveWonOnce = true;
									localStorage.setItem("save",JSON.stringify(SAVE));
								}
							}
							break;
					}
				} else {
					enemyFrozen(i);
				}

				/*switch (name) {
					case 'eye_left':
						enemyWalkInDirection(i, rand_boss_dir);

						if (GAME.tick % 3 == 0) {
						GAME.map.addEntity('trap', GAME.map.entities[i].x, GAME.map.entities[i].y, {
							name: 'tears',
							movement: 'down',
							armed: true,
							timer: 8
						});
						}

						break;
					case 'eye_right':
						enemyWalkInDirection(i, rand_boss_dir);

						if (GAME.tick % 3 == 0) {
						GAME.map.addEntity('trap', GAME.map.entities[i].x, GAME.map.entities[i].y, {
							name: 'tears',
							movement: 'down',
							armed: true,
							timer: 8
						});
						}

						break;
					case 'lips':
						enemyWalkInDirection(i, rand_boss_dir);
						break;
				}*/

			} else if (GAME.map.entities[i].whatIsIt == 'trap') {
				GAME.map.entities[i].attr.timer--;

				if (GAME.map.entities[i].attr.timer <= 0) {
					trapsToRemove.push(i);

					if (GAME.map.entities[i].attr.name == 'bigtear') {
						GAME.map.addEntity(
							'enemy',
							GAME.map.entities[i].x,
							GAME.map.entities[i].y,
							ENTITY.enemy.rixen.attr
						);
					}
				}

				GAME.map.entities[i].x += DISP[GAME.map.entities[i].attr.movement].x-1;
				GAME.map.entities[i].y += DISP[GAME.map.entities[i].attr.movement].y-1;

			} else if (GAME.map.entities[i].whatIsIt == 'detail') { //waterfall splash!
				var n = GAME.map.entities[i].attr.name;
				if (
					n == 'spray_0' ||
					n == 'spray_1' ||
					n == 'spray_2' ||
					n == 'spray_3'
				) {
					GAME.map.entities[i].attr.name = 'spray_'+((GAME.tick+i)%4);
				} else if (
					n == 'shimmer'
				) {
					var base = 40; //default is 190
					var grad = 8;
					var multi = 2;
					var alt = (GAME.tick+(GAME.canv.h-GAME.map.entities[i].attr.fallHeight))%grad; //no fucking clue how this reverses it. but nice.
					var hsl = base + Math.abs(alt-grad-1) * multi;

					GAME.map.arr[GAME.map.entities[i].x][GAME.map.entities[i].y].colour = 'hsl(190,60%,'+hsl+'%)';
				} else if (
					n == 'foam_0' ||
					n == 'foam_1' ||
					n == 'foam_2' ||
					n == 'foam_3' ||
					n == 'foam_4' ||
					n == 'foam_5'
				) {
					GAME.map.entities[i].attr.name = 'foam_'+((GAME.tick+i)%6);
				}
			}
		}

		//BEAUTIFUL!
		//https://stackoverflow.com/questions/9882284/looping-through-array-and-removing-items-without-breaking-for-loop
		let t = trapsToRemove.length;
		while (t--) {
			GAME.map.entities.splice(trapsToRemove[t], 1);
		}

		easystar.calculate();

		for (let i = 0; i < GAME.map.entities.length; i++) {
			if (GAME.map.entities[i].x == GAME.player.x && GAME.map.entities[i].y == GAME.player.y) {
				if (GAME.map.entities[i].whatIsIt == 'enemy') {
					if (GAME.map.entities[i].attr.name == 'gungenthor') {
						var r = Math.random();

						if (r < 0.25) {
							GAME.player.x = 4;
							GAME.player.y = 4;
						} else if (r < 0.5) {
							GAME.player.x = GAME.canv.h-4;
							GAME.player.y = 4;
						} else if (r < 0.75) {
							GAME.player.x = GAME.canv.h-4;
							GAME.player.y = GAME.canv.h-4;
						} else {
							GAME.player.x = 4;
							GAME.player.y = GAME.canv.h-4;
						}
					} else {
						GAME.player.strength = GAME.player.strength*4;
						damageEnemy(i, GAME.player.damage);
						GAME.player.strength = GAME.player.strength/4;
					}
					renderPlayer();
					playerGetsHit();
				} else if (GAME.map.entities[i].whatIsIt == 'trap') { //traps
					if (GAME.map.entities[i].attr.armed == true) {
						GAME.map.entities.splice(i, 1);
						playerGetsHit();
					}
				}
			}
		}

		function playerGetsHit() {
			damage.play();

			GAME.lives--;

			if (GAME.lives < 0) {
				disableInput = true;
				$('#canvas, #entity_canvas').addClass('death');
				GAME.nighttime = true;
				$('#player').hide();
				GAME.showDir = false;
				GAME.map.arr[GAME.player.x][GAME.player.y] = new Tile('grave_1');
				render(GAME.map, 'mid');


				var score = calculateScore();

				setTimeout(function() {
					$('#score').html(getTextDOM(score.toFixed(0)));

					openModal('deathscreen');
				}, 3000);
			} else {
				playerTakesDamage();
				playerAction();
			}

			updHealth();
		}



		//deathzone
		if (GAME.zone == 24) {

			function spiralPrint(m, n, arr) {
			    let i, k = 0, l = 0;
			    /*
			        k - starting row index
			        m - ending row index
			        l - starting column index
			        n - ending column index
			        i - iterator 
			    */

			    var final = [];
			 
			    while (k < m && l < n) {
			        // print the first row from the remaining rows
			        for (i = l; i < n; ++i) {
		            	arr[k][i].x = k;
		            	arr[k][i].y = i;
			            final.push(arr[k][i]);
			        }
			        k++;
			 
			        // print the last column from the remaining columns
			        for (i = k; i < m; ++i) {
		            	arr[i][n - 1].x = i;
		            	arr[i][n - 1].y = n - 1;
			            final.push(arr[i][n - 1]);
			        }
			        n--;
			 
			        // print the last row from the remaining rows
			        if (k < m) {
			            for (i = n - 1; i >= l; --i) {
			            	arr[m - 1][i].x = m - 1;
			            	arr[m - 1][i].y = i;
			                final.push(arr[m - 1][i]);
			            }
			            m--;
			        }
			 
			        // print the first column from the remaining columns
			        if (l < n) {
			            for (i = m - 1; i >= k; --i) {
			            	arr[i][l].x = i;
			            	arr[i][l].y = l;
			                final.push(arr[i][l]);
			            }
			            l++;
			        }
			    }

			    return final;
			}

			var printed = spiralPrint(GAME.map.arr.length, GAME.map.arr[0].length, GAME.map.arr);

			//console.log("["+GAME.tick+"] // "+printed[GAME.tick].x+" "+printed[GAME.tick].y);

			if (!GAME.isBossDead) {
				GAME.map.arr[printed[GAME.tick+1].x][printed[GAME.tick+1].y].colour = getColor('bloody');
			}

		}




		//renderEnemies(GAME.map, 'mid', 100, true);
	}

	function renderEnemies(mapToRender, dir, speed, showEnemies) {
		function getEnemyDir(sx, sy, dx, dy) {
			if (sx == dx && sy == dy) {
				//enemy isn't moving
				return DISP.mid;
			} else {
				if (sy < dy) {
					return DISP.down;
				}
				else if (sy > dy) {
					return DISP.up;
				}
				else if (sx < dx) {
					return DISP.right;
				}
				else if (sx > dx) {
					return DISP.left;
				}
			}
		}

		//render enemies
		for (let w = 0; w < 100; w++) {
			setTimeout(function() {
				e_ctx.clearRect(entity_canvas.width*(DISP[dir].x-1), entity_canvas.height*(DISP[dir].y-1), entity_canvas.width, entity_canvas.height);
				
				//draw enemies

				//WE DID IT.
				//WE SOLVED WORLD HUNGER.
				var u = w; 
				if (!showEnemies) {
					u = 100;
				}

				for (let i = 0; i < mapToRender.entities.length; i++) {
					if (mapToRender.entities[i].whatIsIt == 'enemy') {
						let e = mapToRender.entities[i];

						var pogger = getEnemyDir(e.apx, e.apy, e.x, e.y);

						var pos = position(e.x + (pogger.x-1)*-1, e.y + (pogger.y-1)*-1, dir);

						var sx = e.sx();
						var sy = e.sy();

						if (mapToRender.entities[i].attr.name == 'ixtix' && GAME.tick % 64 > 64/2) {
							sx = mapToRender.entities[i].attr.ax*GAME.canv.size;
							sy = mapToRender.entities[i].attr.ay*GAME.canv.size;
						} else if (mapToRender.entities[i].attr.name == 'arko' && GAME.tick % 32 > 32/2) {
							sx = mapToRender.entities[i].attr.ax*GAME.canv.size;
							sy = mapToRender.entities[i].attr.ay*GAME.canv.size;
						}

						e_ctx.drawImage(
							numbers,
							sx,
							sy,
							32,
							32,
							pos.px + (u/100*GAME.canv.size)*(pogger.x-1),
							pos.py + (u/100*GAME.canv.size)*(pogger.y-1),
							GAME.canv.size,
							GAME.canv.size
						);

						if (e.attr.name == 'gungenthor') {
							e_ctx.drawImage(
								numbers,
								ENTITY.detail['left_eye_'+GAME.bossPhase].sx*32,
								ENTITY.detail['left_eye_'+GAME.bossPhase].sy*32,
								32,
								32,
								pos.px + (u/100*GAME.canv.size)*(pogger.x-1) - 32,
								pos.py + (u/100*GAME.canv.size)*(pogger.y-1),
								GAME.canv.size,
								GAME.canv.size
							);
							e_ctx.drawImage(
								numbers,
								ENTITY.detail['right_eye_'+GAME.bossPhase].sx*32,
								ENTITY.detail['right_eye_'+GAME.bossPhase].sy*32,
								32,
								32,
								pos.px + (u/100*GAME.canv.size)*(pogger.x-1) + 32,
								pos.py + (u/100*GAME.canv.size)*(pogger.y-1),
								GAME.canv.size,
								GAME.canv.size
							);
							e_ctx.drawImage(
								numbers,
								ENTITY.detail['lips_'+GAME.bossPhase].sx*32,
								ENTITY.detail['lips_'+GAME.bossPhase].sy*32,
								32,
								32,
								pos.px + (u/100*GAME.canv.size)*(pogger.x-1),
								pos.py + (u/100*GAME.canv.size)*(pogger.y-1),
								GAME.canv.size,
								GAME.canv.size
							);
						}

						if (e.attr.maxhp < 998 || e.attr.hp < 998) {
							if (mapToRender.entities[i].attr.name == 'arko' && GAME.tick % 32 > 32/2) {
								//dont draw a HP bar!
							} else {
								var barlength = e.attr.hp/e.attr.maxhp * GAME.canv.size;

								e_ctx.beginPath();
								e_ctx.rect(
									pos.px + (u/100*GAME.canv.size)*(pogger.x-1) +4,
									pos.py + (u/100*GAME.canv.size)*(pogger.y-1) +GAME.canv.size,
									GAME.canv.size-8,
									12
								);
								e_ctx.fillStyle = "#252525";
								e_ctx.fill();

								e_ctx.beginPath();
								e_ctx.rect(
									pos.px + (u/100*GAME.canv.size)*(pogger.x-1) +4,
									pos.py + (u/100*GAME.canv.size)*(pogger.y-1) +GAME.canv.size+4,
									barlength-8,
									4
								);
								e_ctx.fillStyle = "#ff0055";
								e_ctx.fill();
							}
						}
					} else if (mapToRender.entities[i].whatIsIt == 'trap') {
						let e = mapToRender.entities[i];

						e.apx = e.x + DISP[e.attr.movement].x-1;
						e.apy = e.y + DISP[e.attr.movement].y-1;

						var pogger = getEnemyDir(e.x, e.y, e.apx, e.apy);

						var pos = position(e.x + (pogger.x-1)*-1, e.y + (pogger.y-1)*-1, dir);

						e_ctx.drawImage(
							numbers,
							e.sx(),
							e.sy(),
							32,
							32,
							pos.px + (u/100*GAME.canv.size)*(pogger.x-1),
							pos.py + (u/100*GAME.canv.size)*(pogger.y-1),
							GAME.canv.size,
							GAME.canv.size
						);
					}
				}

				if (GAME.player.hasGun && GAME.power != '') {
					var playerPos = position(GAME.player.x-GAME.player.dir[0], GAME.player.y-GAME.player.dir[1], dir);

					e_ctx.drawImage(
						numbers,
						11*32,
						(24+GAME.player.scythe.skin)*32,
						32,
						32,
						playerPos.px + (w/100*GAME.canv.size)*GAME.player.dir[0],
						playerPos.py + (w/100*GAME.canv.size)*GAME.player.dir[1],
						GAME.canv.size,
						GAME.canv.size
					);
				}

				//render weapon!
				if (GAME.showDir && GAME.lives > -1) {
					if (GAME.player.targetFar) {
						for (let a=0; a < WEAPON[GAME.weapon].arr[0].length; a++) {
							for (let b=0; b < WEAPON[GAME.weapon].arr.length; b++) {

								var ww = WEAPON[GAME.weapon].arr[0].length;
								var wd = Math.floor(ww/2);

								var pos = position(GAME.player.x+a-wd-GAME.player.dir[0], GAME.player.y+b-wd-GAME.player.dir[1], dir);
								pos.px += (w/100*GAME.canv.size)*GAME.player.dir[0];
								pos.py += (w/100*GAME.canv.size)*GAME.player.dir[1];

								if (GAME.weaponMatrix.length > 0) { //just make sure it's defined
									if (GAME.weaponMatrix[a][b] == 1) {
										e_ctx.drawImage(numbers, 7*32, 11*32, 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
									} else if (GAME.weaponMatrix[a][b] == 2) {
										e_ctx.drawImage(numbers, 7*32, 11*32, 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size); //5*32, 10*32
									}
								}

							}
						}
						
						//the arrow
						var pos = position(GAME.player.x, GAME.player.y, dir);
						pos.px += (w/100*GAME.canv.size)*GAME.player.dir[0];
						pos.py += (w/100*GAME.canv.size)*GAME.player.dir[1];
						e_ctx.drawImage(numbers, 6*32, 11*32, 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
					} else {
						//when targetFar is false
						var pos = position(GAME.player.x-GAME.player.dir[0], GAME.player.y-GAME.player.dir[1], dir);
						pos.px += (w/100*GAME.canv.size)*GAME.player.dir[0];
						pos.py += (w/100*GAME.canv.size)*GAME.player.dir[1];
						e_ctx.drawImage(numbers, 2*32, 30*32, 32, 32, pos.px, pos.py, GAME.canv.size, GAME.canv.size);
					}
				}

				//boomerang recharge
				if (GAME.player.hasGun && GAME.player.scythe.hasReturn) {
					var playerPos = position(GAME.player.x-GAME.player.dir[0], GAME.player.y-GAME.player.dir[1], dir);

					var barlength = GAME.player.scythe.internalTick/GAME.player.scythe.internalMax * GAME.canv.size;
					console.log(barlength);

					e_ctx.beginPath();
					e_ctx.rect(
						playerPos.px + (w/100*GAME.canv.size)*GAME.player.dir[0],
						playerPos.py + (w/100*GAME.canv.size)*GAME.player.dir[1] + 32,
						GAME.canv.size,
						12
					);
					e_ctx.fillStyle = "#252525";
					e_ctx.fill();

					e_ctx.beginPath();
					e_ctx.rect(
						playerPos.px + (w/100*GAME.canv.size)*GAME.player.dir[0],
						playerPos.py + (w/100*GAME.canv.size)*GAME.player.dir[1] + 32 + 4,
						barlength,
						4
					);
					e_ctx.fillStyle = "hsl("+barlength+", 100%, 50%)";
					e_ctx.fill();
				}

			}, w*speed/100);
		}
	}

	function updHealth() {
		$('#lives').html('');

		if (GAME.lives < 0) {
			$('#lives').append('<div class="num grave"></div>');
		} else {
			for (let i=0; i < GAME.lives; i++) {
				$('#lives').append('<div class="num heart"></div>');
			}

			if (GAME.maxLives > GAME.lives) {
				for (let i=0; i < GAME.maxLives - GAME.lives; i++) {
					$('#lives').append('<div class="num heart heart_empty"></div>');
				}
			}
		}
	}

	function renderPlayer(val) {
		var ts = val ? val : 100;

		var vy = GAME.player.y*GAME.canv.size - canvas.height/3/2;
		var vx = GAME.player.x*GAME.canv.size - canvas.width/3/2;

		$('#player').css('transition',ts+'ms linear');

		$('#player').css({
			'top':'calc(50% + '+vy+'px)',
			'left':'calc(50% + '+vx+'px)'
		});
	}

	function updKills() {
		$('#kills').html(getTextDOM(GAME.kills));
	}

	function updZone() {
		$('#zone').html(getTextDOM(GAME.zone));
	}

	//sleepy time sleeping player sleep etc

	function goToSleep() {
		disableInput = true;

		GAME.nighttime = !GAME.nighttime;

		//day.night cycle
		var cycleTime = 4000;

		$('.cnvs, #player').addClass('fade');
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
							GAME.map.arr[x][y] = new Tile(rand(TILESET.undergrowth));
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
			$('.cnvs, #player').removeClass('fade');
			disableInput = false;
		}, cycleTime);
	}

	function randomPlaceOneMoney(x, y, thing, val) {
		open.play();

		var value = randInt(0,7);
		var coin = TILESET.treasure[value];
		var dirv = [0,1,2,3];

		var check = 4;
		while (check > 0) {
			var s = rand(dirv);
			var rng = DISP[DISP.dirs[s]];

			var idkx = x + rng.x - 1;
			var idky = y + rng.y - 1;

			if (idkx < 0) idkx = 0;
			if (idkx > GAME.canv.h-1) idkx = GAME.canv.h-1;
			if (idky < 0) idky = 0;;
			if (idky > GAME.canv.h-1) idky = GAME.canv.h-1;

			if (TILE[GAME.map.arr[idkx][idky].name].block != true) {

				//place the loot!
				if (thing == 'treasure' || thing == undefined) {
					GAME.map.addEntity('treasure', idkx, idky, {
						name: coin,
						value: value
					});
				} else if (thing == 'heart') {
					GAME.map.addEntity('heart', idkx, idky, {
						name: heartType(val),
						value: val
					});
				}

				check = 0;
			} else {
				dirv.splice(s, 1);
				check--;
			}
		}

		function heartType(value) {
			var ht = 'full';
			if (value < 2) {
				ht = 'half';
			} else if (value == 2) {
				ht = 'full';
			} else  if (value > 2) {
				ht = 'more';
			}
			return ht;
		}
	}

	function damageEnemy(i, dmg) {
		attack.play();

		GAME.map.entities[i].attr.hp -= dmg;

		if (GAME.map.entities[i].attr.hp > 0) { //attack enemy
			GAME.map.entities[i].x += GAME.player.dir[0]*GAME.player.strength;
			GAME.map.entities[i].y += GAME.player.dir[1]*GAME.player.strength;

			if (GAME.map.entities[i].attr.name == 'gyn') { //the gyn enemy teleports
				var ex = GAME.map.entities[i].x;
				var ey = GAME.map.entities[i].y;
				GAME.map.entities[i].x = randInt(ex-4, ex+4);
				GAME.map.entities[i].x = randInt(ey-4, ey+4);
			} else if (GAME.map.entities[i].attr.name == 'gungenthor') {
				//move gungenthor
				GAME.map.entities[i].x += GAME.player.dir[0]*GAME.player.strength*4;
				GAME.map.entities[i].y += GAME.player.dir[1]*GAME.player.strength*4;

				//move the player
				var r = Math.random();
				if (r < 0.25) {
					GAME.player.x = 4;
					GAME.player.y = 4;
				} else if (r < 0.5) {
					GAME.player.x = GAME.canv.h-4;
					GAME.player.y = 4;
				} else if (r < 0.75) {
					GAME.player.x = GAME.canv.h-4;
					GAME.player.y = GAME.canv.h-4;
				} else {
					GAME.player.x = 4;
					GAME.player.y = GAME.canv.h-4;
				}
				renderPlayer();

				//check if next boss phase starts
				if (GAME.map.entities[i].attr.hp == Math.round(GAME.map.entities[i].attr.maxhp*0.66)) {
					GAME.bossPhase = 1;
					GAME.map.entities[i].x = Math.floor(GAME.canv.h/2);
					GAME.map.entities[i].y = Math.floor(GAME.canv.h/2);
					boss.play();
					bigBoom(GAME.map.entities[i].x, GAME.map.entities[i].y, 1000, Math.floor(GAME.canv.h/2), 1, 2.5, false, 20, 100, 50);
				}
				if (GAME.map.entities[i].attr.hp == Math.round(GAME.map.entities[i].attr.maxhp*0.33)) {
					GAME.bossPhase = 2;
					GAME.map.entities[i].x = Math.floor(GAME.canv.h/2);
					GAME.map.entities[i].y = Math.floor(GAME.canv.h/2);
					ominous.play();
					bigBoom(GAME.map.entities[i].x, GAME.map.entities[i].y, 3000, GAME.canv.h, 6, 2.5, true, 0, 100, 40);
					setTimeout(function() {
						GAME.nighttime = true;
					}, 2900);
				}
			}

			//so the enemy may never exit
			if (GAME.map.entities[i].x < 0) GAME.map.entities[i].x = 0;
			if (GAME.map.entities[i].x > GAME.canv.h-1) GAME.map.entities[i].x = GAME.canv.h-1;
			if (GAME.map.entities[i].y < 0) GAME.map.entities[i].y = 0;
			if (GAME.map.entities[i].y > GAME.canv.h-1) GAME.map.entities[i].y = GAME.canv.h-1;

		} else { //kill enemy
			if (GAME.map.entities[i].attr.grave != undefined) {
				GAME.map.arr[GAME.map.entities[i].x][GAME.map.entities[i].y] = new Tile( GAME.map.entities[i].attr.grave );
			}

			if (GAME.map.entities[i].attr.name == 'gungenthor') {

				GAME.nighttime = false;
				bigBoom(GAME.map.entities[i].x, GAME.map.entities[i].y, 1000, GAME.canv.h, 1, 8, true, 0, 100, 40);

				setTimeout(function() {
					GAME.isBossDead = true; //boss is dead
					renderEnemies(GAME.map, 'mid', 0, true);

					hellscape = false;

					//reloads the world to fix colours
					for (let x=0;x<GAME.canv.h;x++) {
						for (let y=0;y<GAME.canv.h;y++) {
							GAME.map.arr[x][y] = new Tile(GAME.map.arr[x][y].name);
						}
					}

					render(GAME.map, 'mid');
				}, 1000);

			} else {
				//spawn money
				randomPlaceOneMoney(GAME.map.entities[i].x, GAME.map.entities[i].y);

				if (Math.random() <= GAME.chanceOf.enemyDropHeart) {
					randomPlaceOneMoney(GAME.map.entities[i].x, GAME.map.entities[i].y, 'heart', 1);
				}
			}

			GAME.map.entities.splice(i, 1);
			GAME.kills++;
			updKills();
		
			//exit fight
			var enemyCount = 0;
			for (let i=0; i < GAME.map.entities.length; i++) {
				if (GAME.map.entities[i].whatIsIt == 'enemy') {
					enemyCount++;
				}
			}
			console.log(enemyCount);
			if (enemyCount <= 0) {
				GAME.fightingBoss = false;
				$('#riverarrow').show();
			}
		}
	}

	function tryToCollect(cx, cy) {
		var areAttacking = false;

		//firstly, try to attack the enemy
		for (let i=0; i < GAME.map.entities.length; i++) {
			if (GAME.map.entities[i].x == cx && GAME.map.entities[i].y == cy) {
				if (GAME.map.entities[i].whatIsIt == 'enemy') {
					if (GAME.map.entities[i].attr.name == 'arko' && GAME.tick % 32 > 32/2) {
						//dont hurt him, he's a little dog!
					} else {
						damageEnemy(i, GAME.player.damage);
						renderEnemies(GAME.map, 'mid', 0, true);
						render(GAME.map, 'mid');
						areAttacking = true;
					}
				} else if (GAME.map.entities[i].whatIsIt == 'trap') { //you can interact with traps to delete them
					GAME.map.entities.splice(i, 1);
					render(GAME.map, 'mid');
				}
			}
		}

		//then, change the tile (if you aren't attacking!)
		if (cx >= 0 && cx <= GAME.canv.h-1 && cy >= 0 && cy <= GAME.canv.h-1) {
			var tname = GAME.map.arr[cx][cy].name;

			if (GAME.player.x < cx-1 || GAME.player.x > cx+1 || GAME.player.y < cy-1 || GAME.player.y > cy+1) {
				//false
			} else if (!areAttacking) {
				if (TILE[tname].change != undefined) { //first check for possible change
					chop.play();

					GAME.map.arr[cx][cy] = new Tile(TILE[tname].change); //change it

					if (TILE[tname].drops != undefined) {
						for (let i = 0; i < TILE[tname].drops.length; i++) {
							var drops = TILE[tname].drops[i];
							if (Math.random() <= drops.c) {
								addItem(drops.n, randInt(drops.mi, drops.ma));
							}
						}
					}

					if (TILE[tname].isLoot == true) { //if the item is a chest, barrel, etc.
						randomPlaceOneMoney(cx, cy);

						if (Math.random() <= GAME.chanceOf.lootDropHeart) {
							randomPlaceOneMoney(cx, cy, 'heart', 1);
						}
					}

					render(GAME.map, 'mid');
					playerAction();
				} else if (tname == 'ground' && GAME.selected != '') { //if you're pressing Z on a ground tile you can place things!

					if (GAME.selected == 'rockwall') {
						GAME.map.arr[cx][cy] = new Tile( rand(TILESET.rockwall) );
						removeItem(GAME.selected, 1);
					} else if (GAME.selected == 'flowers') {
						GAME.map.arr[cx][cy] = new Tile( rand(TILESET.flowers) );
						removeItem(GAME.selected, 1);
					} else if (GAME.selected == 'leaves') {
						GAME.map.arr[cx][cy] = new Tile( rand(TILESET.leaves) );
						removeItem(GAME.selected, 1);
					} else if (GAME.selected == 'acorn') {
						GAME.map.arr[cx][cy] = new Tile( 'sapling' );
						removeItem(GAME.selected, 1);
					} else { //default to whatever TILE is written in the drops section
						GAME.map.arr[cx][cy] = new Tile( GAME.selected );
						removeItem(GAME.selected, 1);
					}

					render(GAME.map, 'mid');
					playerAction();
				} else {
					//console.log('pressed Z, selected tile has no drops, no change, not ground');
				}
			}
		}

		//finally, if you are in the spire room attempt to craft a recipe.
		/*if (GAME.map.roomType == 'spire') { //are you in a crafting room?
			//creates an array of the floor items
			var onTheFloor = [[],[]];
			for (let x=0; x < 4; x++) {
				for (let y=0; y < 4; y++) {
					if (x == 0 && y != 0) {
						onTheFloor[0].push(GAME.map.arr[x+8][y+10].name);
					} else if (y == 0 && x != 0) {
						onTheFloor[1].push(GAME.map.arr[x+8][y+10].name);
					}
				}
			}

			//checks whether this array can create a rune
			function allValuesSame(arr) {
				for (let i = 0; i < arr.length; i++) {
					if (arr[i] != arr[0]) {
						return false;
					}
				}
				return true;
			}

			if (allValuesSame(onTheFloor[0]) && allValuesSame(onTheFloor[1])) {
				if (TILESET.collectables.indexOf(onTheFloor[0][0]) != -1 && TILESET.collectables.indexOf(onTheFloor[1][0]) != -1) {
					var gridRef = {
						zero: TILESET.collectables.indexOf(onTheFloor[0][0]),
						one: TILESET.collectables.indexOf(onTheFloor[1][0])
					}

					var idOfRune = RECIPE.grid[gridRef.zero][gridRef.one]-1; //minus one because the table uses zero as 'no combination'
				
					if (idOfRune >= 0) { //you can't combine two of the same collectable
					var runeToGive = TILESET.runes[idOfRune];

					//add the rune to the floor
					GAME.map.addEntity('rune', 10, 12, {
						name: runeToGive
					});

					//remove the items
					for (let x=0; x < 4; x++) {
						for (let y=0; y < 4; y++) {
							if (x == 0 && y != 0) {
								GAME.map.arr[x+8][y+10] = new Tile('ground');
							} else if (y == 0 && x != 0) {
								GAME.map.arr[x+8][y+10] = new Tile('ground');
							}
						}
					}

					magicalExplosion(10, 12, ENTITY.rune[runeToGive].attr.hslBase);
					}
				} else {
					console.log('values the same, not a recipe tho');
				}
			}
		}*/

		if (GAME.map.roomType == 'spire') {
			//the double-item thing
			var fx = 15;
			var fy = 13;
			var onTheFloor = GAME.map.arr[fx][fy].name;

			var isCollectable = false;
			for (let j=0; j < TILESET.collectables.length; j++) {
				if (onTheFloor == TILESET.collectables[j]) {
					isCollectable = true;
					break;
				}
			}

			if (onTheFloor != 'ground' && isCollectable) {
				GAME.map.arr[fx][fy] = new Tile('ground');

				if (Math.random() < 0.45) {
					GAME.map.arr[fx-1][fy+2] = new Tile(onTheFloor);
					GAME.map.arr[fx+1][fy+2] = new Tile(onTheFloor);
					bigBoom(fx, fy, 1000, GAME.canv.h, 12, 1, true, 60, 100, 50);
					success.play();
				} else {
					//GAME.map.arr[fx][fy] = new Tile('dust');
					bigBoom(fx, fy, 1000, GAME.canv.h, 1, 8, true, 0, 100, 100);
					fail.play();
				}
			}
			//////////

			//the exchange item thing
			var ex = 9;
			var ey = 13;
			var exFloor = GAME.map.arr[ex][ey].name;

			var isCollectable = false;
			for (let j=0; j < TILESET.collectables.length; j++) {
				if (exFloor == TILESET.collectables[j]) {
					isCollectable = true;
					break;
				}
			}

			if (exFloor != 'ground' && isCollectable) {
				GAME.map.arr[ex][ey] = new Tile('ground');

				if (Math.random() < 0.45) {
					GAME.map.arr[ex][ey+2] = new Tile(rand(TILESET.collectables));
					bigBoom(ex, ey, 1000, GAME.canv.h, 12, 1, true, 120, 100, 50);
					success.play();
				} else {
					bigBoom(ex, ey, 1000, GAME.canv.h, 1, 8, true, 0, 100, 100);
					fail.play();
				}
			}
			//////////

			//AND FINALLY, THE 8 COLLECTABLES ASSEMBLED
			var cx = 9;
			var cy = 8;

			var listOfCollectables = TILESET.collectables.slice(0);

			for (let a=0;a<3;a++) {
				for (let b=0;b<3;b++) {
					if (a==0 && b==0) {
						//don't bother with the top left square
					} else {
						if (listOfCollectables.indexOf(GAME.map.arr[cx+a][cy+b].name) >= 0) {
							listOfCollectables.splice(listOfCollectables.indexOf(GAME.map.arr[cx+a][cy+b].name), 1);
						}
					}
				}
			}

			if (listOfCollectables.length == 0) {
				for (let a=0;a<3;a++) {
					for (let b=0;b<3;b++) {
						GAME.map.arr[cx+a][cy+b] = new Tile('ground');
					}
				}

				cx += 5;
				cy += 1;

				GAME.map.addEntity('item', cx, cy, { name: 'extraLife',
					cost: 0
				});

				bigBoom(cx, cy, 1000, GAME.canv.h, 12, 1, true, 0, 100, 50);
				coin.play();
			}

			//////////
		}
	}

	function playerAction() {
		$('#player').addClass('animate');
		setTimeout(function() {
			$('#player').removeClass('animate');
		}, 300);
	}

	/*$('#game').on('click', function(e) {
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
	});*/

	//action text for hovering, decided not to do, think mobile first
	/*
	$('body').on('mousemove', function(e) {
		var x = e.pageX;
		var y = e.pageY;

		$('#info').css({
			'top':y+'px',
			'left':x+'px'
		});
	});

	$('#inv').on('mouseleave', '.slot', function() {
		$('#info').hide();
	});

	$('#runes').on('mouseleave', '.rune', function() {
		$('#info').hide();
	});

	$('#inv').on('mouseenter', '.slot', function() {
		if ($(this).hasClass('item')) {
			var foundClass = $(this).find('.img').attr('class').replace('img ','');
			$('#info').html(getTextDOM(foundClass));
			$('#info').show();
		} else {
			$('#info').hide();
		}
	});

	$('#runes').on('mouseenter', '.rune', function() {
		var foundColour = $(this).attr('class').replace('rune ','');

		$('#info').html(getTextDOM(foundColour));

		$('#info').show();
	});
	*/
	//end action test hover






	function slideWorld(dir) {
		if (GAME.zone == 24) {
			ominous.play();
		} else {
			door.play();
		}

		disableInput = true;

		GAME.tick = -1;

		GAME.nextSpot = create();
		render(GAME.nextSpot, dir);
		renderEnemies(GAME.nextSpot, dir, 0, true);

		$('.cnvs').css({
			'top':-1*DISP[dir].y*100+'%',
			'left':-1*DISP[dir].x*100+'%'
		});

		setTimeout(function() {
			$('.cnvs').css('transition','0ms');

			GAME.map = GAME.nextSpot;
			render(GAME.map, 'mid');
			renderEnemies(GAME.map, 'mid', 0, true);

			$('.cnvs').css({
				'top':'-100%',
				'left':'-100%'
			});

			disableInput = false;
		}, GAME.speed);

		$('.cnvs').css('transition',GAME.speed+'ms linear');

		//this is for sliding the world down, which is the only one supported right now
		seedDisplacement += GAME.canv.h;

		//to eliminate soft-locking situations where the player throws their scythe and then leaves. feels like the right thing to do
		if (GAME.player.hasGun) {
			GAME.power = 'gunslinger';
			p_ctx.clearRect(0,0,canvas.width,canvas.height);
		}
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

	function updPower() {
		$('#power').html(getTextDOM(GAME.power));
	}













	//last minute inits
	GAME.map = create();
	render(GAME.map, 'mid');

	updKills();
	updHealth();
	updZone();
	updPower();
	updIC();

	changeDir('down');
	renderPlayer();


	//modal stuff
	$('.modal_open').on('click', function() {
		var id = $(this).attr('id');
		openModal(id);
	});

	function openModal(id) {
		$('#modal_bg').fadeIn();
		$('.modal').hide();
		$('#'+id+'.modal').show();
	}

	$('.modal_close').on('click', function() {
		closeModal();
	});

	/*$('#modal_bg').on('click', function(e) {
		if (e.target !== this) return;
		closeModal();
	});*/

	function closeModal() {
		$('#modal_bg').fadeOut();
	}

	//$('#modal_bg').hide();
	$('#startscreen').show();
	$('#modal_bg').css('opacity','1');

	$('#startbtn').on('click', function() {
		$('#start-main').slideUp();
		$('#lives-choice').slideDown();
	});

	$('.btn').on('click', function() {
		click.play();
	});

	$('.heart_tile').on('mouseenter', function() {
		move.play();
		var attr = $(this).attr('id');

		$('#difficulties > div').hide();
		$('#difficulties > div#'+attr).show();

		$('.convert#creative').hide();
		if (attr == 'creative') {
			$('.convert#creative').show();
		}
	});

	$('.heart_tile').on('click', function() {
		var attr = $(this).attr('id');
		if (attr == 'easy') {
			note.play();

			GAME.maxLives = 6;
			GAME.lives = 6;
		} else if (attr == 'medi') {
			coin.play();

			GAME.maxLives = 4;
			GAME.lives = 4;
		} else if (attr == 'hard') {
			ominous.play();

			GAME.maxLives = 2;
			GAME.lives = 2;
		} else if (attr == 'creative') {
			creativeMode = true;

			GAME.map = create();
			render(GAME.map, 'mid');

			//all the items!
			for (let i=0; i < TILESET.creativeItems.length; i++) {
				addItem(TILESET.creativeItems[i], 999);
			}

			$('body').addClass('creative');
		}
		GAME.difficulty = attr;
		updHealth();
		closeModal();

		startscreen = false;

		setTimeout(function() {
			if (!music.playing()) {
				music.play();
			}
		}, 1000);
	});

	$('#playAgain').on('click', function() {
		location.reload();
		return false; //https://stackoverflow.com/questions/3715047/how-to-reload-a-page-using-javascript
	});

	$('.volume_slider').on('mouseup', '.bop', function() {
		var ind = $(this).index();
		var newVolume = (ind+1)/10;

		var id = $(this).parent().attr('id');
		if (id == 'sounds_slider') {
			Howler.volume(newVolume);
		} else {
			music.volume(newVolume);
		}

		move.play();

		$('#'+id).find('.bop').removeClass('on');
		for (let i=0; i < ind+1; i++) {
			$('#'+id).find('.bop').eq(i).addClass('on');
		}
	});

	$('.mute').on('click', function() {
		var id = $(this).attr('id');
		if (id == 'sounds_mute') {
			Howler.volume(0);
			$('.volume_slider .bop').removeClass('on');
		} else {
			music.volume(0);
			$('#music_slider .bop').removeClass('on');
		}
	});

	$('#reset').on('click', function() {
		//localStorage.removeItem("save");
		localStorage.clear();
	});



	function newRune(id) {
		GAME.rune.bag.push(new Rune(id));
		var len = GAME.rune.bag.length-1;
		$('#runes').append('<li class="rune '+GAME.rune.bag[len].name+'"></li>');
	}

	//newRune(0);
	//newRune(1);

	//runes swapping
	$("#belt").on('click', '.rune', function () {
		var ind = $(this).index();
		GAME.rune.belt[ind].moveTo(ind, GAME.rune.belt, GAME.rune.bag);

		$(this).remove().appendTo('#runes');
	});

	$("#runes").on('click', '.rune', function () {
		if ($('#belt li').length < 5) { //only max. 5 allowed on the belt
			var ind = $(this).index();
			GAME.rune.bag[ind].moveTo(ind, GAME.rune.bag, GAME.rune.belt);

			$(this).remove().prependTo('#belt');
		}
	});





	//add selected stuff
	$('#inv').on('click', '.slot', function() {
		if ($(this).hasClass('item')) {
			selectItem($(this).index());
		}
	});

	$('#inv').on('click', function(e) {
		if(e.target !== e.currentTarget) return; //https://stackoverflow.com/questions/2364629/jquery-stop-child-triggering-parent-event
		selectItem(-1); //no item selected
	});

	function selectItem(pos) {
		if (pos < 0) { //-1 input makes no item selected

			$('#inv .item').removeClass('selected');
			GAME.selected = '';

		} else if (pos >= $('#inv .item').length) {
			//nothing, this is here for the 1-9 keys
		} else {

			var clas = $('#inv .item').eq(pos).find('.img').attr('class').replace('img ','');
			GAME.inv[clas].chooseItem();

		}
	}



	/*

	//inventory drag+drop
	var held = {};
	var heldFor = 0;
	var heldMax = 300;
	var interval;
	var tickspeed = 10;

	$('#inv').on('mousedown', '.slot', function() {
		if ($(this).hasClass('item')) {

			//add selected stuff
			$('.item').removeClass('selected');
			$(this).addClass('selected');
			var clas = $(this).find('.img').attr('class').replace('img ','');
			GAME.selected = clas;

			//first vars
			var invArray = Object.keys(GAME.inv);
			var clickPos = $(this).index();

			interval = setInterval(function() {
				heldFor += tickspeed;

				if (heldFor >= heldMax) {
					clearInterval(interval);
					heldFor = 0;

					//pick up item
					for (x in GAME.inv) {
						if (GAME.inv[x].a == clickPos) {
							held = GAME.inv[x];
							break;
						}
					}
					removeItem(held.name);

					//draw in #info
					$('#info').html('<div class="slot item selected"><span class="img"></span>'+getTextDOM(held.amt)+'</div>');
					$('#info').find('.img').css({
						'background-color': getColor(TILE[held.name].colour, true),
						'background-position': TILE[held.name].sx*32*-1+'px '+TILE[held.name].sy*32*-1+'px'
					});
				}
			}, tickspeed);
		} else {
			$('.item').removeClass('selected');
			GAME.selected = '';
		}
	});

	$('#inv').on('mouseup', '.slot', function() {
		//clear held internval
		clearInterval(interval);
		heldFor = 0;

		//remove #info
		$('#info').html('');

		//first vars
		var clickPos = $(this).index();

		if (jQuery.isEmptyObject(held)) {
			//there no held, so nothing to do
		} else {
			if ($(this).hasClass('item')) {
				//you have something held, but are dropping in a non-empty space
				addItem(held.name, held.amt);
			} else {
				addItem(held.name, held.amt, clickPos);
			}
			held = {};
		}
	});

	*/

	//explain the runes!
	for (let i=0; i < TILESET.runes.length; i++) {
		$('#runesInfo').append('<div class="layer"></div>');
		$('#runesInfo .layer').eq(i).append('<div class="num '+TILESET.runes[i]+'_sml"></div>');
		$('#runesInfo .layer').eq(i).append('<div class="num blank"></div>');
		$('#runesInfo .layer').eq(i).append(getTextDOM(ENTITY.rune[TILESET.runes[i]].attr.desc));
	}

	//write all the pixelly text (can't believe it took so long for me to do this)

	for (let i=0; i < $('.convert').length; i++) {
		$('.convert').eq(i).html(getTextDOM($('.convert').eq(i).text()));
	}



	/*addItem('cornflower',3);
	addItem('twig',3);*/

}); //end of on.load






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

function circlePoint(x, y) {
	function farVal() { //findFarthestDist
		var distanceX = (Math.floor(GAME.canv.h/2) - 0) * (Math.floor(GAME.canv.h/2) - 0);
		var distanceY = (Math.floor(GAME.canv.h/2) - 0) * (Math.floor(GAME.canv.h/2) - 0);
		var distanceToCenter = Math.sqrt(distanceX + distanceY);
		return distanceToCenter = distanceToCenter / (GAME.canv.h/2);
	}

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

	return t;
}

function position(vx, vy, dir) { //value
	var x = GAME.canv.size * (vx + GAME.canv.h*DISP[dir].x);
	var y = GAME.canv.size * (vy + GAME.canv.h*DISP[dir].y);

	return {
		px: x,
		py: y
	}
}

function calculateScore() {
	//calculate score
	var score = 0;
	score += GAME.kills*2;
	score += GAME.itemsCollected*0.5;
	score += GAME.money;
	if (GAME.difficulty == 'easy') {
		score = score*0.5;
	} else if (GAME.difficulty == 'hard') {
		score = score*2;
	}
	console.log('score: '+score+' score.toFixed(0): '+score.toFixed(0));

	return score;
}

function getColor(colour, isFlat) {
	var hsl;

	switch (colour) {
		case 'green':
			hsl = { h: { mi: 80, ma: 140 },
					s: { mi: 20, ma: 100 },
					l: { mi: 30, ma: 80 }}
			break;
		case 'foliage':
			hsl = { h: { mi: 80, ma: 140 },
					s: { mi: 20, ma: 80 },
					l: { mi: 20, ma: 40 }}
			break;
		case 'desert':
			hsl = { h: { mi: 10, ma: 50 },
					s: { mi: 20, ma: 100 },
					l: { mi: 40, ma: 60 }}
			break;
		case 'dustypink':
			hsl = { h: { mi: 10, ma: 25 },
					s: { mi: 40, ma: 80 },
					l: { mi: 60, ma: 70 }}
			break;
		case 'flowers':
			hsl = { h: { mi: 180, ma: 330 },
					s: { mi: 50, ma: 100 },
					l: { mi: 60, ma: 80 }}
			break;
		case 'shiny':
			hsl = { h: { mi: 45, ma: 65 },
					s: { mi: 90, ma: 100 },
					l: { mi: 50, ma: 60 }}
			break;
		case 'blue':
			hsl = { h: { mi: 180, ma: 200 },
					s: { mi: 20, ma: 100 },
					l: { mi: 40, ma: 60 }}
			break;
		case 'grey':
			hsl = { h: { mi: 200, ma: 250 },
					s: { mi: 5, ma: 15 },
					l: { mi: 40, ma: 60 }}
			break;
		case 'white':
			hsl = { h: { mi: 0, ma: 0 },
					s: { mi: 0, ma: 0 },
					l: { mi: 100, ma: 100 }}
			break;
		case 'black':
			hsl = { h: { mi: 0, ma: 0 },
					s: { mi: 0, ma: 0 },
					l: { mi: 0, ma: 0 }}
			break;
		case 'bloody':
			hsl = { h: { mi: 0, ma: 10 },
					s: { mi: 75, ma: 100 },
					l: { mi: 45, ma: 55 }}
			break;
		case 'logcabin':
			hsl = { h: { mi: 10, ma: 20 },
					s: { mi: 30, ma: 50 },
					l: { mi: 40, ma: 50 }}
			break;
		case 'orange':
			hsl = { h: { mi: 0, ma: 30 },
					s: { mi: 80, ma: 100 },
					l: { mi: 50, ma: 60 }}
			break;
		case 'sand':
			hsl = { h: { mi: 30, ma: 50 },
					s: { mi: 25, ma: 75 },
					l: { mi: 60, ma: 80 }}
			break;
		case 'pinky':
			hsl = { h: { mi: 340, ma: 350 },
					s: { mi: 50, ma: 75 },
					l: { mi: 60, ma: 70 }}
			break;
		case 'blurple':
			hsl = { h: { mi: 240, ma: 250 },
					s: { mi: 50, ma: 75 },
					l: { mi: 60, ma: 70 }}
			break;
		case 'offwhite':
			hsl = { h: { mi: 0, ma: 360 },
					s: { mi: 40, ma: 60 },
					l: { mi: 80, ma: 90 }}
			break;
		case 'autumn':
			hsl = { h: { mi: 0, ma: 150 },
					s: { mi: 45, ma: 65 },
					l: { mi: 40, ma: 60 }}
			break;
		default:
			return 'transparent';
	}

	if (isFlat == undefined) {
		return 'hsl('+randInt(hsl.h.mi, hsl.h.ma)+','+randInt(hsl.s.mi, hsl.s.ma)+'%,'+randInt(hsl.l.mi, hsl.l.ma)+'%)';
	} else {
		return 'hsl('+(hsl.h.mi+hsl.h.ma)/2+','+(hsl.s.mi+hsl.s.ma)/2+'%,'+(hsl.l.mi+hsl.l.ma)/2+'%)';
	}
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

function getRandomHSL(base) {
	return 'hsl('+randInt(base-50, base+50)+', 50%, 50%)';
}

function getTextDOM(string) {
	var final = '';
	var textS = string.toString();
	final += '<div class="word">';
	for (let i=0; i < textS.length; i++) {
		final += '<div class="num ';
		if (textS.charAt(i) == ' ') {
			final += 'blank';
		} else if (textS.charAt(i) == '.') {
			final += 'dot';
		} else if (textS.charAt(i) == ',') {
			final += 'comma';
		} else if (textS.charAt(i) == ':') {
			final += 'colon';
		} else if (textS.charAt(i) == '(') {
			final += 'lb';
		} else if (textS.charAt(i) == ')') {
			final += 'rb';
		} else if (textS.charAt(i) == '/') {
			final += 'slash';
		} else if (textS.charAt(i) == '@') {
			final += 'fullheart';
		} else if (textS.charAt(i) == '#') {
			final += 'coins';
		} else if (textS.charAt(i) == '%') {
			final += 'quote';
		} else if (textS.charAt(i) == '^') {
			final += 'rixen';
		} else if (textS.charAt(i) == '<') {
			final += 'ltb';
		} else if (textS.charAt(i) == '>') {
			final += 'rtb';
		} else if (textS.charAt(i) == "'") {
			final += 'apostrophe';
		} else if (textS.charAt(i) == '!') {
			final += 'em';
		} else if (textS.charAt(i) == '?') {
			final += 'qm';
		} else {
			//if it's a number, write the number. default: return original value
			final += numToWord(textS.charAt(i));
		}
		final += '"></div>';

		if (textS.charAt(i) == ' ') {
			final += '</div><div class="word">';
		}
	}
	final += '</div>';
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
			return num;
	}
}