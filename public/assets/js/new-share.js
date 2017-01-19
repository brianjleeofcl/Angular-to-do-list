(function() {
  'use strict';

  const displayUser = function (str) {
    $('#verified').append($('<p>').text(str));
  }

  const userIds = [];

  $('form#add-user').submit((event) => {
    event.preventDefault();

    const email = $(event.target).find('input').val().toLowerCase().trim();

    $.getJSON(`/users/check?email=${email}`).then((data) => {
      if (!data) {
        Materialize.toast('User does not exist', 750);
        return;
      }

      if (userIds.includes(data.id)) {
        Materialize.toast('Already added', 750);
      } else {
        userIds.push(data.id);
        displayUser(email);
      }

      $(event.target).find('input').val('');
    }, (error) => {
      console.log(error);
    });
  });

  $('form#add-tag').submit((event) => {
    event.preventDefault();

    if (!userIds.length) {
      Materialize.toast('Please add users to share', 750);
      return;
    }

    const tagName = $('#add-tag').find('input').val().toLowerCase().trim();
    const data = JSON.stringify({ tagName, userIds });
    const options = {
      method: 'POST',
      url: '/shared',
      contentType: 'application/json',
      data
    };

    $.ajax(options).then((data) => {
      window.location.href = `/tag.html?tagName=${data.tagName}`;
    }, (error) => {
      console.log(error)
    });
  });
})();
