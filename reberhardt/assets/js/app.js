var page = 'home';

// If we are using ajax to load things, the length of the page will go from
// not overflowing to overflowing when transitioning between the home page and
// other pages. This will trigger the appearence of the scroll bar, but then
// that'll shift everything over horizontally, making things a little jarring.
// So instead, always show the scroll bar if we'll be using ajax (i.e. if JS
// is enabled)
$('body').css('overflow-y', 'scroll');

$('.center-card .nav a').mouseenter(function() {
    if(page == 'home') {
        $('#'+this.getAttribute('data-target')+'-background').addClass('visible');
        $('.backgrounds').addClass('visible');
        $('.center-card').addClass('dark');
        $('.footer').addClass('dark');
    }
});

$('.center-card .nav a').mouseleave(function() {
    if(page == 'home') {
        $('#'+this.getAttribute('data-target')+'-background').removeClass('visible');
        $('.backgrounds').removeClass('visible');
        $('.center-card').removeClass('dark');
        $('.footer').removeClass('dark');
    }
});

function loadPage(nextPage) {
    var oldPage = page;
    page = nextPage;

    // Don't do anything if we aren't going anywhere
    if(oldPage == nextPage) return;

    if(oldPage == 'home') {
        // We are transitioning in from the home page
        $('.center-card').removeClass('return').addClass('transition');
        $('.backgrounds').addClass('small');
        $('.footer').removeClass('dark');
        $('.nav.top').removeClass('hidden');
        $('.banner').removeClass('hidden');
        setTimeout(function(){ $('.center-container').hide(); }, 750);
    }

    if(nextPage == 'home') {
        // We are transitioning back to the home page
        $('.center-container').show();
        $('.center-card').removeClass('transition').addClass('return');
        $('.backgrounds').removeClass('small');
        // $('.footer').addClass('dark');
        $('.center-card').removeClass('dark');
        $('.nav.top').addClass('hidden');
        $('.banner').addClass('hidden');
        $('#'+oldPage+'-page').removeClass('show');
    }

    // Update navbar
    $('.nav.top a').removeClass('selected');
    if(nextPage != 'home')
        $('.nav.top .nav-link[data-target="'+nextPage+'"]').addClass('selected');

    // Update background
    $('#'+oldPage+'-background').removeClass('visible');
    if(nextPage == 'home') {
        $('.backgrounds').removeClass('visible');
    } else {
        $('.backgrounds').addClass('visible');
        $('#'+nextPage+'-background').addClass('visible');
    }

    // Update banner text
    $('.banner .content #'+oldPage+'-blurb').removeClass('show');
    if(nextPage == 'home')
        $('.banner .content #'+oldPage+'-action').hide();
    else
        $('.banner .content #'+nextPage+'-blurb').addClass('show');
    if(oldPage == 'home') {
        $('.banner .content #'+page+'-action').css('display', 'inline-block');
    } else if(nextPage != 'home') {
        // We need to make the old text "flip" out and the new text flip in
        $('.banner .content #'+oldPage+'-action').addClass('exiting');
        $('.banner .content #'+nextPage+'-action').addClass('entering');
        setTimeout(function(){
            $('.banner .content #'+oldPage+'-action').removeClass('exiting').css('display', 'none');
            $('.banner .content #'+nextPage+'-action').css('display', 'inline-block');
        }, 150);
        setTimeout(function() {
            $('.banner .content #'+nextPage+'-action').removeClass('entering');
        }, 200);
    }

    // We're going to another page, so we hide the current one
    $('#'+oldPage+'-page').removeClass('show');
    // Remove the page from the flow once it transitions out so that it
    // doesn't add height to the page (even with visibility: hidden, if a
    // .page div has a greater height than the currently visible .page div,
    // the page will be scrollable past the footer)
    setTimeout(function() { $('#'+oldPage+'-page').hide(); }, 250);
    $('#content').css('height', 0);

    // If we are transitioning to some child page (not the home page), we
    // either need to load the new content or display the appropriate already-
    // loaded content
    if(nextPage != 'home') {
        // If we don't have an existing .page div for this page, we need to
        // create it and load the new content
        if(!$('#'+nextPage+'-page').length) {
            var newPageDiv = $('<div>', {id: nextPage+'-page', class: 'page'});
            $('#content').append(newPageDiv);
            $('#content .loading-spinner').addClass('show');
            newPageDiv.load('/partials/'+nextPage+'.html', function() {
                $('#content .loading-spinner').removeClass('show');
                // If we're coming in from the home page, add the firstload
                // class so that the new content "drifts" up when displayed
                if(oldPage == 'home') $('#content').addClass('firstload');
                // Show the new content
                if(oldPage == 'home') {
                    newPageDiv.addClass('show');
                }
                // There seems to be a bug where when the new div is created
                // and the show class is immediately added, the browser jumps
                // straight to making it visible and skips the fade in. So
                // wait 10ms for the browser to chill out and process the new
                // DOM before fading it in. (this is bad but oh well)
                else setTimeout(function() {
                    newPageDiv.addClass('show');
                }, 10);
                // Since the .page divs are absolutely positioned, they
                // take no space in #content, so #content has a height of
                // zero and the sticky footer ends up consequently
                // floating in the middle of the page. Set #content to the
                // visible .page's height in order to avoid this
                $('#content').css('height', newPageDiv.height() + 'px');
                // When things inside the .page load, they might change the
                // div's height, so we'd need to change #content height again
                newPageDiv.find('img, iframe').on('load', function() {
                    $('#content').css('height', newPageDiv.height() + 'px');
                });
            });
        }
        // Otherwise, if the .page div already exists, then the content has
        // already been loaded and we only need to display it
        else {
            // If we're coming in from the home page, add the firstload class
            // so that the new content "drifts" up and in when displayed
            if(oldPage == 'home') $('#content').addClass('firstload');
            // Show the "new" content
            $('#'+nextPage+'-page').show();
            setTimeout(function() { $('#'+nextPage+'-page').addClass('show'); }, 10);
            // Since the .page divs are absolutely positioned, they
            // take no space in #content, so #content has a height of
            // zero and the sticky footer ends up consequently
            // floating in the middle of the page. Set #content to the
            // visible .page's height in order to avoid this
            $('#content').css('height', $('#'+nextPage+'-page').height() + 'px');
        }
    }

    // We need to clear the firstload class if we set it after the page
    // transition is complete. The firstload class should be set at the time
    // of transition from the home page to some other page, so that the new
    // content fades in and "drifts up". If it is not subsequently removed,
    // then if we go back to the home page and then click a different page,
    // the firstload class won't be newly introduced (since it was already
    // there) and the new content won't drift up.
    if(oldPage == 'home') setTimeout(function() {
        $('#content').removeClass('firstload');
    }, 1000);
}

$('.nav-link').click(function() {
    if(this.getAttribute('data-target') != 'resume') {
        loadPage(this.getAttribute('data-target'));

        // Pushstate:
        history.pushState({}, '', $(this).attr('href'));
        return false;
    }
});

$(window).on('popstate', function() {
    loadPage(location.pathname.substring(1) != '' ? location.pathname.substring(1) : 'home');
})

$(document).ready(function() {
    loadPage(location.pathname.substring(1) != '' ? location.pathname.substring(1) : 'home');
})


// // Sticky navbar
// var navbar = $('.navbar')[0];
// var navbarNormalOffset; // Navbar's y-offset when it's not stuck
// var viewportHeight; // Height of viewport that navbarNormalOffset was originally calculated at
// /**
//  * Stick the navbar to the appropriate spot based on the scroll position
//  */
// function stickNavbar() {
//     if (document.body.scrollTop < navbarNormalOffset) {
//         // Reset the navbar
//         navbar.className = navbar.className.replace('sticky', 'normal');
//         $('#pane1 .down-chevron').fadeIn();
//     }
//     else {
//         // Sticky the navbar
//         navbar.className = navbar.className.replace('normal', 'sticky');
//         $('#pane1 .down-chevron').fadeOut();
//     }
// }

// $(document).ready(function() {
//     if($(navbar).is(':visible')) { // Don't run this on mobile
//         // Save the viewport height (see $(window).resize below) and the navbar's position
//         // when it's not sticky (which we need to see if we should unsticky it when scrolling up)
//         viewportHeight = window.innerHeight;
//         navbarNormalOffset = $(navbar).offset().top;
//         // If the document was loaded scrolled down, we might need to stick the navbar already
//         stickNavbar();
//     }
// })
// $(window).scroll(function() {
//     if($(navbar).is(':visible')) stickNavbar();
// })
// $(window).resize(function() {
//     if($(navbar).is(':visible')) {
//         // Update the normal position of the navbar (with a smaller viewport, it moves up)
//         navbarNormalOffset += (window.innerHeight - viewportHeight);
//         viewportHeight = window.innerHeight;
//     }
// })


// // Smooth scrolling when clicking hashes: http://css-tricks.com/snippets/jquery/smooth-scrolling/
// $(function() {
//     $('a[href*=#]:not([href=#])').click(function() {
//         if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
//             var target = $(this.hash);
//             target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
//             if (target.length) {
//                 $('html,body').animate({
//                     scrollTop: target.offset().top
//                 }, 500);
//                 // Set hash in browser URL bar
//                 if(history && history.pushState) {
//                     history.pushState({}, "", this.hash);
//                 }
//                 else {
//                     window.location.hash = this.hash;
//                 }
//                 return false;
//             }
//         }
//     });
// });
