
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

const returnPageDOM = () => {
    let $card = $('<div>').addClass('card lastPageEver');
    let $inner = $('<div>').addClass('inner');
    
    let $icon = $('<div>').addClass('icon').text('?');
    let $content = $('<div>').addClass('content desc');

    $inner.append($icon);
    $inner.append($content);

    $card.append($inner);

    return $card;
}

$(function() {
    $.getJSON("tarot-images.json", function(data) {

        // Assign data
        tarotCards = data.cards;
        
        // Shuffle
        tarotCards.sort(() => Math.random() - 0.5);

        // Assign reversed
        tarotCards.forEach(card => card.inverted = Math.random() < 0.5);

        $('#hand').append(
            returnPageDOM()
        );
        for (let i = 0; i < 3; i++) {
            $('#hand').prepend(
                returnCardDOM(tarotCards[i])
            );

            $('.desc').prepend(
                returnInfoDOM(tarotCards[i])
            );
        }

        let latestCard = 0;

        $('#look').on('click', '.card', function() {
            // Clicked card flipped
            $(this).toggleClass('flipped');
            $('#hand .card').eq(latestCard).toggleClass('flipped');
        });

        $('#hand').on('click', '.card', function() {
            const index = $(this).index();
            if (latestCard === index) return;
            latestCard = index;

            // Remove duplicate cards
            const search = $(this).find('.front img').attr('src');
            $('#look .card').each(function() {
                const src = $(this).find('.front img').attr('src');
                if (search === src) $(this).remove();
            });

            // Append clicked card
            $('#look').append(
                $(this).clone()
            );

            // Clicked card selected
            $('#hand .card').removeClass('selected');
            $(this).addClass('selected');
        });

    });
});