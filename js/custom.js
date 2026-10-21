(function ($) {
  "use strict";

  // MENU
  $('.navbar-collapse a').on('click',function(){
    $(".navbar-collapse").collapse('hide');
  });

  // AOS Animation (if used) or sticky setup
  $(window).on('scroll', function(){
    // Custom scroll functions can go here if needed
  });

})(window.jQuery);