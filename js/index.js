$(document).on('ready', function () {

  $(".u-text-animation.u-text-animation--typing").typed({
    strings: [
    "fácil",
    "rápido",
    "seguro"
    ],
    typeSpeed: 60,
    loop: true,
    backDelay: 1500
  });

  $.HSCore.components.HSGoTo.init('.js-go-to');
});

$(window).on('load', function () {

  $.HSCore.components.HSHeader.init($('#js-header'));
  $.HSCore.helpers.HSHamburgers.init('.hamburger');
});