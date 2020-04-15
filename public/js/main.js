(function ($) {

    $('header ul li a').on('click', function() {
        if( ! $('header ul li a').hasClass('active')) {
          $('header ul li a').addClass('active');
        }
      })

})(jQuery);