// Custom Script-2 for Proton Template //

jQuery(function($) {
    "use strict";

/*----------------------------
--------- Preloader ----------
-----------------------------*/

setTimeout(function() {
	$('#loading').fadeOut('slow', function() {
	});
}, 3000);

/*----------------------------
-------- Lightcase  ----------
-----------------------------*/

$('a[data-rel^=lightcase]').lightcase();
swipe: true


/*---------------------------------
------- Justified Gallery --------
-----------------------------------*/


$('#basicExample').justifiedGallery({
	rowHeight :240,
	lastRow : 'justify',
	margins : 10
});


/*----------------------------
------- Isotope Init -------
-----------------------------*/

var $container = $('.portfolio_container');
$container.isotope({
	filter: '*',
});

$('.pta-portfolio_filter a').on('click', function () {
	$('.pta-portfolio_filter .active').removeClass('active');
	$(this).addClass('active');

	var selector = $(this).attr('data-filter');
	$container.isotope({
			filter: selector,
			animationOptions: {
					duration: 500,
					animationEngine: "jquery"
			}
	});
	return false;
});


/*----------------------------
------- Scroll to Top -------
-----------------------------*/

$(window).scroll(function () {
	if ($(this).scrollTop() > 200) {
			$('#back-top').fadeIn();
	} else {
			$('#back-top').fadeOut();
	}
});

// scroll body to 0px on click
$('#back-top').on('click', function () {
  $('#back-top').tooltip('hide');
  $('body,html').animate({
      scrollTop: 0
  }, 800);
  return false;
});

/*----------------------------
------- Wow Init -------
-----------------------------*/

new WOW().init();


/*----------------------------
------- Owl Carousel -------
-----------------------------*/

$('.owl-carousel').owlCarousel({
	loop:true,
	margin:10,
	nav:false,
  items:3,
	singleItem: true
})

});
