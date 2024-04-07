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