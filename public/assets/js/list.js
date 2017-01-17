(function () {
  'use strict';

  const createTag = function (tagName) {
    const $tag = $('<div>').text(tagName).addClass('chip right');
    const $close = $('<i>').addClass('close material-icons').text('close');

    return $tag.append($close);
  };

  const createCollectionItem = function (object, checked) {
    const id = `item${object.id}`;
    const $li = $('<li>').addClass('collection-item');
    const $input = $('<input>').attr({ type: 'checkbox', checked, id });
    const $label = $('<label>').attr('for', id).text(object.taskName);
    const $editButton = $('<a>').addClass('btn-floating', 'btn-small', 'waves-effect', 'waves-light', 'red');
    const $editIcon = $('<i>').addClass('material-icons').text('insert_chart');


    $li.append($input, $label, $editButton, $editIcon);
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
  };

  (function () {
    const n = new Date();
    const y = n.getFullYear();
    const m = n.getMonth() + 1;
    const d = n.getDate();
    $('#date').text(`${m}/${d}/${y}`);
  })();

  const clearTask = () => $('#new-task[type=text], textarea').val('');

  $('#new-task').keyup((event) => {
    const code = event.which;
    const taskName = $('#new-task').val();
    if (code === 13) {
      clearTask();
      const option = {
        contentType: 'application/json',
        method: 'POST',
        dataType: 'JSON',
        url: '/list',
        data: JSON.stringify({ taskName }),
      };

      $.ajax(option).then(() => $.getJSON('/list'))
        .then((data) => {
          $('#all ul.collection').remove();
          $('#completed ul.collection').remove();
          createCollection(data);
        }, (err) => {
          console.log(err);
        });
    }
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
    $.ajax(options).then(() => $.getJSON('/list')).then((data) => {
      $('#all ul.collection').remove();
      $('#completed ul.collection').remove();
      createCollection(data);
    }, (err) => {
      console.log(err);
    });
  });

  $.getJSON('/list').then((data) => {
    createCollection(data);
  }, (err) => {
    console.log(err);
  });
})();
