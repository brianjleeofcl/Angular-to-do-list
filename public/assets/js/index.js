(function() {
  'use strict';

  $.getJSON('/token')
    .then((loginStatus) => {
      if (loginStatus) {
        window.location.href = '/list.html'
      }
      else {
        $('form').submit((event) => {
          event.preventDefault()

          const data = {};

          $('input:visible').map((_, dom) => {
            data[dom.name] = dom.value
          })

          const url = $('input:visible').length === 6 ? '/users' : '/token';

          const request = {
            contentType: 'application/json',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            url
          }

          $.ajax(request)
          .then((res) => { console.log(res) }, (error) => { console.log(error)})
        });
      }
    }, (error) => console.log('token error', error));


})();
