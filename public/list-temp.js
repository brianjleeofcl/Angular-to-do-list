(function() {
  'use strict';

  $('#logout').click((event) => {
    event.preventDefault();

    const options = {
      method: 'DELETE',
      dataType: 'json',
      url: '/token'
    }

    $.ajax(options).then(() => {
      window.location.href = '/index.html'
    } ,() => {
      console.log('Unable to log out. Please try again.');
    })
  })
})();
