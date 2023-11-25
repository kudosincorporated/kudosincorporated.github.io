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

function getRandomMainColor() {
	let hsl = 'hsl(';
		hsl += randInt(0,360);
		hsl += ', ';
		hsl += randInt(25,75);
		hsl += '%, ';
		hsl += randInt(40,60);
		hsl += '%)';
	return hsl;
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

function calculateDistance(point1, point2) {
	const deltaX = point1.x - point2.x;
	const deltaY = point1.y - point2.y;

	// Using Euclidean distance formula
	return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}