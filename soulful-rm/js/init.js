var time;
var dt;

var spritesheet = new Image();

//HOWLER (SOUNDS)
Howler.volume(0.5);

var SOUND = {
	move: new Howl({ src: ['sounds/move.wav'] }),
	coin: new Howl({ src: ['sounds/coin.wav'] }),
	damage: new Howl({ src: ['sounds/damage.wav'] }),
	attack: new Howl({ src: ['sounds/attack.wav'] }),
	note: new Howl({ src: ['sounds/note.wav'] }),
	boss: new Howl({ src: ['sounds/boss.wav'] }),
	fail: new Howl({ src: ['sounds/fail.wav'] }),
	success: new Howl({ src: ['sounds/success.wav'] }),
	open: new Howl({ src: ['sounds/open.wav'] }),
	chop: new Howl({ src: ['sounds/chop.wav'] }),
	door: new Howl({ src: ['sounds/door.wav'] }),
	scythe: new Howl({ src: ['sounds/scythe.wav'] }),
	ominous: new Howl({ src: ['sounds/ominous.wav'] }),
	bossmove: new Howl({ src: ['sounds/bossmove.wav'] }),
	click: new Howl({ src: ['sounds/click.wav'] })
};

$(function() {

	//CANVAS
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var display = document.getElementById("display");

	canvas.height = display.height = HEIGHT*SIZE;
	canvas.width = display.width = (HEIGHT+10)*SIZE;

	var fisheye = new Fisheye(display);
	fisheye.setDistortion(FISHEYE_EFFECT, FISHEYE_EFFECT, FISHEYE_EFFECT);

	//SPRITESHEET
	spritesheet.src = 'spritesheet.png';

	//FIRST INITALISE
	GAME.player = new Mover('player', MIDDLE, MIDDLE);
	GAME.scythe = new Mover('scythe', MIDDLE, MIDDLE);
	GAME.inventory = new Mover('inventory', 0, 0);
	GAME.river_door = new Mover('river_door', RIVER_DOOR, HEIGHT-1);

	noise.seed(Math.random());
	GAME.map = new Map();
	GAME.map.fillWorld();

	let allItems = TILESET.collectables;
	for (let i = 0; i < allItems.length; i++) {
		//GAME.player.addItem(new Tile(allItems[i]), randInt(1,199));
	}

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

		//Whatever chuck it in the update fn
		GAME.map.checkCollisions();

		//This as well Idgaf
		GAME.map.deleteDeadEnemies();

		//Stop keyboardlock softlock from renderHurt
		if (GAME.player.progress == 0 && GAME.map.zap == 0) {
			KEYBOARDLOCK = false;
			GAME.player.animation = 'walking';
			SPEED = DEFAULT_SPEED;

			//Death
			if (GAME.player.hp <= 0) {
				NIGHTTIME = true;
			}
		}
		//But still keep that thang locked if ur dead
		if (GAME.player.hp <= 0) KEYBOARDLOCK = true;

	}

	function render() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = '#252525';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

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
		if (GAME.player.hp > 0) { //Sis is dead
			if (GAME.map.zap == 0) {
				GAME.scythe.render(ctx);
				GAME.player.renderHitbox(ctx);
			}
			GAME.player.render(ctx);
		}
		if (NIGHTTIME) GAME.player.renderShadow(ctx);
		ctx.translate(-horz, -vert);
		ctx.translate(-SIZE*5, 0); //To fit UI

		//UI
		GAMEFN.renderPlayerHealth(ctx);
		GAMEFN.renderMoney(ctx);
		GAMEFN.renderControlUI(ctx);
		if (GAME.player.invIsOpen) GAMEFN.renderInventory(ctx);

		//Final score
		if (GAME.player.hp <= 0 || WORLDPOS == 25) {
			if (GAME.map.progress == 0) { //Only show after animation
				drawDetail(ctx, MIDDLE+3, HEIGHT-2, 'score');
				drawNumber(ctx, FINAL_SCORE, (MIDDLE+6)*SIZE, (HEIGHT-2)*SIZE);
			}
		}

		fisheye.draw(canvas);
	}

	//KEY PRESSES
	$('body').on('keydown', function(e) {
		if (KEYBOARDLOCK) return;
		getKeyAndMove(e);

		TURN++;
		if (TURN > 64) TURN = 0; //64 don't matter, number is used for modulo

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
				case 82: //R key
					GAME.player.toggleInventory();
					break;
				////////////////////////////////////////////////////////////////
				default:
					//Nothing
			}
		}
	});


	//KEYDOWN
	$(document).on('keydown', function(e) {
		var key_code = e.which || e.keyCode;
		if (KEYDOWN.indexOf(key_code) === -1) KEYDOWN.push(key_code);
	});

	$(document).on('keyup', function(e) {
		var key_code = e.which || e.keyCode;
		KEYDOWN = KEYDOWN.filter(item => item !== key_code);
	});

	//Buttons!
	for (let i = 0; i <= 25; i++) {
		$('#buttons').append('<button onclick="goTo('+i+')">'+i+'</button>');
	}
	$('#buttons button').eq(WORLDPOS).addClass('selected');
	$('button').on('click', function() {
		$('button').removeClass('selected');
		$(this).addClass('selected');
	});

});

function goTo(point) {
	GAME.map = new Map();
	GAME.map.clear();
	WORLDPOS = point;
	GAME.map.fillWorld();
}