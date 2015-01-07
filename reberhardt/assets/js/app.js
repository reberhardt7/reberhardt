// Sticky navbar
var navbar = $('.navbar')[0];
/**
 * Stick the navbar to the appropriate spot based on the scroll position
 */
function stickNavbar() {
    navbarTopPosition = window.innerHeight - navbar.offsetHeight;
    if (navbarTopPosition - document.body.scrollTop > 0)
        navbar.className = navbar.className.replace('top-anchor', 'bottom-anchor');
    else navbar.className = navbar.className.replace('bottom-anchor', 'top-anchor');
}

$(document).ready(function() {
    stickNavbar();
})
$(window).scroll(function() {
    stickNavbar();
})
