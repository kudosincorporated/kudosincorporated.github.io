var time;
var dt;

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
		x: WIDTH/2-SIZE/2,
		y: HEIGHT/2-SIZE/2,
		holding: [{
			colour: "#ede19e",
			sx: 8,
			sy: 1
		}]
	})
];
var borders = [
	new Mover({
		type: "border",
		colour: "white",
		x: -WIDTH/2,
		y: -HEIGHT/2,
		w: WIDTH*2,
		h: HEIGHT*2
	})
];
var paperwork = [];
var bins = [];
var copiers = [];

let binCount = 0;
for (let a = 0; a <= 1; a++) {
	for (let b = 0; b <= 1; b++) {
		bins.push(new Mover({
			type: "bin",
			colour: colours[binCount],
			sx: 0,
			sy: 1+binCount,
			vx: 1,
			x: a*WIDTH - SIZE/2,
			y: b*HEIGHT - SIZE/2,
			SPEED: 1/3,
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
		x: randInt(0, WIDTH),
		y: randInt(0, HEIGHT)
	}));
}

$(function() {

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	spritesheet.src = 'spritesheet.png';

	spritesheet.onload = function() {
		window.requestAnimationFrame(gameLoop);
	}

	function gameLoop() {
		requestAnimationFrame(gameLoop);

		var now = new Date().getTime();
		dt = now - (time || now);
		time = now;

		update(dt);
		render();
	}

	let player = players[0];
	let border = borders[0];

	function update(dt) {
		player.updateStates(dt);
		player.pullAmmo(paperwork);
		player.checkContact(paperwork);
		player.animationController();

		border.moveFromKeyboard(dt);

		paperwork.forEach(e => {
			e.decelerate(dt);
			e.update(dt);
			e.updateStates(dt);
			e.moveFromKeyboard(dt);
			e.stopOnBorder(border);
		});

		bins.forEach(e => {
			e.pullTowards(paperwork);
			e.moveFromKeyboard(dt);
			e.randomlyMove();
			e.update(dt);
			e.updateStates(dt);
			e.checkContact(paperwork);
			e.bounceOnBorder(border);
			e.animationController();
		});

		copiers.forEach(e => {
			e.moveFromKeyboard(dt);
			e.spawnPaper();
			e.update(dt);
			e.updateStates(dt);
			//e.animationController();
		});

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

		border.draw(ctx);
		//player.drawRange(ctx);

		paperwork.forEach(e => {
			e.draw(ctx)
		});

		bins.forEach(e => {
			e.draw(ctx);
			//e.drawRange(ctx);
		});

		copiers.forEach(e => {
			e.draw(ctx);
		});

		player.draw(ctx);
		player.drawHolding(ctx);
	}

	$('body').on('keydown', function(e) {
		var key_code = e.which || e.keyCode;
		pressed.push(key_code);
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
		let speed = 9;
		let angle = Math.atan2(dy, dx);
		if (player.holding.length > 0) {

			paperwork.push(new Mover({
				type: "paperwork",
				colour: player.holding[0].colour,
				sx: player.holding[0].sx,
				sy: player.holding[0].sy,
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
		}
	});

});