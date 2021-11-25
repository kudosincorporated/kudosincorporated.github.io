

var ROGO = {
	start: ['hello'],
	cards: 0
}

var BUTTONS = {
	hello: {
		name: "'Hello Rogo!'",
		result: "'Hi guys! What would you like to do today?'",
		notes: "Rogo bobs his head and rocks back and forth.",
		leadsto: ['joke','discussion','debate','games','dance']
	},
	letsgo: {
		name: "'Let's go, Rogo!'",
		result: "'That was fun! What's next?'",
		notes: "Rogo bobs his head.",
		leadsto: ['joke','discussion','debate','games','dance']
	},
	thanks: {
		name: "'Thank you, Rogo!'",
		result: "'No problem! It's great talking to you guys!'",
		notes: "Rogo bobs his head.",
		leadsto: ['letsgo']
	},



	joke: {
		name: "'Can you tell us a joke, Rogo?'",
		result: "'A chicken, a moose and a primary school teacher walk into a classroom...'",
		notes: "Rogo tells a random joke from an internal data bank of 100 jokes. This joke is then marked so as to not be reused too soon.",
		leadsto: ['anotherjoke','great','letsgo']
	},
	anotherjoke: {
		name: "'Do you have another joke?'",
		result: "'That was one of my favorites. Does anybody else have any good jokes?'",
		notes: "Rogo tells another random joke, and then asks for participation.",
		leadsto: ['anotherjoke','great','letsgo']
	},



	discussion: {
		name: "'We'd like to have a group discussion.'",
		result: "'Sure, what do you want to talk about?'",
		notes: "Rogo responds.",
		leadsto: ['giveusrandom','discussiontopic']
	},
	giveusrandom: {
		name: "'Can you choose for us?'",
		result: "'Cool beans! We can talk about ...'",
		notes: "Rogo will choose a random point of discussion from the list of topics in his data bank. He leads a discussion by presenting a case study, problem or idea and the class may take turns contributing their thoughts.",
		leadsto: ['great','thanks','letsgo']
	},
	discussiontopic: {
		name: "'We could discuss ...'",
		result: "'That sounds interesting. We can talk about ...'",
		notes: "Rogo will choose a point of discussion if the selected topic is in his data bank. He leads a discussion by presenting a case study, problem or idea and the class may take turns contributing their thoughts.",
		leadsto: ['great','thanks','letsgo']
	},



	debate: {
		name: "'We'd like to have a class debate.'",
		result: "'That sounds fun! What should the topic be?'",
		notes: "Rogo responds.",
		leadsto: ['giveusrandom','debatetopic']
	},
	debatetopic: {
		name: "'We could debate on ...'",
		result: "'Great topic! One team can argue that ...'",
		notes: "Rogo will choose an argument to debate if the selected topic is in his data bank. He leads the debate by explaining the rules and what the main argument will be.",
		leadsto: ['great','thanks','letsgo']
	},



	games: {
		name: "'Can you show us a game to play?",
		result: "'Sure! Do you guys know how to play ...",
		notes: "Rogo will select a game from a list of games that improve social skills from his data bank, and one that has not been proposed recently.",
		leadsto: ['gamesyes','gamesno']
	},
	gamesyes: {
		name: "'We know how to play that.'",
		result: "'No problem. What about ...",
		notes: "Rogo selectes a new game from his data bank.",
		leadsto: ['gamesyes','gamesno']
	},
	gamesno: {
		name: "'Can you teach us that game?'",
		result: "'Here's how you guys can play...'",
		notes: "Rogo teaches the class how to play a game that improves social skills. The class is then given time to organise and play.",
		leadsto: ['great','thanks','letsgo']
	},



	dance: {
		name: "'Can you dance, Rogo?' or 'Let's dance!' or similar",
		result: "Rogo dances.",
		notes: "Rogo will play upbeat music and begin to rock back and forth, rotating his head. His eyes will dart in time with the music.",
		leadsto: ['nextsong','great','letsgo']
	},
	nextsong: {
		name: "'Play another song!'",
		result: "'I like this one too!'",
		notes: "Rogo will change the song.",
		leadsto: ['nextsong','great','thanks','letsgo']
	},
	great: {
		name: "'Cool!' or 'Awesome!' or similar",
		result: "'Agreed!'",
		notes: "Rogo does a little dance.",
		leadsto: ['letsgo']
	}
}





$(function() {
	
	function appendButtons(arr) {
		for (let i=0; i < arr.length; i++) {

			var button = document.createElement('button');
			var textNode = document.createTextNode(BUTTONS[arr[i]].name);
			button.appendChild(textNode);
			button.className = 'mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored' + ' rogo_button';
			button.id = arr[i];
			componentHandler.upgradeElement(button);
			document.getElementById('rogo').appendChild(button);

			$('#rogo').append('<br>');

		}
	}

	appendButtons(ROGO.start);

	$('body').on('click', '.rogo_button', function() {
		var btn = $(this).attr('id');

		var $card = $('#template_card').clone();
		$card.attr('id', '');
		$card.find('.mdl-card__title-text').html(BUTTONS[btn].result);
		$card.find('.mdl-card__supporting-text').html(BUTTONS[btn].notes);
		$('#rogo').append($card);

		$('.rogo_button').addClass('disabled');
		$(this).addClass('chosen');

		appendButtons(BUTTONS[btn].leadsto);

		ROGO.cards++;

		if (ROGO.cards > 1) {
			window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
		}
	});

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