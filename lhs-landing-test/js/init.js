var typed = new Typed('#typed', {
    strings: ['Any sufficiently advanced technology is indistinguishable from magic.', 'Any sufficiently advanced <b>education</b> is indistinguishable from <i>fun</i>.'],
    smartBackspace: true, // Default value
    typeSpeed: 50,
    showCursor: false
  });


  var image = document.getElementsByClassName('thumbnail');
  new simpleParallax(image, {
      delay: .6,
      transition: 'cubic-bezier(0,0,0,1)',
      maxTransition: 60
  });



  const tilt = $('.block').tilt({
    maxTilt: 5
  });