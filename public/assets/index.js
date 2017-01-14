(function() {
  'use strict';

  $.getJSON('/token')
    .done((loginStatus) => {

      if (loginStatus) {
        window.location.href = '/list.html'
      } else {
        $('button').submit(
          event.preventDefault;

          const status = $()
          const reqOptions = {
            dataType: 'json',
            method: '????',
            url: '/users'
          }

          return $.ajax(reqOptions)
        );

      }
    })
    .done()


    .fail()


})();
