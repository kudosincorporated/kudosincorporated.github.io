//EASYSTAR
var easystar = new EasyStar.js();

var GAME = {};

const HEIGHT = 25;
const MIDDLE = Math.floor(HEIGHT/2);
const SIZE = 32;
const RATIO = 64;
const PERLIN = 8;
const DEFAULT_SPEED = 25;
var SPEED = 25;

var KEYDOWN = [];

var WORLDPOS = 0;
var NIGHTTIME = false;
var ROOM_NUMBER = -1;
var KEYBOARDLOCK = false;
var TURN = 0;
var SCYTHE_GAME = false; //Did the player pick up the scythe at the start?
var RIVER_DOOR = MIDDLE;

var ANIM = {
	tick: 0,
	maxTick: 99999,
	speeds: [20,40,60,1],
	sprite: [4,6,8,100],
	frame: [
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0],
		[0, 0, 0, 0]
	]
}

const DIRS = [
	[1, 0],
	[0, 1],
	[-1,0],
	[0,-1]
];

var CHANCE = {
	spawn: {
		burrow: 0.025,
		loot: 0.025,
		forage: 0.025,
		enemy: 0.010
	},
	tear_to_enemy: 0.15,
	alchemy: {
		exchangeFail: 0.25,
		duplicateFail: 0.50,
	},
	greed: {
		loot: 0.15,
		heart: 0.25,
	}
}

const SHOP = {
	power_upgrade: {
		cost: 300,
	},
	greedy_upgrade: {
		cost: 100,
	},
	explode_upgrade: {
		cost: 200,
	}
}

const EXPLODE = {
	hurt: {
		color: 'hurt',
		size: 0.2,
		weight: 0.25,
	},
	fail: {
		color: 'white',
		size: 0.25,
		weight: 0.25,
	},
	spark: {
		color: 'spark',
		size: 0.33,
		weight: 0.66,
	},
	boss: {
		color: 'bloody',
		size: 1,
		weight: 1,
	},
	power_upgrade: 		{ color: 'blue', size: 0.33, weight: 0.66, },
	greedy_upgrade: 	{ color: 'desert', size: 0.33, weight: 0.66, },
	explode_upgrade: 	{ color: 'green', size: 0.33, weight: 0.66, },
}

const TILESET = {
	trees_and_rocks: ['tree_1','tree_2','tree_3','tree_4','rock_1','rock_2','rock_3','rock_4'],
	trees: ['tree_1','tree_2','tree_3','tree_4'],
	rocks: ['rock_1','rock_2','rock_3','rock_4'],
	dense: ['weed_1','weed_2','weed_3','pebbles'],
	light: ['grass_1','grass_2','ground','ground'],
	cliff: ['cliff_1','cliff_2'],
	coins: ['coin_1','coin_2','coin_3','coin_4','coin_5','coin_6','coin_7','coin_8'],
	collectables: ['twig','bark','feather','leaf','dandelion','cornflower','berries','branch'],
	loot: ['crate_1','vase_1','barrel_1','chest_1'],
	burrows: ['burrow_1'], //'nest_1','hollow_1','den_1'
	river: ['river','river','river','river','river_anim'],
	clearing: ['rock_1','rock_2','grass_1','grass_2','tree_1','tree_2','tree_3','tree_4'],
	bones: ['bones_1','bones_2','bones_3','bones_4'],
	talltrees: ['canopy_1','canopy_2','canopy_3','canopy_4','trunk_1','trunk_2','trunk_1'],
	bigrocks: ['rock_5','rock_6'],
	falldense: ['flowers_1','flowers_2','weed_3','pebbles'],
	falllight: ['grass_1','grass_2','seeds_1','seeds_2'],
	boulder: ['boulder_1','boulder_2'],
	ocean: ['ocean_1','ocean_2','ocean_3'],
	sand: ['sand_1','sand_2','pebbles','ground','ground'],
	cave: ['drip_1','drip_2','drip_3','grass_1','grass_2','weed_3'],
	weeds: ['grass_1','grass_2','weed_1','weed_2','weed_3'],
	domer: [ //50% chance of lootbox
		'crate_1','vase_1','barrel_1','chest_1',
		'crate_2','vase_2','barrel_2','chest_2'
	],
	spire: [ //40% chance of craftable
		'twig', 	'bark', 	'feather', 	'leaf', 	'dandelion', 	'cornflower', 	'berries', 	'branch',
		'pot_1', 	'pot_1', 	'pot_1', 	'pot_1', 	'pot_2', 		'pot_2', 		'pot_2', 	'pot_2',
		'pot_1', 	'pot_1', 	'pot_1', 	'pot_1'
	],
	treewall: ['treewall_1','treewall_2'],
	leaves: ['leaves_1','leaves_2'],
	//enemies
	can_hurt_you: [
		'smarg', // Red
		'rixen', // Blue
		'derva', // Green
		'trull', // Orange
		'xrrow', // Pink
		'gyn',   // Purple
		'kong',  // Yellow
		'rwck',  // Brown
		'creepa',
		'odango',
		'moonman',
		'pointa',
		'xapmat',
		'modnoc',
		'mozzie',
		'dingo',
		'xapmat_atk',
		'modnoc_atk',
		'xrrow_atk',
		'kong_atk',
		'gungenthor'
	],
	enemy_river: ['rixen'],
	enemy_forest_light: ['smarg'],
	enemy_forest_dense: ['derva','trull'],
	enemy_tundra_light: ['xapmat','modnoc'],
	enemy_tundra_dense: ['mozzie','dingo'],
	darkRooms: [
		'setCave',
		'setStump',
		'setSmall',
		'setTower',
	]
}

const TILE = {
	ground: 	{ 	sx: 1, sy: 0, 	color: '' },
	square: 	{ 	sx: 1, sy: 1, 	color: 'offwhite' },

	grass_1: 	{ 	sx: 4, sy: 4, 	color: 'foliage',	destroy: 'ground' },
	grass_2: 	{ 	sx: 5, sy: 4, 	color: 'foliage', 	destroy: 'ground' },
	weed_1: 	{ 	sx: 6, sy: 4, 	color: 'foliage', 	destroy: 'ground' },
	weed_2: 	{ 	sx: 7, sy: 4, 	color: 'foliage', 	destroy: 'ground' },
	weed_3: 	{ 	sx: 0, sy: 7, 	color: 'foliage', 	destroy: 'ground' },

	tree_1: 	{ 	sx: 0, sy: 4, 	color: 'green', 	block: true, 	destroy: 'stump' },
	tree_2: 	{ 	sx: 1, sy: 4, 	color: 'green', 	block: true, 	destroy: 'stump' },
	tree_3: 	{ 	sx: 2, sy: 4, 	color: 'green', 	block: true, 	destroy: 'stump' },
	tree_4: 	{ 	sx: 3, sy: 4, 	color: 'green', 	block: true, 	destroy: 'stump' },

	stump: 		{ 	sx: 3, sy: 7, 	color: 'green', 	block: true, 	destroy: 'ground' },
	pebbles: 	{ 	sx: 1, sy: 7, 	color: 'sand', 		block: false, 	destroy: 'ground' },

	rock_1: 	{ 	sx: 0, sy: 5, 	color: 'desert', 	block: true, 	destroy: 'pebbles' },
	rock_2: 	{ 	sx: 1, sy: 5, 	color: 'desert', 	block: true, 	destroy: 'pebbles' },
	rock_3: 	{ 	sx: 2, sy: 5, 	color: 'desert', 	block: true, 	destroy: 'pebbles' },
	rock_4: 	{ 	sx: 3, sy: 5, 	color: 'desert', 	block: true, 	destroy: 'pebbles' },
	rock_5: 	{ 	sx: 4, sy: 7, 	color: 'desert', 	block: true, 	destroy: 'pebbles' },
	rock_6: 	{ 	sx: 5, sy: 7, 	color: 'desert', 	block: true, 	destroy: 'pebbles' },

	cliff_1: 	{ 	sx: 4, sy: 7, 	color: 'logcabin', 	block: true },
	cliff_2: 	{ 	sx: 5, sy: 7, 	color: 'logcabin', 	block: true },
	boulder_1: 	{ 	sx: 4, sy: 7, 	color: 'grey', 		block: true },
	boulder_2: 	{ 	sx: 5, sy: 7, 	color: 'grey', 		block: true },

	river: 		{ 	sx: 8, sy: 4, 	color: 'blue' },
	river_anim: { 	sx: 8, sy: 4, 	color: 'blue', 	anim: [2,0] },
	waterfall: 	{ 	sx: 9, sy: 4, 	color: 'blue', 	anim: [0,0], 	block: true },
	w_fall_end: { 	sx: 9, sy: 4, 	color: 'blue', 	anim: [0,0], 	block: true, 	overlay: [22,0] },
	ocean_1: 	{ 	sx: 11, sy: 4, 	color: 'ocean', 	block: true },
	ocean_2: 	{ 	sx: 11, sy: 5, 	color: 'ocean', 	block: true },
	ocean_3: 	{ 	sx: 11, sy: 6, 	color: 'ocean', 	block: true },
	ocean_anim: { 	sx: 11, sy: 4, 	color: 'ocean', 	anim: [2,0], 	block: true, 	overlay: [21,0] },
	o_shore: 	{ 	sx: 11, sy: 4, 	color: 'ocean', 	anim: [2,0],	block: true, 	overlay: [23,0] },

	twig: 		{ 	sx: 0, sy: 1, color: 'desert', 	destroy: 'ground' },
	bark: 		{ 	sx: 1, sy: 1, color: 'bloody', 	destroy: 'ground' },
	feather: 	{ 	sx: 2, sy: 1, color: 'offwhite', destroy: 'ground' },
	leaf: 		{ 	sx: 3, sy: 1, color: 'orange', 	destroy: 'ground' },
	dandelion: 	{ 	sx: 4, sy: 1, color: 'flowers', destroy: 'ground' },
	cornflower: { 	sx: 5, sy: 1, color: 'blue', 	destroy: 'ground' },
	berries: 	{ 	sx: 6, sy: 1, color: 'pinky', 	destroy: 'ground' },
	branch: 	{ 	sx: 7, sy: 1, color: 'sand', 	destroy: 'ground' },

	crate_1: 	{ 	sx: 0, sy: 6, 	color: 'shiny', 	destroy: 'crate_2', 	block: true },
	crate_2: 	{ 	sx: 1, sy: 6, 	color: 'grey', 		destroy: 'ground' },
	vase_1: 	{ 	sx: 2, sy: 6, 	color: 'shiny', 	destroy: 'vase_2', 		block: true },
	vase_2: 	{ 	sx: 3, sy: 6, 	color: 'grey', 		destroy: 'ground' },
	barrel_1: 	{ 	sx: 4, sy: 6, 	color: 'shiny', 	destroy: 'barrel_2', 	block: true },
	barrel_2: 	{ 	sx: 5, sy: 6, 	color: 'grey', 		destroy: 'ground' },
	chest_1: 	{ 	sx: 6, sy: 6, 	color: 'shiny', 	destroy: 'chest_2', 	block: true },
	chest_2: 	{ 	sx: 7, sy: 6, 	color: 'grey', 		destroy: 'ground' },

	grave: 		{ 	sx: 0, sy: 8, 	color: 'bloody', 	block: true, 	destroy: 'ground' },
	headstone: 	{ 	sx: 1, sy: 8, 	color: 'grey', 		block: true },
	birdhouse: 	{ 	sx: 7, sy: 7, 	color: 'sand', 		block: true },

	burrow_1: 	{ 	sx: 10, sy: 4, color: 'foliage', 	block: true, 	anim: [2,0], 	destroy: 'burrow_2' },
	burrow_2: 	{ 	sx: 10, sy: 4, color: 'grey', 		destroy: 'ground' },

	bones_1: 	{ 	sx: 4, sy: 8, 	color: 'desert', 	destroy: 'ground' },
	bones_2: 	{ 	sx: 5, sy: 8, 	color: 'desert', 	destroy: 'ground' },
	bones_3: 	{ 	sx: 6, sy: 8, 	color: 'desert', 	destroy: 'ground' },
	bones_4: 	{ 	sx: 7, sy: 8, 	color: 'desert', 	destroy: 'ground' },

	canopy_1: 	{ 	sx: 0, sy: 9, 	color: 'autumn', 	block: true, 	destroy: 'stump' },
	canopy_2: 	{ 	sx: 1, sy: 9, 	color: 'autumn', 	block: true, 	destroy: 'stump' },
	canopy_3: 	{ 	sx: 2, sy: 9, 	color: 'autumn', 	block: true, 	destroy: 'stump' },
	canopy_4: 	{ 	sx: 3, sy: 9, 	color: 'autumn', 	block: true, 	destroy: 'stump' },
	trunk_1: 	{ 	sx: 0, sy: 10, 	color: 'logcabin', 	block: true, 	destroy: 'deadstump' },
	trunk_2: 	{ 	sx: 1, sy: 10, 	color: 'logcabin', 	block: true, 	destroy: 'deadstump' },
	seeds_1: 	{ 	sx: 2, sy: 10, 	color: 'foliage', 	destroy: 'ground' },
	seeds_2: 	{ 	sx: 3, sy: 10, 	color: 'foliage', 	destroy: 'ground' },
	flowers_1: 	{ 	sx: 6, sy: 4, 	color: 'flowers', 	destroy: 'ground' },
	flowers_2: 	{ 	sx: 7, sy: 4, 	color: 'flowers', 	destroy: 'ground' },
	deadstump: 	{ 	sx: 4, sy: 9, 	color: 'grey', 		destroy: 'ground' },

	sand_1: 	{ 	sx: 2, sy: 10, 	color: 'sand', 		destroy: 'ground' },
	sand_2: 	{ 	sx: 3, sy: 10, 	color: 'sand', 		destroy: 'ground' },

	drip_1: 	{ 	sx: 0, sy: 11, 	color: 'logcabin', 	block: true },
	drip_2: 	{ 	sx: 1, sy: 11, 	color: 'logcabin', 	block: true },
	drip_3: 	{ 	sx: 2, sy: 11, 	color: 'logcabin', 	block: true },
	pot_1: 		{ 	sx: 6, sy: 9, 	color: 'grey', 		block: true },
	pot_2: 		{ 	sx: 7, sy: 9, 	color: 'grey', 		block: true },
	leaves_1: 	{ 	sx: 4, sy: 11, 	color: 'green', 	destroy: 'ground' },
	leaves_2: 	{ 	sx: 5, sy: 11, 	color: 'green', 	destroy: 'ground' },

	door: 		{ sx: 4, sy: 10, 	color: 'orange', 	destroy: 'door_open', 	block: true },
	door_open: 	{ sx: 5, sy: 10, 	color: 'orange', 	destroy: 'door' },
	wall_vert: 	{ sx: 6, sy: 10, 	color: 'logcabin', 	block: true },
	wall_horz: 	{ sx: 7, sy: 10, 	color: 'logcabin', 	block: true },
	towerwall:  { sx: 5, sy: 9, 	color: 'sand', 		block: true },
	domerwall:  { sx: 5, sy: 9, 	color: 'pinky', 	block: true },
	spirewall:  { sx: 5, sy: 9, 	color: 'blurple', 	block: true },
	treewall_1: { sx: 6, sy: 11, 	color: 'logcabin', 	block: true },
	treewall_2: { sx: 7, sy: 11, 	color: 'logcabin', 	block: true },

	exitdoor: 	{ sx: 8, sy: 9, 	color: 'orange', 	door: true },

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	tower_00: 	{ sx: 0+8, sy: 0+10, block: true, color: 'sand' },
	tower_10: 	{ sx: 1+8, sy: 0+10, block: true, color: 'sand' },
	tower_20: 	{ sx: 2+8, sy: 0+10, block: true, color: 'sand' },
	tower_30: 	{ sx: 3+8, sy: 0+10, block: true, color: 'sand' },
	tower_40: 	{ sx: 4+8, sy: 0+10, block: true, color: 'sand' },
	tower_01: 	{ sx: 0+8, sy: 1+10, block: true, color: 'sand' },
	tower_11: 	{ sx: 1+8, sy: 1+10, block: true, color: 'sand' },
	tower_21: 	{ sx: 2+8, sy: 1+10, block: true, color: 'sand' },
	tower_31: 	{ sx: 3+8, sy: 1+10, block: true, color: 'sand' },
	tower_41: 	{ sx: 4+8, sy: 1+10, block: true, color: 'sand' },
	tower_02: 	{ sx: 0+8, sy: 2+10, block: true, color: 'sand' },
	tower_12: 	{ sx: 1+8, sy: 2+10, block: true, color: 'sand' },
	tower_22: 	{ sx: 2+8, sy: 2+10, block: true, color: 'sand' },
	tower_32: 	{ sx: 3+8, sy: 2+10, block: true, color: 'sand' },
	tower_42: 	{ sx: 4+8, sy: 2+10, block: true, color: 'sand' },
	tower_03: 	{ sx: 0+8, sy: 3+10, block: true, color: 'sand' },
	tower_13: 	{ sx: 1+8, sy: 3+10, block: true, color: 'sand' },
	tower_23: 	{ sx: 2+8, sy: 3+10, block: false, color: 'sand', door: true, teleport: [MIDDLE,HEIGHT-3] },
	tower_33: 	{ sx: 3+8, sy: 3+10, block: true, color: 'sand' },
	tower_43: 	{ sx: 4+8, sy: 3+10, block: true, color: 'sand' },

	domer_00: 	{ sx: 0+13, sy: 0+10, block: true, color: 'pinky' },
	domer_10: 	{ sx: 1+13, sy: 0+10, block: true, color: 'pinky' },
	domer_20: 	{ sx: 2+13, sy: 0+10, block: true, color: 'pinky' },
	domer_01: 	{ sx: 0+13, sy: 1+10, block: true, color: 'pinky' },
	domer_11: 	{ sx: 1+13, sy: 1+10, block: true, color: 'pinky' },
	domer_21: 	{ sx: 2+13, sy: 1+10, block: true, color: 'pinky' },
	domer_02: 	{ sx: 0+13, sy: 2+10, block: true, color: 'pinky' },
	domer_12: 	{ sx: 1+13, sy: 2+10, block: true, color: 'pinky' },
	domer_22: 	{ sx: 2+13, sy: 2+10, block: true, color: 'pinky' },
	domer_03: 	{ sx: 0+13, sy: 3+10, block: true, color: 'pinky' },
	domer_13: 	{ sx: 1+13, sy: 3+10, block: false, color: 'pinky', door: true, teleport: [MIDDLE,MIDDLE+6] },
	domer_23: 	{ sx: 2+13, sy: 3+10, block: true, color: 'pinky' },

	spire_00: 	{ sx: 0+13, sy: 0+14, block: true, color: 'blurple' },
	spire_10: 	{ sx: 1+13, sy: 0+14, block: true, color: 'blurple' },
	spire_20: 	{ sx: 2+13, sy: 0+14, block: true, color: 'blurple' },
	spire_01: 	{ sx: 0+13, sy: 1+14, block: true, color: 'blurple' },
	spire_11: 	{ sx: 1+13, sy: 1+14, block: true, color: 'blurple' },
	spire_21: 	{ sx: 2+13, sy: 1+14, block: true, color: 'blurple' },
	spire_02: 	{ sx: 0+13, sy: 2+14, block: true, color: 'blurple' },
	spire_12: 	{ sx: 1+13, sy: 2+14, block: true, color: 'blurple' },
	spire_22: 	{ sx: 2+13, sy: 2+14, block: true, color: 'blurple' },
	spire_03: 	{ sx: 0+13, sy: 3+14, block: true, color: 'blurple' },
	spire_13: 	{ sx: 1+13, sy: 3+14, block: true, color: 'blurple' },
	spire_23: 	{ sx: 2+13, sy: 3+14, block: true, color: 'blurple' },
	spire_04: 	{ sx: 0+13, sy: 4+14, block: true, color: 'blurple' },
	spire_14: 	{ sx: 1+13, sy: 4+14, block: false, color: 'blurple', door: true, teleport: [MIDDLE,MIDDLE+6] },
	spire_24: 	{ sx: 2+13, sy: 4+14, block: true, color: 'blurple' },

	cave_tl: 	{ sx: 0+8, sy: 0+8, block: true, color: 'logcabin' },
	cave_tr: 	{ sx: 1+8, sy: 0+8, block: true, color: 'logcabin' },
	cave_bm: 	{ sx: 1+8, sy: 1+8, block: false, color: 'logcabin', door: true, teleport: [MIDDLE,HEIGHT-3] },

	small_00: 	{ sx: 0+10, sy: 0+8, block: true, color: 'sand' },
	small_10: 	{ sx: 1+10, sy: 0+8, block: true, color: 'sand' },
	small_20: 	{ sx: 2+10, sy: 0+8, block: true, color: 'sand' },
	small_01: 	{ sx: 0+10, sy: 1+8, block: true, color: 'sand' },
	small_11: 	{ sx: 1+10, sy: 1+8, block: false, color: 'sand', door: true, teleport: [MIDDLE,MIDDLE+6] },
	small_21: 	{ sx: 2+10, sy: 1+8, block: true, color: 'sand' },

	stump_00: 	{ sx: 0+13, sy: 0+8, block: true, color: 'logcabin' },
	stump_10: 	{ sx: 1+13, sy: 0+8, block: true, color: 'logcabin' },
	stump_20: 	{ sx: 2+13, sy: 0+8, block: true, color: 'logcabin' },
	stump_01: 	{ sx: 0+13, sy: 1+8, block: true, color: 'logcabin' },
	stump_11: 	{ sx: 1+13, sy: 1+8, block: false, color: 'logcabin', door: true, teleport: [MIDDLE,MIDDLE] },
	stump_21: 	{ sx: 2+13, sy: 1+8, block: true, color: 'logcabin' }
}

const ENTITY = {
	player: 	{ sx: 16, sy: 0, hp: 2 },
	scythe: 	{ sx: 16, sy: 4 },
	scythe_spin:{ sx: 16, sy: 4, 	anim: [0,0] },
	inventory: 	{ sx: 17, sy: 28 },
	hitbox: 	{ sx: 2, sy: 0 },
	ua: 		{ sx: 8, sy: 0 },
	la: 		{ sx: 9, sy: 0 },
	da: 		{ sx: 10, sy: 0 },
	ra: 		{ sx: 11, sy: 0 },
	w: 			{ sx: 12, sy: 0 },
	a: 			{ sx: 13, sy: 0 },
	s: 			{ sx: 14, sy: 0 },
	d: 			{ sx: 15, sy: 0 },
	z: 			{ sx: 12, sy: 1 },
	x: 			{ sx: 13, sy: 1 },
	c: 			{ sx: 14, sy: 1 },
	v: 			{ sx: 15, sy: 1 },
	q: 			{ sx: 12, sy: 2 },
	e: 			{ sx: 13, sy: 2 },
	f: 			{ sx: 14, sy: 2 },
	r: 			{ sx: 15, sy: 2 },
	////////////////////////////////////////////////////////				River   	 Ground 	 Grass
	smarg: 		{ sx: 16, sy: 16, 	hp: 1, 	destroy: 'grave',		walk: ['statue',	'player',	'player'] }, //Red
	rixen: 		{ sx: 17, sy: 16, 	hp: 1, 	destroy: 'river_anim', 	walk: ['player',	'retreat',	'retreat'] }, //Blue
	derva: 		{ sx: 18, sy: 16, 	hp: 2, 	destroy: 'grass_1', 	walk: ['player',	'statue',	'player'] }, //Green
	trull: 		{ sx: 19, sy: 16, 	hp: 3, 	destroy: 'pebbles', 	walk: ['statue',	'player',	'player'] }, //Orange

	xrrow: 		{ sx: 20, sy: 16, 	hp: 5, 	destroy: 'grave', 		walk: ['retreat',	'random',	'player'] }, //Pink
	gyn: 		{ sx: 21, sy: 16, 	hp: 5, 	destroy: 'grave', 		walk: ['player',	'retreat',	'random'] }, //Purple
	kong: 		{ sx: 22, sy: 16, 	hp: 5, 	destroy: 'grave', 		walk: ['random',	'player',	'retreat'] }, //Yellow

	rwck: 		{ sx: 23, sy: 16, 	hp: 3, 	destroy: 'rock_4', 		walk: ['statue',	'player',	'player'] }, //Brown

	creepa: 	{ sx: 16, sy: 20, 	hp: 1, 	destroy: 'barrel_2', 	walk: ['statue',	'player',	'player'] }, //
	odango: 	{ sx: 17, sy: 20, 	hp: 1, 	destroy: 'chest_2', 	walk: ['statue',	'player',	'player'] }, //
	moonman: 	{ sx: 18, sy: 20, 	hp: 1, 	destroy: 'crate_2', 	walk: ['statue',	'player',	'player'] }, //
	pointa: 	{ sx: 19, sy: 20, 	hp: 1, 	destroy: 'chest_2', 	walk: ['statue',	'player',	'player'] }, //

	xapmat: 	{ sx: 20, sy: 20, 	hp: 3, 	destroy: 'barrel_2', 	walk: ['statue',	'player',	'player'] }, //
	modnoc: 	{ sx: 21, sy: 20, 	hp: 3, 	destroy: 'vase_2', 		walk: ['statue',	'player',	'player'] }, //
	mozzie: 	{ sx: 22, sy: 20, 	hp: 4, 	destroy: 'vase_2', 		walk: ['statue',	'player',	'player'] }, //
	dingo: 		{ sx: 23, sy: 20, 	hp: 4, 	destroy: 'crate_2', 	walk: ['statue',	'player',	'player'] }, //

	gungenthor: { sx: 1, sy: 20, 	hp: 12, destroy: 'tree_4', 		walk: ['player',	'player',	'player'] },

	xapmat_atk: { sx: 20, sy: 4, 	hp: 9, 	walk: ['statue',	'statue',	'statue'] },
	modnoc_atk: { sx: 21, sy: 4, 	hp: 9, 	walk: ['course',	'course',	'course'] },
	xrrow_atk: 	{ sx: 22, sy: 4, 	hp: 9, 	walk: ['course',	'course',	'course'] },
	kong_atk: 	{ sx: 23, sy: 4, 	hp: 9, 	walk: ['statue',	'statue',	'statue'] },

	blood_dude: 	{ sx: 4, sy: 24, 	hp: 1, 	walk: ['player',	'player',	'retreat'] },
	water_dude: 	{ sx: 5, sy: 24, 	hp: 1, 	walk: ['retreat',	'player',	'player'] },

	blood_tear_atk: 	{ sx: 3, sy: 20, 	hp: 5, 	walk: ['course',	'course',	'course'] },
	blood_dude_atk: 	{ sx: 3, sy: 21, 	hp: 5, 	walk: ['course',	'course',	'course'] },
	water_tear_atk: 	{ sx: 3, sy: 22, 	hp: 5, 	walk: ['course',	'course',	'course'] },
	water_dude_atk: 	{ sx: 3, sy: 23, 	hp: 5, 	walk: ['course',	'course',	'course'] },

	left_hand_atk_00: 	{ sx: 4, sy: 20, 		hp: HEIGHT, 	walk: ['course',	'course',	'course'] },
	left_hand_atk_10: 	{ sx: 4+1, sy: 20, 		hp: HEIGHT, 	walk: ['course',	'course',	'course'] },
	left_hand_atk_01: 	{ sx: 4, sy: 20+1, 		hp: HEIGHT, 	walk: ['course',	'course',	'course'] },
	left_hand_atk_11: 	{ sx: 4+1, sy: 20+1, 	hp: HEIGHT, 	walk: ['course',	'course',	'course'] },

	right_hand_atk_00: 	{ sx: 6, sy: 20, 		hp: HEIGHT, 	walk: ['course',	'course',	'course'] },
	right_hand_atk_10: 	{ sx: 6+1, sy: 20, 		hp: HEIGHT, 	walk: ['course',	'course',	'course'] },
	right_hand_atk_01: 	{ sx: 6, sy: 20+1, 		hp: HEIGHT, 	walk: ['course',	'course',	'course'] },
	right_hand_atk_11: 	{ sx: 6+1, sy: 20+1, 	hp: HEIGHT, 	walk: ['course',	'course',	'course'] },

	left_foot_atk_00: 	{ sx: 4, sy: 22, 		hp: HEIGHT, 	walk: ['course',	'course',	'course'] },
	left_foot_atk_10: 	{ sx: 4+1, sy: 22, 		hp: HEIGHT, 	walk: ['course',	'course',	'course'] },
	left_foot_atk_01: 	{ sx: 4, sy: 22+1, 		hp: HEIGHT, 	walk: ['course',	'course',	'course'] },
	left_foot_atk_11: 	{ sx: 4+1, sy: 22+1, 	hp: HEIGHT, 	walk: ['course',	'course',	'course'] },

	right_foot_atk_00: 	{ sx: 6, sy: 22, 		hp: HEIGHT, 	walk: ['course',	'course',	'course'] },
	right_foot_atk_10: 	{ sx: 6+1, sy: 22, 		hp: HEIGHT, 	walk: ['course',	'course',	'course'] },
	right_foot_atk_01: 	{ sx: 6, sy: 22+1, 		hp: HEIGHT, 	walk: ['course',	'course',	'course'] },
	right_foot_atk_11: 	{ sx: 6+1, sy: 22+1, 	hp: HEIGHT, 	walk: ['course',	'course',	'course'] },

	coin_1: 	{ sx: 16, sy: 8, 	anim: [0,2] },
	coin_2: 	{ sx: 17, sy: 8, 	anim: [0,2] },
	coin_3: 	{ sx: 18, sy: 8, 	anim: [0,2] },
	coin_4: 	{ sx: 19, sy: 8, 	anim: [0,2] },
	coin_5: 	{ sx: 20, sy: 8, 	anim: [0,2] },
	coin_6: 	{ sx: 21, sy: 8, 	anim: [0,2] },
	coin_7: 	{ sx: 22, sy: 8, 	anim: [0,2] },
	coin_8: 	{ sx: 23, sy: 8, 	anim: [0,2] },

	aura: 		{ sx: 8, sy: 28 },
	aura_2: 	{ sx: 10, sy: 28 },

	circle: 	{ sx: 11, sy: 23 },
	box: 		{ sx: 11, sy: 24 },
	arrow: 		{ sx: 11, sy: 25 },
	summoning: 	{ sx: 12, sy: 23, h: 3, w: 4 },
	transmute: 	{ sx: 8, sy: 20, h: 3, w: 3 },
	blackjack: 	{ sx: 11, sy: 20, h: 3, w: 5 },
	bazzar: 	{ sx: 8, sy: 23, h: 3, w: 3 },
	carpet: 	{ sx: 8, sy: 26, h: 3, w: 3 },
	howtosummon:{ sx: 16, sy: 24, h: 3, w: 5 },
	howtomagic: { sx: 21, sy: 24, h: 3, w: 1 },
	howtogamble:{ sx: 22, sy: 24, h: 3, w: 2 },
	heart_up:	{ sx: 11, sy: 26, 	anim: [0,0] },

	river_door: { sx: 6, sy: 2 },

	power_upgrade: 		{ sx: 16, sy: 27 },
	greedy_upgrade: 	{ sx: 17, sy: 27 },
	explode_upgrade: 	{ sx: 18, sy: 27 },

	upgradetext:		{ sx: 12, sy: 27, h: 1, w: 4 },
	explainpower:		{ sx: 12, sy: 28, h: 1, w: 5 },
	explaingreedy: 		{ sx: 12, sy: 29, h: 1, w: 5 },
	explainexplode:		{ sx: 12, sy: 30, h: 1, w: 5 },

	logo: { sx: 8, sy: 1, h: 2, w: 4 },
}