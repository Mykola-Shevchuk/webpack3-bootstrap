/* jslint browser:true*/
/* global jQuery*/
/* global loadImage*/

(function($) {
  'use strict';
  $('#imgUpload').on('change', function(e) {
    var ext = $(this).val().split('.').pop().toLowerCase();
    var error = $('#uploadError');
    if (this.files[0].size > 10000000) {
      $(this).val('');
      error.addClass('app-submit-error app-device-form__img-error').text('The file is too large. Allowed maximum size is 10Mb');
    } else if ($.inArray(ext, ['png', 'jpg', 'jpeg']) === -1) {
      $(this).val('');
      error.addClass('app-submit-error app-device-form__img-error').text('Please use JPG, JPEG or PNG images only');
    } else {
      var loadingImage = loadImage(e.target.files[0], function(img) {
        $('#imgContent').append(img);
      },
      {maxWidth: 373,
        maxHeight: 263,
        contain: true,
        canvas: true,
        orientation: true
      }
    );
      if (loadingImage) {
        error.removeClass('app-submit-error app-device-form__img-error').text('');
        $('#imgPlace').removeClass('app-device-form__img-place');
        $('#imgTrigger').hide();
        $('#imgDelete').show();
      }
    }
  });

  $('#imgDelete').click(function() {
    var modal = $('#deleteImage');
    modal.modal('show');
    modal.on('shown.bs.modal', function() {
      $('input').blur();
      $('#imgDelButton').click(function() {
        var imgContent = $('#imgContent');
        imgContent.removeClass('app-view--max-size');
        imgContent.empty();
        $('#forceDeleteImage').val('1');
        var input = $('#imgUpload');
        input.val('');
        input.replaceWith(input = input.clone(true));
        $('#imgPlace').addClass('app-device-form__img-place');
        $('#imgDelete').hide();
        $('#imgTrigger').show();
      });
    });
  });

  $('#imgTrigger').on('click', function() {
    $('input[type="file"]').trigger('click');
  });
})(jQuery);
