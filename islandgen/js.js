var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = 1024;
canvas.height = 1024;

var size = 8;

var ctx = canvas.getContext('2d');

var island_size = 50;
var perlin_size = 15;
var heightmap = 50;

$(document).ready(function() {

	newSeed();
	create();

	//fill in values initally
	$('#size .val').html(island_size);
	$('#perlin .val').html(perlin_size);
	$('#heightmap .val').html(heightmap);

	$('#size .slider').on('input', function() {
		island_size = this.value;
		$('#size .val').html(this.value);
		create();
	});

	$('#perlin .slider').on('input', function() {
		perlin_size = this.value;
		$('#perlin .val').html(this.value);
		create();
	});

	$('#heightmap .slider').on('input', function() {
		heightmap = this.value;
		$('#heightmap .val').html(this.value);
		create();
	});

});

function newSeed() {
	noise.seed(Math.random());
}

function create() {
	var start = Date.now();

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (var x = 0; x < canvas.width/size; x++) {
	  for (var y = 0; y < canvas.height/size; y++) {
	    var value = noise.perlin2(x / perlin_size, y / perlin_size);
	    var rv1 = (value+1)/2;

	    var value2 = ((island_size/500)*Math.pow(x-canvas.width/size/2, 2)+100) + ((island_size/500)*Math.pow(y-canvas.height/size/2, 2)+100); //creates CIRCLE
	    var rv2 = value2/200 - 1; //converts to 0-1
	    if (rv2 > 1) rv2 = 1; //makes outside black
	    rv1 += rv2;

		ctx.beginPath();
		ctx.rect(x*size, y*size, size, size);
		//ctx.globalAlpha = rv1;
		//ctx.fillStyle = "black";
			if (rv1 > (heightmap*2 - 5)/100) {
				ctx.fillStyle = "#29a3a3"; //lightblue
			}
			else if (rv1 > (heightmap*2 - 20)/100) {
				ctx.fillStyle = "#5cd6d6"; //sand
			}	
			else if (rv1 > (heightmap*2 - 30)/100) {
				ctx.fillStyle = "#ffd480"; //forest
			}
			else if (rv1 > (heightmap*2 - 50)/100) {
				ctx.fillStyle = "#2eb82e"; //mount.
			}
			else {
				ctx.fillStyle = "#527a7a"; //darkblue
			}
		ctx.fill();
	  }
	}

	var end = Date.now();

	if(console) {
	  console.log('Rendered in ' + (end - start) + ' ms');
	}
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

/*function update() {
	$('.inv').html(inv.map(getItem));
}

function getItem(array) {
	var fullItem = "<div class='entry'><span class='name'>"+array.name+"</span></div>";
	return fullItem;
}*/