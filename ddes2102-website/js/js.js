
var numOfPages = 0;
var pageNo = 0;

$(function() {

	numOfPages = $('#main .page').length;
	console.log('Number of pages: '+numOfPages);

	$('#arrows').on('click', '.arrow', function() {
		var id = $(this).attr('id');

		if (id == 'leftarrow') {
			pageNo--;
		} else if (id == 'rightarrow') {
			pageNo++;
		}

		updatePages();
	});

	$('#projects').on('click', function() {
		pageNo = 0;
		updatePages();
	});

	$('#contact').on('click', function() {
		pageNo = 4;
		updatePages();
	});

	function updatePages() {
		$('#arrows .arrow').css('top','10%');
		if (pageNo == 0) $('#leftarrow').css('top','-100%');
		if (pageNo == numOfPages) $('#rightarrow').css('top','100%');
		if (pageNo < 0) pageNo = 0;
		if (pageNo > numOfPages-1) pageNo = numOfPages-1;

		for (let i = 0; i < numOfPages; i++) {
			$('#main .page').eq(i).css('left',((i-pageNo)*100 + 10)+'%');
		}
	}

});







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