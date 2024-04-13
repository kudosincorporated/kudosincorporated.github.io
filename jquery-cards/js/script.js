



const updateCards = (cards) => {

    $('#hand').html('');
    $('#tabs').html('');

    for (let i = 0; i < cards.length; i++) {
        $('#hand').append( returnCardDOM(cards[i]) );
        $('#tabs').append( returnCardDOM(cards[i]) );
    }

    let $lastPage = $('<div>').addClass('card').attr('id', 'lastPage');
    $lastPage.append('Nothing revealed yet.');
    $('#hand').append($lastPage);

    let $lastPageIcon = $('<div>').addClass('card').attr('id', 'lastPageIcon');
    $lastPageIcon.append('?');
    $('#tabs').append($lastPageIcon);

}

const returnCardDOM = (card) => {

    let $card = $('<div>').addClass('card');
    if (card.flipped) $card.addClass('flipped');
    if (card.inverted) $card.addClass('inverted');

    let $image = $('<img>').attr('src', 'cards/' + card.img).addClass('image');
    let $back = $('<img>').attr('src', 'cards/back.jpg').addClass('back');

    $card.append($image);
    $card.append($back);
    //$card.append(card.name);

    return $card;

}

$(function() {
    $.getJSON("tarot-images.json", function(data) {

        tarotCards = data.cards;
        
        // Shuffle
        tarotCards.sort(() => Math.random() - 0.5);

        // Assign reversed
        tarotCards.forEach(card => card.inverted = Math.random() < 0.5);

        // Assign flipped
        tarotCards.forEach(card => card.flipped = true);

        let hand = [];
        const cardsToDraw = 3;
        let page = 0;

        // Draw three
        for (let i = 0; i < cardsToDraw; i++) {
            hand.push(tarotCards[i]);
        }

        // Render drawn cards
        updateCards(hand);

        $('#hand').on('mousedown', '.card', function() {
            const index = $(this).index();
            hand[index].flipped = !hand[index].flipped;
            $('#hand .card').eq(index).toggleClass('flipped');
            $('#tabs .card').eq(index).toggleClass('flipped');
        });

        $('#tabs').on('mousedown', '.card', function() {
            const index = $(this).index();
            if (page !== index) {
                for (let i = 0; i < $('#hand .card').length; i++) {
                    if (i === index) {
                        $('#hand .card').eq(i).slideDown();
                    } else {
                        $('#hand .card').eq(i).slideUp();
                    }
                }
                page = index;
            }
        });

    });
});