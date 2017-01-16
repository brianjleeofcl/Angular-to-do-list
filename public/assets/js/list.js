(function() {
  'use strict';

  const data = [{
    id: 1,
    name: 'Pick up dog food',
    completedAt: null,
    tags: ['home', 'pet care']
  }, {
    id: 2,
    name: 'Homework',
    completedAt: new Date('2017-01-11 00:00:00 PST'),
    tags: ['work']
  }, {
    id: 3,
    name: 'Mow lawn',
    completedAt: null,
    tags: ['home', 'gardening']
  }, {
    id: 4,
    name: 'Costco trip',
    completedAt: new Date('2017-01-12 00:00:00 PST'),
    tags: []
  }]

  const createTag = function(tagName) {
    const $tag = $('<div>').text(tagName).addClass('chip right');
    const $close = $('<i>').addClass('close material-icons').text('close');

    return $tag.append($close);
  }

  const createCollectionItem = function(object, checked) {
    const id = `item${object.id}`;
    const $li = $('<li>').addClass('collection-item');
    const $input = $('<input>').attr({ type: 'checkbox', checked, id });
    const $label = $('<label>').attr('for', id).text(object.name);

    $li.append($input, $label)
    object.tags.reduce(($target, str) => {
      $target.append(createTag(str));

      return $target
    }, $li);

    return $li
  }

  const createCollection = function(array) {
    const all = array.filter((obj) => Boolean(obj.completedAt));
    const completed = array.filter((obj) => !obj.completedAt);

    const $all = all.reduce(($ul, obj) => {
      return $ul.append(createCollectionItem(obj))
    }, $('<ul>').addClass('collection'));

    const $completed = completed.reduce(($ul, obj) => {
      return $ul.append(createCollectionItem(obj, 'checked'))
    }, $('<ul>').addClass('collection'));

    $('#all').append($all);
    $('#completed').append($completed);
  }

  createCollection(data);

})();
