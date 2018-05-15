$(function() {
  const fieldTypes = {
    'text' : {
      validation : (text) => {
        const expr = /\'|\"/gm;

        return !text.match(expr)
      },
      errorText  : 'Symbols \' and \" are prohibited!'
    },
    'date'  : {
      validation : (date) => {
        const regexDate = /^\d{1,2}\-\d{1,2}\-\d{4}$/;

        if(!regexDate.test(date)) return false;

        let parts   = date.split("-");
        let day     = parseInt(parts[0], 10);
        let month   = parseInt(parts[1], 10);
        let year    = parseInt(parts[2], 10);

        if (new Date(parts[2], parts[1] - 1, parts[0]) > new Date()) return false;
        if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;

        let monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

        if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
            monthLength[1] = 29;
        }

        return day > 0 && day <= monthLength[month - 1];
      },
      errorText  : 'Enter valid date in format dd-mm-yyyy!'
    },
    'email'     : {
      validation : (text) => {
        var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/; 
        
        return expr.test(text);
      },
      errorText  : 'Enter valid email!'
    },
    'password'  : {
      validation : (password) => {
        return password.length > 7;
      },
      errorText  : 'Password must contain at least 8 symbols!'
    },
    'textarea'     : {
      label      : 'Notes',
      required   : false,
      type       : 'textarea'
    }
  };

  const $formFields = $('.js-form-field');

  $('.form-field--birthday').datepicker({ dateFormat: 'dd-mm-yy' });
  $( "#modalSuccess" ).dialog({ autoOpen: false });

  const validate = ($fields) => {
    let isValid = true;
    $('.js-error-text').hide();
    $fields.removeClass('form-field--invalid');

    $fields.each(function() {
      const fieldText = $(this).val();
      const fieldType = $(this).data('type');
      
      if ($(this).data('required') && !fieldText) {
        $(this).addClass('form-field--invalid');
        $(this).next('.js-error-text').text(`${$(this).data('name')} is required`).show();
        isValid = false;
      } else if (fieldTypes[fieldType] && fieldTypes[fieldType].hasOwnProperty('validation') && !fieldTypes[fieldType].validation(fieldText)) {
        $(this).addClass('form-field--invalid');
        $(this).next('.js-error-text').text(`${fieldTypes[fieldType].errorText}`).show();
        isValid = false;
      }
    });

    if (isValid) {
      $( "#modalSuccess" ).dialog( "open" );
    }
  };

  $('.js-form-submit').on('click', function(e) {
    e.preventDefault(); 
    validate($formFields);
  });

  $formFields.on('focus', function(e) {
    $(this).next('.js-error-text').hide();
    $(this).removeClass('form-field--invalid');
  })
});

