(function() {
  'use strict';

  const cap = function(str) {
    return str[0].toUpperCase() + str.substr(1);
  }

  const tagName = window.location.search.substr(9)

  $(document).on('ready', () => {
    (function () {
      const n =  new Date();
      const y = n.getFullYear();
      const m = n.getMonth() + 1;
      const d = n.getDate();
      $('#date').text(`${m}/${d}/${y}`);
    })();

    $('#tag-name').text(cap(tagName));

    $.getJSON('/token').then((loginStatus) => {
      console.log(loginStatus);
      if (!loginStatus) {
        window.location.href = '/index.html'
      } else {
        // $.getJSON('/list').then((data) => {
        //   createCollection(data);
        // }, (err) => {
        //   console.log(err);
        // })
      }
    });
  });
})();
