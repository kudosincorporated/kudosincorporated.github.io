


	//omigosh i love yavascript
	//time to declare global variables 😎




var canvas = document.getElementById("canvas"),
	ctx = canvas.getContext("2d");

canvas.width = canvas.height = 800;

var iso = new Isomer(document.getElementById("canvas"));

var Point  = Isomer.Point;
var Path   = Isomer.Path;
var Shape  = Isomer.Shape;
var Vector = Isomer.Vector;
var Color  = Isomer.Color;

var green = new Color(0, 102, 49);
var blue = new Color(102, 102, 255);
var red = new Color(255, 77, 77);
var orange = new Color(255, 153, 51);
var purple = new Color(153, 51, 255);
var white = new Color(255, 255, 255);

var cube = Shape.Prism(Point.ORIGIN);

var GAME = {
	player: {
		//fills up when newPerson() called
	},
	entry: {
		x: 0,
		y: 5
	},
	exit: {
		x: 5,
		y: 0
	},
	grid: [
		[1,1,1,1,0,0,0,1,0,1],
		[0,0,0,0,0,0,0,1,0,1],
		[0,0,0,0,0,0,0,1,0,1],
		[1,0,0,0,0,0,0,1,1,1],
		[0,0,0,0,0,0,0,0,0,0],
		[0,0,0,1,0,0,1,0,0,1],
		[0,0,0,1,0,0,1,0,0,1],
		[1,1,0,1,0,0,1,0,0,1],
		[0,1,0,1,0,0,1,0,0,1],
		[0,1,0,1,0,0,1,0,0,1]
	]
}




$(window).on('load', function() {

	var names = [
		'Lawrence Johnson',
		'Nancy Stewart',
		'Elizabeth Washington',
		'Justin Gray',
		'Andrew Hernandez',
		'Joan Young',
		'Stephen Simmons',
		'Laura Jones',
		'Timothy Cooper',
		'William Bell',
		'Diane Bennett',
		'Larry Murphy',
		'Pamela Turner',
		'Anthony Price',
		'Rachel Harris',
		'Rose Morgan',
		'Douglas King',
		'Raymond Davis',
		'Lois Perry',
		'Jimmy Ward',
		'Stephanie Martinez',
		'Helen Sanders',
		'Denise Wood',
		'Willie Moore',
		'Julie Flores',
		'Frank Richardson',
		'Anne Ramirez',
		'Kevin Campbell',
		'Harry Perez',
		'Jonathan Parker',
		'Mildred Kelly',
		'Gloria Henderson',
		'Ruth Walker',
		'Carol Bailey',
		'George Bryant',
		'Janice Williams',
		'Debra Garcia',
		'Jesse Smith',
		'Mark Green',
		'Jacqueline Russell',
		'Scott Griffin',
		'Christina Wright',
		'Bobby Powell',
		'Craig Alexander',
		'Gary Evans',
		'Heather Lopez',
		'Todd Edwards',
		'Jessica Allen',
		'Linda Foster',
		'Johnny Barnes'
	];

	var faces = [
		':)',
		';)',
		':D',
		':]',
		':{',
		':>',
		':P',
	];

	var special = [
		{
			name: "<b>I want to research my suburb's history. (Other facilities)</b>",
			id: "history",
			x: 6,
			y: 2
		},
		{
			name: "<b>I want to research my family tree. (Other facilities)</b>",
			id: "family",
			x: 6,
			y: 2
		},
		{
			name: "<b>I want to hire a bus to the library. (Other facilities)</b>",
			id: "bus",
			x: 6,
			y: 2
		},
		{
			name: "<b>I want to request a book in my language. (Front desk)</b>",
			id: "language",
			x: 2,
			y: 8
		},
		{
			name: "<b>I want to hire a library space for a meeting. (Front desk)</b>",
			id: "meeting",
			x: 2,
			y: 8
		},
		{
			name: "<b>I want to download the library app. (Front desk)</b>",
			id: "app",
			x: 2,
			y: 8
		},
		{
			name: "<b>I want to photocopy something. (Other facilities)</b>",
			id: "photocopy",
			x: 6,
			y: 2
		}
	]

	var normal = [
		{
			name: "I want to borrow a book. (Book lending)",
			id: "book",
			x: 5,
			y: 5
		},
		{
			name: "I want to find my favorite book. (Book lending)",
			id: "favorite",
			x: 5,
			y: 5
		},
		{
			name: "I want do some reading. (Book lending)",
			id: "reading",
			x: 5,
			y: 5
		},
		{
			name: "I want to browse the internet. (Computers)",
			id: "internet",
			x: 3,
			y: 1
		},
		{
			name: "I want to check my emails. (Computers)",
			id: "emails",
			x: 3,
			y: 1
		},
		{
			name: "I want to catch up on the news. (Computers)",
			id: "news",
			x: 3,
			y: 1
		}
	]

	/*class Person {
		constructor(name, knowledge) {
			this.name = name;
			this.knowledge = knowledge;
			var nds = [];
			for (let i=0; i < randInt(1,3); i++) {
				if (Math.random() < knowledge) {
					nds.push(rand(special));
				} else {
					nds.push(rand(normal));
				}
			}
			this.needs = nds;
			this.peth = [];
			this.loop = 0;
			this.x = 0;
			this.y = 6;

			this.peth = [];
		}
		read() {
			console.log(this);
		}
	}*/



  function render() {
  	ctx.clearRect(0, 0, canvas.width, canvas.height);

   	var ft = 0.2; //floor thickness
  	var wt = 0.2; //walls thickness
  	var wh = 3; //walls height;

	iso.add(Shape.Prism(new Point(0, 0, -ft), 5+wt, 5+wt, ft));

	/*
	iso.add(Shape.Prism(new Point(-9, 5/2, -ft), 9, 0.5, ft));
	iso.add(Shape.Prism(new Point(5/2, -9, -ft), 0.5, 9, ft));
	*/

	/*
	  for (x = 0; x < 6; x++) {
	    iso.add(new Path([
	      new Point(x, 0, 0),
	      new Point(x, 5, 0),
	      new Point(x, 0, 0)
	    ]), new Color(255, 255, 255));
	  }
	  for (y = 0; y < 6; y++) {
	    iso.add(new Path([
	      new Point(0, y, 0),
	      new Point(5, y, 0),
	      new Point(0, y, 0)
	    ]), new Color(140, 140, 140));
	  }

	   for (x = 0; x < 6; x++) {
	    iso.add(new Path([
	      new Point(x, 0.5, -0.5),
	      new Point(x, 5.5, -0.5),
	      new Point(x, 0.5, -0.5)
	    ]), new Color(255, 255, 255));
	  }
	  for (y = 0; y < 6; y++) {
	    iso.add(new Path([
	      new Point(0.5, y, -0.5),
	      new Point(5.5, y, -0.5),
	      new Point(0.5, y, -0.5)
	    ]), new Color(140, 140, 140));
	  }
	*/

	iso.add(Shape.Prism(new Point(5, 5, 0), wt, wt, wh));
	iso.add(Shape.Prism(new Point(0, 5, 0), 5, wt, wh));
	iso.add(Shape.Prism(new Point(5, 0, 0), wt, 5, wh));

	iso.add(Shape.Prism(new Point(9/2, 5/2, 0/2), 1/2, 5/2, 3/2), green);
	iso.add(Shape.Prism(new Point(6/2, 5/2, 0/2), 1/2, 5/2, 3/2), green);
	iso.add(Shape.Prism(new Point(3/2, 5/2, 0/2), 1/2, 5/2, 3/2), green);
	
	iso.add(Shape.Prism(new Point(8/2, 3/2, 0/2), 2/2, 1/2, 0.5/2), blue);
	iso.add(Shape.Prism(new Point(9/2, 0/2, 0/2), 1/2, 3/2, 3/2), blue);
	iso.add(Shape.Prism(new Point(8/2+0.1, 2/2+0.1, 0/2), 0.2, 0.2, 0.5), orange);
	iso.add(Shape.extrude(new Path([
	  Point(7/2, 3/2, 0),
	  Point(8/2, 3/2, 0),
	  Point(8/2, 4/2, 0)
	]), 0.5/2), blue);
	iso.add(Shape.Prism(new Point(7/2, 0/2, 0/2), 1/2, 3/2, 0.5/2), blue);

			iso.add(Shape.Prism(new Point(GAME.player.x/2+0.1, GAME.player.y/2+0.1, 0/2), 0.2, 0.2, 0.5), GAME.player.colour);

	iso.add(Shape.Prism(new Point(1/2, 8/2, 0/2), 1/2, 2/2, 0.5/2), purple);
	iso.add(Shape.Prism(new Point(0/2+0.1, 8/2+0.1, 0/2), 0.2, 0.2, 0.5), orange);
	iso.add(Shape.extrude(new Path([
	  Point(1/2, 7/2, 0),
	  Point(2/2, 8/2, 0),
	  Point(1/2, 8/2, 0)
	]), 0.5/2), purple);
	iso.add(Shape.Prism(new Point(0/2, 7/2, 0/2), 1/2, 1/2, 0.5/2), purple);

	iso.add(Shape.Prism(new Point(0/2, 0/2, 0/2), 4/2, 1/2, 0.5/2), red);

	iso.add(Shape.Prism(new Point(0/2, 0/2, 0.6), 0.2, 0.1, 0.02), red);
	iso.add(Shape.Prism(new Point(0/2, 0/2-0.2, 0.6), 0.4, 0.05, 0.3), red);
	iso.add(Shape.Prism(new Point(0/2+0.2, 0/2-0.2, 0.5), 0.1, 0.01, 0.2), red);

	iso.add(Shape.Prism(new Point(0/2+1, 0/2, 0.6), 0.2, 0.1, 0.02), red);
	iso.add(Shape.Prism(new Point(0/2+1, 0/2-0.2, 0.6), 0.4, 0.05, 0.3), red);
	iso.add(Shape.Prism(new Point(0/2+0.2+1, 0/2-0.2, 0.5), 0.1, 0.01, 0.2), red);

	//QR code
	//iso.add(Shape.Prism(new Point(0/2, 3/2, 0/2), 1/2, 1/2, 0.1/2), purple);
	iso.add(Shape.Prism(new Point(0/2+0.05, 3/2+0.2, 0.5/2), 0.5/2, 0.01/2, 0.5/2), purple);
	iso.add(Shape.Prism(new Point(0/2+0.2, 3/2+0.2, 0/2), 0.1/2, 0.1/2, 0.7/2), purple);

	/*
	iso.add(new Path([
	  Point(-9/2, 5/2, 0),
	  Point(0/2, 5/2, 0),
	  Point(0/2, 6/2, 0),
	  Point(-9/2, 6/2, 0)
	]), green);

	iso.add(new Path([
	  Point(5/2, -9/2, 0),
	  Point(6/2, -9/2, 0),
	  Point(6/2, 0/2, 0),
	  Point(5/2, 0/2, 0)
	]), red);
	*/

	var dt = 0.03; //door thickness
	var dh = 0.8; //door height

	iso.add(Shape.Prism(new Point(0/2, 5/2, 0), dt, dt, dh));
	iso.add(Shape.Prism(new Point(0/2, 6/2-dt, 0), dt, dt, dh));
	iso.add(Shape.Prism(new Point(0/2, 5/2, dh), dt, 0.5, dt));

	iso.add(Shape.Prism(new Point(5/2, 0/2, 0), dt, dt, dh));
	iso.add(Shape.Prism(new Point(6/2-dt, 0/2, 0), dt, dt, dh));
	iso.add(Shape.Prism(new Point(5/2, 0/2, dh), 0.5, dt, dt));


	/*
	for (let x = 0; x < 10; x++) {
		for (let y = 0; y < 10; y++) {
			if (GAME.grid[y][x] == 1) {
				iso.add(Shape.Prism(new Point(x/2, y/2, 3), 1/2, 1/2, 0.01));
			}
		}
	}
	*/

		ctx.font = "20px monospace";
		ctx.fillStyle = "white";

	ctx.fillText("Book lending", canvas.width/2-60+10, 120);
	ctx.fillText("Computers", canvas.width/2-50, 760);
	ctx.fillText("Front desk", 50, 200);
	ctx.fillText("Other facilities", canvas.width-230, 200);

		ctx.font = "12px monospace";

	ctx.fillText("(E.g. family history, bus hire)", canvas.width-230, 200+20);
	ctx.fillText("(E.g. library app, venue hire)", 50, 200+20);

		ctx.font = "bold 16px monospace";

	ctx.fillText("ENTRY", 180, 650);
	ctx.fillText("NSW HEALTH", 220, 690);
	ctx.fillText("QR CODE", 235, 705);
	ctx.fillText("EXIT", canvas.width-220, 650);

	ctx.beginPath();
	ctx.rect(120, 240, 2, 250);
	ctx.rect(canvas.width-120, 240, 2, 160);
	ctx.rect(canvas.width/2+10, 140, 2, 110);
	//ctx.rect(canvas.width/2+80, 700, 2, 50);
	//ctx.rect(canvas.width/2+62, 750, 20, 2);
	ctx.fill();

  }


	//PATHFINDING

	function newPerson() {
		GAME.player = {};

		GAME.peth = [];

		GAME.player.name = rand(names);
		GAME.player.age = randInt(16,80);
		GAME.player.face = rand(faces);

		GAME.player.x = GAME.entry.x;
		GAME.player.y = GAME.entry.y;
		GAME.player.knowledge = randInt(1,10)/10;

		var nds = [];

		//QR code
		if (Math.random() < GAME.player.knowledge*1.5) {
			nds.push({
				name: "<b>Scan QR code at the entrance.</b>",
				id: "qr",
				x: 0,
				y: 4
			});
		}


		for (let i = 0; i < randInt(1,3); i++) {
			if (Math.random() < GAME.player.knowledge) {
				nds.push(rand(special));
			} else {
				nds.push(rand(normal));
			}
		}
		nds.push({
			name: "",
			id: "leave",
			x: GAME.exit.x,
			y: GAME.exit.y
		});

		GAME.player.needs = nds;

		GAME.player.colour = new Color(randInt(0,255), randInt(0,255), randInt(0,255));


		//update id card
		$('.name').html(GAME.player.name);
		$('.age').html(GAME.player.age);
		$('.face').html(GAME.player.face);
		$('.head').css('background-color','rgb('+GAME.player.colour.r+', '+GAME.player.colour.g+', '+GAME.player.colour.b+')');
		$('.know_clr').css('background-color',getColor(Math.abs(GAME.player.knowledge-1)));

		function getColor(value) { //from StackOverflow https://stackoverflow.com/questions/7128675/from-green-to-red-color-depend-on-percentage/17267684
			//value from 0 to 1
			var hue = ((1-value)*120).toString(10);
			return ["hsl(",hue,",100%,50%)"].join("");
		}

		function getJob(age) {
			if (age <= 25) {
				return 'student';
			} else if (age <= 65) {
				return 'employee';
			} else {
				return 'retiree';
			}
		}

		$('.job').html(getJob(GAME.player.age));
		$('.knowledge').html(GAME.player.knowledge*10);

		updateTodo();
	}

	var easystar = new EasyStar.js();
	easystar.setGrid(GAME.grid);
	easystar.setAcceptableTiles([0]);

	function getPeth() {
		GAME.peth = [];

		GAME.player.x = Math.round(GAME.player.x);
		GAME.player.y = Math.round(GAME.player.y);

		easystar.findPath(GAME.player.x, GAME.player.y, GAME.player.needs[0].x, GAME.player.needs[0].y, function( path ) {
			if (path === null) {
				console.log("Path was not found!");
			} else {
				for (let i = 0; i < path.length; i++) {
					GAME.peth.push({
						x: path[i].x,
						y: path[i].y
					});
				}
			}
		});

		easystar.calculate();
	}

	function updateTodo() {
		var clean = '<ul>';
		for (let i = 0; i < GAME.player.needs.length-1; i++) {
			clean += '<li>'+GAME.player.needs[i].name+'</li>';
		}
		clean += '</ul>';
		$('#stats').html(clean);
	}


	newPerson();
	getPeth();


	var reqAnimDraw;
	var loop = 0;

	function draw() {
		reqAnimDraw = requestAnimationFrame(draw);

		if (GAME.peth.length == 0) {
			GAME.player.needs.splice(0, 1);
			if (GAME.player.needs.length != 0) {
				getPeth();
			} else {
				newPerson();
				getPeth();
			}
			updateTodo();
		}

		var nx = GAME.peth.length != 0 ? GAME.peth[0].x - GAME.player.x : 0;
		var ny = GAME.peth.length != 0 ? GAME.peth[0].y - GAME.player.y : 0;

		GAME.player.x += nx/10;
		GAME.player.y += ny/10;

		loop++;

		if (loop == 100) {
			loop = 0;
			GAME.peth.splice(0, 1);
		}

		render();
	}

	setTimeout(function() {
		draw();
	}, 0);


	$(window).focus(function() {
		console.log('focused');
		reqAnimDraw = requestAnimationFrame(draw);
	});

	$(window).blur(function() {
		console.log('blurred');
		cancelAnimationFrame(reqAnimDraw);
	});



})


function prettify(input) {
    var output = Math.round(input * 1000000)/1000000;
	return output;
}

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