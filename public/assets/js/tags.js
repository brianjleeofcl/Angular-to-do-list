(function() {
  'use strict';

  $('body').on('click', '.chip .close', (event) => {
    const taskId = $(event.target).parents('.collection-item')
      .find('input').attr('id').substr(4);
    const tagNameFull = $(event.target).parents('.chip').text()
    const tagName = tagNameFull.substr(0, tagNameFull.length - 5);
    const data = JSON.stringify({ taskId, tagName })

    const option = {
      dataType: 'json',
      method: 'DELETE',
      url: '/tags',
      contentType: 'application/json',
      data
    }

    $.ajax(option).then(() => {
      console.log('deleted!');
    }, (err) => {
      console.log(err);
    })
  })

})();
