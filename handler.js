'use strict';
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var dotenv = require('dotenv');

dotenv.load();

module.exports.submit = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hi",
      input: event,
    }),
  };

  var transporter = nodemailer.createTransport(sesTransport({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    rateLimit: 5 // do not send more than 5 messages in a second
    }));


  var mailData = {
    from: 'amartin@epxlabs.com',
    to: 'amartin@epxlabs.com',
    subject: 'TESTING',
    text: 'Plaintext version of the message',
    html: 'HTML version of the message'
    };
  transporter.sendMail(mailData);

  callback(null, response);
};


// Your function handler
module.exports.html = function (event, context, callback) {
  const html = `
<section id="contact" class="section section-no-border mb-none bottom">
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h2 class="mb-sm mt-sm"><strong>Contact</strong> Us</h2>
        <form id="contactForm" action method="POST">
          <div class="row">
            <div class="form-group">
              <div class="col-md-6">
                <label>Your name</label>
                <input type="text" value="" data-msg-required="Please enter your name." maxlength="100" class="form-control" name="name" id="name" required>
              </div>
              <div class="col-md-6">
                <label>Your email address</label>
                <input type="email" value="" data-msg-required="Please enter your email address." data-msg-email="Please enter a valid email address." maxlength="100" class="form-control" name="email" id="email" required>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-group">
              <div class="col-md-12">
                <label>Message</label>
                <textarea maxlength="5000" data-msg-required="Please enter your message." rows="6" class="form-control" name="message" id="message" required></textarea>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <input type="submit" value="Submit" class="btn btn-primary btn-lg mb-xlg" data-loading-text="Loading...">
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
<script>
(function($) {

    'use strict';

    /*
     Contact Form: Basic
     */
    $('#contactForm:not([data-type=advanced])').validate({
  submitHandler: function(form) {

      var $form = $(form),
    $messageSuccess = $('#contactSuccess'),
    $messageError = $('#contactError'),
    $submitButton = $(this.submitButton);

      $submitButton.button('loading');

      // Ajax Submit
      $.ajax({
    type: 'POST',
    url: 'https://stagingsiteapi.epxlabs.com/contact-us',
    data: {
        name: $form.find('#name').val(),
        email: $form.find('#email').val(),
        subject: $form.find('#subject').val(),
        message: $form.find('#message').val()
    },
    dataType: 'json',
    complete: function(data) {

                    if (typeof data.responseJSON === 'object') {
      if (data.responseJSON.success == true) {

          $messageSuccess.removeClass('hidden');
          $messageError.addClass('hidden');

          // Reset Form
          $form.find('.form-control')
        .val('')
        .blur()
        .parent()
        .removeClass('has-success')
        .removeClass('has-error')
        .find('label.error')
        .remove();

          if (($messageSuccess.offset().top - 80) < $(window).scrollTop()) {
        $('html, body').animate({
            scrollTop: $messageSuccess.offset().top - 80
        }, 300);
          }

          $submitButton.button('reset');

          return;

      }
        }

        $messageError.removeClass('hidden');
        $messageSuccess.addClass('hidden');

        if (($messageError.offset().top - 80) < $(window).scrollTop()) {
      $('html, body').animate({
          scrollTop: $messageError.offset().top - 80
      }, 300);
        }

        $form.find('.has-success')
      .removeClass('has-success');

        $submitButton.button('reset');

    }
      });
  }
    });

    /*
     Contact Form: Advanced
     */
    $('#contactFormAdvanced, #contactForm[data-type=advanced]').validate({
  onkeyup: false,
  onclick: false,
  onfocusout: false,
  rules: {
      'captcha': {
    captcha: true
      },
      'checkboxes[]': {
    required: true
      },
      'radios': {
    required: true
      }
  },
  errorPlacement: function(error, element) {
      if (element.attr('type') == 'radio' || element.attr('type') == 'checkbox') {
    error.appendTo(element.parent().parent());
      } else {
    error.insertAfter(element);
      }
  }
    });

}).apply(this, [jQuery]);
</script>`;

  const response = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: html,
  };

  // callback will send HTML back
  callback(null, response);
};