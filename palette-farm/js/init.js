var time;
var dt;

$(function() {

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = WIDTH;
	canvas.height = HEIGHT;

	/*GAME.slimes.push(new Slime(SIZE, SIZE, 200, 300, '#ff5050'));
	GAME.slimes.push(new Slime(SIZE, SIZE, 250, 400, '#70e000'));
	GAME.slimes.push(new Slime(SIZE, SIZE, 150, 500, '#4361ee'));*/

	for (let i = 0; i < 19; i++) {
		let size = randInt(MIN_SIZE, MAX_SIZE);
		GAME.slimes.push(new Slime(size, size, randInt(MAX_SIZE*2, WIDTH-MAX_SIZE*2), randInt(MAX_SIZE*2, HEIGHT-MAX_SIZE*2), rand(prettyColors)));
	}

	window.requestAnimationFrame(gameLoop);

	function gameLoop() {
		requestAnimationFrame(gameLoop);

		var now = new Date().getTime();
		dt = now - (time || now);
		time = now;

		update(dt);
		render();
	}

	function update(dt) {
		GAME.slimes.forEach(function(e, i) {
			if (Math.random() < 0.01) {
				if (e.progress == 0 && !e.held) {
					e.startMoving();
				}
			}

			e.update(dt);

			GAME.slimes.sort((a, b) => a.y - b.y);

			if (e.held) {
				e.drag(dt);
			} else {
				e.move(dt);
			}

			let deg = 0;
			if (KEYDOWN.indexOf(81) >= 0) deg += 1/10;
			if (KEYDOWN.indexOf(69) >= 0) deg -= 1/10;
			e.rotate(dt, deg);

			let cameraMoveX = 0;
			let cameraMoveY = 0;
			if (KEYDOWN.indexOf(87) >= 0) cameraMoveY -= 1/5;
			if (KEYDOWN.indexOf(65) >= 0) cameraMoveX -= 1/5;
			if (KEYDOWN.indexOf(83) >= 0) cameraMoveY += 1/5;
			if (KEYDOWN.indexOf(68) >= 0) cameraMoveX += 1/5;
			e.cameraMove(dt, cameraMoveX, cameraMoveY);
		});
	}

	function render() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = '#1e017e';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = '#ff5050';
		//ctx.fillRect(MOUSE.x, MOUSE.y, 5, 5);

		GAME.slimes.forEach(function(e) {
			e.renderShadow(ctx);
		});

		GAME.slimes.forEach(function(e) {
			e.render(ctx);
		});
	}

	$(document).on('mousemove', function(e) {
		MOUSE = {
			x: e.pageX - canvas.offsetLeft,
			y: e.pageY - canvas.offsetTop,
		}
		$('#mouse').text(MOUSE.x+" "+MOUSE.y);
	});

	$(document).on('mousedown', function() {
		//Check if we are clicking a slime!
		for (let i = GAME.slimes.length-1; i >= 0; i--) {
			let e = GAME.slimes[i];

			if (
				MOUSE.x >= e.x &&
				MOUSE.x <= e.x+e.w &&
				MOUSE.y >= e.y &&
				MOUSE.y <= e.y+e.h
			) {
				e.held = true;
				break;
			}
		}
	});

	$(document).on('mouseup', function() {
		GAME.slimes.forEach(function(e) {
			e.held = false;
		});
	});

	$(document).on('keydown', function(e) {
		var key_code = e.which || e.keyCode;
		if (KEYDOWN.indexOf(key_code) === -1) KEYDOWN.push(key_code);
		updateKeycodeDOM();
	});

	$(document).on('keyup', function(e) {
		var key_code = e.which || e.keyCode;
		KEYDOWN = KEYDOWN.filter(item => item !== key_code);
		updateKeycodeDOM();
	});

	function updateKeycodeDOM() {
		$('#keycodes').text(KEYDOWN);
	}

});