$(document).ready(function() {
  // $('.contact-togle-select').hide().css('opacity', 0);;

  // $("#radio1").on('change', function(){
  //     if ($(this).is(":checked")) {
  //         $('.contact-togle-select')
  //             .fadeTo('fast', 0)
  //             .slideUp('normal');
  //     }
  // });

  // $("#radio2").on('change', function(){
  //     if ($(this).is(":checked")) {
  //         $('.contact-togle-select')
  //             .slideDown('normal')
  //             .fadeTo('fast', 1);
  //     }
  // });

  $("#contact-form").submit(function() {
    alert(
      "Zahvaljujemo se na upitu.\n" +
        "Javit ćemo Vam se u najkarćem mogućem roku."
    );
  });
});
