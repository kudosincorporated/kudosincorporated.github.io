var time;
var dt;
var fps;

var score_interval;

var game_over = false;

var spritesheet = new Image();

var MOUSE_X = 0;
var MOUSE_Y = 0;

var pressed = [];

const colours = [
	"#ede19e",
	"#68c2d3",
	"#b45252",
	"#8ab060"
];

var players = [
	new Mover({
		type: "player",
		sx: 0,
		sy: 0,
		w: SIZE/2,
		h: SIZE/2,
		x: WIDTH/2-SIZE/2,
		y: HEIGHT/2-SIZE/2,
		range: SIZE
	})
];
var borders = [
	new Mover({
		type: "border",
		colour: "white",
		sx: 12,
		sy: 0,
		x: 0,
		y: 0,
		w: WIDTH,
		h: HEIGHT
	})
];
var paperwork = [];
var bins = [];
var copiers = [];
var decoration = [];
var enemies = [];

for (let a = 0; a <= WIDTH; a += WIDTH/4) {
	for (let b = 0; b <= HEIGHT; b  += HEIGHT/4) {
		if (
			a === 0 && b === 0 ||
			a === 0 && b === HEIGHT ||
			a === WIDTH && b === 0 ||
			a === WIDTH && b === HEIGHT ||
			a === Math.floor(WIDTH/2) && b === Math.floor(HEIGHT/2)
		) continue;

		let rsx = randInt(4, 7);
		let rsy = randInt(1, 2);
		decoration.push(new Mover({
			type: "decoration",
			colour: "transparent",
			sx: rsx,
			sy: rsy,
			x: a-SIZE/2,
			y: b-SIZE/2+1
		}));

		if (a === 0 || b === 0 || a === WIDTH || b === HEIGHT) {

		} else {
			enemies.push(new Mover({
				type: "enemy",
				sx: 0,
				sy: 6,
				w: SIZE/2,
				h: SIZE/2,
				x: a-SIZE/2,
				y: b-SIZE/2+1,
				SPEED: BASE_SPEED/4 + BASE_SPEED/4*Math.random(),
				angle: Math.PI * 2 * Math.random()
			}));
			enemies[enemies.length-1].velocityTowardsDirection();
		}
	}
}

let binCount = 0;
for (let a = 0; a <= WIDTH; a += WIDTH) {
	for (let b = 0; b <= HEIGHT; b  += HEIGHT) {
		bins.push(new Mover({
			type: "bin",
			colour: colours[binCount],
			sx: 0,
			sy: 8+binCount*2,
			h: SIZE*2,
			x: a - SIZE/2,
			y: b - SIZE,
			range: SIZE*2
		}));
		binCount++;
	}
}

for (let i = 0; i < 5; i++) {
	copiers.push(new Mover({
		type: "copier",
		colour: "transparent",
		sx: 4,
		sy: 0,
		x: randInt(WIDTH/4, WIDTH-WIDTH/4),
		y: randInt(HEIGHT/4, HEIGHT-HEIGHT/4)
	}));
}

$(function() {

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	spritesheet.src = 'spritesheet.png';

	score_interval = setInterval(function() {
		score++;
	}, 1000);

	spritesheet.onload = function() {
		window.requestAnimationFrame(gameLoop);
	}

	function gameLoop() {
		if (!game_over) requestAnimationFrame(gameLoop);

		var now = new Date().getTime();
		dt = now - (time || now);
		time = now;

		update(dt);
		render();

		fps = Math.round(1000 / dt);
	}

	let player = players[0];
	let border = borders[0];

	player.recalculateSpeed();

	function update(dt) {
		player.updateStates(dt);
		player.pullOrPush(paperwork);
		player.pushAway(copiers);
		player.pushAway(decoration);
		player.checkContact(paperwork);
		player.checkContact(enemies);
		player.animationController();
		player.sortStack();

		border.moveFromKeyboard(dt);

		paperwork.forEach(e => {
			e.decelerate(dt);
			e.update(dt);
			e.updateStates(dt);
			e.moveFromKeyboard(dt);
			e.stopOnBorder(border);
		});

		bins.forEach(e => {
			e.pullOrPush(paperwork);
			e.moveFromKeyboard(dt);
			e.updateStates(dt);
			e.checkContact(paperwork);
			e.animationController();
		});

		enemies.forEach(e => {
			e.moveFromKeyboard(dt);
			e.update(dt);
			e.updateStates(dt);
			e.bounceOnBorder(border);
			e.animationController();
		});

		copiers.forEach(e => {
			e.moveFromKeyboard(dt);
			e.spawnPaper();
			e.decelerate(dt);
			e.update(dt);
			e.updateStates(dt);
			e.stopOnBorder(border);
			e.animationController();
		});

		decoration.forEach(e => {
			e.moveFromKeyboard(dt);
			e.decelerate(dt);
			e.update(dt);
			e.updateStates(dt);
			e.stopOnBorder(border);
		});

		// Decrease timer
		timer -= 1 * dt;
		if (timer > MAX_TIMER) timer = MAX_TIMER;
		if (timer < 0) {
			timer = 0;
			borders[0].x = 0;
			borders[0].y = HEIGHT*0.75;

			players[0].y = HEIGHT*0.75;
			players[0].holding = [];
			bins = [];
			copiers = [];
			decoration = [];
			enemies = [];

			game_over = true;
		}

		// Delete binned paperwork
		for (let i = 0; i < paperwork.length; i++) {
			if (paperwork[i].toBeDeleted) {
				paperwork.splice(i, 1);
				i--;
			}
		}
	}

	function render() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		border.drawColour(ctx);
		border.drawScore(ctx);

		paperwork.forEach(e => {
			e.draw(ctx)
		});

		decoration.forEach(e => {
			e.draw(ctx);
		});

		copiers.forEach(e => {
			e.draw(ctx);
		});

		bins.forEach(e => {
			e.draw(ctx);
			e.drawMarker(ctx);
		});

		enemies.forEach(e => {
			e.draw(ctx);
		});

		player.draw(ctx);
		player.drawHolding(ctx);
		
		drawTimer(ctx);

		if (pressed.indexOf(16) !== -1) {
			ctx.textAlign = "left";
			ctx.font = "30px serif";
			ctx.fillStyle = "yellow";
			ctx.fillText(fps, 0, 30);
		}
	}

	const drawTimer = (ctx) => {
		const percentage = timer/MAX_TIMER;

		ctx.save();

		ctx.fillStyle = "#212123";
		ctx.fillRect(
			WIDTH/4-SIZE/8,
			SIZE/4-SIZE/8,
			WIDTH/2+SIZE/4,
			SIZE/4+SIZE/4
		);

		ctx.fillStyle = "hsl("+(percentage*100)+", 75%, 50%)";
		ctx.fillRect(
			WIDTH/4 + WIDTH/2 * Math.abs(percentage-1) /2,
			SIZE/4,
			WIDTH/2 * percentage,
			SIZE/4
		);

		ctx.strokeStyle = "white";
		ctx.lineWidth = 4;
		ctx.strokeRect(
			WIDTH/4,
			SIZE/4,
			WIDTH/2,
			SIZE/4
		);
		
		ctx.restore();
	}

	$('body').on('keydown', function(e) {
		var key_code = e.which || e.keyCode;
		pressed.push(key_code);
		if (!has_moved) has_moved = true;
	});

	$('body').on('keyup', function(e) {
		var key_code = e.which || e.keyCode;
		pressed = pressed.filter(item => item !== key_code);
	});

	$('#canvas').on('mousemove', function(e) {
        var rect = canvas.getBoundingClientRect();
        MOUSE_X = e.clientX - rect.left;
        MOUSE_Y = e.clientY - rect.top;
	});

	$('#canvas').on('mousedown', function() {
		let player = players[0];
		const dx = MOUSE_X - player.x;
		const dy = MOUSE_Y - player.y;
		let speed = BASE_SPEED*5;
		let angle = Math.atan2(dy, dx);
		if (player.holding.length > 0) {

			paperwork.push(new Mover({
				type: "paperwork",
				colour: player.holding[0].colour,
				sx: player.holding[0].sx,
				sy: player.holding[0].sy,
				w: SIZE*0.4,
				h: SIZE*0.5,
				x: WIDTH/2 - player.w/2,
				y: HEIGHT/2 - player.h/2,
				vx: speed * Math.cos(angle),
				vy: speed * Math.sin(angle),
				angle: angle,
				states: [{
					name: "fade",
					value: 9999
				},
				{
					name: "intangible",
					value: 250
				}]
			}));

			player.holding.shift();
			player.recalculateSpeed();
		}
	});

});