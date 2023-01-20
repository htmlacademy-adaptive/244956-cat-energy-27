var navMain = document.querySelector('.main-nav');
var navToggle = document.querySelector('.main-nav__toggle');
var map = document.querySelector('.footer-map');

navMain.classList.remove('main-nav--nojs');
map.classList.remove('map-nojs');

navToggle.addEventListener('click', function() {
    if (navMain.classList.contains('main-nav--closed')) {
        navMain.classList.remove('main-nav--closed');
        navMain.classList.add('main-nav--open');}
    else {
        navMain.classList.remove('main-nav--open');
        navMain.classList.add('main-nav--closed');
    }
})
