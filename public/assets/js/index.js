(function() {
  'use strict';

// need a way to figure out if this is a login or a sign up. Not working yet

  // $('#signin-form').data('POST');
  // $('#login-form').data('GET');
  //
  // let method;
  //
  // $(document).on('load click', () => {
  //   method = ($('#signin-form:visible') || $('#login-form:visible')).data();
  // })

  $.getJSON('/token')
    .then((loginStatus) => {
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

          $('#signin-form').data('/users');
          $('#login-form').data('/token');

          const url = ($('#signin-form:visible') || $('#login-form:visible')).data();

          console.log($('#signin-form:visible') || $('#login-form:visible'));
          console.log(url);

          return $.post(url, data, _, 'json')
        });
      }
    })
    .then((res) => console.log(res))


    .fail()


})();
