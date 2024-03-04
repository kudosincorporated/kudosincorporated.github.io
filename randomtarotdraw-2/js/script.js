let tarotCards = null;
let drawn = [];
let amountToDraw = 3;

function rand(array) {
	return array[Math.floor(Math.random() * array.length)];
}

const drawCard = () => {
    if (tarotCards.length === drawn.length) return null;
    let card;
    do {
        card = rand(tarotCards);
    } while (drawn.some(drawnCard => drawnCard.name === card.name));
    
    // Reversal
    card.inverted = false;
    if (Math.random() < 0.5) card.inverted = true;

    drawn.push(card);
    return card;
}

const returnCardDOM = (card) => {

    let $card = $('<div>').addClass('card');
    let $img = $('<img>').attr('src', 'cards/' + card.img);
    $card.append($img);
    if (card.inverted) $card.addClass('inverted');

    return $card;

}

const returnInfoDOM = (card) => {

    const suit = card.suit.toLowerCase();
    let $info = $('<div>').addClass('info').addClass(suit);

    let $card = returnCardDOM(card);
    let $body = $('<div>').addClass('body');

    let $name = $('<div>').addClass('name').text(card.name);
    let $inverted = $('<div>').addClass('subtitle').text(card.inverted ? "Reversed" : "");
    let side = card.inverted ? 'shadow' : 'light';
    let $meaning = $('<div>').text(rand(card.meanings[side]));
    let $question = $('<div>').text(rand(card["Questions to Ask"]));
    let $keywords = $('<div>');
    for (let i = 0; i < card.keywords.length; i++) {
        let $word = $('<div>').text(card.keywords[i]);
        $keywords.append($word);
    }
    let $advice = $('<div>').text(card.advice);

    let $explanation = $('<div>').text(card.explanation ? card.explanation : "");
    let $facing = $('<div>').text(card.facing);
    let $reversed = $('<div>').text(card.reversed);

    /*let $divine = $('<ul>');
    let divine = '<li>';
    const punctuation = [",",'.',';'];
    for (let i = 0; i < card.facing.length; i++) {
        const char = card.facing.charAt(i);
        if (punctuation.indexOf(char) === -1) {
            divine += char;
        } else {
            divine += '</li><li>';
        }
    }
    $divine.html(divine);
    let $mortal = $('<ul>');*/

    $name.append($inverted);
    $body.append($name);
    $body.append( box($facing, "divinatory meanings") );
    if (card.inverted) {
        $body.append( box($reversed, "reversed meanings") );
    }
    $body.append( box($advice, "advice") );
    //if (card.explanation) $body.append( box($explanation, "inscription") );

    //$body.append($meaning);
    //$body.append($keywords);
    //$body.append($question);
    
    //$body.append($divine);
    //$body.append($mortal);

    $info.append($card);
    $info.append($body);

    return $info;

}

const box = ($this, title) => {
    let $box = $('<div>').addClass('block');
    let $title = $('<div>').addClass('title').addClass(title).text(title);
    let $content = $('<div>').addClass('content').html($this);
    $box.append($title);
    $box.append($content);
    return $box;
}

$(function() {
    $.getJSON("tarot-images.json", function(data) {

        tarotCards = data.cards;

        for (let i = 0; i < amountToDraw; i++) {
            
            drawCard();
            let card = drawn[drawn.length-1];
            $('#deck').append( returnCardDOM(card) );

        }

        for (let i = 0; i < drawn.length; i++) {
            let card = drawn[i];
            $('#leaflet').append( returnInfoDOM(card) );
        }

        /*$('#landing').on('click', function() {
            $("html, body").animate({scrollTop: $(window).height()}, 1000);
        });*/

        $('.info').on('click', function() {
            $(this).toggleClass('selected');
        });

    });
});