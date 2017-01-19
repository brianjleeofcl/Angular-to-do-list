(function () {
  'use strict';

  const createTag = function (tagName) {
    const tagId = window.tagData.data[tagName] || JSON.stringify([ tagName ])
    const $tag = $('<div>').text(tagName).addClass('chip right')
      .attr('data', tagId);
    const $close = $('<i>').addClass('close material-icons').text('close');

    return $tag.append($close);
  };

  const clearInput = function () {
    $(event.target).find('input').val('');
  };

  $('body').on('click', 'a.tag-field', (event) => {
    const $form = $('<form>').attr('id', 'new-tag').addClass('row');
    const $field = $('<input>').attr({
      type: 'text',
      placeholder: 'tag:'
    }).addClass('autocomplete new-tag-field');
    const $button = $('<button>').attr('type', 'submit').addClass('btn').text('add tag');
    const $wide = $('<div>').addClass('col s10');
    const $narrow = $('<div>').addClass('col s2');
    const $container = $('<div>').addClass('new-tags');

    $wide.append($field);
    $narrow.append($button);
    $form.append($wide, $narrow, $container);

    $(event.target).hide();
    $(event.target).after($form);
    $field.autocomplete(window.matAutocomplete);
  });

  $('body').on('click')

  $('ul').on('submit', 'form#new-tag', (event) => {
    event.preventDefault();

    const tagName = $(event.target).find('input').val().toLowerCase().trim();

    $('.new-tags').append(createTag(tagName));
    clearInput();
  });

  $('body').on('click', '.chip .close', (event) => {
    const taskId = $(event.target)
      .parents('.collection-item')
      .find('input')
      .attr('id')
      .substr(4);
    const tagNameFull = $(event.target).parents('.chip').text();
    const tagName = tagNameFull.substr(0, tagNameFull.length - 5);
    const data = JSON.stringify({ taskId, tagName });

    const option = {
      dataType: 'json',
      method: 'DELETE',
      url: '/task-tag',
      contentType: 'application/json',
      data,
    };

    $.ajax(option).then(() => {
      console.log('deleted!');
    }, (err) => {
      console.log(err);
    });
  });
})();
