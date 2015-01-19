// Sticky navbar
var navbar = $('.navbar')[0];
var navbarNormalOffset; // Navbar's y-offset when it's not stuck
var viewportHeight; // Height of viewport that navbarNormalOffset was originally calculated at
/**
 * Stick the navbar to the appropriate spot based on the scroll position
 */
function stickNavbar() {
    if (document.body.scrollTop < navbarNormalOffset) {
        // Reset the navbar
        navbar.className = navbar.className.replace('sticky', 'normal');
        $('#pane1 .down-chevron').fadeIn();
    }
    else {
        // Sticky the navbar
        navbar.className = navbar.className.replace('normal', 'sticky');
        $('#pane1 .down-chevron').fadeOut();
    }
}

$(document).ready(function() {
    // Save the viewport height (see $(window).resize below) and the navbar's position
    // when it's not sticky (which we need to see if we should unsticky it when scrolling up)
    viewportHeight = window.innerHeight;
    navbarNormalOffset = $(navbar).offset().top;
    // If the document was loaded scrolled down, we might need to stick the navbar already
    stickNavbar();
})
$(window).scroll(function() {
    stickNavbar();
})
$(window).resize(function() {
    // Update the normal position of the navbar (with a smaller viewport, it moves up)
    navbarNormalOffset += (window.innerHeight - viewportHeight);
    viewportHeight = window.innerHeight;
})
