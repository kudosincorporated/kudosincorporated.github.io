var typed = new Typed('#typed', {
    //strings: ['Any sufficiently advanced technology is indistinguishable from magic.', 'Any sufficiently advanced <b>education</b> is indistinguishable from <i>fun.</i>'],
    strings: [
      '<b>Collective</b> learning',
      '<b>Inter</b>disciplinarity',
      '<b>Many</b>-versity',
      'Immersive <b>Presence</b>',
      '<b>Collective</b> intelligence',
      'Generative <b>Learning</b>'
    ],
    smartBackspace: true, // Default value
    typeSpeed: 50,
    showCursor: false
  });




  var image = document.getElementsByClassName('thumbnail');
  new simpleParallax(image, {
      delay: .6,
      transition: 'cubic-bezier(0,0,0,1)'
  });



  const tilt = $('.block').tilt({
    maxTilt: 5
  });

  const tilt2 = $('.image_cover').tilt({
    maxTilt: 5
  });