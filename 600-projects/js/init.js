var time;
var dt;

var projects = [];
var canvasSize = 800;
var slices = 25;
var size;
var halfSize;

var mouse = {x: 0, y: 0};

var pageTitle;

$(function() {

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	pageTitle = $('#title').text();

	let windowWidth = $(window).width();
	
	if (windowWidth < 768) canvasSize = windowWidth;
	canvas.width = canvas.height = canvasSize;
	size = canvasSize / slices;
	halfSize = size / 3.5;

	var lookAtYears = false;
	var selectedYear;
	var lookAtFilter = false;
	var selectedFilter;

	function gameLoop() {
		requestAnimationFrame(gameLoop);

		var now = new Date().getTime();
		dt = now - (time || now);
		time = now;

		update(dt);
		render();
	}

	function update(dt) {

	}

	function render() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		projects.forEach((p, i) => {
			let x = i % slices;
			let y = Math.floor(i / slices);
			x += 0.5;
			y += 0.6;
			x *= size;
			y *= size;
			let m = p.memorability / 5;
			let d = p.dynamism / 5;
			let l = p.idea / 5;

			if (p.highest == 'all') {
				drawCircle(ctx, x, y-halfSize/2, '#ff4da6', m*halfSize*1.5, m, p);
			} else {
				drawCircle(ctx, x, y-halfSize, '#ffcc00', m*halfSize, m, p);
				drawCircle(ctx, x-halfSize/2, y, '#3366ff', d*halfSize, d, p);
				drawCircle(ctx, x+halfSize/2, y, '#ff3333', l*halfSize, l, p);
			}
		});
	}

	function drawCircle(ctx, x, y, color, size, opacity, p)
	{
		ctx.beginPath();
		ctx.arc(x, y, size, 0, 2 * Math.PI);
		ctx.fillStyle = color;
		ctx.globalAlpha = opacity;

		if (lookAtYears) {
			if (p.year == selectedYear) {
				ctx.globalAlpha = opacity;
			} else {
				ctx.globalAlpha = 0.1;
			}
		} else if (lookAtFilter) {
			if (p.highest == selectedFilter && p[p.highest] == 5) {
				ctx.globalAlpha = opacity;
			} else {
				ctx.globalAlpha = 0.1;
			}

			if (p.highest == selectedFilter && p.highest == 'all') {
				ctx.globalAlpha = opacity;
			}
		}
		
		ctx.fill();
	}

	$('#years').on('mouseenter', 'div', function() {
		lookAtYears = true;
		let year = $(this).text();
		selectedYear = parseInt(year);
	});

	$('#filter').on('mouseenter', 'div', function() {
		lookAtFilter = true;
		let filter = $(this).find('.filter').text();
		selectedFilter = filter;
	});

	$('.sidebar').on('mouseleave', function() {
		lookAtYears = false;
		lookAtFilter = false;
	});

	$('#canvas').on('mousemove', function(e) {
		var canvasOffset = $(this).offset();
		mouse.x = e.pageX - canvasOffset.left;
		mouse.y = e.pageY - canvasOffset.top;

		let nx = Math.floor(mouse.x / size);
		let ny = Math.floor(mouse.y / size);
		let index = ny * slices + nx;

		let titleText = $('#title').text();
		if (titleText != projects[index].title) {
			$('#title').html('<div class="animate">' + projects[index].title + '</div>');
		}

		let highest = projects[index].highest;
		if (highest == 'memorability') {
			$('#title').css('color', '#ffcc00');
		} else if (highest == 'dynamism') {
			$('#title').css('color', '#3366ff');
		} else if (highest == 'idea') {
			$('#title').css('color', '#ff3333');
		} else if (highest == 'all') {
			$('#title').css('color', '#ff4da6');
		}
	});

	function getHighestKey(obj) {
		// Get the keys of the object
		const keys = Object.keys(obj);

		// Remove title and year
		keys.splice(0, 2);
		
		// Check if all values are 5
		const allAreFive = keys.every(key => obj[key] === 5);
		if (allAreFive) {
			return 'all';
		}

		// Find the key with the highest value
		let highestKey = keys[0]; // Start by assuming the first key has the highest value
	
		// Loop through the object to find the highest value
		for (let i = 1; i < keys.length; i++) {
			if (obj[keys[i]] > obj[highestKey]) {
				highestKey = keys[i]; // Update highestKey if current value is greater
			}
		}
	
		return highestKey;
	}

	$('#canvas').on('mouseleave', function() {
		$('#title').html('<div class="animate">' + pageTitle + '</div>');
		$('#title').css('color', '#eee');
	});

    $.getJSON("my-work.json", function(data) {
        projects = data.projects;

		projects.forEach((p, i) => {
			p.highest = getHighestKey(p);
		});

        window.requestAnimationFrame(gameLoop);
    });

});