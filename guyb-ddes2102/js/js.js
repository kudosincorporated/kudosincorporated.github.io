//Canvas
var width = $(window).width();
var height = $(window).height();

var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");

canvas.width = width;
canvas.height = height;

var h = 300;
var s = 100;
var l = 90;

var line = 0;

function draw() {
	requestAnimationFrame(draw);

	render();

	function render() {
		ctx.fillStyle = 'hsl('+h+','+s+'%,'+l+'%)';

		if (line > 0) {
			if (line % 10 == 0) h--;
			line++;
		} else if (line < 0) {
			if (line % 10 == 0) h++;
			line--;
		} else if (line == 0) {
			line = randInt(-1500,1500);
		}

		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
}

window.requestAnimationFrame(draw);

//Static toggle
$('#topright button').on('click', function() {
	$('body').toggleClass('static');
});

//Title
for (let i = 0; i < $('#heading .text').text().length; i++) {
	var char = $('#heading .text').text().charAt(i);
	$('#heading').append('<div class="title item">'+char+'</div>');
	var wiggle = { x: randInt(-1,1)*4, y: randInt(-1,1)*4 }
	if (i % 3 == 0) wiggle.x = 0;
	$('body .title.item').eq(i).css({
		'transform':'translate('+wiggle.x+'px, '+wiggle.y+'px)'
	})
}
$('#heading').append('<div id="footer" class="item" style="margin-top: 200vh; margin-left: -200px;">Guy B. DDES2102</div>');
$('#heading .text').remove();

//Selecting items
for (let i = 0; i < $('.item').length; i++) {
	if (i > 11) {
		$('.item').eq(i).css({
			'top':randInt(100,(height*1.5)-300)+'px',
			'left':randInt(0,width-300)+'px',
			'z-index':i
		});
	}
}

$('.item').on('mousedown', function() {
	if ($(this).hasClass('selected')) {
		console.log('Clicked a window that is already selected.');
	} else {
		for (let i = 0; i < $('.item').length; i++) {
			var z = $('.item').eq(i).css("z-index");
			if (z - 1 >= 0) {
				$('.item').eq(i).css('z-index',(z-1));
			}
		}
		$(this).css('z-index',$('.item').length);
		$('.item').removeClass('selected');
		$(this).addClass('selected');
	}
});

setTimeout(function() {
	for (let i = 0; i < $('.item').length; i++) {
		if (i > 11) {
			$('.item').eq(i).css({
				'margin-top':randInt(-50,50)+'px',
				'margin-left':randInt(-50,50)+'px'
			});
		}
	}

	setTimeout(function() {
		$('.item').css('transition','100ms linear');
	}, 1000);
}, 100);

interact('.item').draggable({
	onmove: (event) => {
		const target = event.target;
		const dataX = target.getAttribute('data-x');
		const dataY = target.getAttribute('data-y');
		
		const initialX = parseFloat(dataX) || 0;
		const initialY = parseFloat(dataY) || 0;
		
		const deltaX = event.dx;
		const deltaY = event.dy;

		const newX = initialX + deltaX;
		const newY = initialY + deltaY;

		target.style.transform = `translate(${newX}px, ${newY}px`;

		target.setAttribute('data-x', newX);
		target.setAttribute('data-y', newY);
	}
})

function randInt(bottom, top) {
	return Math.floor(Math.random() * (top - bottom + 1)) + bottom;
}