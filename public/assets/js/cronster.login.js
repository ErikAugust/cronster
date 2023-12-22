
$(document).ready(function() {
  // Login form submit handler
  $('#login-form').submit(function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form data
    var emailOrUsername = $('#emailOrUsername').val();
    var password = $('#password').val();

    // Create login data object
    var loginData = {
      emailOrUsername: emailOrUsername,
      password: password
    };

    // Send POST request to /login
    $.ajax({
      url: '/api/login',
      method: 'POST',
      data: loginData,
      success: function(response) {
         // Hide error alert
         $('#error-alert').addClass('d-none');

         // Save token to local storage
        const { token } = response;
        localStorage.setItem('token', token);
  
        // Redirect to the dashboard page
        window.location.href = '/dashboard';

      },
      error: function(xhr, status, error) {
        // Show error message to the user
        $('#error-alert').text(xhr.responseJSON.message);
        $('#error-alert').removeClass('d-none');
      }
    });
  });
});
