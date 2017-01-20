'use strict';

// eslint-disable-next-line wrap-iife, func-names,
(function () {
  // eslint-disable-next-line lines-around-directive, strict
  'use strict';

  const view = window.location.search.substr(6);

  // eslint-disable-next-line func-names
  const createTag = function (tagName, taskId) {
    const $tag = $('<div>').text(tagName).addClass('chip right ajax-del')
      .attr({
        'data-tag': window.tagData.data[tagName] || window.tagData.data[`${tagName}-shared`],
        'data-task': taskId
      });
    const $close = $('<i>').addClass('close material-icons').text('close');

    return $tag.append($close);
  };

  // eslint-disable-next-line func-names
  const createCollectionItem = function (object, checked) {
    const id = `item${object.id}`;
    const $li = $('<li>').addClass('collection-item');
    const $row = $('<div>').addClass('row');
    const $input = $('<input>').attr({ type: 'checkbox', checked, id });
    const $label = $('<label>').attr('for', id).text(object.taskName);
    const $editIcon = $('<i>')
      .addClass('material-icons right editButton').text('edit');
    const $closeIcon = $('<i>')
      .addClass('material-icons right closeIcon').text('close');
    const $tags = object.tags.reduce(($target, str) => {
      $target.append(createTag(str, object.id));

      return $target;
    }, $('<div>').addClass('row tag-row'));

    $row.append($input, $label, $editIcon, $closeIcon)
    $li.append($row, $tags);

    if (object.email) {
      const $p = $('<p>').text(`Shared task, created by ${object.email}`);

      $p.appendTo($li);
    }

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

  // eslint-disable-next-line func-names
  const createCollection = function (array) {
    const all = array.filter(obj => !obj.completedAt);
    const completed = array.filter(obj => Boolean(obj.completedAt));

    $('li.collection-item').remove()

    const $all = all.reduce(($ul, obj) => $ul.append(createCollectionItem(obj)),
    $('ul#all'));

    const $completed = completed.reduce(($ul, obj) => $ul.append(createCollectionItem(obj, 'checked')),
    $('ul#completed'));

    displayProgress(array.length, completed.length);
  };

    // eslint-disable-next-line func-names, wrap-iife
  const n = new Date();
  const y = n.getFullYear();
  const m = n.getMonth() + 1;
  const d = n.getDate();
  $('#date').text(`${m}/${d}/${y}`);

  if (view === 'completed') {
    $('#all').hide();
  }

  $.getJSON('/token').then((loginStatus) => {
    if (!loginStatus) {
      window.location.href = '/index.html';
    } else {
      jQuery.when($.getJSON('/list'), $.getJSON('/tags'))
        .then((list, tags) => {
        window.tagData = { data: tags[0] }
        window.matAutocomplete = { data: {} };

        for (const tag in tagData.data) {
          window.matAutocomplete.data[tag] = null;
        }
          createCollection(list[0]);
        }, (err) => {
          console.log(err);
        });
    }
  });


  const clearTask = () => $('#task-input[type=text], textarea').val('');

  $('form#new-task').submit((event) => {
    event.preventDefault();

    const taskName = $('#new-task').find('input').val();
    const tags = getArrayFromTags($('div.new-tags').children());

    if (taskName === '') {
      Materialize.toast('Please enter a valid task.', 4000);

      return;
    }

    clearTask();
    $('#new-tag').remove();
    $('a.tag-field').show();

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
        return $.getJSON('/tags')
      }).then((data) => {
        window.tagData = { data }
        window.matAutocomplete = { data: {} };

        for (const tag in tagData.data) {
          window.matAutocomplete.data[tag] = null;
        }
      }, (err) => {
        console.log(err);
      });
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

  const getArrayFromTags = function ($array) {

    return [...$array.map((_, div) => $(div).attr('data'))];
  }

  $('ul').on('click', '.editButton', (event) => {
    $('form.edit').siblings(':hidden').show();
    $('.edit').remove();

    const id = $(event.target).siblings('input').attr('id').substr(4);
    const $target = $(event.target).siblings('label');
    const label = $target.text();
    const $form = $('<form>').addClass('edit row patch')
    const $button = $('<button>').attr('type', 'submit').addClass('btn-small btn-floating blue darken-2');
    const $icon = $('<i>').addClass('material-icons').text('add');
    const $wide = $('<div>').addClass('col s10');
    const $narrow = $('<div>').addClass('col s2');
    const $input = $('<input>').attr({ type: 'text', id }).val(label);
    const $addTag = $('<a>').addClass('tag-field edit').text('Click to add tags');

    $button.append($icon)
    $wide.append($input);
    $narrow.append($button);
    $form.append($wide, $narrow);
    $target.after($form, $addTag);
    $target.hide();
    $addTag.nextAll().hide();
  });

  $('ul').on('submit', 'form.patch', (event) => {
    event.preventDefault();

    const taskName = $(event.target).find('input').val();
    const id = $(event.target).find('input').attr('id');
    const tags = getArrayFromTags($('div.new-tags').children());

    if (taskName === '') {
      Materialize.toast('Please enter a valid task.', 4000);

      return;
    }

    clearTask();
    $('.new-tags').remove();
    $('.new-tag-field').remove();
    $('a.tag-field.edit').remove();

    const option = {
      contentType: 'application/json',
      method: 'PATCH',
      dataType: 'JSON',
      url: '/list',
      data: JSON.stringify({ taskName, id, tags }),
    };

    $.ajax(option).then(() => $.getJSON('/list'),
      (err) => new Error('AJAX error'))
      .then((data) => {
        $('#all ul.collection').remove();
        $('#completed ul.collection').remove();
        createCollection(data);
        return $.getJSON('/tags')
      }).then((data) => {
        window.tagData = { data }
        window.matAutocomplete = { data: {} };

        for (const tag in tagData.data) {
          window.matAutocomplete.data[tag] = null;
        }
      }, (err) => {
        console.log(err);
      });
  });

  $('body').on('click', '#clear-completed', (event) => {
    $('#completed ul.collection').remove();
    const option = {
      method: 'DELETE',
      dataType: 'JSON',
      url: '/list/completed',
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
}());
