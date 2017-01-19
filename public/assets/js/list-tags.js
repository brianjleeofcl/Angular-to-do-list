(function () {
  'use strict';

  const createTag = function (tagName) {
    const $tag = $('<div>').text(tagName).addClass('chip right');
    const $close = $('<i>').addClass('close material-icons').text('close');

    return $tag.append($close);
  };

  const clearInput = function () {
    $(event.target).val('');
  };

  $('body').on('click', 'a.tag-field', (event) => {
    const $field = $('<input>').attr({
      type: 'text',
      placeholder: 'tag:',
    }).addClass('autocomplete new-tag-field');
    const $container = $('<div>').addClass('new-tags');

    $(event.target).hide();
    $(event.target).after($field, $container);
    $field.autocomplete(window.matAutocomplete);
  });

  $('ul').on('keyup', 'input.new-tag-field', (event) => {
    const tagName = $(event.target).val().toLowerCase().trim();

    if (event.which === 13) {
      $('.new-tags').append(createTag(tagName));
      clearInput();
    }
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
}());
