


var HEIGHT = 800;
var WIDTH = 1000;
var SIZE = 128;

var prettyColors = [
	"#FF6B6B", // Red
	"#FFD166", // Yellow
	"#06D6A0", // Green
	"#118AB2", // Blue
	"#FFFCF2", // Cream
	"#8338EC", // Purple
	"#FFAAA6", // Pink
	"#E63946", // Coral
	"#F4A261", // Orange
	"#A8DADC", // Teal
];

var GAME = {
	slimes: [],
}



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

function oscillate(value) {
	// Ensure the input value is in the range [0, 1]
	value = Math.max(0, Math.min(1, value));

	// Use sine function with a phase shift to oscillate between 0 and 1 and back to 0
	return 0.5 + 0.5 * Math.sin(value * Math.PI);
}

function randNegOneOrOne() {
	return Math.random() < 0.5 ? -1 : 1;
}