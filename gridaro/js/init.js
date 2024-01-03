$(() => {

	// Initialise deck
	unusedDeck = tarotDeck.map(item => item.id);
	totalTiles = unusedDeck.length;

	// Initalise map
	initMap();

	// Remaining DOM
	updateRemainingDOM();

	// Score DOM
	updateScoreDOM();

	// Recalculate and update size
	updateCardSize();

	$('#game').on('click', '.tile .choices .option', function() {
	
		const parentRow = $(this).closest('.row');
		let py = parentRow.index();
		const parentCol = parentRow.closest('.col');
		let px = parentCol.index();

		let x = px;
		let y = py;

		const classes = $(this).attr('class');
		if (classes.includes('up')) {
			y -= 1;
		} else if (classes.includes('bottom')) {
			y += 1;
		} else if (classes.includes('left')) {
			x -= 1;
		} else if (classes.includes('right')) {
			x += 1;
		}

		const maxCols = $('#game .col').length;
		const maxRows = $('#game .col:first-of-type .row').length;

		const chosenTileId = $(this).find('nav').attr('id');
		const chosenTile = returnTileFromId(chosenTileId);

		// Remove card from the deck
		removeCardFromDeck(chosenTileId);
		updateRemainingDOM();

		// Add
		if (y < 0) {
			for (let i = 0; i < maxCols; i++) {
				$('#game').find('.col').eq(i).prepend('<div class="row"></div>');
				const isTileEmpty = i == x ? false : true;
				$('#game').find('.col').eq(i).find('.row').eq(0).append(returnTileDOM(chosenTile, {
					empty: isTileEmpty,
					animation: 'bounce',
				}));
			}
			cameraY -= 32;
		} else if (y >= maxRows) {
			for (let i = 0; i < maxCols; i++) {
				$('#game').find('.col').eq(i).append('<div class="row"></div>');
				const isTileEmpty = i == x ? false : true;
				$('#game').find('.col').eq(i).find('.row').eq(maxRows).append(returnTileDOM(chosenTile, {
					empty: isTileEmpty,
					animation: 'bounce',
				}));
			}
			cameraY += 32;
		} else if (x < 0) {
			$('#game').prepend('<div class="col"></div>');
			for (let i = 0; i < maxRows; i++) {
				$('#game').find('.col').eq(0).append('<div class="row"></div>');
				const isTileEmpty = i == y ? false : true;
				$('#game').find('.col').eq(0).find('.row').eq(i).append(returnTileDOM(chosenTile, {
					empty: isTileEmpty,
					animation: 'bounce',
				}));
			}
			cameraX -= 32;
		} else if (x >= maxCols) {
			$('#game').append('<div class="col"></div>');
			for (let i = 0; i < maxRows; i++) {
				$('#game').find('.col').eq(maxCols).append('<div class="row"></div>');
				const isTileEmpty = i == y ? false : true;
				$('#game').find('.col').eq(maxCols).find('.row').eq(i).append(returnTileDOM(chosenTile, {
					empty: isTileEmpty,
					animation: 'bounce',
				}));
			}
			cameraX += 32;
		} else { // No new columns or rows need to be added

			$('#game').find('.col').eq(x).find('.row').eq(y).html(returnTileDOM(chosenTile, {
				animation: 'bounce',
			}));

		}

		tilesPlaced++;

		blockCertainPositions();

		// Update
		if (majorArcana.indexOf(chosenTileId) >= 0) {
			updateChoicesForAll();
		}

		// Check for score
		checkForScore();

		//updateCameraPosition();

		//
		updateCardSize();

		//
		console.log(unusedDeck);

	});

	$('#game').on('mouseenter', '.tile', function() {
		const hoverClass = $(this).find('nav').attr('id');
		const hoverTile = returnTileFromId(hoverClass);
		$('#infobox').html(infoBoxContent(hoverTile));
		$('#infobox').show();
	});

	/*$('#game').on('mouseleave', '.tile', function() {
		$('#infobox').hide();
	});*/

	// Close help box
	$(document).on('click', '.close', function() {
		const parent = $(this).parent();
		parent.hide();
	});

	$(document).on('click', '#play', function() {
		$('#modal').hide();
	});

	// Final
	updateCameraPosition();

});