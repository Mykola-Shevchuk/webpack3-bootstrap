/* jslint browser:true*/
/* global jQuery*/
/* global window*/
/* global document*/
(function($, window) {
  'use strict';

  // Count blocks height on view pages
  function contactNotesHeight() {
    var contactDataHeight = $('#contactHeight1').innerHeight() + $('#contactHeight2').innerHeight();
    $('.app-contact-main__notes-text').innerHeight(contactDataHeight);
  }
  function setColumnHeight() {
    var trueHeight = $('.app-detailed__wrapper').innerHeight();
    $('.app-contact-list__container--tbody').innerHeight(trueHeight - 38);
  }

  contactNotesHeight();
  setColumnHeight();

  $(window).resize(function() {
    contactNotesHeight();
    setColumnHeight();
  });

  // Click on delete button on popup
  $('a[data-delete="Yes"]').one('click', function(e) {
    e.preventDefault();
    window.location = $(this).attr('href');
    $(this).click(function(e) {
      e.preventDefault();
    });
  });

  // Set link in select popup
  $('.app-modal-link').click(function(e) {
    var target = $(e.target);
    var path = target.attr('data-link');
    var modalId = target.attr('data-target');
    if (!path) {
      var thisElement = $(this);
      path = thisElement.attr('data-link');
      modalId = thisElement.attr('data-target');
    }
    $(modalId + ' [data-confirm="modalYes"]').attr('href', path);
  });

  // Click on Add Agent or Add Channel
  $('.get-municipalityData').click(function(e) {
    var target = $(e.target);
    var departmentId = target.attr('data-departmentId');
    var agentId = target.attr('data-agentId');
    var modalId = target.attr('data-target');
    var modalSelector = $(modalId + ' button[type="submit"]');
    modalSelector.attr('data-departmentId', departmentId);
    if (agentId) {
      modalSelector.attr('data-agentId', agentId);
    }
  });

  // For popup with form
  $(document).on('keydown keyup', function(e) {
    if ($('.popupForm').is(':visible')) {
      if (e.which === 13) {
        e.preventDefault();
      }
    }
  });

  // Setting ContactPerson Roles
  function unchecked(checkedInput, uncheckedInput) {
    if (!checkedInput.checked) {
      $(uncheckedInput).prop('checked', false);
    }
  }

  function checked(checkedInput, uncheckedInput) {
    if (checkedInput.checked) {
      $(uncheckedInput).prop('checked', true);
    }
  }

  $('#account_contact_person_authorizer').change(function() {
    unchecked(this, '#account_contact_person_authorizerBackflow');
    unchecked(this, '#account_contact_person_authorizerFire');
    unchecked(this, '#account_contact_person_authorizerPlumbing');
    unchecked(this, '#account_contact_person_authorizerAlarm');
  });

  $('#account_contact_person_access').change(function() {
    unchecked(this, '#account_contact_person_accessIsPrimary');
  });

  $('#account_contact_person_payments').change(function() {
    unchecked(this, '#account_contact_person_paymentsIsPrimary');
  });

  $('#account_contact_person_authorizerBackflow').change(function() {
    checked(this, '#account_contact_person_authorizer');
  });

  $('#account_contact_person_authorizerAlarm').change(function() {
    checked(this, '#account_contact_person_authorizer');
  });

  $('#account_contact_person_authorizerFire').change(function() {
    checked(this, '#account_contact_person_authorizer');
  });

  $('#account_contact_person_authorizerPlumbing').change(function() {
    checked(this, '#account_contact_person_authorizer');
  });

  $('#account_contact_person_accessIsPrimary').change(function() {
    checked(this, '#account_contact_person_access');
  });

  $('#account_contact_person_paymentsIsPrimary').change(function() {
    checked(this, '#account_contact_person_payments');
  });

  // Refresh select
  $('.refreshSelect').click(function() {
    $('.app-modal__form select').val('').selectpicker('refresh');
  });

  // Reset popup form on press Cancel
  $('.modalCancel').click(function(e) {
    var formId = $(e.target).closest('form').attr('id');
    $('#' + formId).validate().resetForm();
  });
})(jQuery, window);
