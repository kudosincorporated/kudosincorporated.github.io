

var points = 0;
var max = 30;

var output = [];
var roomOutput = [];



var GAME = {
	bedroom: {
		kingsize: {
			text: "Upgrade to a california king size bed with velvet sheets and thick duvet. Pillows included",
			snippet: "king-size bed",
			value: 6
		},
		skylight: {
			text: "A skylight",
			snippet: "skylight",
			value: 1
		},
		smartlight: {
			text: "The basement is equipped with state-of-the-art smartlighting, which can simulate sunrise/sunset.",
			snippet: "smart lighting",
			value: 1
		}
	},
	kitchen: {
		microwave: {
			text: "Unbreakable microwave and unlimited microwave meals",
			snippet: "microwave meals",
			value: 1
		},
		fast_food: {
			text: "Unlimited fast food delivered by drone",
			snippet: "fast food",
			value: 4
		},
		kitchen: {
			text: "Fully stocked kitchen with unlimited amounts of fresh ingredients",
			snippet: "kitchen",
			value: 5
		},
		recipes: {
			text: "Recipe book with every recipe on the planet",
			snippet: "recipe book",
			value: 1
		},
		chef: {
			text: "Food prepared by a professional chef, delivered daily",
			snippet: "personal chef",
			value: 8
		},
		junk_food: {
			text: "Unlimited snack/junk foods, nothing that would be considered a meal. Includes gum",
			snippet: "snacks",
			value: 3
		}
	},
	study: {
		basics: {
			text: "A 14” TV set and small bluetooth speaker. They will not break",
			snippet: "TV and speaker",
			value: 1
		},
		movies: {
			text: "Every movie ever created prior to the 10 year period",
			snippet: "movies",
			value: 7
		},
		movies_2: {
			text: "Only movies that are released during the 10 year period",
			snippet: "recent movies",
			value: 3
		},
		tv: {
			text: "Every TV show ever created, as well as new episodes as they come out.",
			snippet: "TV",
			value: 6
		},
		cinema: {
			text: "Large home cinema, with 45ft screen and stereo sound",
			snippet: "home cinema",
			value: 3
		},
		music: {
			text: "All music ever recorded digitally.",
			snippet: "music",
			value: 5
		},
		stereo: {
			text: "Complete stereo sound system, with complete with noise-cancelling headphones",
			snippet: "sound system",
			value: 3
		},
		video_games: {
			text: "Every video game ever created, with any online interaction disabeld. Comes with a $400 laptop",
			snippet: "video games",
			value: 5
		},
		computer: {
			text: "Top-of-the-line computer, with upgrades flown to your door as they are invented. A manual on how to upgrade a computer is provided",
			snippet: "PC",
			value: 3
		},
		internet: {
			text: "The internet, with all social media sites blocked",
			snippet: "internet",
			value: 13
		},
		plays: {
			text: "Video recordings of every play ever performed in modern times",
			snippet: "recorded theatre",
			value: 5
		},
		library: {
			text: "Every book ever written in English, inside a large library wing of the house",
			snippet: "library",
			value: 8
		},
		library_2: {
			text: "Every book ever written in all other languages except English",
			snippet: "foreign books",
			value: 2
		},
		magazine: {
			text: "Every magazine or comic ever published, including underground ones",
			snippet: "magazines and comics",
			value: 3
		},
		academy: {
			text: "Subscription to National Geographic and Time magazine. Also comes with a tablet with only Khan Academy",
			snippet: "learning",
			value: 2
		},
		printer: {
			text: "A3 printer with a 10 year supply of ink and paper",
			snippet: "printer",
			value: 1
		},
		nook: {
			text: "Tiny room filled with bean bags equipped with a sound system that plays only whale sounds",
			snippet: "bean bag room",
			value: 1
		},
		radio: {
			text: "Satellite radio.",
			snippet: "radio",
			value: 2
		}
	},
	games_room: {
		chairs: {
			text: "Chair and tablet set",
			snippet: "chairs and a table",
			value: 1
		},
		deluxe_chair: {
			text: "Deluxe arm-chair with massaging and reclining capabilities",
			snippet: "armchair",
			value: 2
		},
		board_games: {
			text: "Every board game ever invented",
			snippet: "board games",
			value: 2
		},
		chess_and_cards: {
			text: "A chessboard with pieces and a four decks of cards",
			snippet: "chess and cards",
			value: 1
		},
		ai: {
			text: "A hyper-intelligent AI that will play any tabletop game with you",
			snippet: "AI",
			value: 5
		},
		gym: {
			text: "Workout/gym area, with an expensive treadmill, dumbbells and bike",
			snippet: "home gym",
			value: 5
		},
		greenhouse: {
			text: "Greenhouse, with large amounts of seeds and plants",
			snippet: "greenhouse",
			value: 3
		},
		garage: {
			text: "Workshop garage, including various power-tools and a constant supply of materials",
			snippet: "garage workshop",
			value: 6
		},
		phone: {
			text: "Cell phone that can be used once a week to make a five minute call with somebody whose number exists already in your phone’s contacts list. Alternatively, 5 texts can be sent per week",
			snippet: "cell phone",
			value: 4
		},
		alcohol: {
			text: "Unlimited alcohol, including all possible mixers",
			snippet: "alcohol",
			value: 5
		},
		drugs: {
			text: "Unlimited drugs, both legal and illegal",
			snippet: "drugs",
			value: 5
		},
		tobacco: {
			text: "Unlimited tobacco products, all of the highest possible quality",
			snippet: "tobacco",
			value: 3
		},
		pool: {
			text: "Pool table and foosball table",
			snippet: "pool and foosball",
			value: 1
		},
		camera: {
			text: "HD video camera and sound equipment",
			snippet: "camera",
			value: 2
		},
		puzzles: {
			text: "Unlimited jigsaw puzzles",
			snippet: "jigsaw puzzles",
			value: 1
		},
		lego: {
			text: "Unlimited LEGO, no instruction booklets",
			snippet: "LEGO",
			value: 2
		},
		shooting: {
			text: "Indoor shooting range, with an assortment of guns and years worth of ammo",
			snippet: "guns",
			value: 3
		},
		swimming: {
			text: "Olympic-size swimming pool, cleaned automatically",
			snippet: "swimming pool",
			value: 4
		}
	},
	bathroom: {
		jacuzzi: {
			text: "Hygiene products and a jacuzzi bathtub",
			snippet: "hygiene products",
			value: 2
		},
		mirror: {
			text: "Floor-to-ceiling mirror",
			snippet: "mirror",
			value: 1
		},
		cleaning: {
			text: "Unlimited cleaning products, including laundry facilities",
			snippet: "cleaning products",
			value: 5
		},
		medicine: {
			text: "Unlimited over-the-counter healthcare/medical products, such as aspirin and bandages. Includes perscriptions if required",
			snippet: "medicine",
			value: 4
		},
		shower: {
			text: "Large shower area fitted with top-of-the-line shower peripherals. Ditto bath",
			snippet: "shower",
			value: 6
		},
		doctor: {
			text: "Medical care from a professional, delivered through life-like android",
			snippet: "doctor",
			value: 3
		}
	},
	guest_room: {
		jayde: {
			text: "JAYDE:<br>• deeply resents/hates you.<br>• has a soulmate they were separated from<br>• journalism student, will film the whole 10 years",
			snippet: "roommate (jayde)",
			value: 6
		},
		brett: {
			text: "BRETT:<br>• loves self-improvement<br>• is thankful to you for bringing them, as part of the deal their debt is paid off<br>• extremely talkative/clingy/annoying",
			snippet: "roommate (brett)",
			value: 8
		},
		rowan: {
			text: "ROWAN:<br>• asexual and overweight<br>• extremely knowledgeable about a wide variety of topics and willing to talk about it<br>• very chill, loves to clean",
			snippet: "roommate (rowan)",
			value: 9
		},
		pet: {
			text: "50/50 chance to be either a puppy or kitten. Breed is entirely random. Unlimited pet food is included",
			snippet: "kitten/puppy",
			value: 4
		},
		fish: {
			text: "A single goldfish inside a round bowl. 10 years of fish food supplied",
			snippet: "fish",
			value: 1
		}
	},
	rogue: {
		stocks: {
			text: "You recieve the money up-front and are able to access the stock market",
			snippet: "stock market",
			value: 7
		},
		amazon: {
			text: "You recieve the money up-front and can purchase one item online a month, at a maximum cost of $100",
			snippet: "online shopping",
			value: 3
		},
		art: {
			text: "Unlimited art supplies",
			snippet: "art supplies",
			value: 3
		},
		instrument: {
			text: "High-quality copy of every musical intrument",
			snippet: "instruments",
			value: 5
		},
		warehouse: {
			text: "Slot car track and model train set, with a bonus huge room to set up in",
			snippet: "model toys",
			value: 2
		},
		moon: {
			text: "The basement is on the moon, and you are the most famous person alive upon exiting",
			snippet: "the moon",
			value: 10
		},
		ageing: {
			text: "You do not age at all during the 10 years, and exit the basement the exact same physically.",
			snippet: "i dont age",
			value: 20
		}
	},
	negative: {
		painting: {
			text: "Above your bed is a life-sized painting of Niccolò Machiavelli, whose eyes follow you around the room and glow in the dark",
			snippet: "**painting",
			value: -1
		},
		livestream: {
			text: "The entire 10 years is livestreamed, with cameras in every room except the bathroom",
			snippet: "**livestreamed",
			value: -1
		},
		giggles: {
			text: "At nighttime, you can hear whispers and children laughing coming from rooms you aren't in",
			snippet: "**evil children",
			value: -4
		},
		smell: {
			text: "You lose your sense of smell permanently",
			snippet: "**lose smell",
			value: -2
		},
		moneyburn: {
			text: "Your payout for lasting 10 years is reduced by half",
			snippet: "**half payout",
			value: -5
		},
		moneyburn_2: {
			text: "Your payout is reduced to zero",
			snippet: "**no payout",
			value: -10
		}
	}
}

$(function() {

	function init() {
		var key = Object.keys(GAME);

		for (let i=0; i < key.length; i++) {
			var inside = Object.keys(GAME[key[i]]);

			$('#game').append('<ul id="'+key[i]+'"></ul>');
			$('#game ul:last-of-type').append('<h4>'+key[i]+'</h4>');

			for (let z=0; z < inside.length; z++) {
				var point = GAME[key[i]][inside[z]];

				$('#game ul:last-of-type').append('<li id="'+inside[z]+'"></li>');

				//$('#game ul:last-of-type li:last-of-type').append(inside[z]);
				//$('#game ul:last-of-type li:last-of-type').append('<img src="img/'+inside[z]+'.jpg" class="img">');
				$('#game ul:last-of-type li:last-of-type').append('<input type="checkbox" class="chx">');
				$('#game ul:last-of-type li:last-of-type').append('<span class="txt">'+point.text+'</span>' + ' ' + dispNum(point.value));
			}
		}
	}

	init();

	$('.chx').on('click', function() {
		var room = $(this).parent().parent().attr('id');
		var choice = $(this).parent().attr('id');

		var value = GAME[room][choice].value;

		if (!$(this).is(':checked')) {
			value = value * -1;
		}

		if (choice == 'moneyburn' && $('#moneyburn_2 .chx').is(':checked')) {
			$('#moneyburn_2 .chx').prop('checked', false);
			$('#moneyburn_2').removeClass('selected');

			value += 10;
		}
		if (choice == 'moneyburn_2' && $('#moneyburn .chx').is(':checked')) {
			$('#moneyburn .chx').prop('checked', false);
			$('#moneyburn').removeClass('selected');

			value += 5;
		}

		points += value;

		$(this).parent().toggleClass('selected');

		if (output.indexOf(GAME[room][choice].snippet) == -1) {
			output.push(GAME[room][choice].snippet);
		} else {
			output.splice(output.indexOf(GAME[room][choice].snippet), 1);
		}

		output.sort();

		$('.points').html(points);
		$('.max').html(max);

		drawOutput();
	});

	function drawOutput() {
		var write = '';
		write += 'total: ' + points + '/' + max + '\n';

		for (let i=0;i<output.length;i++) {
			write += '> ' + output[i] + '\n';
		}

		$('#output').val(write);
	}

	drawOutput();

});

function dispNum(num) {
	var str = '<span class="pts">'+num;
	if (num < 2 && num > -2 && num != 0) {
		str += ' point';
	} else {
		str += ' points';
	}
	return str+'</span>';
}

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