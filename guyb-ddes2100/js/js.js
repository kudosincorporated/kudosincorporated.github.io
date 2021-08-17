


var palette = ['#4b5bab','#4da6ff','#eb564b','#ff9166','#bd4882','#ff6b97','#3ca370','#8fde5d']
var toys = [
	'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/gh-best-toys-every-age-index-1572461597.png?crop=0.492xw:0.984xh;0,0&resize=640:*',
	'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1571331044-bst-toys-fisher-price-phone-1571330613.jpg?crop=1xw:1xh;center,top&resize=480:*',
	'https://sydneylivingmuseums.com.au/sites/default/files/styles/heroimages/public/LON14_TOY_055.jpg?itok=3GP8pQPN',
	'https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1571330083-31tp3Eb3qL.jpg?crop=0.986xw:1xh;center,top&resize=480:*',
	'https://i.ebayimg.com/images/g/g8cAAOSwOA5g~e05/s-l400.webp',
	'https://images.unsplash.com/photo-1535572290543-960a8046f5af?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpbGRyZW5zJTIwdG95c3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
	'https://i.pinimg.com/564x/30/66/1b/30661b6b0a2b9097830c89a1076171ad.jpg',
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9FQdYsWacUdHsSMHQIXSM87KY_T7Pkl5UdA&usqp=CAU',
	'https://i.ebayimg.com/images/g/diUAAOSwCN5dxgK8/s-l300.jpg',
	'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxWggdrpsTwEfTm_SuGXNILF4046jdV5yx9A&usqp=CAU',
	'https://i.ebayimg.com/images/g/FOIAAOSwoBFeO~RA/s-l300.jpg',
	'https://www.bhg.com.au/media/36084/ebay-toys-5.jpg?width=720&center=0.0,0.0',
	'https://i.ebayimg.com/images/g/1OAAAOSwo8FfFd-t/s-l300.jpg'
];
var names = [
	'pinky',
	'bloopey',
	'blue',
	'hobbes',
	'squeaky',
	'pogo',
	'frubby',
	'dinko',
	'red',
	'greenie'
];

$(function() {
	
	for (let a=0; a < 12; a++) {
		$('#posts').append('<div class="post modal_open" id="toy" data-tilt></div>');

		$('#posts').find('.post').eq(a).append('<img src="'+rand(toys)+'" class="img">');
		$('#posts').find('.post').eq(a).append('<div class="name">'+rand(names)+'</div>');

		$('#posts').find('.post').eq(a).css({
			'background-color':rand(palette)
		})

		$('#posts').find('.post').eq(a).tilt();
	}




	//clicking on an item
	$('.post').on('click', function() {
		var colour = $(this).css('background-color');
		var name = $(this).find('.name').html();
		var image = $(this).find('img').attr('src');

		$('#toy .container').css({
			'background-color':colour
		})

		$('#toy-name').css({
			'color':colour
		})

		$('#toy-name').html("stories about "+name);

		$('#toy-image').attr("src", image);
	})








	//modal stuff
	$('.modal_open').on('click', function() {
		var id = $(this).attr('id');
		openModal(id);
	});

	function openModal(id) {
		$('#modal_bg').fadeIn();
		$('.modal').hide();
		$('#'+id+'.modal').show();
	}

	$('.modal_close, #modal_bg').on('click', function(e) {
		if (e.target !== this) return;

		closeModal();
	});

	function closeModal() {
		$('#modal_bg').fadeOut();
	}

	$('#modal_bg').hide();
	$('#modal_bg').css('opacity','1');

});

function rand(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function randInt(bottom, top) {
	return Math.floor(Math.random() * (top - bottom + 1)) + bottom;
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}