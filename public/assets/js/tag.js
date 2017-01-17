(function() {
  'use strict';

  const createCollectionItem = function (object, checked) {
    const id = `item${object.id}`;
    const $li = $('<li>').addClass('collection-item');
    const $input = $('<input>').attr({ type: 'checkbox', checked, id });
    const $label = $('<label>').attr('for', id).text(object.taskName);

    $li.append($input, $label);
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
        $.getJSON(`/tags/${tagName}`).then((data) => {
          createCollection(data);
        }, (err) => {
          console.log(err);
        })
      }
    });
  });
})();
