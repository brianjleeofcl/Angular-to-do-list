(function () {
  'use strict';

  $.getJSON('/token')
    .then((loginStatus) => {
      console.log(loginStatus);
      if (loginStatus) {
        window.location.href = '/list.html';
      } else {
        $('.login-form').submit((event) => {
          event.preventDefault();
          if ($('#email').val().trim() === '') {
            Materialize.toast('Please enter your email address.', 4000);

            return;
          }
          if ($('#password').val().trim() === '') {
            Materialize.toast('Please enter your password.', 4000);

            return;
          }
          Materialize.toast('Loggin in...', 4000);
        });

          const data = {};

          $('input').map((_, dom) => {
            data[dom.id] = dom.value;



          const request = {
            contentType: 'application/json',
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            url: '/token',
          };

          $.ajax(request)
          .then((res) => { window.location.href = '/list.html'; }, (error) => { console.log(error); });
        });
      }
    }, error => console.log('token error', error));
})();
