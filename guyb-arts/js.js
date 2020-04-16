
var Game = {
	main: {
		money: 0,
		sellnum: 1
	},
	humans: {
		users: 1,
		usersps: 0,
		notoriety: 0,
		notorietyps: 0,
		carttime: 3000
	},
	experience: {
		map: [],
		height: 4,
		width: 4,
		emotes: [
			'envy',
			'joy',
			'anger',
			'pity',
			'bore',
			'laugh'
		],
		data: 0,
		pos: 0,
		clickd: '',
		dataBuyers: []
	},
	rands: {
		name: [
			'Thomas',
			'James',
			'Ethan',
			'George',
			'Oliver',
			'Charlotte',
			'Ava',
			'Mia',
			'Emily',
			'Sophia'
		],
		type: [
			'Liked a post about ',
			'Added a friend who likes ',
			'Watched a video about ',
			'Scrolled past a post about ',
			'Their profile picture now includes '
		],
		topic: [
			'dogs',
			'cats',
			'current events',
			'politics',
			'comedy',
			'cooking',
			'travel',
			'reality TV',
			'movies',
			'celebrities',
			'the arts',
			'their mother'
		],
		join: [
			'They like ',
			"They can't live without ",
			'They absolutly despise ',
			'They use the internet for ',
			'More than anything else, they love '
		],
		company: [
			'Americorp',
			'Datatech',
			'Swindlr',
			'Aglo.io',
			'Data R Us',
			'AI Capital',
			'Big Data Pty Ltd',
			'Ausgorithm',
			'HugePharma',
			'Expertech'
		],
		tagline1: [
			'We love ',
			'Our mission is to remove ',
			'Humans > ',
			'Innovate, Learn, ',
			'The next big thing: ',
			"Our website doesn't have ",
			'1, 2, 3, ',
			'Our commitment to ',
			'Real ',
			'One word: '
		],
		tagline2: [
			'Tech',
			'People',
			'Users',
			'Data',
			'Innovate',
			'Genius',
			'Experience',
			'Emotion',
			'Poodles',
			'AI',
		]
	}
}

$(document).ready(function() {

	createExp();
	updateExp();
	updateValues();

	setInterval(function() {

		addEmote();
		updateExp();

	}, 1000);

	setInterval(function() {

		Game.humans.users += Game.humans.usersps;
		Game.humans.notoriety += Game.humans.notorietyps;

		updateValues();

	}, 1000);

	$('.map').on('mousedown', '.tile', function() {
		var ind = $(this).index();

		if (Game.experience.map[ind].name != "") {
			Game.experience.clickd = Game.experience.map[ind];
			Game.experience.map[ind] = newUser('', '', '', '', '');
			Game.experience.data++;
			$('.map .tile').eq(ind).find('.inner').addClass('disappear');

			addData();

			if (Math.random() <= 0.5) {
				Game.experience.dataBuyers.push(newDataBuyer(rand(Game.rands.company), rand(Game.rands.tagline1), rand(Game.rands.tagline2), randInt(5, 20)));
			}
			updateDataBuyers();
		}
	});

	$('.map_cover').bind('mousemove', function(e){
		$('.cards').css({
			left:  e.pageX + 20,
			top:   e.pageY - 10
		});
	});

	$('.map_cover').on('mouseleave', function(e){
		$('.cards').hide();
	});

	$('.map').on('mouseover', '.tile', function(e) {
		var ind = $(this).index();

		if (Game.experience.map[ind].name == "") {
			$('.cards').hide();
		}
		else {
			$('.cards').show();

			$('.name').html(Game.experience.map[ind].name);
			$('.age').html(Game.experience.map[ind].age);
			$('.type').html(Game.experience.map[ind].type);
			$('.topic').html(Game.experience.map[ind].topic);
		}
	});

	$('.data-buyers').on('mousedown', '.btn', function() {
		var ind = $(this).parent().parent().index();

		Game.main.money += getMulti(Game.experience.dataBuyers[ind].multi);

		Game.experience.dataBuyers.splice(ind, 1);

		if (Game.experience.data != 0) {
			Game.main.sellnum++;
		}

		Game.experience.data = 0;

		$('.data .entry').slideUp();
		updateValues();
		updateDataBuyers();

	});





	//for testing
	for (i = 0; i < Game.experience.height*Game.experience.width; i++) {
		Game.experience.map[i] = newUser(rand(Game.experience.emotes), rand(Game.rands.name), randInt(13, 50), rand(Game.rands.type), rand(Game.rands.topic));
		updateExp();
	}

	log("You have joined.");

})

function createExp() {
	Game.experience.map = [];

	for (i = 0; i < Game.experience.height*Game.experience.width; i++) {
		Game.experience.map.push(newUser('', '', '', '', ''));
	}
}

function newUser(id, name, age, type, topic) {
	return {
		id: id,
		name: name,
		age: age,
		type: type,
		topic: topic
	}
}

function updateExp() {
	$('.map').html("");

	/*for (i = 0; i < Game.experience.height*Game.experience.width; i++) {
		if (Game.experience.map[i] != "") {
			$('.map').append('<div class="tile"><div class="inner pointer '+Game.experience.map[i]+'">'+emoticon(Game.experience.map[i])+'</div></div>');
		}
		else {
			$('.map').append('<div class="tile"><div class="inner '+Game.experience.map[i]+'">'+emoticon(Game.experience.map[i])+'</div></div>');
		}
		
	}*/

	$('.map').html(Game.experience.map.map(getItem));

	$('.map .tile').eq(Game.experience.pos).find('.inner').addClass('appear');
}

function getItem(array) {
	if (array.name != "") {
		var fullItem = '<div class="tile"><div class="inner pointer '+array.id+'">'+emoticon(array.id)+'</div></div>';
	}
	else {
		var fullItem = '<div class="tile"><div class="inner '+array.id+'">'+emoticon(array.id)+'</div></div>';
	}
	return fullItem;
}



function addData() {
	var strin = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
	//var len = strin.length/2;
	//var s1 = strin.slice(0, len);
	var strin2 = strin.split("").reverse().join("");
	var main = 'C:/Data/' + Game.experience.clickd.id + '/' + strin + strin2 + '.txt';
;	$('.data').prepend('<div class="entry">'+main+'</div>');
	$('.data .entry').eq(0).hide();
	$('.data .entry').eq(0).slideDown(300);

	updateValues();
}


function updateDataBuyers() {
	if (Game.experience.dataBuyers.length > 5) {
		Game.experience.dataBuyers = Game.experience.dataBuyers.slice(0,5);
	}
	$('.data-buyers').html(Game.experience.dataBuyers.map(getData));
	if (Game.experience.data == 0) {
		$('.data-buyers .buyer').addClass('disabled');
	}
	else {
		$('.data-buyers .buyer').removeClass('disabled');
	}
}

function getData(array) {
	var multiCalc = getMulti(array.multi).toFixed(2);

	var fullItem =
		'<div class="buyer"><div class="left"><span class="company">'+
		array.company+
		'</span><br><span class="tagline1">"'+
		array.tagline1+
		'</span><span class="tagline2">'+
		array.tagline2+
		'"</span></div><div class="right"><button class="btn">Sell to '+
		array.company+
		' for $'+
		multiCalc+
		'</button></div></div>';
	return fullItem;
}

function getMulti(num) {
	var x = Game.experience.data^2;
	if (Game.experience.data == 0) {
		return 0;
	}
	else {
		return x/num * (1.01 * Game.main.sellnum);
	}
}

//currently unused
function prettify(input) {
	var output = Math.round(input * 1000000)/1000000;
	return output;
}

function newDataBuyer(company, tagline1, tagline2, multi) {
	return {
		company: company,
		tagline1: tagline1,
		tagline2: tagline2,
		multi: multi
	}
}

function recruitUser() {
	$('.big-btn .progress-bar .inside').css("transition-duration",Game.humans.carttime+"ms");
	$('.big-btn .progress-bar .inside').css("width","0%");

	$('.big-btn').prop('disabled', true);

	setTimeout(function() {

		$('.big-btn').prop('disabled', false);

		$('.big-btn .progress-bar .inside').css("transition-duration","0ms");
		$('.big-btn .progress-bar .inside').css("width","100%");

		logUser(rand(Game.rands.name));

		Game.humans.users++;

		updateValues();

	}, 3000);
}

function log(text) {
	$('.log').prepend('<li><div class="face"></div><div class="new">'+text+'</div></li>');
	$('.log li').eq(0).find('.face').html(':)');
	$('.log li').eq(0).find('.face').addClass("joy");
	$('.log li').eq(0).hide();
	$('.log li').eq(0).slideDown();
}

function logUser(name) {
	var randm = Math.random();
	if (randm <= 0.5) {
		$('.log').prepend('<li><div class="face"></div><div class="new">'+name+' has joined. '+rand(Game.rands.join)+rand(Game.rands.topic)+'.</div></li>');
	}
	else if (randm <= 0.75) {
		$('.log').prepend('<li><div class="face"></div><div class="new">'+name+' has joined. They are related to '+rand(Game.rands.name)+'.</div></li>');
	}
	else {
		$('.log').prepend('<li><div class="face"></div><div class="new">'+name+' has joined. They are am employee at '+rand(Game.rands.company)+'.</div></li>');
	}
	$('.log li').eq(0).find('.face').html(emoticon(rand(Game.experience.emotes)));
	$('.log li').eq(0).find('.face').addClass(rand(Game.experience.emotes));
	$('.log li').eq(0).hide();
	$('.log li').eq(0).slideDown();
}












function addEmote() {
	Game.experience.pos = randInt(0, Game.experience.height*Game.experience.width-1);

	Game.experience.map[Game.experience.pos] = newUser(rand(Game.experience.emotes), rand(Game.rands.name), randInt(13, 50), rand(Game.rands.type), rand(Game.rands.topic));
	updateExp();
}

function emoticon(tag) {
	switch(tag) {
		case 'envy':
			return ';(';
		break;
		case 'joy':
			return ':D';
		break;
		case 'anger':
			return '>:';
		break;
		case 'pity':
			return ':{';
		break;
		case 'bore':
			return ':|';
		break;
		case 'laugh':
			return 'XD';
		break;
		default:
			return '';
	}
}

function updateValues() {
	//calculations
	Game.humans.usersps = (Game.humans.users*1.05)/100;
	Game.humans.notorietyps = (Game.humans.users*1.05)/200;

	$('.money').html(Game.main.money.toFixed(2));
	$('.data-amt').html(Game.experience.data);
	$('.deals').html(Game.main.sellnum - 1);
	$('.users').html(Game.humans.users.toFixed(0));
	$('.usersps').html(Game.humans.usersps.toFixed(1));
	$('.notoriety').html(Game.humans.notoriety.toFixed(0));
	$('.notorietyps').html(Game.humans.notorietyps.toFixed(2));
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
	$('.inventory').html(Game.inventory.map(getItem));
}*/