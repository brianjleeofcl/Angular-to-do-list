/* eslint-disable func-names, no-console, no-undef,
wrap-iife, no-shadow, no-unused-vars, strict, no-mixed-operators, handle-callback-err */

(function () {
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

    $('li.collection-item').remove();

    const $all = all.reduce(($ul, obj) => $ul.append(createCollectionItem(obj)), $('ul#all'));

    const $completed = completed.reduce(($ul, obj) => $ul.append(createCollectionItem(obj, 'checked')), $('ul#completed'));

    displayProgress(array.length, completed.length);
  };

  const updateSharedStatus = function (data) {
    if (data) {
      const arr = data.map((obj) => obj.email);

      $('#share-status').text(`Shared with: ${arr.join(', ')}`);
    } else {
      $('#share-status').text('Private tag');
    }
  };

  const cap = function(str) {

    return str[0].toUpperCase() + str.substr(1);
  };

  let tagName;
  const tagId = window.location.search.substr(7);

  $(document).on('ready', () => {
    (function () {
      const n = new Date();
      const y = n.getFullYear();
      const m = n.getMonth() + 1;
      const d = n.getDate();
      $('#date').text(`${m}/${d}/${y}`);
    })();

    $.getJSON('/token').then((loginStatus) => {
      if (!loginStatus) {
        window.location.href = '/index.html';
      } else {
        $.getJSON(`/tags-id?tagId=${tagId}`).then((data) => {
          tagName = data.tagName
          $('#tag-name').text(cap(data.tagName));
          createCollection(data.tasks);
          return $.getJSON(`/tags-shared?tagName=${tagName}`);
        }, (err) => {
          $('main').empty();
          $('main').text('Tag not found');
        }).then((bool) => {
          updateSharedStatus(bool);
        });
      }
    });
  });

  $('form#new-task').submit((event) => {
    event.preventDefault();

    const taskName = $('#new-task-input').val();
    const tags = [ tagName ];

    const option = {
      contentType: 'application/json',
      method: 'POST',
      dataType: 'JSON',
      url: '/list',
      data: JSON.stringify({ taskName, tags }),
    };

    $.ajax(option).then(() => $.getJSON(`/tags-id?tagId=${tagId}`),
      (err) => new Error('AJAX error'))

      .then((data) => {
        $('#all ul.collection').remove();
        $('#completed ul.collection').remove();
        createCollection(data);
        $('#new-task-input').val('');
      }, (err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  });

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
    $.ajax(options).then(() => $.getJSON(`/tags-id?tagId=${tagId}`))
      .then((data) => {
        $('#all ul.collection').remove();
        $('#completed ul.collection').remove();
        createCollection(data);
      }, (err) => {
        console.log(err);
      });
  });
})();
