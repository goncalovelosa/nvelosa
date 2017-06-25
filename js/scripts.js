// Preloader

  $(window).load(function(){
        $('.loader').fadeOut();    
        $('#preloader').delay(350).fadeOut('slow');    
        $('body').delay(350);   

    });

// Global document ready function

jQuery(document).ready(function($) {
    //check if background-images have been loaded and show single pages
    $('.single-page').bgLoaded({
        afterLoaded: function() {
            showCaption($('.page-container .single-page').eq(0));
        }
    });

    //open page
    $('.single-page').on('click', function() {
        var selectedProject = $(this),
            toggle = !selectedProject.hasClass('is-full-width') && !selectedProject.hasClass('portfolio-page');
        if (toggle) toggleProject($(this), $('.page-container'), toggle);

    });

    //close page
    $('.page-container .page-close').on('click', function() {
        toggleProject($('.is-full-width'), $('.page-container'), false);

    });

    //scroll to page info
    $('.page-container .page-scroll').on('click', function() {
        $('.page-container').animate({
            'scrollTop': $(window).height()
        }, 500);
    });

    //update title and .page-scroll opacity while scrolling
    $('.page-container').on('scroll', function() {
        window.requestAnimationFrame(changeOpacity);
    });

    function toggleProject(project, container, bool) {
        if (bool) {
            //expand page
            container.addClass('project-is-open');
            project.addClass('is-full-width').siblings('.single-page').removeClass('is-loaded');
        } else {
            //check media query
            var mq = window.getComputedStyle(document.querySelector('.page-container'), '::before').getPropertyValue('content'),
                delay = (mq == 'mobile') ? 100 : 0;

            container.removeClass('project-is-open');
            //fade out page
            project.animate({
                opacity: 0
            }, 800, function() {
                project.removeClass('is-loaded');
                $('.page-container').find('.page-scroll').attr('style', '');
                setTimeout(function() {
                    project.attr('style', '').removeClass('is-full-width').find('.page-title').attr('style', '');
                }, delay);
                setTimeout(function() {
                    showCaption($('.page-container .single-page').eq(0));
                }, 300);
            });
        }
    }

    function changeOpacity() {
        var newOpacity = 1 - ($('.page-container').scrollTop()) / 300;
        $('.page-container .page-scroll').css('opacity', newOpacity);
        $('.is-full-width .page-title').css('opacity', newOpacity);
    }

    function showCaption(project) {
        if (project.length > 0) {
            setTimeout(function() {
                project.addClass('is-loaded');
                showCaption(project.next());
            }, 150);
        }
    }

    // Magnific Popup

    $('.open-portfolio').magnificPopup({
        type: 'inline',
        midClick: true,
        zoom: {
            enabled: true,
            duration: 300, // duration of the effect, in milliseconds
            easing: 'ease-in-out' // CSS transition easing function 
        }
    });


    // Mixitup Filter

    $(function() {
        // Instantiate MixItUp:
        $('#portfolio').mixItUp();
    });


    // Testimonial Slider

    $("#testimonial-slides").owlCarousel({

        navigation: false, // Show next and prev buttons
        slideSpeed: 300,
        paginationSpeed: 400,
        singleItem: true
    });

    // Skills Chart

    var options = {
        //segmentShowStroke: false,
        percentageInnerCutout: 70,
        //animation: true,
        animationEasing: 'easeOutQuint',
        //animateRotate: false,
        animateScale: true
    };
    var data = {
        html: [{
            value: 10,
            color: "#404148"
        }, {
            value: 90,
            color: "#fff"
        }],
        css: [{
            value: 30,
            color: "#404148"
        }, {
            value: 70,
            color: "#fff"
        }],
        sass: [{
            value: 70,
            color: "#404148"
        }, {
            value: 30,
            color: "#fff"
        }],
        jquery: [{
            value: 25,
            color: "#404148"
        }, {
            value: 75,
            color: "#fff"
        }],
        meteor_js: [{
            value: 30,
            color: "#404148"
        }, {
            value: 70,
            color: "#fff"
        }],
        mongo_db: [{
            value: 50,
            color: "#404148"
        }, {
            value: 50,
            color: "#fff"
        }]
    };

    var offset = 0;
    $.each(data, function(key, data) {
        var canvas = document.querySelector('#' + key);
        if (canvas) {
            offset += 250;
            setTimeout(function() {
                var ctx = canvas.getContext('2d');
                var chart = new Chart(ctx);
                chart.Doughnut(data, options);
            }, offset);
        }
    });


    // Google Map


    // main directions
    map = new GMaps({
        position: "TOP_CENTER",
        el: '#map',
        lat: 23.790223,
        lng: 90.414036,
        zoom: 13,
        zoomControl: true,
        zoomControlOpt: {
            style: 'SMALL',
            position: 'TOP_LEFT'
        },
        panControl: false,
        scrollwheel: false
    });
    // add address markers
    map.addMarker({
        lat: 23.790223,
        lng: 90.414036,
        title: 'Codetic',
        infoWindow: {
            content: '<p> Mirpur , Dhaka</p>'
        }
    });


    // Contact Form

    $('form#contactForm button.submit').click(function() {

        $('#image-loader').fadeIn();

        var contactName = $('#contactForm #contactName').val();
        var contactEmail = $('#contactForm #contactEmail').val();
        var contactMessage = $('#contactForm #contactMessage').val();

        var data = 'contactName=' + contactName + '&contactEmail=' + contactEmail + '&contactMessage=' + contactMessage;

        $.ajax({

            type: "POST",
            url: "inc/sendEmail.php",
            data: data,
            success: function(msg) {

                // Message was sent
                if (msg == 'OK') {
                    $('#image-loader').fadeOut();
                    $('#message-warning').hide();
                    $('#contactForm').fadeOut();
                    $('#message-success').fadeIn();
                }
                // There was an error
                else {
                    $('#image-loader').fadeOut();
                    $('#message-warning').html(msg);
                    $('#message-warning').fadeIn();
                }

            }

        });
        return false;
    });

    // Contact form end


});

/*
 * BG Loaded
 * Copyright (c) 2014 Jonathan Catmull
 * Licensed under the MIT license.
 */
(function($) {
    $.fn.bgLoaded = function(custom) {
        var self = this;

        // Default plugin settings
        var defaults = {
            afterLoaded: function() {
                this.addClass('bg-loaded');
            }
        };

        // Merge default and user settings
        var settings = $.extend({}, defaults, custom);

        // Loop through element
        self.each(function() {
            var $this = $(this),
                bgImgs = window.getComputedStyle($this.get(0), '::before').getPropertyValue('content').replace(/'/g, "").replace(/"/g, "").split(', ');
            $this.data('loaded-count', 0);
            $.each(bgImgs, function(key, value) {
                var img = value.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                $('<img/>').attr('src', img).load(function() {
                    $(this).remove(); // prevent memory leaks
                    $this.data('loaded-count', $this.data('loaded-count') + 1);
                    if ($this.data('loaded-count') >= bgImgs.length) {
                        settings.afterLoaded.call($this);
                    }
                });
            });

        });
    };
})(jQuery);



