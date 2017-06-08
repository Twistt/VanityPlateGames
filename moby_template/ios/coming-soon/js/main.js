// Hello.
//
// This is the js scripts for MobyApp Landing Page Template
//
// Author: JLP Media
// Email: jennpereira13@gmail.com / lianplameras@gmail.com
// Version: 1.0
// Date Created: September 5, 2014



jQuery(document).ready(function($) {
   'use strict';

    //Preloader Script
        $(window).load(function() {
            // makes sure the whole site is loaded
            $('#status').fadeOut(); // will first fade out the loading animation
            $('#preloader').delay(350).fadeOut('slow'); // will fade out the white DIV that covers the website.
            $('body').delay(350).css({'overflow':'visible'});
        });

    //Fullscreen Background Image Slideshow
    $.backstretch([
        "../../assets/img/bg2/01_home.jpg", 
        "../../assets/img/bg2/02_about.jpg",
        "../../assets/img//bg2/03_facts.jpg"
    ], {duration: 3000, fade: 750});


    // This is the jQuery for Page Smooth Scrolling Feature
    $(function() {
        $('a.page-scroll').bind('click', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
            }, 
                1500, 'easeInOutExpo');
                event.preventDefault();
            });
        });


    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top'
    });


    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });


    // js for About Section Accordion 
    $('.collapse').on('show.bs.collapse', function(){
      var i = $(this).parent().find('i');
      i.toggleClass('fa-minus-circle fa-plus-circle');
    }).on('hide.bs.collapse', function(){
      var i = $(this).parent().find('i');
      i.toggleClass('fa-minus-circle fa-plus-circle');
    });


    // Content Animation Effects using Wow.js Plugin 
    var wow = new WOW( {
        boxClass:     'wow',      // animated element css class (default is wow)
        animateClass: 'animated', // animation css class (default is animated)
        offset:       0,          // distance to the element when triggering the animation (default is 0)
        mobile:       true,       // trigger animations on mobile devices (default is true)
        live:         true        // act on asynchronously loaded content (default is true)
        });
    wow.init();


    // Script for the Counters for Facts Section
    $('.count').each(function() {
        var $this   = $(this);
        $this.data('target', parseInt($this.html()));
        $this.data('counted', false);
        $this.html('0');
    });
    
    $(window).bind('scroll', function() {
        var speed   = 3000;
        $('.count').each(function() {
            var $this   = $(this);
            if(!$this.data('counted') && $(window).scrollTop() + $(window).height() >= $this.offset().top) {
                $this.data('counted', true);
                $this.animate({dummy: 1}, {
                    duration: speed,
                    step:     function(now) {
                        var $this   = $(this);
                        var val     = Math.round($this.data('target') * now);
                        $this.html(val);
                        if(0 < $this.parent('.value').length) {
                            $this.parent('.value').css('width', val + '%');
                        }
                    }
                });
            }
        });
    }).triggerHandler('scroll');

});

    //Mailchimp Subscription Integration
    $('.mailchimp').ajaxChimp({
        callback: mailchimpCallback,
        url: "http://jennylynpereira.us8.list-manage.com/subscribe/post?u=d594f4d2197a205cf487f3525&amp;id=a9e603bfd5" //Replace this with your own mailchimp post URL. Don t remove the "". Just paste the url inside "".  
    });

    function mailchimpCallback(resp) {
         if (resp.result === 'success') {
            $('.subscription-success').html('<i class="fa fa-thumbs-up"></i><br/>' + resp.msg).fadeIn(1000);
            $('.subscription-error').fadeOut(500);
            
        } else if(resp.result === 'error') {
            $('.subscription-error').html('<i class="fa fa-warning"></i><br/>' + resp.msg).fadeIn(1000);
        }  
    };