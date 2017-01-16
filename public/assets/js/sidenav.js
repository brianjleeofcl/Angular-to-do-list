(function() {
  'use strict';

  const $createLI = function(fn, ...rest) {
    return $('<li>').append(fn(...rest))
  }

  const $createUserView = function(name, email) {
    const $outer = $('<div>').addClass('userView');
    const $inner = $('<div>').addClass('background blue-grey')
    const $name = $('<span>').text(name)
      .addClass('white-text name');
    const $email = $('<span>').text(email).addClass('white-text');

    $inner.appendTo($outer);
    $('<a>').append($name).appendTo($outer);
    $('<a>').append($email).appendTo($outer);

    return $outer
  }

  const $createIconLink = function(content, iconName, path) {
    const $link = $('<a>').attr('href', path).text(content)
      .addClass('waves-effect')
    const $icon = $('<i>').addClass('material-icons').text(iconName)

    $link.append($icon)

    return $link
  }

  const $createDropdown = function(array) {
    const $collapse = $('<ul>').addClass('collapsible collapsible-accordion');
    const $li = $createLI($createIconLink, 'Tags', 'arrow_drop_down');

    $li.children('a').addClass('collapsible-header');

    const $div = $('<div>').addClass('collapsible-body');
    const $dropdown = $('<ul>')
    array.reduce(($ul, tag) => {
      const $link = $('<a>').addClass('waves-effect').text(tag);

      $('<li>').append($link).appendTo($ul);

      return $ul;
    }, $dropdown).appendTo($div);

    $li.append($div).appendTo($collapse)

    return $collapse;
  }

  const $createNav = function(userData) {
    const { name, email, tags } = userData
    const $nav = $('<nav>');
    const $divWrap = $('<div>').addClass('nav-wrapper');
    const $ul = $('<ul>').addClass('side-nav fixed').attr('id', 'slide-out');
    const $button = $createIconLink('', 'menu')
      .attr('data-activates', 'slide-out').addClass('button-collapse');

    $divWrap.append($ul, $button).appendTo($nav)

    $ul.append($createLI($createUserView, name, email))
    $ul.append($createLI($createIconLink, 'All items', 'list', '/list.html'));
    $ul.append($createLI($createIconLink, 'Completed', 'done_all', '/list.html'));
    $ul.append($('<div>').addClass('divider'));
    $ul.append($createLI($createDropdown, tags).addClass('no-padding'));
    $ul.append($('<div>').addClass('divider'));
    $ul.append($createLI($createIconLink, 'Log out', 'first_page').attr('id', 'log-out'));

    return $nav
  }

  $.getJSON('/sidenav').then((data) => {
    if ($('nav').length) {
      $('nav').remove();
    }

    $('body').prepend($createNav(data));
    $('.button-collapse').sideNav({
      closeOnclick: true,
      draggable: true
    });

    $('.collapsible').collapsible();

    $('#log-out').click((event) => {
      event.preventDefault();

      const options = {
        method: 'DELETE',
        dataType: 'json',
        url: '/token'
      }

      $.ajax(options).then(() => {
        window.location.href = '/index.html'
      } ,() => {
        console.log('Unable to log out. Please try again.');
      })
    })
  }, (err) => {err})

})();
