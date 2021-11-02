
var tickspeed = 1;

var alphabet = [
	'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
	'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
];

var GAME = {
	inv: [],
	total: 0,
	available: ['a','b'],
	feed: [],
	feedChecker: 0,
	currentModal: 0,
	scores: [],
	active: false,
	inventory: {
		init() {
			$('#inv').html('');
			for (let i=0; i < alphabet.length; i++) {
				$('#inv').append('<div class="letter modal_open" id="open_'+alphabet[i]+'"><span class="name box letter_'+alphabet[i]+'">'+alphabet[i]+'<div class="overlay"></div></span><span class="box value"><span class="amt"></span></span></div>');
				$('#inv .letter:last-of-type').append('<div class="box rank">x1</div>');
				$('#inv .letter:last-of-type').append('<div class="progress"><div class="inner"></div></div>');
				//$('#inv .letter:last-of-type .box .overlay').css({'background-color':'hsl('+Math.round(360*alphabet.indexOf(alphabet[i])/alphabet.length)+', 100%, 50%)'});

				var $modal = $('#example_modal').clone();

				$('#modal_bg').append($modal);
				var id = 'open_'+alphabet[i];
				$('#modal_bg .modal:last-of-type').attr('id', id);
				$('#modal_bg .modal:last-of-type .curletter').html(alphabet[i]);
				$('#modal_bg .modal:last-of-type .nxtletter').html(alphabet[i+1]);
			}

			for (let z=0; z < 5; z++) {
				$('.upgrade').append('<div class="up"></div>');
			}
		},
		addLetter(name, amt) {
			if (name != null) {
				if (GAME.inv[name] == undefined) {
					GAME.inv[name] = new Letter(name, amt);
				} else {
					GAME.inv[name].change(amt);
				}
				
				$('#inv .letter .name.letter_'+name).parent().find('.amt').html(GAME.inv[name].amt);
				$('#inv .letter .name.letter_'+name).parent().addClass('found');

				GAME.total++;
				$('#total').html(GAME.total);
			}
		}
	},
	spacedust: {
		init() {
			GAME.feed = [];
			$('#game').html('');

			for (let a=0; a < 5; a++) {
				GAME.feed.push([]);
				$('#game').append('<div class="layer"></div>');

				for (let b=0; b < 5; b++) {
					var letter = rand(GAME.available);

					GAME.feed[a][b] = letter;

					$('#game .layer').eq(a).append('<div class="pickup box '+letter+'">'+letter+'<div class="overlay"></div></div>');
					$('#game .layer').eq(a).find('.pickup').eq(b).css({
						'top':(a*50)+'px',
						'left':(b*50)+'px'
					});

					var c = 50*alphabet.indexOf(letter)/alphabet.length;
					c = Math.abs(c-50)+50;
					$('#game .layer').eq(a).find('.pickup').eq(b).css({'background-color':'hsl(210, 100%, '+c+'%)'});
				}
			}
		}
	}
}

class Letter {
	constructor(name, amt) {
		this.name = name;
		this.amt = amt;
	}
	change(amt) {
		this.amt += amt;
	}
}

$(function() {

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d");

		canvas.width = 250;
		canvas.height = 300;

	GAME.available = alphabet;

	GAME.inventory.init();
	GAME.spacedust.init();

	$('#game').on('mouseover', '.pickup', function(e) {
		GAME.active = true;

		var x = $(this).parent().index();
		var y = $(this).index();

		GAME.inventory.addLetter(GAME.feed[x][y], 1);

		//hovered
		$(this).addClass('hovered');
		var disp = $('#game').offset(); 
		var offset = $('#inv .letter .name.letter_'+GAME.feed[x][y]).offset();
		$(this).css({
			'top':(offset.top - disp.top)+'px',
			'left':(offset.left - disp.left)+'px'
		});

		//scores
		var cursor = {
			x: e.pageX,
			y: e.pageY
		}

		var offset = $('#canvas').offset();

		var number = Math.pow(2, alphabet.indexOf(GAME.feed[x][y]));

		GAME.scores.push({
			text: numeral(number).format('0a'),
			disp: 0,
			x: cursor.x-offset.left,
			y: cursor.y-offset.top
		});

		GAME.feed[x][y] = null;
		GAME.feedChecker++;

		if (GAME.feedChecker == 25) {
			setTimeout(function() { //transition time
				$('#game .pickup').addClass('disappear');
				setTimeout(function() {
					GAME.spacedust.init();
				}, 300);
				GAME.feedChecker = 0;
			}, 300);
		}
	});

	//floatingtext scores
	/*var interval = setInterval(function() {
		if (GAME.active) {
			ctx.clearRect(0,0,canvas.width,canvas.height);
			for (let i=0; i < GAME.scores.length; i++) {
				GAME.scores[i].disp++;

				var score = GAME.scores[i];

				ctx.save();

				ctx.font = '16px sans-serif';
				ctx.fillStyle = '#414756';
					var num = score.disp/100;
					var cosNum = 1 - Math.cos((num * Math.PI) / 2); //https://easings.net/#easeInSine
				//ctx.globalAlpha = Math.abs(num-1);
				ctx.fillText(score.text, score.x, score.y-cosNum*25);

				ctx.restore();

				if (GAME.scores[i].disp >= 100) {
					GAME.scores.splice(i, 1);

					//check if game isn't active
					if (GAME.scores.length == 0) {
						GAME.active = false;
						ctx.clearRect(0,0,canvas.width,canvas.height);
					}
				}
			}
		}
	}, tickspeed);*/


	$('#tabmenu .tablist .tab').on('click', function() {
		$('.tab').removeClass('selected');
		$(this).addClass('selected');

		var ind = $(this).index();
		ind = 1-ind;

		for (let i=0; i < $('#main .container').length; i++) {

			var val = ((i-1)*100)+(ind*100);

			$('#main .container').eq(i).css({
				'left':val+'%'
			});
		}
	});

	//modal
	$('.modal_open').on('click', function() {
		var id = $(this).attr('id');
		var index = $('.modal#'+id).index();
		openModal(index);
	});

	$('.modal').on('click', function() {
		var index = $(this).index();
		if (GAME.currentModal != index) {
			openModal(index);
		}
	});

	function openModal(ind) {
		$('#modal_bg').fadeIn();
		$('#crossmark').fadeIn();

		$('.modal').hide();

		for (let i=-2; i < 5; i++) {
			var n = ind + i;
			$('.modal').eq(n).show();
			$('.modal').eq(n).css({
				'left':i*50+'%'
			});
		}

		GAME.currentModal = ind;
	}

	$('.modal_close').on('click', function() {
		closeModal();
	});

	/*$('#modal_bg').on('click', function(e) {
		if (e.target !== this) return;
		closeModal();
	});*/

	function closeModal() {
		$('#modal_bg').fadeOut();
		$('#crossmark').fadeOut();
	}

	$('#modal_bg').hide();
	$('#modal_bg').css('opacity','1');

})







function prettify(input) {
	var output = Math.round(input * 1000000)/1000000;
	return output;
}

function rand(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function findTile(x, y, array) {
	return array[y * width + x];
}

function randInt(bottom, top) {
	return Math.floor(Math.random() * (top - bottom + 1)) + bottom;
}