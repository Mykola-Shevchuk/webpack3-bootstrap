/* jslint browser:true*/
/* global jQuery*/
/* global location*/
(function($) {
  'use strict';

  var validationForm = {
    focusCleanup: true,
    focusInvalid: false
  };

  var errorSelectStyle = {
    highlight: function(element, errorClass) {
      highlightSelect(element, errorClass);
    },
    unhighlight: function(element, errorClass) {
      unhighlightSelect(element, errorClass);
    }
  };

  function ruleRequired(lengthMax, lengthMin) {
    var rule = {
      required: true,
      notOnlySpace: true
    };
    if (lengthMax) {
      rule.maxlength = lengthMax;
    }
    if (lengthMin) {
      rule.minlength = lengthMin;
    }
    return rule;
  }

  function ruleMaxLength(length) {
    return {
      maxlength: length
    };
  }

  function ruleDigits() {
    return {
      digits: true,
      messages: {
        digits: 'Digits only.'
      }
    };
  }

  function ruleEmail(required) {
    var rule = {
      email: true,
      trueEmail: true,
      maxlength: 50
    };
    if (required) {
      rule.required = true;
      rule.notOnlySpace = true;
    }
    return rule;
  }

  function highlightSelect(element, errorClass) {
    $(element).addClass(errorClass);
    if ($(element).hasClass('selectpicker')) {
      $(element).closest('.form-group').addClass('has-error');
    }
  }

  function unhighlightSelect(element, errorClass) {
    $(element).removeClass(errorClass);
    if ($(element).hasClass('selectpicker')) {
      $(element).closest('.form-group').removeClass('has-error');
    }
  }

  function sendForm(form, event) {
    $('.app-submit-error').removeClass('app-submit-error').html('');
    $(form).find('button[type="submit"]').attr('disabled', 'disabled');
    form.submit();
    event.preventDefaults();
    // setTimeout(function() {
    //   $(form).find('button[type="submit"]').attr('disabled', false);
    // }, 5000);
  }

  function showModal(form, event, selector) {
    $(selector).modal('show');
    $(selector).on('shown.bs.modal', function() {
      $('input').blur();
      $('a[data-cancel="Yes"]').click(function() {
        event.preventDefaults();
      });
      $('a[data-submit="Yes"]').one('click', function() {
        sendForm(form, event);
      });
    });
  }

  function onSubmitHandler(form, event, selector, entity) {
    if ($('button[type="submit"]').attr('data-update') === 'Yes') {
      $(selector + ' .modal-body p').text('Are you sure you want to update this ' + entity + '?');
    }
    showModal(form, event, selector);
  }

  function onLinkHandler(form, event, selector, entity, linkTo) {
    $('.modal-body p').text('Are you sure you want to create new ' + entity + ' and link it to the ' + linkTo + '?');
    showModal(form, event, selector);
  }

  $('.selectpicker').on('change', function() {
    $(this).valid();
  });

  $('#loginForm').validate($.extend({}, {
    rules: {
      _username: ruleEmail(true),
      _password: ruleRequired(undefined, 6)
    },
    submitHandler: function(form) {
      sendForm(form);
    }
  }, validationForm));

  $('#accountForm').validate($.extend({}, {
    rules: {
      'account[name]': ruleRequired(100),
      'account[address][address]': ruleRequired(100),
      'account[address][city]': ruleRequired(50),
      'account[address][zip]': ruleRequired(50),
      'account[municipalityAutocomplete]': ruleRequired(),
      'account[notes]': ruleMaxLength(255),
      'account[address][state]': {required: true}
    },
    submitHandler: function(form, event) {
      var linkTo = $('button[type="submit"]').attr('data-link');
      if (linkTo) {
        onLinkHandler(form, event, '#accountModal', 'Site Account', linkTo);
      } else {
        onSubmitHandler(form, event, '#accountModal', 'Account');
      }
    }
  }, errorSelectStyle, validationForm));

  $('#companyForm').validate($.extend({}, {
    rules: {
      'company[name]': ruleRequired(100),
      'company[address][address]': ruleMaxLength(100),
      'company[address][city]': ruleMaxLength(50),
      'company[address][zip]': ruleMaxLength(50),
      'company[website]': ruleMaxLength(100),
      'company[notes]': ruleMaxLength(255)
    },
    submitHandler: function(form, event) {
      var linkTo = $('button[type="submit"]').attr('data-link');
      if (linkTo) {
        onLinkHandler(form, event, '#companyModal', 'Company', linkTo);
      } else {
        onSubmitHandler(form, event, '#companyModal', 'Company');
      }
    }
  }, validationForm));

  $('#searchForm').validate($.extend({}, {
    rules: {
      searchPhrase: ruleRequired(100)
    },
    messages: {
      searchPhrase: {
        required: 'Please enter your search request.'
      }
    }
  }, validationForm));

  $('#contactForm').validate($.extend({}, {
    rules: {
      'contact_person[firstName]': ruleRequired(100),
      'contact_person[lastName]': ruleMaxLength(100),
      'contact_person[title]': ruleMaxLength(100),
      'contact_person[email]': ruleEmail(),
      'contact_person[ext]': ruleMaxLength(10),
      'contact_person[notes]': ruleMaxLength(255),
      'contact_person[addresses][0][address]': ruleMaxLength(100),
      'contact_person[addresses][0][city]': ruleMaxLength(50),
      'contact_person[addresses][0][zip]': ruleMaxLength(50),
      'contact_person[addresses][1][address]': ruleMaxLength(100),
      'contact_person[addresses][1][city]': ruleMaxLength(50),
      'contact_person[addresses][1][zip]': ruleMaxLength(50)
    },
    submitHandler: function(form, event) {
      onSubmitHandler(form, event, '#contactModal', 'Contact Person');
    }
  }, validationForm));

  $('#roleForm').validate($.extend({}, {
    submitHandler: function(form, event) {
      if ($('input[type="checkbox"]:checked').length === 0) {
        $('#warningRoleModal').modal('show');
      } else {
        onSubmitHandler(form, event, '#roleModal');
      }
    }
  }, validationForm));

  $('#selectDeviceForm').validate($.extend({}, {
    rules: {
      deviceName: {required: true}
    },
    submitHandler: function() {
      var linkTo = $('select option:selected').attr('data-link');
      $(location).attr('href', linkTo);
    }
  }, errorSelectStyle, validationForm));

  $('#deviceForm').validate($.extend({}, {
    rules: {
      'form_device[device][location]': {maxlength: 30},
      'form_device[device][noteToTester]': {maxlength: 255}
    },
    submitHandler: function(form, event) {
      var capsInput = $('#deviceForm input.app-font--uppercase');
      if (capsInput.length > 0) {
        capsInput.each(function(index, element) {
          var currentElement = $(element);
          currentElement.val(currentElement.val().toUpperCase());
        });
      }
      onSubmitHandler(form, event, '#deviceModal', 'Device');
    }
  }, validationForm));

  $('#serviceForm').validate($.extend({}, {
    rules: {
      'admin_bundle_service[named]': {required: true},
      'admin_bundle_service[lastTested]': {correctDate: true, lessDate: $('#admin_bundle_service_inspectionDue'), lessEqualDate: new Date()},
      'admin_bundle_service[inspectionDue]': {correctDate: true, required: true},
      'admin_bundle_service[comment]': {maxlength: 20}
    },
    submitHandler: function(form, event) {
      onSubmitHandler(form, event, '#serviceModal', 'Service');
    }
  }, errorSelectStyle, validationForm));

  $('#selectAgentForm').validate($.extend({}, {
    rules: {
      agentName: {required: true}
    },
    submitHandler: function() {
      var agentId = $('select[name="agentName"]').val();
      var selector = $('#selectAgentForm button[type="submit"]');
      var departmentId = selector.attr('data-departmentId');
      var link = '/admin/municipality/attach/' + departmentId + '/' + agentId;
      var linkTo = getEnvironment(selector, link);
      $(location).attr('href', linkTo);
    }
  }, errorSelectStyle, validationForm));

  $('#selectChannelForm').validate($.extend({}, {
    rules: {
      channelName: {required: true}
    },
    submitHandler: function() {
      var channelId = $('select[name="channelName"]').val();
      var selector = $('#selectChannelForm button[type="submit"]');
      var departmentId = selector.attr('data-departmentId');
      var agentId = selector.attr('data-agentId');
      var link = agentId ? '/admin/department/channel-for-agent/create/' + departmentId + '/' + channelId + '/' + agentId :
        '/admin/department/channel/create/' + departmentId + '/' + channelId;
      var linkTo = getEnvironment(selector, link);
      $(location).attr('href', linkTo);
    }
  }, errorSelectStyle, validationForm));

  function getEnvironment(selector, link) {
    var environment = selector.attr('data-environment');
    if (environment === 'dev') {
      return '/app_dev.php' + link;
    }
    return link;
  }

  $('#channelForm').validate($.extend({}, errorSelectStyle, validationForm,
   {submitHandler: function(form, event) {
     onSubmitHandler(form, event, '#channelModal', 'Complience Channel');
   }
   }
  ));

  $('[name="admin_bundle_service[inspectionDue]"]').on('change', function() {
    $('[name="admin_bundle_service[lastTested]"]').valid();
  });

  $('.app-validation-digits').each(function() {
    $(this).rules('add', ruleDigits());
  });

  $('.app-validation-email').each(function() {
    $(this).rules('add', ruleEmail(true));
  });

  $('.app-validation-dynamicFields').each(function() {
    $(this).rules('add', ruleMaxLength(30));
  });

  // Channel Address
  $('.app-validation-maxLength100').each(function() {
    $(this).rules('add', $.extend({}, ruleMaxLength(100), ruleRequired()));
  });

  // Channel City
  $('.app-validation-maxLength50').each(function() {
    $(this).rules('add', $.extend({}, ruleMaxLength(50), ruleRequired()));
  });

  $('.app-validation-required').each(function() {
    $(this).rules('add', ruleRequired());
  });

  $('.app-validation-dynamicZip').each(function() {
    $(this).rules('add', $.extend({}, ruleDigits(), ruleMaxLength(50)));
  });

  $('.app-limit-digits').each(function() {
    $(this).rules('add', $.extend({}, ruleDigits(), ruleMaxLength(2), {
      checkTwoNull: true
    }));
  });

  $('.app-validation-phone').each(function() {
    $(this).rules('add', {
      correctNumber: true
    });
  });

  jQuery.validator.addMethod('trueEmail', function(value, element) {
    return this.optional(element) || (/^[a-z0-9]+([-._][a-z0-9]+)*@([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,4}$/
      .test(value)
    );
  }, 'Please enter a valid email address.');

  jQuery.validator.addMethod('notOnlySpace', function(value) {
    return (!(/^\s*$/.test(value)) || value.length === 0);
  }, 'String contains only spaces');

  jQuery.validator.addMethod('correctNumber', function(value) {
    return (value.indexOf('_') === -1) || !(/\d/.test(value));
  }, 'Please enter a full number.');

  jQuery.validator.addMethod('checkTwoNull', function(value) {
    return (value !== '00');
  }, 'Number of Risers/Sections can not be "00".');

  function isTrueDate(value) {
    var date = value.split('/').map(Number);
    var year = date[2];
    var month = date[0] - 1;
    var day = date[1];
    var trueDate = new Date(year, month, day);
    return (trueDate.getFullYear() === year && trueDate.getMonth() === month && trueDate.getDate() === day);
  }

  function isDate(date) {
    return date && date !== 'MM/DD/YYYY' && isTrueDate(date);
  }

  jQuery.validator.addMethod('correctDate', function(value) {
    return isTrueDate(value) || !value || value === 'MM/DD/YYYY';
  }, 'Please enter a valid date.');

  jQuery.validator.addMethod('app-validation-autocomplete', function(value) {
    var arrayText = [];
    $('.selectAutocomplete option').each(function() {
      var optionText = $(this).text();
      arrayText.push(optionText);
    });
    return (arrayText.indexOf(value) > -1 || !value);
  }, 'Please select existing data from autocomplete');

  jQuery.validator.addMethod('lessDate', function(value, element, params) {
    var paramsValue = $(params).val();
    if (isDate(value) && isDate(paramsValue)) {
      return new Date(value) < new Date(paramsValue);
    }
    return true;
  }, 'Last Tested Date must be less than Inspection Due Date.');

  jQuery.validator.addMethod('lessEqualDate', function(value, element, params) {
    if (isDate(value)) {
      return new Date(value) <= params;
    }
    return true;
  }, 'Last Tested Date must be smaller or equal than Current Date.');

  var autoNumericOptionsEuro = {
    digitGroupSeparator: '',
    decimalCharacter: ',',
    currencySymbol: '$',
    currencySymbolPlacement: 'p',
    roundingMethod: 'U',
    allowDecimalPadding: false,
    emptyInputBehavior: 'press',
    minimumValue: 0
  };

  $('.app-validation-phone').mask('(999) 999-9999', {autoclear: false});
  $('.app-validation-date').mask('99/99/9999', {placeholder: 'MM/DD/YYYY', autoclear: false});
/*  $('.app-validation-currency').autoNumeric('init', autoNumericOptionsEuro);*/
})(jQuery);
