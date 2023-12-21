(function($){

	"use strict";

	/* ---------------------------------------------- /*
	 * Preloader
	/* ---------------------------------------------- */

	$(window).load(function() {
		$('.page-loader').delay(350).fadeOut('slow');
	});

	$(document).ready(function() {

		var moduleHero      = $('.module-hero'),
			modules         = $('.module-hero, .module, .module-sm'),
			moduleSlideshow = $('.backstretch'),
			cdDate          = $('#countdown').attr('data-countdown'),
			mobileTest;

		/* ---------------------------------------------- /*
		 * Mobile detect
		/* ---------------------------------------------- */

		if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			mobileTest = true;
		} else {
			mobileTest = false;
		}

		/* ---------------------------------------------- /*
		 * Setting background of modules
		/* ---------------------------------------------- */

		modules.each(function() {
			if ($(this).attr('data-background')) {
				$(this).css('background-image', 'url(' + $(this).attr('data-background') + ')');
			}
		});

		/* ---------------------------------------------- /*
		 * Parallax
		/* ---------------------------------------------- */

		if (mobileTest === true) {
			modules.css({'background-attachment': 'scroll'});
		}

		/* ---------------------------------------------- /*
		 * Slideshow background
		/* ---------------------------------------------- */

		if (moduleSlideshow.length > 0) {
			moduleSlideshow.backstretch([
				  "assets/images/module-3.jpg"
				, "assets/images/module-4.jpg"
				, "assets/images/module-5.jpg"
			], {duration: 3000, fade: 750});
		}

		/* ---------------------------------------------- /*
		 * Youtube video background
		/* ---------------------------------------------- */

		$(function(){
			$('.video-player').mb_YTPlayer();
		});

		/* ---------------------------------------------- /*
		 * Countdown
		/* ---------------------------------------------- */

		$('#countdown').countdown(cdDate, { elapse: true })
			.on('update.countdown', function(event) {
			$(this).html(event.strftime(''
				+ '<div><div>%D</div><i>days</i></div>'
				+ '<div><div>%H</div><i>hours</i></div>'
				+ '<div><div>%M</div><i>minutes</i></div>'
				+ '<div><div>%S</div><i>seconds</i></div>'
			));
		});

		/* ---------------------------------------------- /*
		 * Team Slider
		/* ---------------------------------------------- */

		$('.team-carousel').owlCarousel({
			items: 4,
			stopOnHover:     true,
			singleItem:      false,
			autoHeight:      true,
			navigation:      false,
			pagination:      false,
			slideSpeed:      400,
			paginationSpeed: 1000,
			goToFirstSpeed:  2000,
			autoPlay:        3000,
			navigationText: [
				'<span class="arrow_left"></span>',
				'<span class="arrow_right"></span>'
			],
		});

		/* ---------------------------------------------- /*
		 * WOW Animation
		/* ---------------------------------------------- */

		var wow = new WOW({
			mobile: false
		});

		wow.init();

		/* ---------------------------------------------- /*
		 * Aminate social links
		/* ---------------------------------------------- */

		$('.social-icons-animated a').each(function(i) {
			$(this).attr('data-wow-delay', i * 0.15 + 's');
		});

		/* ---------------------------------------------- /*
		 *
		/* ---------------------------------------------- */

		var heroDivider = $('#hero-divider i');

		$(window).scroll(function() {
			if ( $(window).scrollTop() > 10 ) {
				heroDivider.css( 'line-height', '70px');
			} else {
				heroDivider.css( 'line-height', '50px');
			}
		}).scroll();

		/* ---------------------------------------------- /*
		 * A jQuery plugin for fluid width video embeds
		/* ---------------------------------------------- */

		$('body').fitVids();


		/* ---------------------------------------------- /*
		 * Scroll Animation
		/* ---------------------------------------------- */

		$('.inner-scroll').on('click', function(e) {
			var target = this.hash;
			var $target = $(target);
			$('html, body').stop().animate({
				'scrollTop': $target.offset().top
			}, 900, 'swing');
			e.preventDefault();
		});

	});

})(jQuery);
