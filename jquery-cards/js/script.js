
const returnCardDOM = (card) => {
    let $card = $('<div>').addClass('card');
    if (card.flipped) $card.addClass('flipped');
    if (card.inverted) $card.addClass('inverted');

    let $inner = $('<div>').addClass('inner');

    let $front = $('<div>').addClass('front');
    let $back = $('<div>').addClass('back');

    let $frontImg = $('<img>').attr('src', 'cards/' + card.img);
    let $backImg = $('<img>').attr('src', 'cards/back.jpg');

    $front.append($frontImg);
    $back.append($backImg);

    $inner.append($front);
    $inner.append($back);

    $card.append($inner);

    return $card;
}

const returnInfoDOM = (card) => {
    let $info = $('<div>').addClass('info');

    let $name = $('<div>').addClass('name').text(card.name);
    let $inverted = $('<div>').addClass('subtitle').text(card.inverted ? "Reversed" : "");
    let $facing = $('<div>').text(card.facing);
    let $reversed = $('<div>').text(card.reversed);
    let $advice = $('<div>').text(card.advice);

    $info.append($name);
    $info.append($inverted);
    if (!card.inverted) {
        $info.append($facing);
    } else {
        $info.append($reversed);
    }
    $info.append($advice);

    return $info;
}

$(function() {
    $.getJSON("tarot-images.json", function(data) {

        // Assign data
        tarotCards = data.cards;
        
        // Shuffle
        tarotCards.sort(() => Math.random() - 0.5);

        // Assign reversed
        tarotCards.forEach(card => card.inverted = Math.random() < 0.5);

        let drawn = 0;
        let lastClicked = 0;

        // Start
        $('#hand').prepend(returnCardDOM(tarotCards[drawn]));
        $('#look').prepend(returnCardDOM(tarotCards[drawn]));
        drawn++;

        // Interaction
        $('#look').on('click', '.card', function() {

            // Flip
            $(this).toggleClass('flipped');

            $('#hand .card').eq(lastClicked).toggleClass('flipped');

        });

        $('#hand').on('click', '.card', function() {

            const index = $(this).index();
            const length = $('#hand .card').length;

            if (index === length-1) {
                const lastElement = $('#hand .card').eq(length-1);

                drawn++;
                const elementToInsert = returnCardDOM(tarotCards[drawn]);

                elementToInsert.insertBefore(lastElement);

                lastClicked = length-1;

                // Clone card to Look
                $('#look').html(
                    elementToInsert.clone()
                );
            } else {
                lastClicked = index;

                // Clone card to Look
                $('#look').html(
                    $(this).clone()
                );
            }

        });

    });
});