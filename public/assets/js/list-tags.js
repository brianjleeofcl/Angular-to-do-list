(function () {
  'use strict';

  const createTag = function (tagName) {
    const $tag = $('<div>').text(tagName).addClass('chip right');
    const $close = $('<i>').addClass('close material-icons').text('close');

    return $tag.append($close);
  };

  const clearInput = function () {
    $(event.target).val('')
  }

  window.newTagList = [];

  $('body').on('click', 'a.tag-field', (event) => {
    $(event.target).hide();
    $(event.target).next().show();
  })

  $('#new-tag-field').on('keyup', (event) => {
    const tagName = $(event.target).val();

    if (event.which === 13) {
      if (!newTagList.includes(tagName)) {
        $('.new-tags').append(createTag(tagName));
        newTagList.push(tagName);
      }
      clearInput();
    }
  })

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
      url: '/tags',
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
