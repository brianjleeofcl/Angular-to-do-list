(function () {
  'use strict';

  $.getJSON('/token')
    .then((loginStatus) => {
      if (loginStatus) {
        window.location.href = '/list.html';
      } else {
        $('form.signup-form').submit((event) => {
          event.preventDefault();
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
