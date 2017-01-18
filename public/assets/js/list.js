// eslint-disable-next-line wrap-iife, func-names,
(function () {
  // eslint-disable-next-line lines-around-directive, strict
  'use strict';

  const view = window.location.search.substr(6)

  // eslint-disable-next-line func-names
  const createTag = function (tagName) {
    const $tag = $('<div>').text(tagName).addClass('chip right');
    const $close = $('<i>').addClass('close material-icons').text('close');

    return $tag.append($close);
  };

  // eslint-disable-next-line func-names
  const createCollectionItem = function (object, checked) {
    const id = `item${object.id}`;
    const $li = $('<li>').addClass('collection-item');
    const $input = $('<input>').attr({ type: 'checkbox', checked, id });
    const $label = $('<label>').attr('for', id).text(object.taskName);
    const $editIcon = $('<i>')
      .addClass('material-icons right editButton').text('edit');
    const $closeIcon = $('<i>')
      .addClass('material-icons right closeIcon').text('close');

    $li.append($input, $label, $editIcon, $closeIcon);
    object.tags.reduce(($target, str) => {
      $target.append(createTag(str));

      return $target;
    }, $li);

    if (checked) {
      const $p = $('<p>').text(`Completed: ${object.completedAt}`);

      $p.appendTo($li);
    }

    return $li;
  };

  // eslint-disable-next-line func-names
  const createCollection = function (array) {
    const all = array.filter(obj => !obj.completedAt);
    const completed = array.filter(obj => Boolean(obj.completedAt));

    const $all = all.reduce(($ul, obj) => $ul.append(createCollectionItem(obj)),
    $('<ul>').addClass('collection'));

    const $completed = completed.reduce(($ul, obj) => $ul.append(createCollectionItem(obj, 'checked')),
    $('<ul>').addClass('collection'));

    $('#all').append($all);
    $('#completed').append($completed);
  };

  $(document).on('ready', () => {
    // eslint-disable-next-line func-names, wrap-iife
    (function () {
      const n = new Date();
      const y = n.getFullYear();
      const m = n.getMonth() + 1;
      const d = n.getDate();
      $('#date').text(`${m}/${d}/${y}`);
    })();

    if (view === 'completed') {
      $('#all').hide();
    }

    $.getJSON('/token').then((loginStatus) => {
      if (!loginStatus) {
        window.location.href = '/index.html';
      } else {
        $.getJSON('/list').then((data) => {
          createCollection(data);
        }, (err) => {
          console.log(err);
        });

        $.getJSON('/tags').then((data) => {
          window.matAutocomplete = { data };
        }, (err) => {
          console.log(err);
        })
      }
    });
  });

  const clearTask = () => $('#new-task[type=text], textarea').val('');

  $('#new-task').keyup((event) => {
    const taskName = $('#new-task:focus').val();
    const tags = window.newTagList;

    if (event.which === 13) {
      clearTask();
      $('.new-tags').empty();
      const option = {
        contentType: 'application/json',
        method: 'POST',
        dataType: 'JSON',
        url: '/list',
        data: JSON.stringify({ taskName, tags })
      };

      $.ajax(option).then(() => $.getJSON('/list'),
        (err) => new Error('AJAX error'))
        .then((data) => {
          $('#all ul.collection').remove();
          $('#completed ul.collection').remove();
          createCollection(data);
        }, (err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        });
    }
  });

  $('ul').on('click', '.closeIcon', (event) => {
    const taskItem = event.target.parentNode;
    taskItem.remove();
    const id = $(event.target).siblings('input').attr('id').substr(4);
    const data = JSON.stringify({ id });
    const options = {
      method: 'DELETE',
      url: '/list',
      contentType: 'application/json',
      data,
    };

    $.ajax(options).then((data) => {
      Materialize.toast('Task removed', 1500);
    }, (error) => { console.log(error); });
  });

  $('ul').on('click', '.editButton', (event) => {
    const id = $(event.target).siblings('input').attr('id').substr(4)
    const $target = $(event.target).siblings('label');
    const label = $target.text()
    const $input = $('<input>').attr({ type: 'text', id })
      .addClass('edit').val(label)
    const $addTag = $('<a>').addClass('tag-field').text('Click to add tags')

    $target.replaceWith($input);
    $input.after($addTag);
    $addTag.nextAll().hide();
  });

  $('ul').on('keyup', 'input.edit', (event) => {
    const taskName = $('input.edit:focus').val();
    const id = $('input.edit:focus').attr('id');

    if (event.which === 13) {
      clearTask();
      const option = {
        contentType: 'application/json',
        method: 'PATCH',
        dataType: 'JSON',
        url: '/list',
        data: JSON.stringify({ taskName, id }),
      };

      $.ajax(option).then(() => $.getJSON('/list'))
        .then((data) => {
          $('#all ul.collection').remove();
          $('#completed ul.collection').remove();
          createCollection(data);
        }, (err) => {
          // eslint-disable-next-line no-console
          console.log(err);
        });
    }
  })

  $('body').on('click', '#clear-completed', (event) => {
    console.log('fuck this');
    $('#completed').emtpy();
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

    // eslint-disable-next-line no-shadow
    $.ajax(options).then(() => $.getJSON('/list')).then((data) => {
      $('#all ul.collection').remove();
      $('#completed ul.collection').remove();
      createCollection(data);
    }, (err) => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
  });
})();
