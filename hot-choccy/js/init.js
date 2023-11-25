var time;
var dt;

var PAUSED = false;

//var spritesheet = new Image();

$(function() {

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d", { willReadFrequently: true });
	var upscaled = document.getElementById("upscaled"),
		utx = upscaled.getContext("2d");

	GAME.world = new World();
	GAME.upgrades = new upgradeManager();

	canvas.width = GAME.world.width;
	canvas.height = GAME.world.height;
	upscaled.width = GAME.world.width*GAME.ratio;
	upscaled.height = GAME.world.height*GAME.ratio;

	//spritesheet.src = 'spritesheet.png';

	//spritesheet.onload = function() {
		window.requestAnimationFrame(gameLoop);
	//}

	function togglePause() {
		PAUSED = !PAUSED;
	
		if (!PAUSED) {
			time = new Date().getTime() - dt;
			gameLoop();
		}
	}

	function gameLoop() {
		var now = new Date().getTime();
		dt = now - (time || now);
		time = now;

		update(dt);
		render();

		fps = Math.round(1000 / dt);
		$('#fps').text(fps);
		
		if (PAUSED) return;
		window.requestAnimationFrame(gameLoop);
	}

	function update(dt) {
		GAME.world.update(dt);
		if (!GAME.upgrades.inUpgradeWorld) {
			GAME.world.spawnEnemies();
			GAME.world.playerShoot();
		}
	}

	function render() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = '#123';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		GAME.world.renderPlayerUI(ctx);
		GAME.world.renderPlayerHealth(ctx);
		GAME.world.render(ctx);

		if (PAUSED) GAME.world.renderPauseScreen(ctx);
		//GAME.world.renderLoseScreen(ctx);

		var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		function posterize(imageData, levels) {
			var data = imageData.data;
			var numLevels = Math.pow(2, levels);

			for (var i = 0; i < data.length; i += 4) {
				// Apply posterize effect to each RGB channel
				data[i] = Math.floor(data[i] / 256 * numLevels) * (256 / numLevels);
				data[i + 1] = Math.floor(data[i + 1] / 256 * numLevels) * (256 / numLevels);
				data[i + 2] = Math.floor(data[i + 2] / 256 * numLevels) * (256 / numLevels);
			}

			return imageData;
		}

		imageData = posterize(imageData, 1);

		for (var y = 0; y < canvas.height; y++) {
			for (var x = 0; x < canvas.width; x++) {
				var index = (y * canvas.width + x) * 4; // Each pixel has 4 values (RGBA)

				// Get the RGBA values from the small canvas
				var red = imageData.data[index];
				var green = imageData.data[index + 1];
				var blue = imageData.data[index + 2];
				var alpha = imageData.data[index + 3];

				// Draw the pixel on the larger canvas at scaled coordinates
				utx.fillStyle = "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
				utx.fillRect(x * GAME.ratio, y * GAME.ratio, GAME.ratio, GAME.ratio); // Scale factor is 2 in this example
			}
		}

		//utx.fillStyle = 'red';
		//utx.fillRect(upscaled.width/2, upscaled.height/2, 2, 2);
	}

	$('body').on('mousemove', function(e) {
		GAME.mouse.x = e.clientX;
		GAME.mouse.y = e.clientY;
		//GAME.world.player[0].directToMouse();
	});

	$('body').on('mousedown', function() {
		GAME.mouse.down = true;
	});

	$('body').on('mouseup', function() {
		GAME.mouse.down = false;
	});

	$('body').on('keydown', function(e) {
		var key_code = e.which || e.keyCode;
		GAME.keydown.push(key_code);
		GAME.keydown = [...new Set(GAME.keydown)];

		if (
			GAME.keydown.indexOf(27) >= 0 ||
			GAME.keydown.indexOf(9) >= 0
		) togglePause();

		if (
			GAME.keydown.indexOf(82) >= 0
		) GAME.upgrades.toggleUpgradeWorld();
	});

	$('body').on('keyup', function(e) {
		var key_code = e.which || e.keyCode;
		GAME.keydown = GAME.keydown.filter(item => item !== key_code);
	});

});