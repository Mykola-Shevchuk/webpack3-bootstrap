/* global jQuery*/
(function($) {
// Get token id
  var idToken = $('#access_token').attr('value');

  // Get inputs

  var companySelect = $('#admin_bundle_service_companyLastTested');
  var municipalitySelect = $('#account_municipality');
  var companyInput = $('#contractor-autocomplete');
  var municipalityInput = $('#municipality-autocomplete');

  function addAutocomplete(selector, url) {
    return selector.autocomplete({
      open: function() {
        $('.ui-autocomplete').off('menufocus hover mouseover mouseenter');
      },
      source: function(request, response) {
        $.ajax({
          url: url,
          dataType: 'json',
          data: {
            phrase: request.term
          },
          method: 'POST',
          headers: {
            'X-ACCESS-TOKEN': idToken
          },
          success: function(data) {
            response($.map(data, function(item) {
              return item.name;
            }));
          }
        });
      },
      minLength: 1
    }).focus(function() {
      $(this).autocomplete('search');
    });
  }

// Autocomplete
  addAutocomplete($(companyInput), '/api/v1/contractor/search-by-name');
  addAutocomplete($(municipalityInput), '/api/v1/municipality/search-by-name');

  // Add attribute 'selected' for original select
  function addSelect(input, select) {
    input.on('blur', function() {
      var changeValue = $(this).val();
      var arrayOptions = select.find('option');
      arrayOptions.each(function(index, value) {
        $(value).removeAttr('selected');

        if (changeValue === $(value).text()) {
          $(value).attr('selected', true);
        }
      });
    });
  }

  addSelect(companyInput, companySelect);
  addSelect(municipalityInput, municipalitySelect);

  // Get contractor's price
  function getContractorPrice(contractorService, contractorCompany, outputBlock) {
    if (contractorService && contractorCompany) {
      $.ajax({
        method: 'GET',
        headers: {
          'X-ACCESS-TOKEN': idToken
        },
        url: '/api/v1/contractor-service/get-price?service=' + contractorService + '&contractor=' + contractorCompany,
        success: function(result) {
          var resultPrice = result.fixedPrice ? '$' + result.fixedPrice : '-';
          outputBlock.html(resultPrice);
        },
        error: function() {
          outputBlock.html('-');
        }
      });
    } else {
      outputBlock.html('-');
    }
    return;
  }

  function changeContractorPrice() {
    var contractorService = $('#admin_bundle_service_named').val();
    var contractorCompany;
    companySelect.find(':selected').each(function(index, element) {
      if (element.value) {
        contractorCompany = element.value;
      }
    });
    // contractorCompany = companySelect.val();
    var outputBlock = $('#priceContractor');
    getContractorPrice(contractorService, contractorCompany, outputBlock);
  }

  function changeAbfpPrice() {
    var contractorService = $('#admin_bundle_service_named').val();
    var outputBlock = $('#priceABFP');
    var contractorCompany = outputBlock.attr('data-ABFP');
    getContractorPrice(contractorService, contractorCompany, outputBlock);
  }

  function changeServiceFrequency() {
    var contractorService = $('#admin_bundle_service_named');
    var frequencyOutput = $('#serviceFrequency');
    if (contractorService.val()) {
      var serviceFrequence = contractorService.find('option:selected').attr('data-frequency');
      frequencyOutput.html(serviceFrequence);
    } else {
      frequencyOutput.html('-');
    }
  }

  $('#admin_bundle_service_named').on('change', function() {
    changeAbfpPrice();
    changeContractorPrice();
    changeServiceFrequency();
  });

  companyInput.on('blur', function() {
    changeContractorPrice();
  });

  // Set contractor's prices, service frequency, contractor's company on load
  changeAbfpPrice();
  changeContractorPrice();
  changeServiceFrequency();
  var selectedCompany = companySelect.find('option:selected');
  if (selectedCompany.val()) {
    var companyName = selectedCompany.text();
    companyInput.val(companyName);
  }
})(jQuery);
