(function() {
  'use strict';

  const createCollectionItem = function (object, checked) {
    const id = `item${object.id}`;
    const $li = $('<li>').addClass('collection-item');
    const $input = $('<input>').attr({ type: 'checkbox', checked, id });
    const $label = $('<label>').attr('for', id).text(object.taskName);

    $li.append($input, $label);

    if (checked) {
      const time = moment(object.completedAt).local().calendar();
      const $p = $('<p>').text(`Completed: ${time}`);

      $p.appendTo($li);
    }

    return $li;
  };

  const displayProgress = function (total, completed) {
    const percent = (completed / total * 100) || 0;
    const $bar = $('<div>').addClass('determinate').attr('style', `width: ${percent}%`);

    $('#rate-string').text(`${completed} out of ${total} completed`);
    $('.progress').append($bar);
  };

  const createCollection = function (array) {
    const all = array.filter(obj => !obj.completedAt);
    const completed = array.filter(obj => Boolean(obj.completedAt));

    const $all = all.reduce(($ul, obj) => {
      return $ul.append(createCollectionItem(obj));
    }, $('<ul>').addClass('collection'));

    const $completed = completed.reduce(($ul, obj) => {
      return $ul.append(createCollectionItem(obj, 'checked'));
    }, $('<ul>').addClass('collection'));

    $('#all').append($all);
    $('#completed').append($completed);
    displayProgress(array.length, completed.length);
  };

  const cap = function(str) {
    return str[0].toUpperCase() + str.substr(1);
  };

  const tagName = window.location.search.substr(9).replace(/%20/, ' ');

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
      if (!loginStatus) {
        window.location.href = '/index.html';
      } else {
        $.getJSON(`/tags/${tagName}`).then((data) => {
          createCollection(data);
        }, (err) => {
          console.log(err);
        });
      }
    });
  });

  $('form#new-task').submit((event) => {
    event.preventDefault();

    const taskName = $('#new-task-input').val();
    const tags = [ tagName ];
    console.log(tags);
    const option = {
      contentType: 'application/json',
      method: 'POST',
      dataType: 'JSON',
      url: '/list',
      data: JSON.stringify({ taskName, tags })
    };

    $.ajax(option).then(() => $.getJSON(`/tags/${tagName}`),
      (err) => new Error('AJAX error'))
      .then((data) => {
        $('#all ul.collection').remove();
        $('#completed ul.collection').remove();
        createCollection(data);
      }, (err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  })

  $('body').on('change', 'input[type=checkbox]', (event) => {
    const completedAt = $(event.target).prop('checked') ? new Date() : null;
    const id = $(event.target).attr('id').substr(4);
    const data = JSON.stringify({ id, completedAt });
    const options = {
      method: 'PATCH',
      url: '/list',
      contentType: 'application/json',
      data,
    };
    $.ajax(options).then(() => $.getJSON(`/tags/${tagName}`)).then((data) => {
      $('#all ul.collection').remove();
      $('#completed ul.collection').remove();
      createCollection(data);
    }, (err) => {
      console.log(err);
    });
  });
})();
