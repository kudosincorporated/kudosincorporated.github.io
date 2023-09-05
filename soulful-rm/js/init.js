var time;
var dt;

var spritesheet = new Image();

$(function() {

	//CANVAS
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	canvas.height = HEIGHT*SIZE;
	canvas.width = (HEIGHT+10)*SIZE;

	//SPRITESHEET
	spritesheet.src = 'spritesheet.png';

	//FIRST INITALISE
	noise.seed(Math.random());
	GAME.map = new Map();
	GAME.map.create();
	GAME.map.addRiver();
	GAME.map.updateAndSetGrid();
	GAME.player = new Mover('player', Math.round(HEIGHT/2), Math.round(HEIGHT/2));
	GAME.player.maxhp = 6;
	GAME.player.hp = 6;
	GAME.scythe = new Mover('scythe', Math.round(HEIGHT/2), Math.round(HEIGHT/2)-1);
	GAME.inventory = new Mover('inventory', 0, 0);

	/*let allItems = Object.keys(TILE);
	for (let i = 0; i < 16; i++) {
		GAME.player.addItem(new Tile(allItems[i]), randInt(1,199));
	}*/

	//2ND WORLD
	GAME.two = {};

	//CONVERT TEXT
	for (let i = 0; i < $('.convert').length; i++) {
		$('.convert').eq(i).html(convertText($('.convert').eq(i).text()));
	}

	//START GAME
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

	function update(dt) {

		GAMEFN.updateFrameAnimation(dt);
		GAMEFN.lerpAllMovement(dt);

		if (Object.keys(GAME.two).length > 0) GAME.two.update(dt);
		GAME.map.update(dt);

	}

	function render() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.translate(SIZE*5, 0); //To fit UI

		//Slide (fake) world
		if (Object.keys(GAME.two).length > 0) GAME.two.render(ctx);

		//Real (active) world
		GAME.map.render(ctx);

		//Player
		let canv = HEIGHT*SIZE;
		let horz = GAME.map.pos[0]*canv - GAME.map.dir[0]*canv*GAME.map.progress;
		let vert = GAME.map.pos[1]*canv - GAME.map.dir[1]*canv*GAME.map.progress;
		ctx.translate(horz, vert);
		GAME.scythe.render(ctx);
		GAME.player.render(ctx);
		GAME.player.renderHitbox(ctx);
		ctx.translate(-horz, -vert);
		ctx.translate(-SIZE*5, 0); //To fit UI

		//UI
		GAMEFN.renderPlayerHealth(ctx);
		GAMEFN.renderMoney(ctx);
		GAMEFN.renderTopRightUI(ctx);
		GAMEFN.renderInventory(ctx);
	}

	//KEY PRESSES
	$('body').on('keydown', function(e) {
		getKeyAndMove(e);

		function getKeyAndMove(e) {
			var key_code = e.which || e.keyCode;
			switch (key_code) {
				////////////////////////////////////////////////////////////////
				case 38: //Up arrow key
					GAME.player.move(0, -1);
					break;
				case 37: //Left arrow key
					GAME.player.move(-1, 0);
					break;
				case 40: //Down arrow key
					GAME.player.move(0, 1);
					break;
				case 39: //Right arrow key
					GAME.player.move(1, 0);
					break;
				////////////////////////////////////////////////////////////////
				case 87: //W key
					GAME.player.look(0, -1);
					break;
				case 65: //A key
					GAME.player.look(-1, 0);
					break;
				case 83: //S key
					GAME.player.look(0, 1);
					break;
				case 68: //D key
					GAME.player.look(1, 0);
					break;
				////////////////////////////////////////////////////////////////
				case 90: //Z key
					GAME.player.mine();
					GAME.player.attack();
					GAME.map.updateAndSetGrid();
					break;
				case 88: //X key
					break;
				case 67: //C key
					GAME.player.throwScythe();
					break;
				case 86: //V key
					break;
				case 86: //B key
					break;
				case 81: //Q key
					GAME.player.adjustSlot(-1);
					break;
				case 69: //E key
					GAME.player.adjustSlot(1);
					break;
				case 70: //F key
					GAME.player.place();
					break;
				////////////////////////////////////////////////////////////////
				default:
					//Nothing
			}
		}
	});


});