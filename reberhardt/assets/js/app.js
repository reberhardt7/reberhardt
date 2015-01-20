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
    if($(navbar).is(':visible')) { // Don't run this on mobile
        // Save the viewport height (see $(window).resize below) and the navbar's position
        // when it's not sticky (which we need to see if we should unsticky it when scrolling up)
        viewportHeight = window.innerHeight;
        navbarNormalOffset = $(navbar).offset().top;
        // If the document was loaded scrolled down, we might need to stick the navbar already
        stickNavbar();
    }
})
$(window).scroll(function() {
    if($(navbar).is(':visible')) stickNavbar();
})
$(window).resize(function() {
    if($(navbar).is(':visible')) {
        // Update the normal position of the navbar (with a smaller viewport, it moves up)
        navbarNormalOffset += (window.innerHeight - viewportHeight);
        viewportHeight = window.innerHeight;
    }
})


// Smooth scrolling when clicking hashes: http://css-tricks.com/snippets/jquery/smooth-scrolling/
$(function() {
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 500);
                // Set hash in browser URL bar
                if(history && history.pushState) {
                    history.pushState({}, "", this.hash);
                }
                else {
                    window.location.hash = this.hash;
                }
                return false;
            }
        }
    });
});
