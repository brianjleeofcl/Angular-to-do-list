(function() {
  'use strict';

  $('body').on('click', '.chip .close', (event) => {
    const id = $(event.target).parents('.collection-item')
      .find('input').attr('id').substr(4)

    const option = {
      method: 'DELETE',
      url: '/tags',

    }

    $.ajax()
    console.log(id);
  })

})();
