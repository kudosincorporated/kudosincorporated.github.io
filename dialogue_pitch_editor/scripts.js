// Array to store Howl objects
var gibberish_sounds = [
    new Howl({ src: ['sounds/gibberish-01.wav'] }),
    new Howl({ src: ['sounds/gibberish-02.wav'] }),
    new Howl({ src: ['sounds/gibberish-03.wav'] }),
    new Howl({ src: ['sounds/gibberish-04.wav'] }),
    new Howl({ src: ['sounds/gibberish-05.wav'] }),
    new Howl({ src: ['sounds/gibberish-06.wav'] }),
    new Howl({ src: ['sounds/gibberish-07.wav'] }),
    new Howl({ src: ['sounds/gibberish-08.wav'] }),
    new Howl({ src: ['sounds/gibberish-09.wav'] }),
    //new Howl({ src: ['sounds/gibberish-10.wav'] })
];

var gibberish_sounds_lowered = [
    new Howl({ src: ['sounds/gibberish-01-lowered.wav'] }),
    new Howl({ src: ['sounds/gibberish-02-lowered.wav'] }),
    new Howl({ src: ['sounds/gibberish-03-lowered.wav'] }),
    new Howl({ src: ['sounds/gibberish-04-lowered.wav'] }),
    new Howl({ src: ['sounds/gibberish-05-lowered.wav'] }),
    new Howl({ src: ['sounds/gibberish-06-lowered.wav'] }),
    new Howl({ src: ['sounds/gibberish-07-lowered.wav'] }),
    new Howl({ src: ['sounds/gibberish-08-lowered.wav'] }),
    new Howl({ src: ['sounds/gibberish-09-lowered.wav'] }),
    //new Howl({ src: ['sounds/gibberish-10.wav'] })
];

var gibberish_sounds_lowered_slowed = [
    new Howl({ src: ['sounds/gibberish-01_slowed.wav'] }),
    new Howl({ src: ['sounds/gibberish-02_slowed.wav'] }),
    new Howl({ src: ['sounds/gibberish-03_slowed.wav'] }),
    new Howl({ src: ['sounds/gibberish-04_slowed.wav'] }),
    new Howl({ src: ['sounds/gibberish-05_slowed.wav'] }),
    new Howl({ src: ['sounds/gibberish-06_slowed.wav'] }),
    new Howl({ src: ['sounds/gibberish-07_slowed.wav'] }),
    new Howl({ src: ['sounds/gibberish-08_slowed.wav'] }),
    new Howl({ src: ['sounds/gibberish-09_slowed.wav'] }),
    //new Howl({ src: ['sounds/gibberish-10.wav'] })
];

var num_of_sounds = gibberish_sounds.length;

// Default values
var default_delay = 150;
var default_speech_length = 10;
var default_rate = 1.0;

// Update delay value display
$('#delay-slider').on('input', function() {
    $('#delay-value').text($(this).val() + ' ms');
});

// Update speech length value display
$('#speech-length-slider').on('input', function() {
    $('#speech-length-value').text($(this).val());
});

// Update rate value display
$('#rate-slider').on('input', function() {
    $('#rate-value').text($(this).val() + 'x');
});


$('#play').on('click', function() {
    var delay = $('#delay-slider').val();
    var speech_length = $('#speech-length-slider').val();
    var rate = $('#rate-slider').val();

    for (let i = 0; i < speech_length; i++) {
        setTimeout(function() {
            // select a random sound and play it
            var random_index = Math.floor(Math.random() * num_of_sounds);
            gibberish_sounds_lowered_slowed[random_index].rate(rate).play();
        }, i * delay);
    }
});

// Reset sliders to default values
$('#reset').on('click', function() {
    $('#delay-slider').val(default_delay);
    $('#delay-value').text(default_delay + ' ms');

    $('#speech-length-slider').val(default_speech_length);
    $('#speech-length-value').text(default_speech_length);

    $('#rate-slider').val(default_rate);
    $('#rate-value').text(default_rate + 'x');
});