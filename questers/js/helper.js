// rendering

const UNIT = 25;
const STROKE = 5;
const DEFAULT_COLOUR = "brown";
const RARITY_COLOURS = [
    "grey",
    "limegreen",
    "turquoise",
    "dodgerblue",
    "coral",
    "orchid",
    "gold",
	"yellow"
];

// some values

const WEAPONS = [
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
	"Shield",

	"Spellbook",
	"Trinket",
	"Gemstone",
	"Orbstone",
	"Staff",
	"Wand",
	"Scepter"
];

const ADJECTIVES = [
	{ name: "Broken", rarity: 0 },
	{ name: "Weak", rarity: 0 },
	{ name: "Dull", rarity: 0 },
	{ name: "Shoddy", rarity: 0 },
	{ name: "Awkward", rarity: 0 },
	{ name: "Large", rarity: 1 },
	{ name: "Dangerous", rarity: 1 },
	{ name: "Savage", rarity: 1 },
	{ name: "Sharp", rarity: 1 },
	{ name: "Tiny", rarity: 1 },
	{ name: "Bulky", rarity: 1 },
	{ name: "Heavy", rarity: 1 },
	{ name: "Light", rarity: 1 },
	{ name: "Rapid", rarity: 2 },
	{ name: "Hasty", rarity: 2 },
	{ name: "Intimidating", rarity: 2 },
	{ name: "Powerful", rarity: 2 },
	{ name: "Strong", rarity: 2 },
	{ name: "Intense", rarity: 2 },
	{ name: "Furious", rarity: 2 },
	{ name: "Quick", rarity: 2 },
	{ name: "Keen", rarity: 2 },
	{ name: "Superior", rarity: 3 },
	{ name: "Forceful", rarity: 3 },
	{ name: "Deadly", rarity: 3 },
	{ name: "Agile", rarity: 3 },
	{ name: "Nimble", rarity: 3 },
	{ name: "Murderous", rarity: 3 },
	{ name: "Manic", rarity: 3 },
	{ name: "Sighted", rarity: 3 },
	{ name: "Unpleasant", rarity: 3 },
	{ name: "Arcane", rarity: 4 },
	{ name: "Adept", rarity: 4 },
	{ name: "Mystic", rarity: 4 },
	{ name: "Ruthless", rarity: 4 },
	{ name: "Frenzying", rarity: 4 },
	{ name: "Masterful", rarity: 4 },
	{ name: "Demonic", rarity: 5 },
	{ name: "Celestial", rarity: 5 },
	{ name: "Legendary", rarity: 5 },
	{ name: "Unreal", rarity: 5 },
	{ name: "Mythical", rarity: 5 },
	{ name: "Godly", rarity: 6 },
	{ name: "Fully Forged", rarity: 7 }
];

function getRarityFromAdj(adjectiveName) {
	const adjective = ADJECTIVES.find(adj => adj.name === adjectiveName);
	return adjective ? adjective.rarity : 0; // return 0 if the adjective is not found
}

function getRandomAdjFromRarity(rarity) {
	const filteredAdjectives = ADJECTIVES.filter(adj => adj.rarity === rarity);
	return rand(filteredAdjectives);
}

const DESCRIPTORS = [
	"Crazed",
	"Stupid",
	"Brainless",
	"Deadly",
	"Mischievous",
	"Evil",
	"Enraged",
	"Angry",
	"Fearsome",
	"Insane"
];

const ENEMIES = [
	"Goblin",
	"Orc",
	"Troll",
	"Elf",
	"Wizard",
	"Spectre",
	"Ghost",
	"Imp",
	"Demon",
	"Dragon",
	"Vampire",
	"Serpent",
	"Werewolf",
	"Zombie",
	"Dwarf",
	"Slime"
];

const MESSAGES = {
	end: [
		"You wander a bit further.",
		"You move to the next room.",
		"The fight is over.",
		"Your hands are bloodstained.",
		"The next door beckons.",
		"You fight with vigour.",
		"Your armour is battle-worn.",
		"You fight endlessly.",
		"You smell battle.",
		"You walk down a hallway.",
		"The door slams behind you.",
		"You smell treasure.", 
		"All is quiet, finally."
	],
	market: [
		"The hustle and bustle of vendors and buyers almost overwhelms you.",
		"A gnarled old man beckons you to come see his wares.",
		"A stout fellow beams a toothless grin at you, goods laid out in front of him.",
		"An wrinkled old woman gazes at you with heavy-lidded eyes from behind her counter.",
		"The place is deserted, save for a few dilapidated storefronts."
	],
	outpost: [
		"The tears in your followers eyes make tracks in the dirt on their faces.",
	]
};

function prettify(input) {
	var output = Math.round(input * 1000000)/1000000;
	return output;
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

function lerp(start, end, t) {
	return start * (1 - t) + end * t;
}

function linear(start, end, t) { //My masterpiece
	if (start-end > 0) {
		return start-t > end ? start-t : end;
	} else {
		return start+t < end ? start+t : end;
	}
}

function getBezierPoint(t, p0, p1, p2) {
	const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
	const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
	return { x, y };
}

function pixellate(ctx) {
	let w = canvas.width / 10;
	let h = canvas.height / 10;

	ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, w, h);

	const imgData = ctx.getImageData(0, 0, w, h);

	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			let index = (y * w + x) * 4;
			let r = imgData.data[index];
			let g = imgData.data[index + 1];
			let b = imgData.data[index + 2];
			let a = imgData.data[index + 3];

			ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
			
			ctx.fillRect(x * 10, y * 10, 10, 10);
		}
	}
}

function linearScale(L, start, end) {
    let v = start + L * (end - start);
    const min = Math.min(start, end);
    const max = Math.max(start, end);

    if (v < min) v = min;
    if (v > max) v = max;

    return v;
}

function steepScale(L, min, max, steepness) {
	return min + Math.pow(L, steepness) * (max - min);
}

function jitter(value, range, min, max) {
    const adjustment = (Math.random() * 2 - 1) * range * value;
	
	let j = Math.round(value + adjustment);

	if (j < min) j = min;
	if (j > max) j = max;

    return j;
}