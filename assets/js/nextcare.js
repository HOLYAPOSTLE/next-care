/*
 * Shared site behaviour for every Nextcare page: scroll reveal, sticky navbar
 * state, back-to-top button, the testimonial/partner carousels and the
 * copyright year. Every step is optional, so a page only needs the markup for
 * the parts it actually uses.
 */
(function (window, document) {
    'use strict';

    var AOS_OPTIONS = {
        duration: 800,
        once: true,
        offset: 100
    };

    var CAROUSELS = {
        '.testimonial-carousel': {
            loop: true,
            margin: 25,
            nav: false,
            dots: true,
            autoplay: true,
            autoplayTimeout: 4000,
            autoplayHoverPause: true,
            responsive: {
                0: { items: 1 },
                768: { items: 2 },
                1000: { items: 2 }
            }
        },
        '.partner-carousel': {
            loop: true,
            margin: 15,
            nav: false,
            dots: false,
            autoplay: true,
            autoplayTimeout: 2500,
            autoplayHoverPause: true,
            responsive: {
                0: { items: 2 },
                600: { items: 4 },
                1000: { items: 6 }
            }
        }
    };

    function initScrollReveal() {
        if (window.AOS) {
            window.AOS.init(AOS_OPTIONS);
        }
    }

    function initScrollEffects() {
        var navbar = document.getElementById('navbar');
        var backToTop = document.getElementById('backToTop');

        window.addEventListener('scroll', function () {
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            }
            if (backToTop) {
                backToTop.classList.toggle('show', window.scrollY > 300);
            }
        });

        if (backToTop) {
            backToTop.addEventListener('click', function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    function initCarousels() {
        var $ = window.jQuery;
        if (!$ || !$.fn || !$.fn.owlCarousel) {
            return;
        }
        Object.keys(CAROUSELS).forEach(function (selector) {
            var $carousel = $(selector);
            if ($carousel.length) {
                $carousel.owlCarousel(CAROUSELS[selector]);
            }
        });
    }

    function initCurrentYear() {
        var year = new Date().getFullYear();
        Array.prototype.forEach.call(document.querySelectorAll('.js-current-year'), function (el) {
            el.textContent = year;
        });
    }

    function init() {
        initScrollReveal();
        initScrollEffects();
        initCarousels();
        initCurrentYear();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.NextCare = window.NextCare || {};
    window.NextCare.aosOptions = AOS_OPTIONS;
    window.NextCare.carouselOptions = CAROUSELS;
})(window, document);
