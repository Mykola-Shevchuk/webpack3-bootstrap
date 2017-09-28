/* jslint browser:true*/
/* global jQuery*/

(function($) {
  'use strict';

  $('tr[row-close="true"]').hide();

  function hideServiceHeader() {
    $('tr[service-header="service-header"]').hide();
  }

  function showServiceHeader() {
    hideServiceHeader();
    var visibleService = $('tr[type="service"]').filter(':visible');
    visibleService.each(function() {
      var headerId = $(this).attr('header-devision');
      $('#' + headerId).show();
    });
  }

  hideServiceHeader();
  showServiceHeader();

  $('tr.app-zebra-list').each(function(index) {
    if ((index + 1) % 2 === 0) {
      $(this).addClass('app-zebra');
    }
  });

  $('tr.app-zebra>td[parent="parent"]').each(function() {
    var serviceSelector = $(this).attr('id');
    $('tr[child="' + serviceSelector + '"]').addClass('app-zebra');
  });

  function toggleCheckbox(etarget) {
    var targetElement = $(etarget);
    var target = targetElement.attr('id');
    var selector = $('tr[device-type="' + target + '"]');
    if (targetElement.is(':checked')) {
      selector.addClass('row-show');
      $('tr[type="' + target + '"]').show();
    } else {
      selector.removeClass('row-show').hide();
    }
  }

  function showNoDevision() {
    if ($('input[device="device"]:checked').length === 0) {
      $('#select-division').show();
      $('#all-devices').attr('show-device', 'true');
      $('#all-services').attr('show-service', 'true');
    } else {
      $('#select-division').hide();
    }
  }

  function getCheckedArray() {
    var arrayChecked = [];
    $.each($('input[device="device"]'), function(index, element) {
      if ($(element).is(':checked')) {
        arrayChecked.push($(element).attr('id'));
      }
    });
    return arrayChecked;
  }

  function showNoItems(sum, countBlock, elementsToggleBlock, noElementsBlock) {
    if (sum > 0) {
      noElementsBlock.addClass('app-display--none');
      elementsToggleBlock.removeClass('app-display--none');
      $(countBlock).html(sum);
    } else {
      elementsToggleBlock.addClass('app-display--none');
      noElementsBlock.removeClass('app-display--none');
    }
  }

  function countAllItems(arrayChecked, countBlock, elementsToggleBlock, noElementsBlock, countAttribute) {
    var sum = 0;
    $.each(arrayChecked, function(index, element) {
      sum += Number($('#' + element).attr(countAttribute));
    });
    showNoItems(sum, countBlock, elementsToggleBlock, noElementsBlock);
  }

  function countAccountItems(arrayChecked, countBlock, noElementsAttribute) {
    $.each(countBlock, function(index, element) {
      var sumAccount = 0;
      var parentId = $(element).parent().attr('id');
      var devicesElement = $('#' + parentId);
      var noDevicesElement = $('span[' + noElementsAttribute + '="' + parentId + '"]');
      $.each(arrayChecked, function(index, checkedInput) {
        sumAccount += Number($(element).attr(checkedInput));
      });
      showNoItems(sumAccount, element, devicesElement, noDevicesElement);
    });
  }

  function checkboxFunctionsCall(etarget) {
    var arrayChecked = getCheckedArray();
    countAllItems(arrayChecked, $('#deviceCount'), $('#all-devices'), $('span[no-devices="no-devices"]'), 'count-devices');
    countAllItems(arrayChecked, $('#serviceCount'), $('#all-services'), $('span[no-services="no-services"]'), 'count-services');
    countAccountItems(arrayChecked, $('span[count-devices-account="count-devices-account"]'), 'no-devices-account');
    countAccountItems(arrayChecked, $('span[count-services-account="count-services-account"]'), 'no-services-account');
    toggleCheckbox(etarget);
  }

  // click on checkbox
  $('input[device="device"]').on('change', function(e) {
    checkboxFunctionsCall(e.target);
    showNoDevision();
    showServiceHeader();
  });

  // click on arrow
  $('td[parent="parent"]').on('click', function(e) {
    var target = $(e.target).attr('id');
    var selector = $('tr[child="' + target + '"]');
    selector.toggle();
    showServiceHeader();
  });

  function toggleCheck(target, selector, type) {
    var countItems = Number($(target).children('span').text());
    var openItems = selector.filter(':visible').filter('[type="' + type + '"]').length;
    return countItems > openItems ? 'true' : 'false';
  }

// click on devices button on type devices row
  $('a[toggle-device="toggle-device"]').on('click', function(e) {
    var target = $(e.target);
    var targetId = target.attr('id');
    var selector = $('tr[device="' + targetId + '"]');
    var flag = toggleCheck(target, selector, 'device');
    $('tr[general-device="' + targetId + '"]').hide();
    if (flag === 'true') {
      selector.each(function() {
        var row = $(this);
        var selectorType = row.attr('type');
        if (selectorType === 'device') {
          row.show();
        }
      });
      arrowRotateBottom($('tr[device="' + targetId + '"] td[parent="parent"].arrow-clickable'));
    } else {
      selector.hide();
    }
    showServiceHeader();
  });

  // click on services button on type devices row
  $('a[toggle-service="toggle-service"]').on('click', function(e) {
    var target = $(e.target);
    var targetId = target.attr('id');
    var selector = $('tr[service="' + targetId + '"]');
    var flag = toggleCheck(target, selector, 'service');
    $('tr[general-service="' + targetId + '"]').hide();
    if (flag === 'true') {
      selector.show();
      $('tr[general-service="' + targetId + '"]').show();
      arrowRotateTop($('tr[service="' + targetId + '"] td[parent="parent"].arrow-clickable'));
      arrowRotateTop($('tr[general-service="' + targetId + '"] td[parent="parent"].arrow-clickable'));
    } else {
      selector.each(function() {
        var row = $(this);
        var selectorType = row.attr('type');
        if (selectorType === 'service') {
          row.hide();
        }
      });
      arrowRotateBottom($('tr[service="' + targetId + '"] td[parent="parent"].arrow-clickable'));
    }
    showServiceHeader();
  });

  function arrowRotateBottom(selector) {
    selector.removeClass('app-data__table-data--arrow-top')
		.addClass('app-data__table-data--arrow-bottom');
  }

  function arrowRotateTop(selector) {
    selector.removeClass('app-data__table-data--arrow-bottom')
		.addClass('app-data__table-data--arrow-top');
  }

  // click on devices button on account row
  $('a[account-device="account-device"]').on('click', function(e) {
    var target = $(e.target);
    var targetId = target.attr('id');
    var selector = $('tr[device-account="' + targetId + '"]');
    var flag = toggleCheck(target, selector, 'device');
    $('tr[general-device-account="' + targetId + '"]').hide();
    if (flag === 'true') {
      selector.each(function() {
        var row = $(this);
        var selectorType = row.attr('type');
        if (row.hasClass('row-show') && selectorType === 'device') {
          row.show();
        }
      });
      arrowRotateBottom($('tr[device-account="' + targetId + '"] td[parent="parent"].arrow-clickable'));
    } else {
      selector.hide();
    }
    showServiceHeader();
  });

 // click on services button on account row
  $('a[account-service="account-service"]').on('click', function(e) {
    var target = $(e.target);
    var targetId = target.attr('id');
    var selector = $('tr[service-account="' + targetId + '"]');
    var flag = toggleCheck(target, selector, 'service');
    if (flag === 'true') {
      selector.each(function() {
        var row = $(this);
        if (row.hasClass('row-show')) {
          row.show();
        }
      });
      arrowRotateTop($('tr[service-account="' + targetId + '"] td[parent="parent"].arrow-clickable'));
    } else {
      selector.each(function() {
        var row = $(this);
        var selectorType = row.attr('type');
        if (selectorType === 'service' || selectorType === 'general-service') {
          row.hide();
        }
      });
      arrowRotateBottom($('tr[service-account="' + targetId + '"] td[parent="parent"].arrow-clickable'));
    }
    showServiceHeader();
  });

  // click on all devices button
  $('#all-devices').on('click', function(e) {
    var target = $(e.target);
    var selector = $('tr[type="device"]');
    var selectorAll = $.merge($.merge([], selector), $('tr[type="service"]'));
    var flag = toggleCheck(target, selector, 'device');
    $('tr[type="general-service"]').hide();
    if (flag === 'true') {
      selector.each(function() {
        var row = $(this);
        if (row.hasClass('row-show')) {
          row.show();
        }
      });
      arrowRotateBottom($('td[parent="parent"].arrow-clickable'));
    } else {
      $(selectorAll).hide();
    }
    showServiceHeader();
  });

  // click on all services button
  $('#all-services').on('click', function(e) {
    var target = $(e.target);
    var selector = $('tr[type="service"]');
    var generalSelector = $('tr[type="general-service"]');
    var selectorAll = $.merge($.merge($.merge([], selector), $('tr[type="device"]')), generalSelector);
    var flag = toggleCheck(target, selector, 'service');
    if (flag === 'true') {
      $(selectorAll).each(function() {
        var row = $(this);
        if (row.hasClass('row-show')) {
          row.show();
        }
      });
      arrowRotateTop($('td[parent="parent"].arrow-clickable'));
    } else {
      selector.hide();
      generalSelector.hide();
      arrowRotateBottom($('td[parent="parent"].arrow-clickable'));
    }
    showServiceHeader();
  });

  $('.app-data__table-data--arrow-top.arrow-clickable').click(function(e) {
    toggle(e.target, 'app-data__table-data--arrow-top', 'app-data__table-data--arrow-bottom');
  });

  $('.app-data__table-data--arrow-bottom.arrow-clickable').click(function(e) {
    toggle(e.target, 'app-data__table-data--arrow-bottom', 'app-data__table-data--arrow-top');
  });

  function toggle(target, className1, className2) {
    $(target).toggleClass(className1);
    $(target).toggleClass(className2);
  }

  $.each($('input[device="device"]'), function(index, element) {
    checkboxFunctionsCall(element);
  });
  $('#select-division').hide();
  showNoDevision();
})(jQuery);
