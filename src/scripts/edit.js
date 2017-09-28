/* jslint browser:true*/
/* global jQuery*/
(function($) {
  'use strict';

  var prevAccount = fillAccount();
  var prevContact = fillContact();
  var prevCompany = fillCompany();
  var prevDevice = fillDevice();
  var prevService = fillService();
  var prevDeviceDynamic = viewDynamic();
  var dynamicFlag = true;
  var changeFlag = true;
  var prevImage = checkImgStatus();
  var imgStatusFlag = true;

  function fillAccount() {
    return {
      name: $('input[name="account[name]"]').val(),
      accountType: $('input[name="account[type]"]:checked').val(),
      clientType: $('#account_clientType option:selected').text(),
      address: $('input[name="account[address][address]"]').val(),
      city: $('input[name="account[address][city]"]').val(),
      state: $('#account_address_state option:selected').text(),
      zip: $('input[name="account[address][zip]"]').val(),
      municipality: $('input[name="account[municipalityAutocomplete]"]').val(),
      notes: $('textarea[name="account[notes]"]').val()
    };
  }

  function fillCompany() {
    return {
      name: $('input[name="company[name]"]').val(),
      address: $('input[name="company[address][address]"]').val(),
      city: $('input[name="company[address][city]"]').val(),
      state: $('#company_address_state option:selected').text(),
      zip: $('input[name="company[address][zip]"]').val(),
      website: $('input[name="company[website]"]').val(),
      notes: $('textarea[name="company[notes]"]').val()
    };
  }

  function fillContact() {
    return {
      name: $('input[name="contact_person[firstName]"]').val(),
      lastName: $('input[name="contact_person[lastName]"]').val(),
      title: $('input[name="contact_person[title]"]').val(),
      email: $('input[name="contact_person[email]"]').val(),
      phone: trueNumber($('input[name="contact_person[phone]"]').val()),
      ext: $('input[name="contact_person[ext]"]').val(),
      cell: trueNumber($('input[name="contact_person[cell]"]').val()),
      fax: trueNumber($('input[name="contact_person[fax]"]').val()),
      cod: $('input[name="contact_person[cod]"]').is(':checked'),
      notes: $('textarea[name="contact_person[notes]"]').val(),
      mailAddress: $('input[name="contact_person[addresses][1][address]"]').val(),
      mailCity: $('input[name="contact_person[addresses][1][city]"]').val(),
      mailState: $('#contact_person_addresses_1_state option:selected').text(),
      mailZip: $('input[name="contact_person[addresses][1][zip]"]').val(),
      billAddress: $('input[name="contact_person[addresses][0][address]"]').val(),
      billCity: $('input[name="contact_person[addresses][0][city]"]').val(),
      billState: $('#contact_person_addresses_0_state option:selected').text(),
      billZip: $('input[name="contact_person[addresses][0][zip]"]').val()
    };
  }

  function fillDevice() {
    return {
      location: $('input[name="form_device[device][location]"]').val(),
      status: $('select[name="form_device[device][status]"]').val(),
      comments: $('textarea[name="form_device[device][comments]"]').val(),
      note: $('textarea[name="form_device[device][noteToTester]"]').val()
    };
  }

  function fillService() {
    return {
      serviceName: $('select[name="admin_bundle_service[named]"]').val(),
      fixedFee: truePrice($('input[name="admin_bundle_service[fixedPrice]"]').val()),
      lastDate: $('input[name="admin_bundle_service[lastTested]"]').val(),
      dueDate: $('input[name="admin_bundle_service[inspectionDue]"]').val(),
      lastCompany: $('select[name="admin_bundle_service[companyLastTested]"]').val(),
      comment: $('textarea[name="admin_bundle_service[comment]"]').val(),
      device: $('input[name="admin_bundle_service[device]"]:checked').val()
    };
  }

  $('#imgDelButton').on('click', function() {
    imgStatusFlag = false;
  });

  function checkImgStatus() {
    return $('#imgContent').children().length > 0;
  }

  function getValueElements(selects, inputs) {
    var oldSelectsArr = $(selects);
    var oldInputsArr = $(inputs);

    var mergeArr = $.merge(oldSelectsArr, oldInputsArr);
    var resultArr = [];

    mergeArr.each(function(index, value) {
      if (value.innerText) {
        resultArr.push(value.innerText);
      } else {
        resultArr.push(value.value);
      }
    });

    return resultArr;
  }

  function viewDynamic() {
    return getValueElements('select.dynamic-form-element option:selected', 'input.dynamic-form-element');
  }

  function compareObjects(obj1, obj2) {
    Object.keys(obj1).forEach(function(key) {
      if (obj1[key] !== obj2[key]) {
        changeFlag = false;
        return changeFlag;
      }
    });
  }

  function compareDynamic(prev, current) {
    dynamicFlag = prev.toString() === current.toString();
    return dynamicFlag;
  }

  function compareImage(prev, result) {
    return prev === result;
  }

  function updateHandler(event, obj1, obj2) {
    compareObjects(obj1, obj2);

    if (changeFlag) {
      event.preventDefault();
      $('#updeteModal').modal('show');
    }
    changeFlag = true;
  }

  function trueNumber(str) {
    if (str) {
      return str.replace(/[()-/ /]/g, '');
    }
  }

  function truePrice(str) {
    if (str) {
      return str.replace(/[$]/g, '');
    }
  }

  $('#account_update').click(function(event) {
    var resultAccount = fillAccount();
    updateHandler(event, prevAccount, resultAccount);
  });

  $('#contact_update').click(function(event) {
    var resultContact = fillContact();
    updateHandler(event, prevContact, resultContact);
  });

  $('#company_update').click(function(event) {
    var resultCompany = fillCompany();
    updateHandler(event, prevCompany, resultCompany);
  });

  $('#device_update').click(function(event) {
    var resultDevice = fillDevice();
    var resultDynamic = viewDynamic();
    var resultImage = checkImgStatus();
    compareObjects(prevDevice, resultDevice);
    compareDynamic(prevDeviceDynamic, resultDynamic);
    var imgCheck = compareImage(prevImage, resultImage);
    if (changeFlag && dynamicFlag && imgCheck && imgStatusFlag) {
      event.preventDefault();
      $('#updeteModal').modal('show');
    }
    dynamicFlag = true;
    changeFlag = true;
  });

  $('#service_update').click(function(event) {
    var resultService = fillService();
    updateHandler(event, prevService, resultService);
  });
})(jQuery);

