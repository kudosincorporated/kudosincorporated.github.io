//EASYSTAR
var easystar = new EasyStar.js();

var GAME = {};

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

const HEIGHT = 25;
const SIZE = 32;
const RATIO = 64;
var SPEED = 25;

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
		enemy: 0.025
	}
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
	ocean: ['river','river','river','river','river_anim'],
	all_enemies: ['smarg','rixen','derva','trull','xrrow','gyn','kong','rwck']
}

const TILE = {
	ground: 	{ 	sx: 1, sy: 0, 	color: '' },
	square: 	{ 	sx: 1, sy: 1, 	color: 'offwhite' },

	grass_1: 	{ 	sx: 4, sy: 8, 	color: 'foliage',	destroy: 'ground' },
	grass_2: 	{ 	sx: 5, sy: 8, 	color: 'foliage', 	destroy: 'ground' },
	weed_1: 	{ 	sx: 6, sy: 8, 	color: 'foliage', 	destroy: 'ground' },
	weed_2: 	{ 	sx: 7, sy: 8, 	color: 'foliage', 	destroy: 'ground' },
	weed_3: 	{ 	sx: 0, sy: 12, 	color: 'foliage', 	destroy: 'ground' },

	tree_1: 	{ 	sx: 0, sy: 4, 	color: 'green', 	block: true, 	destroy: 'stump' },
	tree_2: 	{ 	sx: 1, sy: 4, 	color: 'green', 	block: true, 	destroy: 'stump' },
	tree_3: 	{ 	sx: 2, sy: 4, 	color: 'green', 	block: true, 	destroy: 'stump' },
	tree_4: 	{ 	sx: 3, sy: 4, 	color: 'green', 	block: true, 	destroy: 'stump' },

	stump: 		{ 	sx: 3, sy: 12, 	color: 'green', 	block: true, 	destroy: 'ground' },
	pebbles: 	{ 	sx: 1, sy: 12, 	color: 'sand', 		block: false, 	destroy: 'ground' },

	rock_1: 	{ 	sx: 0, sy: 8, 	color: 'desert', 	block: true, 	destroy: 'pebbles' },
	rock_2: 	{ 	sx: 1, sy: 8, 	color: 'desert', 	block: true, 	destroy: 'pebbles' },
	rock_3: 	{ 	sx: 2, sy: 8, 	color: 'desert', 	block: true, 	destroy: 'pebbles' },
	rock_4: 	{ 	sx: 3, sy: 8, 	color: 'desert', 	block: true, 	destroy: 'pebbles' },

	cliff_1: 	{ 	sx: 4, sy: 12, 	color: 'logcabin', 	block: true },
	cliff_2: 	{ 	sx: 5, sy: 12, 	color: 'logcabin', 	block: true },

	herb_1: 	{ 	sx: 8, sy: 0, 	color: 'foliage' },
	herb_2: 	{ 	sx: 9, sy: 0, 	color: 'foliage' },
	herb_3: 	{ 	sx: 10, sy: 0, 	color: 'foliage' },
	herb_4: 	{ 	sx: 11, sy: 0, 	color: 'foliage' },
	herb_5: 	{ 	sx: 12, sy: 0, 	color: 'foliage' },
	herb_6: 	{ 	sx: 13, sy: 0, 	color: 'foliage' },
	herb_7: 	{ 	sx: 14, sy: 0, 	color: 'foliage' },

	river: 		{ 	sx: 8, sy: 4, 	color: 'blue' },
	river_anim: { 	sx: 8, sy: 4, 	color: 'blue', 	anim: [2,0] },
	waterfall: 	{ 	sx: 9, sy: 4, 	color: 'blue', 	anim: [0,0], 	block: true },
	w_fall_end: { 	sx: 9, sy: 4, 	color: 'blue', 	anim: [0,0], 	block: true, 	overlay: [0,0] },

	twig: 		{ 	sx: 8, sy: 12, 	color: '', 	destroy: 'ground' },
	bark: 		{ 	sx: 9, sy: 12, 	color: '', 	destroy: 'ground' },
	feather: 	{ 	sx: 10, sy: 12, color: '', 	destroy: 'ground' },
	leaf: 		{ 	sx: 11, sy: 12, color: '', 	destroy: 'ground' },
	dandelion: 	{ 	sx: 12, sy: 12, color: '', 	destroy: 'ground' },
	cornflower: { 	sx: 13, sy: 12, color: '', 	destroy: 'ground' },
	berries: 	{ 	sx: 14, sy: 12, color: '', 	destroy: 'ground' },
	branch: 	{ 	sx: 15, sy: 12, color: '', 	destroy: 'ground' },

	crate_1: 	{ 	sx: 0, sy: 9, 	color: 'shiny', 	destroy: 'crate_2', 	block: true },
	crate_2: 	{ 	sx: 1, sy: 9, 	color: 'grey', 		destroy: 'ground' },
	vase_1: 	{ 	sx: 2, sy: 9, 	color: 'shiny', 	destroy: 'vase_2', 		block: true },
	vase_2: 	{ 	sx: 3, sy: 9, 	color: 'grey', 		destroy: 'ground' },
	barrel_1: 	{ 	sx: 4, sy: 9, 	color: 'shiny', 	destroy: 'barrel_2', 	block: true },
	barrel_2: 	{ 	sx: 5, sy: 9, 	color: 'grey', 		destroy: 'ground' },
	chest_1: 	{ 	sx: 6, sy: 9, 	color: 'shiny', 	destroy: 'chest_2', 	block: true },
	chest_2: 	{ 	sx: 7, sy: 9, 	color: 'grey', 		destroy: 'ground' },

	grave: 		{ 	sx: 0, sy: 14, 	color: 'grey', 	block: true, 	destroy: 'ground' },
	birdhouse: 	{ 	sx: 1, sy: 14, 	color: 'sand', 	block: true },

	burrow_1: 	{ 	sx: 10, sy: 4, color: 'foliage', 	block: true, 	anim: [2,0], 	destroy: 'burrow_2' },
	burrow_2: 	{ 	sx: 10, sy: 4, color: 'grey', 	destroy: 'ground' },

	twig: 		{ sx: 8, sy: 12, color: 'foliage' },
	bark: 		{ sx: 9, sy: 12, color: 'foliage' },
	feather: 	{ sx: 10, sy: 12, color: 'foliage' },
	leaf: 		{ sx: 11, sy: 12, color: 'foliage' },
	dandelion: 	{ sx: 12, sy: 12, color: 'foliage' },
	cornflower: { sx: 13, sy: 12, color: 'foliage' },
	berries: 	{ sx: 14, sy: 12, color: 'foliage' },
	branch: 	{ sx: 15, sy: 12, color: 'foliage' }
}

const ENTITY = {
	player: 	{ sx: 16, sy: 0 },
	scythe: 	{ sx: 22, sy: 0 },
	scythe_spin:{ sx: 22, sy: 0, 	anim: [0,0] },
	inventory: 	{ sx: 0, sy: 0 },
	//																River    Ground   Grass
	smarg: 		{ sx: 8, sy: 20,  	destroy: 'grave',		walk: ['statue','player','player'] }, //Red
	rixen: 		{ sx: 9, sy: 20, 	destroy: 'river_anim', 	walk: ['player','random','random'] }, //Blue
	derva: 		{ sx: 10, sy: 20, 	destroy: 'grass_1', 	walk: ['player','statue','player'] }, //Green
	trull: 		{ sx: 11, sy: 20, 	destroy: 'pebbles', 	walk: ['statue','player','player'] }, //Orange
	xrrow: 		{ sx: 12, sy: 20, 	destroy: 'grave', 		walk: ['random','random','player'] }, //Pink
	gyn: 		{ sx: 13, sy: 20, 	destroy: 'grave', 		walk: ['player','random','random'] }, //Purple
	kong: 		{ sx: 14, sy: 20, 	destroy: 'grave', 		walk: ['random','player','random'] }, //Yellow
	rwck: 		{ sx: 15, sy: 20, 	destroy: 'rock_4', 		walk: ['statue','player','player'] }, //Brown
	coin_1: 	{ sx: 16, sy: 12, 	anim: [0,2] },
	coin_2: 	{ sx: 17, sy: 12, 	anim: [0,2] },
	coin_3: 	{ sx: 18, sy: 12, 	anim: [0,2] },
	coin_4: 	{ sx: 19, sy: 12, 	anim: [0,2] },
	coin_5: 	{ sx: 20, sy: 12, 	anim: [0,2] },
	coin_6: 	{ sx: 21, sy: 12, 	anim: [0,2] },
	coin_7: 	{ sx: 22, sy: 12, 	anim: [0,2] },
	coin_8: 	{ sx: 23, sy: 12, 	anim: [0,2] },
	twig: 		{ sx: 8, sy: 12 },
	bark: 		{ sx: 9, sy: 12 },
	feather: 	{ sx: 10, sy: 12 },
	leaf: 		{ sx: 11, sy: 12 },
	dandelion: 	{ sx: 12, sy: 12 },
	cornflower: { sx: 13, sy: 12 },
	berries: 	{ sx: 14, sy: 12 },
	branch: 	{ sx: 15, sy: 12 }
}