/* jslint browser:true*/
/* global jQuery*/
/* global window*/

(function($) {
  'use strict';

  function removeActivePagination(target, className) {
    $('.app-active-page').removeClass('app-active-page');
    $('.app-active-arrow').removeClass('app-active-arrow');
    $(target).addClass(className);
  }

  function setTab(activeNumber) {
    $('input[name="tab"]').val(activeNumber);
  }

  $('a').tooltip({container: 'nav',
    viewport: {selector: 'nav', padding: 0}
  });

  // $('.app-nav__icon').click(function(e) {
  //   $('.app-nav__container--active').removeClass('app-nav__container--active');
  //   e.target.parents('.app-nav__container').addClass('app-nav__container--active');
  //   e.target.find('path').attr('class', 'app-nav__icon-img--grey');
  //   $('[data-toggle="tooltip"]').tooltip('hide');
  // });

  $('.app-nav__icon').hover(function() {
    $('[data-toggle="tooltip"]').not(this).tooltip('hide');
  });

  $('.link-preventDefault').click(function(e) {
    e.preventDefault();
  });

  $('.pagination a').not('.app-pagination-arrow').click(function(e) {
    removeActivePagination(e.target, 'app-active-page');
  });

  $('.app-pagination-arrow').click(function(e) {
    removeActivePagination(e.target, 'app-active-arrow');
  });

  $('.app-search-panel__icon-settings').click(function() {
    var toggleBlock = $('#app-toggle-block');
    $(this).toggleClass('app-search-panel__icon-settings--active');
    toggleBlock.toggleClass('app-toggle-block--inactive');
    var advancedStatus = toggleBlock.hasClass('app-toggle-block--inactive') ? 0 : 1;
    $('input[name="advanced"]').val(advancedStatus);
  });

  $('.selectpicker').selectpicker({
    size: 4,
    dropupAuto: false
  });

  $('#tab1').click(function() {
    setTab(1);
  });

  $('#tab2').click(function() {
    setTab(2);
  });

  $('#tab3').click(function() {
    setTab(3);
  });

  $('.app-capitalize').on('keyup', function(e) {
    var code = (e.keyCode || e.which);
    if (code === 37 || code === 38 || code === 39 || code === 40 || code === 46 || code === 8) {
      return;
    }
    var start = this.selectionStart;
    var end = this.selectionEnd;
    $(this).val($(this).val().substr(0, 1).toUpperCase() + $(this).val().substr(1));
    this.setSelectionRange(start, end);
  });

  $('input[device="device"]').attr('autocomplete', 'off');

  $(window).bind('pageshow', function(event) {
    if (event.originalEvent.persisted) {
      window.location.reload();
    }
  });

  $(window).on('load', function() {
    $('.content-account').mCustomScrollbar({
      axis: 'y',
      scrollbarPosition: 'inside',
      advanced: {autoExpandHorizontalScroll: true}
    });
    $('.notes-account-content').mCustomScrollbar({
      axis: 'y',
      scrollbarPosition: 'outside',
      advanced: {autoExpandHorizontalScroll: true}
    });
    // Adding margin for content in notes when scroll line is displayed
    function checkDisplayScroll() {
      var $scrollBlock = $('.mCSB_scrollTools_vertical');
      var $scrollLine = $('.mCSB_outside');

      if ($scrollBlock.is(':hidden')) {
        $scrollLine.css('margin-right', '0px');
      }

      if ($scrollBlock.is(':visible')) {
        $scrollLine.css('margin-right', '10px');
      }
    }

    checkDisplayScroll();

    $(window).resize(function() {
      checkDisplayScroll();
    });

    $(function() {
      var dateFormat = 'mm/dd/yy';
      var clearValue = $('.clear-input-value');
      var from = $('#fromDates-opportunities')
        .datepicker({
          defaultDate: '+1w',
          changeMonth: true,
          changeYear: true,
          numberOfMonths: 1,
          dateFormat: 'mm/dd/yy'
        });
      var to = $('#toDates-opportunities').datepicker({
        defaultDate: '+1w',
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 1,
        dateFormat: 'mm/dd/yy'
      });

      from.on('change', function() {
        clearValue.hide();
        to.datepicker('option', 'minDate', getDate(this));
      });

      to.on('change', function() {
        clearValue.hide();
        from.datepicker('option', 'maxDate', getDate(this));
      });

      function getDate(element) {
        var date;
        try {
          date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
          date = null;
        }
        return date;
      }

      from
        .keydown(false)
        .focus(function() {
          if ($(this).val()) {
            $(this).siblings('.clear-input-value').show();
          }
        })
        .contextmenu(false);

      to
        .keydown(false)
        .focus(function() {
          if ($(this).val()) {
            $(this).siblings('.clear-input-value').show();
          }
        })
        .contextmenu(false);

      $('body').on('click', function(e) {
        if (e.target.className !== 'clear-input-value' &&
          e.target.id !== 'fromDates-opportunities' &&
          e.target.id !== 'toDates-opportunities') {
          clearValue.hide();
        }
      });

      clearValue.on('click', function() {
        $(from).datepicker('option', {minDate: null, maxDate: null});
        $(to).datepicker('option', {minDate: null, maxDate: null});
        $(this).siblings('.hasDatepicker').val('');
        $(this).hide();
      });
    });

    $(window).on('resize orientationchange', function() {
      $('.hasDatepicker').datepicker('hide').blur();
      $('.clear-input-value').hide();
    });
  });
})(jQuery);
