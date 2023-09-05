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

function circlePoint(x, y, radius) {
	function farVal() { //findFarthestDist
		var distanceX = (Math.floor(radius/2) - 0) * (Math.floor(radius/2) - 0);
		var distanceY = (Math.floor(radius/2) - 0) * (Math.floor(radius/2) - 0);
		var distanceToCenter = Math.sqrt(distanceX + distanceY);
		return distanceToCenter = distanceToCenter / (radius/2);
	}

	//Making a circle
	var t = 0;
	var distanceX = (Math.floor(radius/2) - x) * (Math.floor(radius/2) - x);
	var distanceY = (Math.floor(radius/2) - y) * (Math.floor(radius/2) - y);
	var distanceToCenter = Math.sqrt(distanceX + distanceY);
	distanceToCenter = distanceToCenter / (radius/2);
	t += distanceToCenter;
	//https://stats.stackexchange.com/questions/70801/how-to-normalize-data-to-0-1-range
	t = (t + farVal()) / (farVal() + 0);
	t = t-1;

	return t;
}

function calculateDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance;
}

function getColor(color) {
	var hsl;
	var ran; //Variation(Randomness)

	switch (color) {
		////////////////
		//	Original
		////////////////

		case 'green':
			hsl = [110,60,50];
			ran = [60,80,50];
			break;
		case 'foliage':
			hsl = [110,50,30];
			ran = [60,60,20];
			break;
		case 'desert':
			hsl = [30,60,50];
			ran = [40,80,20];
			break;
		case 'logcabin':
			hsl = [15,40,45];
			ran = [10,20,10];
			break;
		case 'blue':
			hsl = [190,60,50];
			ran = [20,80,20];
			break;
		case 'sand':
			hsl = [40,50,70];
			ran = [20,50,20];
			break;
		case 'offwhite':
			hsl = [180,50,85];
			ran = [360,20,10];
			break;
		case 'orange':
			hsl = [15,90,55];
			ran = [30,20,10];
			break;
		case 'blurple':
			hsl = [245,62.5,65];
			ran = [10,25,10];
			break;
		case 'pinky':
			hsl = [345,62.5,65];
			ran = [20,80,20];
			break;
		case 'bloody':
			hsl = [5,87.5,50];
			ran = [10,25,10];
			break;
		case 'autumn':
			hsl = [75,55,50];
			ran = [150,20,20];
			break;
		case 'shiny':
			hsl = [55,95,55];
			ran = [20,10,10];
			break;
		case 'grey':
			hsl = [225,10,50];
			ran = [50,10,20];
			break;

		////////////////
		//	New
		////////////////

		case 'deadleaf':
			hsl = [162,9,22];
			ran = [30,40,10];
			break;
		case 'deadrock':
			hsl = [319,23,26];
			ran = [25,15,8];
			break;
		case 'swamp':
			hsl = [71,39,21];
			ran = [25,15,5];
			break;
		case 'marigold':
			hsl = [24,74,51];
			ran = [25,15,5];
			break;
		case 'duskpink':
			hsl = [354,63,60];
			ran = [25,15,5];
			break;
		case 'forest':
			hsl = [71,42,38];
			ran = [145,25,27];
			break;
		case 'creek':
			hsl = [165,74,48];
			ran = [25,25,21];
			break;

		default:
			hsl = [0,0,0];
			ran = [0,0,0];
	}

	function tweaked(val, ran) {
		return randInt(
			val - ran/2,
			val + ran/2
		);
	}

	let final = 'hsl('+tweaked(hsl[0], ran[0])+', '+tweaked(hsl[1], ran[1])+'%, '+tweaked(hsl[2], ran[2])+'%)';
	if (color == '') return 'transparent';
	return final;
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

function returnVariantFrame(setSpeed, setSprite, addition) {
	let curFrame = ANIM.frame[setSpeed][setSprite];
	let maxFrames = ANIM.sprite[setSprite];
	curFrame += addition;
	if (curFrame >= maxFrames) {
		curFrame -= maxFrames;
	}
	return curFrame;
}

function convertText(string) {
	let final = '';
	for (let i = 0; i < string.length; i++) {
		final += '<span class="word ';
		let char = string.charAt(i);
		if (char == ' ') {
			final += 'space';
		} else {
			final += char;
		}
		final += '"></span>';
	}
	return final;
}

function tileAtPos(x, y) {
	if (x >= 0 && x < HEIGHT-1 && y >= 0 && y < HEIGHT-1) {
		return GAME.map.arr[x][y];
	} else {
		return TILE.ground;
	}
}