var time;
var dt;

//var spritesheet = new Image();

const SIZE = 600;
const SMALL = 50;

let stats = {
	revolutions: 0
}

let boulder = {
	angle: 0,
	renderAngle: 0,
	speed: 1/300,
	push: Math.PI/10
}

let slope = {
	angle: 0,
	renderAngle: 0,
	start: 10,
	base: 1.1,
	level: 0,
	cost: 10
}

$(function() {

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = canvas.height = SIZE;
	//spritesheet.src = 'spritesheet.png';

	//spritesheet.onload = function() {
		window.requestAnimationFrame(gameLoop);
	//}

	function gameLoop() {
		requestAnimationFrame(gameLoop);

		var now = new Date().getTime();
		dt = now - (time || now);
		time = now;

		update(dt);
		render();
	}

	function update(dt) {

		// Update boulder speed
		boulder.speed = slope.angle/35;

		// Increment boulder angle
		boulder.angle += boulder.speed * dt;

		// Update stats
		if (boulder.angle >= Math.PI * 2) {
			// Reset angle so stats don't double-count
			boulder.angle -= Math.PI * 2;
			boulder.renderAngle -= Math.PI * 2;

			// Increment revolutions
			stats.revolutions++;

			// Update DOM
			$('.revolutions').text(stats.revolutions);
		}

		// Animation
		boulder.renderAngle = lerp(boulder.renderAngle, boulder.angle, 1/100 * dt);
		slope.renderAngle = lerp(slope.renderAngle, slope.angle, 1/100 * dt);

	}

	function render() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.save();

			ctx.translate(SIZE/2, SIZE/2);
			ctx.rotate(boulder.renderAngle);

				ctx.beginPath();
				ctx.moveTo(0, 0);
				ctx.arc(0, 0, SMALL, -Math.PI/2, Math.PI*1.5);
				ctx.stroke();

			ctx.rotate(-boulder.renderAngle);
			ctx.rotate(slope.renderAngle);
		
				ctx.beginPath();
				ctx.moveTo(-SIZE, SMALL);
				ctx.lineTo(SIZE, SMALL);
				ctx.stroke();

		ctx.restore();
	}

	$('#push').on('click', function() {
		boulder.angle += boulder.push;
	});

	$('#upgradeAngle').on('click', function() {
		buyAngleUpgrade();
	});

});

const buyAngleUpgrade = () => {
	// Checks that the player can afford the upgrade
    if (stats.revolutions >= slope.cost) {
		// Increases slope level
        slope.level++;

		// Removes the revolutions spent
    	stats.revolutions -= slope.cost;

		// Updates the slope angle
		slope.angle = Math.PI/2 * (1 - Math.exp(-slope.level / 99));

		// Updates the revolutions DOM
        $('.revolutions').text(stats.revolutions);
    };

	// Works out the cost of the next upgrade
    slope.cost = Math.floor(slope.start * Math.pow(slope.base, slope.level));

	// Updates the slope cost DOM
    $('.slopeCost').text(slope.cost);
}