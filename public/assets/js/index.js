(function () {
  'use strict';

  $.getJSON('/token')
    .then((loginStatus) => {
      if (loginStatus) {
        window.location.href = '/list.html';
      } else {
        $('form.signup-form').submit((event) => {
          event.preventDefault();

          if ($('#name').val().trim() === '') {
            Materialize.toast('Please enter your name.', 4000);

            return;
          }

          if ($('#phone').val().trim() === '') {
            Materialize.toast('Please enter your phone number.', 4000);

            return;
          }

          if ($('#email').val().trim() === '') {
            Materialize.toast('Please enter your email.', 4000);

            return;
          }

          if ($('#password').val().trim() === '') {
            Materialize.toast('Please enter your password.', 4000);

            return;
          }

          if ($('#password_verify').val().trim() === '') {
            Materialize.toast('Please confirm your password.', 4000);

            return;
          }

          Materialize.toast('Creating your account...', 4000);
          const data = {};

          $('.signup-form input').map((_, dom) => {
            data[dom.id] = dom.value;
          });

          console.log(data);

          const request = {
            contentType: 'application/json',
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            url: '/users',
          };

          $.ajax(request)
          .then((res) => { window.location.href = '/list.html'; }, (error) => { console.log(error); });
        });
      }
    }, error => console.log('token error', error));
})();
