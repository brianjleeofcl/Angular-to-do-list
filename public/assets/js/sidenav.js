/* eslint-disable func-names, no-console, no-undef, wrap-iife,
no-script-url, no-shadow, no-unused-vars, strict */

(function () {
  'use strict';

  const $createLI = function (fn, ...rest) {
    return $('<li>').append(fn(...rest));
  };

  const $createUserView = function (name, email) {
    const $outer = $('<div>').addClass('userView');
    const $inner = $('<div>').addClass('background blue-grey');
    const $name = $('<span>').text(name)
      .addClass('white-text name');
    const $email = $('<span>').text(email).addClass('white-text');

    $inner.appendTo($outer);
    $('<a>').append($name).appendTo($outer);
    $('<a>').append($email).appendTo($outer);

    return $outer;
  };

  const $createIconLink = function (content, iconName, path) {
    const $link = $('<a>').attr('href', path).text(content)
      .addClass('waves-effect');
    const $icon = $('<i>').addClass('material-icons').text(iconName);

    $link.append($icon);

    return $link;
  };

  const $createDropdown = function (array, str) {
    const $collapse = $('<ul>').addClass('collapsible collapsible-accordion');
    const $li = $createLI($createIconLink, str, 'arrow_drop_down');

    $li.find('i').addClass('right');

    const $icon = $('<i>').addClass('material-icons')
      .text(str === 'Private tags' ? 'label_outline' : 'folder_shared');

    $li.children('a').addClass('collapsible-header').append($icon);

    const $div = $('<div>').addClass('collapsible-body');
    const $dropdown = $('<ul>');
    array.reduce(($ul, tag) => {
      const $link = $('<a>').addClass('waves-effect')
        .text(tag.tagName).attr({
          href: `tag.html?tagId=${tag.id}`,
          data: tag.id
        });
      const $close = $('<i>').addClass('material-icons right close sidenav')
        .text('close')

      $link.append($close);
      $('<li>').append($link).appendTo($ul);

      return $ul;
    }, $dropdown).appendTo($div);

    $li.append($div).appendTo($collapse);

    return $collapse;
  };

  const $createNav = function (userData) {
    const { name, email, tags, shared } = userData;
    const $nav = $('<nav>');
    const $headerLogo = $('<span>').text('Remembify')
    .addClass('center')
    .css('font-family', 'Roboto');
    const $divWrap = $('<div>').addClass('nav-wrapper')
    const $ul = $('<ul>').addClass('side-nav fixed').attr('id', 'slide-out');
    const $button = $createIconLink('', 'menu')
      .attr('data-activates', 'slide-out').addClass('button-collapse');
    $divWrap.append($headerLogo, $ul, $button).appendTo($nav);

    $ul.append($createLI($createUserView, name, email));
    $ul.append($createLI($createIconLink, 'All items', 'list', '/list.html'));
    $ul.append($createLI($createIconLink, 'Completed', 'done_all', '/list.html?view=completed'));
    $ul.append($('<div>').addClass('divider'));
    $ul.append($createLI($createDropdown, tags, 'Private tags').addClass('no-padding'));
    $ul.append($('<div>').addClass('divider'));
    $ul.append($createLI($createDropdown, shared, 'Shared tags').addClass('no-padding'));
    $ul.append($createLI($createIconLink, 'Create shared tag', 'create_new_folder', '/new-shared.html'));
    $ul.append($('<div>').addClass('divider'));
    $ul.append($createLI($createIconLink, 'Log out', 'first_page').attr('id', 'log-out'));

    return $nav;
  };

  const renderNav = function () {
    $.getJSON('/sidenav').then((data) => {
      if ($('nav').length) {
        $('nav').remove();
      }
      console.log(data);
      $('body').prepend($createNav(data));
      $('.button-collapse').sideNav({
        closeOnclick: true,
        draggable: true,
      });

      $('.collapsible').collapsible();

      $('#log-out').click((event) => {
        event.preventDefault();

        const options = {
          method: 'DELETE',
          dataType: 'json',
          url: '/token',
        };

        $.ajax(options).then(() => {
          window.location.href = '/index.html';
        }, () => {
          console.log('Unable to log out. Please try again.');
        });
      });
    }, err => err);
  };

  $(document).on('ready', renderNav);

  $('body').on('click', 'i.close.sidenav', (event) => {
    const tagItem = event.target.parentNode;
    tagItem.href = 'javascript: void(0)';
    tagItem.remove();
    const tagId = $(tagItem).attr('data');
    const data = JSON.stringify({ tagId });

    const options = {
      method: 'DELETE',
      url: '/tags',
      contentType: 'application/json',
      data,
    };

    $.ajax(options).then((data) => {
      Materialize.toast('Tag removed', 1500);
    }, (error) => { console.log(error); });
  });
})();
