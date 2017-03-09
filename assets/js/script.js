// Custom Scripts for Proton Template //

jQuery(function($) {
    "use strict";

/*-------------------------------
----------- Preloader -----------
-------------------------------*/

setTimeout(function() {
	$('#loading').fadeOut('slow', function() {
	});
}, 3000);

/*-------------------------------
----------- Wow Init ------------
--------------------------------*/
new WOW().init();


/*-------------------------------------------
----------- Hamburger Menu Action -----------
--------------------------------------------*/

	var isLateralNavAnimating = false;
//open/close lateral navigation
$('.nav-trigger').on('click', function(event){
	event.preventDefault();
	//stop if nav animation is running
	if( !isLateralNavAnimating ) {
		if($(this).parents('.csstransitions').length > 0 ) isLateralNavAnimating = true;
		$('body').toggleClass('menu-active');
		$('.menu-container').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
			//animation is over
			isLateralNavAnimating = false;
		});
	}
});

// Nav Close on Click//

$('.menu-container a').on('click', function(){
  $('.nav-trigger').click(); //bootstrap 2.x
  $('.menu').click() //bootstrap 3.x by Richard
	$('.nav').click()
});

$('.nav-trigger').on('click',function(){
	$(this).toggleClass('open');
});

/*-----------------------------------------
---------- Lightcase Gallery Popup---------
-----------------------------------------*/

$('a[data-rel^=lightcase]').lightcase();
swipe: true

/*-----------------------------------
----------- Scroll To Top -----------
------------------------------------*/

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

/*------------------------------------
----------- Isotope Filter -----------
-------------------------------------*/

// isotope
  // initialize Portfolio isotope
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

/*-------------------------------------------
----------- Jarallax initialization ---------
--------------------------------------------*/

$('.pta-jarallax').jarallax({
	speed: 0.6
});

/*---------------------------------
------- Justified gallery ---------
----------------------------------*/

$('#basicExample').justifiedGallery({
	rowHeight :220,
	lastRow : 'justify',
	margins : 15
});

/*----------------------------
-------Full Page Slider-------
-----------------------------*/

$('#my-slider').sliderPro({
	forceSize: 'fullWindow',
	autoplay: true,
	arrows: true,
	buttons: false,
	fade: true,
	touchSwipe: true,
	imageScaleMode: 'cover',
	slideAnimationDuration: 1000
});


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
