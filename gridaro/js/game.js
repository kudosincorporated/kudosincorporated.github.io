var map = null;
var ratioX = 64;
var ratioY = 128;
var cols = 1;
var rows = 1;

var cameraX = 0;
var cameraY = 0;

var tilesPlaced = 0;
var totalTiles = 78; // 78 by default, gets updated on init
var score = 0;

const flipSx = 6;
const flipSy = 2;
const majorFlipSx = 7;
const majorFlipSy = 2;

const initMap = () => {
	$('#game').html('');
	for (let i = 0; i < cols; i++) {
		$('#game').append('<div class="col"></div>');
		for (let j = 0; j < rows; j++) {
			$('#game').find('.col').eq(i).append('<div class="row"></div>');
			let startingTile = getRandomTile();
			$('#game').find('.col').eq(i).find('.row').eq(j).html(returnTileDOM(startingTile));
			removeCardFromDeck(startingTile.id);
			console.log('Starting card: '+startingTile.name);
		}
	}
}

const updateCameraPosition = () => {
	$('#game').css({
		'top': cameraY+'px',
		'left': cameraX+'px',
	});
}

const removeCardFromDeck = (id) => {
	unusedDeck = unusedDeck.filter(item => item !== id);
	updateRemainingDOM();
}

const updateRemainingDOM = () => {
	const remainingCards = unusedDeck.length;
	const totalCards = totalTiles; // Hardcoded because... it's a tarot deck :>)

	$('.remaining').html(remainingCards+'/'+totalCards);
}

const updateScoreDOM = () => {
	$('.score').html(score);
}

const returnTileFromId = (id) => {
	return tarotDeck.find(item => item.id.includes(id));
}

const getRandomTile = () => {
	let drawnCard = null;
	if (unusedDeck.length > 0) {
		drawnCard = rand(unusedDeck);
	}
	const card = returnTileFromId(drawnCard);
	return card;
}

const infoBoxContent = (tile) => {
	var $content = $('<div class="content"></div>');

	const img = returnImageDOM(tile);
	$content.append('<h2 class="name">'+tile.name+'</h2>');
	$content.append('<p><div class="image"></div></p>');
	$content.find('.image').append(img);

	return $content;
}

const returnImageDOM = (tile) => {
	let $nav = $('<nav></nav>');
	$nav.attr('id', tile.id);
	$nav.css({
		'background-position' : (-tile.sx*ratioX)+'px '+(-tile.sy*ratioY)+'px'
	});

	return $nav;
}

const blockCertainPositions = () => {
	const maxCols = $('#game .col').length;
	const maxRows = $('#game .col:first-of-type .row').length;

	for (let i = 0; i < maxCols; i++) {
		for (let j = 0; j < maxRows; j++) {
			let tile = $('#game').find('.col').eq(i).find('.row').eq(j).find('.tile');

			let blocked = blockedPositions(i, j);

			for (let k = 0; k < blocked.length; k++) {
				let classToHide = blocked[k];
				tile.filter('.' + classToHide).hide();
			}
		}
	}
}

const blockedPositions = (x, y) => {
	let array = [];

	if (tileAtPoint(x, y-1, true)) array.push('up');
	if (tileAtPoint(x+1, y, true)) array.push('right');
	if (tileAtPoint(x, y+1, true)) array.push('bottom');
	if (tileAtPoint(x-1, y, true)) array.push('left');

	// Hard mode
	//if (tileAtPoint(x, y) === null) array = ['up','right','bottom','left'];

	return array;
}

const tileAtPoint = (x, y, countFlipped = false) => {
	const maxCols = $('#game .col').length;
	const maxRows = $('#game .col:first-of-type .row').length;

	const tile = $('#game').find('.col').eq(x).find('.row').eq(y).find('.tile');
	const isEmpty = tile.hasClass('empty');
	let isFlipped = tile.hasClass('flipped');

	// If the card is flipped,
		// and we want to count the flipped cards,
			// set isFlipped to false so that it will go to else and return the id.
	if (isFlipped && countFlipped) isFlipped = false;

	let result = null;

	if (
		isFlipped ||
		isEmpty ||
		x < 0 ||
		x >= maxCols ||
		y < 0 ||
		y >= maxRows
	) {
		result = null;
	} else {
		result = tile.find('nav').attr('id');
	}
	
	return result;
}

const updateChoices = (x, y) => {
	const tile = $('#game').find('.col').eq(x).find('.row').eq(y).find('.tile');

	tile.find('.choices').remove();
	tile.append(returnChoicesDOM());

	tile.find('nav').first().removeClass('jiggle');
	setTimeout(() => { tile.find('nav').first().addClass('jiggle'); 1});
}

const updateChoicesForAll = () => {
	const maxCols = $('#game .col').length;
	const maxRows = $('#game .col:first-of-type .row').length;
	
	for (let i = 0; i < maxCols; i++) {
		for (let j = 0; j < maxRows; j++) {
			if (blockedPositions(i, j).length < 4) {
				updateChoices(i, j);
			}
		}
	}
}

const returnChoicesDOM = () => {
	let $choices = $('<div class="choices"></div>');
	const directions = ['up','right','bottom','left'];
	for (let i = 0; i < directions.length; i++) {
		const tileOption = getRandomTile();
		if (tileOption) {
			$choices.append('<div class="tile option"></div>');
			$choices.find('.option').eq(i).addClass(directions[i]);
			$choices.find('.option').eq(i).append(returnImageDOM(tileOption));
		}
	}
	return $choices;
}

const returnTileDOM = (tile, props = null) => {
	let $tile = $('<div class="tile"></div>');
	if (majorArcana.indexOf(tile.id) >= 0) {
		$tile.addClass('majorArcana');
	}

	$tile.append(returnImageDOM(tile));
	
	$tile.append(returnChoicesDOM());

	if (props) {
		if (props.empty) {
			$tile.addClass('empty');
		}

		if (props.animation) {
			$tile.find('nav').first().addClass(props.animation);
		}
	}

	return $tile;
}

const returnHouseFromId = (id) => {
	const houses = ['wands', 'cups', 'swords', 'pentacles'];

	for (const house of houses) {
		if (id.includes(house)) {
			return house;
		}
	}

	// Major arcana
	return id;
};

const checkForScore = () => {
	checkForScoreVertically();
	checkForScoreHorizontally();

	// Hard mode
	//blockCertainPositions();
}

const checkForScoreHorizontally = () => {
	const maxCols = $('#game .col').length;
	const maxRows = $('#game .col:first-of-type .row').length;

	for (let y = 0; y < maxRows; y++) { // Loop vertically through rows

		let horizontal = [];

		for (let x = 0; x < maxCols; x++) { // Look at each horizontal card in sequence

			const lookingAt = tileAtPoint(x, y);

			if (lookingAt) {
				const house = returnHouseFromId(lookingAt);

				if (horizontal.indexOf(house) >= 0) {
					x -= horizontal.indexOf(house);
					horizontal = [house]; // Reset array
				} else {
					horizontal.push(house);
				}
	
				if (horizontal.length >= 4) {
					horizontal = [];

					score++;
					console.log('Horizontal combo found!');
					updateScoreDOM();
	
					// Card flipping
					for (let i = 0; i < 4; i++) {
						$('#game').find('.col').eq(x-i).find('.row').eq(y).find('.tile').first().addClass('flipped');
					}
				}
			} else {
				horizontal = [];
			}

		}

	}
}

const checkForScoreVertically = () => {
    const maxCols = $('#game .col').length;
    const maxRows = $('#game .col:first-of-type .row').length;

    for (let x = 0; x < maxCols; x++) { // Loop through columns
        let vertical = [];

        for (let y = 0; y < maxRows; y++) { // Look at each vertical card in sequence
            const lookingAt = tileAtPoint(x, y);

            if (lookingAt) {
                const house = returnHouseFromId(lookingAt);

                if (vertical.indexOf(house) >= 0) {
                    y -= vertical.indexOf(house);
                    vertical = [house]; // Reset array
                } else {
                    vertical.push(house);
                }

                if (vertical.length >= 4) {
					vertical = [];

                    score++;
					console.log('Vertical combo found!');
                    updateScoreDOM();

                    // Card flipping
                    for (let i = 0; i < 4; i++) {
                        $('#game').find('.col').eq(x).find('.row').eq(y - i).find('.tile').first().addClass('flipped');
                    }
                }
            } else {
                vertical = [];
            }
        }
    }
}

const updateCardSize = () => {
    const maxCols = $('#game .col').length;
    const maxRows = $('#game .col:first-of-type .row').length;

	const windowWidth = $(window).width() - ratioX*2;
	const windowHeight = $(window).height() - ratioY*2;

	const baseWidth = ratioX;
	const baseHeight = ratioY;

	let width = baseWidth;
	let height = baseHeight;

	while (
		height*maxRows >= windowHeight ||
		width*maxCols >= windowWidth
	) {
		// Decrease by 10% until in acceptable range
		width = width*0.9;
		height = height*0.9;
	}

	$('.tile').css({
		'width':width+'px',
		'height':height+'px',
	});

	updateNavImagePosition(width, height);
}

const updateNavImagePosition = (ratioW, ratioH) => { // It works!

	$('nav').each(function() {

		const $tile = $(this).parent();
		const tileId = $(this).attr('id');
		const isFlipped = $tile.hasClass('flipped');
		const isMajor = $tile.hasClass('majorArcana');

		const tile = returnTileFromId(tileId);
		const { sx, sy }  = tile;

		if (isFlipped) {
			if (isMajor) {
				$(this).css('background-position', (-flipSx*ratioW)+'px '+(-flipSy*ratioH)+'px');
			} else {
				$(this).css('background-position', (-majorFlipSx*ratioW)+'px '+(-majorFlipSy*ratioH)+'px');
			}
		} else {
			$(this).css('background-position', (-sx*ratioW)+'px '+(-sy*ratioH)+'px');
		}

	});

}