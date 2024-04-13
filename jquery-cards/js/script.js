



const updateCards = (cards) => {

    $('#hand').html('');
    $('#tabs').html('');

    let $lastPage = $('<div>').addClass('card').attr('id', 'lastPage');
    let $lastPageIcon = $('<div>').addClass('card').attr('id', 'lastPageIcon');

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];

        $('#hand').append( returnCardDOM(card) );
        $('#tabs').append( returnCardDOM(card) );
        
        let $block = $('<div>').addClass('block');

        let $name = $('<div>').addClass('name').text(card.name);
        let $inverted = $('<div>').addClass('subtitle').text(card.inverted ? "Reversed" : "");
        let $facing = $('<div>').text(card.facing);
        let $reversed = $('<div>').text(card.reversed);
        let $advice = $('<div>').text(card.advice);

        $block.append($name);
        $block.append($inverted);
        if (!card.inverted) {
            $block.append($facing);
        } else {
            $block.append($reversed);
        }
        $block.append($advice);

        $lastPage.append($block);
    }
    $('#hand').append($lastPage);

    $lastPageIcon.append('≡');
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
            if (index === $('#hand .card').length-1) return;
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