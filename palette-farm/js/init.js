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

	for (let i = 0; i < 10; i++) {
		let size = randInt(MIN_SIZE, MAX_SIZE);
		GAME.slimes.push(new Slime(size, size, randInt(0, WIDTH), randInt(MAX_SIZE*2, HEIGHT), rand(prettyColors)));
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

			GAME.slimes.sort((a, b) => a.y - b.y);

			e.update(dt);
			if (e.held) {
				e.drag(dt);
			} else {
				e.move(dt);
			}
		});
	}

	function render() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = '#1e017e';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = '#11024b';
		ctx.fillRect(0, 0, canvas.width, MAX_SIZE*2);

		ctx.fillStyle = '#ff5050';
		//ctx.fillRect(MOUSE.x, MOUSE.y, 5, 5);

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

});