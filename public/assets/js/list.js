(function() {
  'use strict';

  const appendDate = function () {
    const n =  new Date();
    const y = n.getFullYear();
    const m = n.getMonth() + 1;
    const d = n.getDate();
    $('#date').text(`${m}/${d}/${y}`);
  }
  appendDate();

  const createNewTaskElement = function () {

  }

  $('#new-task').keyup((event) => {
    const code = event.which;
    const newTask = $('#new-task').val();
    if (code === 13) {
      const option =
      {
        method: 'post',
        dataType: 'JSON',
        url: '/list'
      };
      $.ajax(option).done();
    }
  });

  const createTag = function(tagName) {
    const $tag = $('<div>').text(tagName).addClass('chip right');
    const $close = $('<i>').addClass('close material-icons').text('close');

    return $tag.append($close);
  }

  const createCollectionItem = function(object, checked) {
    const id = `item${object.id}`;
    const $li = $('<li>').addClass('collection-item');
    const $input = $('<input>').attr({ type: 'checkbox', checked, id });
    const $label = $('<label>').attr('for', id).text(object.taskName);

    $li.append($input, $label)
    object.tags.reduce(($target, str) => {
      $target.append(createTag(str));

      return $target;
    }, $li);

    if (checked) {
      const $p = $('<p>').text(`Completed: ${object.completedAt}`);

      $p.appendTo($li)
    }

    return $li;
  }

  const createCollection = function(array) {
    const all = array.filter((obj) => !obj.completedAt);
    const completed = array.filter((obj) => Boolean(obj.completedAt));

    const $all = all.reduce(($ul, obj) => {
      return $ul.append(createCollectionItem(obj));
    }, $('<ul>').addClass('collection'));

    const $completed = completed.reduce(($ul, obj) => {
      return $ul.append(createCollectionItem(obj, 'checked'));
    }, $('<ul>').addClass('collection'));

    $('#all').append($all);
    $('#completed').append($completed);
  }

  $.getJSON('/list').then((data) => {
    createCollection(data);
  }, (err) => {
    console.log(err);
  })
})();
