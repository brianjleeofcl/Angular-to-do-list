(function () {
  'use strict';

  $.getJSON('/token')
    .then((loginStatus) => {
      if (loginStatus) {
        window.location.href = '/list.html';
      } else {
        $('.signup-form').submit((event) => {
          event.preventDefault();
          const data = {};

          $('input').map((_, dom) => {
            data[dom.name] = dom.value;
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
