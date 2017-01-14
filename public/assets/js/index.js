(function() {
  'use strict';

  $('#signin-form').data('POST');
  $('#login-form').data('GET');

  let method;

  $('a').on('load click', () => {
    method = ($('#signin-form:visible') || $('#login-form:visible')).data();
  })

  $.getJSON('/token')
    .done((loginStatus) => {
      if (loginStatus) {
        window.location.href = '/list.html'
      }
      else {
        $('form').submit((event) => {
          event.preventDefault()
          console.log('click!');

          const data = {};

          console.log($('input:visible'));
          $('input:visible').map((_, dom) => {
            data[dom.type] = dom.value
          })

          const reqOptions = {
            dataType: 'json',
            method,
            url: '/users',
            data
          }

          return $.ajax(reqOptions)
        });
      }
    })
    .done((res) => console.log(res))


    .fail()


})();
