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

	for (let i = 0; i < 25; i++) {
		let size = randInt(SIZE/4, SIZE/2);
		GAME.slimes.push(new Slime(size, size, randInt(0, WIDTH), randInt(0, HEIGHT), rand(prettyColors)));
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
		GAME.slimes.forEach(function(e) {
			if (Math.random() < 0.01) {
				if (e.progress == 0) {
					e.startMoving();
				}
			}

			GAME.slimes.sort((a, b) => a.y - b.y);

			e.update(dt);
		});
	}

	function render() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = '#1e017e';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		GAME.slimes.forEach(function(e) {
			e.render(ctx);
		});
	}

});